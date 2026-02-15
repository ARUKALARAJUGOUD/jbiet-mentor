const router = require("express").Router();
const auth = require("../middleware/authMiddleware");
const {
  getStudents,
  getFaculty,
  deleteFaculty,
  updateStudentById,
  getStudentById,
  getAcademicDashboardStats,
  getAcademicAnalyticsTable,
} = require("../controllers/adminControllers");
const authorizeRoles = require("../middleware/roleMiddleware");
const User = require("../models/User");
const { rotate } = require("pdfkit");
router.get("/students", auth, authorizeRoles("admin", "faculty"), getStudents);
// GET /admin/faculty
router.get("/faculty", auth, authorizeRoles("admin", "faculty"), getFaculty);

// to get student details by id
router.get(
  "/student/:id",
  auth,
  authorizeRoles("admin", "faculty"),
  getStudentById,
);

//update Student by id
router.put(
  "/student/:id",
  auth,
  authorizeRoles("admin", "faculty"),
  updateStudentById,
);

// //for fetch the student details to update
// router.get("/student/:id",auth,authorizeRoles("admin","faculty"), getStudentById);

//delete the faculty
// controllers/admin/facultyController.js
// const Faculty = require("../../models/Faculty");

// delete the faculty
router.delete("/faculty/:id", auth, authorizeRoles("admin"), deleteFaculty);

// admin and faculty Dashboards
router.get(
  "/getAdminDashboardAnalytics",
  auth,
  authorizeRoles("admin", "faculty"),
  getAcademicDashboardStats,
);

router.get(
  "/getAcademicAnalyticsTable",
  auth,
  authorizeRoles("admin", "faculty"),
  getAcademicAnalyticsTable,
);
module.exports = router;
