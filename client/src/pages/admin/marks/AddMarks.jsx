import { useEffect, useState } from "react";
import api from "../../../api/api";
import "../../../css/marks/marks.css";
const AddMarks = () => {
  const [subjects, setSubjects] = useState([]);

  const [form, setForm] = useState({
    rollNo: "",
    regulation: "R20",
    branch: "CSE",
    semester: "",
    subjectCode: "",
    internalMarks: "",
    externalMarks: "",
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

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  /* ✅ ADD THIS FUNCTION HERE */
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

  // 🔥 AUTO FETCH SUBJECTS
  const { regulation, branch, semester } = form;
  useEffect(() => {
    if (regulation && branch && semester) {
      api
        .get("/subjects/marks-subjects", {
          params: { regulation, branch, semester },
          headers: {
            Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
          },
        })
        .then((res) => setSubjects(res.data))
        .catch(() => setSubjects([]));
    }
  }, [regulation, branch, semester]);

  const submitMarks = async (e) => {
    e.preventDefault();
    try {
      await api.post("/auth/marks/add", form, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
        },
      });
      alert("Marks added successfully");
    } catch (err) {
      alert(err.response?.data?.error || "Error");
    }
  };

  return (
    <div className="marks-form-page">
      <div className="marks-form-card">
        <h2 className="form-title">Add Student Marks</h2>

        <form onSubmit={submitMarks} className="marks-form">
          <div className="form-group">
            <input
              type="text"
              name="rollNo"
              placeholder="Roll Number"
              required
              onChange={handleChange}
              onBlur={(e) => fetchStudentDetails(e.target.value)}
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
              required
              value={form.semester}
              onChange={handleChange}
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
              required
              value={form.subjectCode}
              onChange={handleChange}
            >
              <option value="">Select Subject</option>
              {subjects.map((sub) => (
                <option key={sub.subjectCode} value={sub.subjectCode}>
                  {sub.subjectCode} - {sub.subjectName}
                </option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <input
              type="number"
              name="internalMarks"
              placeholder="Internal Marks (Max 40)"
              max="40"
              required
              onChange={handleChange}
            />
          </div>

          <div className="form-group">
            <input
              type="number"
              name="externalMarks"
              placeholder="External Marks (Max 60)"
              max="60"
              required
              onChange={handleChange}
            />
          </div>

          <button type="submit" className="submit-btn">
            Save Marks
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddMarks;
