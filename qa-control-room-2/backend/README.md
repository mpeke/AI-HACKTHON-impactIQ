# ImpactIQ API (backend)

A small FastAPI service that powers the QA Control Room dashboard. It
serves the same mock data as `src/data/mockData.js` on the frontend, but
computes the risk score, coverage percentage, and test-savings percentage
live from the underlying signals rather than hardcoding them — see
`app/scoring.py`.

There's no database and no real GitHub/Jira/Zephyr/Bedrock calls yet (see
"Wiring up the real thing" below) — this is the same "illustrative data"
demo as the frontend, just served over HTTP so the two can be developed and
deployed independently.

## Run it locally

Requires Python 3.10+.

```bash
cd backend
python -m venv venv
source venv/bin/activate        # Windows: venv\Scripts\activate
pip install -r requirements.txt
uvicorn app.main:app --reload --port 8000
```

Then open **http://localhost:8000/docs** for interactive Swagger docs where
you can try every endpoint directly in the browser.

## Endpoints

| Method | Path                  | Powers                              |
|--------|-----------------------|--------------------------------------|
| GET    | `/api/health`          | Frontend's "is the backend up" check |
| GET    | `/api/story-context`   | Header commit/branch/story bar       |
| GET    | `/api/overview`        | Overview page (risk score, risk factors, at-a-glance) |
| GET    | `/api/coverage-scope`  | Coverage & Scope page                |
| GET    | `/api/traceability`    | Traceability page                    |
| POST   | `/api/risk/recompute`  | Bonus: recompute a score for any set of factors (try it in `/docs`) |

Every response shape matches the mock objects in
`../src/data/mockData.js` field-for-field (camelCase keys), so the React
components didn't need to change when they switched from static imports to
`fetch` calls.

## Project structure

```
backend/
├── app/
│   ├── main.py          # FastAPI app, CORS, router registration
│   ├── models.py        # Pydantic response models (camelCase aliases)
│   ├── mock_data.py      # <-- all mock data lives here
│   ├── scoring.py        # risk score / percentage calculations
│   ├── bedrock.py        # AWS Bedrock integration point (currently stubbed)
│   └── routers/
│       ├── story_context.py
│       ├── overview.py
│       ├── coverage_scope.py
│       └── risk.py
└── requirements.txt
```

## Wiring up the real thing

Each piece of mock data has an obvious real-world source, per the original
ImpactIQ architecture:

- `STORY_CONTEXT`, `RISK_FACTORS` → GitHub webhook + Jira API + historical
  defect data
- `AC_COVERAGE_CRITERIA` → Jira acceptance criteria matched against Zephyr
  linked test cases
- `RECOMMENDED_SCENARIOS` → AWS Bedrock — see `app/bedrock.py`, which has a
  ready-to-uncomment `boto3` call
- `TRACEABILITY_LOG` → the same Jira/Zephyr data, joined by story ID

To go live, replace the constants in `mock_data.py` with calls to those
services (e.g. in each router, or behind a small `app/integrations/`
package), keeping the same dict/list shapes so `models.py` doesn't need to
change.

## CORS

`app/main.py` allows `http://localhost:5173` and `http://127.0.0.1:5173`
(Vite's defaults) out of the box. If you deploy the frontend somewhere
else, set `ALLOWED_ORIGINS` (comma-separated) — see `.env.example`.
