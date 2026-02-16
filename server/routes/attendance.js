const router = require("express").Router();
const AttendanceController = require("../controllers/AttendanceController");
const authorizeRoles = require("../middleware/roleMiddleware");
const authMiddleware = require("../middleware/authMiddleware");
const AttendanceSession = require("../models/AttendanceSession");

const User = require("../models/User");

router.get(
  "/admin/attendance/semester-summary",
  authMiddleware,
  authorizeRoles("student", "admin", "faculty"),
  AttendanceController.getSemesterAttendanceSummary,
);

// to get attendance of a student in particular subject from previous date
router.get(
  "/student/present-classes",
  AttendanceController.getStudentPresentClasses,
);

router.post(
  "/add",
  authMiddleware,
  authorizeRoles("admin", "faculty"),
  AttendanceController.addAttendence,
);

//Get Attendance by Student (Admin View)
router.get(
  "/:studentId",
  authMiddleware,
  authorizeRoles("admin", "faculty"),
  AttendanceController.getAttendenceStudentId,
);

module.exports = router;
