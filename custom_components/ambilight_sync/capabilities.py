"""Use the HA light service's native color conversion; filter unsupported fields."""
from __future__ import annotations

from typing import Any
from homeassistant.components.light import LightEntityFeature

COLOR = frozenset(("rgb", "rgbw", "rgbww", "hs", "xy"))
DIMMABLE = COLOR | {"brightness", "color_temp", "white"}


def light_capabilities(state: Any) -> dict[str, Any]:
    attrs = state.attributes if state is not None else {}
    modes = attrs.get("supported_color_modes")
    # Older entities may expose only their current color mode. Do not assume
    # color support for an on/off switch or an entity without any capabilities.
    modes = set(modes) if isinstance(modes, (list, tuple, set, frozenset)) else set()
    if not modes and attrs.get("color_mode"):
        modes.add(attrs["color_mode"])
    if not modes and attrs.get("rgb_color") is not None:
        modes.add("rgb")
    if not modes and attrs.get("brightness") is not None:
        modes.add("brightness")
    features = int(attrs.get("supported_features", 0) or 0)
    return {"color": bool(modes & COLOR), "brightness": bool(modes & DIMMABLE),
            "transition": bool(features & LightEntityFeature.TRANSITION),
            "flash": bool(features & LightEntityFeature.FLASH), "modes": sorted(modes)}


def command_data(entity_id: str, state: Any, rgb, brightness: int, transition: float) -> dict[str, Any]:
    caps = light_capabilities(state)
    data: dict[str, Any] = {"entity_id": entity_id}
    if caps["color"]:
        data["rgb_color"] = rgb  # HA converts RGB to the supported native mode.
    if caps["brightness"]:
        data["brightness"] = brightness
    if caps["transition"] and transition > 0:
        data["transition"] = transition
    return data


def snapshot_data(entity_id: str, state: Any, snapshot: Any, transition: float = 0) -> dict[str, Any]:
    """Restore the captured mode, but respect the entity's current capabilities."""
    attrs = snapshot.attributes
    caps = light_capabilities(state)
    data: dict[str, Any] = {"entity_id": entity_id}
    if caps["brightness"] and attrs.get("brightness") is not None:
        data["brightness"] = attrs["brightness"]
    key = {"rgb": "rgb_color", "rgbw": "rgbw_color", "rgbww": "rgbww_color",
           "hs": "hs_color", "xy": "xy_color", "color_temp": "color_temp_kelvin"}.get(attrs.get("color_mode"))
    if key and attrs.get(key) is not None and (caps["color"] or attrs.get("color_mode") in caps["modes"]):
        data[key] = attrs[key]
    elif not attrs.get("color_mode") and caps["color"]:
        for key in ("rgb_color", "hs_color", "xy_color", "rgbw_color", "rgbww_color"):
            if attrs.get(key) is not None:
                data[key] = attrs[key]
                break
    if attrs.get("color_mode") == "white" and "white" in caps["modes"]:
        data["white"] = attrs.get("brightness") or 255
    effects = state.attributes.get("effect_list", []) if state is not None else []
    if attrs.get("effect") in effects:
        data["effect"] = attrs["effect"]
    if transition > 0 and caps["transition"]:
        data["transition"] = transition
    return data


def copy_light_settings(source: dict, targets: dict, states) -> dict[str, dict]:
    """Copy only synchronization controls. Keep every target's identity/mapping."""
    from copy import deepcopy
    result = deepcopy(targets)
    color_keys = {"color_mode", "saturation"}
    brightness_keys = {"brightness", "minimum_brightness", "intensity"}
    transition_keys = {"transition", "scene_cut_transition"}
    for entity_id, target in result.items():
        caps = light_capabilities(states.get(entity_id))
        overrides = deepcopy(source.get("overrides", {}))
        # Resolve missing source overrides before calling this function if an
        # explicit source value (rather than inherited defaults) is desired.
        for key in list(overrides):
            if ((key in color_keys and not caps["color"]) or
                (key in brightness_keys and not caps["brightness"]) or
                (key in transition_keys and not caps["transition"])):
                overrides.pop(key)
        kept = {k: v for k, v in target.get("overrides", {}).items() if
                (k in color_keys and not caps["color"]) or
                (k in brightness_keys and not caps["brightness"]) or
                (k in transition_keys and not caps["transition"])}
        target["overrides"] = {**kept, **overrides}
    return result
