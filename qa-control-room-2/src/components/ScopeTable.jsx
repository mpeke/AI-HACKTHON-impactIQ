const ACTION_CLASS = {
  "Full re-run": "full",
  Targeted: "targeted",
  Smoke: "smoke",
  Skip: "skip",
};

export default function ScopeTable({ suites }) {
  return (
    <table className="scope-table">
      <thead>
        <tr>
          <th>Suite</th>
          <th>Action</th>
          <th>Tests</th>
        </tr>
      </thead>
      <tbody>
        {suites.map((row) => (
          <tr key={row.suite}>
            <td className="suite-name">{row.suite}</td>
            <td>
              <span
                className={`action-pill ${ACTION_CLASS[row.action] || ""}`}
              >
                {row.action}
              </span>
            </td>
            <td className="tests-value">{row.tests}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
