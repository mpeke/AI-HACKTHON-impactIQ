import { Routes, Route } from "react-router-dom";
import Layout from "./components/Layout.jsx";
import Overview from "./pages/Overview.jsx";
import CoverageScope from "./pages/CoverageScope.jsx";
import Traceability from "./pages/Traceability.jsx";
import { ExplainProvider } from "./ExplainContext.jsx";

export default function App() {
  return (
    <ExplainProvider>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Overview />} />
          <Route path="coverage-scope" element={<CoverageScope />} />
          <Route path="traceability" element={<Traceability />} />
        </Route>
      </Routes>
    </ExplainProvider>
  );
}
