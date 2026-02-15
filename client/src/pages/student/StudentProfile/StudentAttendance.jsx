import { useEffect, useState } from "react";
import SemesterAttendanceTable from "./SemesterAttendanceTable";
import SubjectAttendanceTable from "./SubjectAttendanceTable";
import api from "../../../api/api";
import { AuthContext } from "../../../context/AuthContext";
import { useContext } from "react";
import "../../../css/StudentDashboard/StudentAttendance.css"
export default function StudentAttendance() {
  const [student, setStudent] = useState(null);
  const [semesterWise, setSemesterWise] = useState([]);
  const [subjectWise, setSubjectWise] = useState([]);
  const [selectedSemester, setSelectedSemester] = useState(null);
  const [loading, setLoading] = useState(false);

  //student data rollNo
  const { auth } = useContext(AuthContext);
  const [data, setData] = useState(null);

  //fetching the student rollNo through the access token 
  useEffect(() => {
    if (!auth?.accessToken) return;

    api.get("/auth/dashboard")
      .then(res => setData(res.data))
      .catch(err => console.error(err));
  }, [auth?.accessToken]);




  useEffect(() => {
    if (!data?.rollNo) return; // safety check

    const fetchAttendance = async () => {
      try {
        setLoading(true);

        const res = await api.get(`/students/getAttendencereport/${data?.rollNo}`);

        setStudent(res.data.student);
        setSemesterWise(res.data.semesterWiseAttendance);
        setSubjectWise(res.data.subjectWiseAttendance);
        setSelectedSemester(null);
      } catch (err) {
        alert("Student not found or error fetching data");
      } finally {
        setLoading(false);
      }
    };

    fetchAttendance();
  }, [data?.rollNo]);

  const filteredSubjects = subjectWise.filter(
    (sub) => sub.semester === selectedSemester
  );
  return (
    <div className="attendance-page">

      <div className="attendance-card">
        <h2 className="attendance-title">Student Attendance</h2>

        {loading && <p className="loading-text">Loading...</p>}

        {/* Student Info */}
        {student && (
          <div className="student-info-grid">
            <div className="info-box">
              <span>Name</span>
              <strong>{student.name}</strong>
            </div>

            <div className="info-box">
              <span>Roll No</span>
              <strong>{student.rollNo}</strong>
            </div>

            <div className="info-box">
              <span>Branch</span>
              <strong>{student.branch}</strong>
            </div>

            <div className="info-box">
              <span>Regulation</span>
              <strong>{student.regulation}</strong>
            </div>
          </div>
        )}
      </div>

      {/* Semester Table */}
      {semesterWise.length > 0 && (
        <div className="attendance-card table-card">
          <SemesterAttendanceTable
            data={semesterWise}
            onViewSubjects={(sem) => setSelectedSemester(sem)}
          />
        </div>
      )}

      {/* Subject Table */}
      {selectedSemester && (
        <div className="attendance-card table-card">
          <SubjectAttendanceTable
            semester={selectedSemester}
            data={filteredSubjects}
          />
        </div>
      )}

    </div>
  );

}
