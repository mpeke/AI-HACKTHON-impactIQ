// Thin fetch wrapper around the FastAPI backend in ../backend.
//
// Base URL is read from VITE_API_BASE_URL (see .env). If the backend isn't
// running, every call here rejects and the calling hook (useApiData) falls
// back to the local mock data in src/data/mockData.js -- so the app still
// works standalone.

const API_BASE =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:8000/api";

async function getJSON(path, options) {
  const res = await fetch(`${API_BASE}${path}`, options);
  if (!res.ok) {
    throw new Error(`Request to ${path} failed with status ${res.status}`);
  }
  return res.json();
}

export const api = {
  getHealth: () => getJSON("/health"),
  getStoryContext: () => getJSON("/story-context"),
  getOverview: () => getJSON("/overview"),
  getCoverageScope: () => getJSON("/coverage-scope"),
  getTraceability: () => getJSON("/traceability"),
  recomputeRisk: (factors) =>
    getJSON("/risk/recompute", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ factors }),
    }),
};
