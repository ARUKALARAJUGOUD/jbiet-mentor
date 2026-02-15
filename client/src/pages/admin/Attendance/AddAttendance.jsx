import { useEffect, useState } from "react";
import api from "../../../api/api";
import "../../../css/attendance/Addattendance.css";
export default function AddAttendance() {
  const [form, setForm] = useState({
    rollNo: "",
    semester: "",
    regulation: "",
    branch: "",
    subjectCode: "",
    date: "",
    fromTime: "",
    toTime: "",
    status: "PRESENT",
  });

  const [subjects, setSubjects] = useState([]);
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

  useEffect(() => {
    const fetchSubjects = async () => {
      try {
        const res = await api.get("/subjects/marks-subjects", {
          params: {
            semester: form.semester,
            regulation: form.regulation,
            branch: form.branch,
          },
        });
        setSubjects(res.data);
      } catch (err) {
        console.error(err);
      }
    };

    if (form.semester && form.regulation && form.branch) {
      fetchSubjects();
    }
  }, [form.semester, form.regulation, form.branch]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const fetchStudentDetails = async (rollNo) => {
    if (!rollNo) return;
    console.log("Fetching student for rollNo:", rollNo); // 🔥 ADD THIS

    try {
      const res = await api.get(`/api/auth/student/basic/${rollNo}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
        },
      });

      console.log("Student API response:", res.data);
      setForm((prev) => ({
        ...prev,
        regulation: res.data.regulation,
        branch: res.data.branch,
      }));
    } catch (err) {
      alert("Student not found");
      // keep existing defaults if invalid rollNo
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.post("/student/attendance/add", form);
      alert("Attendance added successfully");
    } catch (err) {
      alert(err.response?.data?.message || "Error");
    }
  };

  return (
    <div className="attendance-form-page">
      <div className="attendance-form-card">
        <h2 className="form-title">Add Attendance</h2>

        <form onSubmit={handleSubmit} className="attendance-form">
          <div className="form-group">
            <input
              type="text"
              name="rollNo"
              placeholder="Roll Number"
              value={form.rollNo}
              onChange={handleChange}
              onBlur={(e) => fetchStudentDetails(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <select
              name="regulation"
              value={form.regulation}
              onChange={handleChange}
              disabled
            >
              <option value="">Select Regulation</option>
              {regulations.map((reg, index) => (
                <option key={index} value={reg}>
                  {reg}
                </option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <select
              name="branch"
              value={form.branch}
              onChange={handleChange}
              disabled
            >
              {branches.map((branch, index) => (
                <option key={index} value={branch}>
                  {branch}
                </option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <select
              name="semester"
              value={form.semester}
              onChange={handleChange}
              required
            >
              <option value="">Select Semester</option>
              {[1, 2, 3, 4, 5, 6, 7, 8].map((s) => (
                <option key={s} value={s}>
                  Semester {s}
                </option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <select
              name="subjectCode"
              value={form.subjectCode}
              onChange={handleChange}
              required
            >
              <option value="">Select Subject</option>
              {subjects.map((sub) => (
                <option key={sub.subjectCode} value={sub.subjectCode}>
                  {sub.subjectName}
                </option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <input
              type="date"
              name="date"
              value={form.date}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <input
              type="time"
              name="fromTime"
              value={form.fromTime}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <input
              type="time"
              name="toTime"
              value={form.toTime}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <select name="status" value={form.status} onChange={handleChange}>
              <option value="PRESENT">PRESENT</option>
              <option value="ABSENT">ABSENT</option>
            </select>
          </div>

          <button type="submit" className="submit-btn">
            Add Attendance
          </button>
        </form>
      </div>
    </div>
  );
}
