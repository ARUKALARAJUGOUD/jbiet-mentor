const User = require("../models/User"); // adjust the path if needed

// DELETE ALL STUDENTS
exports.deleteAllStudents = async (req, res) => {
  try {
    // Delete all users where role is 'student'
    const result = await User.deleteMany({ role: "student" });

    return res.status(200).json({
      success: true,
      message: `All students deleted successfully! Total deleted: ${result.deletedCount}`,
    });
  } catch (error) {
    console.error("Error deleting all students:", error);
    return res.status(500).json({
      success: false,
      message: "Server error while deleting students",
    });
  }
};

const Subject = require("../models/Subject"); // adjust path if needed

// DELETE ALL SUBJECTS
exports.deleteAllSubjects = async (req, res) => {
  try {
    // Delete all documents in Subject collection
    const result = await Subject.deleteMany({});

    return res.status(200).json({
      success: true,
      message: `All subjects deleted successfully! Total deleted: ${result.deletedCount}`,
    });
  } catch (error) {
    console.error("Error deleting all subjects:", error);
    return res.status(500).json({
      success: false,
      message: "Server error while deleting subjects",
    });
  }
};

const Marks = require("../models/Marks"); // adjust path if needed

// DELETE ALL MARKS
exports.deleteAllMarks = async (req, res) => {
  try {
    // Delete all documents in Marks collection
    const result = await Marks.deleteMany({});

    return res.status(200).json({
      success: true,
      message: `All marks deleted successfully! Total deleted: ${result.deletedCount}`,
    });
  } catch (error) {
    console.error("Error deleting all marks:", error);
    return res.status(500).json({
      success: false,
      message: "Server error while deleting marks",
    });
  }
};

const Attendance = require("../models/AttendanceSession"); // adjust path if needed

// DELETE ALL ATTENDANCE RECORDS
exports.deleteAllAttendance = async (req, res) => {
  try {
    // Delete all documents in Attendance collection
    const result = await Attendance.deleteMany({});

    return res.status(200).json({
      success: true,
      message: `All attendance records deleted successfully! Total deleted: ${result.deletedCount}`,
    });
  } catch (error) {
    console.error("Error deleting attendance records:", error);
    return res.status(500).json({
      success: false,
      message: "Server error while deleting attendance records",
    });
  }
};

// GET ALL ADMINS
exports.getAllAdmins = async (req, res) => {
  try {
    // Fetch all users where role is "admin"
    const admins = await User.find({ role: "admin" }).select(
      "-password", // exclude password field
    );

    return res.status(200).json({
      success: true,
      count: admins.length,
      admins,
    });
  } catch (error) {
    console.error("Error fetching admins:", error);
    return res.status(500).json({
      success: false,
      message: "Server error while fetching admins",
    });
  }
};

// GET ALL ADMINS
exports.getAllFaculty = async (req, res) => {
  try {
    // Fetch all users where role is "admin"
    const admins = await User.find({ role: "faculty" }).select(
      "-password", // exclude password field
    );

    return res.status(200).json({
      success: true,
      count: admins.length,
      admins,
    });
  } catch (error) {
    console.error("Error fetching faculty:", error);
    return res.status(500).json({
      success: false,
      message: "Server error while fetching faculty",
    });
  }
};
