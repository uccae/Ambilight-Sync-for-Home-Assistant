"""Bounded 3D ambient renderer. Pure computation; no polling or light services."""

from __future__ import annotations

from dataclasses import dataclass
import math
import re
from typing import Any

from .color import extract_tv_preview

SIDES = ("left", "top", "right", "bottom")
MAX_SEGMENTS = 400
MAX_LIGHTS = 64
BEHAVIORS = ("natural", "matte", "reflective", "atmospheric")
DEFAULT_TV = {"x": 0.0, "y": 1.2, "z": 0.0, "yaw": 0.0, "width": 1.4, "height": 0.8}
RGB = tuple[int, int, int]
Linear = tuple[float, float, float]
MATERIALS = {
    "natural": (0.08, 1.0, 1.0, 1.0),
    "matte": (0.55, 0.65, 0.85, 0.72),
    "reflective": (0.0, 2.2, 1.2, 1.0),
    "atmospheric": (0.55, 0.65, 0.85, 0.72),
}


def _number(value: Any, default: float, low: float, high: float) -> float:
    if isinstance(value, bool):
        return default
    try:
        number = float(value)
    except (TypeError, ValueError, OverflowError):
        return default
    return max(low, min(high, number)) if math.isfinite(number) else default


def normalize_rendering(raw: Any, lights: dict[str, Any]) -> dict[str, Any]:
    """Versioned opt-in config. Never changes the retained Classic mappings."""
    raw = raw if isinstance(raw, dict) else {}
    if "version" in raw and (type(raw["version"]) is not int or raw["version"] != 1):
        raise ValueError("Unsupported rendering configuration version")
    mode = "ambient" if raw.get("mode") == "ambient" else "classic"
    if mode == "ambient" and len(lights) > MAX_LIGHTS:
        raise ValueError(f"Ambient supports at most {MAX_LIGHTS} light entities")
    behavior = raw.get("behavior", "natural")
    if not isinstance(behavior, str) or behavior not in BEHAVIORS:
        behavior = "natural"
    room = raw.get("room") if isinstance(raw.get("room"), dict) else {}
    tv_raw = room.get("tv") if isinstance(room.get("tv"), dict) else {}
    limits = {"x": (-15, 15), "y": (0, 6), "z": (-15, 15), "yaw": (-180, 180),
              "width": (0.3, 4), "height": (0.2, 3)}
    tv = {key: _number(tv_raw.get(key), default, *limits[key]) for key, default in DEFAULT_TV.items()}
    positions = room.get("lights") if isinstance(room.get("lights"), dict) else {}
    result = {}
    valid_ids = [key for key in lights if isinstance(key, str) and len(key) <= 255 and re.fullmatch(r"light\.[a-z0-9_]+", key)]
    if mode == "ambient" and len(valid_ids) != len(lights):
        raise ValueError("Ambient requires valid light entity IDs")
    ids = sorted(valid_ids)[:MAX_LIGHTS]
    for index, entity_id in enumerate(ids):
        classic = lights[entity_id] if isinstance(lights[entity_id], dict) else {}
        spatial = classic.get("position_mode") == "spatial"
        default_x = (_number(classic.get("position_x"), 0, -100, 100) / 100 * 2.5
                     if spatial else max(-3.5, min(3.5, (index - (len(ids)-1)/2)*0.8)))
        default_y = (max(0, 1.2 - _number(classic.get("position_y"), 0, -100, 100)/100*0.8)
                     if spatial else 1.2)
        point = positions.get(entity_id)
        point = point if isinstance(point, dict) else {}
        result[entity_id] = {
            "x": _number(point.get("x"), default_x, -15, 15),
            "y": _number(point.get("y"), default_y, 0, 6),
            "z": _number(point.get("z"), 1.5, -15, 15),
        }
    return {"version": 1, "mode": mode, "behavior": behavior,
            "phosphor": raw.get("phosphor") is True,
            "room": {"tv": tv, "lights": result}}


def _decode(value: int) -> float:
    c = value/255
    return c/12.92 if c <= 0.04045 else ((c+0.055)/1.055)**2.4


LUT = tuple(_decode(i) for i in range(256))


def encode(rgb: Linear) -> RGB:
    def channel(value):
        c = max(0.0, min(1.0, value))
        return round(255*(12.92*c if c <= 0.0031308 else 1.055*c**(1/2.4)-0.055))
    return tuple(channel(c) for c in rgb)  # type: ignore[return-value]


@dataclass(frozen=True, slots=True)
class AmbientFrame:
    counts: tuple[int, ...]
    samples: tuple[RGB, ...]

    @classmethod
    def from_payload(cls, payload: Any) -> AmbientFrame:
        preview = extract_tv_preview(payload)
        if not preview:
            raise ValueError("No valid Ambilight samples")
        counts = tuple(len(preview[side]) for side in SIDES)
        if not 0 < sum(counts) <= MAX_SEGMENTS:
            raise ValueError(f"Ambient supports 1..{MAX_SEGMENTS} segments")
        return cls(counts, tuple(tuple(rgb) for side in SIDES for rgb in preview[side]))


@dataclass(frozen=True, slots=True)
class AmbientResult:
    signal: dict[str, RGB]
    primary: dict[str, RGB]
    colors: dict[str, RGB]
    raw_luma: dict[str, float]


class AmbientRenderer:
    """One renderer per active preset; time is supplied by the existing manager."""

    def __init__(self, config: dict[str, Any]) -> None:
        self.config = config
        self.tv = config["room"]["tv"]
        self.lamps = config["room"]["lights"]
        if len(self.lamps) > MAX_LIGHTS:
            raise ValueError("Too many Ambient lamps")
        self.behavior = config["behavior"]
        self.material = MATERIALS[self.behavior]
        self.phosphor = config["phosphor"] or self.behavior == "atmospheric"
        self._counts: tuple[int, ...] | None = None
        self._source: str | None = None
        self._weights: dict[str, tuple[tuple[float, ...], float]] = {}
        self._previous: dict[str, Linear] = {}
        self._residual: dict[str, Linear] = {}
        self._last_t: float | None = None
        self.rebuilds = 0
        self.segments = 0

    def forget(self, entity_id: str) -> None:
        """Discard black/unavailable history without owning its output lifecycle."""
        self._previous.pop(entity_id, None)
        self._residual.pop(entity_id, None)

    def reset_temporal(self) -> None:
        self._previous.clear()
        self._residual.clear()
        self._last_t = None

    def _build_weights(self, counts: tuple[int, ...]) -> None:
        tv = self.tv
        angle = math.radians(tv["yaw"])
        cs, sn = math.cos(angle), math.sin(angle)
        sources = []
        for side, count in zip(SIDES, counts, strict=True):
            for index in range(count):
                t = (index+0.5)/count
                if side == "left":
                    x, y, nx, ny = -tv["width"]/2, tv["height"]*(t-0.5), -1, 0
                elif side == "top":
                    x, y, nx, ny = tv["width"]*(t-0.5), tv["height"]/2, 0, 1
                elif side == "right":
                    x, y, nx, ny = tv["width"]/2, tv["height"]*(0.5-t), 1, 0
                else:
                    x, y, nx, ny = tv["width"]*(0.5-t), -tv["height"]/2, 0, -1
                # Virtual edge-biased emission into the room (+Z at yaw=0).
                # Rotate positions and directions around the same vertical Y.
                ex, ey, ez = nx*0.85, ny*0.85, 0.65
                length = math.sqrt(ex*ex+ey*ey+ez*ez)
                sources.append((tv["x"]+x*cs, tv["y"]+y, tv["z"]-x*sn,
                                (ex*cs+ez*sn)/length, ey/length, (-ex*sn+ez*cs)/length))
        diffusion, focus, _, _ = self.material
        rows = {}
        for entity_id, lamp in self.lamps.items():
            weights = []
            for x, y, z, nx, ny, nz in sources:
                dx, dy, dz = lamp["x"]-x, lamp["y"]-y, lamp["z"]-z
                distance = math.sqrt(dx*dx+dy*dy+dz*dz)
                direction = max(0.0, (nx*dx+ny*dy+nz*dz)/distance) if distance > 1e-9 else 1.0
                weights.append(((0.15+0.85*direction**2)/(1+(distance/1.5)**2))**focus)
            total = sum(weights) or 1.0
            normalized = tuple((1-diffusion)*w/total+diffusion/len(weights) for w in weights)
            distance = math.sqrt(sum((lamp[key]-tv[key])**2 for key in ("x", "y", "z")))
            gain = 1/(1+(distance/4)**2)
            rows[entity_id] = normalized, gain
        self._weights = rows
        self._counts = counts
        self.segments = sum(counts)
        self.rebuilds += 1

    def _response(self, rgb: Linear) -> Linear:
        _, _, gamma, chroma = self.material
        y = 0.2126*rgb[0]+0.7152*rgb[1]+0.0722*rgb[2]
        if y <= 0:
            return (0.0, 0.0, 0.0)
        contrast = y**gamma/y
        return tuple(max(0.0, min(1.0, (y+(c-y)*chroma)*contrast)) for c in rgb)  # type: ignore[return-value]

    def render(self, payload: Any, now: float, source: str = "processed") -> AmbientResult:
        if not math.isfinite(now) or (self._last_t is not None and now < self._last_t):
            raise ValueError("Invalid Ambient timestamp")
        frame = AmbientFrame.from_payload(payload)
        if frame.counts != self._counts:
            self._build_weights(frame.counts)
            self.reset_temporal()
        if source != self._source:
            self.reset_temporal()
            self._source = source
        dt = 0 if self._last_t is None else now-self._last_t
        decay = math.exp(-dt/0.25)
        self._last_t = now
        linear = tuple(tuple(LUT[c] for c in rgb) for rgb in frame.samples)
        lumas = tuple((0.2126*r+0.7152*g+0.0722*b)/255*100 for r, g, b in frame.samples)
        signal, primary, colors, raw_luma = {}, {}, {}, {}
        for entity_id, (weights, gain) in self._weights.items():
            mixed = tuple(sum(rgb[c]*w for rgb, w in zip(linear, weights, strict=True)) for c in range(3))
            p = tuple(c*gain for c in mixed)
            raw = sum(y*w for y, w in zip(lumas, weights, strict=True))
            signal[entity_id] = encode(mixed)
            primary[entity_id] = encode(self._response(p))
            raw_luma[entity_id] = raw
            if raw <= 0:
                self.forget(entity_id)
                colors[entity_id] = (0, 0, 0)
                continue
            decorated = p
            if self.phosphor:
                old = self._previous.get(entity_id, p)
                tail = self._residual.get(entity_id, (0.0, 0.0, 0.0))
                residual = tuple(max(tail[c]*decay, max(0.0, old[c]-p[c])) for c in range(3))
                residual = tuple(0.0 if dt > 1.5 or c < 1e-4 else min(1.0, c) for c in residual)
                self._residual[entity_id] = residual
                self._previous[entity_id] = p
                decorated = tuple(min(1.0, p[c]+0.12*residual[c]) for c in range(3))
            colors[entity_id] = encode(self._response(decorated))
        return AmbientResult(signal, primary, colors, raw_luma)
