"""
The risk-scoring logic used by the /overview and /risk/recompute endpoints.

Each risk factor carries a `score` (its current contribution) and a `cap`
(its maximum possible contribution). The caps across all five factors sum
to 100, so the total risk score out of 100 is just the sum of the factors'
scores -- this is the "weighted signals summed and normalised to 100" idea
from the dashboard copy, with the per-factor weight already baked into its
cap.
"""

from typing import Iterable, TypedDict


class Factor(TypedDict):
    name: str
    detail: str
    score: int
    cap: int
    explain: str


class Band(TypedDict):
    label: str
    range: str
    tone: str
    ceiling: int


def compute_total_score(factors: Iterable[dict]) -> int:
    """Sum each factor's score to get the overall 0-100 risk score."""
    return sum(int(f["score"]) for f in factors)


def band_for_score(score: int, bands: list[Band]) -> Band:
    """Return the band (Low/Medium/High) that `score` falls into."""
    for band in bands:
        if score <= band["ceiling"]:
            return band
    return bands[-1]


def band_label(band: Band) -> str:
    """'High' -> 'HIGH RISK', matching the dashboard's pill copy."""
    return f"{band['label'].upper()} RISK"


def compute_percent(part: int, whole: int) -> int:
    """Safe integer percentage, rounded to the nearest whole number."""
    if whole <= 0:
        return 0
    return round((part / whole) * 100)


def compute_savings_percent(selected: int, total: int) -> int:
    """% of tests skipped versus the full suite."""
    if total <= 0:
        return 0
    return round((1 - selected / total) * 100)
