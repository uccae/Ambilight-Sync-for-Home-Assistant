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
from .const import (
    BLACK_CUTOFF,
    COLOR_MODE_AVERAGE,
    CONF_BLACK_HOLD,
    CONF_BRIGHTNESS,
    CONF_COLOR_MODE,
    CONF_CORNER_INFLUENCE,
    CONF_FADE_TO_BLACK,
    CONF_MINIMUM_BRIGHTNESS,
    CONF_RESTORE_ON_STOP,
    CONF_SATURATION,
    CONF_SMOOTHING,
    CONF_SOURCE,
    CONF_THRESHOLD,
    CONF_TRANSITION,
    CONF_UPDATE_RATE,
    DEFAULT_BLACK_HOLD,
    DEFAULT_BRIGHTNESS,
    DEFAULT_COLOR_MODE,
    DEFAULT_CORNER_INFLUENCE,
    DEFAULT_FADE_TO_BLACK,
    DEFAULT_MINIMUM_BRIGHTNESS,
    DEFAULT_RESTORE_ON_STOP,
    DEFAULT_SATURATION,
    DEFAULT_SMOOTHING,
    DEFAULT_SOURCE,
    DEFAULT_THRESHOLD,
    DEFAULT_TRANSITION,
    DEFAULT_UPDATE_RATE,
    MAX_UPDATE_RATE,
    SOURCE_MEASURED,
    ZONE_ALL,
)

_LOGGER = logging.getLogger(__name__)


@dataclass(slots=True)
class LightSnapshot:
    state: str
    attributes: dict[str, Any]


@dataclass(slots=True, frozen=True)
class ZoneCommand:
    """Latest desired state for a zone."""

    on: bool
    rgb: RGB = (0, 0, 0)
    brightness: int = 0
    # None means use the normal device transition. Black fade can override it.
    transition: float | None = None


class AmbilightSyncManager:
    """Own the TV connection and the stable v0.2 latest-wins sync loop.

    Each zone still has a one-item command buffer. v0.2.2 only adds color
    selection and black-handling before commands reach that transport layer.
    Intermediate stale frames are never accumulated.
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
        zone_lights: dict[str, list[str]],
        options: dict[str, Any],
    ) -> None:
        self.hass = hass
        self.entry = entry
        self.entry_id = entry.entry_id
        self.host = host
        self.system = system
        self.zone_lights = {
            zone: list(entities) for zone, entities in zone_lights.items() if entities
        }

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

        self.source = str(options.get(CONF_SOURCE, DEFAULT_SOURCE))
        self.color_mode = str(options.get(CONF_COLOR_MODE, DEFAULT_COLOR_MODE))
        self.update_rate = float(options.get(CONF_UPDATE_RATE, DEFAULT_UPDATE_RATE))
        self.smoothing = float(options.get(CONF_SMOOTHING, DEFAULT_SMOOTHING))
        self.brightness = float(options.get(CONF_BRIGHTNESS, DEFAULT_BRIGHTNESS))
        self.minimum_brightness = float(
            options.get(CONF_MINIMUM_BRIGHTNESS, DEFAULT_MINIMUM_BRIGHTNESS)
        )
        self.saturation = float(options.get(CONF_SATURATION, DEFAULT_SATURATION))
        self.threshold = float(options.get(CONF_THRESHOLD, DEFAULT_THRESHOLD))
        self.transition = float(options.get(CONF_TRANSITION, DEFAULT_TRANSITION))
        self.black_hold_ms = float(options.get(CONF_BLACK_HOLD, DEFAULT_BLACK_HOLD))
        self.fade_to_black = float(
            options.get(CONF_FADE_TO_BLACK, DEFAULT_FADE_TO_BLACK)
        )
        self.corner_influence = float(
            options.get(CONF_CORNER_INFLUENCE, DEFAULT_CORNER_INFLUENCE)
        )
        self.restore_on_stop = bool(
            options.get(CONF_RESTORE_ON_STOP, DEFAULT_RESTORE_ON_STOP)
        )

        self._running = False
        self._task: asyncio.Task[None] | None = None
        self._worker_tasks: dict[str, asyncio.Task[None]] = {}
        self._zone_events: dict[str, asyncio.Event] = {}
        self._pending: dict[str, ZoneCommand] = {}
        self._snapshot: dict[str, LightSnapshot] = {}
        self._smoothed: dict[str, RGB] = {}
        self._last_sent: dict[str, tuple[bool, RGB, int]] = {}
        self._last_nonblack_rgb: dict[str, RGB] = {}
        self._black_tasks: dict[str, asyncio.Task[None]] = {}
        self._black_faded: set[str] = set()
        self._last_error: str | None = None
        self._last_error_log_at = 0.0
        # Black-hold confirmation may perform one extra Ambilight read. Keep TV
        # requests serialized without touching the light-command transport.
        self._tv_lock = asyncio.Lock()

    @property
    def is_running(self) -> bool:
        return self._running

    @property
    def last_error(self) -> str | None:
        return self._last_error

    @property
    def light_count(self) -> int:
        return len({entity for entities in self.zone_lights.values() for entity in entities})

    def update_setting(self, key: str, value: Any) -> None:
        if key == CONF_SOURCE:
            self.source = str(value)
        elif key == CONF_COLOR_MODE:
            self.color_mode = str(value)
        elif key == CONF_UPDATE_RATE:
            self.update_rate = float(value)
        elif key == CONF_SMOOTHING:
            self.smoothing = float(value)
        elif key == CONF_BRIGHTNESS:
            self.brightness = float(value)
        elif key == CONF_MINIMUM_BRIGHTNESS:
            self.minimum_brightness = float(value)
        elif key == CONF_SATURATION:
            self.saturation = float(value)
        elif key == CONF_THRESHOLD:
            self.threshold = float(value)
        elif key == CONF_TRANSITION:
            self.transition = float(value)
        elif key == CONF_BLACK_HOLD:
            self.black_hold_ms = float(value)
        elif key == CONF_FADE_TO_BLACK:
            self.fade_to_black = float(value)
        elif key == CONF_CORNER_INFLUENCE:
            self.corner_influence = float(value)
        elif key == CONF_RESTORE_ON_STOP:
            self.restore_on_stop = bool(value)

    async def async_start(self) -> None:
        if self._running:
            return
        if not self._all_lights():
            self._last_error = "No lights configured. Open the Ambilight Sync sidebar panel."
            return

        self._snapshot_lights()
        self._smoothed.clear()
        self._last_sent.clear()
        self._last_nonblack_rgb.clear()
        self._pending.clear()
        self._black_faded.clear()
        self._last_error = None
        self._running = True

        for zone in self.zone_lights:
            event = asyncio.Event()
            self._zone_events[zone] = event
            self._worker_tasks[zone] = self.entry.async_create_background_task(
                self.hass,
                self._zone_worker(zone, event),
                f"{self.entry_id} Ambilight zone {zone}",
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

        self._zone_events.clear()
        self._pending.clear()
        self._black_faded.clear()

        should_restore = self.restore_on_stop if restore is None else restore
        if should_restore:
            await self._restore_lights()
        self._snapshot.clear()
        self._smoothed.clear()
        self._last_sent.clear()
        self._last_nonblack_rgb.clear()

    async def async_shutdown(self) -> None:
        await self.async_stop(restore=False)
        await self.tv.session.aclose()

    async def async_apply_configuration(
        self, zone_lights: dict[str, list[str]], settings: dict[str, Any]
    ) -> None:
        """Apply sidebar settings without replacing the v0.2 transport model."""
        normalized = {
            zone: list(entities) for zone, entities in zone_lights.items() if entities
        }
        mapping_changed = normalized != self.zone_lights
        was_running = self._running

        if mapping_changed and was_running:
            await self.async_stop(restore=True)

        self.zone_lights = normalized
        for key, value in settings.items():
            self.update_setting(key, value)

        if mapping_changed and was_running and self._all_lights():
            await self.async_start()

    def _all_lights(self) -> list[str]:
        return sorted({entity for entities in self.zone_lights.values() for entity in entities})

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
                samples = await self._fetch_samples()
                self._queue_colors(samples)
                self._last_error = None
            except asyncio.CancelledError:
                raise
            except (GeneralFailure, RuntimeError, OSError, ValueError) as exc:
                self._last_error = str(exc)
                now = monotonic()
                if now - self._last_error_log_at >= 30:
                    _LOGGER.warning("Ambilight sync error: %s", exc)
                    self._last_error_log_at = now
            except Exception as exc:  # Defensive: keep a long-running sync loop alive.
                self._last_error = str(exc)
                now = monotonic()
                if now - self._last_error_log_at >= 30:
                    _LOGGER.exception("Unexpected Ambilight sync error")
                    self._last_error_log_at = now

            period = 1.0 / max(1.0, min(MAX_UPDATE_RATE, self.update_rate))
            elapsed = monotonic() - started
            await asyncio.sleep(max(0.0, period - elapsed))


    async def _fetch_samples(self) -> dict[str, WeightedSamples]:
        """Read one Ambilight frame, serialized across the normal loop and hold checks."""
        async with self._tv_lock:
            if self.source == SOURCE_MEASURED:
                payload = await self.tv.getAmbilightMeasured()
            else:
                payload = await self.tv.getAmbilightProcessed()
        samples = extract_zone_samples(payload, self.corner_influence)
        if not samples:
            raise RuntimeError("TV returned no Ambilight color data")
        return samples

    def _zone_is_black(
        self, zone: str, samples_by_zone: dict[str, WeightedSamples]
    ) -> bool:
        samples = samples_by_zone.get(zone, samples_by_zone.get(ZONE_ALL))
        if not samples:
            return True
        selected = color_from_samples(samples, self.color_mode)
        if selected is None:
            return True
        adjusted = adjust_saturation(selected, self.saturation)
        return max(adjusted) <= BLACK_CUTOFF

    def _queue_colors(self, samples_by_zone: dict[str, WeightedSamples]) -> None:
        fallback = samples_by_zone.get(ZONE_ALL)

        for zone in self.zone_lights:
            samples = samples_by_zone.get(zone, fallback)
            if not samples:
                continue

            selected = color_from_samples(samples, self.color_mode)
            if selected is None:
                continue

            _LOGGER.debug(
                "Zone %s color mode=%s selected=%s samples=%d",
                zone,
                self.color_mode,
                selected,
                len(samples),
            )

            smoothed = smooth_rgb(self._smoothed.get(zone), selected, self.smoothing)
            self._smoothed[zone] = smoothed
            adjusted = adjust_saturation(smoothed, self.saturation)
            peak = max(adjusted)

            if peak <= BLACK_CUTOFF:
                self._handle_black(zone)
                continue

            self._cancel_black_hold(zone, reason="color returned")
            self._black_faded.discard(zone)

            raw_brightness = round(peak * self.brightness / 100.0)
            floor_percent = min(self.minimum_brightness, self.brightness)
            floor_brightness = round(255 * floor_percent / 100.0)
            brightness = max(1, min(255, max(raw_brightness, floor_brightness)))
            rgb = normalized_rgb(adjusted)
            self._last_nonblack_rgb[zone] = rgb

            _LOGGER.debug(
                "Zone %s brightness raw=%d minimum=%.1f%% final=%d rgb=%s",
                zone,
                raw_brightness,
                floor_percent,
                brightness,
                rgb,
            )

            previous = self._last_sent.get(zone)
            if previous is not None and previous[0]:
                previous_rgb = previous[1]
                previous_brightness = previous[2]
                if (
                    color_distance(previous_rgb, rgb) < self.threshold
                    and abs(previous_brightness - brightness)
                    < max(2.0, self.threshold / 2.0)
                ):
                    continue

            self._last_sent[zone] = (True, rgb, brightness)
            self._set_pending(
                zone, ZoneCommand(on=True, rgb=rgb, brightness=brightness)
            )

    def _handle_black(self, zone: str) -> None:
        """Start a cancellable hold before fading a dark zone."""
        if zone in self._black_faded:
            return
        if zone in self._black_tasks:
            return

        hold_seconds = max(0.0, self.black_hold_ms / 1000.0)
        if hold_seconds <= 0:
            _LOGGER.debug("Zone %s black hold skipped (0 ms)", zone)
            self._commit_black(zone)
            return

        _LOGGER.debug(
            "Zone %s entered black hold for %.0f ms", zone, self.black_hold_ms
        )
        task = self.entry.async_create_background_task(
            self.hass,
            self._black_hold_then_fade(zone, hold_seconds),
            f"{self.entry_id} Ambilight black hold {zone}",
        )
        self._black_tasks[zone] = task
        task.add_done_callback(lambda completed, z=zone: self._black_task_done(z, completed))

    async def _black_hold_then_fade(self, zone: str, hold_seconds: float) -> None:
        try:
            await asyncio.sleep(hold_seconds)
            if not self._running:
                return

            # At low update rates (1 Hz is a useful real-world configuration),
            # a 300 ms hold would otherwise expire before the normal loop can see
            # that a brief black frame has already ended. Confirm with one fresh
            # TV read before fading. This does not enqueue any light command.
            try:
                fresh_samples = await self._fetch_samples()
            except (GeneralFailure, RuntimeError, OSError, ValueError) as exc:
                _LOGGER.debug(
                    "Zone %s black hold confirmation failed (%s); keeping current light state",
                    zone,
                    exc,
                )
                return

            if not self._zone_is_black(zone, fresh_samples):
                _LOGGER.debug(
                    "Zone %s black hold elapsed but color returned; fade cancelled", zone
                )
                return

            _LOGGER.debug("Zone %s black hold elapsed and black confirmed", zone)
            self._commit_black(zone)
        except asyncio.CancelledError:
            raise

    def _black_task_done(self, zone: str, task: asyncio.Task[None]) -> None:
        if self._black_tasks.get(zone) is task:
            self._black_tasks.pop(zone, None)

    def _cancel_black_hold(self, zone: str, *, reason: str) -> None:
        task = self._black_tasks.pop(zone, None)
        if task is not None:
            task.cancel()
            _LOGGER.debug("Zone %s black hold cancelled: %s", zone, reason)

    def _commit_black(self, zone: str) -> None:
        """Fade to the configured floor, or off when the floor is zero."""
        self._black_faded.add(zone)
        previous = self._last_sent.get(zone)
        floor_percent = min(self.minimum_brightness, self.brightness)
        fade = max(0.0, self.fade_to_black)

        if floor_percent > 0:
            rgb = self._last_nonblack_rgb.get(zone)
            if rgb is None and previous is not None and previous[0]:
                rgb = previous[1]

            # If Sync starts on a black scene and has never seen a usable hue,
            # keep the pre-existing lamp state instead of inventing a color.
            if rgb is None:
                _LOGGER.debug(
                    "Zone %s black floor %.1f%% has no prior hue; keeping current lamp state",
                    zone,
                    floor_percent,
                )
                return

            brightness = max(1, min(255, round(255 * floor_percent / 100.0)))
            if previous == (True, rgb, brightness):
                return
            self._last_sent[zone] = (True, rgb, brightness)
            _LOGGER.debug(
                "Zone %s black fade -> minimum brightness %.1f%% (%d), rgb=%s, transition=%.2fs",
                zone,
                floor_percent,
                brightness,
                rgb,
                fade,
            )
            self._set_pending(
                zone,
                ZoneCommand(
                    on=True,
                    rgb=rgb,
                    brightness=brightness,
                    transition=fade,
                ),
            )
            return

        if previous is not None and previous[0] is False:
            return
        self._last_sent[zone] = (False, (0, 0, 0), 0)
        _LOGGER.debug(
            "Zone %s black fade -> off, transition=%.2fs", zone, fade
        )
        self._set_pending(zone, ZoneCommand(on=False, transition=fade))

    def _set_pending(self, zone: str, command: ZoneCommand) -> None:
        """Replace any stale command for a zone with the newest frame."""
        self._pending[zone] = command
        if event := self._zone_events.get(zone):
            event.set()

    async def _zone_worker(self, zone: str, event: asyncio.Event) -> None:
        entity_ids = self.zone_lights[zone]
        while self._running:
            await event.wait()
            event.clear()
            command = self._pending.pop(zone, None)
            if command is None:
                continue

            try:
                if not command.on:
                    data: dict[str, Any] = {ATTR_ENTITY_ID: entity_ids}
                    if command.transition is not None and command.transition > 0:
                        data[ATTR_TRANSITION] = command.transition
                    _LOGGER.debug("light.turn_off zone=%s data=%s", zone, data)
                    await self.hass.services.async_call(
                        LIGHT_DOMAIN,
                        SERVICE_TURN_OFF,
                        data,
                        blocking=True,
                    )
                    continue

                data = {
                    ATTR_ENTITY_ID: entity_ids,
                    ATTR_RGB_COLOR: command.rgb,
                    ATTR_BRIGHTNESS: command.brightness,
                }
                transition = (
                    self.transition if command.transition is None else command.transition
                )
                if transition > 0:
                    data[ATTR_TRANSITION] = transition

                _LOGGER.debug("light.turn_on zone=%s data=%s", zone, data)
                await self.hass.services.async_call(
                    LIGHT_DOMAIN,
                    SERVICE_TURN_ON,
                    data,
                    blocking=True,
                )
            except asyncio.CancelledError:
                raise
            except Exception as exc:  # Keep one bad light from killing sync.
                self._last_error = str(exc)
                now = monotonic()
                if now - self._last_error_log_at >= 30:
                    _LOGGER.warning("Light update failed for zone %s: %s", zone, exc)
                    self._last_error_log_at = now
