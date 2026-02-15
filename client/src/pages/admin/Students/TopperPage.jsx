


import React, { useState, useEffect, useCallback } from "react";
// import axios from "axios";
import api from "../../../api/api";

const TopperPage = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Filters
  const [regulation, setRegulation] = useState("R20");
  const [branch, setBranch] = useState("CSE");
  const [semester, setSemester] = useState(1);
  //   const [search, setSearch] = useState("");

  // Pagination

  // 🔥 useCallback to avoid warning
  const fetchToppers = useCallback(async () => {
    try {
      setLoading(true);
      setError("");

      const res = await api.get("/topper/semester", {
        params: {
          regulation,
          branch,
          semester,
          //   search
        }
      });

      setData(res.data.data);
      setLoading(false);
    } catch (err) {
      setError(err.response?.data?.message || "Something went wrong");
      setLoading(false);
    }
  }, [regulation, branch, semester]);

  // ✔ useEffect depends on fetchToppers
  useEffect(() => {
    fetchToppers();
  }, [fetchToppers]);

  return (
    <div className="attendance-page">
      <div className="attendance-container">
        <h2>Semester Toppers</h2>

        {/* 🔍 FILTER CARD */}
        <div className="attendance-filters-card">
          <select value={regulation} onChange={(e) => setRegulation(e.target.value)}>
            {["R18", "R20", "R22", "R23", "R24","R25"].map(r => (
              <option key={r} value={r}>{r}</option>
            ))}
          </select>

          <select value={branch} onChange={(e) => setBranch(e.target.value)}>
            {["CSE", "ECE", "EEE", "MECH", "CIVIL", "IT"].map(b => (
              <option key={b} value={b}>{b}</option>
            ))}
          </select>

          <select value={semester} onChange={(e) => setSemester(e.target.value)}>
            {[1, 2, 3, 4, 5, 6, 7, 8].map(s => (
              <option key={s} value={s}>Semester {s}</option>
            ))}
          </select>

          <button className="filter-btn" onClick={fetchToppers}>
            Search
          </button>

          <div className="student-count">
            Total Toppers: <b>{data.length}</b>
          </div>
        </div>

        {/* 📋 TABLE */}
        <div className="table-wrapper">
          {loading ? (
            <p>Loading...</p>
          ) : error ? (
            <p style={{ color: "red" }}>{error}</p>
          ) : (
            <table className="attendance-table">
              <thead>
                <tr>
                  <th>Rank</th>
                  <th>Roll No</th>
                  <th>Name</th>
                  <th>CGPA</th>
                  <th>Credits</th>
                </tr>
              </thead>
              <tbody>
                {data.length === 0 ? (
                  <tr>
                    <td colSpan="5" style={{ textAlign: "center" }}>
                      No data found
                    </td>
                  </tr>
                ) : (
                  data.map((stu) => (
                    <tr key={stu.rollNo}>
                      <td>{stu.rank}</td>
                      <td>{stu.rollNo}</td>
                      <td>{stu.name}</td>
                      <td>{stu.cgpa}</td>
                      <td>{stu.totalCredits}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );

};

export default TopperPage;
