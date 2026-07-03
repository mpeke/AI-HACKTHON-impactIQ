import { useEffect, useState } from "react";
import { useExplainSignal } from "../ExplainContext.jsx";

/**
 * Card container used for every section of the dashboard.
 * Renders a title, an "Explain" pill that toggles `explanation`,
 * and whatever `children` content the panel needs.
 */
export default function Panel({
  title,
  explanation,
  defaultOpen = true,
  children,
}) {
  const { signal } = useExplainSignal();
  const [open, setOpen] = useState(defaultOpen);
  const [lastSignal, setLastSignal] = useState(signal);

  // When the header's "Explain everything" is clicked, force this panel open.
  useEffect(() => {
    if (signal !== lastSignal) {
      setOpen(true);
      setLastSignal(signal);
    }
  }, [signal, lastSignal]);

  return (
    <section className="panel">
      <div className="panel-header">
        <p className="panel-title">{title}</p>
        {explanation && (
          <button
            type="button"
            className="btn-explain"
            onClick={() => setOpen((o) => !o)}
            aria-expanded={open}
          >
            <span className="qmark">?</span>
            Explain
          </button>
        )}
      </div>

      {children}

      {explanation && open && (
        <div className="explain-text">{explanation}</div>
      )}
    </section>
  );
}
