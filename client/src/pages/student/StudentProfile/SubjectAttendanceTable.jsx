export default function SubjectAttendanceTable({ semester, data }) {
  return (
    <>
      <h3>Subject-wise Attendance (Semester {semester})</h3>

      {data.length === 0 ? (
        <p>No subject attendance found</p>
      ) : (
        <div className="table-wrapper"> 
        <table className="attendance-table">
          <thead>
            <tr>
              <th>Subject Code</th>
              <th>Subject Name</th>
              <th>Total Classes</th>
              <th>Attended Classes</th>
              <th>Attendance %</th>
            </tr>
          </thead>
          <tbody>
            {data.map((sub, index) => (
              <tr key={index}>
                <td>{sub.subjectCode}</td>
                <td>{sub.subjectName}</td>
                <td>{sub.totalClasses}</td>
                <td>{sub.attendedClasses}</td>
                {/* <td>{sub.attendancePercentage}%</td> */}
                <td
                style={{
                  color: sub.attendancePercentage < 75 ? "#dc2626" : "#16a34a",
                  fontWeight: "600"
                }}
              >
                {sub.attendancePercentage}%
              </td>

              </tr>
            ))}
          </tbody>
        </table>
        </div>
      )}
    </>
  );
}
