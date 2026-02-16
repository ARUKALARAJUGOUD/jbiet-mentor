const express = require("express");
const router = express.Router();
const {
  deleteAllStudents,
  deleteAllSubjects,
  deleteAllMarks,
  deleteAllAttendance,
  getAllAdmins,
  getAllFaculty,
} = require("../controllers/DeleteControllers");
const auth = require("../middleware/authMiddleware");
const authorizeRoles = require("../middleware/roleMiddleware");

// Only admin can delete all students
router.delete("/students", auth, authorizeRoles("admin"), deleteAllStudents);
router.delete("/subjects", auth, authorizeRoles("admin"), deleteAllSubjects);
router.delete("/marks", auth, authorizeRoles("admin"), deleteAllMarks);
router.delete(
  "/attendance",
  auth,
  authorizeRoles("admin"),
  deleteAllAttendance,
);
router.get("/getAllAdmins", auth, authorizeRoles("admin"), getAllAdmins);
router.get("/getAllFaculty", auth, authorizeRoles("admin"), getAllFaculty);
module.exports = router;
