import { useEffect, useState } from "react";
import api from "../../../api/api";
import { useContext } from "react";
import { AuthContext } from "../../../context/AuthContext";
import "../../../css/StudentDashboard/SemesterMarks.css"
export default function StudentMarks() {
  const [summary, setSummary] = useState([]);
  const [student, setStudent] = useState(null);
  const [expandedSemester, setExpandedSemester] = useState(null);
  const [semesterMarks, setSemesterMarks] = useState({});
  const [loading, setLoading] = useState(false);


  const { auth } = useContext(AuthContext);
  const [data, setData] = useState(null);

  useEffect(() => {
    if (!auth?.accessToken) return;

    api.get("/auth/dashboard")
      .then(res => setData(res.data))
      .catch(err => console.error(err));
  }, [auth?.accessToken]);




  console.log(data)
  console.log(data?.rollNo)

  useEffect(() => {
    if (!data?.rollNo) return;

    const fetchSummary = async () => {
      try {
        const res = await api.get(
          `/students/academics/${data.rollNo}/summary`
        );
        setStudent(res.data.student);
        setSummary(res.data.semesters);
      } catch (err) {
        console.error(err);
      }
    };

    fetchSummary();
  }, [data?.rollNo]);

  const toggleSemester = async (semester) => {
    if (expandedSemester === semester) {
      setExpandedSemester(null);
      return;
    }

    setExpandedSemester(semester);

    if (!semesterMarks[semester]) {
      setLoading(true);
      try {
        const res = await api.get(
          `/students/academics/${data.rollNo}/semester/${semester}`
        );
        setSemesterMarks((prev) => ({
          ...prev,
          [semester]: res.data.subjects //.marks
        }));
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
  };



  return (
    <div className="results-container">
      {student && (
        <div className="student-card">
          <h2 className="student-name">{student.name}</h2>
          <div className="student-meta">
            <div className="meta-box">
              <span>Roll No</span>
              <strong>{student.rollNo}</strong>
            </div>
            <div className="meta-box">
              <span>Branch</span>
              <strong>{student.branch}</strong>
            </div>
            <div className="meta-box">
              <span>Regulation</span>
              <strong>{student.regulation}</strong>
            </div>
          </div>
        </div>
      )}

      {/* SEMESTER SUMMARY TABLE */}
      <div className="table-wrapper">

        <table className="table">
          <thead>
            <tr>
              <th>Semester</th>
              <th>Total Credits</th>
              <th>Credits Secured</th>
              <th>SGPA</th>
              <th>CGPA</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {summary.map((sem) => (
              <tr key={sem.semester}>
                <td>{sem.semester}</td>
                <td>{sem.totalCredits}</td>
                <td>{sem.creditsSecured}</td>
                <td>{sem.sgpa}</td>
                <td>{sem.cgpa}</td>
                <td>
                  <button
                    className="view-btn"
                    onClick={() => toggleSemester(sem.semester)}
                  >
                    {expandedSemester === sem.semester ? "Hide" : "View More"}
                  </button>

                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* SUBJECT-WISE TABLE */}
      {expandedSemester && (
        <div className="subjects-section">
          <h3>Semester {expandedSemester} – Subject Wise Marks</h3>

          {loading ? (
            <p>Loading...</p>
          ) : (
            <div className="table-wrapper">
              <table className="table sub-table">
                <thead>
                  <tr>
                    <th>Subject Code</th>
                    <th>Subject Name</th>
                    <th>Credits</th>
                    <th>Total Marks</th>
                    <th>Grade</th>
                    <th>Grade Point</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {semesterMarks[expandedSemester]?.map((m) => (
                    <tr
                      key={m.subjectCode}
                      className={m.result === "FAIL" ? "fail" : ""}
                    >
                      <td>{m.subjectCode}</td>
                      <td>{m.subjectName}</td>
                      <td>{m.credits}</td>
                      <td>{m.totalMarks}</td>
                      <td>{m.grade}</td>
                      <td>{m.gradePoint}</td>
                      <td>{m.result}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
