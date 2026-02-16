import { saveAs } from "file-saver";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { useCallback, useEffect, useState } from "react";
import * as XLSX from "xlsx";
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
  //  download the attendance as pdf and xlxs
  const downloadPDF = () => {
    if (students.length === 0) {
      alert("No data to export");
      return;
    }

    const doc = new jsPDF();

    const currentDate = new Date().toLocaleString();

    // 🔹 Title
    doc.setFontSize(16);
    doc.text("STUDENT ATTENDANCE REPORT", 14, 15);

    // 🔹 Filters Info
    doc.setFontSize(11);
    doc.text(
      `Regulation: ${filters.regulation}   |   Branch: ${filters.branch}   |   Semester: ${filters.semester}`,
      14,
      25,
    );

    doc.text(
      `Min %: ${filters.minPercentage || "0"}   |   Max %: ${filters.maxPercentage || "100"}`,
      14,
      32,
    );

    doc.text(`Total Students: ${studentCount}`, 14, 39);

    doc.text(`Generated On: ${currentDate}`, 14, 46);

    // 🔹 Table Data
    const tableColumn = [
      "Roll No",
      "Name",
      "Total Classes",
      "Present Classes",
      "Attendance %",
    ];

    const tableRows = students.map((student) => [
      student.rollNo,
      student.name,
      student.totalClasses,
      student.presentClasses,
      student.attendancePercentage + "%",
    ]);

    autoTable(doc, {
      head: [tableColumn],
      body: tableRows,
      startY: 55,
      styles: { fontSize: 9 },
      headStyles: { fillColor: [22, 160, 133] },
    });

    doc.save(`Attendance_${filters.branch}_Sem${filters.semester}.pdf`);
  };

  const downloadExcel = () => {
    if (students.length === 0) {
      alert("No data to export");
      return;
    }

    const worksheetData = students.map((student) => ({
      "Roll No": student.rollNo,
      Name: student.name,
      "Total Classes": student.totalClasses,
      "Present Classes": student.presentClasses,
      "Attendance %": student.attendancePercentage,
    }));

    const worksheet = XLSX.utils.json_to_sheet(worksheetData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Attendance");

    const excelBuffer = XLSX.write(workbook, {
      bookType: "xlsx",
      type: "array",
    });

    const data = new Blob([excelBuffer], { type: "application/octet-stream" });

    saveAs(data, "Attendance_Summary.xlsx");
  };

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

        {/* <button onClick={fetchAttendance} className="filter-btn">
          Search
        </button> */}

        <button onClick={fetchAttendance} className="filter-btn">
          Search
        </button>

        <button onClick={downloadPDF} className="download-btn">
          PDF
        </button>

        <button onClick={downloadExcel} className="download-btn">
          Excel
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
