import AnalyticsRow from "./AnalyticsRow";

export default function AnalyticsTable({ data }) {
  return (
    <table className="analytics-table">
      <thead>
        <tr>
          <th>Regulation</th>
          <th>Branch</th>
          <th>Semester</th>
          <th>Avg Pass %</th>
          <th>Avg Attendance %</th>
        </tr>
      </thead>

      <tbody>
        {data.length === 0 ? (
          <tr>
            <td colSpan="5" style={{ textAlign: "center" }}>
              No data found
            </td>
          </tr>
        ) : (
          data.map((row, index) => (
            <AnalyticsRow key={index} row={row} />
          ))
        )}
      </tbody>
    </table>
  );
}
