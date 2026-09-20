"""Pure color helpers used by Ambilight Sync."""

from __future__ import annotations

import colorsys
import math
from collections.abc import Mapping
from typing import Any

from .const import (
    COLOR_MODE_DOMINANT,
    COLOR_MODE_PERCEPTUAL,
    CORNER_SLICE_FRACTION,
    ZONE_ALL,
    ZONE_BOTTOM,
    ZONE_BOTTOM_CORNERS,
    ZONE_LEFT,
    ZONE_LEFT_CORNERS,
    ZONE_RIGHT,
    ZONE_RIGHT_CORNERS,
    ZONE_TOP,
    ZONE_TOP_CORNERS,
)

RGB = tuple[int, int, int]
WeightedSamples = list[tuple[RGB, float]]


def _clamp_channel(value: float) -> int:
    return max(0, min(255, round(value)))


def _pixel_rgb(pixel: Any) -> RGB | None:
    if not isinstance(pixel, Mapping):
        return None
    try:
        return (
            _clamp_channel(float(pixel["r"])),
            _clamp_channel(float(pixel["g"])),
            _clamp_channel(float(pixel["b"])),
        )
    except (KeyError, TypeError, ValueError):
        return None


def _pixel_sort_key(item: tuple[Any, Any]) -> tuple[int, int | str]:
    """Sort numeric jointSPACE pixel indexes naturally, with a safe fallback."""
    key = item[0]
    try:
        return (0, int(key))
    except (TypeError, ValueError):
        return (1, str(key))


def _pixels_from_side(side: Any) -> list[RGB]:
    if not isinstance(side, Mapping):
        return []
    result: list[RGB] = []
    for _, pixel in sorted(side.items(), key=_pixel_sort_key):
        rgb = _pixel_rgb(pixel)
        if rgb is not None:
            result.append(rgb)
    return result


def _weighted_average(samples: WeightedSamples) -> RGB | None:
    if not samples:
        return None
    total = sum(max(0.0, weight) for _, weight in samples)
    if total <= 0:
        return None
    return tuple(
        _clamp_channel(
            sum(rgb[i] * max(0.0, weight) for rgb, weight in samples) / total
        )
        for i in range(3)
    )  # type: ignore[return-value]


def average_rgb(pixels: list[RGB]) -> RGB | None:
    """Legacy unweighted RGB average."""
    return _weighted_average([(pixel, 1.0) for pixel in pixels])


def _perceptual(samples: WeightedSamples) -> RGB | None:
    """Choose a natural ambient color without letting black muddy the hue.

    Hue and saturation are weighted toward visible, saturated samples. Overall
    value/brightness still includes the whole sampled area, so a tiny saturated
    pixel in a mostly dark scene does not turn the room into a lighthouse.
    """
    if not samples:
        return None

    spatial_total = sum(max(0.0, weight) for _, weight in samples)
    if spatial_total <= 0:
        return None

    hsv_samples: list[tuple[float, float, float, float]] = []
    sin_sum = 0.0
    cos_sum = 0.0
    sat_sum = 0.0
    hue_weight_total = 0.0
    chroma_total = 0.0

    for rgb, spatial_weight in samples:
        spatial_weight = max(0.0, spatial_weight)
        if spatial_weight <= 0:
            continue
        r, g, b = (channel / 255.0 for channel in rgb)
        h, s, v = colorsys.rgb_to_hsv(r, g, b)
        hsv_samples.append((h, s, v, spatial_weight))

        # Near-black pixels still affect scene brightness below, but contribute
        # very little to hue. Saturated visible colors therefore stay clean.
        visible = max(0.0, (v - 0.015) / 0.985)
        hue_weight = spatial_weight * (0.12 + 0.88 * s) * (visible**1.35)
        chroma_total += spatial_weight * s * visible
        if s > 0.035 and v > 0.015 and hue_weight > 0:
            angle = h * math.tau
            sin_sum += math.sin(angle) * hue_weight
            cos_sum += math.cos(angle) * hue_weight
            sat_sum += s * hue_weight
            hue_weight_total += hue_weight

    if not hsv_samples:
        return None

    # Grey/near-neutral scenes are more stable as a straight RGB average.
    if hue_weight_total <= 1e-8 or chroma_total / spatial_total < 0.02:
        return _weighted_average(samples)

    hue = (math.atan2(sin_sum, cos_sum) / math.tau) % 1.0
    saturation = min(1.0, (sat_sum / hue_weight_total) * 1.06)

    mean_value = sum(v * w for _, _, v, w in hsv_samples) / spatial_total
    rms_value = math.sqrt(
        sum((v * v) * w for _, _, v, w in hsv_samples) / spatial_total
    )
    # RMS keeps a visible object from disappearing; the mean prevents a tiny
    # bright object from making a mostly-dark edge too bright.
    value = min(1.0, 0.62 * rms_value + 0.38 * mean_value)

    r, g, b = colorsys.hsv_to_rgb(hue, saturation, value)
    return (
        _clamp_channel(r * 255),
        _clamp_channel(g * 255),
        _clamp_channel(b * 255),
    )


def _dominant(samples: WeightedSamples) -> RGB | None:
    """Select the strongest recurring hue cluster, not the brightest single pixel."""
    if not samples:
        return None

    bin_count = 12
    bins: list[list[tuple[float, float, float, float, float]]] = [
        [] for _ in range(bin_count)
    ]
    total_spatial = sum(max(0.0, weight) for _, weight in samples)
    neutral: WeightedSamples = []

    for rgb, spatial_weight in samples:
        spatial_weight = max(0.0, spatial_weight)
        if spatial_weight <= 0:
            continue
        r, g, b = (channel / 255.0 for channel in rgb)
        h, s, v = colorsys.rgb_to_hsv(r, g, b)
        if s < 0.07 or v < 0.018:
            neutral.append((rgb, spatial_weight))
            continue

        # Area matters directly through spatial_weight. Brightness/saturation
        # improve the vote but cannot replace having several matching samples.
        importance = spatial_weight * (0.35 + 0.65 * s) * (0.30 + 0.70 * v)
        idx = min(bin_count - 1, int(h * bin_count))
        bins[idx].append((h, s, v, spatial_weight, importance))

    if not any(bins):
        return _weighted_average(neutral or samples)

    def bucket_score(index: int) -> float:
        center = sum(item[4] for item in bins[index])
        previous = sum(item[4] for item in bins[(index - 1) % bin_count])
        following = sum(item[4] for item in bins[(index + 1) % bin_count])
        return center + 0.35 * (previous + following)

    winner_idx = max(range(bin_count), key=bucket_score)
    winner = list(bins[winner_idx])
    # Include adjacent hue bins at reduced weight so colors sitting on a bin
    # boundary still form one cluster.
    neighbours = [
        *((item[0], item[1], item[2], item[3] * 0.45, item[4] * 0.45) for item in bins[(winner_idx - 1) % bin_count]),
        *((item[0], item[1], item[2], item[3] * 0.45, item[4] * 0.45) for item in bins[(winner_idx + 1) % bin_count]),
    ]
    cluster = winner + neighbours

    cluster_area = sum(item[3] for item in cluster)
    # A single saturated speck should not own an entire side. Fall back to the
    # perceptual result if the winning family occupies too little area.
    if total_spatial > 0 and cluster_area / total_spatial < 0.16:
        return _perceptual(samples)

    importance_total = sum(item[4] for item in cluster)
    if importance_total <= 0:
        return _perceptual(samples)

    sin_sum = sum(math.sin(h * math.tau) * imp for h, _, _, _, imp in cluster)
    cos_sum = sum(math.cos(h * math.tau) * imp for h, _, _, _, imp in cluster)
    hue = (math.atan2(sin_sum, cos_sum) / math.tau) % 1.0
    saturation = min(
        1.0,
        sum(s * imp for _, s, _, _, imp in cluster) / importance_total * 1.08,
    )

    # Keep scene energy tied to the whole sampled area, not only the winning
    # cluster. This prevents dominant mode from becoming excessively bright.
    whole_hsv = []
    for rgb, weight in samples:
        r, g, b = (channel / 255.0 for channel in rgb)
        _, _, v = colorsys.rgb_to_hsv(r, g, b)
        whole_hsv.append((v, max(0.0, weight)))
    spatial_total = sum(weight for _, weight in whole_hsv) or 1.0
    mean_value = sum(v * weight for v, weight in whole_hsv) / spatial_total
    cluster_value = math.sqrt(
        sum((v * v) * imp for _, _, v, _, imp in cluster) / importance_total
    )
    value = min(1.0, 0.70 * cluster_value + 0.30 * mean_value)

    r, g, b = colorsys.hsv_to_rgb(hue, saturation, value)
    return (
        _clamp_channel(r * 255),
        _clamp_channel(g * 255),
        _clamp_channel(b * 255),
    )


def color_from_samples(samples: WeightedSamples, mode: str) -> RGB | None:
    if mode == COLOR_MODE_PERCEPTUAL:
        return _perceptual(samples)
    if mode == COLOR_MODE_DOMINANT:
        return _dominant(samples)
    return _weighted_average(samples)


def _weighted(pixels: list[RGB], weight: float = 1.0) -> WeightedSamples:
    if weight <= 0:
        return []
    return [(pixel, weight) for pixel in pixels]


def _corner_slice(pixels: list[RGB], *, start: bool) -> list[RGB]:
    if not pixels:
        return []
    count = max(1, math.ceil(len(pixels) * CORNER_SLICE_FRACTION))
    return pixels[:count] if start else pixels[-count:]


def extract_zone_samples(
    payload: Any, corner_influence_percent: float
) -> dict[str, WeightedSamples]:
    """Extract weighted pixel samples for simple and composite zones.

    jointSPACE numbers pixels clockwise from the viewer on each edge. Therefore:
    top starts at top-left, right starts at top-right, bottom starts at
    bottom-right, and left starts at bottom-left. Composite zones use the
    nearest quarter of adjacent edges, weighted by Corner influence.
    """
    if not isinstance(payload, Mapping) or not payload:
        return {}

    layer: Mapping[str, Any] | None = None
    candidate = payload.get("layer1")
    if isinstance(candidate, Mapping):
        layer = candidate
    else:
        for value in payload.values():
            if isinstance(value, Mapping):
                layer = value
                break

    if layer is None:
        return {}

    sides = {
        ZONE_LEFT: _pixels_from_side(layer.get(ZONE_LEFT)),
        ZONE_RIGHT: _pixels_from_side(layer.get(ZONE_RIGHT)),
        ZONE_TOP: _pixels_from_side(layer.get(ZONE_TOP)),
        ZONE_BOTTOM: _pixels_from_side(layer.get(ZONE_BOTTOM)),
    }

    result: dict[str, WeightedSamples] = {
        zone: _weighted(pixels) for zone, pixels in sides.items() if pixels
    }
    all_pixels = [pixel for pixels in sides.values() for pixel in pixels]
    if all_pixels:
        result[ZONE_ALL] = _weighted(all_pixels)

    corner_weight = max(0.0, min(1.0, corner_influence_percent / 100.0))

    def composite(main: str, neighbours: list[tuple[str, bool]]) -> WeightedSamples:
        samples = _weighted(sides[main])
        if corner_weight <= 0:
            return samples
        for neighbour, start in neighbours:
            samples.extend(
                _weighted(_corner_slice(sides[neighbour], start=start), corner_weight)
            )
        return samples

    # Clockwise side indexing, from the viewer perspective:
    # top: L->R, right: T->B, bottom: R->L, left: B->T.
    result[ZONE_LEFT_CORNERS] = composite(
        ZONE_LEFT, [(ZONE_TOP, True), (ZONE_BOTTOM, False)]
    )
    result[ZONE_RIGHT_CORNERS] = composite(
        ZONE_RIGHT, [(ZONE_TOP, False), (ZONE_BOTTOM, True)]
    )
    result[ZONE_TOP_CORNERS] = composite(
        ZONE_TOP, [(ZONE_LEFT, False), (ZONE_RIGHT, True)]
    )
    result[ZONE_BOTTOM_CORNERS] = composite(
        ZONE_BOTTOM, [(ZONE_LEFT, True), (ZONE_RIGHT, False)]
    )

    return {zone: samples for zone, samples in result.items() if samples}


def extract_zone_colors(payload: Any) -> dict[str, RGB]:
    """Compatibility helper: legacy average colors for the basic zones."""
    samples = extract_zone_samples(payload, 0.0)
    result: dict[str, RGB] = {}
    for zone in (ZONE_LEFT, ZONE_RIGHT, ZONE_TOP, ZONE_BOTTOM, ZONE_ALL):
        if zone_samples := samples.get(zone):
            color = _weighted_average(zone_samples)
            if color is not None:
                result[zone] = color
    return result


def smooth_rgb(previous: RGB | None, current: RGB, smoothing_percent: float) -> RGB:
    """Apply exponential smoothing. 0% means raw input, 95% is very smooth."""
    if previous is None:
        return current
    old_weight = max(0.0, min(0.95, smoothing_percent / 100.0))
    new_weight = 1.0 - old_weight
    return tuple(
        _clamp_channel(previous[i] * old_weight + current[i] * new_weight)
        for i in range(3)
    )  # type: ignore[return-value]


def adjust_saturation(rgb: RGB, saturation_percent: float) -> RGB:
    """Scale HSV saturation without changing brightness."""
    r, g, b = (channel / 255.0 for channel in rgb)
    h, s, v = colorsys.rgb_to_hsv(r, g, b)
    s = max(0.0, min(1.0, s * saturation_percent / 100.0))
    nr, ng, nb = colorsys.hsv_to_rgb(h, s, v)
    return (
        _clamp_channel(nr * 255),
        _clamp_channel(ng * 255),
        _clamp_channel(nb * 255),
    )


def color_distance(a: RGB, b: RGB) -> float:
    return math.sqrt(sum((a[i] - b[i]) ** 2 for i in range(3)))


def normalized_rgb(rgb: RGB) -> RGB:
    """Normalize hue/saturation; brightness is sent separately to the light."""
    peak = max(rgb)
    if peak <= 0:
        return (0, 0, 0)
    scale = 255.0 / peak
    return tuple(_clamp_channel(channel * scale) for channel in rgb)  # type: ignore[return-value]
