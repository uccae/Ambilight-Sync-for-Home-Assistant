# Ambilight Sync for Home Assistant

Sync Philips TV Ambilight colors with any RGB-capable light available in Home Assistant.

No Hue Bridge, no Hue Sync Box, no screen capture, no cloud processing.

> **Note:** this is a vibe-coded community project. It works, it is useful, but it is still experimental software. Expect rough edges and please report bugs.

## Features

- Reads Philips TV Ambilight colors through the jointSPACE API
- Works with Home Assistant `light.*` entities
- Supports Matter, Zigbee, Philips Hue and Wi-Fi RGB lights
- Multiple lights per zone
- HomeKit-compatible `switch.ambilight_sync`
- Local processing inside Home Assistant
- Hardware transition support
- Adjustable update rate, brightness, saturation and threshold
- Minimum brightness for dark scenes
- Black hold and separate fade-to-black timing
- Color modes:
  - **Average** — simple RGB averaging
  - **Perceptual** — favors visually meaningful bright and saturated colors while reducing the influence of near-black segments
  - **Dominant** — groups similar hues and selects the strongest color group without letting one random bright segment dominate
- Extended zones with configurable corner influence
- Sidebar configuration panel
- Restores previous light state when sync is stopped

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
Update rate:          1 Hz
Hardware transition:  0.8 s
Software smoothing:   0%
Threshold:             20

Color mode:            Perceptual
Minimum brightness:    8%
Black hold:             300 ms
Fade to black:          1.0 s
Corner influence:       35%
```

Higher update rates are not always better. Some smart bulbs become more delayed when they receive new RGB commands too frequently.

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
