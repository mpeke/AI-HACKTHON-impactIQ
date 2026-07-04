"""
All data here is illustrative/mock data used to power the QA Control Room
demo. It mirrors src/data/mockData.js on the frontend so the two stay easy
to compare.

In a real deployment, this module is exactly what you'd delete: the values
below (risk factor scores, coverage status, linked test cases, etc.) would
instead come from the GitHub API, the Jira API, Zephyr/Xray, and AWS
Bedrock, as described in the ImpactIQ architecture doc.
"""

STORY_CONTEXT = {
    "commit": "a91f3c2",
    "branch": "feat/multi-currency",
    "storyId": "PROJ-2214",
    "storyTitle": "Apply multi-currency pricing at checkout",
    "status": "In Review",
    "syncedAgo": "6 min ago",
}

# --- Risk model -------------------------------------------------------
#
# Each factor's `cap` is its maximum possible contribution to the total
# risk score. The five caps below sum to 100, so the overall score is
# simply the sum of each factor's `score` -- see app/scoring.py.

RISK_FACTORS = [
    {
        "name": "Change footprint",
        "detail": "7 files · 3 modules",
        "score": 19,
        "cap": 25,
        "explain": "size of the diff (files, modules).",
    },
    {
        "name": "Blast radius",
        "detail": "pricing + cart shared libs",
        "score": 21,
        "cap": 25,
        "explain": "dependent components that share the touched code.",
    },
    {
        "name": "Defect history",
        "detail": "4 past bugs in this area",
        "score": 15,
        "cap": 20,
        "explain": "past bug density in this area.",
    },
    {
        "name": "Coverage gap",
        "detail": "40% of criteria untested",
        "score": 13,
        "cap": 20,
        "explain": "acceptance criteria with no linked test.",
    },
    {
        "name": "Business criticality",
        "detail": "P1 · customer-facing",
        "score": 9,
        "cap": 10,
        "explain": "story priority and customer impact.",
    },
]

RISK_FACTORS_FOOTER = (
    "Signals are read from the GitHub diff, the linked Jira story, and "
    "historical defect data — not guessed."
)

RISK_SUMMARY = (
    "Revenue-critical change across shared pricing code with untested "
    "criteria."
)
RISK_RECOMMENDATION = "Run a deep, broad regression before release."
RISK_WHAT_IT_IS = (
    "A 0–100 estimate of how likely this change is to break existing "
    "behaviour. It sets how deep and wide the regression run should be."
)
RISK_HOW_CALCULATED = (
    "Five weighted signals are scored, summed and normalised to 100. "
    "Bands: 0–33 low, 34–66 medium, 67–100 high."
)
RISK_FORMULA = "score = Σ(signal ÷ cap × weight) → normalise(0–100) → band"

# The three risk bands, used both for display (as a legend) and to look up
# which band a computed score falls into -- see scoring.band_for_score().
RISK_BANDS = [
    {"label": "Low", "range": "0–33", "tone": "safe", "ceiling": 33},
    {"label": "Medium", "range": "34–66", "tone": "warn", "ceiling": 66},
    {"label": "High", "range": "67–100", "tone": "danger", "ceiling": 100},
]

# --- Acceptance-criteria coverage --------------------------------------

AC_COVERAGE_CRITERIA = [
    {"text": "Prices display in the selected currency", "status": "covered"},
    {"text": "Currency selection persists across pages", "status": "covered"},
    {"text": "Totals recalculate when currency changes", "status": "covered"},
    {"text": "Rounding follows each currency's minor unit", "status": "gap"},
    {"text": "FX rate is locked at order confirmation", "status": "gap"},
]

AC_COVERAGE_EXPLAIN = (
    "Every acceptance criterion on the Jira story is matched to a linked "
    "test case in Zephyr. The ring is the share of criteria with at least "
    "one test. Uncovered criteria become the recommended scenarios below. "
    "When a story has no criteria at all, the agent works from the "
    "description instead."
)

# --- Regression scope ---------------------------------------------------

REGRESSION_SUITES = [
    {"suite": "Checkout", "action": "Full re-run", "tests": 24},
    {"suite": "Cart & pricing", "action": "Targeted", "tests": 11},
    {"suite": "Currency / FX service", "action": "Full re-run", "tests": 8},
    {"suite": "Payment gateway", "action": "Smoke", "tests": 5},
    {"suite": "Unrelated modules", "action": "Skip", "tests": 0},
]
REGRESSION_TOTAL_TESTS = 320

REGRESSION_EXPLAIN = (
    "The agent picks the smallest set of tests that still exercises the "
    "risk. Suites that touch the change run full; adjacent suites run "
    "targeted or smoke; unrelated suites are skipped."
)
REGRESSION_CALLOUT = (
    "The percentage saved is your time back — without leaving the "
    "impacted paths untested."
)

# --- Recommended scenarios ----------------------------------------------
#
# In production, `rationale` and `text` for gap-driven scenarios are where
# AWS Bedrock is called (see app/bedrock.py for the integration stub).

RECOMMENDED_SCENARIOS = [
    {
        "tag": "BOUNDARY",
        "text": "JPY rounding with no minor unit",
        "rationale": (
            "JPY has no minor currency unit, so rounding logic that "
            "assumes two decimal places will miscalculate totals for "
            "Japanese Yen orders."
        ),
    },
    {
        "tag": "EDGE",
        "text": "FX rate cache expires mid-checkout",
        "rationale": (
            "If the cached FX rate expires between cart load and payment, "
            "the charged total may silently drift from the total the "
            "customer saw at checkout."
        ),
    },
    {
        "tag": "NEGATIVE",
        "text": "Currency switched after cart is populated",
        "rationale": (
            "Switching currency after items are already in the cart can "
            "leave stale, un-recalculated prices unless totals are "
            "explicitly refreshed."
        ),
    },
]

RECOMMENDED_SCENARIOS_EXPLAIN = (
    "Where a criterion has no test — or the story has none — the agent "
    "proposes scenarios: drawn from the criteria when they exist, or "
    "generated from the description via AWS Bedrock. Each carries a short "
    "rationale so you can accept or dismiss it. Expand a card to read why "
    "it matters."
)

# --- Traceability ---------------------------------------------------------

TRACEABILITY_CHAIN = {
    "commit": "a91f3c2",
    "story": "PROJ-2214",
    "criterion": {"id": "AC-4", "text": "rounding by minor unit"},
    "testCase": {"id": "TC-1187", "text": "localized checkout total"},
}

TRACEABILITY_EXPLAIN = (
    "Every conclusion links back to its source — commit → Jira story → "
    "acceptance criterion → test case. This unbroken chain is what makes "
    "the QA report auditable and lets anyone see exactly why a test was "
    "chosen."
)

TRACEABILITY_LOG = [
    {
        "commit": "a91f3c2",
        "story": "PROJ-2214",
        "criterion": "AC-1",
        "criterionText": "Prices display in the selected currency",
        "testCase": "TC-1184",
        "testCaseText": "Currency selector renders localized prices",
    },
    {
        "commit": "a91f3c2",
        "story": "PROJ-2214",
        "criterion": "AC-2",
        "criterionText": "Currency selection persists across pages",
        "testCase": "TC-1185",
        "testCaseText": "Currency persists through navigation",
    },
    {
        "commit": "a91f3c2",
        "story": "PROJ-2214",
        "criterion": "AC-3",
        "criterionText": "Totals recalculate when currency changes",
        "testCase": "TC-1186",
        "testCaseText": "Cart totals refresh on currency switch",
    },
    {
        "commit": "a91f3c2",
        "story": "PROJ-2214",
        "criterion": "AC-4",
        "criterionText": "Rounding follows each currency's minor unit",
        "testCase": "TC-1187",
        "testCaseText": "Localized checkout total",
    },
    {
        "commit": "a91f3c2",
        "story": "PROJ-2214",
        "criterion": "AC-5",
        "criterionText": "FX rate is locked at order confirmation",
        "testCase": None,
        "testCaseText": None,
    },
]
