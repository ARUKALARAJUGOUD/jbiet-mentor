const express = require("express");
const router = express.Router();
const auth = require("../middleware/authMiddleware");
const authorizeRoles = require("../middleware/roleMiddleware");
const subjectController = require("../controllers/subjectControllers");
const Subject = require("../models/Subject");

/**
 * Admin / Faculty add subject
 */

router.post(
  "/add",
  auth,
  authorizeRoles("admin", "faculty"),
  subjectController.addSubject,
);

// router.put("/update-subject/:id",auth,authorizeRoles("admin","faculty"),subjectController.updateSubject)
router.delete(
  "/delete-subject/:id",
  auth,
  authorizeRoles("admin", "faculty"),
  subjectController.deleteSubject,
);
router.get(
  "/getSubjects",
  auth,
  authorizeRoles("admin", "faculty"),
  subjectController.getSubjectsByFilter,
); // for admin

router.get(
  "/results/subject-analysis",
  auth,
  authorizeRoles("admin", "faculty"),
  subjectController.getSubjectResultAnalysis,
);

router.get(
  "/marks-subjects",
  auth,
  authorizeRoles("admin", "faculty"),
  async (req, res) => {
    try {
      const { regulation, branch, semester } = req.query;

      const subjects = await Subject.find({
        regulation,
        branch,
        semester,
      })
        .select("subjectCode subjectName credits")
        .lean();

      res.status(200).json(subjects);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  },
);

router.get(
  "/results/subject-toppers",
  auth,
  authorizeRoles("admin", "faculty"),
  subjectController.getSubjectToppers,
);

module.exports = router;
