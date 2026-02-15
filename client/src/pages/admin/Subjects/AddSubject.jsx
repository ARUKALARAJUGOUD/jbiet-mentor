import { useState } from "react";
import api from "../../../api/api";
import "../../../css/Subjects/AddSubject.css";
export default function AddSubject() {
  const [formData, setFormData] = useState({
    subjectCode: "",
    subjectName: "",
    regulation: "",
    branch: "",
    semester: "",
    credits: "",
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

  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    setError("");
    setLoading(true);

    try {
      const res = await api.post("/subjects/add", formData);
      setMessage(res.data.message);

      setFormData({
        subjectCode: "",
        subjectName: "",
        regulation: "",
        branch: "",
        semester: "",
        credits: "",
      });
    } catch (err) {
      setError(err.response?.data?.message || "Server error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="subject-form-page">
      <div className="subject-form-card">
        <h2 className="form-title">Add Subject</h2>

        {message && <p className="form-success">{message}</p>}
        {error && <p className="form-error">{error}</p>}

        <form onSubmit={handleSubmit} className="subject-form">
          <div className="form-group">
            <input
              type="text"
              name="subjectCode"
              placeholder="Subject Code"
              value={formData.subjectCode}
              onChange={handleChange}
            />
          </div>

          <div className="form-group">
            <input
              type="text"
              name="subjectName"
              placeholder="Subject Name"
              value={formData.subjectName}
              onChange={handleChange}
            />
          </div>

          <div className="form-group">
            <select
              name="regulation"
              value={formData.regulation}
              onChange={handleChange}
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
              value={formData.branch}
              onChange={handleChange}
            >
              <option value="">Select Branch</option>
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
              value={formData.semester}
              onChange={handleChange}
            >
              <option value="">Select Semester</option>
              {[1, 2, 3, 4, 5, 6, 7, 8].map((sem) => (
                <option key={sem} value={sem}>
                  Semester {sem}
                </option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <select
              name="credits"
              value={formData.credits}
              onChange={handleChange}
            >
              <option value="">Select Credits</option>
              <option value="1">1</option>
              <option value="2">2</option>
              <option value="3">3</option>
              <option value="4">4</option>
              <option value="4">5</option>
              <option value="4">6</option>
            </select>
          </div>

          <button type="submit" className="submit-btn" disabled={loading}>
            {loading ? "Adding..." : "Add Subject"}
          </button>
        </form>
      </div>
    </div>
  );
}
