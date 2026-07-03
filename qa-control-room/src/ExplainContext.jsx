import { createContext, useContext, useState, useCallback } from "react";

const ExplainContext = createContext(null);

/**
 * Provides a single "Explain everything" signal that Panel components
 * can subscribe to. Each Panel still owns its own open/closed state,
 * but bumping this signal tells every mounted Panel to open.
 */
export function ExplainProvider({ children }) {
  const [signal, setSignal] = useState(0);

  const explainEverything = useCallback(() => {
    setSignal((n) => n + 1);
  }, []);

  return (
    <ExplainContext.Provider value={{ signal, explainEverything }}>
      {children}
    </ExplainContext.Provider>
  );
}

export function useExplainSignal() {
  const ctx = useContext(ExplainContext);
  if (!ctx) {
    throw new Error("useExplainSignal must be used within an ExplainProvider");
  }
  return ctx;
}
