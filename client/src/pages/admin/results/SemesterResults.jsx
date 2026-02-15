
import { useEffect, useState, useCallback, useMemo } from "react";
import api from "../../../api/api.js";
import "../../../css/results/SemesterResult.css"
const semesters = [1, 2, 3, 4, 5, 6, 7, 8]; // ✅ move outside

export default function SemesterResults({ studentId }) {
  const [semesterData, setSemesterData] = useState([]);
  const [selectedSemester, setSelectedSemester] = useState(null);
  const [subjectMarks, setSubjectMarks] = useState([]);



  const semesterWithCGPA = useMemo(() => {
    let cumulativeCredits = 0;
    let cumulativePoints = 0;

    return [...semesterData]
      .sort((a, b) => a.semester - b.semester)
      .map(s => {
        cumulativeCredits += s.credits;
        cumulativePoints += s.totalPoints;

        const cgpa =
          cumulativeCredits === 0
            ? 0
            : (cumulativePoints / cumulativeCredits).toFixed(2);

        return {
          ...s,
          cgpa
        };
      });
  }, [semesterData]);



  const calculateResult = (marks) => {
    let totalCredits = 0;
    let totalPoints = 0;

    marks.forEach(m => {
      totalCredits += m.credits;
      totalPoints += m.credits * m.gradePoint;
    });

    const sgpa = totalCredits === 0 ? 0 : (totalPoints / totalCredits).toFixed(2);
    return { totalCredits, sgpa, totalPoints };
  };






  const fetchSemester = useCallback(async (sem) => {
    const res = await api.get(
      `/auth/getMarks/student/semester-wise/${studentId}/${sem}`
    );

    if (res.data.length > 0) {
      const { totalCredits, sgpa, totalPoints } = calculateResult(res.data);

      setSemesterData(prev => [
        ...prev.filter(s => s.semester !== sem),
        {
          semester: sem,
          credits: totalCredits,
          sgpa: Number(sgpa),
          totalPoints,
          data: res.data
        }
      ]);
    }
  }, [studentId]);












  useEffect(() => {
    semesters.forEach(s => fetchSemester(s));
  }, [fetchSemester]); // ✅ warning gone

  const viewSubjects = (sem) => {
    const found = semesterData.find(s => s.semester === sem);
    if (!found) return;

    setSelectedSemester(sem);
    setSubjectMarks(found.data);
  };






  const getPassFailStatus = (subject) => {
    // Rule: Fail if grade is F or gradePoint is 0
    if (subject.grade === "F" || subject.gradePoint === 0) {
      return "Fail";
    }
    return "Pass";
  };

  // const status = getPassFailStatus;













  // return (
  //   <div>
  //     <h2>Semester Results</h2>

  //     <table border="1" width="100%">
  //       <thead>
  //         <tr>
  //           <th>S.No</th>
  //           <th>Semester</th>
  //           <th> Total Credits</th>
  //           <th>SGPA</th>
  //           <th>CGPA</th>
  //           <th>Action</th>
  //         </tr>
  //       </thead>
  //       <tbody>
  //         {/*semesterData*/semesterWithCGPA
  //   .sort((a, b) => a.semester - b.semester).map((s, index) => (
  //           <tr key={s.semester}>
  //             <td>{index + 1}</td>
  //             <td>{s.semester}</td>
  //             <td>{s.credits}</td>
  //             <td>{s.sgpa}</td>
  //             <td>{s.cgpa}</td>
  //             <td>
  //               <button onClick={() => viewSubjects(s.semester)}>
  //                 View Marks
  //               </button>
  //             </td>
  //           </tr>
  //         ))}
  //       </tbody>
  //     </table>

  //     {selectedSemester && (
  //       <>
  //         <h3>Semester {selectedSemester} – Subject Wise Marks</h3>

  //         <table border="1" width="100%">
  //           <thead>
  //             <tr>
  //               <th>Subject Code</th>
  //               <th>Subject Name</th>
  //               <th>Credits</th>
  //               <th>Total Marks</th>
  //               <th>Grade</th>
  //               <th>Grade Point</th>
  //                <th>Status</th>
  //             </tr>
  //           </thead>

  //           <tbody>
  //      {subjectMarks.map((s) => {
  //   const status = getPassFailStatus(s); // ✅ CALL FUNCTION

  //   return (
  //     <tr key={s._id}>
  //       <td>{s.subjectCode}</td>
  //       <td>{s.subjectName}</td>
  //       <td>{s.credits}</td>
  //       <td>{s.totalMarks}</td>
  //       <td>{s.grade}</td>
  //       <td>{s.gradePoint}</td>
  //       <td
  //         style={{
  //           color: status === "Pass" ? "green" : "red",
  //           fontWeight: "bold"
  //         }}
  //       >
  //         {status}
  //       </td>
  //     </tr>
  //   );
  // })}
  //    </tbody>
  //         </table>
  //       </>
  //     )}
  //   </div>
  // );
  return (
    <div className="results-container">
      <h2>Semester Results</h2>

      {/* ================= SEMESTER SUMMARY TABLE ================= */}
      <div className="table-wrapper">
        <table className="results-table">
          <thead>
            <tr>
              <th>S.No</th>
              <th>Semester</th>
              <th>Total Credits</th>
              <th>SGPA</th>
              <th>CGPA</th>
              <th>Action</th>
            </tr>
          </thead>

          <tbody>
            {semesterWithCGPA
              .sort((a, b) => a.semester - b.semester)
              .map((s, index) => (
                <tr key={s.semester}>
                  <td>{index + 1}</td>
                  <td>{s.semester}</td>
                  <td>{s.credits}</td>
                  <td>{s.sgpa}</td>
                  <td>{s.cgpa}</td>
                  <td>
                    <button
                      className="view-btn"
                      onClick={() => viewSubjects(s.semester)}
                    >
                      View Marks
                    </button>
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>

      {/* ================= SUBJECT WISE TABLE ================= */}
      {selectedSemester && (
        <>
          <h3 className="sub-title">
            Semester {selectedSemester} – Subject Wise Marks
          </h3>

          <div className="table-wrapper">
            <table className="results-table">
              <thead>
                <tr>
                  <th>Code</th>
                  <th>Subject</th>
                  <th>Credits</th>
                  <th>Total</th>
                  <th>Grade</th>
                  <th>Point</th>
                  <th>Status</th>
                </tr>
              </thead>

              <tbody>
                {subjectMarks.map(s => {
                  const status = getPassFailStatus(s);
                  return (
                    <tr key={s._id}>
                      <td>{s.subjectCode}</td>
                      <td>{s.subjectName}</td>
                      <td>{s.credits}</td>
                      <td>{s.totalMarks}</td>
                      <td>{s.grade}</td>
                      <td>{s.gradePoint}</td>
                      <td
                        className={
                          status === "Pass" ? "status-pass" : "status-fail"
                        }
                      >
                        {status}
                      </td>
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

