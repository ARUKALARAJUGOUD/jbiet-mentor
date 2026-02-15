// controllers/topperController.js

const User = require("../models/User");
const Marks = require("../models/Marks");

// Semester Topper API
exports.getSemesterToppers = async (req, res) => {
  try {
    const { regulation, branch, semester, limit = 15} = req.query;

    // Validate required params
    if (!regulation || !branch || !semester) {
      return res.status(400).json({
        success: false,
        message: "Please provide regulation, branch and semester"
      });
    }

    // 1) Filter students
    const students = await User.aggregate([
      {
        $match: {
          role: "student",
          regulation,
          branch,
          semester: Number(semester),
          academicStatus: "ACTIVE"
        }
      },

      // 2) Join Marks
      {
        $lookup: {
          from: "marks",
          localField: "_id",
          foreignField: "student",
          as: "marks"
        }
      },

      // 3) Only consider current semester marks
      {
        $addFields: {
          marks: {
            $filter: {
              input: "$marks",
              as: "m",
              cond: { $eq: ["$$m.semester", Number(semester)] }
            }
          }
        }
      },

      // 4) Remove students without marks
      {
        $match: {
          "marks.0": { $exists: true }
        }
      },

      // 5) Calculate CGPA
      {
        $addFields: {
          totalCredits: { $sum: "$marks.credits" },
          weightedGradePoints: {
            $sum: {
              $map: {
                input: "$marks",
                as: "m",
                in: { $multiply: ["$$m.gradePoint", "$$m.credits"] }
              }
            }
          }
        }
      },

      {
        $addFields: {
          cgpa: {
            $divide: ["$weightedGradePoints", "$totalCredits"]
          }
        }
      },

      // 6) Sort by CGPA desc
      {
        $sort: { cgpa: -1 }
      },

      // 7) Project final fields
      {
        $project: {
          _id: 0,
          rollNo: 1,
          name: 1,
          regulation: 1,
          branch: 1,
          semester: 1,
          cgpa: { $round: ["$cgpa", 2] },
          totalCredits: 1
        }
      }
    ]);

    // 8) Add Rank
    const rankedStudents = students.map((s, index) => ({
      rank: index + 1,
      ...s
    }));

    res.status(200).json({
      success: true,
      count: rankedStudents.length,
      data: rankedStudents.slice(0, Number(limit))
    });

  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message
    });
  }
};
