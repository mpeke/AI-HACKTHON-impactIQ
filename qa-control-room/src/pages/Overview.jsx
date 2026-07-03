import Panel from "../components/Panel.jsx";
import DonutGauge from "../components/DonutGauge.jsx";
import StatCard from "../components/StatCard.jsx";
import RiskFactorBar from "../components/RiskFactorBar.jsx";
import {
  riskScore,
  riskFactors,
  riskFactorsFooter,
  atAGlance,
} from "../data/mockData.js";

export default function Overview() {
  return (
    <>
      <div className="page-heading">
        <h1>Overview</h1>
        <p>
          The regression risk score for this pull request, and the five
          signals behind it.
        </p>
      </div>

      <div className="grid-4">
        {atAGlance.map((s) => (
          <StatCard key={s.label} {...s} />
        ))}
      </div>

      <div className="grid-2">
        <Panel
          title="REGRESSION RISK"
          explanation={
            <>
              <p style={{ margin: "0 0 10px" }}>
                <b>What it is.</b> {riskScore.whatItIs}
              </p>
              <p style={{ margin: 0 }}>
                <b>How the agent gets it.</b> {riskScore.howItsCalculated}
              </p>
              <div className="explain-code">{riskScore.formula}</div>
            </>
          }
        >
          <div className="gauge-row">
            <DonutGauge value={riskScore.score} max={riskScore.max} tone="danger">
              <span className="big">{riskScore.score}</span>
              <span className="small">/ {riskScore.max}</span>
            </DonutGauge>

            <div>
              <div className="risk-band-pill danger">
                <span className="legend-dot dot-danger" />
                {riskScore.band}
              </div>
              <p className="risk-summary">
                {riskScore.summary} <b>{riskScore.recommendation}</b>
              </p>
            </div>
          </div>
        </Panel>

        <Panel title="RISK FACTORS" explanation={riskFactorsFooter}>
          {riskFactors.map((f) => (
            <RiskFactorBar key={f.name} {...f} />
          ))}
        </Panel>
      </div>
    </>
  );
}
