
import { useState } from "react";
import api from "../../../api/api";
import "../../../css/faculty/CreateFaculty.css"
export default function CreateFaculty() {
  const [form, setForm] = useState({
    name: "",
    facultyId: "",
    password: "",
    email: "",
    phone: "",
    department: "",
    designation: ""
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
  "ME"
];

  const [error, setError] = useState("");

  const handleChange = e => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const submit = async () => {
    try {
      await api.post("/auth/register", {
        ...form,
        role: "faculty"
      });

      alert("Faculty Created Successfully");
      setForm({
        name: "",
        facultyId: "",
        password: "",
        email: "",
        phone: "",
        department: "",
        designation: ""
      });
    } catch (err) {
      if (err.response) {
        setError(err.response.data.message);
        alert(err.response.data.message);
      } else {
        alert("Something went wrong");
      }
    }
  };

  return (
    <div className="faculty-form-page">
      <div className="faculty-form-card">
        <h2 className="form-title">Create Faculty</h2>

        <div className="form-group">
          <input
            name="name"
            placeholder="Faculty Name"
            value={form.name}
            onChange={handleChange}
          />
        </div>

        <div className="form-group">
          <input
            name="facultyId"
            placeholder="Faculty ID"
            value={form.facultyId}
            onChange={handleChange}
          />
        </div>

        <div className="form-group">
          <input
            name="email"
            placeholder="Email"
            value={form.email}
            onChange={handleChange}
          />
        </div>

        <div className="form-group">
          <input
            name="phone"
            placeholder="Phone Number"
            value={form.phone}
            onChange={handleChange}
          />
        </div>

        <div className="form-group">
          <select
            name="department"
            value={form.department}
            onChange={handleChange}
          >
            <option value="">Select Department</option>
             {branches.map((branch, index) => (
      <option key={index} value={branch}>
        {branch}
      </option>
    ))}
          </select>
        </div>

        <div className="form-group">
          <select
            name="designation"
            value={form.designation}
            onChange={handleChange}
          >
            <option value="">Select Designation</option>
            <option value="Professor">Professor</option>
            <option value="Associate Professor">Associate Professor</option>
            <option value="Assistant Professor">Assistant Professor</option>
            <option value="Lecturer">Lecturer</option>
          </select>
        </div>

        <div className="form-group">
          <input
            name="password"
            type="password"
            placeholder="Password"
            value={form.password}
            onChange={handleChange}
          />
        </div>

        {error && <p className="form-error">{error}</p>}

        <button className="submit-btn" onClick={submit}>
          Create Faculty
        </button>
      </div>
    </div>
  );

}
