# Ambilight Sync extension API v1

Import `.json` definitions or `.zip` bundles from the **Lab → Import effect** button. Packages are validated before being added, disabled, to the current preset's draft. Assign lights and inputs, configure parameters, then Apply changes.

An extension is interpreted data, not executable Python or JavaScript. It can transform light output or implement stateful behavior through the operations below. It cannot replace the integration, access files/network, call HA services directly, change TV polling, bypass manual ownership, or override confirmed black-frame handling.

## Minimal definition

```json
{
  "format": "ambilight_sync.effect",
  "version": 1,
  "api": 1,
  "id": "soft_breath",
  "name": "Soft Breath",
  "author": "Your name",
  "revision": "1.0",
  "description": "Gently varies current lighting brightness.",
  "kind": "effect",
  "parameters": {
    "period": {"label": "Period (s)", "min": 2, "max": 30, "default": 8},
    "depth": {"label": "Depth", "min": 0, "max": 1, "default": 0.2}
  },
  "operations": [
    {"type": "brightness_scale", "value": "1-p_depth*(0.5+0.5*sin(time*6.283185/p_period))"}
  ]
}
```

IDs and parameter/input/state names match `[a-z][a-z0-9_]{0,39}`. `id`, `name`, format/version/API and operations are required. `author`, `revision`, `description`, `kind`, parameters, inputs, state and `when` have defaults. `kind` is `effect` or `behavior`. Unknown fields and API versions are rejected.

## Conditions and state

```json
{
  "inputs": {"player": {"label": "Media player", "default": ""}},
  "state": {"paused_for": {"initial": 0, "update": "s_paused_for+dt if i_player == 'paused' else 0"}},
  "when": "i_player == 'paused' and s_paused_for >= 2"
}
```

These fields extend a complete definition, not a standalone import file. Input entities may be `media_player`, `binary_sensor`, `input_boolean` or `sensor`. The user can reassign them in the card. `on`/`off` become 1/0; numeric states become finite numbers; other states remain strings, including `unknown` and `unavailable`. Handle unavailable input states in `when` before numeric comparisons.

State is per extension and target light. All update formulas read the previous state simultaneously. `when` and operations use that same previous-state snapshot; updated values become visible on the next frame. Updates continue while `when` is false. Variables are reset on Stop, a lost TV stream, confirmed black for that light, unavailability or transfer to manual control. They are not persisted or exported.

## Formula variables

| Name | Meaning |
|---|---|
| `r`, `g`, `b` | Current source target channels, 0–255, before time filtering, color correction and custom visual operations |
| `brightness` | Current source brightness target, 0–100%, before time filtering, color correction and custom visual operations |
| `original_r/g/b`, `original_brightness` | Saved lighting reference; originally-off light has zero brightness |
| `time` | Seconds since the current runtime session began, bounded to 1,000,000 |
| `dt` | Seconds since this light's previous recipe update; 0 on the first frame, bounded to 10 |
| `activity` | Scene color activity, 0–1 |
| `mean_change` | Mean normalized RGB change per second |
| `changed_zones` | Time-weighted fraction of significantly changing Ambilight segments, 0–1 |
| `paused` | 1 when the configured Lab pause source reports pause, otherwise 0 |
| `x`, `y`, `z`, `distance` | Physical room coordinates and distance to the TV center, meters; 0 if no point exists |
| `p_name`, `i_name`, `s_name` | Parameter, HA input and previous state variable |

Operators: `+ - * / %`, comparisons, `and`, `or`, `not`, and `a if condition else b`.

Functions: `min`, `max`, `abs`, `sin`, `cos`, `sqrt`, `clamp(x, min, max)`, `mix(a,b,amount)`, `step(edge,x)`, `smoothstep(low,high,x)`. Trigonometric angles are radians. There are no loops, comprehensions, attributes, indexing, imports, powers, assignments or arbitrary function calls. Arithmetic is bounded to finite values ±1,000,000. Formula errors are reported rather than guessed.

## Operations

Visual operations receive the output after built-in rendering, Color Echo, Color correction, the original-light blend and Pause response. Formula values use the source context above. List order is significant.

| Type | Fields | Meaning |
|---|---|---|
| `saturation` | `value` | Relative saturation %, bounded 0–200 |
| `brightness` | `value` | Absolute brightness %, bounded 0–100 |
| `brightness_scale` | `value` | Multiply brightness, factor bounded 0–4 |
| `hue` | `value` | Rotate hue by degrees |
| `color` | `r`, `g`, `b` | Set channels, each bounded 0–255 |
| `mix` | `r`, `g`, `b`, `amount` | Mix with a color at current brightness; amount bounded 0–1, in linear RGB energy |
| `hold` | `value` | Behavior only: nonzero temporarily suppresses ordinary output to selected lights |
| `rate` | `value` | Behavior only: command-rate ceiling, 0.25–30 Hz, still capped by the user's rate |
| `transition` | `value` | Behavior only: normal native-transition request, 0–5 seconds |

Several holds combine with OR. For rate and transition requests, the last applicable extension wins within host limits. Scene cuts and return from black bypass smoothing. Lights with Scene Dynamics use the rate calculated from measured activity during scene cuts and the upper end of the range for the first command after black. An applicable extension can cap the rate or shorten the transition. Auto response uses the final brightness after custom visual operations to shorten the transition down to 0.1 s. Explicit extension transitions below 0.1 s retain their value during ordinary output, including 0 for an immediate change.

Hold does not stop the integration or TV polling. It does not transfer permanent ownership or change presets. Raw black handling takes priority. Clearing a hold resumes via the normal handoff. External/manual ownership always wins.

## Bundles

A JSON bundle has:

```json
{"format":"ambilight_sync.effects","version":1,"effects":["complete definitions, as JSON objects"]}
```

Replace the explanatory string with actual complete definition objects. A ZIP instead contains `manifest.json` and root-level JSON files:

```json
{"format":"ambilight_sync.effects","version":1,"effects":["soft_breath.json","pause_reading.json"]}
```

For a single-file ZIP, `effect.json` is accepted without a manifest. Additional root-level `.md` and `.txt` documentation is allowed. No directories, path traversal, encrypted files, symbolic links or executable files are accepted. ZIPs are read in memory and never extracted to disk.

## Limits and error behavior

- 8 installed definitions per preset, up to 4 enabled at once; up to 64 selected lights per extension.
- Per definition: 8 parameters, 4 inputs, 4 state variables, 8 operations.
- 192 characters and 48 AST nodes per formula; 128 expression nodes in total per definition.
- File ≤128 KB; individual JSON ≤64 KB; ZIP ≤20 files and ≤512 KB declared uncompressed data.
- Errors discard that extension's entire frame contribution, show a diagnostic, and pause it for at least 5 seconds. The next eligible TV frame retries it. Other extensions and normal output continue.

Definitions/settings are saved in the existing preset store and included in configuration backups. Old backups receive disabled defaults. Per-light assignments are remapped with backup light mapping; input entity IDs retain their names. Export writes current parameter/input choices as definition defaults and omits target-light assignments and live state.

Updating an existing ID replaces its definition only in the draft, retains compatible settings/assignments, and stages it disabled. No imported package is automatically enabled. All processing uses existing TV frames, light workers, command queue and rate limits.

See the [example bundle](../examples/ambient_effects.zip) and its individual JSON definitions for working examples. Arbitrary Python extensions require a different loading/isolation model and are not part of API v1.
