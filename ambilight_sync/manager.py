"""Runtime synchronization engine for Ambilight Sync."""

from __future__ import annotations

import asyncio
from collections import defaultdict, deque
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
    extract_spatial_samples,
    extract_spatial_weight_map,
    extract_zone_samples,
    normalized_rgb,
    payload_is_all_zero,
    rec709_luminance_percent,
    smooth_rgb,
)
from .config_model import (
    active_preset,
    effective_settings,
    normalize_profile_config,
)
from .const import (
    BLACK_HYSTERESIS_PERCENT,
    CONF_BLACK_HOLD,
    CONF_BLACK_THRESHOLD,
    CONF_BRIGHTNESS,
    CONF_COLOR_MODE,
    CONF_CORNER_INFLUENCE,
    CONF_FADE_TO_BLACK,
    CONF_MINIMUM_BRIGHTNESS,
    CONF_OFF_DELAY,
    CONF_POLL_RATE,
    CONF_POSITION_MODE,
    CONF_POSITION_X,
    CONF_POSITION_Y,
    CONF_POSITION_FALLOFF,
    CONF_RESTORE_ON_STOP,
    CONF_SCENE_CUT_THRESHOLD,
    CONF_SCENE_CUT_TRANSITION,
    CONF_SATURATION,
    CONF_SMOOTHING,
    CONF_SOURCE,
    CONF_THRESHOLD,
    CONF_TRANSITION,
    CONF_UPDATE_RATE,
    MAX_UPDATE_RATE,
    MIN_UPDATE_RATE,
    POSITION_MODE_SPATIAL,
    RATE_WINDOW_SECONDS,
    SOURCE_MEASURED,
    SOURCE_PROCESSED,
    STUCK_PROCESSED_SECONDS,
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
    """Synchronize Ambilight to configured lights using latest-wins workers."""

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
        # Result events are separate from pending-command events. Software fades
        # use them to pace visible brightness steps by actual service-call
        # completion instead of flooding a slow light and letting latest-wins
        # collapse the entire fade into a final OFF command.
        self._light_result_events: dict[str, asyncio.Event] = {}
        self._pending: dict[str, LightCommand] = {}
        self._snapshot: dict[str, LightSnapshot] = {}

        self._smoothed: dict[str, RGB] = {}
        self._last_queued: dict[str, LightCommand] = {}
        self._last_successful: dict[str, LightCommand] = {}
        self._last_normal_queued_at: dict[str, float] = {}
        self._last_nonblack_rgb: dict[str, RGB] = {}
        self._last_selected_raw: dict[str, RGB] = {}
        self._scene_cut_count: dict[str, int] = defaultdict(int)
        self._last_scene_cut_score: dict[str, float] = {}

        # Black state is driven only by normal TV polling. Fade is a separate,
        # cancellable output task and never performs its own TV request.
        self._black_state: dict[str, bool] = {}
        self._black_since: dict[str, float] = {}
        self._black_faded: set[str] = set()
        self._fade_tasks: dict[str, asyncio.Task[None]] = {}

        self._previews: dict[str, dict[str, Any]] = {}
        self._spatial_maps: dict[str, list[dict[str, Any]]] = {}

        # Error domains are intentionally separate so one bad bulb cannot mute
        # TV diagnostics or another light's warning.
        self._tv_last_error: str | None = None
        self._light_last_errors: dict[str, str] = {}
        self._tv_last_error_log_at = 0.0
        self._light_last_error_log_at: dict[str, float] = {}
        self._light_error_count: dict[str, int] = defaultdict(int)

        # Rolling metrics. These are diagnostic only and never drive transport.
        self._tv_poll_times: deque[float] = deque()
        self._queued_times: dict[str, deque[float]] = defaultdict(deque)
        self._successful_times: dict[str, deque[float]] = defaultdict(deque)
        self._latency_samples: dict[str, deque[float]] = defaultdict(deque)
        self._last_latency_ms: dict[str, float] = {}
        self._replaced_frames: dict[str, int] = defaultdict(int)

        # Philips occasionally reports processed=all zero while Follow Video is
        # still active. Detect and warn, but never substitute guessed/cached data.
        self._stuck_processed_black_since: float | None = None
        self._stuck_processed_warned = False
        self._stuck_diag_task: asyncio.Task[None] | None = None

        self._tv_lock = asyncio.Lock()

    def _load_active_preset(self) -> None:
        preset_id, preset = active_preset(self._profile_config)
        self.active_preset_id = preset_id
        self.active_preset_name = str(preset.get("name") or preset_id)
        self.global_settings = dict(preset.get("global", {}))
        self.light_configs = {
            entity_id: {
                CONF_POSITION_MODE: config.get(CONF_POSITION_MODE, "manual"),
                CONF_POSITION_X: float(config.get(CONF_POSITION_X, 0.0)),
                CONF_POSITION_Y: float(config.get(CONF_POSITION_Y, 0.0)),
                CONF_POSITION_FALLOFF: float(config.get(CONF_POSITION_FALLOFF, 45.0)),
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
        if self._tv_last_error:
            return self._tv_last_error
        if self._light_last_errors:
            entity_id = next(iter(self._light_last_errors))
            return f"{entity_id}: {self._light_last_errors[entity_id]}"
        return None

    @property
    def light_count(self) -> int:
        return len(self.light_configs)

    @property
    def source(self) -> str:
        return str(self.global_settings.get(CONF_SOURCE, "processed"))

    @property
    def poll_rate(self) -> float:
        return float(
            self.global_settings.get(
                CONF_POLL_RATE, self.global_settings.get(CONF_UPDATE_RATE, 1.0)
            )
        )

    @property
    def update_rate(self) -> float:
        return float(self.global_settings.get(CONF_UPDATE_RATE, 1.0))

    @property
    def restore_on_stop(self) -> bool:
        return bool(self.global_settings.get(CONF_RESTORE_ON_STOP, True))

    @property
    def previews(self) -> dict[str, dict[str, Any]]:
        return {entity_id: dict(value) for entity_id, value in self._previews.items()}

    @property
    def diagnostics(self) -> dict[str, Any]:
        now = monotonic()
        lights: dict[str, Any] = {}
        for entity_id in self._all_lights():
            settings = self._settings_for_light(entity_id)
            latencies = self._latency_samples[entity_id]
            self._prune_values(latencies, now, value_is_timestamp=False)
            avg_latency = (
                sum(latencies) / len(latencies) if latencies else 0.0
            )
            lights[entity_id] = {
                "target_rate_hz": round(float(settings[CONF_UPDATE_RATE]), 2),
                "queued_rate_hz": round(self._rolling_rate(self._queued_times[entity_id], now), 2),
                "actual_rate_hz": round(self._rolling_rate(self._successful_times[entity_id], now), 2),
                "replaced_frames": int(self._replaced_frames.get(entity_id, 0)),
                "last_latency_ms": round(self._last_latency_ms.get(entity_id, 0.0), 1),
                "avg_latency_ms": round(avg_latency, 1),
                "errors": int(self._light_error_count.get(entity_id, 0)),
                "scene_cuts": int(self._scene_cut_count.get(entity_id, 0)),
                "scene_cut_score": round(self._last_scene_cut_score.get(entity_id, 0.0), 1),
            }
        return {
            "tv": {
                "target_poll_rate_hz": round(self.poll_rate, 2),
                "actual_poll_rate_hz": round(self._rolling_rate(self._tv_poll_times, now), 2),
                "processed_all_zero_seconds": round(
                    max(0.0, now - self._stuck_processed_black_since)
                    if self._stuck_processed_black_since is not None
                    else 0.0,
                    1,
                ),
                "processed_stuck_warning": bool(self._stuck_processed_warned),
            },
            "lights": lights,
        }

    def _settings_for_light(self, entity_id: str) -> dict[str, Any]:
        config = self.light_configs.get(entity_id, {})
        return effective_settings(self.global_settings, config.get("overrides", {}))

    async def async_start(self) -> None:
        if self._running:
            return
        if not self._all_lights():
            self._tv_last_error = "No lights configured. Open the Ambilight Sync sidebar panel."
            return

        self._snapshot_lights()
        self._reset_runtime_state()
        self._tv_last_error = None
        self._light_last_errors.clear()
        self._running = True

        for entity_id in self._all_lights():
            event = asyncio.Event()
            self._light_events[entity_id] = event
            self._light_result_events[entity_id] = asyncio.Event()
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
            and not self._fade_tasks
        ):
            return
        self._running = False

        tasks: list[asyncio.Task[None]] = []
        if self._task is not None:
            tasks.append(self._task)
            self._task = None
        tasks.extend(self._worker_tasks.values())
        tasks.extend(self._fade_tasks.values())
        if self._stuck_diag_task is not None:
            tasks.append(self._stuck_diag_task)
            self._stuck_diag_task = None
        self._worker_tasks.clear()
        self._fade_tasks.clear()

        for task in tasks:
            task.cancel()
        if tasks:
            await asyncio.gather(*tasks, return_exceptions=True)

        self._light_events.clear()
        self._light_result_events.clear()
        self._pending.clear()
        self._black_faded.clear()

        should_restore = self.restore_on_stop if restore is None else restore
        if should_restore:
            await self._restore_lights()
        self._snapshot.clear()
        self._reset_runtime_state(clear_previews=False)

    async def async_shutdown(self) -> None:
        await self.async_stop(restore=False)
        await self.tv.session.aclose()

    async def async_apply_profile_config(self, profile_config: dict[str, Any]) -> None:
        """Apply profile configuration without changing the latest-wins transport."""
        normalized = normalize_profile_config(profile_config)
        old_preset_id, old_preset = active_preset(self._profile_config)
        new_preset_id, new_preset = active_preset(normalized)

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

        if was_running and old_lights != new_lights:
            await self.async_stop(restore=True)

        self._profile_config = normalized
        self._load_active_preset()

        for task in list(self._fade_tasks.values()):
            task.cancel()
        self._fade_tasks.clear()
        self._pending.clear()
        self._smoothed.clear()
        self._last_queued.clear()
        self._last_successful.clear()
        self._last_normal_queued_at.clear()
        self._last_nonblack_rgb.clear()
        self._last_selected_raw.clear()
        self._scene_cut_count.clear()
        self._last_scene_cut_score.clear()
        self._black_state.clear()
        self._black_since.clear()
        self._black_faded.clear()
        self._previews = {
            entity_id: preview
            for entity_id, preview in self._previews.items()
            if entity_id in self.light_configs
        }

        if was_running and old_lights != new_lights and new_lights:
            await self.async_start()
        elif was_running and not new_lights:
            self._tv_last_error = "No lights configured in the active preset."

        _LOGGER.debug(
            "Applied preset %s (%s), lights=%d",
            new_preset_id,
            self.active_preset_name,
            len(new_lights),
        )

    def _reset_runtime_state(self, *, clear_previews: bool = True) -> None:
        self._smoothed.clear()
        self._last_queued.clear()
        self._last_successful.clear()
        self._last_normal_queued_at.clear()
        self._last_nonblack_rgb.clear()
        self._last_selected_raw.clear()
        self._scene_cut_count.clear()
        self._last_scene_cut_score.clear()
        self._pending.clear()
        self._black_state.clear()
        self._black_since.clear()
        self._black_faded.clear()
        self._tv_poll_times.clear()
        self._queued_times.clear()
        self._successful_times.clear()
        self._latency_samples.clear()
        self._last_latency_ms.clear()
        self._replaced_frames.clear()
        self._light_error_count.clear()
        self._spatial_maps.clear()
        self._stuck_processed_black_since = None
        self._stuck_processed_warned = False
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
                now = monotonic()
                self._record_timestamp(self._tv_poll_times, now)
                self._update_stuck_processed_watch(payload, now)
                self._queue_colors(payload, now)
                self._tv_last_error = None
            except asyncio.CancelledError:
                raise
            except (GeneralFailure, RuntimeError, OSError, ValueError) as exc:
                self._tv_last_error = str(exc)
                self._log_tv_error(exc)
            except Exception as exc:  # Defensive: keep long-running sync alive.
                self._tv_last_error = str(exc)
                self._log_tv_error(exc, unexpected=True)

            poll_rate = max(MIN_UPDATE_RATE, min(MAX_UPDATE_RATE, self.poll_rate))
            period = 1.0 / poll_rate
            elapsed = monotonic() - started
            await asyncio.sleep(max(0.0, period - elapsed))

    def _log_tv_error(self, exc: Exception, *, unexpected: bool = False) -> None:
        now = monotonic()
        if now - self._tv_last_error_log_at < 30:
            return
        if unexpected:
            _LOGGER.exception("Unexpected Ambilight TV/polling error")
        else:
            _LOGGER.warning("Ambilight TV/polling error: %s", exc)
        self._tv_last_error_log_at = now

    async def _fetch_payload(self) -> Any:
        async with self._tv_lock:
            if self.source == SOURCE_MEASURED:
                return await self.tv.getAmbilightMeasured()
            return await self.tv.getAmbilightProcessed()

    def _update_stuck_processed_watch(self, payload: Any, now: float) -> None:
        if self.source != SOURCE_PROCESSED or not payload_is_all_zero(payload):
            self._stuck_processed_black_since = None
            self._stuck_processed_warned = False
            return

        if self._stuck_processed_black_since is None:
            self._stuck_processed_black_since = now
            return

        if (
            not self._stuck_processed_warned
            and now - self._stuck_processed_black_since >= STUCK_PROCESSED_SECONDS
            and (self._stuck_diag_task is None or self._stuck_diag_task.done())
        ):
            self._stuck_processed_warned = True
            self._stuck_diag_task = self.entry.async_create_background_task(
                self.hass,
                self._diagnose_stuck_processed(),
                f"{self.entry_id} Ambilight processed diagnostic",
            )

    async def _diagnose_stuck_processed(self) -> None:
        """Confirm the known Philips all-zero processed state without changing output."""
        try:
            async with self._tv_lock:
                get_req = getattr(self.tv, "_getReq", None)
                if get_req is None:
                    _LOGGER.debug("Philips stuck-processed diagnostic unavailable: _getReq missing")
                    return
                power = await get_req("ambilight/power")
                current = await get_req("ambilight/currentconfiguration")
                tv_active: bool | None = None
                try:
                    power_state = await get_req("powerstate")
                    tv_active = str(power_state.get("powerstate", "")).lower() == "on"
                except Exception:
                    try:
                        screen = await get_req("screenstate")
                        tv_active = str(screen.get("screenstate", "")).lower() == "on"
                    except Exception:
                        tv_active = None

            ambilight_on = str((power or {}).get("power", "")).lower() == "on"
            follow_video = str((current or {}).get("styleName", "")).upper() == "FOLLOW_VIDEO"
            active_ok = tv_active is not False
            if ambilight_on and follow_video and active_ok:
                _LOGGER.warning(
                    "Philips Ambilight processed API has returned only 0,0,0 for %.0fs "
                    "while Ambilight is On and FOLLOW_VIDEO is active. The TV API may be "
                    "stuck; Ambilight Sync will not substitute cached colors.",
                    STUCK_PROCESSED_SECONDS,
                )
            else:
                _LOGGER.debug(
                    "Long all-zero processed frame diagnosed as expected state: power=%s current=%s tv_active=%s",
                    power,
                    current,
                    tv_active,
                )
        except asyncio.CancelledError:
            raise
        except Exception as exc:
            _LOGGER.debug("Philips stuck-processed diagnostic failed: %s", exc)

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

    def _mapping_sources(self, config: dict[str, Any]) -> list[dict[str, Any]]:
        """Return configured manual zone sources. Spatial mode uses raw pixels."""
        return list(config.get("sources", []))

    def _spatial_samples(self, entity_id: str, payload: Any) -> WeightedSamples:
        config = self.light_configs.get(entity_id, {})
        x = float(config.get(CONF_POSITION_X, 0.0))
        y = float(config.get(CONF_POSITION_Y, 0.0))
        falloff = float(config.get(CONF_POSITION_FALLOFF, 45.0))
        weight_map = extract_spatial_weight_map(payload, x, y, falloff)
        self._spatial_maps[entity_id] = weight_map
        return [
            (tuple(item["rgb"]), float(item["weight"]))  # type: ignore[arg-type]
            for item in weight_map
            if item["active"]
        ]

    @staticmethod
    def _scene_cut_score(previous: RGB | None, current: RGB) -> float:
        """Return a 0..100-ish visual discontinuity score for one light region."""
        if previous is None:
            return 0.0
        max_rgb_distance = (3.0 * 255.0 * 255.0) ** 0.5
        rgb_delta = color_distance(previous, current) / max_rgb_distance * 100.0
        luma_delta = abs(
            rec709_luminance_percent(previous) - rec709_luminance_percent(current)
        )
        return max(0.0, min(100.0, max(rgb_delta, luma_delta)))

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
        if str(config.get(CONF_POSITION_MODE, "manual")) == POSITION_MODE_SPATIAL:
            spatial = self._spatial_samples(entity_id, payload)
            if not spatial:
                return None
            selected = color_from_samples(spatial, mode)
            if selected is not None:
                _LOGGER.debug(
                    "Light %s color mode=%s position=spatial x=%.0f y=%.0f falloff=%.0f%% segments=%d selected=%s",
                    entity_id,
                    mode,
                    float(config.get(CONF_POSITION_X, 0.0)),
                    float(config.get(CONF_POSITION_Y, 0.0)),
                    float(config.get(CONF_POSITION_FALLOFF, 45.0)),
                    len(spatial),
                    selected,
                )
            return selected

        fallback = samples_by_zone.get(ZONE_ALL)
        source_colors: list[tuple[RGB, float]] = []
        debug_sources: list[str] = []
        for source in self._mapping_sources(config):
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
                "Light %s color mode=%s position=%s mixer=[%s] selected=%s",
                entity_id,
                mode,
                config.get(CONF_POSITION_MODE, "manual"),
                ", ".join(debug_sources),
                selected,
            )
        return selected

    def _light_update_due(self, entity_id: str, settings: dict[str, Any], now: float) -> bool:
        rate = max(
            MIN_UPDATE_RATE,
            min(MAX_UPDATE_RATE, float(settings.get(CONF_UPDATE_RATE, self.update_rate))),
        )
        last = self._last_normal_queued_at.get(entity_id)
        return last is None or now - last >= (1.0 / rate)

    def _raw_source_luminance(
        self,
        entity_id: str,
        payload: Any,
        settings: dict[str, Any],
        samples_cache: dict[float, dict[str, WeightedSamples]],
    ) -> float | None:
        """Return weighted Rec.709 luminance from raw Ambilight samples.

        Black detection deliberately happens before Average/Perceptual/Dominant
        processing. Color algorithms decide what hue to display; they must not
        decide whether the TV content is black.
        """
        config = self.light_configs.get(entity_id)
        if not config:
            return None

        corner = float(settings.get(CONF_CORNER_INFLUENCE, 0.0))
        samples_by_zone = samples_cache.get(corner)
        if samples_by_zone is None:
            samples_by_zone = extract_zone_samples(payload, corner)
            samples_cache[corner] = samples_by_zone
        if not samples_by_zone:
            return None

        if str(config.get(CONF_POSITION_MODE, "manual")) == POSITION_MODE_SPATIAL:
            spatial = self._spatial_samples(entity_id, payload)
            if not spatial:
                return None
            weighted_luma = sum(
                rec709_luminance_percent(rgb) * max(0.0, float(weight))
                for rgb, weight in spatial
            )
            total_weight = sum(max(0.0, float(weight)) for _, weight in spatial)
            return weighted_luma / total_weight if total_weight > 0 else None

        fallback = samples_by_zone.get(ZONE_ALL)
        weighted_luma = 0.0
        total_weight = 0.0
        for source in self._mapping_sources(config):
            zone = str(source.get("zone", ZONE_ALL))
            source_weight = max(0.0, float(source.get("weight", 0.0)))
            if source_weight <= 0:
                continue
            samples = samples_by_zone.get(zone, fallback)
            if not samples:
                continue
            for rgb, sample_weight in samples:
                weight = source_weight * max(0.0, float(sample_weight))
                if weight <= 0:
                    continue
                weighted_luma += rec709_luminance_percent(rgb) * weight
                total_weight += weight

        if total_weight <= 0:
            return None
        return weighted_luma / total_weight

    def _classify_black(
        self, entity_id: str, luminance: float, threshold: float
    ) -> tuple[bool, float, float]:
        """Classify black with zero meaning exact black and gentle hysteresis.

        At 0% there is intentionally no hysteresis: only true zero luminance is
        black. Above zero, hysteresis grows with the configured threshold and is
        capped at the historical 2 percentage points.
        """
        threshold = max(0.0, float(threshold))
        was_black = self._black_state.get(entity_id, False)
        hysteresis = 0.0 if threshold <= 0 else min(
            BLACK_HYSTERESIS_PERCENT, threshold * 0.25
        )
        effective_threshold = threshold + hysteresis if was_black else threshold
        black = luminance <= effective_threshold
        self._black_state[entity_id] = black
        return black, luminance, effective_threshold

    def _queue_colors(self, payload: Any, now: float | None = None) -> None:
        samples_cache: dict[float, dict[str, WeightedSamples]] = {}
        now = monotonic() if now is None else now

        for entity_id in self._all_lights():
            settings = self._settings_for_light(entity_id)
            selected = self._selected_color(entity_id, payload, settings, samples_cache)
            if selected is None:
                continue

            previous_raw = self._last_selected_raw.get(entity_id)
            scene_cut_score = self._scene_cut_score(previous_raw, selected)
            self._last_selected_raw[entity_id] = selected
            self._last_scene_cut_score[entity_id] = scene_cut_score
            scene_cut_threshold = float(settings.get(CONF_SCENE_CUT_THRESHOLD, 0.0))
            scene_cut = bool(
                scene_cut_threshold > 0.0
                and previous_raw is not None
                and scene_cut_score >= scene_cut_threshold
            )

            input_luminance = self._raw_source_luminance(
                entity_id, payload, settings, samples_cache
            )
            if input_luminance is None:
                input_luminance = rec709_luminance_percent(selected)
            black, input_luminance, black_limit = self._classify_black(
                entity_id, input_luminance, float(settings[CONF_BLACK_THRESHOLD])
            )
            if black:
                self._handle_black_frame(
                    entity_id, settings, selected, input_luminance, black_limit, now
                )
                continue

            returning_from_black = (
                entity_id in self._black_since
                or entity_id in self._black_faded
                or entity_id in self._fade_tasks
            )
            priority_frame = returning_from_black or scene_cut
            self._cancel_black_flow(
                entity_id,
                reason="scene cut/non-black priority" if priority_frame else "non-black frame",
            )

            if scene_cut:
                self._scene_cut_count[entity_id] += 1
                _LOGGER.debug(
                    "Light %s scene cut score=%.1f threshold=%.1f; bypassing rate/smoothing",
                    entity_id,
                    scene_cut_score,
                    scene_cut_threshold,
                )

            if not priority_frame and not self._light_update_due(entity_id, settings, now):
                continue

            if priority_frame:
                # A cut should visually catch up immediately. Carrying the old
                # smoothing accumulator across a cut would recreate the lag we
                # are explicitly trying to remove.
                smoothed = selected
            else:
                smoothed = smooth_rgb(
                    self._smoothed.get(entity_id), selected, float(settings[CONF_SMOOTHING])
                )
            self._smoothed[entity_id] = smoothed
            adjusted = adjust_saturation(smoothed, float(settings[CONF_SATURATION]))

            # Rec.709 luma controls light output; Minimum brightness is applied
            # afterwards and therefore never changes black classification.
            output_luminance = rec709_luminance_percent(adjusted)
            brightness_pct = float(settings[CONF_BRIGHTNESS])
            raw_brightness = round(255.0 * (output_luminance / 100.0) * (brightness_pct / 100.0))
            floor_percent = min(float(settings[CONF_MINIMUM_BRIGHTNESS]), brightness_pct)
            floor_brightness = round(255 * floor_percent / 100.0)
            brightness = max(1, min(255, max(raw_brightness, floor_brightness)))
            rgb = normalized_rgb(adjusted)
            self._last_nonblack_rgb[entity_id] = rgb
            self._previews[entity_id] = {
                "input_rgb": list(selected),
                "output_rgb": list(rgb),
                "brightness": brightness,
                "luminance": round(input_luminance, 2),
                "state": "active",
                "scene_cut": bool(scene_cut),
                "scene_cut_score": round(scene_cut_score, 1),
                "spatial_map": (
                    self._spatial_maps.get(entity_id, [])
                    if str(self.light_configs.get(entity_id, {}).get(CONF_POSITION_MODE, "manual")) == POSITION_MODE_SPATIAL
                    else []
                ),
            }

            _LOGGER.debug(
                "Light %s luminance=%.2f%% output_luma=%.2f%% black_threshold=%.2f%% "
                "brightness raw=%d minimum=%.1f%% final=%d rgb=%s",
                entity_id,
                input_luminance,
                output_luminance,
                float(settings[CONF_BLACK_THRESHOLD]),
                raw_brightness,
                floor_percent,
                brightness,
                rgb,
            )

            previous = self._last_queued.get(entity_id) or self._last_successful.get(entity_id)
            threshold = float(settings[CONF_THRESHOLD])
            if not priority_frame and previous is not None and previous.on:
                if (
                    color_distance(previous.rgb, rgb) < threshold
                    and abs(previous.brightness - brightness) < max(2.0, threshold / 2.0)
                ):
                    continue

            transition = (
                float(settings[CONF_SCENE_CUT_TRANSITION])
                if priority_frame
                else float(settings[CONF_TRANSITION])
            )
            self._queue_command(
                entity_id,
                LightCommand(
                    on=True,
                    rgb=rgb,
                    brightness=brightness,
                    transition=transition,
                ),
                normal=True,
            )

    def _handle_black_frame(
        self,
        entity_id: str,
        settings: dict[str, Any],
        selected: RGB,
        luminance: float,
        effective_threshold: float,
        now: float,
    ) -> None:
        first = self._black_since.setdefault(entity_id, now)
        hold_seconds = max(0.0, float(settings[CONF_BLACK_HOLD]) / 1000.0)
        elapsed = now - first

        current = self._previews.get(entity_id, {})
        current.update(
            {
                "input_rgb": list(selected),
                "luminance": round(luminance, 2),
                "black_limit": round(effective_threshold, 2),
                "state": "holding" if elapsed < hold_seconds else "black",
                "spatial_map": (
                    self._spatial_maps.get(entity_id, [])
                    if str(self.light_configs.get(entity_id, {}).get(CONF_POSITION_MODE, "manual")) == POSITION_MODE_SPATIAL
                    else []
                ),
            }
        )
        self._previews[entity_id] = current

        if entity_id in self._black_faded or entity_id in self._fade_tasks:
            return
        if elapsed < hold_seconds:
            _LOGGER.debug(
                "Light %s black hold %.0f/%.0f ms (luma %.2f%% <= %.2f%%)",
                entity_id,
                elapsed * 1000.0,
                hold_seconds * 1000.0,
                luminance,
                effective_threshold,
            )
            return

        _LOGGER.debug(
            "Light %s black confirmed by polling after %.0f ms; starting device transition fade",
            entity_id,
            elapsed * 1000.0,
        )
        self._start_black_fade(entity_id, settings)

    def _start_black_fade(self, entity_id: str, settings: dict[str, Any]) -> None:
        if entity_id in self._fade_tasks or entity_id in self._black_faded:
            return
        task = self.entry.async_create_background_task(
            self.hass,
            self._software_fade_to_black(entity_id, dict(settings)),
            f"{self.entry_id} Ambilight black fade {entity_id}",
        )
        self._fade_tasks[entity_id] = task
        task.add_done_callback(
            lambda completed, light=entity_id: self._fade_task_done(light, completed)
        )

    def _fade_task_done(self, entity_id: str, task: asyncio.Task[None]) -> None:
        if self._fade_tasks.get(entity_id) is task:
            self._fade_tasks.pop(entity_id, None)

    def _cancel_black_flow(self, entity_id: str, *, reason: str) -> None:
        self._black_since.pop(entity_id, None)
        self._black_faded.discard(entity_id)
        task = self._fade_tasks.pop(entity_id, None)
        if task is not None:
            task.cancel()
            _LOGGER.debug("Light %s black fade cancelled: %s", entity_id, reason)

    def _fade_start_state(self, entity_id: str) -> tuple[RGB | None, int]:
        command = self._last_successful.get(entity_id)
        if command is None or not command.on:
            command = self._last_queued.get(entity_id)
        rgb = self._last_nonblack_rgb.get(entity_id)
        brightness = 0
        if command is not None and command.on:
            rgb = rgb or command.rgb
            brightness = command.brightness

        state = self.hass.states.get(entity_id)
        if state is not None and state.state == STATE_ON:
            if brightness <= 0:
                try:
                    brightness = int(state.attributes.get(ATTR_BRIGHTNESS) or 0)
                except (TypeError, ValueError):
                    brightness = 0
            if rgb is None and state.attributes.get("rgb_color") is not None:
                try:
                    rgb = tuple(int(v) for v in state.attributes["rgb_color"][:3])  # type: ignore[assignment]
                except (TypeError, ValueError):
                    rgb = None
        return rgb, max(0, min(255, brightness))

    async def _await_fade_command(
        self, entity_id: str, command: LightCommand
    ) -> bool:
        """Wait until a fade command is actually applied by the light worker.

        Normal Ambilight output remains latest-wins. The black-flow task waits
        only for its single transition target (and optional final OFF), so a new
        non-black frame can safely cancel the flow without building a queue.
        """
        event = self._light_result_events.get(entity_id)
        if event is None:
            return False

        deadline = monotonic() + 10.0
        while self._running and self._black_state.get(entity_id, False):
            if self._last_successful.get(entity_id) == command:
                return True
            # A failed worker call removes the latest queued marker. Do not sit
            # on a broken fade step for the full timeout.
            if (
                entity_id not in self._pending
                and self._last_queued.get(entity_id) != command
                and self._last_successful.get(entity_id) != command
            ):
                return False
            remaining = deadline - monotonic()
            if remaining <= 0:
                _LOGGER.debug(
                    "Light %s timed out waiting for black fade command %s",
                    entity_id,
                    command,
                )
                return False
            event.clear()
            # Close the clear/set race if the worker completed between the
            # checks above and event.clear().
            if self._last_successful.get(entity_id) == command:
                return True
            try:
                await asyncio.wait_for(event.wait(), timeout=remaining)
            except asyncio.TimeoutError:
                return False
        return False

    async def _software_fade_to_black(
        self, entity_id: str, settings: dict[str, Any]
    ) -> None:
        """Fade to black with one device transition, then optionally turn off.

        There is deliberately no hidden high-frequency fade loop here. The light
        receives exactly one brightness target using Fade to Black as its native
        transition duration. If Minimum brightness is 0%, the target is 1%,
        then Off delay is observed before the final OFF command. A non-black
        frame cancels this task and immediately lets normal Ambilight output take
        ownership of the light.
        """
        try:
            if not self._running or not self._black_state.get(entity_id, False):
                return

            floor_percent = min(
                float(settings[CONF_MINIMUM_BRIGHTNESS]), float(settings[CONF_BRIGHTNESS])
            )
            duration = max(0.0, float(settings[CONF_FADE_TO_BLACK]))
            off_delay = max(0.0, float(settings.get(CONF_OFF_DELAY, 0.0)))
            rgb, _start_brightness = self._fade_start_state(entity_id)

            # Preserve the last visible color during the brightness transition.
            # In the normal path this is always known because black follows an
            # active Ambilight frame. If sync starts while the TV is already
            # black, there may be no color to preserve; in that rare case we can
            # only wait out the requested fade period and then switch off when
            # Minimum brightness is zero.
            if rgb is None:
                if floor_percent > 0:
                    _LOGGER.debug(
                        "Light %s cannot hold minimum %.1f%% because no previous RGB is known",
                        entity_id,
                        floor_percent,
                    )
                    self._black_faded.add(entity_id)
                    return
                if duration > 0:
                    await asyncio.sleep(duration)
                if off_delay > 0:
                    self._previews[entity_id] = {
                        **self._previews.get(entity_id, {}),
                        "state": "waiting_off",
                    }
                    await asyncio.sleep(off_delay)
                if not self._running or not self._black_state.get(entity_id, False):
                    return
                off = LightCommand(False)
                self._queue_command(entity_id, off, normal=False)
                await self._await_fade_command(entity_id, off)
                self._black_faded.add(entity_id)
                return

            if floor_percent > 0:
                target_brightness = max(1, round(255 * floor_percent / 100.0))
            else:
                # Do not ask the device to transition directly to 0. Many light
                # integrations interpret that as OFF and skip the visible fade.
                # 1% keeps it on while its own transition engine dims smoothly.
                target_brightness = max(1, round(255 * 0.01))

            target = LightCommand(
                True,
                rgb=rgb,
                brightness=target_brightness,
                transition=duration,
            )
            self._previews[entity_id] = {
                **self._previews.get(entity_id, {}),
                "output_rgb": list(rgb),
                "brightness": target_brightness,
                "state": "fading",
            }
            _LOGGER.debug(
                "Light %s black fade target=%d (%.1f%% floor) transition=%.2fs rgb=%s",
                entity_id,
                target_brightness,
                floor_percent,
                duration,
                rgb,
            )
            self._queue_command(entity_id, target, normal=False)
            if not await self._await_fade_command(entity_id, target):
                return

            # async_call(blocking=True) confirms that the command was accepted,
            # not that the physical transition has finished. Keep this task alive
            # for the configured duration so a new non-black frame can cancel the
            # pending OFF cleanly.
            if duration > 0:
                await asyncio.sleep(duration)
            if not self._running or not self._black_state.get(entity_id, False):
                return

            if floor_percent > 0:
                self._previews[entity_id] = {
                    **self._previews.get(entity_id, {}),
                    "output_rgb": list(rgb),
                    "brightness": target_brightness,
                    "state": "floor",
                }
                _LOGGER.debug(
                    "Light %s black fade completed at minimum %.1f%% (%d)",
                    entity_id,
                    floor_percent,
                    target_brightness,
                )
            else:
                if off_delay > 0:
                    self._previews[entity_id] = {
                        **self._previews.get(entity_id, {}),
                        "output_rgb": list(rgb),
                        "brightness": target_brightness,
                        "state": "waiting_off",
                    }
                    _LOGGER.debug(
                        "Light %s reached 1%%; waiting %.2fs before OFF",
                        entity_id,
                        off_delay,
                    )
                    await asyncio.sleep(off_delay)
                    if not self._running or not self._black_state.get(entity_id, False):
                        return
                off = LightCommand(False)
                self._queue_command(entity_id, off, normal=False)
                if not await self._await_fade_command(entity_id, off):
                    return
                self._previews[entity_id] = {
                    **self._previews.get(entity_id, {}),
                    "output_rgb": [0, 0, 0],
                    "brightness": 0,
                    "state": "off",
                }
                _LOGGER.debug("Light %s black fade completed -> OFF", entity_id)

            self._black_faded.add(entity_id)
        except asyncio.CancelledError:
            raise

    def _queue_command(
        self, entity_id: str, command: LightCommand, *, normal: bool
    ) -> None:
        """Replace a stale pending command; only the newest command survives."""
        now = monotonic()
        if entity_id in self._pending:
            self._replaced_frames[entity_id] += 1
        self._pending[entity_id] = command
        self._last_queued[entity_id] = command
        self._record_timestamp(self._queued_times[entity_id], now)
        if normal:
            self._last_normal_queued_at[entity_id] = now
        if event := self._light_events.get(entity_id):
            event.set()

    async def _light_worker(self, entity_id: str, event: asyncio.Event) -> None:
        while self._running:
            await event.wait()
            event.clear()
            command = self._pending.pop(entity_id, None)
            if command is None:
                continue

            started = monotonic()
            try:
                if not command.on:
                    data: dict[str, Any] = {ATTR_ENTITY_ID: entity_id}
                    _LOGGER.debug("light.turn_off light=%s data=%s", entity_id, data)
                    await self.hass.services.async_call(
                        LIGHT_DOMAIN, SERVICE_TURN_OFF, data, blocking=True
                    )
                else:
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

                finished = monotonic()
                latency_ms = (finished - started) * 1000.0
                self._last_successful[entity_id] = command
                self._last_latency_ms[entity_id] = latency_ms
                self._record_timestamp(self._successful_times[entity_id], finished)
                self._record_latency(self._latency_samples[entity_id], latency_ms)
                self._light_last_errors.pop(entity_id, None)
                if result_event := self._light_result_events.get(entity_id):
                    result_event.set()
            except asyncio.CancelledError:
                raise
            except Exception as exc:  # Keep one bad light from killing sync.
                self._light_last_errors[entity_id] = str(exc)
                self._light_error_count[entity_id] += 1
                # If this was still the latest desired command, clear it so an
                # unchanged future frame can retry instead of being suppressed.
                if self._last_queued.get(entity_id) == command:
                    self._last_queued.pop(entity_id, None)
                now = monotonic()
                last_log = self._light_last_error_log_at.get(entity_id, 0.0)
                if result_event := self._light_result_events.get(entity_id):
                    result_event.set()
                if now - last_log >= 30:
                    _LOGGER.warning("Light update failed for %s: %s", entity_id, exc)
                    self._light_last_error_log_at[entity_id] = now

    @staticmethod
    def _record_timestamp(bucket: deque[float], now: float) -> None:
        bucket.append(now)
        cutoff = now - RATE_WINDOW_SECONDS
        while bucket and bucket[0] < cutoff:
            bucket.popleft()

    @staticmethod
    def _record_latency(bucket: deque[float], latency_ms: float) -> None:
        bucket.append(latency_ms)
        while len(bucket) > 30:
            bucket.popleft()

    @staticmethod
    def _prune_values(bucket: deque[float], now: float, *, value_is_timestamp: bool) -> None:
        if not value_is_timestamp:
            while len(bucket) > 30:
                bucket.popleft()
            return
        cutoff = now - RATE_WINDOW_SECONDS
        while bucket and bucket[0] < cutoff:
            bucket.popleft()

    @staticmethod
    def _rolling_rate(bucket: deque[float], now: float) -> float:
        cutoff = now - RATE_WINDOW_SECONDS
        while bucket and bucket[0] < cutoff:
            bucket.popleft()
        if len(bucket) < 2:
            return 0.0
        span = bucket[-1] - bucket[0]
        if span <= 0:
            return 0.0
        return (len(bucket) - 1) / span
