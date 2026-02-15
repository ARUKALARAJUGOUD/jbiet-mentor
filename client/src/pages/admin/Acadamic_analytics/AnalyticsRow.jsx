export default function AnalyticsRow({ row }) {
  const isLowPerformance =
    row.avgPassPercentage < 60 ||
    row.avgAttendancePercentage < 60;

  return (
    <tr className={isLowPerformance ? "danger-row" : ""}>
      <td>{row.regulation}</td>
      <td>{row.branch}</td>
      <td>{row.semester}</td>
      <td>{row.avgPassPercentage}%</td>
      <td>{row.avgAttendancePercentage}%</td>
    </tr>
  );
}
