"""Bounded, time-based scene analysis and per-light output policy. No I/O."""
from __future__ import annotations
from collections import deque
import math

from .lab import DEFAULTS as LAB_DEFAULTS


def manual_tau(smoothing, rate):
    weight = min(.95, max(0, smoothing/100))
    return -1/max(.25, rate)/math.log(weight) if weight > 0 else 0.0


def filter_rgb(previous, current, dt, tau):
    if previous is None or tau <= 0:
        return tuple(current)
    alpha = -math.expm1(-max(0,dt)/tau)
    return tuple(min(255,max(0,a+(b-a)*alpha)) for a,b in zip(previous,current))


class SceneDynamics:
    def __init__(self, config):
        self.config = config
        self.reset()

    def reset(self):
        self.previous = None
        self.previous_time = None
        self.topology = None
        self.window = deque(maxlen=100)
        self.activity = self.mean_change = self.changed_zones = 0.0
        self.updated = {}
        self.rates = {}
        # Values distinguish ordinary cuts from the one-time return from black.
        self.pending_cuts = {}

    def forget(self, entity):
        self.updated.pop(entity, None)
        self.rates.pop(entity, None)
        self.pending_cuts.pop(entity, None)

    def selected(self, entity):
        rule = self.config.get("dynamics_light_settings", {}).get(entity, {})
        return self.config.get("dynamics_enabled", False) and rule.get("enabled", True)

    def requested_rate(self, entity=None, *, recovering=False):
        common = self.config.get("dynamics_settings", LAB_DEFAULTS["dynamics_settings"])
        rule = self.config.get("dynamics_light_settings", {}).get(entity, {})
        minimum = rule.get("calm_rate", common["calm_rate"])
        maximum = rule.get("active_rate", common["active_rate"])
        weight = 1.0 if recovering else self.activity
        return minimum + (maximum - minimum) * weight

    def rate(self, entity, ceiling, *, recovering=False):
        return min(ceiling, self.requested_rate(entity, recovering=recovering))

    @staticmethod
    def transition(rate):
        """Fit the native transition into the command interval in tenths of a second."""
        return min(2.0, max(0.1, math.floor(10.0 / rate + 1e-9) / 10.0))

    def observe(self, samples, now, topology=None):
        if not samples or not any(max(rgb) for rgb in samples):
            self.reset()
            return
        if (self.previous is None or len(samples)!=len(self.previous) or topology!=self.topology
                or self.previous_time is None or now<=self.previous_time or now-self.previous_time>3):
            self.previous=tuple(samples);self.previous_time=now;self.topology=topology
            self.window.clear();self.activity=self.mean_change=self.changed_zones=0
            return
        dt=now-self.previous_time
        changes=[math.sqrt(sum((a-b)**2 for a,b in zip(old,new))/3)/255 for old,new in zip(self.previous,samples)]
        # Discard small channel noise before estimating motion per second.
        mean_delta = sum(delta for delta in changes if delta > .008) / len(changes)
        speed = mean_delta / dt
        fraction=sum(x>.008 and x/dt>.2 for x in changes)/len(changes)
        self.window.append((now,dt,speed,fraction))
        self.previous=tuple(samples);self.previous_time=now
        while self.window and self.window[0][0]<=now-2.5:self.window.popleft()
        total=sum(min(t, max(0,stamp-(now-2.5))) for stamp,t,_,_ in self.window)
        if total<=0:return
        self.mean_change=sum(speed*min(t,max(0,stamp-(now-2.5))) for stamp,t,speed,_ in self.window)/total
        self.changed_zones=sum(frac*min(t,max(0,stamp-(now-2.5))) for stamp,t,_,frac in self.window)/total
        value = min(1.0, .75 * self.mean_change + .25 * self.changed_zones)
        # A large change across the image lifts the rate immediately, in proportion
        # to its measured amplitude. A local cut doesn't force the upper endpoint.
        burst = min(1.0, max(0.0, (mean_delta - .08) / .62))
        tau = .15 if value > self.activity else .7
        smoothed = self.activity + (value - self.activity) * (-math.expm1(-dt / tau))
        self.activity = max(burst, value if abs(smoothed - value) < .002 else smoothed)

    def smooth(self, entity, previous, current, now, smoothing, rate, *, snap=False):
        last=self.updated.get(entity)
        self.updated[entity]=now
        if snap:
            return tuple(current)
        tau=manual_tau(smoothing,rate)
        dt=1/max(.25,rate) if last is None else max(0,now-last)
        return filter_rgb(previous,current,dt,tau)


class AutoResponse:
    def __init__(self, config):
        self.config=config
        self.reset()

    def reset(self):
        self.latency={};self.limits={};self.changed={};self.samples={}
        self.transitions={};self.effective_rates={}

    def selected(self, entity):
        return self.config.get('auto_enabled',False) and entity in self.config.get('auto_lights',[])

    def forget(self, entity):
        for values in (self.latency,self.limits,self.changed,self.samples,self.transitions,self.effective_rates):values.pop(entity,None)

    def record(self, entity, elapsed, now):
        if not self.selected(entity):return
        self.latency[entity]=self.latency.get(entity,elapsed)*.8+max(.001,elapsed)*.2
        self.samples[entity]=self.samples.get(entity,0)+1
        if self.samples[entity]<4 or now-self.changed.get(entity,-1e9)<2:return
        ceiling=self.limits.get(entity,30.0)
        capacity=.6/self.latency[entity]
        self.limits[entity]=max(.25,min(30,capacity,ceiling*1.1 if capacity>ceiling else ceiling*.75))
        self.changed[entity]=now

    def rate(self, entity, configured):
        if not self.selected(entity):return configured
        rate=min(configured,self.limits.get(entity,configured))
        self.effective_rates[entity]=rate
        return rate

    def brightness_transition(self, entity, base, previous, target, *, scene_transition=False):
        """Shorten the native transition once for each full brightness step."""
        if base <= 0.1:
            return base
        common = self.config.get("auto_settings", LAB_DEFAULTS["auto_settings"])
        settings = self.config.get("auto_light_settings", {}).get(entity, {})
        threshold = settings.get("brightness_step", common["brightness_step"])
        if scene_transition:
            percentage = settings.get("scene_transition_step", common["scene_transition_step"])
            reduction = base * percentage / 100
        else:
            reduction = settings.get("transition_step", common["transition_step"])
        steps = 0
        if type(previous) in (int, float) and 0 <= previous <= 255:
            steps = math.floor(abs(target - previous) * 100 / (255 * threshold))
        return round(max(0.1, base - steps * reduction), 3)
