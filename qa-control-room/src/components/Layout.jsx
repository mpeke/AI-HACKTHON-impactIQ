import { NavLink, Outlet } from "react-router-dom";
import { storyContext, footerNote } from "../data/mockData.js";
import { useExplainSignal } from "../ExplainContext.jsx";

const TABS = [
  { to: "/", label: "Overview", end: true },
  { to: "/coverage-scope", label: "Coverage & Scope" },
  { to: "/traceability", label: "Traceability" },
];

export default function Layout() {
  const { explainEverything } = useExplainSignal();

  return (
    <div className="app-shell">
      <header className="topbar">
        <div className="brand">
          <div className="brand-icon" aria-hidden="true">
            🤖
          </div>
          <div>
            <p className="brand-kicker">AI-POWERED REGRESSION</p>
            <h1 className="brand-title">QA Control Room</h1>
          </div>
        </div>

        <div className="legend">
          <span className="legend-item">
            <span className="legend-dot dot-danger" /> High risk
          </span>
          <span className="legend-item">
            <span className="legend-dot dot-warn" /> Medium
          </span>
          <span className="legend-item">
            <span className="legend-dot dot-safe" /> Low
          </span>
          <button
            type="button"
            className="btn-explain-all"
            onClick={explainEverything}
          >
            Explain everything
          </button>
        </div>
      </header>

      <div className="context-bar">
        <div className="context-field">
          <span className="context-label">COMMIT</span>
          <span className="context-value mono">{storyContext.commit}</span>
        </div>
        <div className="context-field">
          <span className="context-label">BRANCH</span>
          <span className="context-value mono">{storyContext.branch}</span>
        </div>
        <div className="context-field">
          <span className="context-label">STORY</span>
          <span className="context-value">
            {storyContext.storyId} · {storyContext.storyTitle}
          </span>
        </div>
        <div className="context-field">
          <span className="context-label">STATUS</span>
          <span className="status-pill">{storyContext.status}</span>
        </div>
        <div className="context-field">
          <span className="context-label">SYNCED</span>
          <span className="context-value">{storyContext.syncedAgo}</span>
        </div>
      </div>

      <nav className="tabs">
        {TABS.map((tab) => (
          <NavLink
            key={tab.to}
            to={tab.to}
            end={tab.end}
            className={({ isActive }) =>
              "tab-link" + (isActive ? " active" : "")
            }
          >
            {tab.label}
          </NavLink>
        ))}
      </nav>

      <main style={{ display: "flex", flexDirection: "column", gap: 20 }}>
        <Outlet />
      </main>

      <footer className="app-footer">{footerNote}</footer>
    </div>
  );
}
