"""Runtime synchronization engine for Ambilight Sync."""

from __future__ import annotations

import asyncio
from dataclasses import dataclass
import logging
from time import monotonic
from typing import Any

from haphilipsjs import GeneralFailure, PhilipsTV
from homeassistant.components.light import (
    ATTR_BRIGHTNESS,
    ATTR_RGB_COLOR,
    ATTR_TRANSITION,
    DOMAIN as LIGHT_DOMAIN,
)
from homeassistant.config_entries import ConfigEntry
from homeassistant.const import (
    ATTR_ENTITY_ID,
    STATE_OFF,
    STATE_ON,
    SERVICE_TURN_OFF,
    SERVICE_TURN_ON,
)
from homeassistant.core import HomeAssistant

from .color import (
    RGB,
    WeightedSamples,
    adjust_saturation,
    color_distance,
    color_from_samples,
    extract_zone_samples,
    normalized_rgb,
    smooth_rgb,
)
from .config_model import active_preset, effective_settings, normalize_profile_config
from .const import (
    BLACK_CUTOFF,
    CONF_BLACK_HOLD,
    CONF_BRIGHTNESS,
    CONF_COLOR_MODE,
    CONF_CORNER_INFLUENCE,
    CONF_FADE_TO_BLACK,
    CONF_MINIMUM_BRIGHTNESS,
    CONF_POLL_RATE,
    CONF_RESTORE_ON_STOP,
    CONF_SATURATION,
    CONF_SMOOTHING,
    CONF_SOURCE,
    CONF_THRESHOLD,
    CONF_TRANSITION,
    CONF_UPDATE_RATE,
    MAX_UPDATE_RATE,
    MIN_UPDATE_RATE,
    SOURCE_MEASURED,
    ZONE_ALL,
)

_LOGGER = logging.getLogger(__name__)


@dataclass(slots=True)
class LightSnapshot:
    state: str
    attributes: dict[str, Any]


@dataclass(slots=True, frozen=True)
class LightCommand:
    """Latest desired state for one light."""

    on: bool
    rgb: RGB = (0, 0, 0)
    brightness: int = 0
    transition: float = 0.0


class AmbilightSyncManager:
    """Synchronize Ambilight to configured lights using latest-wins workers.

    The stable one-item-buffer transport model is preserved: workers are keyed
    by light, and stale commands are replaced rather than queued.  TV polling
    and per-light output cadence are independent, so a fast TV poll can feed
    slower lights without increasing command pressure on the devices.
    """

    def __init__(
        self,
        hass: HomeAssistant,
        *,
        entry: ConfigEntry,
        host: str,
        api_version: int,
        system: dict[str, Any],
        username: str | None,
        password: str | None,
        profile_config: dict[str, Any],
    ) -> None:
        self.hass = hass
        self.entry = entry
        self.entry_id = entry.entry_id
        self.host = host
        self.system = system

        secured_transport = (
            system.get("featuring", {})
            .get("systemfeatures", {})
            .get("secured_transport")
            in (True, "true")
        )
        self.tv = PhilipsTV(
            host,
            api_version=api_version,
            secured_transport=secured_transport,
            username=username,
            password=password,
            system=system,
        )

        self._profile_config = normalize_profile_config(profile_config)
        self.active_preset_id = ""
        self.active_preset_name = ""
        self.global_settings: dict[str, Any] = {}
        self.light_configs: dict[str, dict[str, Any]] = {}
        self._load_active_preset()

        self._running = False
        self._task: asyncio.Task[None] | None = None
        self._worker_tasks: dict[str, asyncio.Task[None]] = {}
        self._light_events: dict[str, asyncio.Event] = {}
        self._pending: dict[str, LightCommand] = {}
        self._snapshot: dict[str, LightSnapshot] = {}
        self._smoothed: dict[str, RGB] = {}
        self._last_sent: dict[str, tuple[bool, RGB, int]] = {}
        self._last_output_queued_at: dict[str, float] = {}
        self._last_nonblack_rgb: dict[str, RGB] = {}
        self._black_tasks: dict[str, asyncio.Task[None]] = {}
        self._black_faded: set[str] = set()
        self._previews: dict[str, dict[str, Any]] = {}
        self._last_error: str | None = None
        self._last_error_log_at = 0.0
        self._tv_lock = asyncio.Lock()

    def _load_active_preset(self) -> None:
        preset_id, preset = active_preset(self._profile_config)
        self.active_preset_id = preset_id
        self.active_preset_name = str(preset.get("name") or preset_id)
        self.global_settings = dict(preset.get("global", {}))
        self.light_configs = {
            entity_id: {
                "sources": [dict(source) for source in config.get("sources", [])],
                "overrides": dict(config.get("overrides", {})),
            }
            for entity_id, config in dict(preset.get("lights", {})).items()
        }

    @property
    def is_running(self) -> bool:
        return self._running

    @property
    def last_error(self) -> str | None:
        return self._last_error

    @property
    def light_count(self) -> int:
        return len(self.light_configs)

    @property
    def source(self) -> str:
        return str(self.global_settings.get(CONF_SOURCE, "processed"))

    @property
    def poll_rate(self) -> float:
        """How often the TV Ambilight endpoint is polled."""
        return float(self.global_settings.get(CONF_POLL_RATE, self.global_settings.get(CONF_UPDATE_RATE, 1.0)))

    @property
    def update_rate(self) -> float:
        """Default maximum command rate for lights."""
        return float(self.global_settings.get(CONF_UPDATE_RATE, 1.0))

    @property
    def restore_on_stop(self) -> bool:
        return bool(self.global_settings.get(CONF_RESTORE_ON_STOP, True))

    @property
    def previews(self) -> dict[str, dict[str, Any]]:
        return {entity_id: dict(value) for entity_id, value in self._previews.items()}

    def _settings_for_light(self, entity_id: str) -> dict[str, Any]:
        config = self.light_configs.get(entity_id, {})
        return effective_settings(self.global_settings, config.get("overrides", {}))

    async def async_start(self) -> None:
        if self._running:
            return
        if not self._all_lights():
            self._last_error = "No lights configured. Open the Ambilight Sync sidebar panel."
            return

        self._snapshot_lights()
        self._reset_runtime_color_state()
        self._last_error = None
        self._running = True

        for entity_id in self._all_lights():
            event = asyncio.Event()
            self._light_events[entity_id] = event
            self._worker_tasks[entity_id] = self.entry.async_create_background_task(
                self.hass,
                self._light_worker(entity_id, event),
                f"{self.entry_id} Ambilight light {entity_id}",
            )

        self._task = self.entry.async_create_background_task(
            self.hass, self._run_loop(), f"{self.entry_id} Ambilight sync"
        )

    async def async_stop(self, *, restore: bool | None = None) -> None:
        if (
            not self._running
            and self._task is None
            and not self._worker_tasks
            and not self._black_tasks
        ):
            return
        self._running = False

        tasks: list[asyncio.Task[None]] = []
        if self._task is not None:
            tasks.append(self._task)
            self._task = None
        tasks.extend(self._worker_tasks.values())
        tasks.extend(self._black_tasks.values())
        self._worker_tasks.clear()
        self._black_tasks.clear()

        for task in tasks:
            task.cancel()
        if tasks:
            await asyncio.gather(*tasks, return_exceptions=True)

        self._light_events.clear()
        self._pending.clear()
        self._black_faded.clear()

        should_restore = self.restore_on_stop if restore is None else restore
        if should_restore:
            await self._restore_lights()
        self._snapshot.clear()
        self._reset_runtime_color_state(clear_previews=False)

    async def async_shutdown(self) -> None:
        await self.async_stop(restore=False)
        await self.tv.session.aclose()

    async def async_apply_profile_config(self, profile_config: dict[str, Any]) -> None:
        """Apply profile configuration while preserving the stable transport behavior."""
        normalized = normalize_profile_config(profile_config)
        old_preset_id, old_preset = active_preset(self._profile_config)
        new_preset_id, new_preset = active_preset(normalized)

        # Saving an inactive preset should not disturb a running active preset.
        if (
            old_preset_id == new_preset_id
            and old_preset.get("global") == new_preset.get("global")
            and old_preset.get("lights") == new_preset.get("lights")
        ):
            self._profile_config = normalized
            self._load_active_preset()
            return

        old_lights = set(self.light_configs)
        new_lights = set(dict(new_preset.get("lights", {})))
        was_running = self._running

        # Worker membership only needs to change if the actual light set changes.
        # In that uncommon case restore/restart is deliberately conservative.
        if was_running and old_lights != new_lights:
            await self.async_stop(restore=True)

        self._profile_config = normalized
        self._load_active_preset()

        for task in list(self._black_tasks.values()):
            task.cancel()
        self._black_tasks.clear()
        self._pending.clear()
        self._smoothed.clear()
        self._last_sent.clear()
        self._last_output_queued_at.clear()
        self._last_nonblack_rgb.clear()
        self._black_faded.clear()
        self._previews = {
            entity_id: preview
            for entity_id, preview in self._previews.items()
            if entity_id in self.light_configs
        }

        if was_running and old_lights != new_lights and new_lights:
            await self.async_start()
        elif was_running and not new_lights:
            self._last_error = "No lights configured in the active preset."

        _LOGGER.debug(
            "Applied preset %s (%s), lights=%d",
            new_preset_id,
            self.active_preset_name,
            len(new_lights),
        )

    def _reset_runtime_color_state(self, *, clear_previews: bool = True) -> None:
        self._smoothed.clear()
        self._last_sent.clear()
        self._last_output_queued_at.clear()
        self._last_nonblack_rgb.clear()
        self._pending.clear()
        self._black_faded.clear()
        if clear_previews:
            self._previews.clear()

    def _all_lights(self) -> list[str]:
        return sorted(self.light_configs)

    def _snapshot_lights(self) -> None:
        self._snapshot = {}
        for entity_id in self._all_lights():
            state = self.hass.states.get(entity_id)
            if state is None:
                continue
            self._snapshot[entity_id] = LightSnapshot(state.state, dict(state.attributes))

    async def _restore_lights(self) -> None:
        calls = []
        for entity_id, snapshot in self._snapshot.items():
            if snapshot.state == STATE_OFF:
                calls.append(
                    self.hass.services.async_call(
                        LIGHT_DOMAIN,
                        SERVICE_TURN_OFF,
                        {ATTR_ENTITY_ID: entity_id},
                        blocking=True,
                    )
                )
                continue
            if snapshot.state != STATE_ON:
                continue

            attrs = snapshot.attributes
            data: dict[str, Any] = {ATTR_ENTITY_ID: entity_id}
            if ATTR_BRIGHTNESS in attrs and attrs[ATTR_BRIGHTNESS] is not None:
                data[ATTR_BRIGHTNESS] = attrs[ATTR_BRIGHTNESS]

            if attrs.get("rgb_color") is not None:
                data["rgb_color"] = attrs["rgb_color"]
            elif attrs.get("hs_color") is not None:
                data["hs_color"] = attrs["hs_color"]
            elif attrs.get("xy_color") is not None:
                data["xy_color"] = attrs["xy_color"]
            elif attrs.get("color_temp_kelvin") is not None:
                data["color_temp_kelvin"] = attrs["color_temp_kelvin"]

            calls.append(
                self.hass.services.async_call(
                    LIGHT_DOMAIN, SERVICE_TURN_ON, data, blocking=True
                )
            )

        if calls:
            await asyncio.gather(*calls, return_exceptions=True)

    async def _run_loop(self) -> None:
        while self._running:
            started = monotonic()
            try:
                payload = await self._fetch_payload()
                self._queue_colors(payload)
                self._last_error = None
            except asyncio.CancelledError:
                raise
            except (GeneralFailure, RuntimeError, OSError, ValueError) as exc:
                self._last_error = str(exc)
                self._log_runtime_error(exc)
            except Exception as exc:  # Defensive: keep long-running sync alive.
                self._last_error = str(exc)
                now = monotonic()
                if now - self._last_error_log_at >= 30:
                    _LOGGER.exception("Unexpected Ambilight sync error")
                    self._last_error_log_at = now

            poll_rate = max(MIN_UPDATE_RATE, min(MAX_UPDATE_RATE, self.poll_rate))
            period = 1.0 / poll_rate
            elapsed = monotonic() - started
            await asyncio.sleep(max(0.0, period - elapsed))

    def _log_runtime_error(self, exc: Exception) -> None:
        now = monotonic()
        if now - self._last_error_log_at >= 30:
            _LOGGER.warning("Ambilight sync error: %s", exc)
            self._last_error_log_at = now

    async def _fetch_payload(self) -> Any:
        """Read one raw Ambilight frame; light-specific zones are derived locally."""
        async with self._tv_lock:
            if self.source == SOURCE_MEASURED:
                return await self.tv.getAmbilightMeasured()
            return await self.tv.getAmbilightProcessed()

    @staticmethod
    def _mix_rgb(colors: list[tuple[RGB, float]]) -> RGB | None:
        total = sum(max(0.0, weight) for _, weight in colors)
        if total <= 0:
            return None
        return tuple(
            max(
                0,
                min(
                    255,
                    round(
                        sum(rgb[index] * max(0.0, weight) for rgb, weight in colors)
                        / total
                    ),
                ),
            )
            for index in range(3)
        )  # type: ignore[return-value]

    def _selected_color(
        self,
        entity_id: str,
        payload: Any,
        settings: dict[str, Any],
        samples_cache: dict[float, dict[str, WeightedSamples]],
    ) -> RGB | None:
        config = self.light_configs.get(entity_id)
        if not config:
            return None

        corner = float(settings.get(CONF_CORNER_INFLUENCE, 0.0))
        samples_by_zone = samples_cache.get(corner)
        if samples_by_zone is None:
            samples_by_zone = extract_zone_samples(payload, corner)
            samples_cache[corner] = samples_by_zone
        if not samples_by_zone:
            raise RuntimeError("TV returned no Ambilight color data")

        mode = str(settings[CONF_COLOR_MODE])
        fallback = samples_by_zone.get(ZONE_ALL)
        source_colors: list[tuple[RGB, float]] = []
        debug_sources: list[str] = []
        for source in config.get("sources", []):
            zone = str(source.get("zone", ZONE_ALL))
            weight = float(source.get("weight", 0.0))
            if weight <= 0:
                continue
            samples = samples_by_zone.get(zone, fallback)
            if not samples:
                continue
            color = color_from_samples(samples, mode)
            if color is None:
                continue
            source_colors.append((color, weight))
            debug_sources.append(f"{zone}:{weight:g}%={color}")

        selected = self._mix_rgb(source_colors)
        if selected is not None:
            _LOGGER.debug(
                "Light %s color mode=%s mixer=[%s] selected=%s",
                entity_id,
                mode,
                ", ".join(debug_sources),
                selected,
            )
        return selected

    def _light_update_due(
        self, entity_id: str, settings: dict[str, Any], now: float
    ) -> bool:
        """Return whether this light may receive another normal color command."""
        rate = max(
            MIN_UPDATE_RATE,
            min(MAX_UPDATE_RATE, float(settings.get(CONF_UPDATE_RATE, self.update_rate))),
        )
        last = self._last_output_queued_at.get(entity_id)
        return last is None or now - last >= (1.0 / rate)

    def _queue_colors(self, payload: Any) -> None:
        samples_cache: dict[float, dict[str, WeightedSamples]] = {}
        now = monotonic()

        for entity_id in self._all_lights():
            settings = self._settings_for_light(entity_id)
            selected = self._selected_color(entity_id, payload, settings, samples_cache)
            if selected is None:
                continue

            # Black detection runs at the TV polling cadence so a hold starts
            # promptly even when this particular light is intentionally slow.
            black_probe = adjust_saturation(selected, float(settings[CONF_SATURATION]))
            if max(black_probe) <= BLACK_CUTOFF:
                self._previews[entity_id] = {
                    "input_rgb": list(selected),
                    "output_rgb": [0, 0, 0],
                    "brightness": 0,
                    "state": "black",
                }
                self._handle_black(entity_id, settings)
                continue

            returning_from_black = (
                entity_id in self._black_faded or entity_id in self._black_tasks
            )
            self._cancel_black_hold(entity_id, reason="color returned")
            self._black_faded.discard(entity_id)

            # Normal color updates are rate-limited per light.  If the TV is
            # polled faster than a light's rate, skipped polls are simply
            # discarded; the next due command uses the freshest TV frame.
            if not returning_from_black and not self._light_update_due(
                entity_id, settings, now
            ):
                continue

            smoothed = smooth_rgb(
                self._smoothed.get(entity_id), selected, float(settings[CONF_SMOOTHING])
            )
            self._smoothed[entity_id] = smoothed
            adjusted = adjust_saturation(smoothed, float(settings[CONF_SATURATION]))
            peak = max(adjusted)
            if peak <= BLACK_CUTOFF:
                self._previews[entity_id] = {
                    "input_rgb": list(selected),
                    "output_rgb": [0, 0, 0],
                    "brightness": 0,
                    "state": "black",
                }
                self._handle_black(entity_id, settings)
                continue

            brightness_pct = float(settings[CONF_BRIGHTNESS])
            raw_brightness = round(peak * brightness_pct / 100.0)
            floor_percent = min(
                float(settings[CONF_MINIMUM_BRIGHTNESS]), brightness_pct
            )
            floor_brightness = round(255 * floor_percent / 100.0)
            brightness = max(1, min(255, max(raw_brightness, floor_brightness)))
            rgb = normalized_rgb(adjusted)
            self._last_nonblack_rgb[entity_id] = rgb
            self._previews[entity_id] = {
                "input_rgb": list(selected),
                "output_rgb": list(rgb),
                "brightness": brightness,
                "state": "active",
            }

            _LOGGER.debug(
                "Light %s brightness raw=%d minimum=%.1f%% final=%d rgb=%s",
                entity_id,
                raw_brightness,
                floor_percent,
                brightness,
                rgb,
            )

            previous = self._last_sent.get(entity_id)
            threshold = float(settings[CONF_THRESHOLD])
            if previous is not None and previous[0]:
                if (
                    color_distance(previous[1], rgb) < threshold
                    and abs(previous[2] - brightness) < max(2.0, threshold / 2.0)
                ):
                    continue

            self._last_sent[entity_id] = (True, rgb, brightness)
            self._set_pending(
                entity_id,
                LightCommand(
                    on=True,
                    rgb=rgb,
                    brightness=brightness,
                    transition=float(settings[CONF_TRANSITION]),
                ),
            )

    def _handle_black(self, entity_id: str, settings: dict[str, Any]) -> None:
        """Start a cancellable per-light hold before fading a dark result."""
        preview = self._previews.get(entity_id, {})
        preview["state"] = "holding"
        self._previews[entity_id] = preview

        if entity_id in self._black_faded or entity_id in self._black_tasks:
            return

        hold_ms = float(settings[CONF_BLACK_HOLD])
        hold_seconds = max(0.0, hold_ms / 1000.0)
        if hold_seconds <= 0:
            _LOGGER.debug("Light %s black hold skipped (0 ms)", entity_id)
            self._commit_black(entity_id)
            return

        _LOGGER.debug("Light %s entered black hold for %.0f ms", entity_id, hold_ms)
        task = self.entry.async_create_background_task(
            self.hass,
            self._black_hold_then_fade(entity_id, hold_seconds),
            f"{self.entry_id} Ambilight black hold {entity_id}",
        )
        self._black_tasks[entity_id] = task
        task.add_done_callback(
            lambda completed, light=entity_id: self._black_task_done(light, completed)
        )

    async def _black_hold_then_fade(self, entity_id: str, hold_seconds: float) -> None:
        try:
            await asyncio.sleep(hold_seconds)
            if not self._running or entity_id not in self.light_configs:
                return

            try:
                payload = await self._fetch_payload()
                settings = self._settings_for_light(entity_id)
                selected = self._selected_color(entity_id, payload, settings, {})
            except (GeneralFailure, RuntimeError, OSError, ValueError) as exc:
                _LOGGER.debug(
                    "Light %s black hold confirmation failed (%s); keeping current state",
                    entity_id,
                    exc,
                )
                return

            if selected is not None:
                adjusted = adjust_saturation(selected, float(settings[CONF_SATURATION]))
                if max(adjusted) > BLACK_CUTOFF:
                    _LOGGER.debug(
                        "Light %s black hold elapsed but color returned; fade cancelled",
                        entity_id,
                    )
                    return

            _LOGGER.debug("Light %s black hold elapsed and black confirmed", entity_id)
            self._commit_black(entity_id)
        except asyncio.CancelledError:
            raise

    def _black_task_done(self, entity_id: str, task: asyncio.Task[None]) -> None:
        if self._black_tasks.get(entity_id) is task:
            self._black_tasks.pop(entity_id, None)

    def _cancel_black_hold(self, entity_id: str, *, reason: str) -> None:
        task = self._black_tasks.pop(entity_id, None)
        if task is not None:
            task.cancel()
            _LOGGER.debug("Light %s black hold cancelled: %s", entity_id, reason)

    def _commit_black(self, entity_id: str) -> None:
        """Fade one light to its configured floor, or off when the floor is zero."""
        if entity_id not in self.light_configs:
            return
        settings = self._settings_for_light(entity_id)
        self._black_faded.add(entity_id)
        previous = self._last_sent.get(entity_id)
        floor_percent = min(
            float(settings[CONF_MINIMUM_BRIGHTNESS]), float(settings[CONF_BRIGHTNESS])
        )
        fade = max(0.0, float(settings[CONF_FADE_TO_BLACK]))

        if floor_percent > 0:
            rgb = self._last_nonblack_rgb.get(entity_id)
            if rgb is None and previous is not None and previous[0]:
                rgb = previous[1]
            if rgb is None:
                _LOGGER.debug(
                    "Light %s black floor %.1f%% has no prior hue; keeping current state",
                    entity_id,
                    floor_percent,
                )
                return

            brightness = max(1, min(255, round(255 * floor_percent / 100.0)))
            if previous == (True, rgb, brightness):
                return
            self._last_sent[entity_id] = (True, rgb, brightness)
            self._previews[entity_id] = {
                "input_rgb": list(rgb),
                "output_rgb": list(rgb),
                "brightness": brightness,
                "state": "floor",
            }
            _LOGGER.debug(
                "Light %s black fade -> minimum %.1f%% (%d), rgb=%s, transition=%.2fs",
                entity_id,
                floor_percent,
                brightness,
                rgb,
                fade,
            )
            self._set_pending(
                entity_id,
                LightCommand(True, rgb=rgb, brightness=brightness, transition=fade),
            )
            return

        if previous is not None and previous[0] is False:
            return
        self._last_sent[entity_id] = (False, (0, 0, 0), 0)
        self._previews[entity_id] = {
            "input_rgb": [0, 0, 0],
            "output_rgb": [0, 0, 0],
            "brightness": 0,
            "state": "off",
        }
        _LOGGER.debug("Light %s black fade -> off, transition=%.2fs", entity_id, fade)
        self._set_pending(entity_id, LightCommand(False, transition=fade))

    def _set_pending(self, entity_id: str, command: LightCommand) -> None:
        """Replace any stale command for a light with the newest frame."""
        self._last_output_queued_at[entity_id] = monotonic()
        self._pending[entity_id] = command
        if event := self._light_events.get(entity_id):
            event.set()

    async def _light_worker(self, entity_id: str, event: asyncio.Event) -> None:
        while self._running:
            await event.wait()
            event.clear()
            command = self._pending.pop(entity_id, None)
            if command is None:
                continue

            try:
                if not command.on:
                    data: dict[str, Any] = {ATTR_ENTITY_ID: entity_id}
                    if command.transition > 0:
                        data[ATTR_TRANSITION] = command.transition
                    _LOGGER.debug("light.turn_off light=%s data=%s", entity_id, data)
                    await self.hass.services.async_call(
                        LIGHT_DOMAIN, SERVICE_TURN_OFF, data, blocking=True
                    )
                    continue

                data = {
                    ATTR_ENTITY_ID: entity_id,
                    ATTR_RGB_COLOR: command.rgb,
                    ATTR_BRIGHTNESS: command.brightness,
                }
                if command.transition > 0:
                    data[ATTR_TRANSITION] = command.transition

                _LOGGER.debug("light.turn_on light=%s data=%s", entity_id, data)
                await self.hass.services.async_call(
                    LIGHT_DOMAIN, SERVICE_TURN_ON, data, blocking=True
                )
            except asyncio.CancelledError:
                raise
            except Exception as exc:  # Keep one bad light from killing sync.
                self._last_error = str(exc)
                now = monotonic()
                if now - self._last_error_log_at >= 30:
                    _LOGGER.warning("Light update failed for %s: %s", entity_id, exc)
                    self._last_error_log_at = now
