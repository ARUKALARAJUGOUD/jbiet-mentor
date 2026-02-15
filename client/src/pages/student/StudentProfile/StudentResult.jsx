import { useState } from "react";
// import "./Result.css";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import api from "../../../api/api";
import "../../../css/StudentDashboard/StudentResult.css";

export default function StudentResult() {
  const [rollNo, setRollNo] = useState("");
  const [semester, setSemester] = useState("");
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const fetchResult = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setResult(null);

    try {
      const res = await api.get(
        `/students/results/student-result/${rollNo}/${semester}`,
      );
      setResult(res.data);
    } catch (err) {
      setError("Result not found");
    } finally {
      setLoading(false);
    }
  };
  return (
    <div className="result-container">
      {/* 🔹 Search Card */}
      <div className="card result-card">
        <h3 className="card-title">Semester Result</h3>

        <form onSubmit={fetchResult} className="result-form">
          <div className="form-group">
            <label>Roll Number</label>
            <input
              type="text"
              placeholder="Enter Roll Number"
              value={rollNo}
              onChange={(e) => setRollNo(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label>Semester</label>
            <select
              value={semester}
              onChange={(e) => setSemester(e.target.value)}
              required
            >
              <option value="">Select Semester</option>
              {[1, 2, 3, 4, 5, 6, 7, 8].map((sem) => (
                <option key={sem} value={sem}>
                  Semester {sem}
                </option>
              ))}
            </select>
          </div>

          <button type="submit" className="primary-btn">
            Get Result
          </button>
        </form>

        {loading && <p className="loading">Fetching result...</p>}
        {error && <p className="error">{error}</p>}
      </div>

      {/* 🔹 Result Card */}
      {result && (
        <div className="card result-display-card">
          <ResultView result={result} semester={semester} />
        </div>
      )}
    </div>
  );
}

/* ================= RESULT VIEW ================= */

function ResultView({ result, semester }) {
  const { student, marks = [], sgpa } = result;

  /* ---------- CGPA Calculation (SAFE) ---------- */
  /* ---------- Backlogs ---------- */
  const failedSubjects = marks.filter((sub) => sub.result === "FAIL");

  /* ---------- PDF Download ---------- */
  const downloadPDF = () => {
    const doc = new jsPDF();

    doc.setFontSize(14);
    doc.text("JB INSTITUTE OF ENGINEERING & TECHNOLOGY", 14, 15);
    doc.setFontSize(10);
    doc.text(
      "(UGC Autonomous) | Accredited by NAAC,Approved by AICTE & Permanently Affiliated to JNTUH",
      14,
      22,
    );

    doc.line(14, 25, 196, 25);

    doc.text(`Name: ${student.name}`, 14, 32);
    doc.text(`Roll No: ${student.rollNo}`, 120, 32);
    doc.text(`Branch: ${student.branch}`, 14, 38);
    doc.text(`Regulation: ${student.regulation}`, 120, 38);
    doc.text(`Semester: ${semester}`, 14, 44);

    const tableData = marks.map((m) => [
      m.subjectCode,
      m.subjectName,
      m.internalMarks,
      m.externalMarks,
      m.totalMarks,
      m.grade,
      m.result,
    ]);

    autoTable(doc, {
      startY: 50,
      head: [["Code", "Subject", "Int", "Ext", "Total", "Grade", "Result"]],
      body: tableData,
      theme: "grid",
    });

    const y = doc.lastAutoTable.finalY + 10;
    doc.text(`SGPA: ${sgpa}`, 14, y);
    // doc.text(`CGPA: ${cgpa}`, 120, y);

    doc.save(`${student.rollNo}_Sem_${semester}_Result.pdf`);
  };

  return (
    <>
      {/* College Header */}
      <div className="college-header print-area">
        <div className="college-header-inner">
          <h1 className="college-name">
            JB INSTITUTE OF ENGINEERING & TECHNOLOGY
          </h1>
          <p className="college-sub">
            (UGC Autonomous) | Accredited by NAAC, Approved by AICTE &
            Permanently Affiliated to JNTUH
          </p>
        </div>
      </div>

      {/* PRINT AREA START */}
      <div className="print-area">
        {/* Student Info */}
        <div className="student-info">
          <div className="info-box">
            <span>Name</span>
            <strong>{student.name}</strong>
          </div>
          <div className="info-box">
            <span>Roll No</span>
            <strong>{student.rollNo}</strong>
          </div>
          <div className="info-box">
            <span>Branch</span>
            <strong>{student.branch}</strong>
          </div>
          <div className="info-box">
            <span>Regulation</span>
            <strong>{student.regulation}</strong>
          </div>
          <div className="info-box">
            <span>Semester</span>
            <strong>{semester}</strong>
          </div>
        </div>

        {/* Marks Table */}
        <div className="table-wrapper">
          <table className="result-table">
            <thead>
              <tr>
                <th>Code</th>
                <th>Subject</th>
                <th>Internal</th>
                <th>External</th>
                <th>Total</th>
                <th>Grade</th>
                <th>Result</th>
              </tr>
            </thead>
            <tbody>
              {marks.map((sub) => (
                <tr
                  key={sub._id}
                  className={sub.result === "FAIL" ? "fail-row" : ""}
                >
                  <td>{sub.subjectCode}</td>
                  <td>{sub.subjectName}</td>
                  <td>{sub.internalMarks}</td>
                  <td>{sub.externalMarks}</td>
                  <td>{sub.totalMarks}</td>
                  <td>{sub.grade}</td>
                  <td>{sub.result}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* SGPA & CGPA */}
        <div className="sgpa-box">
          <h3>SGPA : {sgpa}</h3>
          {/* <h3>CGPA : {cgpa}</h3> */}
        </div>

        {/* Backlogs */}
        {failedSubjects.length > 0 && (
          <div className="backlogs">
            <h3>Backlogs</h3>
            <table className="result-table">
              <thead>
                <tr>
                  <th>Subject Code</th>
                  <th>Subject Name</th>
                  <th>Grade</th>
                </tr>
              </thead>
              <tbody>
                {failedSubjects.map((sub) => (
                  <tr key={sub._id} className="fail-row">
                    <td>{sub.subjectCode}</td>
                    <td>{sub.subjectName}</td>
                    <td>{sub.grade}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
      {/* PRINT AREA END */}

      {/* Buttons (not printable) */}
      <div className="print-btn no-print">
        <button onClick={downloadPDF}>Download PDF</button>
      </div>
    </>
  );
}
