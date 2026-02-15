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

// //admin check out
// router.post("/admin",auth,authorizeRoles("admin"),(req,res)=>{
//   res.send({message:"successfully admin enter the page"})
// })

// to add the marks by the admin with rollNo and semester

router.post("/marks/add", auth, authorizeRoles("admin", "faculty"), MarksAdd);

router.get(
  "/getMarks/student/semester-wise/:studentId/:semester",
  auth,
  authorizeRoles("admin", "faculty", "student"),
  async (req, res) => {
    try {
      const { studentId, semester } = req.params;

      // const marks = await Marks.find({
      //   student: studentId,
      //   semester
      // }).populate("student", "name rollNo branch");

      res.json(marks);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  },
);

module.exports = router;
