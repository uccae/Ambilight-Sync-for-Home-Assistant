# Ambilight Sync for Home Assistant

Bring Philips Ambilight beyond the TV. Sync its colors with RGB lights already connected to Home Assistant, and shape the lighting around your room.

The integration reads colors directly from the TV over your local network. It needs no Hue Sync Box, screen capture or cloud service. Your lights use their existing Home Assistant integrations.

<img width="853" height="480" alt="Philips Ambilight TV synchronizing colors with a Xiaomi bedside lamp" src="https://github.com/user-attachments/assets/8b49939e-af2b-44f7-82ca-f0b9e86723e6" />

> Demo: Philips Ambilight synchronized with a Xiaomi Bedside Lamp connected to Home Assistant using the HomeKit integration.

[Install](#installation) · [First setup](#first-setup) · [Room lighting](#choose-how-lights-follow-the-screen) · [Automations](#automations) · [Troubleshooting](#troubleshooting)

## What you can do

- **Extend the screen into the room.** Use Classic zone mapping or place your TV and lights in an Ambient 3D layout.
- **Tune each light.** Set its update rate, brightness, saturation, transitions and color sources independently.
- **Experiment with lighting.** Fine-tune colors, adapt transitions to scene activity, and create custom lighting effects using Lab.
- **Save different moods.** Create presets and switch between them from the panel or Home Assistant automations.
- **Handle dark scenes gently.** Configure dimming, a brightness floor and a delayed switch-off.
- **Keep control.** Temporarily exclude a light from Sync, identify it in the room editor, and restore its previous state when Sync stops.
- **See what is happening.** Inspect color previews, output timing and connection diagnostics in the sidebar panel.

## What you need

- A Philips Ambilight TV that exposes Ambilight colors through the **jointSPACE API**. Setup offers API versions **1, 5 and 6**; availability depends on the TV and its firmware.
- Home Assistant with the TV reachable over the local network.
- One or more RGB-capable `light.*` entities. Matter, Zigbee, Hue, HomeKit and Wi-Fi lights can all be used through their existing integrations; responsiveness varies by device and connection.

A Hue Bridge is not required by Ambilight Sync. If your lights normally need a bridge, keep using it through Home Assistant.

## Installation

### Marketplace · Home Assistant 2026.11 and newer

Marketplace is built into Home Assistant. Open **Settings → Marketplace → Add from link**, enter the repository below, and select **Add**. Connect GitHub if prompted; choose **Integration** if asked for a type. Open the repository page, select **Install**, then restart Home Assistant.

```text
https://github.com/uccae/Ambilight-Sync-for-Home-Assistant
```

See the [official Marketplace guide](https://www.home-assistant.io/integrations/marketplace/#custom-repositories) for details. Existing HACS installations migrate automatically; there is no need to reinstall Ambilight Sync.

<details>
<summary>Home Assistant 2026.10 and older — install through HACS</summary>

Open **HACS → ⋮ → Custom repositories**, add the repository URL above as an **Integration**, download Ambilight Sync, and restart Home Assistant.

[Open in HACS / Marketplace](https://my.home-assistant.io/redirect/hacs_repository/?owner=uccae&repository=Ambilight-Sync-for-Home-Assistant&category=integration)

</details>

<details>
<summary>Manual installation</summary>

1. Download the integration ZIP from the [latest release](https://github.com/uccae/Ambilight-Sync-for-Home-Assistant/releases/latest).
2. Copy its `custom_components/ambilight_sync` folder to `/config/custom_components/ambilight_sync`.
3. Restart Home Assistant.

The final path must be `/config/custom_components/ambilight_sync/manifest.json`, without an extra nested folder.

</details>

## First setup

1. Turn on the TV. In Home Assistant, open **Settings → Devices & services → Add integration** and search for **Ambilight Sync**.
2. Enter the TV's IP address and API version. Start with **6** for a recent compatible TV; use the version supported by your model.
3. Complete PIN pairing if prompted. Compatible TVs that allow unauthenticated HTTP color reads do not need a PIN.
4. Open **Ambilight Sync** in the sidebar. On **Lights**, add your RGB lights. On **Atmosphere**, choose how they follow the screen.
5. Select **Apply changes**, then enable Sync. Try the defaults first and adjust one light at a time.

Settings and room positions stay in a draft until you apply them. **Discard** returns to the saved settings. The participation switch on each light card takes effect immediately.

## Choose how lights follow the screen

| Engine | Best for | How you configure it |
|---|---|---|
| **Classic** | Direct Ambilight zone mapping | Assign weighted screen zones manually, or use Spatial positioning with X/Y coordinates and Zone Falloff / Spread. |
| **Ambient** | Lighting arranged throughout the room | Place the TV and lights in 3D using linked front and top views. Height, depth and TV rotation influence the result. |

Both engines are part of the same integration. Switch between them under **Atmosphere → Lighting engine**.

In Classic, you can blend several zones for one light, such as **Left 50% + Right 50%**. Spatial positioning samples individual Ambilight segments; a smaller spread keeps the result local, while a larger spread blends a wider area.

In Ambient, enter distances in meters and the screen diagonal in inches. Physical positions are shared across presets; each preset keeps its own lighting settings. Natural, Matte, Reflective and Atmospheric are available, along with Phosphor.

Selecting a lamp in the room editor makes that physical lamp show a steady accent so you can identify it. Click empty space to clear the selection and end identification. The color preview itself uses the latest cached TV frame.

## Make the light feel right

Start with the default preset. For smoother lighting, first adjust the **light update rate** and **hardware transition** to suit your bulbs. Sending commands faster does not always make a light respond faster.

- **TV polling rate** controls how often colors are read from the TV. Each light has its own output rate.
- **Average**, **Perceptual** and **Dominant** offer different ways to choose a color from the sampled zones.
- **Intensity** changes brightness gain; **Saturation** changes color strength. Minimum and maximum brightness still limit the output.
- **Scene-cut detection** can respond promptly to abrupt changes. Set its threshold to `0%` to disable it.
- **Software smoothing** can soften updates when a device's native transitions are not enough.

Global settings apply to every light unless you enable an individual override. Presets store settings and light assignments; room positions are shared. Settings can also be copied between lights, with capability checks.

### Lab: color correction, dynamics and effects

**Lab** brings additional lighting controls and creative effects to both Classic and Ambient engines. Each feature is optional, can be configured independently, and is saved with your presets.

- **Color correction** — Fine-tune brightness with gamma adjustment and balance individual RGB channels. Apply settings globally or customize them for individual lights.
- **Scene Dynamics 2.0** — Automatically adapts light update rates and hardware transitions to changes in Ambilight colors. Calmer scenes can use slower, smoother transitions, while more active scenes receive faster updates.
- **Auto-response** — Shortens hardware transitions during significant brightness changes, helping lights react more quickly without sacrificing smoothness during smaller adjustments.
- **Color Echo** — Adds subtle traces of colors from recent scenes, creating a more continuous lighting atmosphere.
- **Original color blending** — Mixes in a portion of each light's pre-sync color during sustained Ambilight output.
- **Pause reaction** — Adjusts brightness and saturation when playback is paused, using a Home Assistant media player, sensor, or switch.
- **Custom effects** — Import effects from JSON or ZIP packages. Effects can modify colors, brightness, update rates, and transitions. Imported effects remain disabled until reviewed, configured, and enabled. See the [Effects API documentation](lab/EFFECT_API.md) for details.


Where supported, individual lights can use their own settings or be excluded from specific Lab features.

Lab effects respect existing dark-scene handling, synchronization stops, and manual light control.

### Dark scenes and inactivity

Dark-scene settings control what each light does when its sampled area turns black:

```text
Black delay → Fade to minimum brightness
                        ↓ if minimum is 0%
                   Hold at 1% → Off delay → OFF
```

A new non-black frame cancels that light's dark-scene cycle. A minimum brightness above `0%` keeps the light on at that level.

**Inactivity handling** is a separate, preset-wide setting under **Settings → Debug**. It reacts only to continuous, valid, fully black TV frames:

| Action | What happens after the timeout |
|---|---|
| **Do nothing** · default | Keep the normal polling rate and Sync behavior. |
| **Reduce polling rate** | Use the configured inactive rate. The first received non-black frame restores the normal rate. |
| **Stop synchronization** | End Sync. Start it again manually or with an automation. |

The default timeout is **60 seconds**. A lower inactive polling rate also means a longer wait to detect a returning picture. Network errors reset the inactivity timer; losing Wi-Fi does not trigger an inactivity stop.

**Restore lights on inactivity stop** is independent of the normal **Restore on stop** setting. Both use **Restore transition**, from **0–5 seconds**, with a default of **1.5 seconds**, where a light supports native transitions.

### Connection recovery

After repeated connection failures, Ambilight Sync retries and can look for the TV through a short SSDP discovery attempt. It saves a changed IP only after verifying the device identity and successfully reading colors, while keeping valid pairing data.

Automatic discovery needs a saved stable device identifier and reachable SSDP/UPnP. It can be blocked by Wi-Fi isolation or VLAN boundaries. Compatible TVs can use read-only HTTP; existing HTTPS pairing remains supported.

Debug shows the connection state, current address and transport, last successful response, recovery activity and effective polling rate.

## Updating and backups

Update through Marketplace, or replace the integration folder after a manual installation. Restart Home Assistant and reload the panel. Keep your existing TV entry to retain pairing, presets and room positions.

Use **Settings → Backup & Restore** in the Ambilight Sync panel to export or import configuration as JSON. Imports show a review before applying. These exports exclude TV credentials; use a full Home Assistant backup for a complete recovery point.

## Automations

The integration exposes a Sync switch, usually `switch.ambilight_sync`. You can also share it with Apple Home through Home Assistant's HomeKit Bridge.

### Activate a preset

```yaml
action: ambilight_sync.activate_preset
data:
  preset: Movie
```

Use the exact name of your preset. With more than one configured TV, include its `entry_id` to select the intended TV.

### Start Sync when playback starts

Automatic playback activation is handled by Home Assistant automations. Replace both example entity IDs with your own. Your media player must report `playing`; otherwise, use the playback state or sensor available for your TV.

```yaml
alias: Start Ambilight when content starts
triggers:
  - trigger: state
    entity_id: media_player.philips_tv
    to: "playing"
actions:
  - action: switch.turn_on
    target:
      entity_id: switch.ambilight_sync
mode: single
```

## Tested lights

These are observations from specific setups, not guarantees for every firmware or network.

| Light | Home Assistant connection | Observed behavior |
|---|---|---|
| **Xiaomi Mi Bedside Lamp 2** | HomeKit | Responsive, with smooth transitions; tested up to 8 Hz without noticeable slowdown. |
| **Govee M1** | Govee lights local | Works well; higher update rates help when smooth native color transitions are unavailable. |
| **Govee M1** | Matter | Slow updates and noticeable lag in the tested setup. |
| **Yandex GX53** | Matter | Works well at low update rates with smooth transitions; higher rates may add delay. |

## Troubleshooting

**The TV cannot connect or pairing fails.** Check its IP, power state and supported API version. Allow local communication between Home Assistant and the TV. A changed IP can be recovered automatically only when the device identity can be confirmed.

**The TV is on, but colors stay black.** Check the selected Processed / Measured source and try the other one. Some TVs expose an API that is reachable but does not provide usable colors in every state. Debug reports prolonged suspicious black responses separately from a network failure.

**Lights lag or update unevenly.** Reduce that light's update rate and tune its hardware transition. Compare its target and actual rates in diagnostics. The TV's color API and each light's response both affect latency.

**A selected lamp stays in the accent color.** Click empty space in the room editor or leave the tab to end identification.

**The panel still looks unchanged after an update.** Restart Home Assistant and reload the browser or Companion App panel.

<details>
<summary>Enable debug logging</summary>

```yaml
logger:
  default: warning
  logs:
    custom_components.ambilight_sync: debug
    haphilipsjs: debug
```

</details>

For a bug report, include the TV model and firmware, Home Assistant and integration versions, light model and connection, and relevant diagnostics. Remove credentials, tokens and other private information before posting logs.

[Report an issue](https://github.com/uccae/Ambilight-Sync-for-Home-Assistant/issues) · [Release history](https://github.com/uccae/Ambilight-Sync-for-Home-Assistant/releases)

## License

[MIT](LICENSE). Ambilight Sync is an independent community project and is not affiliated with Philips, Signify, Apple or the Home Assistant project.
