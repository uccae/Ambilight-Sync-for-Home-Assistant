"""Register the bundled Ambilight Sync sidebar panel."""

from __future__ import annotations

from hashlib import sha256
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
    panel_path = frontend_dir / "panel.js"
    # Do not rely only on the integration version for browser cache busting.
    # During development/public release preparation a build may keep the same
    # semantic version while panel.js changes. A content hash guarantees that
    # Home Assistant loads the matching frontend instead of a stale module.
    panel_bytes = await hass.async_add_executor_job(panel_path.read_bytes)
    panel_revision = sha256(panel_bytes).hexdigest()[:12]

    await hass.http.async_register_static_paths(
        [StaticPathConfig(PANEL_STATIC_URL, str(frontend_dir), False)]
    )
    await panel_custom.async_register_panel(
        hass=hass,
        frontend_url_path=PANEL_URL,
        # Version the custom-element name too. Home Assistant can keep the old
        # custom element alive in the browser while reconnecting after a backend
        # restart; customElements cannot redefine the same tag. Using the content
        # hash here forces the new panel class to be instantiated even without a
        # full browser-tab reload.
        webcomponent_name=f"{PANEL_COMPONENT}-{panel_revision}",
        module_url=f"{PANEL_STATIC_URL}/panel.js?rev={panel_revision}",
        sidebar_title="Ambilight Sync",
        sidebar_icon="mdi:television-ambient-light",
        require_admin=True,
        handle_safe_area=True,
    )
