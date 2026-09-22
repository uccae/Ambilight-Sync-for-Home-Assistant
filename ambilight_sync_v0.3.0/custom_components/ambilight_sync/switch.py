"""Switch platform for Ambilight Sync."""

from __future__ import annotations

from homeassistant.components.switch import SwitchEntity
from homeassistant.config_entries import ConfigEntry
from homeassistant.core import HomeAssistant
from homeassistant.helpers.entity_platform import AddConfigEntryEntitiesCallback

from .const import DOMAIN
from .entity import AmbilightSyncEntity
from .manager import AmbilightSyncManager


async def async_setup_entry(
    hass: HomeAssistant, entry: ConfigEntry, async_add_entities: AddConfigEntryEntitiesCallback
) -> None:
    manager: AmbilightSyncManager = hass.data[DOMAIN][entry.entry_id]
    async_add_entities([AmbilightSyncSwitch(entry, manager)])


class AmbilightSyncSwitch(AmbilightSyncEntity, SwitchEntity):
    """Main on/off switch, suitable for HomeKit Bridge."""

    _attr_translation_key = "sync"
    _attr_icon = "mdi:television-ambient-light"

    def __init__(self, entry: ConfigEntry, manager: AmbilightSyncManager) -> None:
        super().__init__(entry, manager)
        self._attr_unique_id = f"{entry.entry_id}_sync"

    @property
    def is_on(self) -> bool:
        return self.manager.is_running

    @property
    def extra_state_attributes(self) -> dict[str, object]:
        return {
            "source": self.manager.source,
            "tv_poll_rate_hz": self.manager.poll_rate,
            "default_light_update_rate_hz": self.manager.update_rate,
            "lights": self.manager.light_count,
            "last_error": self.manager.last_error,
            "active_preset": self.manager.active_preset_name,
        }

    async def async_turn_on(self, **kwargs) -> None:
        await self.manager.async_start()
        self.async_write_ha_state()

    async def async_turn_off(self, **kwargs) -> None:
        await self.manager.async_stop()
        self.async_write_ha_state()
