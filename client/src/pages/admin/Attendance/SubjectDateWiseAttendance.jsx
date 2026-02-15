import { useEffect, useState } from "react";
import api from "../../../api/api";
import "../../../css/attendance/SubjectDateWiseAttendance.css";
export default function SubjectDateWiseAttendance() {
  const [form, setForm] = useState({
    rollNo: "",
    regulation: "",
    branch: "",
    semester: "",
  });

  const branches = [
    "AI&DS",
    "AI&ML",
    "CE",
    "CSE",
    "CSE(AI&ML)",
    "CSE(DS)",
    "ECE",
    "ECM",
    "EEE",
    "IT",
    "ME",
  ];

  const regulations = ["R18", "R20", "R22", "R23", "R24", "R25"];

  const [subjects, setSubjects] = useState([]);
  const [selectedSubject, setSelectedSubject] = useState("");
  const [attendance, setAttendance] = useState([]);

  // 🔥 Handle input change
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  useEffect(() => {
    const fetchSubjects = async () => {
      try {
        const res = await api.get("/subjects/getSubjects", {
          params: {
            regulation: form.regulation,
            branch: form.branch,
            semester: form.semester,
          },
        });

        setSubjects(res.data.data);
      } catch (error) {
        console.error("Error fetching subjects");
      }
    };

    if (form.regulation && form.branch && form.semester) {
      fetchSubjects();
    }
  }, [form.regulation, form.branch, form.semester]);

  // 🔥 Fetch attendance
  const fetchAttendance = async () => {
    try {
      const res = await api.get("/student/attendance/student/present-classes", {
        params: {
          rollNo: form.rollNo,
          regulation: form.regulation,
          branch: form.branch,
          semester: form.semester,
          subjectName: selectedSubject,
        },
      });

      setAttendance(res.data.classes || res.data);
    } catch (error) {
      console.error("Error fetching attendance");
    }
  };

  return (
    <div className="attendance-container">
      <h2>Student subject Attendance</h2>

      {/* 🔹 Input Section */}
      <div className="form-section">
        <input
          type="text"
          name="rollNo"
          placeholder="Roll No"
          value={form.rollNo}
          onChange={handleChange}
        />

        <select name="regulation" onChange={handleChange}>
          <option value="">Select Regulation</option>
          {regulations.map((reg, index) => (
            <option key={index} value={reg}>
              {reg}
            </option>
          ))}
        </select>

        <select name="branch" onChange={handleChange}>
          <option value="">Select Branch</option>
          {branches.map((branch, index) => (
            <option key={index} value={branch}>
              {branch}
            </option>
          ))}
        </select>

        <select name="semester" onChange={handleChange}>
          <option value="">Select Semester</option>
          {[1, 2, 3, 4, 5, 6, 7, 8].map((sem) => (
            <option key={sem} value={sem}>
              {sem}
            </option>
          ))}
        </select>

        {/* 🔥 Subject Dropdown */}
        <select
          value={selectedSubject}
          onChange={(e) => setSelectedSubject(e.target.value)}
        >
          <option value="">Select Subject</option>
          {subjects.map((sub) => (
            <option key={sub.subjectCode} value={sub.subjectName}>
              {sub.subjectName}
            </option>
          ))}
        </select>

        <button onClick={fetchAttendance}>Get Attendance</button>
      </div>

      {/* 🔹 Attendance Table */}
      {attendance.length > 0 && (
        <div className="table-wrapper">
          <table className="attendance-table">
            <thead>
              <tr>
                <th>
                  Date <span> mm/dd/yyyy </span>
                </th>
                <th>From Time</th>
                <th>To Time</th>
              </tr>
            </thead>
            <tbody>
              {attendance.map((item, index) => (
                <tr key={index}>
                  <td>{new Date(item.date).toLocaleDateString()}</td>
                  <td>{item.fromTime}</td>
                  <td>{item.toTime}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
