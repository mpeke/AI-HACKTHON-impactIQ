// All data in this file is illustrative/mock data used to demo the
// AI-Powered Regression Intelligence "QA Control Room" UI.
// Swap this module for real API calls once the backend agent is wired up.

export const storyContext = {
  commit: "a91f3c2",
  branch: "feat/multi-currency",
  storyId: "PROJ-2214",
  storyTitle: "Apply multi-currency pricing at checkout",
  status: "In Review",
  syncedAgo: "6 min ago",
};

export const riskScore = {
  score: 77,
  max: 100,
  band: "HIGH RISK",
  tone: "danger",
  summary:
    "Revenue-critical change across shared pricing code with untested criteria.",
  recommendation: "Run a deep, broad regression before release.",
  whatItIs:
    "A 0–100 estimate of how likely this change is to break existing behaviour. It sets how deep and wide the regression run should be.",
  howItsCalculated:
    "Five weighted signals are scored, summed and normalised to 100. Bands: 0–33 low, 34–66 medium, 67–100 high.",
  formula: "score = Σ(signal ÷ cap × weight) → normalise(0–100) → band",
  bands: [
    { label: "Low", range: "0–33", tone: "safe" },
    { label: "Medium", range: "34–66", tone: "warn" },
    { label: "High", range: "67–100", tone: "danger" },
  ],
};

export const riskFactors = [
  {
    name: "Change footprint",
    detail: "7 files · 3 modules",
    score: 19,
    cap: 25,
    explain: "size of the diff (files, modules).",
  },
  {
    name: "Blast radius",
    detail: "pricing + cart shared libs",
    score: 21,
    cap: 25,
    explain: "dependent components that share the touched code.",
  },
  {
    name: "Defect history",
    detail: "4 past bugs in this area",
    score: 15,
    cap: 20,
    explain: "past bug density in this area.",
  },
  {
    name: "Coverage gap",
    detail: "40% of criteria untested",
    score: 13,
    cap: 20,
    explain: "acceptance criteria with no linked test.",
  },
  {
    name: "Business criticality",
    detail: "P1 · customer-facing",
    score: 9,
    cap: 10,
    explain: "story priority and customer impact.",
  },
];

export const riskFactorsFooter =
  "Signals are read from the GitHub diff, the linked Jira story, and historical defect data — not guessed.";

export const atAGlance = [
  { label: "Risk score / 100", value: "77", tone: "danger" },
  {
    label: "Tests in scope",
    value: "48/320",
    sub: "85% fewer to run",
    tone: "teal",
  },
  { label: "Criteria covered", value: "60%", tone: "warn" },
  { label: "Missing scenarios", value: "3", tone: "neutral" },
];

export const acCoverage = {
  percent: 60,
  covered: 3,
  total: 5,
  criteria: [
    { text: "Prices display in the selected currency", status: "covered" },
    { text: "Currency selection persists across pages", status: "covered" },
    { text: "Totals recalculate when currency changes", status: "covered" },
    {
      text: "Rounding follows each currency's minor unit",
      status: "gap",
    },
    { text: "FX rate is locked at order confirmation", status: "gap" },
  ],
  explain:
    "Every acceptance criterion on the Jira story is matched to a linked test case in Zephyr. The ring is the share of criteria with at least one test. Uncovered criteria become the recommended scenarios below. When a story has no criteria at all, the agent works from the description instead.",
};

export const regressionScope = {
  savedPercent: 85,
  selected: 48,
  total: 320,
  suites: [
    { suite: "Checkout", action: "Full re-run", tests: 24 },
    { suite: "Cart & pricing", action: "Targeted", tests: 11 },
    { suite: "Currency / FX service", action: "Full re-run", tests: 8 },
    { suite: "Payment gateway", action: "Smoke", tests: 5 },
    { suite: "Unrelated modules", action: "Skip", tests: 0 },
  ],
  explain:
    "The agent picks the smallest set of tests that still exercises the risk. Suites that touch the change run full; adjacent suites run targeted or smoke; unrelated suites are skipped.",
  callout:
    "The percentage saved is your time back — without leaving the impacted paths untested.",
};

export const recommendedScenarios = [
  {
    tag: "BOUNDARY",
    text: "JPY rounding with no minor unit",
    rationale:
      "JPY has no minor currency unit, so rounding logic that assumes two decimal places will miscalculate totals for Japanese Yen orders.",
  },
  {
    tag: "EDGE",
    text: "FX rate cache expires mid-checkout",
    rationale:
      "If the cached FX rate expires between cart load and payment, the charged total may silently drift from the total the customer saw at checkout.",
  },
  {
    tag: "NEGATIVE",
    text: "Currency switched after cart is populated",
    rationale:
      "Switching currency after items are already in the cart can leave stale, un-recalculated prices unless totals are explicitly refreshed.",
  },
];

export const recommendedScenariosExplain =
  "Where a criterion has no test — or the story has none — the agent proposes scenarios: drawn from the criteria when they exist, or generated from the description via AWS Bedrock. Each carries a short rationale so you can accept or dismiss it. Expand a card to read why it matters.";

export const traceabilityChain = {
  commit: "a91f3c2",
  story: "PROJ-2214",
  criterion: { id: "AC-4", text: "rounding by minor unit" },
  testCase: { id: "TC-1187", text: "localized checkout total" },
};

export const traceabilityExplain =
  "Every conclusion links back to its source — commit → Jira story → acceptance criterion → test case. This unbroken chain is what makes the QA report auditable and lets anyone see exactly why a test was chosen.";

// Extra rows for a fuller audit-log table on the Traceability page.
export const traceabilityLog = [
  {
    commit: "a91f3c2",
    story: "PROJ-2214",
    criterion: "AC-1",
    criterionText: "Prices display in the selected currency",
    testCase: "TC-1184",
    testCaseText: "Currency selector renders localized prices",
  },
  {
    commit: "a91f3c2",
    story: "PROJ-2214",
    criterion: "AC-2",
    criterionText: "Currency selection persists across pages",
    testCase: "TC-1185",
    testCaseText: "Currency persists through navigation",
  },
  {
    commit: "a91f3c2",
    story: "PROJ-2214",
    criterion: "AC-3",
    criterionText: "Totals recalculate when currency changes",
    testCase: "TC-1186",
    testCaseText: "Cart totals refresh on currency switch",
  },
  {
    commit: "a91f3c2",
    story: "PROJ-2214",
    criterion: "AC-4",
    criterionText: "Rounding follows each currency's minor unit",
    testCase: "TC-1187",
    testCaseText: "Localized checkout total",
  },
  {
    commit: "a91f3c2",
    story: "PROJ-2214",
    criterion: "AC-5",
    criterionText: "FX rate is locked at order confirmation",
    testCase: null,
    testCaseText: null,
  },
];

export const footerNote =
  "Illustrative data · AI-Powered Regression Intelligence · click Explain on any panel to see how the agent reasons";

// ---------------------------------------------------------------------
// Grouped fallbacks, shaped exactly like the backend's JSON responses.
// Used by useApiData() as the initial/offline value for each page, so the
// UI works standalone even if backend/ isn't running.
// ---------------------------------------------------------------------

export const storyContextFallback = storyContext;

export const overviewFallback = {
  riskScore,
  riskFactors,
  riskFactorsFooter,
  atAGlance,
};

export const coverageScopeFallback = {
  acCoverage,
  regressionScope,
  recommendedScenarios,
  recommendedScenariosExplain,
};

export const traceabilityFallback = {
  traceabilityChain,
  traceabilityExplain,
  traceabilityLog,
};
