from fastapi import APIRouter

from app.mock_data import TRACEABILITY_CHAIN, TRACEABILITY_EXPLAIN, TRACEABILITY_LOG
from app.models import TraceabilityResponse

router = APIRouter(tags=["traceability"])


@router.get("/traceability", response_model=TraceabilityResponse)
def get_traceability() -> dict:
    """The commit -> story -> acceptance criterion -> test case audit chain."""
    return {
        "traceabilityChain": TRACEABILITY_CHAIN,
        "traceabilityExplain": TRACEABILITY_EXPLAIN,
        "traceabilityLog": TRACEABILITY_LOG,
    }
