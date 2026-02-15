import { useState } from "react";
import api from "../../../api/api";
import "../../../css/student/createStudent.css";

export default function CreateStudent() {
  const [form, setForm] = useState({
    name: "",
    rollNo: "",
    password: "",
    branch: "",
    regulation: "",
    year: "",
    semester: "",
    academicStatus: "ACTIVE",
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

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const submit = async () => {
    setError("");

    // 🔍 Basic frontend validation (matches backend)
    const { name, rollNo, password, branch, regulation, year, semester } = form;

    if (
      !name ||
      !rollNo ||
      !password ||
      !branch ||
      !regulation ||
      !year ||
      !semester
    ) {
      setError("All fields are required");
      return;
    }

    try {
      setLoading(true);

      await api.post("/auth/register", {
        ...form,
        role: "student",
      });

      alert("🎉 Student Created Successfully");

      // reset form
      setForm({
        name: "",
        rollNo: "",
        password: "",
        branch: "",
        regulation: "",
        year: "",
        semester: "",
        academicStatus: "ACTIVE",
      });
    } catch (err) {
      if (err.response) {
        setError(err.response.data.message || "Registration failed");
      } else {
        setError("Something went wrong");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="create-student-page">
      <div className="student-form-card">
        <h2>🎓 Create Student Account</h2>
        <p className="subtitle">Enter student academic & login details</p>

        {error && <div className="form-error">{error}</div>}

        <div className="form-grid">
          <input
            name="name"
            placeholder="Full Name"
            value={form.name}
            onChange={handleChange}
          />

          <input
            name="rollNo"
            placeholder="Roll Number"
            value={form.rollNo}
            onChange={handleChange}
          />

          <input
            name="password"
            type="password"
            placeholder="Password"
            value={form.password}
            onChange={handleChange}
          />

          <select name="branch" value={form.branch} onChange={handleChange}>
            <option value="">Select Branch</option>
            {branches.map((branch, index) => (
              <option key={index} value={branch}>
                {branch}
              </option>
            ))}
          </select>

          <select
            name="regulation"
            value={form.regulation}
            onChange={handleChange}
          >
            <option value="">Select Regulation</option>
            {regulations.map((reg, index) => (
              <option key={index} value={reg}>
                {reg}
              </option>
            ))}
          </select>

          <select name="year" value={form.year} onChange={handleChange}>
            <option value="">Select Year</option>
            <option value="1">1st Year</option>
            <option value="2">2nd Year</option>
            <option value="3">3rd Year</option>
            <option value="4">4th Year</option>
          </select>

          {/* 🔥 NEW: Semester (REQUIRED by backend) */}
          <select name="semester" value={form.semester} onChange={handleChange}>
            <option value="">Select Semester</option>
            <option value="1">Semester 1</option>
            <option value="2">Semester 2</option>
            <option value="3">Semester 3</option>
            <option value="4">Semester 4</option>
            <option value="5">Semester 5</option>
            <option value="6">Semester 6</option>
            <option value="7">Semester 7</option>
            <option value="8">Semester 8</option>
          </select>

          <select
            name="academicStatus"
            value={form.academicStatus}
            onChange={handleChange}
          >
            <option value="ACTIVE">Active</option>
            <option value="COMPLETED">Completed</option>
            <option value="DROPPED">Dropped</option>
          </select>
        </div>

        <button className="create-btn" onClick={submit} disabled={loading}>
          {loading ? "Creating..." : "➕ Create Student"}
        </button>
      </div>
    </div>
  );
}
