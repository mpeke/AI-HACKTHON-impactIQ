from fastapi import APIRouter

from app.mock_data import (
    AC_COVERAGE_CRITERIA,
    REGRESSION_SUITES,
    REGRESSION_TOTAL_TESTS,
    RECOMMENDED_SCENARIOS,
    RISK_BANDS,
    RISK_FACTORS,
    RISK_FACTORS_FOOTER,
    RISK_FORMULA,
    RISK_HOW_CALCULATED,
    RISK_RECOMMENDATION,
    RISK_SUMMARY,
    RISK_WHAT_IT_IS,
)
from app.models import OverviewResponse
from app.scoring import (
    band_for_score,
    band_label,
    compute_percent,
    compute_savings_percent,
    compute_total_score,
)

router = APIRouter(tags=["overview"])


@router.get("/overview", response_model=OverviewResponse)
def get_overview() -> dict:
    """
    Risk score, risk factors, and the "at a glance" summary stats.

    The score, band, and percentages below are computed here from the raw
    signals in mock_data.py rather than hardcoded, so this endpoint
    demonstrates the actual scoring logic -- not just static JSON.
    """
    total_score = compute_total_score(RISK_FACTORS)
    band = band_for_score(total_score, RISK_BANDS)

    selected_tests = sum(s["tests"] for s in REGRESSION_SUITES)
    covered_criteria = sum(
        1 for c in AC_COVERAGE_CRITERIA if c["status"] == "covered"
    )
    coverage_percent = compute_percent(covered_criteria, len(AC_COVERAGE_CRITERIA))
    missing_scenarios = len(RECOMMENDED_SCENARIOS)

    risk_score_payload = {
        "score": total_score,
        "max": 100,
        "band": band_label(band),
        "tone": band["tone"],
        "summary": RISK_SUMMARY,
        "recommendation": RISK_RECOMMENDATION,
        "whatItIs": RISK_WHAT_IT_IS,
        "howItsCalculated": RISK_HOW_CALCULATED,
        "formula": RISK_FORMULA,
        "bands": RISK_BANDS,
    }

    at_a_glance = [
        {
            "label": "Risk score / 100",
            "value": str(total_score),
            "tone": band["tone"],
        },
        {
            "label": "Tests in scope",
            "value": f"{selected_tests}/{REGRESSION_TOTAL_TESTS}",
            "sub": (
                f"{compute_savings_percent(selected_tests, REGRESSION_TOTAL_TESTS)}"
                "% fewer to run"
            ),
            "tone": "teal",
        },
        {
            "label": "Criteria covered",
            "value": f"{coverage_percent}%",
            "tone": "warn" if coverage_percent < 100 else "teal",
        },
        {
            "label": "Missing scenarios",
            "value": str(missing_scenarios),
            "tone": "neutral",
        },
    ]

    return {
        "riskScore": risk_score_payload,
        "riskFactors": RISK_FACTORS,
        "riskFactorsFooter": RISK_FACTORS_FOOTER,
        "atAGlance": at_a_glance,
    }
