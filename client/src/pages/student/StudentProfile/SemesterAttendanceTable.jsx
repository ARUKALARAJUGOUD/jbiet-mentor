export default function SemesterAttendanceTable({ data, onViewSubjects }) {
  return (
    <>
      <h3>Semester-wise Attendance</h3>
      <div className="table-wrapper">
        <table className="attendance-table">
          <thead>
            <tr>
              <th>Semester</th>
              <th>Total Classes</th>
              <th>Attended Classes</th>
              <th>Attendance %</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {data.map((sem) => (
              <tr key={sem.semester}>
                <td>{sem.semester}</td>
                <td>{sem.totalClasses}</td>
                <td>{sem.attendedClasses}</td>
                {/* <td>{sem.attendancePercentage}%</td> */}
                <td
                  style={{
                    color: sem.attendancePercentage < 75 ? "#dc2626" : "#16a34a",
                    fontWeight: "600"
                  }}
                >
                  {sem.attendancePercentage}%
                </td>

                <td>
                  <button onClick={() => onViewSubjects(sem.semester)}>
                    View Subjects
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}
