"""Register the bundled Ambilight Sync sidebar panel."""

from __future__ import annotations

from pathlib import Path

from homeassistant.components import panel_custom
from homeassistant.components.frontend import async_panel_exists
from homeassistant.components.http import StaticPathConfig
from homeassistant.core import HomeAssistant

from .const import PANEL_COMPONENT, PANEL_STATIC_URL, PANEL_URL, VERSION


async def async_register_frontend(hass: HomeAssistant) -> None:
    """Serve the bundled frontend and add the sidebar panel."""
    if async_panel_exists(hass, PANEL_URL):
        return

    frontend_dir = Path(__file__).parent / "frontend"
    await hass.http.async_register_static_paths(
        [StaticPathConfig(PANEL_STATIC_URL, str(frontend_dir), False)]
    )
    await panel_custom.async_register_panel(
        hass=hass,
        frontend_url_path=PANEL_URL,
        webcomponent_name=PANEL_COMPONENT,
        module_url=f"{PANEL_STATIC_URL}/panel.js?v={VERSION}",
        sidebar_title="Ambilight Sync",
        sidebar_icon="mdi:television-ambient-light",
        require_admin=True,
        handle_safe_area=True,
    )
