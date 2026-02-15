import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
// import SemesterResults from "../results/SemesterResults";
import api from "../../../api/api.js";
import "../../../css/student/AdminStudentProfile.css";
import DayWiseAttendance from "../Attendance/DayWiseAttendance.jsx";
import SemesterAttendance from "../Attendance/SemesterAttendance.jsx";
import SemesterResults from "../results/SemesterResults.jsx";

export default function StudentProfile() {
  const { id } = useParams();
  const [student, setStudent] = useState(null);
  const [showMarks, setShowMarks] = useState(false);
  const [showAttendance, setShowAttendance] = useState(false);
  const [showDayAttendance, setShowDayAttendance] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    api
      .get(`/admin/student/${id}`)
      .then((res) => setStudent(res.data))
      .catch(console.error);
  }, [id]);

  if (!student) return <p>Loading...</p>;

  return (
    <div className="attendance-page">
      <div className="attendance-container">
        {/* 🔹 PROFILE CARD */}
        <div className="profile-card">
          <div className="profile-header-block">
            <h2 className="profile-name">{student.studentInfo.name}</h2>

            <div className="profile-meta">
              <span>{student.studentInfo.rollNo}</span>
              <span>{student.studentInfo.branch}</span>
              <span>{student.studentInfo.regulation}</span>
            </div>

            <div className="profile-info-grid">
              <div>
                <b>Email:</b> {student.studentInfo.email}
              </div>
              <div>
                <b>Year:</b> {student.studentInfo.year}
              </div>
              <div>
                <b>Semester:</b> {student.studentInfo.semester}
              </div>
            </div>
          </div>

          {/* 🔘 ACTIONS */}
          <div className="profile-actions">
            <button
              className="filter-btn"
              onClick={() => {
                setShowMarks(true);
                setShowAttendance(false);
                setShowDayAttendance(false);
              }}
            >
              📊 Marks
            </button>

            <button
              className="filter-btn"
              onClick={() => {
                setShowAttendance(true);
                setShowMarks(false);
                setShowDayAttendance(false);
              }}
            >
              📅 Attendance
            </button>

            <button
              className="filter-btn"
              onClick={() => {
                setShowMarks(false);
                setShowAttendance(false);
                setShowDayAttendance(true);
              }}
            >
              🗓 Day-wise
            </button>

            <button
              className="filter-btn"
              onClick={() => navigate(`/admin/students/edit/${id}`)}
            >
              ✏ Edit
            </button>
          </div>
        </div>

        {/* 🔽 CONTENT */}
        {showMarks && <SemesterResults studentId={student.studentInfo._id} />}

        {showAttendance && (
          <SemesterAttendance studentId={student.studentInfo._id} />
        )}

        {showDayAttendance && (
          <DayWiseAttendance studentId={student.studentInfo._id} />
        )}
      </div>
    </div>
  );
}
