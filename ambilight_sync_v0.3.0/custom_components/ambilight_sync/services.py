"""Home Assistant services for Ambilight Sync."""

from __future__ import annotations

from typing import Any

import voluptuous as vol
from homeassistant.core import HomeAssistant, ServiceCall
from homeassistant.exceptions import ServiceValidationError

from .config_model import (
    CONF_PROFILE_CONFIG,
    normalize_profile_config,
    profile_config_from_entry,
    resolve_preset,
)
from .const import DOMAIN, SERVICE_ACTIVATE_PRESET
from .manager import AmbilightSyncManager

_REGISTERED = "_services_registered"


async def async_register_services(hass: HomeAssistant) -> None:
    """Register services once per Home Assistant process."""
    domain_data = hass.data.setdefault(DOMAIN, {})
    if domain_data.get(_REGISTERED):
        return

    async def async_activate_preset(call: ServiceCall) -> None:
        entries = hass.config_entries.async_entries(DOMAIN)
        entry_id = call.data.get("entry_id")
        preset_value = str(call.data["preset"])

        if entry_id:
            entries = [entry for entry in entries if entry.entry_id == entry_id]
        if not entries:
            raise ServiceValidationError("Ambilight Sync config entry not found")
        if len(entries) > 1 and not entry_id:
            raise ServiceValidationError("entry_id is required when multiple Ambilight Sync TVs exist")

        entry = entries[0]
        profile_config = profile_config_from_entry(entry)
        preset_id = resolve_preset(profile_config, preset_value)
        if preset_id is None:
            raise ServiceValidationError(f"Preset not found: {preset_value}")

        profile_config["active_preset"] = preset_id
        profile_config = normalize_profile_config(profile_config)
        options = dict(entry.options)
        options[CONF_PROFILE_CONFIG] = profile_config
        hass.config_entries.async_update_entry(entry, options=options)

        manager: AmbilightSyncManager | None = hass.data.get(DOMAIN, {}).get(entry.entry_id)
        if manager is not None:
            await manager.async_apply_profile_config(profile_config)

    hass.services.async_register(
        DOMAIN,
        SERVICE_ACTIVATE_PRESET,
        async_activate_preset,
        schema=vol.Schema(
            {
                vol.Required("preset"): str,
                vol.Optional("entry_id"): str,
            }
        ),
    )
    domain_data[_REGISTERED] = True
