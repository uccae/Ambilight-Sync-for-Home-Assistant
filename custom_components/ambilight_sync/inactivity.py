"""Inactivity is based on consecutive valid black frames, never network errors."""
from dataclasses import dataclass
from math import isfinite
from typing import Any

MODES = ("none", "reduce_polling", "stop")


def bounded(value: Any, default: float, low: float, high: float) -> float:
    try:
        number = float(value)
    except (ValueError, TypeError, OverflowError):
        return default
    return max(low, min(high, number)) if isfinite(number) else default


@dataclass
class InactivityState:
    black_since: float | None = None
    inactive: bool = False

    def reset(self) -> None:
        self.black_since = None
        self.inactive = False

    def observe(self, black: bool, now: float, mode: str, timeout: float) -> str | None:
        if mode == "none" or not black:
            self.reset()
            return None
        if self.black_since is None:
            self.black_since = now
        self.inactive = now - self.black_since >= timeout
        return mode if self.inactive else None
