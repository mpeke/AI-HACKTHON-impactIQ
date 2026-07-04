from fastapi import APIRouter

from app.mock_data import (
    AC_COVERAGE_CRITERIA,
    AC_COVERAGE_EXPLAIN,
    REGRESSION_CALLOUT,
    REGRESSION_EXPLAIN,
    REGRESSION_SUITES,
    REGRESSION_TOTAL_TESTS,
    RECOMMENDED_SCENARIOS_EXPLAIN,
)
from app.bedrock import generate_scenarios
from app.models import CoverageScopeResponse
from app.scoring import compute_percent, compute_savings_percent

router = APIRouter(tags=["coverage-scope"])


@router.get("/coverage-scope", response_model=CoverageScopeResponse)
def get_coverage_scope() -> dict:
    """Acceptance-criteria coverage, regression scope, and recommended scenarios."""
    covered = sum(1 for c in AC_COVERAGE_CRITERIA if c["status"] == "covered")
    total = len(AC_COVERAGE_CRITERIA)
    percent = compute_percent(covered, total)

    selected = sum(s["tests"] for s in REGRESSION_SUITES)
    saved_percent = compute_savings_percent(selected, REGRESSION_TOTAL_TESTS)

    uncovered = [c["text"] for c in AC_COVERAGE_CRITERIA if c["status"] == "gap"]
    scenarios = generate_scenarios(
        story_description="Apply multi-currency pricing at checkout",
        acceptance_criteria=[c["text"] for c in AC_COVERAGE_CRITERIA],
        uncovered_criteria=uncovered,
        code_diff_summary="7 files changed across pricing and cart shared libs",
    )

    return {
        "acCoverage": {
            "percent": percent,
            "covered": covered,
            "total": total,
            "criteria": AC_COVERAGE_CRITERIA,
            "explain": AC_COVERAGE_EXPLAIN,
        },
        "regressionScope": {
            "savedPercent": saved_percent,
            "selected": selected,
            "total": REGRESSION_TOTAL_TESTS,
            "suites": REGRESSION_SUITES,
            "explain": REGRESSION_EXPLAIN,
            "callout": REGRESSION_CALLOUT,
        },
        "recommendedScenarios": scenarios,
        "recommendedScenariosExplain": RECOMMENDED_SCENARIOS_EXPLAIN,
    }
