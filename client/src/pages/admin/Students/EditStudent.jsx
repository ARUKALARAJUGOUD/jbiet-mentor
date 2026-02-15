import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../../../api/api";
import "../../../css/student/createStudent.css";

export default function EditStudent() {
  const { id } = useParams();
  const navigate = useNavigate();

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

  const [form, setForm] = useState({
    name: "",
    rollNo: "",
    branch: "",
    regulation: "",
    year: "",
    semester: "",
    academicStatus: "ACTIVE",
  });

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  // 🔥 Fetch student & prefill
  useEffect(() => {
    api
      .get(`/admin/student/${id}`)
      .then((res) => setForm(res.data.studentInfo))
      .catch(() => setError("Failed to load student"));
  }, [id]);
  // console.log(form)
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const submit = async () => {
    setError("");
    setLoading(true);

    try {
      await api.put(`/admin/student/${id}`, form);
      alert("✅ Student Updated Successfully");
      navigate(-1);
    } catch (err) {
      setError(err.response?.data?.message || "Update failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="create-student-page">
      <div className="student-form-card">
        <h2>✏ Edit Student</h2>

        {error && <div className="form-error">{error}</div>}

        <div className="form-grid">
          <input
            name="name"
            placeholder="Enter name"
            value={form.name}
            onChange={handleChange}
          />
          <input
            name="rollNo"
            placeholder="Roll Number"
            value={form.rollNo}
            onChange={handleChange}
          />
          <select
            name="branch"
            placeholder="Select Branch"
            value={form.branch}
            onChange={handleChange}
          >
            <option value="">Branch</option>
            {branches.map((branch, index) => (
              <option key={index} value={branch}>
                {branch}
              </option>
            ))}
          </select>

          <select
            name="regulation"
            placeholder="Select Regulation"
            value={form.regulation}
            onChange={handleChange}
          >
            <option value="">Regulation</option>
            {regulations.map((reg, index) => (
              <option key={index} value={reg}>
                {reg}
              </option>
            ))}
          </select>

          <select
            name="year"
            placeholder="Year"
            value={form.year}
            onChange={handleChange}
          >
            <option value="">Year</option>
            <option value="1">1</option>
            <option value="2">2</option>
            <option value="3">3</option>
            <option value="4">4</option>
          </select>

          <select
            name="semester"
            placeholder="Semester"
            value={form.semester}
            onChange={handleChange}
          >
            <option value="">Semester</option>
            {[1, 2, 3, 4, 5, 6, 7, 8].map((s) => (
              <option key={s} value={s}>
                Semester {s}
              </option>
            ))}
          </select>

          <select
            name="academicStatus"
            placeholder="academicStatus"
            value={form.academicStatus}
            onChange={handleChange}
          >
            <option value="ACTIVE">Active</option>
            <option value="COMPLETED">Completed</option>
            <option value="DROPPED">Dropped</option>
          </select>
        </div>

        <button className="create-btn" onClick={submit} disabled={loading}>
          {loading ? "Updating..." : "💾 Update Student"}
        </button>
      </div>
    </div>
  );
}
