import { useEffect, useState } from "react";

/**
 * Fetches data via `fetchFn` on mount. Renders `fallback` immediately (so
 * the UI is never empty/blank) and swaps in live data if/when the fetch
 * succeeds. If the fetch fails -- most commonly because the backend isn't
 * running -- it silently stays on `fallback` and reports that via
 * `usingFallback`.
 */
export function useApiData(fetchFn, fallback) {
  const [data, setData] = useState(fallback);
  const [loading, setLoading] = useState(true);
  const [usingFallback, setUsingFallback] = useState(false);

  useEffect(() => {
    let cancelled = false;

    setLoading(true);
    fetchFn()
      .then((json) => {
        if (cancelled) return;
        setData(json);
        setUsingFallback(false);
      })
      .catch(() => {
        if (cancelled) return;
        setData(fallback);
        setUsingFallback(true);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
    // fetchFn/fallback are expected to be stable per call site.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return { data, loading, usingFallback };
}
