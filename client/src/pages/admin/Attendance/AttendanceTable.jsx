import { useCallback, useEffect, useState } from "react";
import api from "../../../api/api";
import "../../../css/attendance/AttendanceTable.css";
const AttendanceTable = () => {
  const [filters, setFilters] = useState({
    regulation: "",
    branch: "",
    semester: "",
    minPercentage: "",
    maxPercentage: "",
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

  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(false);
  const [studentCount, setStudentCount] = useState(0);

  const handleChange = (e) => {
    const { name, value, type } = e.target;

    setFilters({
      ...filters,
      [name]: type === "number" ? value : value.toUpperCase(), // 🔥 convert to CAPITAL letters
    });
  };

  const fetchAttendance = useCallback(async () => {
    try {
      setLoading(true);

      const response = await api.get(
        "/student/attendance/admin/attendance/semester-summary",
        { params: filters },
      );

      setStudents(response.data.students);
      setStudentCount(response.data.count);
    } catch (error) {
      console.error(error);
      alert("Failed to fetch attendance");
    } finally {
      setLoading(false);
    }
  }, [filters]); // ✅ depends on filters

  useEffect(() => {
    if (filters.regulation && filters.branch && filters.semester) {
      fetchAttendance();
    }
  }, [filters.regulation, filters.branch, filters.semester, fetchAttendance]);

  return (
    <div className="attendance-container">
      <h2>Semester Attendance Summary</h2>

      {/* 🔹 Filters */}
      <div className="attendance-filters-card">
        <select name="regulation" onChange={handleChange}>
          <option value="">Select Regulation</option>
          {regulations.map((reg, index) => (
            <option key={index} value={reg}>
              {reg}
            </option>
          ))}
        </select>

        <select name="branch" onChange={handleChange}>
          <option value="">Select Branch</option>
          {branches.map((branch, index) => (
            <option key={index} value={branch}>
              {branch}
            </option>
          ))}
        </select>

        <select name="semester" onChange={handleChange}>
          <option value="">Select Semester</option>
          {[1, 2, 3, 4, 5, 6, 7, 8].map((s) => (
            <option key={s} value={s}>
              Semester {s}
            </option>
          ))}
        </select>

        <input
          name="minPercentage"
          placeholder="Min %"
          type="number"
          min="0"
          max="100"
          className="no-spinner"
          onChange={handleChange}
        />

        <input
          name="maxPercentage"
          placeholder="Max %"
          type="number"
          min="0"
          max="100"
          className="no-spinner"
          onChange={handleChange}
        />
        {/* 
  <button onClick={fetchAttendance} className="filter-btn">
    Search
  </button> */}
        <button onClick={fetchAttendance} className="filter-btn">
          Search
        </button>

        {!loading && (
          <div className="student-count">
            <strong>Total Students:</strong> {studentCount}
          </div>
        )}
      </div>

      {/* 🔹 Table */}
      {loading ? (
        <p>Loading...</p>
      ) : (
        // <table className="attendance-table">
        //   <thead>
        //     <tr>
        //       <th>Roll No</th>
        //       <th>Name</th>
        //       <th>Total Classes</th>
        //       <th>Present Classes</th>
        //       <th>Attendance %</th>
        //     </tr>
        //   </thead>
        //   <tbody>
        //     {students.length === 0 ? (
        //       <tr>
        //         <td colSpan="5">No data found</td>
        //       </tr>
        //     ) : (
        //       students.map((student) => (
        //         <tr key={student.rollNo}>
        //           {/* 🔴 Highlight only Roll No if < 75% */}
        //           <td
        //             className={
        //               student.attendancePercentage < 75 ? "low-attendance" : ""
        //             }
        //           >
        //             {student.rollNo}
        //           </td>
        //           <td>{student.name}</td>
        //           <td>{student.totalClasses}</td>
        //           <td>{student.presentClasses}</td>
        //           <td>{student.attendancePercentage}%</td>
        //         </tr>
        //       ))
        //     )}
        //   </tbody>
        // </table>
        <div className="table-wrapper">
          <table className="attendance-table">
            <thead>
              <tr>
                <th>Roll No</th>
                <th>Name</th>
                <th>Total Classes</th>
                <th>Present Classes</th>
                <th>Attendance %</th>
              </tr>
            </thead>
            <tbody>
              {students.length === 0 ? (
                <tr>
                  <td colSpan="5">No data found</td>
                </tr>
              ) : (
                students.map((student) => (
                  <tr key={student.rollNo}>
                    <td
                      className={
                        student.attendancePercentage < 75
                          ? "low-attendance"
                          : ""
                      }
                    >
                      {student.rollNo}
                    </td>
                    <td>{student.name}</td>
                    <td>{student.totalClasses}</td>
                    <td>{student.presentClasses}</td>
                    <td>{student.attendancePercentage}%</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default AttendanceTable;
