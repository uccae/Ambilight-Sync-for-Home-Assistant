"""Portable, credential-free configuration backups with a validated import plan."""
from __future__ import annotations

import asyncio
from contextlib import AsyncExitStack
from copy import deepcopy
import json
import math

from .ambient import BEHAVIORS
from .config_model import (CONF_PROFILE_CONFIG, OVERRIDABLE_SETTINGS, normalize_profile_config,
                           normalize_settings, profile_config_from_entry)
from .const import DOMAIN, ZONES
from .profile_store import ProfileConflictError, profile_lock, profile_revision
from .room_store import ENTITY, RoomStore, get_room_store, revision

FORMAT = "ambilight_sync.backup"
MAX_BYTES = 512_000


def strip_geometry(profile):
    profile = deepcopy(profile)
    for preset in profile["presets"].values():
        preset["rendering"].pop("room", None)
    return profile


def export_backup(hass):
    store = get_room_store(hass)
    if store is None:
        raise ValueError("Room storage is not ready")
    entries = hass.config_entries.async_entries(DOMAIN)
    profiles = [{"device": e.entry_id, "title": e.title,
                 "config": strip_geometry(profile_config_from_entry(e))} for e in entries]
    room = deepcopy(store.data)
    ids = {e.entry_id for e in entries}
    room["tvs"] = {e: tv for e, tv in room["tvs"].items() if e in ids}
    room["migration"] = [item for item in room["migration"] if item["entry_id"] in ids]
    # Entry.data (host, username, password, pairing/system metadata) never enters
    # this format. Only allowlisted settings are reconstructed above.
    return {"format": FORMAT, "version": 1, "profiles": profiles, "room": room}


def _finite(value):
    if isinstance(value, float) and not math.isfinite(value):
        raise ValueError("Non-finite number in backup")
    if isinstance(value, dict):
        for item in value.values():
            _finite(item)
    if isinstance(value, list):
        for item in value:
            _finite(item)


def validate_profile(raw):
    if not isinstance(raw, dict) or set(raw) != {"schema_version", "active_preset", "presets"}:
        raise ValueError("Invalid profile format")
    if type(raw["schema_version"]) is not int or raw["schema_version"] not in (7, 8):
        raise ValueError("Unsupported profile version")
    presets = raw["presets"]
    if not isinstance(presets, dict) or not 0 < len(presets) <= 64 or raw["active_preset"] not in presets:
        raise ValueError("Invalid presets/active preset")
    setting_keys = set(normalize_settings({}))
    for key, p in presets.items():
        if not isinstance(key, str) or not 0 < len(key) <= 80 or not isinstance(p, dict) or set(p) != {"name", "global", "lights", "rendering"}:
            raise ValueError("Invalid preset")
        if not isinstance(p["name"], str) or not 0 < len(p["name"]) <= 80 or not isinstance(p["global"], dict) or set(p["global"]) - setting_keys:
            raise ValueError("Unknown preset settings")
        def settings_types(settings):
            for k, v in settings.items():
                if k == "restore_on_stop":
                    valid = type(v) is bool
                elif k in ("source", "color_mode"):
                    valid = isinstance(v, str)
                else:
                    valid = type(v) in (int, float)
                if not valid:
                    raise ValueError(f"Invalid setting type: {k}")
        settings_types(p["global"])
        if not isinstance(p["lights"], dict) or len(p["lights"]) > 256:
            raise ValueError("Too many lights")
        for entity, config in p["lights"].items():
            if not isinstance(entity, str) or not ENTITY.fullmatch(entity) or not isinstance(config, dict):
                raise ValueError("Invalid entity assignment")
            if set(config) - {"position_mode", "position_x", "position_y", "position_falloff", "sources", "overrides"}:
                raise ValueError("Unknown light settings")
            if config.get("position_mode") not in ("manual", "spatial"):
                raise ValueError("Invalid position mode")
            if not isinstance(config.get("overrides"), dict) or set(config["overrides"]) - set(OVERRIDABLE_SETTINGS):
                raise ValueError("Unknown light overrides")
            settings_types(config["overrides"])
            if any(type(config.get(k)) not in (int,float) for k in ("position_x", "position_y", "position_falloff")):
                raise ValueError("Invalid light coordinate type")
            sources = config.get("sources")
            if not isinstance(sources, list) or not 0 < len(sources) <= 32:
                raise ValueError("Invalid source zones")
            for source in sources:
                if not isinstance(source, dict) or set(source) != {"zone", "weight"} or source["zone"] not in ZONES or type(source["weight"]) not in (int, float) or source["weight"] <= 0:
                    raise ValueError("Invalid source zone")
        r = p["rendering"]
        if not isinstance(r, dict) or set(r) != {"version", "mode", "behavior", "phosphor"}:
            raise ValueError("Unknown rendering fields")
        if type(r.get("version")) is not int or r["version"] != 1 or r.get("mode") not in ("classic", "ambient") or r.get("behavior") not in BEHAVIORS or type(r.get("phosphor")) is not bool:
            raise ValueError("Invalid rendering settings")
    normalized = normalize_profile_config(raw)
    # Strict settings validation prevents silent deletion/clamping on import.
    for key, p in presets.items():
        n = normalized["presets"][key]
        if p["global"] != n["global"] or p["lights"] != n["lights"]:
            raise ValueError("Invalid or out-of-range settings")
    return normalized


def prepare_import(hass, payload, devices, entities):
    if not isinstance(payload, dict) or len(json.dumps(payload, allow_nan=False).encode()) > MAX_BYTES:
        raise ValueError("Backup is too large or invalid")
    _finite(payload)
    if set(payload) != {"format", "version", "profiles", "room"} or payload.get("format") != FORMAT or type(payload.get("version")) is not int or payload["version"] != 1:
        raise ValueError("Unsupported backup format/version")
    if not isinstance(devices, dict) or not isinstance(entities, dict):
        raise ValueError("Invalid device/entity mapping")
    raw_profiles = payload["profiles"]
    if not isinstance(raw_profiles, list) or not 0 < len(raw_profiles) <= 32:
        raise ValueError("Invalid device profiles")
    source = {}
    for item in raw_profiles:
        if not isinstance(item, dict) or set(item) != {"device", "title", "config"} or not isinstance(item["device"], str) or not isinstance(item["title"], str) or len(item["title"]) > 256 or item["device"] in source:
            raise ValueError("Invalid or duplicate device")
        source[item["device"]] = validate_profile(item["config"])
    if set(devices) - set(source):
        raise ValueError("Unknown device mapping")
    local = {e.entry_id: e for e in hass.config_entries.async_entries(DOMAIN)}
    used, profiles, unresolved, skipped = set(), {}, [], []
    for device, profile in source.items():
        target = devices.get(device, device)
        if target is None:
            skipped.append(device); continue
        if target not in local:
            unresolved.append({"kind": "device", "id": device}); continue
        if target in used:
            raise ValueError("Two source profiles map to one TV")
        used.add(target); profiles[target] = deepcopy(profile)
    data = RoomStore.validate_data(payload["room"])
    if set(data["tvs"]) - set(source) or any(i["entry_id"] not in source for i in data["migration"]):
        raise ValueError("Geometry refers to an unknown source TV")
    source_ids = set(data["lights"]) | set(data["excluded"])
    for profile in source.values():
        for p in profile["presets"].values(): source_ids.update(p["lights"])
    for item in data["migration"]: source_ids.update(item["room"]["lights"])
    if set(entities) - source_ids:
        raise ValueError("Unknown entity mapping")
    mapping, warnings, destinations = {}, [], set()
    for entity in sorted(source_ids):
        target = entities.get(entity, entity)
        mapping[entity] = target
        if target is None:
            skipped.append(entity); continue
        if not isinstance(target, str) or not ENTITY.fullmatch(target):
            raise ValueError("Invalid target entity")
        if target in destinations:
            raise ValueError("Two lights map to one entity")
        destinations.add(target)
        state = hass.states.get(target)
        if state is None:
            unresolved.append({"kind": "entity", "id": entity})
        elif state.state in ("unavailable", "unknown"):
            warnings.append(f"{target}: currently unavailable; synchronization will wait")
    for profile in profiles.values():
        for p in profile["presets"].values():
            p["lights"] = {mapping[e]: v for e, v in p["lights"].items() if mapping[e] is not None}
            p["rendering"].pop("room", None)
    def remap(points):
        return {mapping[e]: p for e, p in points.items() if mapping[e] is not None}
    data["lights"] = remap(data["lights"])
    data["excluded"] = [mapping[e] for e in data["excluded"] if mapping[e] is not None]
    data["tvs"] = {devices.get(e, e): tv for e, tv in data["tvs"].items() if devices.get(e, e) in local}
    migration = []
    for item in data["migration"]:
        target = devices.get(item["entry_id"], item["entry_id"])
        if target in local:
            item["entry_id"] = target
            item["room"]["lights"] = remap(item["room"]["lights"])
            item["conflicts"] = ["tv" if e == "tv" else mapping[e] for e in item["conflicts"] if e == "tv" or mapping.get(e) is not None]
            migration.append(item)
    data["migration"] = migration
    store = get_room_store(hass)
    before = {e: profile_revision(profile_config_from_entry(local[e])) for e in local}
    token = revision({"profiles": profiles, "room": data, "before": before, "room_before": revision(store.data)})
    changes = [{"entry_id": e, "title": local[e].title, "presets": len(p["presets"]),
                "before_presets": len(profile_config_from_entry(local[e])["presets"]),
                "active_preset": p["presets"][p["active_preset"]]["name"],
                "lights": len(set().union(*(set(v["lights"]) for v in p["presets"].values())))} for e, p in profiles.items()]
    return {"token": token, "ready": not unresolved and bool(profiles), "unresolved": unresolved,
            "warnings": warnings, "skipped": skipped, "changes": changes,
            "geometry_lights": len(data["lights"]),
            "geometry_changed": sum(store.data["lights"].get(e) != p for e,p in data["lights"].items()),
            "geometry_removed": sorted(set(store.data["lights"]) - set(data["lights"])),
            "tv_positions_removed": sorted(set(store.data["tvs"]) - set(data["tvs"])),
            "_profiles": profiles, "_room": data}


async def apply_import(hass, payload, devices, entities, token):
    store = get_room_store(hass)
    entries = {e.entry_id: e for e in hass.config_entries.async_entries(DOMAIN)}
    async with AsyncExitStack() as stack:
        for entry_id in sorted(entries):
            await stack.enter_async_context(profile_lock(hass, entry_id))
        await stack.enter_async_context(store.lock)
        plan = prepare_import(hass, payload, devices, entities)
        if token != plan["token"]:
            raise ProfileConflictError("Configuration changed. Preview the backup again.")
        if not plan["ready"]:
            raise ValueError("Resolve unavailable device/entity assignments before import")
        old_room, old_options = deepcopy(store.data), {e: deepcopy(entry.options) for e, entry in entries.items()}
        managers = [m for m in hass.data[DOMAIN].values() if hasattr(m, "async_apply_profile_config")]
        ownership = {m.entry_id: (deepcopy(m._snapshot), set(m._excluded)) for m in managers}
        changed_exclusions = set(old_room["excluded"]) ^ set(plan["_room"]["excluded"])
        async def transaction():
            pending = hass.data[DOMAIN].setdefault("_participation_pending", set())
            pending.update(changed_exclusions)
            try:
                await store.commit(plan["_room"])
                for e, profile in plan["_profiles"].items():
                    options = dict(entries[e].options); options[CONF_PROFILE_CONFIG] = strip_geometry(profile)
                    hass.config_entries.async_update_entry(entries[e], options=options)
                for e, entry in entries.items():
                    manager = hass.data[DOMAIN].get(e)
                    if manager is not None:
                        # Excluded lamps relinquish their baseline before any
                        # new active preset is allowed to restore/remove them.
                        for entity in changed_exclusions:
                            await manager.async_set_participating(entity, entity not in store.data["excluded"])
                        await manager.async_apply_profile_config(profile_config_from_entry(entry))
            except BaseException:
                await store.commit(old_room)
                for e, options in old_options.items():
                    hass.config_entries.async_update_entry(entries[e], options=options)
                for e, entry in entries.items():
                    if (m := hass.data[DOMAIN].get(e)) is not None:
                        m._excluded = set(ownership[e][1])
                        await m.async_apply_profile_config(profile_config_from_entry(entry))
                        m._snapshot = deepcopy(ownership[e][0])
                raise
            finally:
                pending.difference_update(changed_exclusions)
        task = asyncio.create_task(transaction())
        try:
            await asyncio.shield(task)
        except asyncio.CancelledError:
            await task  # Complete commit/rollback before releasing transaction locks.
            raise
        return {k: v for k, v in plan.items() if not k.startswith("_")}
