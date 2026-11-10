# Changelog

## 0.6.0

- Add Lab with pause response, unchanged-color blending and Color Echo.
- Adjust light command rates continuously with Scene Dynamics 2.0. Shorten hardware transitions on brightness jumps with Auto response.
- Add brightness gamma and RGB balance, with shared settings and per-light overrides.
- Import configurable JSON or ZIP effects and behaviors. Auto response honors short transitions set manually, on scene cuts, or by an imported effect.
- Choose how Sync responds to external light changes.

Lab features are optional and stored per preset. Existing presets, light assignments and room coordinates carry over.

## 0.5.2

- Add opt-in inactivity handling: keep normal behavior, reduce polling, or stop Sync after continuous black frames.
- Add independent restoration on inactivity stop and a native 0–5 s Restore transition (default 1.5 s).
- Recover connection and changed TV IP through bounded SSDP discovery with device identity verification; preserve saved pairing data.
- Support read-only HTTP on compatible TVs while retaining HTTPS pairing.
- Show connection/last-response diagnostics and skip processing of completed black frames safely.

Existing presets and room positions are preserved. Do nothing remains the default. Restart Home Assistant after updating.

Physical network/device verification is still needed; discovery depends on a saved stable identifier and SSDP reachability.


## 0.5.1

- Recover the Philips client after repeated empty responses or connection failures.
- Treat missing frames as errors, while accepting valid black frames.
- Run bounded diagnostics independently of color polling and require confirmed TV power before warning.
- Retry unconfirmed diagnostics without flooding and close diagnostic clients on cancellation.

## 0.5.0

### Added

- Optional Ambient engine inside the existing integration, with X/Y/Z room positioning, TV orientation and four light characters: Natural, Matte, Reflective and Atmospheric. Classic remains the default.
- Shared physical room geometry across presets, with saved alternatives when migrating conflicting layouts.
- Continuous accent identification of a selected room light. Clicking empty space clears the selection and restores synchronization or the previous light state.
- Temporary per-light participation controls, independent of presets.
- JSON configuration export/import with validation and a change preview; TV credentials are excluded.
- Room Undo/Redo and capability-aware copying of light settings.

### Improved

- Preset handoffs retain common light workers and avoid an intermediate full stop.
- Responsive layout, card spacing, menus, dialogs and touch controls in both themes.
- Shared Chromatic-style Discard / Apply changes surface.
- TV screen diagonal in inches, with the existing aspect ratio preserved.
- Automatic room preview updates and bundled Google Material Symbols for Undo/Redo.

### Fixed

- Dismissed error messages stay hidden until the error changes or clears and occurs again.
- Virtual TV glow turns off with synchronization, including when an old preview response arrives later.
- Room selection can be cleared without changing coordinates or saving a draft.
- Selected-light identification ends on deselection, navigation, connection loss or lease expiry.

### Distribution and compatibility

- Standard `custom_components/ambilight_sync/` repository layout for HACS.
- Integration metadata, local brand icons and HACS/hassfest validation workflow.
- Existing pairings, presets, manual zone weights and per-light overrides are retained. Ambient is opt-in.
- No new mandatory runtime dependency. The existing polling and command transport remain in use.

Validation covers the interface and selected-light command/cleanup contracts. Physical TV and light behavior varies by device; no new end-to-end hardware certification is claimed.

## 0.4.1

- Refreshed sidebar UI and TV color previews.
