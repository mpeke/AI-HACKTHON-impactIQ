export default function StatCard({ label, value, sub, tone = "neutral" }) {
  return (
    <div className="stat-card">
      <div className={`stat-value tone-${tone}`}>{value}</div>
      <div className="stat-label">{label}</div>
      {sub && <div className="stat-sub">{sub}</div>}
    </div>
  );
}
