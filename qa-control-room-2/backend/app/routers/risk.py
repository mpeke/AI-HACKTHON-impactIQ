from fastapi import APIRouter

from app.mock_data import RISK_BANDS
from app.models import RiskRecomputeRequest, RiskRecomputeResponse
from app.scoring import band_for_score, band_label, compute_total_score

router = APIRouter(tags=["risk"])


@router.post("/risk/recompute", response_model=RiskRecomputeResponse)
def recompute_risk(payload: RiskRecomputeRequest) -> dict:
    """
    Recompute a risk score for an arbitrary set of factors.

    Handy for a "what-if" panel (e.g. a slider UI) or for testing the
    scoring engine directly from /docs without touching the mock data.
    """
    factors = [f.model_dump() for f in payload.factors]
    total = compute_total_score(factors)
    band = band_for_score(total, RISK_BANDS)

    return {
        "score": total,
        "band": band_label(band),
        "tone": band["tone"],
        "range": band["range"],
    }
