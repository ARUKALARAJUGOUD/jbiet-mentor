const router = require("express").Router();
const auth = require("../middleware/authMiddleware");

const authorizeRoles = require("../middleware/roleMiddleware");

const Marks = require("../models/Marks");
const User = require("../models/User");
const {
  login,
  refresh,
  logout,
  dashboard,
  register,
  deleteSubject,
  MarksAdd,
} = require("../controllers/authController");
const calculateGrade = require("../utils/calculateGrade");
router.post("/register", register);

router.post("/login", login);
router.get("/refresh", refresh);
router.post("/logout", logout);
router.get("/dashboard", auth, dashboard);

const Subject = require("../models/Subject");

// to add the marks by the admin with rollNo and semester

router.post("/marks/add", auth, authorizeRoles("admin", "faculty"), MarksAdd);

// GET /auth/student/basic/:rollNo
router.get(
  "/student/basic/:rollNo",
  auth,
  authorizeRoles("admin", "faculty", "student"),
  async (req, res) => {
    try {
      const { rollNo } = req.params;

      // 🔹 Find student by rollNo (trim & uppercase to match DB)
      const student = await User.findOne({
        rollNo: rollNo.trim().toUpperCase(),
        role: "student",
      }).lean();

      if (!student) {
        return res.status(404).json({ message: "Student not found" });
      }

      // 🔹 Return only required fields
      res.json({
        name: student.name,
        rollNo: student.rollNo,
        regulation: student.regulation,
        branch: student.branch,
        semester: student.semester,
        year: student.year,
        academicStatus: student.academicStatus,
      });
    } catch (err) {
      console.error("Error fetching student:", err);
      res.status(500).json({ error: "Server error" });
    }
  },
);

router.get(
  "/getMarks/student/semester-wise/:studentId/:semester",
  auth,
  authorizeRoles("admin", "faculty", "student"),
  async (req, res) => {
    try {
      const { studentId, semester } = req.params;

      const marks = await Marks.find({
        student: studentId,
        semester,
      }).populate("student", "name rollNo branch");

      res.json(marks);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  },
);

module.exports = router;
