import { useEffect, useState } from "react";
import api from "../../../api/api";
import "../../../css/Subjects/GetSubjects.css";
export default function AdminSubjects() {
  const [regulation, setRegulation] = useState("");
  const [branch, setBranch] = useState("");
  const [semester, setSemester] = useState("");
  const [subjects, setSubjects] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
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

  // 🟢 COMMON FETCH FUNCTION
  const fetchSubjects = async (filters = {}) => {
    try {
      setLoading(true);
      setError("");

      const res = await api.get("/subjects/getSubjects", {
        params: filters,
      });

      setSubjects(res.data.data);
    } catch (err) {
      setSubjects([]);
      setError(err.response?.data?.message || "Failed to fetch subjects");
    } finally {
      setLoading(false);
    }
  };

  // 🟢 INITIAL LOAD (WITHOUT FILTERS)
  useEffect(() => {
    fetchSubjects(); // loads default subjects
  }, []);

  // 🔁 AUTO FETCH WHEN ALL FILTERS ARE SELECTED
  useEffect(() => {
    if (regulation && branch && semester) {
      fetchSubjects({ regulation, branch, semester });
    }
  }, [regulation, branch, semester]);

  const deleteSubject = async (id) => {
    if (!window.confirm("Are you sure you want to delete this subject?"))
      return;

    try {
      await api.delete(`/subjects/delete-subject/${id}`);
      setSubjects((prev) => prev.filter((sub) => sub._id !== id));
    } catch (err) {
      alert("Failed to delete subject");
    }
  };

  return (
    <div className="subjects-page">
      <h2 className="subjects-title">📘 Manage Subjects</h2>

      {/* FILTER SECTION */}
      <div className="subjects-filter-card">
        <select
          value={regulation}
          onChange={(e) => setRegulation(e.target.value)}
        >
          <option value="">Select Regulation</option>
          {regulations.map((reg, index) => (
            <option key={index} value={reg}>
              {reg}
            </option>
          ))}
        </select>

        <select value={branch} onChange={(e) => setBranch(e.target.value)}>
          <option value="">Select Branch</option>

          {branches.map((branch, index) => (
            <option key={index} value={branch}>
              {branch}
            </option>
          ))}
        </select>

        <select value={semester} onChange={(e) => setSemester(e.target.value)}>
          <option value="">Select Semester</option>
          {[1, 2, 3, 4, 5, 6, 7, 8].map((s) => (
            <option key={s} value={s}>
              {s}
            </option>
          ))}
        </select>
      </div>

      {/* STATUS */}
      {loading && <p className="status-text">Loading subjects...</p>}
      {error && <p className="error-text">{error}</p>}

      {/* TABLE */}
      {!loading && subjects.length > 0 && (
        <div className="subjects-table-wrapper">
          <table className="subjects-table">
            <thead>
              <tr>
                <th>Subject Code</th>
                <th>Subject Name</th>
                <th>Credits</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {subjects.map((subject) => (
                <tr key={subject._id}>
                  <td>{subject.subjectCode}</td>
                  <td>{subject.subjectName}</td>
                  <td>{subject.credits}</td>
                  <td>
                    <button
                      className="delete-btn"
                      onClick={() => deleteSubject(subject._id)}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {!loading && subjects.length === 0 && (
        <p className="status-text">No subjects available</p>
      )}
    </div>
  );
}
