import Panel from "../components/Panel.jsx";
import { traceabilityFallback } from "../data/mockData.js";
import { useApiData } from "../hooks/useApiData.js";
import { api } from "../api/client.js";

export default function Traceability() {
  const { data } = useApiData(api.getTraceability, traceabilityFallback);
  const { traceabilityChain, traceabilityExplain, traceabilityLog } = data;

  return (
    <>
      <div className="page-heading">
        <h1>Traceability</h1>
        <p>
          Every recommendation links back to its source, so the QA report is
          auditable end to end.
        </p>
      </div>

      <Panel title="TRACEABILITY" explanation={traceabilityExplain}>
        <div className="chain-row">
          <div className="chain-box">
            <div className="chain-label">COMMIT</div>
            <div className="chain-value">{traceabilityChain.commit}</div>
          </div>
          <div className="chain-arrow">→</div>
          <div className="chain-box">
            <div className="chain-label">JIRA STORY</div>
            <div className="chain-value">{traceabilityChain.story}</div>
          </div>
          <div className="chain-arrow">→</div>
          <div className="chain-box">
            <div className="chain-label">ACCEPTANCE CRITERION</div>
            <div className="chain-value">{traceabilityChain.criterion.id}</div>
            <div className="chain-sub">{traceabilityChain.criterion.text}</div>
          </div>
          <div className="chain-arrow">→</div>
          <div className="chain-box">
            <div className="chain-label">TEST CASE</div>
            <div className="chain-value">{traceabilityChain.testCase.id}</div>
            <div className="chain-sub">{traceabilityChain.testCase.text}</div>
          </div>
        </div>
      </Panel>

      <Panel
        title="FULL AUDIT LOG · PROJ-2214"
        explanation="Every acceptance criterion on the story appears here, whether or not a test case has been linked yet. Rows with no test case are exactly the gaps that surface as recommended scenarios on the Coverage & Scope page."
      >
        <table className="audit-table">
          <thead>
            <tr>
              <th>Commit</th>
              <th>Story</th>
              <th>Acceptance Criterion</th>
              <th>Test Case</th>
            </tr>
          </thead>
          <tbody>
            {traceabilityLog.map((row) => (
              <tr key={row.criterion}>
                <td className="audit-mono">{row.commit}</td>
                <td className="audit-mono">{row.story}</td>
                <td>
                  <span className="audit-mono">{row.criterion}</span>
                  <br />
                  {row.criterionText}
                </td>
                <td>
                  {row.testCase ? (
                    <>
                      <span className="audit-mono">{row.testCase}</span>
                      <br />
                      {row.testCaseText}
                    </>
                  ) : (
                    <span className="audit-missing">No test linked yet</span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </Panel>
    </>
  );
}
