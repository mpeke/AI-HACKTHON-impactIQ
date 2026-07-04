"""
Pydantic models for every API response.

Fields use snake_case internally (Python convention) but are serialized as
camelCase over the wire via `Field(alias=...)`, so the JSON shape matches
src/data/mockData.js on the frontend exactly and the React components don't
need any field-name translation.
"""

from typing import Optional

from pydantic import BaseModel, ConfigDict, Field


class CamelModel(BaseModel):
    """Base class: allow constructing from either snake_case or camelCase,
    and always serialize using the camelCase alias."""

    model_config = ConfigDict(populate_by_name=True)


# --- Story context ---------------------------------------------------------


class StoryContext(CamelModel):
    commit: str
    branch: str
    story_id: str = Field(alias="storyId")
    story_title: str = Field(alias="storyTitle")
    status: str
    synced_ago: str = Field(alias="syncedAgo")


# --- Overview ----------------------------------------------------------------


class RiskBand(CamelModel):
    label: str
    range: str
    tone: str


class RiskScore(CamelModel):
    score: int
    max: int
    band: str
    tone: str
    summary: str
    recommendation: str
    what_it_is: str = Field(alias="whatItIs")
    how_its_calculated: str = Field(alias="howItsCalculated")
    formula: str
    bands: list[RiskBand]


class RiskFactor(CamelModel):
    name: str
    detail: str
    score: int
    cap: int
    explain: str


class AtAGlanceItem(CamelModel):
    label: str
    value: str
    sub: Optional[str] = None
    tone: str


class OverviewResponse(CamelModel):
    risk_score: RiskScore = Field(alias="riskScore")
    risk_factors: list[RiskFactor] = Field(alias="riskFactors")
    risk_factors_footer: str = Field(alias="riskFactorsFooter")
    at_a_glance: list[AtAGlanceItem] = Field(alias="atAGlance")


# --- Coverage & scope ----------------------------------------------------


class CriterionItem(CamelModel):
    text: str
    status: str


class AcCoverage(CamelModel):
    percent: int
    covered: int
    total: int
    criteria: list[CriterionItem]
    explain: str


class ScopeSuite(CamelModel):
    suite: str
    action: str
    tests: int


class RegressionScope(CamelModel):
    saved_percent: int = Field(alias="savedPercent")
    selected: int
    total: int
    suites: list[ScopeSuite]
    explain: str
    callout: str


class RecommendedScenario(CamelModel):
    tag: str
    text: str
    rationale: str


class CoverageScopeResponse(CamelModel):
    ac_coverage: AcCoverage = Field(alias="acCoverage")
    regression_scope: RegressionScope = Field(alias="regressionScope")
    recommended_scenarios: list[RecommendedScenario] = Field(
        alias="recommendedScenarios"
    )
    recommended_scenarios_explain: str = Field(
        alias="recommendedScenariosExplain"
    )


# --- Traceability ------------------------------------------------------------


class ChainCriterion(CamelModel):
    id: str
    text: str


class ChainTestCase(CamelModel):
    id: str
    text: str


class TraceabilityChain(CamelModel):
    commit: str
    story: str
    criterion: ChainCriterion
    test_case: ChainTestCase = Field(alias="testCase")


class TraceabilityLogRow(CamelModel):
    commit: str
    story: str
    criterion: str
    criterion_text: str = Field(alias="criterionText")
    test_case: Optional[str] = Field(default=None, alias="testCase")
    test_case_text: Optional[str] = Field(default=None, alias="testCaseText")


class TraceabilityResponse(CamelModel):
    traceability_chain: TraceabilityChain = Field(alias="traceabilityChain")
    traceability_explain: str = Field(alias="traceabilityExplain")
    traceability_log: list[TraceabilityLogRow] = Field(alias="traceabilityLog")


# --- Bonus: live risk recompute ------------------------------------------


class RiskRecomputeRequest(BaseModel):
    factors: list[RiskFactor]


class RiskRecomputeResponse(CamelModel):
    score: int
    band: str
    tone: str
    range: str


class HealthResponse(BaseModel):
    status: str
