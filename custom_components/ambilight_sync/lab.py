"""Opt-in temporal lighting effects. No I/O, scheduling, or light transport."""
from __future__ import annotations

from collections import deque
import colorsys
import math
from copy import deepcopy
import re

from .inactivity import bounded
from .color import adjust_saturation
from .lab_colors import calibrate_light, mix_lights, snapshot_light
from .effects import normalize_imports

AUTO_LIGHT_RANGES = {
    "brightness_step": (20, 1, 100),
    "transition_step": (0.1, 0.01, 2),
    "scene_transition_step": (12.5, 0, 100),
}
SCENE_LIGHT_RANGES = {
    "calm_rate": (0.5, 0.25, 10),
    "active_rate": (4, 0.25, 10),
}
CALIBRATION_LIGHT_RANGES = {
    "gamma": (1.0, 0.5, 3.0),
    "red_gain": (100, 50, 150),
    "green_gain": (100, 50, 150),
    "blue_gain": (100, 50, 150),
}
LIGHT_RULES = (
    ("auto_settings", "auto_light_settings", AUTO_LIGHT_RANGES),
    ("dynamics_settings", "dynamics_light_settings", SCENE_LIGHT_RANGES),
    ("calibration_settings", "calibration_light_settings", CALIBRATION_LIGHT_RANGES),
)
DEFAULTS = {
    "pause_enabled": False, "pause_entity": "", "pause_delay": 2.0,
    "pause_saturation": 30.0, "pause_brightness": 40.0, "pause_transition": 3.0,
    "static_enabled": False, "static_timeout": 30.0, "static_tolerance": 2.0,
    "static_mix": 50.0, "static_transition": 3.0,
    "dynamics_enabled": False, "dynamics_light_settings": {},
    "auto_enabled": False, "auto_lights": [], "auto_light_settings": {}, "imports": [],
    "calibration_enabled": False, "calibration_light_settings": {},
    "echo_enabled": False, "echo_seconds": 5.0, "echo_strength": 35.0, "echo_lights": [],
    **{common: {key: bounds[0] for key, bounds in ranges.items()} for common, _, ranges in LIGHT_RULES},
}
RANGES = {
    "pause_delay": (2, 0, 60), "pause_saturation": (30, 0, 100),
    "pause_brightness": (40, 1, 100), "pause_transition": (3, .1, 10),
    "static_timeout": (30, 5, 600), "static_tolerance": (2, 0, 10),
    "static_mix": (50, 0, 100), "static_transition": (3, .1, 10),
    "echo_seconds": (5, 1, 15), "echo_strength": (35, 0, 100),
}


def _light_rule(raw, defaults, ranges):
    rule = {key: bounded(raw.get(key), defaults[key], low, high) for key, (_, low, high) in ranges.items()}
    if "calm_rate" in rule:
        rule["active_rate"] = max(rule["calm_rate"], rule["active_rate"])
    return rule


def normalize_lab(raw):
    raw = raw if isinstance(raw, dict) else {}
    result = deepcopy(DEFAULTS)
    for key in ("pause_enabled", "static_enabled", "echo_enabled", "dynamics_enabled", "auto_enabled", "calibration_enabled"):
        result[key] = raw.get(key) is True
    entity = raw.get("pause_entity", "")
    if isinstance(entity, str) and re.fullmatch(r"(?:media_player|binary_sensor|input_boolean)\.[a-z0-9_]+", entity):
        result["pause_entity"] = entity
    for key, (default, low, high) in RANGES.items():
        result[key] = bounded(raw.get(key), default, low, high)
    result["imports"] = normalize_imports(raw.get("imports"))
    lights = raw.get("echo_lights")
    if isinstance(lights, list):
        result["echo_lights"] = sorted({e for e in lights if isinstance(e, str) and re.fullmatch(r"light\.[a-z0-9_]+", e)})[:64]
    lights = raw.get("auto_lights")
    if isinstance(lights,list):
        result["auto_lights"] = sorted({e for e in lights if isinstance(e,str) and re.fullmatch(r"light\.[a-z0-9_]+",e)})[:64]
    for common_key, lights_key, ranges in LIGHT_RULES:
        common = raw.get(common_key)
        legacy = not isinstance(common, dict)
        defaults = _light_rule({} if legacy else common, DEFAULTS[common_key], ranges)
        result[common_key] = defaults
        settings = raw.get(lights_key)
        if not isinstance(settings, dict):
            continue
        ids = sorted(entity for entity, values in settings.items()
                     if isinstance(entity, str) and re.fullmatch(r"light\.[a-z0-9_]+", entity)
                     and isinstance(values, dict))[:256]
        for entity in ids:
            values = settings[entity]
            custom = _light_rule(values, defaults, ranges) if values.keys() & ranges.keys() else {}
            if legacy and custom == defaults:
                custom = {}  # Old forms could write an identical copy for every light.
            if lights_key != "auto_light_settings":
                enabled = values.get("enabled") is not False
                if custom or not enabled:
                    result[lights_key][entity] = {**custom, "enabled": enabled}
            elif custom:
                result[lights_key][entity] = custom
    return result


class LabRuntime:
    def __init__(self, config):
        self.config = normalize_lab(config)
        self.reset()

    def configure(self, raw):
        config = normalize_lab(raw)
        if any(self.config[k] != config[k] for k in ("pause_enabled", "pause_entity")):
            self.pause_since = None
        if self.config["static_enabled"] != config["static_enabled"]:
            self.anchor = self.stable_since = None
        if self.config["echo_enabled"] != config["echo_enabled"]:
            self.history.clear()
            self.echo_palette.clear()
        for entity in set(self.history)-set(config["echo_lights"]):
            self.forget(entity)
        self.config = config

    @property
    def enabled(self):
        """Whether the temporal effects need frame history."""
        return self.pause_mix > 0 or self.static_mix > 0 or any(self.config[k] for k in ("pause_enabled", "static_enabled", "echo_enabled"))

    def reset(self):
        self.anchor = None
        self.stable_since = None
        self.pause_since = None
        self.last_time = None
        self.pause_mix = self.static_mix = 0.0
        self.history = {}
        self.echo_palette = {}
        self.media_state = "unknown"

    def interrupt(self):
        # No inference, timer progress, or historical colors across a lost feed.
        self.reset()

    def forget(self, entity):
        self.history.pop(entity, None)
        self.echo_palette.pop(entity, None)

    def observe(self, samples, now, media_state="unknown"):
        self.media_state = media_state
        if not self.enabled:
            return
        dt = max(0, now-self.last_time) if self.last_time is not None else 0
        self.last_time = now
        self.media_state = media_state
        if not samples or not any(max(s) for s in samples):
            self.anchor = self.stable_since = self.pause_since = None
            self.pause_mix = self.static_mix = 0
            self.history.clear()
            self.echo_palette.clear()
            return
        c = self.config
        paused = media_state in ("paused", "on")
        self.pause_since = (now if self.pause_since is None else self.pause_since) if c["pause_enabled"] and paused else None
        pause = self.pause_since is not None and now-self.pause_since >= c["pause_delay"]
        tolerance = c["static_tolerance"] * 2.55
        stable = self.anchor is not None and len(self.anchor) == len(samples) and max(abs(a-b) for x,y in zip(self.anchor,samples) for a,b in zip(x,y)) <= tolerance
        if not stable:
            self.anchor = tuple(samples)
            self.stable_since = now
        static = c["static_enabled"] and now-self.stable_since >= c["static_timeout"]
        pause_dt = min(dt, max(0, now-self.pause_since-c["pause_delay"])) if pause else dt
        static_dt = min(dt, max(0, now-self.stable_since-c["static_timeout"])) if static else dt
        self.pause_mix = self._ramp(self.pause_mix, float(pause), pause_dt/c["pause_transition"])
        self.static_mix = self._ramp(self.static_mix, float(static), static_dt/c["static_transition"])

    @staticmethod
    def _ramp(value, target, step):
        return min(target, value+step) if target > value else max(target, value-step)

    def decorate(self, entity, rgb, brightness, snapshot, now, *, brightness_range=None, color_supported=False):
        c, reasons = self.config, []
        if c["echo_enabled"] and entity in c["echo_lights"]:
            history = self.history.setdefault(entity, deque(maxlen=160))
            while history and now-history[0][0] > c["echo_seconds"]:
                history.popleft()
            past = [item for item in history if .15 <= now-item[0] <= c["echo_seconds"]]
            # Keep a coherent hue group instead of averaging complementary hues
            # into grey. Time-based weights avoid depending on the polling rate.
            groups = {}
            for index, (stamp, color, level) in enumerate(past):
                duration = max(0, (past[index+1][0] if index+1 < len(past) else now)-stamp)
                h,s,v = colorsys.rgb_to_hsv(*(channel/255 for channel in color))
                group = int(h*12)%12 if s > .1 else 12
                weight = duration * (1-(now-stamp)/c["echo_seconds"]) * max(.05,s) * level/255
                score, strongest = groups.get(group, (0, (stamp,color,level)))
                groups[group] = (score+weight, (stamp,color,level))
            if not history or now-history[-1][0] >= .1:
                history.append((now, tuple(rgb), brightness))
            if groups and c["echo_strength"] > 0:
                _, (stamp, color, level) = max(groups.values(), key=lambda item:item[0])
                if entity in self.echo_palette:
                    last, old_color, old_level = self.echo_palette[entity]
                    color, level = mix_lights(old_color, old_level, color, level, 1-math.exp(-max(0,now-last)/.5))
                self.echo_palette[entity] = (now,color,level)
                rgb, brightness = mix_lights(rgb, brightness, color, level, c["echo_strength"]/100)
                reasons.append("echo")
            else:
                self.echo_palette.pop(entity, None)
        if c["calibration_enabled"]:
            rule = c["calibration_light_settings"].get(entity, {})
            if rule.get("enabled", True):
                settings = rule if "gamma" in rule else c["calibration_settings"]
                corrected = calibrate_light(rgb, brightness, settings, brightness_range, color_supported)
                if corrected != (rgb, brightness):
                    rgb, brightness = corrected
                    reasons.append("calibration")
        if self.static_mix > 0 and c["static_mix"] > 0:
            color, level = snapshot_light(snapshot)
            rgb, brightness = mix_lights(rgb, brightness, color, level, self.static_mix*c["static_mix"]/100)
            reasons.append("static")
        if self.pause_mix > 0:
            # Relative saturation, absolute brightness: repeated paused frames
            # never compound the transformation or overwrite the start snapshot.
            rgb = adjust_saturation(rgb, 100+self.pause_mix*(c["pause_saturation"]-100))
            brightness = round(brightness*(1-self.pause_mix)+255*c["pause_brightness"]/100*self.pause_mix)
            reasons.append("pause")
        return rgb, brightness, reasons
