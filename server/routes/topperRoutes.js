// routes/topperRoutes.js

const express = require("express");
const router = express.Router();
const { getSemesterToppers } = require("../controllers/topperController");

router.get("/semester", getSemesterToppers);

module.exports = router;
