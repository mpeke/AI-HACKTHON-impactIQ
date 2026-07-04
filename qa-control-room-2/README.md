# QA Control Room — AI-Powered Regression Intelligence

A full-stack demo of the ImpactIQ / "QA Control Room" dashboard:

- **`/` (this folder)** — a React + Vite frontend, split across three
  navigable pages (Overview, Coverage & Scope, Traceability).
- **`backend/`** — a FastAPI service that serves the same data over HTTP,
  computing the risk score and percentages live instead of hardcoding them.

The frontend works **standalone** (it ships with local mock data as a
fallback) or **connected to the live backend** — it auto-detects which one
it's talking to and shows a status badge in the header.

## Quick start (both servers)

You'll need [Node.js](https://nodejs.org) 18+ and [Python](https://python.org) 3.10+.

**Terminal 1 — backend:**

```bash
cd backend
python -m venv venv
source venv/bin/activate        # Windows: venv\Scripts\activate
pip install -r requirements.txt
uvicorn app.main:app --reload --port 8000
```

Swagger docs: http://localhost:8000/docs

**Terminal 2 — frontend:**

```bash
npm install
npm run dev
```

Open the printed URL (usually http://localhost:5173). The header badge
should read **"Live backend"** in teal. If you skip Terminal 1 entirely,
the frontend still runs fine — the badge will read **"Mock data (backend
offline)"** and every page falls back to `src/data/mockData.js`.

## Pages

1. **Overview** — the regression risk score (donut gauge) and the five
   weighted risk factors behind it, plus at-a-glance stats.
2. **Coverage & Scope** — acceptance-criteria coverage, the recommended
   regression scope (which suites run full / targeted / smoke / skip), and
   AI-recommended test scenarios for coverage gaps.
3. **Traceability** — the commit → story → acceptance criterion → test
   case chain, plus a full audit-log table.

## Tech stack

**Frontend:** React 18, React Router 6, Vite, plain CSS (no framework —
everything's in `src/index.css` using CSS variables for easy re-theming).

**Backend:** FastAPI, Pydantic v2, Uvicorn. See `backend/README.md` for
the endpoint list and the AWS Bedrock integration stub.

## Project structure

```
qa-control-room/
├── index.html
├── package.json
├── vite.config.js
├── .env                        # VITE_API_BASE_URL, points at the backend
├── src/
│   ├── main.jsx                 # React root + router
│   ├── App.jsx                  # route definitions
│   ├── ExplainContext.jsx       # "Explain everything" global toggle
│   ├── index.css                # all styling (dark navy/teal theme)
│   ├── api/
│   │   └── client.js            # fetch wrapper around the FastAPI backend
│   ├── hooks/
│   │   ├── useApiData.js        # fetch + mock-data fallback
│   │   └── useBackendStatus.js  # live/offline badge polling
│   ├── data/
│   │   └── mockData.js          # local mock data + fallback bundles
│   ├── components/
│   │   ├── Layout.jsx            # header, story context bar, nav tabs, footer
│   │   ├── Panel.jsx             # card container + Explain toggle
│   │   ├── DonutGauge.jsx        # SVG ring gauge (risk score, AC coverage)
│   │   ├── StatCard.jsx          # "At a glance" stat tiles
│   │   ├── RiskFactorBar.jsx     # weighted risk-signal bars
│   │   ├── ScopeTable.jsx        # regression scope table
│   │   └── ScenarioCard.jsx      # expandable recommended-scenario card
│   └── pages/
│       ├── Overview.jsx
│       ├── CoverageScope.jsx
│       └── Traceability.jsx
└── backend/
    ├── app/
    │   ├── main.py               # FastAPI app, CORS, router registration
    │   ├── models.py             # Pydantic response models
    │   ├── mock_data.py          # backend's copy of the mock data
    │   ├── scoring.py            # risk score / percentage calculations
    │   ├── bedrock.py            # AWS Bedrock integration point (stubbed)
    │   └── routers/
    ├── requirements.txt
    └── README.md
```

## How the frontend/backend integration works

- `src/api/client.js` wraps `fetch` calls to the FastAPI endpoints.
- `src/hooks/useApiData.js` calls the API on page mount, but **renders the
  local mock data immediately** so the UI is never blank, then swaps in
  live data if the fetch succeeds. If the backend is unreachable, it just
  stays on mock data — no error screens.
- `src/hooks/useBackendStatus.js` polls `GET /api/health` every 15s to
  drive the status badge in the header.
- Every backend response is shaped **field-for-field identically** to the
  corresponding object in `mockData.js` (same camelCase keys), so no
  component had to change when it switched from a static import to a
  `fetch` call — only the pages' data source changed.

## Editing the mock data

Frontend mock data lives in `src/data/mockData.js`; the backend's copy
lives in `backend/app/mock_data.py`. They're independent — editing one
doesn't affect the other unless you're running the connected setup, in
which case the backend's data wins (since it's what's actually fetched).

## Pushing this to GitHub

```bash
git init
git add .
git commit -m "Initial commit: QA Control Room full-stack demo"
git branch -M main
git remote add origin https://github.com/<your-username>/<your-repo>.git
git push -u origin main
```

`.env` and `backend/.env` are already git-ignored — `.env.example` files
are included instead so collaborators know what to set.

## Notes / next steps

- This is a **demo with illustrative data** — see the footer note on every
  page. There is no real GitHub/Jira/Zephyr integration yet, and
  `backend/app/bedrock.py` is a stub (real call commented in, ready to
  uncomment once you have AWS credentials).
- The "Explain" pill on each panel toggles that panel's explanation text.
  The "Explain everything" button in the header forces every panel open at
  once.
- `POST /api/risk/recompute` is a bonus endpoint that recomputes a risk
  score for any set of factors you pass it — try it from `/docs` to see
  the scoring engine work on inputs other than the canned example.
