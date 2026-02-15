
import React, { useEffect, useState, useContext } from "react";
import { useCallback } from "react";
import { AuthContext } from "../../../../context/AuthContext";
import api from "../../../../api/api";
import AttendanceFilter from "./AttendanceFilter";
import DayWiseAttendanceTable from "./DayWiseAttendanceTable";
// import "./attendance.css";
import "../../../../css/StudentDashboard/StudentDayWiseAttendance.css"

const StudentDayWiseAttendance = () => {
  const { auth } = useContext(AuthContext);
  const [profile, setProfile] = useState(null);
  const [attendanceData, setAttendanceData] = useState({});
  const [summary, setSummary] = useState({
    totalClasses: 0,
    attendedClasses: 0,
    percentage: 0
  });

  // 🔹 Fetch student profile
  useEffect(() => {
    if (!auth?.accessToken) return;

    api.get("/auth/dashboard")
      .then(res => setProfile(res.data))
      .catch(err => console.error(err));
  }, [auth?.accessToken]);

  // 🔹 Fetch attendance with filters

const fetchAttendance = useCallback(
  async (filters = {}) => {
    if (!profile?.rollNo) return;

    try {
      const res = await api.get(
        `/students/getDayWiseAttendence/${profile.rollNo}`,
        { params: filters }
      );

      setAttendanceData(res.data.attendance);
      calculateSummary(res.data.attendance);
    } catch (err) {
      console.error(err);
    }
  },
  [profile?.rollNo]   // 👈 only depends on rollNo
);


// 🔹 Default load (ALL)
useEffect(() => {
  fetchAttendance();
}, [fetchAttendance]);


  // 🔹 Summary calculation
  const calculateSummary = (attendance) => {
    let total = 0;
    let present = 0;

    Object.values(attendance).forEach(day => {
      total += day.length;
      present += day.filter(c => c.status === "PRESENT").length;
    });

    setSummary({
      totalClasses: total,
      attendedClasses: present,
      percentage: total
        ? ((present / total) * 100).toFixed(2)
        : 0
    });
  };

  if (!profile) return <p>Loading attendance...</p>;

  return (
    <div className="attendance-container">
      <h2>Attendance Overview</h2>

      {/* 🔹 FILTER */}
      <AttendanceFilter onApply={fetchAttendance} />

      {/* 🔹 SUMMARY */}
      <div className="attendance-summary">
        <div>Total Classes: <strong>{summary.totalClasses}</strong></div>
        <div>Attended: <strong>{summary.attendedClasses}</strong></div>
        <div>Attendance %: <strong>{summary.percentage}%</strong></div>
      </div>

      {/* 🔹 TABLE */}
      <DayWiseAttendanceTable
        attendance={attendanceData}
        student={profile}
      />
    </div>
  );
};

export default StudentDayWiseAttendance;
