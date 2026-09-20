# Ambilight Sync for Home Assistant

Sync Philips TV Ambilight colors with any RGB-capable light available in Home Assistant.

No Hue Bridge, no Hue Sync Box, no screen capture, no cloud processing.

> **Note:** this is a vibe-coded community project. It works, it is useful, but it is still experimental software. Expect rough edges and please report bugs.

## Features

- Reads Philips TV Ambilight colors through the jointSPACE API
- Works with standard Home Assistant `light.*` entities
- Supports Matter, Zigbee, Philips Hue, Wi-Fi RGB lights and other compatible light integrations
- Runs locally inside Home Assistant

### Light configuration

- Multiple weighted Ambilight sources per light
- Independent update rate for each light
- Per-light overrides for brightness, saturation, transition, smoothing, thresholds and color processing
- Live per-light color preview in the sidebar
- Restores previous light state when sync is stopped

### Presets

- Create, duplicate, rename and delete custom presets
- Each preset can store its own global settings, light mappings and per-light overrides
- Switch presets from Home Assistant automations using `ambilight_sync.activate_preset`

### Color processing

- **Average** — simple RGB averaging
- **Perceptual** — favors visually meaningful bright and saturated colors while reducing the influence of near-black segments
- **Dominant** — groups similar hues and selects the strongest color group without allowing a single bright segment to dominate the entire zone
- Adjustable brightness, saturation and change threshold
- Minimum brightness for dark scenes
- Black hold to prevent flickering during short dark frames
- Separate fade-to-black timing

### Ambilight zones

- Left
- Right
- Top
- Bottom
- Whole screen
- Extended side zones with configurable corner influence
- Multiple zones can be mixed together with custom weights for a single light

### Transitions and timing

- Hardware transition support when available
- Separate TV polling rate and per-light update rate
- Software smoothing
- Designed to support both slow ambient lights and high-frequency devices

### Home Assistant

- Dedicated sidebar configuration panel
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

Each preset stores its own global settings, light assignments, source mixer and individual light overrides. A light can mix several Ambilight zones, for example:

```text
Left   50%
Right  50%
```

Only enabled overrides replace the preset global values. TV polling is global, while each light can override how often it receives commands. This lets the TV be sampled frequently without flooding slower bulbs.

Presets can also be activated from Home Assistant automations with the `ambilight_sync.activate_preset` service:

```yaml
action: ambilight_sync.activate_preset
data:
  preset: Movie
```

## Zones

Available zones:

- Left
- Right
- Top
- Bottom
- Whole screen
- Whole left side + corners
- Whole right side + corners
- Whole top side + corners
- Whole bottom side + corners

### Corner influence

Controls how much the neighboring edge sections affect a composite side.

For example, `Whole left side + corners` always uses the left edge at full weight, while the top-left and bottom-left areas are mixed in according to the configured percentage.

## Dark scene handling

### Minimum brightness

Prevents lights from dropping below a configured brightness level.

Set it to `0%` to keep the old behavior.

### Black hold

Waits briefly before reacting to a black or nearly black Ambilight zone.

This reduces flicker during cuts or very short dark frames.

### Fade to black

Controls how long the light takes to fade toward minimum brightness or off.

This is separate from the normal color transition time.

## Recommended starting point

These settings are intentionally slow and smooth:

```text
TV polling rate:      1 Hz
Light update rate:     1 Hz
Hardware transition:  0.8 s
Software smoothing:   0%
Threshold:             20

Color mode:            Perceptual
Minimum brightness:    8%
Black hold:             300 ms
Fade to black:          1.0 s
Corner influence:       35%
```

Higher light update rates are not always better. Some smart bulbs become more delayed when they receive new RGB commands too frequently. If your TV handles it comfortably, you can raise TV polling to 2–4 Hz while keeping slower lights at 1 Hz so they receive fresher frames without receiving more commands.

## Installation

1. Download the latest release.
2. Copy:

```text
custom_components/ambilight_sync
```

to:

```text
/config/custom_components/ambilight_sync
```

3. Restart Home Assistant.
4. Go to **Settings → Devices & services → Add integration**.
5. Search for **Ambilight Sync** and pair the Philips TV.
6. Open **Ambilight Sync** from the Home Assistant sidebar to configure lights and behavior.

## Tested lights

Real-world behavior can vary significantly depending on the device, integration and transport used.

| Device | Connection | Result | Notes |
|---|---|---|---|
| Govee M1 | Govee lights local | ✅ Good | Works well. High update rates are recommended because smooth hardware color transitions are not available. |
| Govee M1 | Matter | ⚠️ Poor | Slow updates, noticeable lag, and no smooth color transition. Not recommended for Ambilight sync. |
| Xiaomi Mi Bedside Lamp 2 | HomeKit | ✅ Excellent | Very responsive. Smooth color transitions work well. Tested up to 8 Hz without noticeable slowdown. |
| Yandex GX53 | Matter | ✅ Good | Works well at low update rates with smooth transitions. Higher rates may introduce delay. |

### Notes

Different smart lights behave very differently under frequent RGB updates.

Some devices perform best with low update rates and long hardware transitions, while others require high update rates because they do not support smooth transitions internally.

For this reason, per-light update rate and transition settings are recommended.

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

Test results may vary depending on TV firmware, light firmware and how each light implements transitions.

## Project status

Beta.

The priority is stable, pleasant ambient lighting rather than maximum FPS.

Testing on different Philips TV models and different light platforms is welcome.

## License

MIT License.

## Disclaimer

This is an independent community project and is not affiliated with or endorsed by Philips, Signify, Matter, Apple or the Home Assistant project.

Philips, Ambilight, Hue, HomeKit, Matter and Home Assistant are trademarks of their respective owners.
