"""Config flow for Ambilight Sync."""

from __future__ import annotations

import platform
from typing import Any

from haphilipsjs import ConnectionFailure, GeneralFailure, PairingFailure, PhilipsTV
import voluptuous as vol
from homeassistant.config_entries import ConfigFlow, ConfigFlowResult
from homeassistant.const import (
    CONF_API_VERSION,
    CONF_HOST,
    CONF_PASSWORD,
    CONF_PIN,
    CONF_USERNAME,
)

from .const import CONF_SYSTEM, DOMAIN

APP_ID = "ambilight_sync"
APP_NAME = "Home Assistant Ambilight Sync"

USER_SCHEMA = vol.Schema(
    {
        vol.Required(CONF_HOST): str,
        vol.Required(CONF_API_VERSION, default="6"): vol.In(["1", "5", "6"]),
    }
)


class AmbilightSyncConfigFlow(ConfigFlow, domain=DOMAIN):
    """Pair the Philips TV. Runtime settings live in the sidebar panel."""

    VERSION = 1

    def __init__(self) -> None:
        self._current: dict[str, Any] = {}
        self._hub: PhilipsTV | None = None
        self._pair_state: Any = None

    async def _async_prepare(self, host: str, api_version: int) -> None:
        hub = PhilipsTV(host, api_version=api_version, secured_transport=False)
        await hub.getSystem()
        await hub.setTransport(hub.secured_transport, hub.api_version_detected)
        if not hub.system:
            await hub.session.aclose()
            raise ConnectionFailure("TV returned no system data")

        self._hub = hub
        self._current[CONF_HOST] = host
        self._current[CONF_SYSTEM] = hub.system
        self._current[CONF_API_VERSION] = hub.api_version

        name = hub.name or str(hub.system.get("name") or host)
        self.context.update({"title_placeholders": {"name": name}})

        serial = hub.system.get("serialnumber")
        if serial:
            await self.async_set_unique_id(str(serial))
            self._abort_if_unique_id_configured()

    async def _async_finish(self) -> ConfigFlowResult:
        assert self._hub is not None
        name = self._hub.name or str(
            self._current[CONF_SYSTEM].get("name") or self._current[CONF_HOST]
        )
        await self._hub.session.aclose()
        self._hub = None
        return self.async_create_entry(
            title=f"Ambilight Sync · {name}", data=self._current
        )

    async def async_step_user(
        self, user_input: dict[str, Any] | None = None
    ) -> ConfigFlowResult:
        errors: dict[str, str] = {}
        if user_input is not None:
            try:
                await self._async_prepare(
                    str(user_input[CONF_HOST]), int(user_input[CONF_API_VERSION])
                )
            except GeneralFailure:
                errors["base"] = "cannot_connect"
            else:
                assert self._hub is not None
                if self._hub.pairing_type == "digest_auth_pairing":
                    return await self.async_step_pair()
                return await self._async_finish()

        return self.async_show_form(
            step_id="user",
            data_schema=self.add_suggested_values_to_schema(USER_SCHEMA, self._current),
            errors=errors,
        )

    async def async_step_pair(
        self, user_input: dict[str, Any] | None = None
    ) -> ConfigFlowResult:
        assert self._hub is not None
        errors: dict[str, str] = {}
        schema = vol.Schema({vol.Required(CONF_PIN): str})

        if user_input is None:
            try:
                self._pair_state = await self._hub.pairRequest(
                    APP_ID,
                    APP_NAME,
                    platform.node() or "Home Assistant",
                    platform.system() or "Home Assistant",
                    "native",
                )
            except PairingFailure as exc:
                await self._hub.session.aclose()
                return self.async_abort(
                    reason="pairing_failure",
                    description_placeholders={
                        "error_id": str(exc.data.get("error_id", "unknown"))
                    },
                )
            except GeneralFailure:
                errors["base"] = "cannot_connect"
            return self.async_show_form(step_id="pair", data_schema=schema, errors=errors)

        try:
            username, password = await self._hub.pairGrant(
                self._pair_state, str(user_input[CONF_PIN])
            )
        except PairingFailure as exc:
            if exc.data.get("error_id") == "INVALID_PIN":
                errors[CONF_PIN] = "invalid_pin"
                return self.async_show_form(
                    step_id="pair", data_schema=schema, errors=errors
                )
            await self._hub.session.aclose()
            return self.async_abort(
                reason="pairing_failure",
                description_placeholders={
                    "error_id": str(exc.data.get("error_id", "unknown"))
                },
            )
        except GeneralFailure:
            errors["base"] = "cannot_connect"
            return self.async_show_form(step_id="pair", data_schema=schema, errors=errors)

        self._current[CONF_USERNAME] = username
        self._current[CONF_PASSWORD] = password
        return await self._async_finish()
