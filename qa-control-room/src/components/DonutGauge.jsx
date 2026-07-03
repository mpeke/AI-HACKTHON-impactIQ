const TONE_COLORS = {
  danger: "#ff6b5b",
  warn: "#f2a93b",
  teal: "#2dd9c0",
  safe: "#2dd9c0",
};

/**
 * A simple ring/donut gauge built with two overlapping SVG circles.
 * value/max determine how much of the ring is filled.
 */
export default function DonutGauge({
  value,
  max = 100,
  size = 168,
  strokeWidth = 14,
  tone = "teal",
  children,
}) {
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const pct = Math.max(0, Math.min(1, value / max));
  const dashOffset = circumference * (1 - pct);
  const color = TONE_COLORS[tone] || TONE_COLORS.teal;

  return (
    <div
      className="gauge-score-wrap"
      style={{ width: size, height: size }}
    >
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="#152238"
          strokeWidth={strokeWidth}
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={color}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={dashOffset}
          transform={`rotate(-90 ${size / 2} ${size / 2})`}
          style={{ transition: "stroke-dashoffset 0.6s ease" }}
        />
      </svg>
      <div className="gauge-score-number">{children}</div>
    </div>
  );
}
