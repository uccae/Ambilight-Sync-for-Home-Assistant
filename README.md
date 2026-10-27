# Ambilight Sync for Home Assistant

Sync Philips TV Ambilight colors with any RGB-capable light available in Home Assistant.

No Hue Bridge, no Hue Sync Box, no screen capture, no cloud processing.

> **Note:** this is a vibe-coded community project. Expect rough edges and please report bugs.

## What's new in 0.5.0

- **Ambient** engine with X/Y/Z room positioning, TV rotation and a screen diagonal in inches. **Classic remains the default.**
- Shared physical room geometry, temporary light participation and steady accent identification of selected lights.
- JSON Backup & Restore with validation and a change preview.
- Improved preset handoffs, mobile spacing, menus and dialogs; Chromatic-style Discard / Apply changes controls.
- Standard repository layout and validation workflow for HACS installation.

## Features

- Reads Philips TV Ambilight colors through the jointSPACE API
- Works with standard Home Assistant `light.*` entities
- Supports Matter, Zigbee, Philips Hue, Wi-Fi RGB lights and other compatible light integrations
- Runs locally inside Home Assistant

### Light configuration

- Ambient room mode with X/Y/Z coordinates and linked front/top views
- Temporary participation switch for each light, independent of presets
- Physical identification of the selected room light with a steady accent
- Copy Settings with device capability checks

- Multiple weighted Ambilight sources per light
- Independent update rate for each light
- Per-light overrides for brightness, saturation, transition, smoothing, thresholds and color processing
- Spatial light positioning with X/Y coordinates and per-light Zone Falloff / Spread
- Spatial mode uses the TV's individual Ambilight pixels instead of averaging whole edges
- Live Zone Spread visualization showing which Ambilight segments influence each Spatial light
- Manual weighted zones remain available as an advanced/compatibility mode
- Live per-light color preview and diagnostics in the sidebar
- Restores previous light state when sync is stopped

### Presets

- Create, duplicate, rename and delete custom presets
- Each preset stores its own global settings, light mappings and per-light overrides
- Switch presets from Home Assistant automations using `ambilight_sync.activate_preset`

### Color processing

- **Average** — simple RGB averaging
- **Perceptual** — favors visually meaningful bright and saturated colors while reducing the influence of near-black segments
- **Dominant** — groups similar hues and selects the strongest color group without allowing a single bright segment to dominate the entire zone
- Adjustable brightness, saturation and change threshold
- Rec.709 Black Threshold with hysteresis
- Minimum brightness for dark scenes
- Independent black delay, fade transition and switch-off delay
- Scene-cut detection for immediate response to abrupt color changes
- Scene cuts can interrupt the dark-scene cycle immediately

### Timing and diagnostics

- Hardware transition support when available
- Separate TV polling rate and per-light update rate
- Software smoothing
- Latest-frame-wins output handling to avoid stale command queues
- Target, queued and actual light update rates
- Replaced-frame counters and command latency
- Separate TV/light error throttling
- Warning when Philips `processed` Ambilight remains suspiciously black for an extended period

### Home Assistant

- Dedicated sidebar configuration panel
- Compact settings accordion with one section open at a time
- Optional Debug panel opened with a separate button
- Per-light preview and diagnostics collapsed by default
- Sync can be enabled or disabled directly from the sidebar
- HomeKit-compatible `switch.ambilight_sync`
- Preset switching from automations

## How it works

Philips TVs already calculate Ambilight colors internally.

This integration reads those values directly from the TV and sends them to Home Assistant lights:

```text
Philips TV
   │
   │ jointSPACE Ambilight API
   ▼
Home Assistant
   │
   ├── Matter
   ├── Zigbee
   ├── Philips Hue
   └── Wi-Fi RGB lights
```

Everything runs locally inside Home Assistant.

## Presets and per-light settings

### Intensity and dark-color stabilization

Intensity supports **50–400%**, globally or as a per-light override. **100%** retains the previous brightness gain. Minimum and maximum brightness still limit the result; increasing intensity may have little effect when the output is already at either limit. Saturation adjusts color independently of output brightness.

Weak color differences in very dark samples are suppressed before RGB normalization to reduce amplified tints. Bright and sufficiently saturated colors are retained. The Debug button exposes stabilization strength and RGB noise floor, plus the processing stages for one selected light. Suppression can also reduce genuine faint dark colors; adjust it to suit your TV and lights. Debug values apply only after Save, and the reset button only stages recommended values.

Existing presets, manual mappings and per-light overrides are preserved. Debug shows desired output, not an optical measurement or confirmation of the light's physical color.

Each preset stores its own global settings, light assignments, source mixer and individual light overrides. Ambient physical positions are shared across presets; TV poses are associated with each configured TV.

A light can mix several Ambilight zones, for example:

```text
Left   50%
Right  50%
```

Only enabled overrides replace the preset global values. TV polling is global, while each light can override how often it receives commands. This lets the TV be sampled frequently without flooding slower bulbs.

Presets can be activated from Home Assistant automations with:

```yaml
action: ambilight_sync.activate_preset
data:
  preset: Movie
```

## Classic spatial positioning

In Classic mode, each light can use either **Spatial** or **Manual** positioning. Ambient uses a separate X/Y/Z room layout; see the [room guide](docs/AMBIENT.md).

Spatial mode uses X/Y coordinates from `-100` to `+100` and weights the individual Ambilight pixels exposed by the TV according to their distance from the virtual light position.

`Zone Falloff / Spread` controls how local or wide that sampling is:

- low values favor only the closest Ambilight segments
- high values create a wider ambient mix

The sidebar visualizes the actual segments and their relative influence, so X/Y and Zone Spread can be tuned visually.

Existing configurations stay in **Manual** mode after upgrading and keep their current zones and weights unchanged.

## Scene-cut response

Scene-cut detection watches for abrupt color changes seen by each light.

When a change exceeds the configured threshold, the new frame can bypass normal rate limiting, software smoothing and the standard change threshold, then use a dedicated short scene-cut transition.

A scene cut also immediately interrupts an active dark-scene cycle, so a bright new scene does not wait for a pending fade or OFF timer.

Set Scene-cut threshold to `0%` to disable detection.

## Dark-scene handling

The dark-scene cycle is intentionally split into separate stages:

```text
Black detected
  → Black delay
  → Fade transition to Minimum brightness (or 1%)
  → if Minimum brightness = 0%: Off delay
  → OFF
```

Any non-black frame cancels the cycle immediately and takes ownership of the light.

### Black Threshold

Uses Rec.709 luminance calculated from the raw Ambilight samples before Average / Perceptual / Dominant processing.

At `0%`, only exact black is treated as black. At higher values, a small proportional hysteresis prevents rapid switching around the threshold.

### Black delay

Controls how long the Ambilight area must remain black before dimming begins. This filters short dark frames and cuts.

### Fade transition

Controls the hardware transition used for the single dimming command.

The light fades to:

- `Minimum brightness`, if it is above `0%`
- `1%`, if Minimum brightness is `0%`

The last RGB color is preserved during the fade.

### Minimum brightness

With a value above `0%`, black fades to that brightness floor and the light stays on.

At `0%`, black fades to `1%` and then proceeds to the switch-off delay.

### Off delay

Used only when Minimum brightness is `0%`.

After the fade transition reaches `1%`, the light remains there for the configured delay before receiving the final `OFF` command.

This is useful for bulbs that need a short low-brightness hold before switching off cleanly.

## Recommended starting point

A reasonable starting configuration for smooth ambient lighting:

```text
TV polling rate:       15 Hz
Light update rate:      1–8 Hz
Hardware transition:   0.5–0.8 s
Software smoothing:    0%
Change threshold:      12–20

Color mode:             Perceptual
Black threshold:         1–4%
Black delay:             0–300 ms
Fade transition:         0.3–1.0 s
Off delay:               0.5–2.0 s
Minimum brightness:      0–8%
Scene-cut threshold:    35%
Scene-cut transition:   0.05 s
Zone Spread:            40–50%
```

Higher light update rates are not always better. Some smart bulbs become more delayed when they receive RGB commands too frequently, while others without smooth hardware transitions may benefit from higher rates.

## Installation

### HACS

1. Open **HACS → menu (⋮) → Custom repositories**.
2. Add `https://github.com/uccae/Ambilight-Sync-for-Home-Assistant` and choose **Integration** as the type.
3. Find **Ambilight Sync for Home Assistant**, download **v0.5.0** or a later published release, and restart Home Assistant.
4. Go to **Settings → Devices & services → Add integration**, search for **Ambilight Sync**, and pair the Philips TV.
5. Open **Ambilight Sync** from the sidebar to configure lights.

[Open repository in HACS](https://my.home-assistant.io/redirect/hacs_repository/?owner=uccae&repository=Ambilight-Sync-for-Home-Assistant&category=integration)

### Manual installation

1. Download `ambilight_sync_v0.5.0.zip` from the [release page](https://github.com/uccae/Ambilight-Sync-for-Home-Assistant/releases).
2. Extract it and copy `custom_components/ambilight_sync` to `/config/custom_components/ambilight_sync`.
3. Restart Home Assistant, then add the integration under **Settings → Devices & services** and open its sidebar panel.

### Updating

Update with HACS, or replace the integration folder for a manual installation. Restart Home Assistant and reload the panel. Keep the existing integration entry: pairing and presets are migrated automatically. Back up Home Assistant before updating; older Ambient users should also review any retained room-layout alternatives.

## Tested lights

Real-world behavior can vary significantly depending on the device, integration and transport used.

| Device | Connection | Result | Notes |
|---|---|---|---|
| Govee M1 | Govee lights local | ✅ Good | Works well. High update rates are recommended because smooth hardware color transitions are not available. |
| Govee M1 | Matter | ⚠️ Poor | Slow updates, noticeable lag and no smooth color transition. Not recommended for Ambilight sync. |
| Xiaomi Mi Bedside Lamp 2 | HomeKit | ✅ Excellent | Very responsive. Smooth color transitions work well. Tested up to 8 Hz without noticeable slowdown. |
| Yandex GX53 | Matter | ✅ Good | Works well at low update rates with smooth transitions. Higher rates may introduce delay. |

Different smart lights behave very differently under frequent RGB updates, which is why per-light update rates and overrides are available.

## HomeKit

The integration exposes:

```text
switch.ambilight_sync
```

You can publish this switch through Home Assistant's HomeKit Bridge.

## Debug logging

```yaml
logger:
  default: warning
  logs:
    custom_components.ambilight_sync: debug
    haphilipsjs: debug
```

Please remove credentials, tokens and other private information before posting logs publicly.

## Compatibility

The integration should work with any RGB-capable Home Assistant `light.*` entity.

Actual behavior depends on TV firmware, light firmware, transport and how each light implements transitions.

## License

MIT License.

## Disclaimer

This is an independent community project and is not affiliated with or endorsed by Philips, Signify, Matter, Apple or the Home Assistant project.

Philips, Ambilight, Hue, HomeKit, Matter and Home Assistant are trademarks of their respective owners.
