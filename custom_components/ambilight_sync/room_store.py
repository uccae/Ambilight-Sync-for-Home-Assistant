"""One physical room, shared by all presets and TV configuration entries."""
from __future__ import annotations

import asyncio
from copy import deepcopy
from hashlib import sha256
import json
import math
import re
from typing import Any

from homeassistant.helpers.storage import Store
from .ambient import DEFAULT_TV
from .const import DOMAIN

KEY = "_room_store"
ENTITY = re.compile(r"light\.[a-z0-9_]{1,249}\Z")


async def complete_transaction(coro):
    """Finish a short commit or rollback even if its requesting UI disconnects."""
    task = asyncio.create_task(coro)
    try:
        return await asyncio.shield(task)
    except asyncio.CancelledError:
        await task
        raise


def revision(data: dict) -> str:
    return sha256(json.dumps(data, sort_keys=True, allow_nan=False, separators=(",", ":")).encode()).hexdigest()[:20]


def validate_room(raw: Any) -> dict:
    """Strict edits/import validation. Never silently move invalid coordinates."""
    if not isinstance(raw, dict) or set(raw) != {"tv", "lights"} or not isinstance(raw["lights"], dict):
        raise ValueError("Room requires tv and lights objects")
    if len(raw["lights"]) > 512 or not isinstance(raw["tv"], dict):
        raise ValueError("Invalid room size")
    ranges = {"x": (-15, 15), "y": (0, 6), "z": (-15, 15), "yaw": (-180, 180),
              "width": (.3, 4), "height": (.2, 3)}
    def point(value, keys):
        if not isinstance(value, dict) or set(value) != set(keys):
            raise ValueError("Invalid coordinate fields")
        result = {}
        for key in keys:
            n = value[key]
            if type(n) not in (float, int) or not math.isfinite(n) or not ranges[key][0] <= n <= ranges[key][1]:
                raise ValueError(f"Invalid room coordinate: {key}")
            result[key] = float(n)
        return result
    tv = point(raw["tv"], DEFAULT_TV)
    lights = {}
    for entity, value in raw["lights"].items():
        if not isinstance(entity, str) or not ENTITY.fullmatch(entity):
            raise ValueError("Invalid light entity ID")
        lights[entity] = point(value, ("x", "y", "z"))
    return {"tv": tv, "lights": lights}


def get_room_store(hass):
    return getattr(hass, "data", {}).get(DOMAIN, {}).get(KEY)


class RoomStore:
    def __init__(self, hass, storage=None):
        self.hass = hass
        self.storage = storage if storage is not None else Store(hass, 1, f"{DOMAIN}.room")
        self.lock = asyncio.Lock()
        self.data = {"version": 1, "tvs": {}, "lights": {}, "excluded": [], "migration": []}

    @property
    def revision(self):
        # A manual-participation toggle must not invalidate a coordinate draft.
        return revision({k: v for k, v in self.data.items() if k != "excluded"})

    def room(self, entry_id: str) -> dict:
        return {"tv": deepcopy(self.data["tvs"].get(entry_id, DEFAULT_TV)), "lights": deepcopy(self.data["lights"])}

    def attach(self, entry_id: str, profile: dict) -> dict:
        """Materialize a compatibility view. Geometry has only one saved owner."""
        profile = deepcopy(profile)
        room = self.room(entry_id)
        for preset in profile["presets"].values():
            fallback = preset["rendering"]["room"]
            preset["rendering"]["room"] = {"tv": deepcopy(room["tv"]), "lights": {
                entity: deepcopy(room["lights"].get(entity, fallback["lights"][entity]))
                for entity in fallback["lights"]}}
        return profile

    async def load(self, entries):
        saved = await self.storage.async_load()
        if saved is not None:
            self.data = self.validate_data(saved)
        changed = False
        # Active layouts take precedence. All conflicting alternatives survive
        # in storage and backup and can be explicitly selected in the editor.
        from .config_model import profile_config_from_entry
        for entry in sorted(entries, key=lambda e: e.entry_id):
            profile = profile_config_from_entry(entry)
            ids = [profile["active_preset"]] + [p for p in profile["presets"] if p != profile["active_preset"]]
            for preset_id in ids:
                preset = profile["presets"][preset_id]
                room = preset["rendering"]["room"]
                conflicts = []
                if entry.entry_id not in self.data["tvs"]:
                    self.data["tvs"][entry.entry_id] = deepcopy(room["tv"]); changed = True
                elif self.data["tvs"][entry.entry_id] != room["tv"]:
                    conflicts.append("tv")
                for entity, point in room["lights"].items():
                    if entity not in self.data["lights"]:
                        self.data["lights"][entity] = deepcopy(point); changed = True
                    elif self.data["lights"][entity] != point:
                        conflicts.append(entity)
                # Only migrate embedded geometry, not freshly generated defaults
                # from already migrated, geometry-free configuration entries.
                raw_preset = entry.options.get("profile_config", {}).get("presets", {}).get(preset_id, {})
                embedded = "room" in raw_preset.get("rendering", {})
                item = {"entry_id": entry.entry_id, "preset_id": preset_id, "name": preset["name"],
                        "room": deepcopy(room), "conflicts": conflicts}
                if conflicts and embedded and not any(i["entry_id"] == entry.entry_id and i["preset_id"] == preset_id for i in self.data["migration"]):
                    self.data["migration"].append(item); changed = True
        if changed:
            await self.storage.async_save(self.data)

    @staticmethod
    def validate_data(data):
        if not isinstance(data, dict) or type(data.get("version")) is not int or data["version"] != 1 or set(data) != {"version", "tvs", "lights", "excluded", "migration"}:
            raise ValueError("Unsupported room storage version/format")
        if not isinstance(data["tvs"], dict) or not isinstance(data["lights"], dict):
            raise ValueError("Invalid geometry")
        if not isinstance(data["excluded"], list) or len(data["excluded"]) > 512 or any(not isinstance(e, str) or not ENTITY.fullmatch(e) for e in data["excluded"]):
            raise ValueError("Invalid excluded entities")
        if not isinstance(data["migration"], list) or len(data["migration"]) > 1024:
            raise ValueError("Invalid migration layouts")
        lights = validate_room({"tv": dict(DEFAULT_TV), "lights": data["lights"]})["lights"]
        tvs = {}
        for entry, tv in data["tvs"].items():
            if not isinstance(entry, str) or len(entry) > 128:
                raise ValueError("Invalid TV assignment")
            tvs[entry] = validate_room({"tv": tv, "lights": {}})["tv"]
        migration = []
        for item in data["migration"]:
            if not isinstance(item, dict) or set(item) != {"entry_id", "preset_id", "name", "room", "conflicts"}:
                raise ValueError("Invalid migration layout")
            if any(not isinstance(item[k], str) or len(item[k]) > 128 for k in ("entry_id", "preset_id", "name")) or not isinstance(item["conflicts"], list):
                raise ValueError("Invalid migration metadata")
            if any(c != "tv" and (not isinstance(c, str) or not ENTITY.fullmatch(c)) for c in item["conflicts"]):
                raise ValueError("Invalid conflict ID")
            migration.append({**item, "room": validate_room(item["room"])})
        return {"version": 1, "tvs": tvs, "lights": lights, "excluded": sorted(set(data["excluded"])), "migration": migration}

    async def commit(self, data):
        data = self.validate_data(data)
        # Store writes atomically; don't expose a partial in-memory draft on I/O failure.
        await self.storage.async_save(data)
        self.data = data

    def with_room(self, entry_id, room, expected=None):
        if expected is not None and expected != self.revision:
            from .profile_store import ProfileConflictError
            raise ProfileConflictError("Room changed in another window. Reload before saving.")
        room = validate_room(room)
        data = deepcopy(self.data)
        data["tvs"][entry_id] = room["tv"]
        data["lights"].update(room["lights"])
        return data


async def async_room_store(hass):
    domain = hass.data.setdefault(DOMAIN, {})
    async with domain.setdefault("_room_init_lock", asyncio.Lock()):
        entries = hass.config_entries.async_entries(DOMAIN)
        if KEY not in domain:
            store = RoomStore(hass)
            await store.load(entries)
            domain[KEY] = store
        elif any(e.entry_id not in domain[KEY].data["tvs"] for e in entries):
            async with domain[KEY].lock:
                await domain[KEY].load(entries)
        return domain[KEY]
