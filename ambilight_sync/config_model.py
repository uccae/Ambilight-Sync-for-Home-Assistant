"""Versioned profile configuration for Ambilight Sync."""

from __future__ import annotations

from copy import deepcopy
from typing import Any

from .const import (
    COLOR_MODES,
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
    DEFAULT_BLACK_HOLD,
    DEFAULT_BRIGHTNESS,
    DEFAULT_COLOR_MODE,
    DEFAULT_CORNER_INFLUENCE,
    DEFAULT_FADE_TO_BLACK,
    DEFAULT_MINIMUM_BRIGHTNESS,
    DEFAULT_POLL_RATE,
    DEFAULT_RESTORE_ON_STOP,
    DEFAULT_SATURATION,
    DEFAULT_SMOOTHING,
    DEFAULT_SOURCE,
    DEFAULT_THRESHOLD,
    DEFAULT_TRANSITION,
    DEFAULT_UPDATE_RATE,
    MAX_UPDATE_RATE,
    MIN_UPDATE_RATE,
    SOURCES,
    ZONES,
    ZONE_CONFIG_KEYS,
)

PROFILE_SCHEMA_VERSION = 3
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
    CONF_TRANSITION,
    CONF_BLACK_HOLD,
    CONF_FADE_TO_BLACK,
    CONF_CORNER_INFLUENCE,
)


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

    # v0.2.0b used one value for both TV polling and light output.  When
    # loading that schema, seed the new poll rate from the old update rate so
    # existing presets behave exactly as before until the user changes it.
    update_rate = max(
        MIN_UPDATE_RATE,
        min(MAX_UPDATE_RATE, float(raw.get(CONF_UPDATE_RATE, DEFAULT_UPDATE_RATE))),
    )
    poll_rate = max(
        MIN_UPDATE_RATE,
        min(
            MAX_UPDATE_RATE,
            float(raw.get(CONF_POLL_RATE, raw.get(CONF_UPDATE_RATE, DEFAULT_POLL_RATE))),
        ),
    )
    smoothing = max(0.0, min(95.0, float(raw.get(CONF_SMOOTHING, DEFAULT_SMOOTHING))))
    brightness = max(10.0, min(100.0, float(raw.get(CONF_BRIGHTNESS, DEFAULT_BRIGHTNESS))))
    minimum_brightness = max(
        0.0,
        min(100.0, float(raw.get(CONF_MINIMUM_BRIGHTNESS, DEFAULT_MINIMUM_BRIGHTNESS))),
    )
    minimum_brightness = min(minimum_brightness, brightness)
    saturation = max(0.0, min(150.0, float(raw.get(CONF_SATURATION, DEFAULT_SATURATION))))
    threshold = max(0.0, min(100.0, float(raw.get(CONF_THRESHOLD, DEFAULT_THRESHOLD))))
    transition = max(0.0, min(2.0, float(raw.get(CONF_TRANSITION, DEFAULT_TRANSITION))))
    black_hold = max(0.0, min(1000.0, float(raw.get(CONF_BLACK_HOLD, DEFAULT_BLACK_HOLD))))
    fade_to_black = max(
        0.0, min(5.0, float(raw.get(CONF_FADE_TO_BLACK, DEFAULT_FADE_TO_BLACK)))
    )
    corner_influence = max(
        0.0,
        min(100.0, float(raw.get(CONF_CORNER_INFLUENCE, DEFAULT_CORNER_INFLUENCE))),
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
        CONF_TRANSITION: transition,
        CONF_BLACK_HOLD: black_hold,
        CONF_FADE_TO_BLACK: fade_to_black,
        CONF_CORNER_INFLUENCE: corner_influence,
        CONF_RESTORE_ON_STOP: restore,
    }


def normalize_overrides(raw: Any, global_settings: dict[str, Any]) -> dict[str, Any]:
    """Normalize only explicitly overridden per-light settings.

    Values are clamped independently here. Cross-setting constraints such as
    minimum brightness <= maximum brightness are applied later by
    ``effective_settings`` so an override keeps its intent if global values
    change in another preset edit.
    """
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
        CONF_TRANSITION: (0.0, 2.0),
        CONF_BLACK_HOLD: (0.0, 1000.0),
        CONF_FADE_TO_BLACK: (0.0, 5.0),
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

    # Merge duplicate zones to make hand-edited configurations harmless.
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


def normalize_lights(raw: Any, global_settings: dict[str, Any]) -> dict[str, dict[str, Any]]:
    """Normalize per-light mixer and override configuration."""
    if not isinstance(raw, dict):
        return {}

    result: dict[str, dict[str, Any]] = {}
    for entity_id, config in raw.items():
        if not isinstance(entity_id, str) or not entity_id.startswith("light."):
            continue
        if not isinstance(config, dict):
            config = {}
        sources = normalize_sources(config.get("sources"))
        if not sources:
            # A light without a source cannot produce a useful command.
            continue
        result[entity_id] = {
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

    # Legacy UI allowed one zone per light. Preserve that assignment exactly.
    for zone, key in ZONE_CONFIG_KEYS.items():
        values = options.get(key, data.get(key, [])) or []
        if not isinstance(values, list):
            continue
        for entity_id in values:
            if isinstance(entity_id, str) and entity_id.startswith("light."):
                lights[entity_id] = {
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
    """Load profile configuration, migrating legacy options in memory if needed."""
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
