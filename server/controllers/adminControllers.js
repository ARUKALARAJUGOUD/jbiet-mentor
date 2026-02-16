// const User = require("../models/User");
const User = require("../models/User");
const Marks = require("../models/Marks");
const Subject = require("../models/Subject");
const mongoose = require("mongoose");

exports.getStudents = async (req, res) => {
  try {
    let { regulation, year, branch, rollNo, page = 1, limit = 20 } = req.query;

    page = Number(page);
    limit = Number(limit);

    const query = { role: "student" };

    if (regulation) query.regulation = regulation;
    if (year) query.year = Number(year);
    if (branch) query.branch = branch;

    // ⚡ Optimized rollNo search (prefix only)
    if (rollNo) {
      query.rollNo = { $regex: "^" + rollNo.toUpperCase() };
    }

    // 🔥 Run find + count in parallel
    const [students, total] = await Promise.all([
      User.find(query)
        .select("name rollNo branch regulation year")
        .sort({ rollNo: 1 })
        .skip((page - 1) * limit)
        .limit(limit)
        .lean(),

      User.countDocuments(query),
    ]);

    res.json({
      success: true,
      total,
      page,
      pages: Math.ceil(total / limit),
      students,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getStudentById = async (req, res) => {
  try {
    const { id } = req.params;

    let query = { role: "student" };

    // ✅ Faster ObjectId validation
    if (mongoose.Types.ObjectId.isValid(id)) {
      query._id = id;
    } else {
      query.rollNo = id.toUpperCase();
    }

    const student = await User.findOne(query).select(
      "name rollNo branch regulation year semester email",
    ); // select only needed fields

    if (!student) {
      return res.status(404).json({
        success: false,
        message: "Student not found",
      });
    }

    res.status(200).json({
      success: true,
      studentInfo: student,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

exports.getFaculty = async (req, res) => {
  try {
    const { search } = req.query;

    const query = { role: "faculty" };

    if (search) {
      query.name = new RegExp(search, "i");
    }

    const faculty = await User.find(query)
      // // .select("name rollNo facultyId")
      .sort({ name: 1 })
      .lean();

    res.json(faculty);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

//delete the faculty
exports.deleteFaculty = async (req, res) => {
  try {
    const { id } = req.params;

    // Validate MongoDB ObjectId
    if (!id) {
      return res.status(400).json({ message: "Faculty ID is required" });
    }

    const faculty = await User.findById(id).lean();

    if (!faculty) {
      return res.status(404).json({ message: "Faculty not found" });
    }

    await User.findByIdAndDelete(id);

    return res.status(200).json({
      message: "Faculty deleted successfully",
      deletedFaculty: {
        id: faculty._id,
        name: faculty.name,
        facultyId: faculty.facultyId,
      },
    });
  } catch (error) {
    console.error("Delete Faculty Error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

//update the student
exports.updateStudentById = async (req, res) => {
  try {
    const allowedFields = [
      "name",
      "rollNo",
      "email",
      "phone",
      "branch",
      "regulation",
      "year",
      "semester",
      "academicStatus",
    ];

    const updateData = {};

    allowedFields.forEach((field) => {
      if (req.body[field] !== undefined) {
        updateData[field] = req.body[field];
      }
    });

    const student = await User.findOneAndUpdate(
      { _id: req.params.id, role: "student" },
      updateData,
      { new: true, runValidators: true },
    ).select("-password");

    if (!student) {
      return res.status(404).json({ message: "Student not found" });
    }

    res.json({
      message: "Student updated successfully",
      student,
    });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// admin dashboard like total students are enrolled  faculty , total subjects , total pass percentage

exports.getAcademicDashboardStats = async (req, res) => {
  try {
    const [totalStudents, totalFaculty, totalSubjects, passStats] =
      await Promise.all([
        User.countDocuments({
          role: "student",
          academicStatus: "ACTIVE",
        }),
        User.countDocuments({ role: "faculty" }),
        Subject.countDocuments(),
        Marks.aggregate([
          {
            $group: {
              _id: "$result",
              count: { $sum: 1 },
            },
          },
        ]),
      ]);

    let totalResults = 0;
    let passedResults = 0;

    passStats.forEach((stat) => {
      totalResults += stat.count;
      if (stat._id === "PASS") {
        passedResults = stat.count;
      }
    });

    const passPercentage =
      totalResults === 0
        ? 0
        : Number(((passedResults / totalResults) * 100).toFixed(2));

    res.status(200).json({
      success: true,
      data: {
        totalStudents,
        totalFaculty,
        totalSubjects,
        passPercentage,
      },
    });
  } catch (error) {
    console.error("Dashboard Stats Error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch academic statistics",
    });
  }
};

// fetching the data for the admin dashboard like regulation + branch + semester wise fillteration of a students

// ===== Helper function =====
function buildStudentMatch({ regulation, branch, semester }) {
  const match = {
    role: "student",
    academicStatus: "ACTIVE",
  };

  if (regulation) match.regulation = regulation;
  if (branch) match.branch = branch;
  if (semester) match.semester = Number(semester);

  return match;
}
exports.getAcademicAnalyticsTable = async (req, res) => {
  try {
    const { regulation, branch, semester } = req.query;

    const studentMatch = buildStudentMatch({
      regulation,
      branch,
      semester,
    });

    const data = await User.aggregate([
      // 1️⃣ Filter students
      { $match: studentMatch },

      // 2️⃣ Join Marks
      {
        $lookup: {
          from: "marks",
          localField: "_id",
          foreignField: "student",
          as: "marks",
        },
      },

      // 3️⃣ Join Attendance
      {
        $lookup: {
          from: "attendances",
          localField: "_id",
          foreignField: "student",
          as: "attendance",
        },
      },

      // 4️⃣ Flatten for calculations
      {
        $project: {
          regulation: 1,
          branch: 1,
          semester: 1,

          passCount: {
            $size: {
              $filter: {
                input: "$marks",
                as: "m",
                cond: { $eq: ["$$m.result", "PASS"] },
              },
            },
          },

          totalMarks: { $size: "$marks" },

          presentCount: {
            $size: {
              $filter: {
                input: "$attendance",
                as: "a",
                cond: { $eq: ["$$a.status", "PRESENT"] },
              },
            },
          },

          totalAttendance: { $size: "$attendance" },
        },
      },

      // 5️⃣ Group for table rows
      {
        $group: {
          _id: {
            regulation: "$regulation",
            branch: "$branch",
            semester: "$semester",
          },
          passCount: { $sum: "$passCount" },
          totalMarks: { $sum: "$totalMarks" },
          presentCount: { $sum: "$presentCount" },
          totalAttendance: { $sum: "$totalAttendance" },
        },
      },

      // 6️⃣ Compute percentages
      {
        $project: {
          _id: 0,
          regulation: "$_id.regulation",
          branch: "$_id.branch",
          semester: "$_id.semester",

          avgPassPercentage: {
            $cond: [
              { $eq: ["$totalMarks", 0] },
              0,
              {
                $round: [
                  {
                    $multiply: [
                      { $divide: ["$passCount", "$totalMarks"] },
                      100,
                    ],
                  },
                  2,
                ],
              },
            ],
          },

          avgAttendancePercentage: {
            $cond: [
              { $eq: ["$totalAttendance", 0] },
              0,
              {
                $round: [
                  {
                    $multiply: [
                      {
                        $divide: ["$presentCount", "$totalAttendance"],
                      },
                      100,
                    ],
                  },
                  2,
                ],
              },
            ],
          },
        },
      },

      // 7️⃣ Sort for clean tables
      {
        $sort: {
          regulation: 1,
          branch: 1,
          semester: 1,
        },
      },
    ]);

    res.status(200).json({
      success: true,
      count: data.length,
      data,
    });
  } catch (err) {
    console.error("Academic Analytics Error:", err);
    res.status(500).json({
      success: false,
      message: "Failed to fetch academic analytics",
    });
  }
};
