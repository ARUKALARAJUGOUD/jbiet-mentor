import { useEffect, useMemo, useState } from "react";
import api from "../../../api/api";
import "../../../css/attendance/SemesterAttendance.css"
export default function SemesterAttendance({ studentId }) {
  const [attendance, setAttendance] = useState([]);
  const [selectedSemester, setSelectedSemester] = useState(null);

  // 🔹 Fetch attendance
  useEffect(() => {
    api.get(`/student/attendance/${studentId}`)
      .then(res => setAttendance(res.data))
      .catch(console.error);
  }, [studentId]);

  // 🔹 Semester-wise summary
  const semesterSummary = useMemo(() => {
    const map = {};

    attendance.forEach(a => {
      if (!map[a.semester]) {
        map[a.semester] = {
          semester: a.semester,
          totalClasses: 0,
          present: 0,
          subjects: {}
        };
      }

      map[a.semester].totalClasses += 1;
      if (a.status === "PRESENT") {
        map[a.semester].present += 1;
      }

      // subject-level grouping
      if (!map[a.semester].subjects[a.subjectCode]) {
        map[a.semester].subjects[a.subjectCode] = {
          subjectCode: a.subjectCode,
          subjectName: a.subjectName,
          total: 0,
          present: 0
        };
      }

      map[a.semester].subjects[a.subjectCode].total += 1;
      if (a.status === "PRESENT") {
        map[a.semester].subjects[a.subjectCode].present += 1;
      }
    });

    return Object.values(map).sort((a, b) => a.semester - b.semester);
  }, [attendance]);

  return (
    // <div>
    //   <h2>📅 Attendance Summary</h2>

    //   {/* 🔹 Semester-wise table */}
    //   <table border="1" width="100%">
    //     <thead>
    //       <tr>
    //         <th>S.No</th>
    //         <th>Semester</th>
    //         <th>Total Classes</th>
    //         <th>Classes Attended</th>
    //         <th>Attendance %</th>
    //         <th>Action</th>
    //       </tr>
    //     </thead>
    //     <tbody>
    //       {semesterSummary.map((s, index) => {
    //         const percentage =
    //           s.totalClasses === 0
    //             ? 0
    //             : ((s.present / s.totalClasses) * 100).toFixed(2);

    //         return (
    //           <tr key={s.semester}>
    //             <td>{index + 1}</td>
    //             <td>{s.semester}</td>
    //             <td>{s.totalClasses}</td>
    //             <td>{s.present}</td>
    //             <td>{percentage}%</td>
    //             <td>
    //               <button onClick={() => setSelectedSemester(s)}>
    //                 View Subjects
    //               </button>
    //             </td>
    //           </tr>
    //         );
    //       })}
    //     </tbody>
    //   </table>

    //   {/* 🔹 Subject-wise attendance */}
    //   {selectedSemester && (
    //     <>
    //       <h3>Semester {selectedSemester.semester} – Subject Wise Attendance</h3>

    //       <table border="1" width="100%">
    //         <thead>
    //           <tr>
    //             <th>Subject Code</th>
    //             <th>Subject Name</th>
    //             <th>Total Classes</th>
    //             <th>Present</th>
    //             <th>Absent</th>
    //             <th>Attendance %</th>
    //           </tr>
    //         </thead>
    //         <tbody>
    //           {Object.values(selectedSemester.subjects).map(sub => {
    //             const absent = sub.total - sub.present;
    //             const percent =
    //               sub.total === 0
    //                 ? 0
    //                 : ((sub.present / sub.total) * 100).toFixed(2);

    //             return (
    //               <tr key={sub.subjectCode}>
    //                 <td>{sub.subjectCode}</td>
    //                 <td>{sub.subjectName}</td>
    //                 <td>{sub.total}</td>
    //                 <td>{sub.present}</td>
    //                 <td>{absent}</td>
    //                 <td>{percent}%</td>
    //               </tr>
    //             );
    //           })}
    //         </tbody>
    //       </table>
    //     </>
    //   )}
    // </div>
    <div className="attendance-container">
      <h2 className="page-title">📅 Attendance Summary</h2>

      <div className="table-scroll">
        <table className="attendance-table">
          <thead>
            <tr>
              <th>S.No</th>
              <th>Semester</th>
              <th>Total</th>
              <th>Present</th>
              <th>%</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {semesterSummary.map((s, index) => {
              const percentage =
                s.totalClasses === 0
                  ? 0
                  : ((s.present / s.totalClasses) * 100).toFixed(2);

              return (
                <tr key={s.semester}>
                  <td data-label="S.No">{index + 1}</td>
                  <td data-label="Semester">{s.semester}</td>
                  <td data-label="Total">{s.totalClasses}</td>
                  <td data-label="Present">{s.present}</td>
                  <td data-label="%">{percentage}%</td>
                  <td data-label="Action">
                    <button className="view-btn" onClick={() => setSelectedSemester(s)}>
                      View
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {selectedSemester && (
        <>
          <h3 className="sub-title">
            Semester {selectedSemester.semester} – Subject Attendance
          </h3>

          <div className="table-scroll">
            <table className="attendance-table">
              <thead>
                <tr>
                  <th>Code</th>
                  <th>Subject</th>
                  <th>Total</th>
                  <th>Present</th>
                  <th>Absent</th>
                  <th>%</th>
                </tr>
              </thead>
              <tbody>
                {Object.values(selectedSemester.subjects).map(sub => {
                  const absent = sub.total - sub.present;
                  const percent =
                    sub.total === 0
                      ? 0
                      : ((sub.present / sub.total) * 100).toFixed(2);

                  return (
                    <tr key={sub.subjectCode}>
                      <td data-label="Code">{sub.subjectCode}</td>
                      <td data-label="Subject">{sub.subjectName}</td>
                      <td data-label="Total">{sub.total}</td>
                      <td data-label="Present">{sub.present}</td>
                      <td data-label="Absent">{absent}</td>
                      <td data-label="%">{percent}%</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </>
      )}
    </div>

  );
}
