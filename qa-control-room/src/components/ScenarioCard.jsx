import { useState } from "react";

export default function ScenarioCard({ tag, text, rationale }) {
  const [open, setOpen] = useState(false);

  return (
    <div
      className="scenario-card"
      onClick={() => setOpen((o) => !o)}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") setOpen((o) => !o);
      }}
    >
      <div className="scenario-top">
        <span className={`scenario-tag ${tag.toLowerCase()}`}>{tag}</span>
        <span className="scenario-text">{text}</span>
        <span className={`scenario-chevron${open ? " open" : ""}`}>▸</span>
      </div>
      {open && <div className="scenario-rationale">{rationale}</div>}
    </div>
  );
}
