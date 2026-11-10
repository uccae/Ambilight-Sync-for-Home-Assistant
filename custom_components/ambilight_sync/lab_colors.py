"""Shared color-energy mixing for opt-in effects."""
import colorsys

def _decode(c):
    c = min(255, max(0, c)) / 255
    return c / 12.92 if c <= .04045 else ((c + .055) / 1.055) ** 2.4


def _encode(c):
    c = min(1, max(0, c))
    return round(255 * (12.92*c if c <= .0031308 else 1.055*c**(1/2.4)-.055))


def calibrate_light(rgb, brightness, rule, brightness_range, color_supported):
    """Correct the live target while preserving the brightness endpoints."""
    gamma = rule["gamma"]
    if brightness_range is not None and gamma != 1:
        low, high = brightness_range
        if low < brightness < high:
            position = (brightness - low) / (high - low)
            brightness = max(1, low + round((high - low) * position ** (1 / gamma)))

    if color_supported:
        gains = (rule["red_gain"], rule["green_gain"], rule["blue_gain"])
        if not gains[0] == gains[1] == gains[2]:
            linear = tuple(_decode(channel) for channel in rgb)
            weighted = tuple(channel * gain for channel, gain in zip(linear, gains))
            peak = max(weighted)
            if peak > 0:
                scale = max(linear) / peak
                rgb = tuple(_encode(channel * scale) for channel in weighted)
    return rgb, brightness


def mix_lights(rgb, brightness, other_rgb, other_brightness, amount):
    """Mix emitted linear RGB energy and independently retain light intensity."""
    if amount <= 0:
        return tuple(rgb), brightness
    if amount >= 1:
        return tuple(other_rgb), round(other_brightness)
    a, b = brightness/255, other_brightness/255
    energy = tuple((1-amount)*_decode(x)*a + amount*_decode(y)*b for x, y in zip(rgb, other_rgb))
    level = max(energy)
    if level <= 0:
        return (0, 0, 0), 0
    return tuple(_encode(c/level) for c in energy), round(255*level)


def snapshot_light(snapshot):
    if snapshot is None or snapshot.state != "on":
        return (0, 0, 0), 0
    attrs = snapshot.attributes
    rgb = attrs.get("rgb_color")
    if rgb is None and attrs.get("hs_color"):
        h, s = attrs["hs_color"]
        rgb = tuple(round(c*255) for c in colorsys.hsv_to_rgb(h/360, s/100, 1))
    if rgb is None and attrs.get("color_temp_kelvin"):
        from homeassistant.util.color import color_temperature_to_rgb
        rgb = color_temperature_to_rgb(attrs["color_temp_kelvin"])
    if rgb is None and attrs.get("xy_color"):
        from homeassistant.util.color import color_xy_to_RGB
        rgb = color_xy_to_RGB(*attrs["xy_color"])
    return tuple(rgb or (255, 255, 255)), attrs.get("brightness") if isinstance(attrs.get("brightness"),(int,float)) else 255


