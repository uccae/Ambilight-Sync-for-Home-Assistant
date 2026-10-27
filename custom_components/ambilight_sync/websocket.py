"""WebSocket API for the Ambilight Sync sidebar."""

from __future__ import annotations

from copy import deepcopy
from typing import Any

import voluptuous as vol
from homeassistant.components import websocket_api
from homeassistant.core import HomeAssistant, callback
from homeassistant.helpers import entity_registry as er

from .config_model import (
    CONF_PROFILE_CONFIG,
    OVERRIDABLE_SETTINGS,
    active_preset,
    normalize_profile_config,
    normalize_settings,
    profile_config_from_entry,
    resolve_preset,
)
from .const import CONF_POSITION_MODE, DOMAIN, POSITION_MODE_MANUAL, ZONE_CONFIG_KEYS
from .manager import AmbilightSyncManager
from .capabilities import light_capabilities, copy_light_settings
from .room_store import get_room_store, ENTITY, complete_transaction
from .profile_store import (
    ProfileConflictError, profile_lock, profile_revision, store_profile, store_profile_locked,
)
from .backup import export_backup, prepare_import, apply_import

_FLAG = "_sidebar_websocket_registered"


def _loaded(hass, entry_id):
    entry = hass.config_entries.async_get_entry(entry_id)
    manager = hass.data.get(DOMAIN, {}).get(entry_id)
    if entry is None or entry.domain != DOMAIN or not isinstance(manager, AmbilightSyncManager):
        raise ValueError("Ambilight Sync entry is not loaded")
    return manager


def _status(hass: HomeAssistant, entry_id: str) -> dict[str, Any]:
    manager: AmbilightSyncManager | None = hass.data.get(DOMAIN, {}).get(entry_id)
    if manager is None:
        return {
            "running": False,
            "last_error": "Integration is not loaded",
            "previews": {},
            "tv_preview": None,
            "diagnostics": {},
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
        "tv_preview": manager.tv_preview,
        "diagnostics": manager.diagnostics,
        "profile_revision": profile_revision(profile_config_from_entry(manager.entry)),
        "excluded": list(get_room_store(hass).data["excluded"] if get_room_store(hass) else manager._excluded),
        "identifying": manager._identify_entity,
        "room_revision": get_room_store(hass).revision if get_room_store(hass) else None,
    }


def _legacy_zones_from_profile(profile_config: dict[str, Any]) -> dict[str, list[str]]:
    """Expose simple one-zone assignments for a cached v0.1 panel, if possible."""
    _, preset = active_preset(profile_config)
    result = {zone: [] for zone in ZONE_CONFIG_KEYS}
    for entity_id, config in dict(preset.get("lights", {})).items():
        if config.get(CONF_POSITION_MODE, POSITION_MODE_MANUAL) != POSITION_MODE_MANUAL:
            continue
        sources = list(config.get("sources", []))
        if len(sources) == 1 and sources[0].get("zone") in result:
            result[sources[0]["zone"]].append(entity_id)
    return result


def _serialize_entry(hass: HomeAssistant, entry) -> dict[str, Any]:
    profile_config = profile_config_from_entry(entry)
    room_store = get_room_store(hass)
    if room_store:
        profile_config = room_store.attach(entry.entry_id, profile_config)
    _, preset = active_preset(profile_config)
    return {
        "entry_id": entry.entry_id,
        "title": entry.title,
        "profile_config": profile_config,
        "profile_revision": profile_revision(profile_config_from_entry(entry)),
        "room": room_store.room(entry.entry_id) if room_store else None,
        "room_revision": room_store.revision if room_store else None,
        "room_alternates": [deepcopy(i) for i in room_store.data["migration"] if i["entry_id"] == entry.entry_id] if room_store else [],
        "capabilities": {entity: light_capabilities(state) for entity in hass.states.async_entity_ids("light") if (state := hass.states.get(entity)) is not None} if hasattr(getattr(hass, "states", None), "async_entity_ids") else {},
        # Legacy fields keep an older cached sidebar functional long enough for
        # the cache-busted current panel to load.
        "zones": _legacy_zones_from_profile(profile_config),
        "settings": dict(preset.get("global", {})),
        "status": _status(hass, entry.entry_id),
    }


async def _store_profile_config(
    hass: HomeAssistant, entry, profile_config: dict[str, Any], expected_revision: str | None = None,
    *, room=None, room_revision=None,
) -> dict[str, Any]:
    return await store_profile(hass, entry, profile_config, expected_revision, room=room, room_revision=room_revision)


@callback
def async_register_websocket(hass: HomeAssistant) -> None:
    """Register commands once per HA process."""
    domain_data = hass.data.setdefault(DOMAIN, {})
    if domain_data.get(_FLAG):
        return
    websocket_api.async_register_command(hass, ws_get_config)
    websocket_api.async_register_command(hass, ws_get_status)
    websocket_api.async_register_command(hass, ws_get_tv_preview)
    websocket_api.async_register_command(hass, ws_preview_ambient)
    websocket_api.async_register_command(hass, ws_set_running)
    websocket_api.async_register_command(hass, ws_save_profile_config)
    websocket_api.async_register_command(hass, ws_activate_preset)
    websocket_api.async_register_command(hass, ws_save_config_legacy)
    for command in (ws_identify, ws_participating, ws_copy_settings, ws_export_backup, ws_preview_backup, ws_import_backup):
        websocket_api.async_register_command(hass, command)
    domain_data[_FLAG] = True


@callback
@websocket_api.require_admin
@websocket_api.websocket_command(
    {vol.Required("type"): "ambilight_sync/get_config"}
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
        vol.Required("type"): "ambilight_sync/get_status",
        vol.Required("entry_id"): str,
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


@callback
@websocket_api.require_admin
@websocket_api.websocket_command(
    {
        vol.Required("type"): "ambilight_sync/get_tv_preview",
        vol.Required("entry_id"): str,
    }
)
def ws_get_tv_preview(
    hass: HomeAssistant,
    connection: websocket_api.ActiveConnection,
    msg: dict[str, Any],
) -> None:
    """Read the last TV frame from memory without polling TV or light services."""
    entry = hass.config_entries.async_get_entry(msg["entry_id"])
    if entry is None or entry.domain != DOMAIN:
        connection.send_error(
            msg["id"], websocket_api.const.ERR_NOT_FOUND, "Ambilight Sync entry not found"
        )
        return
    manager: AmbilightSyncManager | None = hass.data.get(DOMAIN, {}).get(entry.entry_id)
    connection.send_result(
        msg["id"], {"tv_preview": manager.tv_preview if manager is not None else None}
    )


@callback
@websocket_api.require_admin
@websocket_api.websocket_command(
    {
        vol.Required("type"): "ambilight_sync/preview_ambient",
        vol.Required("entry_id"): str,
        vol.Required("rendering"): dict,
        vol.Required("lights"): dict,
    }
)
def ws_preview_ambient(hass: HomeAssistant, connection: websocket_api.ActiveConnection, msg: dict[str, Any]) -> None:
    """Render an unsaved room using cached input, with no live output side effects."""
    entry = hass.config_entries.async_get_entry(msg["entry_id"])
    if entry is None or entry.domain != DOMAIN:
        connection.send_error(msg["id"], websocket_api.const.ERR_NOT_FOUND, "Ambilight Sync entry not found")
        return
    manager = hass.data.get(DOMAIN, {}).get(entry.entry_id)
    if manager is None:
        connection.send_error(msg["id"], websocket_api.const.ERR_NOT_FOUND, "Ambilight Sync is not loaded")
        return
    try:
        result = manager.preview_ambient(msg["rendering"], msg["lights"])
    except (TypeError, ValueError) as exc:
        connection.send_error(msg["id"], websocket_api.const.ERR_INVALID_FORMAT, str(exc))
        return
    connection.send_result(msg["id"], result)


def _sync_switch_entity_id(hass: HomeAssistant, entry_id: str) -> str | None:
    registry = er.async_get(hass)
    for entity in registry.entities.values():
        if (
            entity.config_entry_id == entry_id
            and entity.platform == DOMAIN
            and entity.domain == "switch"
        ):
            return entity.entity_id
    return None


@websocket_api.require_admin
@websocket_api.websocket_command(
    {
        vol.Required("type"): "ambilight_sync/set_running",
        vol.Required("entry_id"): str,
        vol.Required("running"): bool,
    }
)
@websocket_api.async_response
async def ws_set_running(
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

    manager: AmbilightSyncManager | None = hass.data.get(DOMAIN, {}).get(entry.entry_id)
    if manager is None:
        connection.send_error(
            msg["id"], websocket_api.const.ERR_NOT_FOUND, "Ambilight Sync is not loaded"
        )
        return

    switch_entity_id = _sync_switch_entity_id(hass, entry.entry_id)
    if switch_entity_id is not None:
        service = "turn_on" if msg["running"] else "turn_off"
        await hass.services.async_call(
            "switch", service, {"entity_id": switch_entity_id}, blocking=True
        )
    elif msg["running"]:
        await manager.async_start()
    else:
        await manager.async_stop()

    connection.send_result(msg["id"], _status(hass, entry.entry_id))


@websocket_api.require_admin
@websocket_api.websocket_command(
    {
        vol.Required("type"): "ambilight_sync/save_profile_config",
        vol.Required("entry_id"): str,
        vol.Required("profile_config"): dict,
        vol.Optional("expected_revision"): str,
        vol.Optional("room"): dict,
        vol.Optional("room_revision"): str,
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
        await _store_profile_config(
            hass, entry, deepcopy(msg["profile_config"]), msg.get("expected_revision"),
            room=msg.get("room"), room_revision=msg.get("room_revision"),
        )
    except ProfileConflictError as exc:
        connection.send_error(msg["id"], "conflict", str(exc))
        return
    except (TypeError, ValueError) as exc:
        connection.send_error(msg["id"], websocket_api.const.ERR_INVALID_FORMAT, str(exc))
        return

    connection.send_result(msg["id"], _serialize_entry(hass, entry))


@websocket_api.require_admin
@websocket_api.websocket_command({vol.Required("type"): "ambilight_sync/identify",
    vol.Required("entry_id"): str, vol.Optional("entity_id", default=None): vol.Any(str, None),
    vol.Optional("hold", default=False): bool,
    vol.Optional("renew", default=False): bool,
    vol.Required("owner"): vol.All(str, vol.Length(min=1, max=128))})
@websocket_api.async_response
async def ws_identify(hass, connection, msg):
    try:
        manager = _loaded(hass, msg["entry_id"])
        entity = msg["entity_id"]
        if entity is not None and not ENTITY.fullmatch(entity):
            raise ValueError("Invalid light entity ID")
        await manager.async_identify(entity, msg["owner"], hold=msg.get("hold", False), renew=msg.get("renew", False))
        connection.send_result(msg["id"], {"identifying": manager._identify_entity, "owned": manager._identify_owner == msg["owner"]})
    except (ValueError, TypeError) as exc:
        connection.send_error(msg["id"], "invalid_format", str(exc))


@websocket_api.require_admin
@websocket_api.websocket_command({vol.Required("type"): "ambilight_sync/set_participating",
    vol.Required("entry_id"): str, vol.Required("entity_id"): str, vol.Required("participating"): bool})
@websocket_api.async_response
async def ws_participating(hass, connection, msg):
    try:
        manager = _loaded(hass, msg["entry_id"])
        entity = msg["entity_id"]
        if not ENTITY.fullmatch(entity) or hass.states.get(entity) is None:
            raise ValueError("Light entity is unavailable")
        await complete_transaction(_set_participating(hass, manager, entity, msg["participating"]))
        connection.send_result(msg["id"], _status(hass, manager.entry_id))
    except (ValueError, TypeError, OSError) as exc:
        connection.send_error(msg["id"], "invalid_format", str(exc))


async def _set_participating(hass, manager, entity, participating):
    store = get_room_store(hass)
    if store is None:
        await manager.async_set_participating(entity, participating)
        return
    async with store.lock:
        data = deepcopy(store.data)
        values = set(data["excluded"])
        values.discard(entity) if participating else values.add(entity)
        data["excluded"] = sorted(values)
        await store.commit(data)
        managers = [m for m in hass.data[DOMAIN].values() if isinstance(m, AmbilightSyncManager)]
        pending = hass.data[DOMAIN].setdefault("_participation_pending", set())
        pending.add(entity)
        try:
            for m in managers:
                await m.async_set_participating(entity, participating)
        finally:
            pending.discard(entity)
        if participating:
            for m in managers:
                if m._running and m._tv_preview_payload is not None:
                    m._queue_colors(m._tv_preview_payload)


@websocket_api.require_admin
@websocket_api.websocket_command({vol.Required("type"): "ambilight_sync/copy_light_settings",
    vol.Required("entry_id"): str, vol.Required("profile_config"): dict, vol.Required("preset"): str,
    vol.Required("source"): str, vol.Required("targets"): [str]})
@websocket_api.async_response
async def ws_copy_settings(hass, connection, msg):
    try:
        _loaded(hass, msg["entry_id"])
        config = normalize_profile_config(msg["profile_config"])
        preset = config["presets"][msg["preset"]]
        source = preset["lights"][msg["source"]]
        targets = {e: preset["lights"][e] for e in set(msg["targets"]) if e != msg["source"]}
        if not targets or any(hass.states.get(e) is None for e in targets):
            raise ValueError("Select available target lights")
        from .config_model import effective_settings
        settings = effective_settings(preset["global"], source.get("overrides"))
        overrides = {k: settings[k] for k in OVERRIDABLE_SETTINGS if k in settings}
        result = copy_light_settings({"overrides": overrides}, targets, hass.states)
        connection.send_result(msg["id"], {"lights": result})
    except (KeyError, ValueError, TypeError) as exc:
        connection.send_error(msg["id"], "invalid_format", str(exc))


@websocket_api.require_admin
@websocket_api.websocket_command({vol.Required("type"): "ambilight_sync/export_backup"})
@websocket_api.async_response
async def ws_export_backup(hass, connection, msg):
    try:
        connection.send_result(msg["id"], export_backup(hass))
    except ValueError as exc:
        connection.send_error(msg["id"], "invalid_format", str(exc))


@websocket_api.require_admin
@websocket_api.websocket_command({vol.Required("type"): "ambilight_sync/preview_backup",
    vol.Required("backup"): dict, vol.Optional("devices", default={}): dict,
    vol.Optional("entities", default={}): dict})
@websocket_api.async_response
async def ws_preview_backup(hass, connection, msg):
    try:
        plan = prepare_import(hass, msg["backup"], msg["devices"], msg["entities"])
        connection.send_result(msg["id"], {k: v for k, v in plan.items() if not k.startswith("_")})
    except (ValueError, TypeError, RecursionError) as exc:
        connection.send_error(msg["id"], "invalid_format", str(exc))


@websocket_api.require_admin
@websocket_api.websocket_command({vol.Required("type"): "ambilight_sync/import_backup",
    vol.Required("backup"): dict, vol.Required("devices"): dict, vol.Required("entities"): dict,
    vol.Required("token"): str})
@websocket_api.async_response
async def ws_import_backup(hass, connection, msg):
    try:
        plan = await apply_import(hass, msg["backup"], msg["devices"], msg["entities"], msg["token"])
        connection.send_result(msg["id"], plan)
    except ProfileConflictError as exc:
        connection.send_error(msg["id"], "conflict", str(exc))
    except (ValueError, TypeError, OSError, RecursionError) as exc:
        connection.send_error(msg["id"], "invalid_format", str(exc))


@websocket_api.require_admin
@websocket_api.websocket_command(
    {
        vol.Required("type"): "ambilight_sync/activate_preset",
        vol.Required("entry_id"): str,
        vol.Required("preset"): str,
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

    async with profile_lock(hass, entry.entry_id):
        profile_config = profile_config_from_entry(entry)
        preset_id = resolve_preset(profile_config, msg["preset"])
        if preset_id is None:
            connection.send_error(
                msg["id"], websocket_api.const.ERR_NOT_FOUND, "Preset not found"
            )
            return
        profile_config["active_preset"] = preset_id
        await store_profile_locked(hass, entry, profile_config)
    connection.send_result(msg["id"], _serialize_entry(hass, entry))


# Compatibility endpoint for the previous cached sidebar. It converts the old
# one-zone-per-light form into the active preset rather than discarding data.
@websocket_api.require_admin
@websocket_api.websocket_command(
    {
        vol.Required("type"): "ambilight_sync/save_config",
        vol.Required("entry_id"): str,
        vol.Required("zones"): dict,
        vol.Required("settings"): dict,
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

        async with profile_lock(hass, entry.entry_id):
            profile_config = profile_config_from_entry(entry)
            preset_id, _ = active_preset(profile_config)
            profile_config["presets"][preset_id]["global"] = settings
            profile_config["presets"][preset_id]["lights"] = lights
            await store_profile_locked(hass, entry, profile_config)
    except (TypeError, ValueError) as exc:
        connection.send_error(msg["id"], websocket_api.const.ERR_INVALID_FORMAT, str(exc))
        return

    connection.send_result(msg["id"], _serialize_entry(hass, entry))
