"""Versioned profile configuration for Ambilight Sync."""

from __future__ import annotations

from copy import deepcopy
from typing import Any

from .const import (
    COLOR_MODES,
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
    DEFAULT_BLACK_HOLD,
    DEFAULT_BLACK_THRESHOLD,
    DEFAULT_BRIGHTNESS,
    DEFAULT_COLOR_MODE,
    DEFAULT_CORNER_INFLUENCE,
    DEFAULT_FADE_TO_BLACK,
    DEFAULT_MINIMUM_BRIGHTNESS,
    DEFAULT_OFF_DELAY,
    DEFAULT_POLL_RATE,
    DEFAULT_POSITION_MODE,
    DEFAULT_POSITION_X,
    DEFAULT_POSITION_Y,
    DEFAULT_POSITION_FALLOFF,
    DEFAULT_RESTORE_ON_STOP,
    DEFAULT_SCENE_CUT_THRESHOLD,
    DEFAULT_SCENE_CUT_TRANSITION,
    DEFAULT_SATURATION,
    DEFAULT_SMOOTHING,
    DEFAULT_SOURCE,
    DEFAULT_THRESHOLD,
    DEFAULT_TRANSITION,
    DEFAULT_UPDATE_RATE,
    MAX_BLACK_THRESHOLD,
    MAX_POSITION_FALLOFF,
    MAX_UPDATE_RATE,
    MIN_BLACK_THRESHOLD,
    MIN_POSITION_FALLOFF,
    MIN_UPDATE_RATE,
    POSITION_MODE_MANUAL,
    POSITION_MODE_SPATIAL,
    POSITION_MODES,
    SOURCES,
    ZONE_ALL,
    ZONE_BOTTOM,
    ZONE_CONFIG_KEYS,
    ZONE_LEFT,
    ZONE_RIGHT,
    ZONE_TOP,
    ZONES,
)

PROFILE_SCHEMA_VERSION = 5
CONF_PROFILE_CONFIG = "profile_config"
DEFAULT_PRESET_ID = "default"
DEFAULT_PRESET_NAME = "Default"

OVERRIDABLE_SETTINGS = (
    CONF_COLOR_MODE,
    CONF_UPDATE_RATE,
    CONF_SMOOTHING,
    CONF_BRIGHTNESS,
    CONF_MINIMUM_BRIGHTNESS,
    CONF_SATURATION,
    CONF_THRESHOLD,
    CONF_BLACK_THRESHOLD,
    CONF_TRANSITION,
    CONF_BLACK_HOLD,
    CONF_FADE_TO_BLACK,
    CONF_OFF_DELAY,
    CONF_SCENE_CUT_THRESHOLD,
    CONF_SCENE_CUT_TRANSITION,
    CONF_CORNER_INFLUENCE,
)


def _float(raw: Any, default: float) -> float:
    try:
        return float(raw)
    except (TypeError, ValueError):
        return default


def normalize_settings(raw: Any) -> dict[str, Any]:
    """Validate and clamp global settings."""
    if not isinstance(raw, dict):
        raw = {}

    source = str(raw.get(CONF_SOURCE, DEFAULT_SOURCE))
    if source not in SOURCES:
        source = DEFAULT_SOURCE

    color_mode = str(raw.get(CONF_COLOR_MODE, DEFAULT_COLOR_MODE))
    if color_mode not in COLOR_MODES:
        color_mode = DEFAULT_COLOR_MODE

    update_rate = max(
        MIN_UPDATE_RATE,
        min(MAX_UPDATE_RATE, _float(raw.get(CONF_UPDATE_RATE), DEFAULT_UPDATE_RATE)),
    )
    # Old profile schemas had only update_rate. Preserve their effective cadence
    # by using it as the initial TV polling rate when poll_rate is absent.
    poll_rate = max(
        MIN_UPDATE_RATE,
        min(
            MAX_UPDATE_RATE,
            _float(raw.get(CONF_POLL_RATE), _float(raw.get(CONF_UPDATE_RATE), DEFAULT_POLL_RATE)),
        ),
    )
    smoothing = max(0.0, min(95.0, _float(raw.get(CONF_SMOOTHING), DEFAULT_SMOOTHING)))
    brightness = max(10.0, min(100.0, _float(raw.get(CONF_BRIGHTNESS), DEFAULT_BRIGHTNESS)))
    minimum_brightness = max(
        0.0,
        min(100.0, _float(raw.get(CONF_MINIMUM_BRIGHTNESS), DEFAULT_MINIMUM_BRIGHTNESS)),
    )
    minimum_brightness = min(minimum_brightness, brightness)
    saturation = max(0.0, min(150.0, _float(raw.get(CONF_SATURATION), DEFAULT_SATURATION)))
    threshold = max(0.0, min(100.0, _float(raw.get(CONF_THRESHOLD), DEFAULT_THRESHOLD)))
    black_threshold = max(
        MIN_BLACK_THRESHOLD,
        min(MAX_BLACK_THRESHOLD, _float(raw.get(CONF_BLACK_THRESHOLD), DEFAULT_BLACK_THRESHOLD)),
    )
    transition = max(0.0, min(2.0, _float(raw.get(CONF_TRANSITION), DEFAULT_TRANSITION)))
    black_hold = max(0.0, min(1000.0, _float(raw.get(CONF_BLACK_HOLD), DEFAULT_BLACK_HOLD)))
    fade_to_black = max(0.0, min(10.0, _float(raw.get(CONF_FADE_TO_BLACK), DEFAULT_FADE_TO_BLACK)))
    off_delay = max(0.0, min(10.0, _float(raw.get(CONF_OFF_DELAY), DEFAULT_OFF_DELAY)))
    scene_cut_threshold = max(0.0, min(100.0, _float(raw.get(CONF_SCENE_CUT_THRESHOLD), DEFAULT_SCENE_CUT_THRESHOLD)))
    scene_cut_transition = max(0.0, min(2.0, _float(raw.get(CONF_SCENE_CUT_TRANSITION), DEFAULT_SCENE_CUT_TRANSITION)))
    corner_influence = max(
        0.0,
        min(100.0, _float(raw.get(CONF_CORNER_INFLUENCE), DEFAULT_CORNER_INFLUENCE)),
    )
    restore = bool(raw.get(CONF_RESTORE_ON_STOP, DEFAULT_RESTORE_ON_STOP))

    return {
        CONF_SOURCE: source,
        CONF_COLOR_MODE: color_mode,
        CONF_POLL_RATE: poll_rate,
        CONF_UPDATE_RATE: update_rate,
        CONF_SMOOTHING: smoothing,
        CONF_BRIGHTNESS: brightness,
        CONF_MINIMUM_BRIGHTNESS: minimum_brightness,
        CONF_SATURATION: saturation,
        CONF_THRESHOLD: threshold,
        CONF_BLACK_THRESHOLD: black_threshold,
        CONF_TRANSITION: transition,
        CONF_BLACK_HOLD: black_hold,
        CONF_FADE_TO_BLACK: fade_to_black,
        CONF_OFF_DELAY: off_delay,
        CONF_SCENE_CUT_THRESHOLD: scene_cut_threshold,
        CONF_SCENE_CUT_TRANSITION: scene_cut_transition,
        CONF_CORNER_INFLUENCE: corner_influence,
        CONF_RESTORE_ON_STOP: restore,
    }


def normalize_overrides(raw: Any, global_settings: dict[str, Any]) -> dict[str, Any]:
    """Normalize only explicitly overridden per-light settings."""
    if not isinstance(raw, dict):
        return {}

    result: dict[str, Any] = {}
    if CONF_COLOR_MODE in raw:
        mode = str(raw[CONF_COLOR_MODE])
        if mode in COLOR_MODES:
            result[CONF_COLOR_MODE] = mode

    ranges = {
        CONF_UPDATE_RATE: (MIN_UPDATE_RATE, MAX_UPDATE_RATE),
        CONF_SMOOTHING: (0.0, 95.0),
        CONF_BRIGHTNESS: (10.0, 100.0),
        CONF_MINIMUM_BRIGHTNESS: (0.0, 100.0),
        CONF_SATURATION: (0.0, 150.0),
        CONF_THRESHOLD: (0.0, 100.0),
        CONF_BLACK_THRESHOLD: (MIN_BLACK_THRESHOLD, MAX_BLACK_THRESHOLD),
        CONF_TRANSITION: (0.0, 2.0),
        CONF_BLACK_HOLD: (0.0, 1000.0),
        CONF_FADE_TO_BLACK: (0.0, 10.0),
        CONF_OFF_DELAY: (0.0, 10.0),
        CONF_SCENE_CUT_THRESHOLD: (0.0, 100.0),
        CONF_SCENE_CUT_TRANSITION: (0.0, 2.0),
        CONF_CORNER_INFLUENCE: (0.0, 100.0),
    }
    for key, (minimum, maximum) in ranges.items():
        if key not in raw:
            continue
        try:
            value = float(raw[key])
        except (TypeError, ValueError):
            continue
        result[key] = max(minimum, min(maximum, value))
    return result


def effective_settings(global_settings: dict[str, Any], overrides: Any) -> dict[str, Any]:
    """Return normalized settings after applying per-light overrides."""
    merged = dict(global_settings)
    if isinstance(overrides, dict):
        for key in OVERRIDABLE_SETTINGS:
            if key in overrides:
                merged[key] = overrides[key]
    return normalize_settings(merged)


def normalize_sources(raw: Any) -> list[dict[str, Any]]:
    """Validate weighted source zones for one light."""
    if not isinstance(raw, list):
        raw = []

    weights: dict[str, float] = {}
    for item in raw:
        if not isinstance(item, dict):
            continue
        zone = str(item.get("zone", ""))
        if zone not in ZONES:
            continue
        try:
            weight = float(item.get("weight", 100.0))
        except (TypeError, ValueError):
            continue
        if weight <= 0:
            continue
        weights[zone] = min(1000.0, weights.get(zone, 0.0) + weight)

    return [{"zone": zone, "weight": weight} for zone, weight in weights.items()]


def normalize_position_mode(raw: Any) -> str:
    mode = str(raw or DEFAULT_POSITION_MODE)
    return mode if mode in POSITION_MODES else DEFAULT_POSITION_MODE


def normalize_position(value: Any, default: float = 0.0) -> float:
    return max(-100.0, min(100.0, _float(value, default)))


def spatial_sources(x: float, y: float) -> list[dict[str, float]]:
    """Convert X/Y placement into weighted Ambilight edge sources.

    X/Y use -100..+100 with the TV center at 0/0. Edge weights follow the
    direction from the center. A small center region blends in Whole screen so
    a lamp placed close to the center does not arbitrarily prefer an edge.
    """
    x = normalize_position(x)
    y = normalize_position(y)
    weights: list[tuple[str, float]] = []

    if x < 0:
        weights.append((ZONE_LEFT, abs(x)))
    elif x > 0:
        weights.append((ZONE_RIGHT, abs(x)))

    if y < 0:
        weights.append((ZONE_TOP, abs(y)))
    elif y > 0:
        weights.append((ZONE_BOTTOM, abs(y)))

    # Within roughly the central third of the coordinate plane, Whole screen
    # gradually contributes. At 0/0 it is the only source.
    center = max(0.0, 1.0 - max(abs(x), abs(y)) / 35.0) * 100.0
    if center > 0:
        weights.append((ZONE_ALL, center))

    if not weights:
        return [{"zone": ZONE_ALL, "weight": 100.0}]
    return [{"zone": zone, "weight": weight} for zone, weight in weights if weight > 0]


def normalize_lights(raw: Any, global_settings: dict[str, Any]) -> dict[str, dict[str, Any]]:
    """Normalize per-light mapping, spatial placement and overrides."""
    if not isinstance(raw, dict):
        return {}

    result: dict[str, dict[str, Any]] = {}
    for entity_id, config in raw.items():
        if not isinstance(entity_id, str) or not entity_id.startswith("light."):
            continue
        if not isinstance(config, dict):
            config = {}

        mode = normalize_position_mode(config.get(CONF_POSITION_MODE))
        sources = normalize_sources(config.get("sources"))
        # Existing v0.2.x entries have no position_mode and therefore normalize
        # to Manual. Preserve their weighted sources byte-for-byte in meaning.
        if mode == POSITION_MODE_MANUAL and not sources:
            continue
        if mode == POSITION_MODE_SPATIAL and not sources:
            # Keep a harmless Manual fallback if the user switches modes later.
            sources = [{"zone": ZONE_ALL, "weight": 100.0}]

        result[entity_id] = {
            CONF_POSITION_MODE: mode,
            CONF_POSITION_X: normalize_position(config.get(CONF_POSITION_X), DEFAULT_POSITION_X),
            CONF_POSITION_Y: normalize_position(config.get(CONF_POSITION_Y), DEFAULT_POSITION_Y),
            CONF_POSITION_FALLOFF: max(MIN_POSITION_FALLOFF, min(MAX_POSITION_FALLOFF, _float(config.get(CONF_POSITION_FALLOFF), DEFAULT_POSITION_FALLOFF))),
            "sources": sources,
            "overrides": normalize_overrides(config.get("overrides"), global_settings),
        }
    return result


def normalize_profile_config(raw: Any) -> dict[str, Any]:
    """Normalize the current versioned profile configuration."""
    if not isinstance(raw, dict):
        raw = {}

    raw_presets = raw.get("presets")
    if not isinstance(raw_presets, dict):
        raw_presets = {}

    presets: dict[str, dict[str, Any]] = {}
    for preset_id, preset in raw_presets.items():
        if not isinstance(preset_id, str) or not preset_id.strip() or not isinstance(preset, dict):
            continue
        name = str(preset.get("name") or preset_id).strip()[:80] or preset_id
        global_settings = normalize_settings(preset.get("global"))
        presets[preset_id] = {
            "name": name,
            "global": global_settings,
            "lights": normalize_lights(preset.get("lights"), global_settings),
        }

    if not presets:
        global_settings = normalize_settings({})
        presets[DEFAULT_PRESET_ID] = {
            "name": DEFAULT_PRESET_NAME,
            "global": global_settings,
            "lights": {},
        }

    active = str(raw.get("active_preset") or "")
    if active not in presets:
        active = next(iter(presets))

    return {
        "schema_version": PROFILE_SCHEMA_VERSION,
        "active_preset": active,
        "presets": presets,
    }


def legacy_profile_config(data: dict[str, Any], options: dict[str, Any]) -> dict[str, Any]:
    """Convert the flat v0.1/v0.2 configuration into one Default preset."""
    global_settings = normalize_settings(options)
    lights: dict[str, dict[str, Any]] = {}

    for zone, key in ZONE_CONFIG_KEYS.items():
        values = options.get(key, data.get(key, [])) or []
        if not isinstance(values, list):
            continue
        for entity_id in values:
            if isinstance(entity_id, str) and entity_id.startswith("light."):
                lights[entity_id] = {
                    CONF_POSITION_MODE: POSITION_MODE_MANUAL,
                    CONF_POSITION_X: 0.0,
                    CONF_POSITION_Y: 0.0,
                    CONF_POSITION_FALLOFF: DEFAULT_POSITION_FALLOFF,
                    "sources": [{"zone": zone, "weight": 100.0}],
                    "overrides": {},
                }

    return normalize_profile_config(
        {
            "schema_version": PROFILE_SCHEMA_VERSION,
            "active_preset": DEFAULT_PRESET_ID,
            "presets": {
                DEFAULT_PRESET_ID: {
                    "name": DEFAULT_PRESET_NAME,
                    "global": global_settings,
                    "lights": lights,
                }
            },
        }
    )


def profile_config_from_entry(entry) -> dict[str, Any]:
    """Load profile configuration, migrating legacy/profile schemas in memory."""
    options = dict(entry.options)
    raw = options.get(CONF_PROFILE_CONFIG)
    if isinstance(raw, dict):
        return normalize_profile_config(deepcopy(raw))
    return legacy_profile_config(dict(entry.data), options)


def active_preset(profile_config: dict[str, Any]) -> tuple[str, dict[str, Any]]:
    """Return active preset id and preset data from a normalized config."""
    normalized = normalize_profile_config(profile_config)
    preset_id = normalized["active_preset"]
    return preset_id, normalized["presets"][preset_id]


def resolve_preset(profile_config: dict[str, Any], value: str) -> str | None:
    """Resolve a preset by id first, then by case-insensitive display name."""
    normalized = normalize_profile_config(profile_config)
    if value in normalized["presets"]:
        return value
    folded = value.casefold()
    for preset_id, preset in normalized["presets"].items():
        if str(preset.get("name", "")).casefold() == folded:
            return preset_id
    return None
