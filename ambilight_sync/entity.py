"""Shared entity helpers for Ambilight Sync."""

from __future__ import annotations

from homeassistant.config_entries import ConfigEntry
from homeassistant.helpers.device_registry import DeviceInfo
from homeassistant.helpers.entity import Entity

from .const import DOMAIN
from .manager import AmbilightSyncManager


class AmbilightSyncEntity(Entity):
    """Base entity bound to one Ambilight Sync config entry."""

    _attr_has_entity_name = True

    def __init__(self, entry: ConfigEntry, manager: AmbilightSyncManager) -> None:
        self.entry = entry
        self.manager = manager
        tv_name = manager.system.get("name") or manager.host
        self._attr_device_info = DeviceInfo(
            identifiers={(DOMAIN, entry.entry_id)},
            name=f"Ambilight Sync · {tv_name}",
            manufacturer="Home Assistant custom integration",
            model="Philips TV → Home Assistant lights",
        )
