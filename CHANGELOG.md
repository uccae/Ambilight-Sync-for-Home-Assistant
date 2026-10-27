# Changelog

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
