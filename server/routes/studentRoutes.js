const express = require("express");
const router = express.Router();
const User = require("../models/User");
const Marks = require("../models/Marks");
const {
  getStudentWithCurrentSubjects,
  getCurrentSemesterAttendance,
  getAcademicSummary,
  getStudentResult,
  getSemesterWiseResult,
  getSemesterMarks,
  getStudentAttendanceReport,
  getAttendanceByRollNo,
} = require("../controllers/studentController");
const authMiddleware = require("../middleware/authMiddleware");
const roleMiddleware = require("../middleware/roleMiddleware");

router.get(
  "/:rollNo/subjects",
  authMiddleware,
  roleMiddleware("student", "admin", "faculty"),
  getStudentWithCurrentSubjects,
);
router.get(
  "/:rollNo/attendance/current",
  authMiddleware,
  roleMiddleware("student", "admin", "faculty"),
  getCurrentSemesterAttendance,
);

router.get(
  "/results/student-result/:rollNo/:semester",
  authMiddleware,
  roleMiddleware("student", "admin", "faculty"),
  getStudentResult,
);

//student dashboard

// router.get("/:rollNo/semesters", getSemesterWiseResult);
router.get(
  "/academics/:rollNo/semester/:semester",
  authMiddleware,
  roleMiddleware("student", "admin", "faculty"),
  getSemesterMarks,
);

//fetching the semester wise performance of a student
router.get(
  "/academics/:rollNo/summary",
  authMiddleware,
  roleMiddleware("student", "admin", "faculty"),
  async (req, res) => {
    try {
      const { rollNo } = req.params;

      const student = await User.findOne({
        rollNo: rollNo.toUpperCase(),
        role: "student",
      }).lean();

      if (!student) {
        return res.status(404).json({ message: "Student not found" });
      }

      const marks = await Marks.find({ student: student._id })
        .sort({
          semester: 1,
        })
        .lean();

      const semesterMap = {};

      let overallTotalCredits = 0;
      let overallCreditsSecured = 0;
      let cgpaCredits = 0;
      let cgpaPoints = 0;

      marks.forEach((m) => {
        if (!semesterMap[m.semester]) {
          semesterMap[m.semester] = {
            semester: m.semester,
            totalCredits: 0,
            creditsSecured: 0,
            totalGradePoints: 0,
          };
        }

        const effectiveGradePoint = m.grade === "F" ? 0 : m.gradePoint;

        // semester level
        semesterMap[m.semester].totalCredits += m.credits;
        semesterMap[m.semester].totalGradePoints +=
          m.credits * effectiveGradePoint;

        // overall level
        overallTotalCredits += m.credits;
        cgpaCredits += m.credits;
        cgpaPoints += m.credits * effectiveGradePoint;

        if (m.grade !== "F") {
          semesterMap[m.semester].creditsSecured += m.credits;
          overallCreditsSecured += m.credits;
        }
      });

      let cumulativeCredits = 0;
      let cumulativeGradePoints = 0;

      const semesters = Object.values(semesterMap)
        .sort((a, b) => a.semester - b.semester)
        .map((s) => {
          cumulativeCredits += s.totalCredits;
          cumulativeGradePoints += s.totalGradePoints;

          const sgpa =
            s.totalCredits === 0
              ? 0
              : Number((s.totalGradePoints / s.totalCredits).toFixed(2));

          const cgpaTillSemester =
            cumulativeCredits === 0
              ? 0
              : Number((cumulativeGradePoints / cumulativeCredits).toFixed(2));

          return {
            semester: s.semester,
            sgpa,
            cgpa: cgpaTillSemester, // 👈 NEW FIELD
            totalCredits: s.totalCredits,
            creditsSecured: s.creditsSecured,
            hasBacklogs: s.creditsSecured < s.totalCredits,
          };
        });

      const cgpa =
        cgpaCredits === 0 ? 0 : Number((cgpaPoints / cgpaCredits).toFixed(2));

      res.json({
        student: {
          name: student.name,
          rollNo: student.rollNo,
          branch: student.branch,
          regulation: student.regulation,
        },
        semesters,
        overall: {
          totalCredits: overallTotalCredits,
          creditsSecured: overallCreditsSecured,
        },
        cgpa,
      });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  },
);

//get attendence report of a student
router.get(
  "/getAttendencereport/:rollNo",
  authMiddleware,
  roleMiddleware("student", "admin", "faculty"),
  getStudentAttendanceReport,
);

//fetching the backlogs data of a student through the semester wise
router.get(
  "/academics/:rollNo/backlogs",
  authMiddleware,
  roleMiddleware("student", "admin", "faculty"),
  async (req, res) => {
    try {
      const { rollNo } = req.params;

      const student = await User.findOne({
        rollNo: rollNo.toUpperCase(),
        role: "student",
      }).lean();

      if (!student) {
        return res.status(404).json({ message: "Student not found" });
      }

      const backlogs = await Marks.find({
        student: student._id,
        grade: "F",
      })
        .sort({ semester: 1 })
        .lean();

      const semesterWiseBacklogs = {};

      let totalBacklogs = 0;
      let backlogCredits = 0;

      backlogs.forEach((b) => {
        totalBacklogs += 1;
        backlogCredits += b.credits;

        if (!semesterWiseBacklogs[b.semester]) {
          semesterWiseBacklogs[b.semester] = [];
        }

        semesterWiseBacklogs[b.semester].push({
          subjectCode: b.subjectCode,
          subjectName: b.subjectName,
          credits: b.credits,
          internalMarks: b.internalMarks,
          externalMarks: b.externalMarks,
          totalMarks: b.totalMarks,
        });
      });

      res.json({
        rollNo: student.rollNo,
        name: student.name,
        overall: {
          totalBacklogs,
          backlogCredits,
        },
        backlogs: semesterWiseBacklogs,
      });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  },
);

// fetching the day wise attendence of  a student
// ✅ Student attendance (roll no based)
router.get(
  "/getDayWiseAttendence/:rollNo",
  authMiddleware,
  roleMiddleware("student", "admin", "faculty"),
  getAttendanceByRollNo,
);

module.exports = router;
