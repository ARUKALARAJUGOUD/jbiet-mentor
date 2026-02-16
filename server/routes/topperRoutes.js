// routes/topperRoutes.js
const authMiddleware = require("../middleware/authMiddleware");
const roleMiddleware = require("../middleware/roleMiddleware")
const express = require("express");
const router = express.Router();
const { getSemesterToppers } = require("../controllers/topperController");

router.get("/semester",authMiddleware,roleMiddleware("student","admin","faculty"),getSemesterToppers);

module.exports = router;
