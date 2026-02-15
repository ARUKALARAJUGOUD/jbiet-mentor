const User = require("../models/User");
const Subject = require("../models/Subject");
const Attendance = require("../models/AttendanceSession")
const Marks = require("../models/Marks")
exports.getStudentWithCurrentSubjects = async (req, res) => {
  try {
    const { rollNo } = req.params;

    // 1️⃣ Find student
    const student = await User.findOne({
      rollNo: rollNo.toUpperCase(),
      role: "student"
    }).select("-password");

    if (!student) {
      return res.status(404).json({
        success: false,
        message: "Student not found"
      });
    }

    // 2️⃣ Extract required academic details
    const { regulation, branch, semester } = student;

    // 3️⃣ Fetch subjects for current semester
    const subjects = await Subject.find({
      regulation,
      branch,
      semester
    }).sort({ subjectCode: 1 });

    // 4️⃣ Final response
    res.status(200).json({
      success: true,
      student: {
        name: student.name,
        rollNo: student.rollNo,
        branch: student.branch,
        regulation: student.regulation,
        year: student.year,
        semester: student.semester,
        academicStatus: student.academicStatus
      },
      subjects
    });


    console.log(student.branch,student.branch,student.semester)
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Server error"
    });
  }
};

exports.getCurrentSemesterAttendance = async (req, res) => {
  try {
    const { rollNo } = req.params;

    const student = await User.findOne({
      rollNo: rollNo.toUpperCase(),
      role: "student"
    });

    if (!student) {
      return res.status(404).json({ message: "Student not found" });
    }

    const { semester } = student;

    const attendanceRecords = await Attendance.find({
      student: student._id,
      semester
    });

    const subjectMap = {};
    let overallTotal = 0;
    let overallPresent = 0;

    attendanceRecords.forEach(record => {
      // overall counters
      overallTotal += 1;
      if (record.status === "PRESENT") overallPresent += 1;

      // subject-wise
      if (!subjectMap[record.subjectCode]) {
        subjectMap[record.subjectCode] = {
          subjectCode: record.subjectCode,
          subjectName: record.subjectName,
          total: 0,
          present: 0
        };
      }

      subjectMap[record.subjectCode].total += 1;
      if (record.status === "PRESENT") {
        subjectMap[record.subjectCode].present += 1;
      }
    });

    const subjectAttendance = Object.values(subjectMap).map(sub => ({
      subjectCode: sub.subjectCode,
      subjectName: sub.subjectName,
      totalClasses: sub.total,
      attendedClasses: sub.present,
      percentage: ((sub.present / sub.total) * 100).toFixed(2)
    }));

    const overallPercentage =
      overallTotal === 0
        ? "0.00"
        : ((overallPresent / overallTotal) * 100).toFixed(2);

    res.status(200).json({
      success: true,
      semester,
      overall: {
        totalClasses: overallTotal,
        attendedClasses: overallPresent,
        percentage: overallPercentage
      },
      attendance: subjectAttendance
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

// const User = require("../models/User");
// const Marks = require("../models/Marks");

exports.getStudentResult = async (req, res) => {
  try {
    const { rollNo, semester } = req.params;

    if (!rollNo || !semester) {
      return res.status(400).json({ message: "Roll No and Semester required" });
    }

    // 1. Get student basic details
    const student = await User.findOne({
      rollNo: rollNo.toUpperCase(),
      role: "student"
    }).select("name rollNo regulation branch");

    if (!student) {
      return res.status(404).json({ message: "Student not found" });
    }

    // 2. Get marks for semester
    const marks = await Marks.find({
      student: student._id,
      semester
    }).sort({ subjectCode: 1 });

    if (marks.length === 0) {
      return res.status(404).json({ message: "No results found" });
    }

    // 3. SGPA calculation
    let totalCredits = 0;
    let totalPoints = 0;

    marks.forEach(m => {
      totalCredits += m.credits;
      totalPoints += m.credits * m.gradePoint;
    });

    const sgpa = (totalPoints / totalCredits).toFixed(2);

    res.json({
      student,
      semester,
      sgpa,
      marks
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


// get semester wise results to fetch it in the tabular form in the student dashboard

exports.getSemesterWiseResult = async (req, res) => {
  try {
    const { rollNo } = req.params;

    // 1️⃣ Find student
    const student = await User.findOne({
      rollNo: rollNo.toUpperCase(),
      role: "student"
    });

    if (!student) {
      return res.status(404).json({ message: "Student not found" });
    }

    // 2️⃣ Aggregate semester-wise data
    const semesterData = await Marks.aggregate([
      {
        $match: {
          student: student._id
        }
      },
      {
        $group: {
          _id: "$semester",

          totalCredits: { $sum: "$credits" },

          securedCredits: {
            $sum: {
              $cond: [{ $ne: ["$grade", "F"] }, "$credits", 0]
            }
          },

          totalGradePoints: {
            $sum: {
              $multiply: ["$credits", "$gradePoint"]
            }
          }
        }
      },
      {
        $addFields: {
          sgpa: {
            $round: [
              { $divide: ["$totalGradePoints", "$totalCredits"] },
              2
            ]
          }
        }
      },
      {
        $sort: { _id: 1 }
      }
    ]);

    // 3️⃣ Calculate CGPA cumulatively
    let cumulativeCredits = 0;
    let cumulativeGradePoints = 0;

    const result = semesterData.map((sem) => {
      cumulativeCredits += sem.totalCredits;
      cumulativeGradePoints += sem.totalGradePoints;

      return {
        semester: sem._id,
        totalCredits: sem.totalCredits,
        securedCredits: sem.securedCredits,
        sgpa: sem.sgpa,
        cgpa: Number(
          (cumulativeGradePoints / cumulativeCredits).toFixed(2)
        )
      };
    });

    res.json({
      student: {
        name: student.name,
        rollNo: student.rollNo,
        branch: student.branch,
        regulation: student.regulation
      },
      semesters: result
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


//get the student semester wise => subject wise result 

exports.getSemesterMarks = async (req, res) => {
  try {
    const { rollNo, semester } = req.params;

    const student = await User.findOne({
      rollNo: rollNo.toUpperCase(),
      role: "student"
    });

    if (!student) {
      return res.status(404).json({ message: "Student not found" });
    }

    const marks = await Marks.find({
      student: student._id,
      semester: Number(semester)
    })
      .select(
        "subjectCode subjectName credits totalMarks grade gradePoint result"
      )
      .sort({ subjectCode: 1 });

    res.json({
      semester: Number(semester),
      subjects: marks
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


// get attendence report of a student 

exports.getStudentAttendanceReport = async (req, res) => {
  try {
    const { rollNo } = req.params;

    // 1️⃣ Find student
    const student = await User.findOne({
      rollNo: rollNo.toUpperCase(),
      role: "student"
    });

    if (!student) {
      return res.status(404).json({
        success: false,
        message: "Student not found"
      });
    }

    // ===============================
    // 2️⃣ SEMESTER-WISE ATTENDANCE
    // ===============================
    const semesterWiseAttendance = await Attendance.aggregate([
      {
        $match: {
          student: student._id
        }
      },
      {
        $group: {
          _id: "$semester",
          totalClasses: { $sum: 1 },
          attendedClasses: {
            $sum: {
              $cond: [{ $eq: ["$status", "PRESENT"] }, 1, 0]
            }
          }
        }
      },
      {
        $project: {
          _id: 0,
          semester: "$_id",
          totalClasses: 1,
          attendedClasses: 1,
          attendancePercentage: {
            $round: [
              {
                $multiply: [
                  { $divide: ["$attendedClasses", "$totalClasses"] },
                  100
                ]
              },
              2
            ]
          }
        }
      },
      { $sort: { semester: 1 } }
    ]);

    // ===============================
    // 3️⃣ SUBJECT-WISE ATTENDANCE (ALL SEMESTERS)
    // ===============================
    const subjectWiseAttendance = await Attendance.aggregate([
      {
        $match: {
          student: student._id
        }
      },
      {
        $group: {
          _id: {
            subjectCode: "$subjectCode",
            subjectName: "$subjectName",
            semester: "$semester"
          },
          totalClasses: { $sum: 1 },
          attendedClasses: {
            $sum: {
              $cond: [{ $eq: ["$status", "PRESENT"] }, 1, 0]
            }
          }
        }
      },
      {
        $project: {
          _id: 0,
          subjectCode: "$_id.subjectCode",
          subjectName: "$_id.subjectName",
          semester: "$_id.semester",
          totalClasses: 1,
          attendedClasses: 1,
          attendancePercentage: {
            $round: [
              {
                $multiply: [
                  { $divide: ["$attendedClasses", "$totalClasses"] },
                  100
                ]
              },
              2
            ]
          }
        }
      },
      { $sort: { semester: 1, subjectCode: 1 } }
    ]);

    // ===============================
    // 4️⃣ FINAL RESPONSE
    // ===============================
    res.status(200).json({
      success: true,
      student: {
        name: student.name,
        rollNo: student.rollNo,
        branch: student.branch,
        regulation: student.regulation
      },
      semesterWiseAttendance,
      subjectWiseAttendance
    });
  } catch (error) {
    console.error("Attendance Error:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error"
    });
  }
};

// get daywise attendence of a student through the rollNo 
// for the student dashboard   
exports.getAttendanceByRollNo = async (req, res) => {
  try {
    const { rollNo } = req.params;
    const { startDate, endDate, date } = req.query;

    // 1️⃣ Find student
    const student = await User.findOne({
      rollNo: rollNo.toUpperCase(),
      role: "student"
    }).select("_id name rollNo branch year semester");

    if (!student) {
      return res.status(404).json({
        success: false,
        message: "Student not found"
      });
    }

    // 2️⃣ Base query
    const query = {
      student: student._id
    };

    let filterApplied = "ALL";
    let range = null;

    // 🟢 CASE 1: DATE RANGE (highest priority)
    if (startDate && endDate) {
      const from = new Date(startDate);
      from.setHours(0, 0, 0, 0);

      const to = new Date(endDate);
      to.setHours(23, 59, 59, 999);

      query.date = { $gte: from, $lte: to };
      filterApplied = "DATE_RANGE";
      range = { startDate, endDate };
    }

    // 🟢 CASE 2: SINGLE DATE
    else if (date) {
      const from = new Date(date);
      from.setHours(0, 0, 0, 0);

      const to = new Date(date);
      to.setHours(23, 59, 59, 999);

      query.date = { $gte: from, $lte: to };
      filterApplied = "SINGLE_DATE";
      range = { date };
    }

    // 3️⃣ Fetch attendance
    const records = await Attendance.find(query)
      .sort({ date: 1, fromTime: 1 })
      .lean();

    // 4️⃣ Group DATE-WISE
    const attendanceByDate = {};

    records.forEach(item => {
      const dateKey = item.date.toISOString().split("T")[0];

      if (!attendanceByDate[dateKey]) {
        attendanceByDate[dateKey] = [];
      }

      attendanceByDate[dateKey].push({
        subjectCode: item.subjectCode,
        subjectName: item.subjectName,
        fromTime: item.fromTime,
        toTime: item.toTime,
        status: item.status
      });
    });

    // 5️⃣ Response
    res.status(200).json({
      success: true,
      student,
      filterApplied,
      range,
      totalDays: Object.keys(attendanceByDate).length,
      attendance: attendanceByDate
    });

  } catch (error) {
    console.error("Attendance fetch error:", error);
    res.status(500).json({
      success: false,
      message: "Server error"
    });
  }
};




// exports.getAcademicSummary = async (req, res) => {
//   try {
//     const { rollNo } = req.params;

//     // 1️⃣ Find student
//     const student = await User.findOne({
//       rollNo: rollNo.toUpperCase(),
//       role: "student"
//     });

//     if (!student) {
//       return res.status(404).json({ message: "Student not found" });
//     }

//     // 2️⃣ Fetch all marks
//     const marks = await Marks.find({ student: student._id });

//     const semesterMap = {};
//     let cgpaTotalCredits = 0;
//     let cgpaWeightedPoints = 0;

//     const backlogs = [];

//     marks.forEach(m => {
//       // INIT semester
//       if (!semesterMap[m.semester]) {
//         semesterMap[m.semester] = {
//           semester: m.semester,
//           totalCredits: 0,
//           securedCredits: 0,
//           weightedPoints: 0
//         };
//       }

//       // Total credits
//       semesterMap[m.semester].totalCredits += m.credits;

//       // Check pass / fail
//       if (m.grade !== "F") {
//         semesterMap[m.semester].securedCredits += m.credits;
//         semesterMap[m.semester].weightedPoints +=
//           m.credits * m.gradePoint;

//         // CGPA accumulation
//         cgpaTotalCredits += m.credits;
//         cgpaWeightedPoints += m.credits * m.gradePoint;
//       } else {
//         // Backlog
//         backlogs.push({
//           semester: m.semester,
//           subjectCode: m.subjectCode,
//           subjectName: m.subjectName,
//           credits: m.credits,
//           internalMarks: m.internalMarks,
//           externalMarks: m.externalMarks,
//           totalMarks: m.totalMarks
//         });
//       }
//     });

//     // 3️⃣ Build SGPA per semester
//     const semesterWise = Object.values(semesterMap).map(sem => ({
//       semester: sem.semester,
//       sgpa:
//         sem.securedCredits === 0
//           ? "0.00"
//           : (sem.weightedPoints / sem.securedCredits).toFixed(2),
//       totalCredits: sem.totalCredits,
//       securedCredits: sem.securedCredits
//     }));

//     // 4️⃣ CGPA
//     const cgpa =
//       cgpaTotalCredits === 0
//         ? "0.00"
//         : (cgpaWeightedPoints / cgpaTotalCredits).toFixed(2);

//     res.status(200).json({
//       success: true,
//       student: {
//         name: student.name,
//         rollNo: student.rollNo,
//         branch: student.branch,
//         regulation: student.regulation
//       },
//       semesterWise,
//       cgpa,
//       backlogs
//     });

//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ message: "Server error" });
//   }
// };

// module.exports = { getAcademicSummary };


// module.exports = { getStudentWithCurrentSubjects };
