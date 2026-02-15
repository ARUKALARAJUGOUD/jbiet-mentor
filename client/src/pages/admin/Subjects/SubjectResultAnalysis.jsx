import { useCallback, useEffect, useState } from "react";
import api from "../../../api/api";

export default function SubjectResultAnalysis() {
  const [filters, setFilters] = useState({
    regulation: "",
    branch: "",
    semester: "",
    subjectCode: "", // ✅ FILTER BY CODE
    result: "",
  });

  const [subjects, setSubjects] = useState([]);
  const [students, setStudents] = useState([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);
  const [toppers, setToppers] = useState([]);

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
    setFilters((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  //fetching the subject toppers
  const fetchSubjectToppers = useCallback(async () => {
    if (
      !filters.subjectCode ||
      !filters.regulation ||
      !filters.branch ||
      !filters.semester
    )
      return;

    try {
      const res = await api.get("/subjects/results/subject-toppers", {
        params: {
          regulation: filters.regulation,
          branch: filters.branch,
          semester: filters.semester,
          subjectCode: filters.subjectCode,
          limit: 3,
        },
      });
      console.log("Toppers response:", res.data);

      console.log("Fetching toppers with:", {
        regulation: filters.regulation,
        branch: filters.branch,
        semester: filters.semester,
        subjectCode: filters.subjectCode,
      });

      setToppers(res.data.toppers);
    } catch (err) {
      console.error("Error fetching toppers", err);
    }
  }, [
    filters.subjectCode,
    filters.regulation,
    filters.branch,
    filters.semester,
  ]);

  /* 🔁 LOAD SUBJECTS */
  useEffect(() => {
    const fetchSubjects = async () => {
      if (!filters.regulation || !filters.branch || !filters.semester) {
        setSubjects([]);
        setFilters((prev) => ({ ...prev, subjectCode: "" }));
        return;
      }

      try {
        const res = await api.get("/subjects/marks-subjects", {
          params: {
            regulation: filters.regulation,
            branch: filters.branch,
            semester: filters.semester,
          },
        });
        setSubjects(res.data);
      } catch (err) {
        console.error(err);
      }
    };

    fetchSubjects();
  }, [filters.regulation, filters.branch, filters.semester]);

  /* 🔍 SEARCH */
  const handleSearch = async () => {
    try {
      setLoading(true);

      const res = await api.get("/subjects/results/subject-analysis", {
        params: {
          regulation: filters.regulation,
          branch: filters.branch,
          semester: filters.semester,
          subjectCode: filters.subjectCode, // ✅ IMPORTANT
          result: filters.result,
        },
      });

      setStudents(res.data.students);
      setTotal(res.data.totalStudents);

      // ✅ FETCH TOPPERS ONLY AFTER SEARCH
      if (filters.result === "PASS") {
        await fetchSubjectToppers();
      } else {
        setToppers([]);
      }
    } catch (err) {
      alert(err.response?.data?.message || "Server error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="attendance-page">
      <div className="attendance-container">
        <h2>Subject Result Analysis</h2>

        {/* 🔍 FILTER CARD */}
        <div className="attendance-filters-card">
          <select
            name="regulation"
            value={filters.regulation}
            onChange={handleChange}
          >
            <option value="">Regulation</option>
            {regulations.map((reg, index) => (
              <option key={index} value={reg}>
                {reg}
              </option>
            ))}
          </select>

          <select name="branch" value={filters.branch} onChange={handleChange}>
            <option value="">Branch</option>
            {branches.map((branch, index) => (
              <option key={index} value={branch}>
                {branch}
              </option>
            ))}
          </select>

          <select
            name="semester"
            value={filters.semester}
            onChange={handleChange}
          >
            <option value="">Semester</option>
            {[1, 2, 3, 4, 5, 6, 7, 8].map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>

          <select
            name="subjectCode"
            value={filters.subjectCode}
            onChange={handleChange}
            disabled={subjects.length === 0}
          >
            <option value="">Select Subject</option>
            {subjects.map((sub) => (
              <option key={sub.subjectCode} value={sub.subjectCode}>
                {sub.subjectCode} - {sub.subjectName}
              </option>
            ))}
          </select>

          <select name="result" value={filters.result} onChange={handleChange}>
            <option value="">Result</option>
            <option value="PASS">PASS</option>
            <option value="FAIL">FAIL</option>
          </select>

          <button className="filter-btn" onClick={handleSearch}>
            Search
          </button>

          <div className="student-count">
            Total Students: <b>{total}</b>
          </div>
        </div>

        {/* 🏆 TOPPERS TABLE */}
        {toppers.length > 0 && (
          <>
            <h3 style={{ marginBottom: "10px" }}>🏆 Subject Toppers</h3>
            <div className="table-wrapper">
              <table className="attendance-table">
                <thead>
                  <tr>
                    <th>Rank</th>
                    <th>Roll No</th>
                    <th>Name</th>
                    <th>Total Marks</th>
                    <th>Grade</th>
                  </tr>
                </thead>
                <tbody>
                  {toppers.map((t, i) => (
                    <tr key={i}>
                      <td>{i + 1}</td>
                      <td>{t.rollNo}</td>
                      <td>{t.name}</td>
                      <td>{t.totalMarks}</td>
                      <td>{t.grade}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        )}

        {/* 📋 STUDENT RESULTS TABLE */}
        <div className="table-wrapper" style={{ marginTop: "20px" }}>
          {loading ? (
            <p>Loading...</p>
          ) : (
            <table className="attendance-table">
              <thead>
                <tr>
                  <th>Roll No</th>
                  <th>Name</th>
                  <th>Subject</th>
                  <th>Total Marks</th>
                  <th>Grade</th>
                  <th>Result</th>
                </tr>
              </thead>
              <tbody>
                {students.length === 0 ? (
                  <tr>
                    <td colSpan="6" style={{ textAlign: "center" }}>
                      No data found
                    </td>
                  </tr>
                ) : (
                  students.map((stu, i) => (
                    <tr key={i}>
                      <td>{stu.rollNo}</td>
                      <td>{stu.name}</td>
                      <td>{stu.subjectName}</td>
                      <td>{stu.totalMarks}</td>
                      <td>{stu.grade}</td>
                      <td
                        className={
                          stu.result === "FAIL" ? "low-attendance" : ""
                        }
                      >
                        {stu.result}
                      </td>
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
}
