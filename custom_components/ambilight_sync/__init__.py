"""Ambilight Sync integration."""

from __future__ import annotations

from typing import Any

from homeassistant.config_entries import ConfigEntry
from homeassistant.const import CONF_API_VERSION, CONF_HOST, CONF_PASSWORD, CONF_USERNAME, Platform
from homeassistant.core import HomeAssistant
from homeassistant.helpers.typing import ConfigType

from .config_model import CONF_PROFILE_CONFIG, profile_config_from_entry
from .const import CONF_SYSTEM, DOMAIN
from .frontend import async_register_frontend
from .manager import AmbilightSyncManager
from .services import async_register_services
from .websocket import async_register_websocket

PLATFORMS = [Platform.SWITCH]


async def async_setup(hass: HomeAssistant, config: ConfigType) -> bool:
    """Set up global sidebar, websocket and service pieces once."""
    hass.data.setdefault(DOMAIN, {})
    async_register_websocket(hass)
    await async_register_frontend(hass)
    await async_register_services(hass)
    return True


async def async_setup_entry(hass: HomeAssistant, entry: ConfigEntry) -> bool:
    """Set up Ambilight Sync from a config entry."""
    data: dict[str, Any] = dict(entry.data)
    system = dict(data.get(CONF_SYSTEM, {}))

    # First load after upgrading from the flat configuration automatically
    # creates one Default preset. TV credentials remain in entry.data untouched.
    profile_config = profile_config_from_entry(entry)
    if entry.options.get(CONF_PROFILE_CONFIG) != profile_config:
        options = dict(entry.options)
        options[CONF_PROFILE_CONFIG] = profile_config
        hass.config_entries.async_update_entry(entry, options=options)

    manager = AmbilightSyncManager(
        hass,
        entry=entry,
        host=data[CONF_HOST],
        api_version=int(data[CONF_API_VERSION]),
        system=system,
        username=data.get(CONF_USERNAME),
        password=data.get(CONF_PASSWORD),
        profile_config=profile_config,
    )

    hass.data.setdefault(DOMAIN, {})[entry.entry_id] = manager
    await hass.config_entries.async_forward_entry_setups(entry, PLATFORMS)
    return True


async def async_unload_entry(hass: HomeAssistant, entry: ConfigEntry) -> bool:
    """Unload Ambilight Sync."""
    unloaded = await hass.config_entries.async_unload_platforms(entry, PLATFORMS)
    if unloaded:
        manager: AmbilightSyncManager | None = hass.data.get(DOMAIN, {}).pop(
            entry.entry_id, None
        )
        if manager is not None:
            await manager.async_shutdown()
    return unloaded
