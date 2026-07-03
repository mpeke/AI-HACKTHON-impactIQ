# QA Control Room — AI-Powered Regression Intelligence (UI Demo)

A front-end-only React app that reproduces the ImpactIQ / "QA Control Room"
dashboard concept using **mock data**, split across three navigable pages:

1. **Overview** — the regression risk score (donut gauge) and the five
   weighted risk factors behind it, plus at-a-glance stats.
2. **Coverage & Scope** — acceptance-criteria coverage, the recommended
   regression scope (which suites run full / targeted / smoke / skip), and
   AI-recommended test scenarios for coverage gaps.
3. **Traceability** — the commit → story → acceptance criterion → test case
   chain, plus a full audit-log table for the story.

There is no backend — every number comes from `src/data/mockData.js`. Swap
that file for real API calls once GitHub/Jira/Zephyr/Bedrock are wired up.

## Tech stack

- React 18
- React Router 6 (client-side routing between the three pages)
- Vite (dev server + build)
- Plain CSS (no UI framework / no Tailwind) — all styling lives in
  `src/index.css` using CSS variables, so it's easy to re-theme.

## Run it locally

You'll need [Node.js](https://nodejs.org) 18+ installed.

```bash
# 1. Install dependencies
npm install

# 2. Start the dev server
npm run dev
```

Vite will print a local URL (usually `http://localhost:5173`) and open it in
your browser automatically. Edits to any file under `src/` hot-reload
instantly.

### Build for production

```bash
npm run build      # outputs static files to dist/
npm run preview    # serve the production build locally to sanity-check it
```

## Project structure

```
qa-control-room/
├── index.html
├── package.json
├── vite.config.js
├── src/
│   ├── main.jsx              # React root + router
│   ├── App.jsx                # route definitions
│   ├── ExplainContext.jsx     # "Explain everything" global toggle
│   ├── index.css              # all styling (dark navy/teal theme)
│   ├── data/
│   │   └── mockData.js        # <-- all mock data lives here
│   ├── components/
│   │   ├── Layout.jsx          # header, story context bar, nav tabs, footer
│   │   ├── Panel.jsx           # card container + Explain toggle
│   │   ├── DonutGauge.jsx      # SVG ring gauge (risk score, AC coverage)
│   │   ├── StatCard.jsx        # "At a glance" stat tiles
│   │   ├── RiskFactorBar.jsx   # weighted risk-signal bars
│   │   ├── ScopeTable.jsx      # regression scope table
│   │   └── ScenarioCard.jsx    # expandable recommended-scenario card
│   └── pages/
│       ├── Overview.jsx
│       ├── CoverageScope.jsx
│       └── Traceability.jsx
```

## Editing the mock data

Everything shown in the UI — the risk score, the five risk factors, coverage
percentages, the regression scope table, recommended scenarios, and the
traceability chain — comes from `src/data/mockData.js`. Change the values
there and every page updates automatically; no component code needs to
change for new numbers or copy.

## Pushing this to GitHub

```bash
cd qa-control-room
git init
git add .
git commit -m "Initial commit: QA Control Room UI demo"
git branch -M main
git remote add origin https://github.com/<your-username>/<your-repo>.git
git push -u origin main
```

(Replace the remote URL with a repo you've created on GitHub first.)

## Notes / next steps

- This is a **UI-only demo** with illustrative data — see the footer note on
  every page. There is no backend, no GitHub/Jira/Zephyr integration, and no
  AWS Bedrock call.
- The "Explain" pill on each panel toggles that panel's explanation text.
  The "Explain everything" button in the header forces every panel open at
  once.
- To wire this up to a real backend, replace the static imports from
  `src/data/mockData.js` with `fetch`/`axios` calls (e.g. in a `useEffect` in
  each page, or via a small data-fetching hook) that hit your FastAPI
  service, and keep the same shape of objects/arrays so the components don't
  need to change.
