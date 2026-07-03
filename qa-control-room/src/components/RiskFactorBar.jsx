export default function RiskFactorBar({ name, detail, score, cap }) {
  const pct = Math.max(0, Math.min(100, (score / cap) * 100));

  return (
    <div className="factor">
      <div className="factor-top">
        <span className="factor-name">
          {name}
          <span className="factor-detail">{detail}</span>
        </span>
        <span className="factor-score">
          {score}/{cap}
        </span>
      </div>
      <div className="factor-bar-track">
        <div className="factor-bar-fill" style={{ width: `${pct}%` }} />
      </div>
    </div>
  );
}
