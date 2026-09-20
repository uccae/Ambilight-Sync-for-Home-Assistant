"""WebSocket API for the Ambilight Sync sidebar."""

from __future__ import annotations

from copy import deepcopy
from typing import Any

import probatio
from homeassistant.components import websocket_api
from homeassistant.core import HomeAssistant, callback

from .config_model import (
    CONF_PROFILE_CONFIG,
    active_preset,
    normalize_profile_config,
    normalize_settings,
    profile_config_from_entry,
    resolve_preset,
)
from .const import DOMAIN, ZONE_CONFIG_KEYS
from .manager import AmbilightSyncManager

_FLAG = "_sidebar_websocket_registered"


def _status(hass: HomeAssistant, entry_id: str) -> dict[str, Any]:
    manager: AmbilightSyncManager | None = hass.data.get(DOMAIN, {}).get(entry_id)
    if manager is None:
        return {
            "running": False,
            "last_error": "Integration is not loaded",
            "previews": {},
        }
    return {
        "running": manager.is_running,
        "last_error": manager.last_error,
        "lights": manager.light_count,
        "poll_rate": manager.poll_rate,
        "update_rate": manager.update_rate,
        "active_preset": manager.active_preset_id,
        "active_preset_name": manager.active_preset_name,
        "previews": manager.previews,
    }


def _legacy_zones_from_profile(profile_config: dict[str, Any]) -> dict[str, list[str]]:
    """Expose simple one-zone assignments for a cached v0.1 panel, if possible."""
    _, preset = active_preset(profile_config)
    result = {zone: [] for zone in ZONE_CONFIG_KEYS}
    for entity_id, config in dict(preset.get("lights", {})).items():
        sources = list(config.get("sources", []))
        if len(sources) == 1 and sources[0].get("zone") in result:
            result[sources[0]["zone"]].append(entity_id)
    return result


def _serialize_entry(hass: HomeAssistant, entry) -> dict[str, Any]:
    profile_config = profile_config_from_entry(entry)
    _, preset = active_preset(profile_config)
    return {
        "entry_id": entry.entry_id,
        "title": entry.title,
        "profile_config": profile_config,
        # Legacy fields keep an older cached sidebar functional long enough for
        # the cache-busted current panel to load.
        "zones": _legacy_zones_from_profile(profile_config),
        "settings": dict(preset.get("global", {})),
        "status": _status(hass, entry.entry_id),
    }


async def _store_profile_config(
    hass: HomeAssistant, entry, profile_config: dict[str, Any]
) -> dict[str, Any]:
    normalized = normalize_profile_config(profile_config)
    options = dict(entry.options)
    options[CONF_PROFILE_CONFIG] = normalized
    hass.config_entries.async_update_entry(entry, options=options)

    manager: AmbilightSyncManager | None = hass.data.get(DOMAIN, {}).get(entry.entry_id)
    if manager is not None:
        await manager.async_apply_profile_config(normalized)
    return normalized


@callback
def async_register_websocket(hass: HomeAssistant) -> None:
    """Register commands once per HA process."""
    domain_data = hass.data.setdefault(DOMAIN, {})
    if domain_data.get(_FLAG):
        return
    websocket_api.async_register_command(hass, ws_get_config)
    websocket_api.async_register_command(hass, ws_get_status)
    websocket_api.async_register_command(hass, ws_save_profile_config)
    websocket_api.async_register_command(hass, ws_activate_preset)
    websocket_api.async_register_command(hass, ws_save_config_legacy)
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
        probatio.Required("type"): "ambilight_sync/save_profile_config",
        probatio.Required("entry_id"): str,
        probatio.Required("profile_config"): dict,
    }
)
@websocket_api.async_response
async def ws_save_profile_config(
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
        await _store_profile_config(hass, entry, deepcopy(msg["profile_config"]))
    except (TypeError, ValueError) as exc:
        connection.send_error(msg["id"], websocket_api.const.ERR_INVALID_FORMAT, str(exc))
        return

    connection.send_result(msg["id"], _serialize_entry(hass, entry))


@websocket_api.require_admin
@websocket_api.websocket_command(
    {
        probatio.Required("type"): "ambilight_sync/activate_preset",
        probatio.Required("entry_id"): str,
        probatio.Required("preset"): str,
    }
)
@websocket_api.async_response
async def ws_activate_preset(
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

    profile_config = profile_config_from_entry(entry)
    preset_id = resolve_preset(profile_config, msg["preset"])
    if preset_id is None:
        connection.send_error(
            msg["id"], websocket_api.const.ERR_NOT_FOUND, "Preset not found"
        )
        return

    profile_config["active_preset"] = preset_id
    await _store_profile_config(hass, entry, profile_config)
    connection.send_result(msg["id"], _serialize_entry(hass, entry))


# Compatibility endpoint for the previous cached sidebar. It converts the old
# one-zone-per-light form into the active preset rather than discarding data.
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
async def ws_save_config_legacy(
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
        settings = normalize_settings(msg["settings"])
        zones = msg["zones"]
        if not isinstance(zones, dict):
            raise ValueError("zones must be an object")

        lights: dict[str, dict[str, Any]] = {}
        used: set[str] = set()
        for zone in ZONE_CONFIG_KEYS:
            values = zones.get(zone, [])
            if not isinstance(values, list):
                raise ValueError(f"{zone} must be a list")
            for entity_id in values:
                if not isinstance(entity_id, str) or not entity_id.startswith("light."):
                    raise ValueError(f"Invalid light entity: {entity_id}")
                if entity_id in used:
                    raise ValueError(f"{entity_id} is assigned to more than one zone")
                used.add(entity_id)
                lights[entity_id] = {
                    "sources": [{"zone": zone, "weight": 100.0}],
                    "overrides": {},
                }

        profile_config = profile_config_from_entry(entry)
        preset_id, _ = active_preset(profile_config)
        profile_config["presets"][preset_id]["global"] = settings
        profile_config["presets"][preset_id]["lights"] = lights
        await _store_profile_config(hass, entry, profile_config)
    except (TypeError, ValueError) as exc:
        connection.send_error(msg["id"], websocket_api.const.ERR_INVALID_FORMAT, str(exc))
        return

    connection.send_result(msg["id"], _serialize_entry(hass, entry))
