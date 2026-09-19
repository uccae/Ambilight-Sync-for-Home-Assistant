"""WebSocket API for the Ambilight Sync sidebar."""

from __future__ import annotations

from typing import Any

import probatio
from homeassistant.components import websocket_api
from homeassistant.core import HomeAssistant, callback

from .const import (
    COLOR_MODES,
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
    DOMAIN,
    MAX_UPDATE_RATE,
    SOURCES,
    ZONE_CONFIG_KEYS,
)
from .manager import AmbilightSyncManager

_FLAG = "_sidebar_websocket_registered"


def _zones_from_entry(entry) -> dict[str, list[str]]:
    data = dict(entry.data)
    options = dict(entry.options)
    return {
        zone: list(options.get(key, data.get(key, [])) or [])
        for zone, key in ZONE_CONFIG_KEYS.items()
    }


def _settings_from_entry(entry) -> dict[str, Any]:
    options = dict(entry.options)
    return {
        CONF_SOURCE: str(options.get(CONF_SOURCE, DEFAULT_SOURCE)),
        CONF_COLOR_MODE: str(options.get(CONF_COLOR_MODE, DEFAULT_COLOR_MODE)),
        CONF_UPDATE_RATE: float(options.get(CONF_UPDATE_RATE, DEFAULT_UPDATE_RATE)),
        CONF_SMOOTHING: float(options.get(CONF_SMOOTHING, DEFAULT_SMOOTHING)),
        CONF_BRIGHTNESS: float(options.get(CONF_BRIGHTNESS, DEFAULT_BRIGHTNESS)),
        CONF_MINIMUM_BRIGHTNESS: float(
            options.get(CONF_MINIMUM_BRIGHTNESS, DEFAULT_MINIMUM_BRIGHTNESS)
        ),
        CONF_SATURATION: float(options.get(CONF_SATURATION, DEFAULT_SATURATION)),
        CONF_THRESHOLD: float(options.get(CONF_THRESHOLD, DEFAULT_THRESHOLD)),
        CONF_TRANSITION: float(options.get(CONF_TRANSITION, DEFAULT_TRANSITION)),
        CONF_BLACK_HOLD: float(options.get(CONF_BLACK_HOLD, DEFAULT_BLACK_HOLD)),
        CONF_FADE_TO_BLACK: float(
            options.get(CONF_FADE_TO_BLACK, DEFAULT_FADE_TO_BLACK)
        ),
        CONF_CORNER_INFLUENCE: float(
            options.get(CONF_CORNER_INFLUENCE, DEFAULT_CORNER_INFLUENCE)
        ),
        CONF_RESTORE_ON_STOP: bool(
            options.get(CONF_RESTORE_ON_STOP, DEFAULT_RESTORE_ON_STOP)
        ),
    }


def _status(hass: HomeAssistant, entry_id: str) -> dict[str, Any]:
    manager: AmbilightSyncManager | None = hass.data.get(DOMAIN, {}).get(entry_id)
    if manager is None:
        return {"running": False, "last_error": "Integration is not loaded"}
    return {
        "running": manager.is_running,
        "last_error": manager.last_error,
        "lights": manager.light_count,
        "update_rate": manager.update_rate,
    }


def _serialize_entry(hass: HomeAssistant, entry) -> dict[str, Any]:
    return {
        "entry_id": entry.entry_id,
        "title": entry.title,
        "zones": _zones_from_entry(entry),
        "settings": _settings_from_entry(entry),
        "status": _status(hass, entry.entry_id),
    }


def _normalize_zones(raw: Any) -> dict[str, list[str]]:
    if not isinstance(raw, dict):
        raise ValueError("zones must be an object")

    normalized: dict[str, list[str]] = {}
    used: set[str] = set()
    for zone in ZONE_CONFIG_KEYS:
        values = raw.get(zone, [])
        if not isinstance(values, list):
            raise ValueError(f"{zone} must be a list")
        clean: list[str] = []
        for entity_id in values:
            if not isinstance(entity_id, str) or not entity_id.startswith("light."):
                raise ValueError(f"Invalid light entity: {entity_id}")
            if entity_id in used:
                raise ValueError(f"{entity_id} is assigned to more than one zone")
            used.add(entity_id)
            clean.append(entity_id)
        normalized[zone] = clean
    return normalized


def _normalize_settings(raw: Any) -> dict[str, Any]:
    if not isinstance(raw, dict):
        raise ValueError("settings must be an object")

    source = str(raw.get(CONF_SOURCE, DEFAULT_SOURCE))
    if source not in SOURCES:
        raise ValueError("Unsupported Ambilight source")

    color_mode = str(raw.get(CONF_COLOR_MODE, DEFAULT_COLOR_MODE))
    if color_mode not in COLOR_MODES:
        raise ValueError("Unsupported color mode")

    update_rate = max(
        1.0, min(MAX_UPDATE_RATE, float(raw.get(CONF_UPDATE_RATE, DEFAULT_UPDATE_RATE)))
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


@callback
def async_register_websocket(hass: HomeAssistant) -> None:
    """Register commands once per HA process."""
    domain_data = hass.data.setdefault(DOMAIN, {})
    if domain_data.get(_FLAG):
        return
    websocket_api.async_register_command(hass, ws_get_config)
    websocket_api.async_register_command(hass, ws_save_config)
    websocket_api.async_register_command(hass, ws_get_status)
    domain_data[_FLAG] = True


@callback
@websocket_api.require_admin
@websocket_api.websocket_command(
    {probatio.Required("type"): "ambilight_sync/get_config"}
)
def ws_get_config(
    hass: HomeAssistant,
    connection: websocket_api.ActiveConnection,
    msg: dict[str, Any],
) -> None:
    entries = hass.config_entries.async_entries(DOMAIN)
    connection.send_result(
        msg["id"], {"entries": [_serialize_entry(hass, entry) for entry in entries]}
    )


@callback
@websocket_api.require_admin
@websocket_api.websocket_command(
    {
        probatio.Required("type"): "ambilight_sync/get_status",
        probatio.Required("entry_id"): str,
    }
)
def ws_get_status(
    hass: HomeAssistant,
    connection: websocket_api.ActiveConnection,
    msg: dict[str, Any],
) -> None:
    entry = hass.config_entries.async_get_entry(msg["entry_id"])
    if entry is None or entry.domain != DOMAIN:
        connection.send_error(
            msg["id"], websocket_api.const.ERR_NOT_FOUND, "Ambilight Sync entry not found"
        )
        return
    connection.send_result(msg["id"], _status(hass, entry.entry_id))


@websocket_api.require_admin
@websocket_api.websocket_command(
    {
        probatio.Required("type"): "ambilight_sync/save_config",
        probatio.Required("entry_id"): str,
        probatio.Required("zones"): dict,
        probatio.Required("settings"): dict,
    }
)
@websocket_api.async_response
async def ws_save_config(
    hass: HomeAssistant,
    connection: websocket_api.ActiveConnection,
    msg: dict[str, Any],
) -> None:
    entry = hass.config_entries.async_get_entry(msg["entry_id"])
    if entry is None or entry.domain != DOMAIN:
        connection.send_error(
            msg["id"], websocket_api.const.ERR_NOT_FOUND, "Ambilight Sync entry not found"
        )
        return

    try:
        zones = _normalize_zones(msg["zones"])
        settings = _normalize_settings(msg["settings"])
    except (TypeError, ValueError) as exc:
        connection.send_error(
            msg["id"], websocket_api.const.ERR_INVALID_FORMAT, str(exc)
        )
        return

    options = dict(entry.options)
    for zone, key in ZONE_CONFIG_KEYS.items():
        options[key] = zones[zone]
    options.update(settings)
    hass.config_entries.async_update_entry(entry, options=options)

    manager: AmbilightSyncManager | None = hass.data.get(DOMAIN, {}).get(entry.entry_id)
    if manager is not None:
        await manager.async_apply_configuration(zones, settings)

    connection.send_result(msg["id"], _serialize_entry(hass, entry))
