import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../../api/api.js";
import "../../../css/student/StudentsList.css";

export default function AdminStudents() {
  const [students, setStudents] = useState([]);
  const [regulation, setRegulation] = useState("");
  const [year, setYear] = useState("");
  const [branch, setBranch] = useState("");
  const [rollNo, setRollNo] = useState("");
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
  "ME"
];
const regulations = ["R18", "R20", "R22", "R23", "R24", "R25"];


  useEffect(() => {
    api
      .get("/admin/students", {
        withCredentials: true,
        params: { regulation, year, branch, rollNo },
      })
      .then((res) => setStudents(res.data.students))
      .catch(console.error);
  }, [regulation, year, branch, rollNo]);

  const openStudent = (id) => {
    // later you can navigate to academic page

    navigate(`/admin/student/${id}`); // 👈 Go to profile page
    alert("Open academic page for student: " + id);
  };

  return (
    <div className="students-page">
      <h2>👨‍🎓 Student Management</h2>
      <p className="subtitle">Filter and manage student academic records</p>

      {/* FILTER BAR */}
      <div className="filter-bar">
        <select onChange={(e) => setRegulation(e.target.value)}>
          <option value="">All Regulations</option>
           {regulations.map((reg, index) => (
      <option key={index} value={reg}>
        {reg}
      </option>
    ))}
        </select>

        <select onChange={(e) => setYear(e.target.value)}>
          <option value="">All Years</option>
          <option value="1">1st Year</option>
          <option value="2">2nd Year</option>
          <option value="3">3rd Year</option>
          <option value="4">4th Year</option>
        </select>

        <select onChange={(e) => setBranch(e.target.value)}>
          <option value="">All Branches</option>
          {branches.map((branch, index) => (
      <option key={index} value={branch}>
        {branch}
      </option>
    ))}
        </select>

        <input
          placeholder="Search by Roll No"
          onChange={(e) => setRollNo(e.target.value)}
        />
      </div>

      {/* TABLE */}
      <div className="table-wrapper">
        <table className="students-table">
          <thead>
            <tr>
              <th>Roll No</th>
              <th>Name</th>
              <th>Branch</th>
              <th>Regulation</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {students.map((s) => (
              <tr key={s._id}>
                <td data-label="Roll No">{s.rollNo}</td>
                <td data-label="Name">{s.name}</td>
                <td data-label="Branch">{s.branch}</td>
                <td data-label="Regulation">{s.regulation}</td>
                <td dat-label="Action">
                  <button onClick={() => openStudent(s._id)}>View</button>
                </td>
              </tr>
            ))}

            {students.length === 0 && (
              <tr>
                <td colSpan="5" className="no-data">
                  No students found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
