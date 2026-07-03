import Panel from "../components/Panel.jsx";
import DonutGauge from "../components/DonutGauge.jsx";
import ScopeTable from "../components/ScopeTable.jsx";
import ScenarioCard from "../components/ScenarioCard.jsx";
import {
  acCoverage,
  regressionScope,
  recommendedScenarios,
  recommendedScenariosExplain,
} from "../data/mockData.js";

export default function CoverageScope() {
  return (
    <>
      <div className="page-heading">
        <h1>Coverage &amp; Scope</h1>
        <p>
          What's already tested, what's missing, and the smallest regression
          set that still exercises the risk.
        </p>
      </div>

      <Panel title="ACCEPTANCE-CRITERIA COVERAGE" explanation={acCoverage.explain}>
        <div className="donut-row">
          <DonutGauge value={acCoverage.percent} max={100} tone="teal">
            <span className="big">{acCoverage.percent}%</span>
            <span className="small">
              {acCoverage.covered} / {acCoverage.total} covered
            </span>
          </DonutGauge>

          <div className="criteria-list">
            {acCoverage.criteria.map((c) => (
              <div className="criteria-item" key={c.text}>
                <span
                  className={`criteria-icon ${
                    c.status === "covered" ? "covered" : "gap"
                  }`}
                >
                  {c.status === "covered" ? "✓" : "!"}
                </span>
                <span
                  className={
                    c.status === "gap" ? "criteria-text gap-text" : undefined
                  }
                >
                  {c.text}
                </span>
              </div>
            ))}
          </div>
        </div>
      </Panel>

      <div className="grid-2">
        <Panel title="REGRESSION SCOPE" explanation={regressionScope.explain}>
          <ScopeTable suites={regressionScope.suites} />

          <div className="savings-row">
            <span className="savings-badge">
              {regressionScope.savedPercent}% fewer tests
            </span>
            <span className="savings-detail">
              <b>{regressionScope.selected}</b> of {regressionScope.total}{" "}
              selected — impacted paths still fully exercised.
            </span>
          </div>

          <div className="explain-footer-note">{regressionScope.callout}</div>
        </Panel>

        <Panel
          title="RECOMMENDED SCENARIOS"
          explanation={recommendedScenariosExplain}
        >
          {recommendedScenarios.map((s) => (
            <ScenarioCard key={s.text} {...s} />
          ))}
        </Panel>
      </div>
    </>
  );
}
