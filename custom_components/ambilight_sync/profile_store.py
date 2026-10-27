"""Serialize profile edits and reject overwrites from stale panel drafts."""
from __future__ import annotations

import asyncio
from copy import deepcopy
from hashlib import sha256
import json
from typing import Any

from .config_model import CONF_PROFILE_CONFIG, normalize_profile_config, profile_config_from_entry
from .const import DOMAIN
from .room_store import get_room_store, complete_transaction


class ProfileConflictError(ValueError):
    """The saved profile has changed since a panel loaded its draft."""


def profile_revision(profile_config: dict[str, Any]) -> str:
    """Stable content revision; no extra counters are persisted in config entries."""
    data = json.dumps(profile_config, sort_keys=True, separators=(",", ":"), allow_nan=False)
    return sha256(data.encode()).hexdigest()[:20]


def profile_lock(hass, entry_id: str) -> asyncio.Lock:
    locks = hass.data.setdefault(DOMAIN, {}).setdefault("_profile_locks", {})
    return locks.setdefault(entry_id, asyncio.Lock())


async def _store_profile_update(
    hass, entry, profile_config: dict[str, Any], expected_revision: str | None = None,
    *, room=None, room_revision=None,
) -> dict[str, Any]:
    """Store/apply one update while the caller holds this entry's profile lock."""
    current = profile_config_from_entry(entry)
    if expected_revision is not None and expected_revision != profile_revision(current):
        raise ProfileConflictError("Settings changed in another window. Reload before saving.")
    room_store = get_room_store(hass)
    if room_store:
        current = room_store.attach(entry.entry_id, current)
    # Cached Classic panels do not know the rendering block. Preserve it while
    # allowing their ordinary edits; an explicit mode switch is always honored.
    profile_config = deepcopy(profile_config)
    raw_presets = profile_config.get("presets")
    raw_presets = raw_presets if isinstance(raw_presets, dict) else {}
    for preset_id, preset in raw_presets.items():
        if isinstance(preset, dict) and "rendering" not in preset:
            existing = current["presets"].get(preset_id, {})
            if "rendering" in existing:
                preset["rendering"] = deepcopy(existing["rendering"])
    normalized = normalize_profile_config(profile_config)
    options = dict(entry.options)
    old_options = dict(entry.options)
    saved = deepcopy(normalized)
    if room_store:
        for preset in saved["presets"].values():
            preset["rendering"].pop("room", None)
    options[CONF_PROFILE_CONFIG] = saved
    manager = hass.data.get(DOMAIN, {}).get(entry.entry_id)
    async def apply():
        if manager is not None:
            await manager.async_apply_profile_config(normalized)
        hass.config_entries.async_update_entry(entry, options=options)
    if room_store and room is not None:
        async with room_store.lock:
            old = deepcopy(room_store.data)
            data = room_store.with_room(entry.entry_id, room, room_revision)
            await room_store.commit(data)
            try:
                await apply()
                for other in hass.data[DOMAIN].values():
                    if hasattr(other, "async_apply_profile_config") and other is not manager:
                        await other.async_apply_profile_config(other._profile_config)
            except BaseException:
                await room_store.commit(old)
                hass.config_entries.async_update_entry(entry, options=old_options)
                if manager is not None:
                    await manager.async_apply_profile_config(current)
                for other in hass.data[DOMAIN].values():
                    if hasattr(other, "async_apply_profile_config") and other is not manager:
                        await other.async_apply_profile_config(profile_config_from_entry(other.entry))
                raise
    else:
        await apply()
    return room_store.attach(entry.entry_id, normalized) if room_store else normalized


async def store_profile(
    hass, entry, profile_config: dict[str, Any], expected_revision: str | None = None,
    *, room=None, room_revision=None,
) -> dict[str, Any]:
    async with profile_lock(hass, entry.entry_id):
        return await store_profile_locked(hass, entry, profile_config, expected_revision,
                                          room=room, room_revision=room_revision)


async def store_profile_locked(hass, entry, profile_config, expected_revision=None, *, room=None, room_revision=None):
    return await complete_transaction(_store_profile_update(hass, entry, profile_config, expected_revision,
                                                            room=room, room_revision=room_revision))
