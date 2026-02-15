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
    }).sort({ subjectCode: 1 }).lean();

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


// exports.getStudentWithCurrentSubjects = async (req, res) => {
//   try {
//     const { rollNo } = req.params;

//     if (!rollNo) {
//       return res.status(400).json({
//         success: false,
//         message: "Roll number is required"
//       });
//     }

//     // ✅ 1️⃣ Fetch only required student fields
//     const student = await User.findOne({
//       rollNo: rollNo.toUpperCase(),
//       role: "student"
//     })
//       .select("name rollNo branch regulation year semester academicStatus")
//       .lean();

//     if (!student) {
//       return res.status(404).json({
//         success: false,
//         message: "Student not found"
//       });
//     }

//     const { regulation, branch, semester } = student;

//     // ✅ 2️⃣ Fetch only required subject fields
//     const subjects = await Subject.find({
//       regulation,
//       branch,
//       semester: Number(semester)
//     })
//       .select("subjectCode subjectName credits -_id")
//       .sort({ subjectCode: 1 })
//       .lean();

//     // ✅ 3️⃣ Final response
//     res.status(200).json({
//       success: true,
//       student,
//       subjects
//     });

//   } catch (error) {
//     console.error(error);
//     res.status(500).json({
//       success: false,
//       message: "Server error"
//     });
//   }
// };



exports.getCurrentSemesterAttendance = async (req, res) => {
  try {
    const { rollNo } = req.params;

    // 1️⃣ Fetch student (only required fields)
    const student = await User.findOne({
      rollNo: rollNo.toUpperCase(),
      role: "student"
    })
      .select("_id semester");

    if (!student) {
      return res.status(404).json({ message: "Student not found" });
    }

    const { _id, semester } = student;

    // 2️⃣ Aggregate attendance directly in MongoDB
    const attendanceData = await Attendance.aggregate([
      {
        $match: {
          student: _id,
          semester: semester
        }
      },
      {
        $group: {
          _id: "$subjectCode",
          subjectName: { $first: "$subjectName" },
          totalClasses: { $sum: 1 },
          attendedClasses: {
            $sum: {
              $cond: [{ $eq: ["$status", "PRESENT"] }, 1, 0]
            }
          }
        }
      }
    ]);

    // 3️⃣ Calculate overall
    let overallTotal = 0;
    let overallPresent = 0;

    const subjectAttendance = attendanceData.map(sub => {
      overallTotal += sub.totalClasses;
      overallPresent += sub.attendedClasses;

      return {
        subjectCode: sub._id,
        subjectName: sub.subjectName,
        totalClasses: sub.totalClasses,
        attendedClasses: sub.attendedClasses,
        percentage:
          sub.totalClasses === 0
            ? "0.00"
            : ((sub.attendedClasses / sub.totalClasses) * 100).toFixed(2)
      };
    });

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




// exports.getStudentResult = async (req, res) => {
//   try {
//     const { rollNo, semester } = req.params;

//     if (!rollNo || !semester) {
//       return res.status(400).json({ message: "Roll No and Semester required" });
//     }

//     // 1. Get student basic details
//     const student = await User.findOne({
//       rollNo: rollNo.toUpperCase(),
//       role: "student"
//     }).select("name rollNo regulation branch").lean();

//     if (!student) {
//       return res.status(404).json({ message: "Student not found" });
//     }

//     // 2. Get marks for semester
//     const marks = await Marks.find({
//       student: student._id,
//       semester
//     }).sort({ subjectCode: 1 }).lean();

//     if (marks.length === 0) {
//       return res.status(404).json({ message: "No results found" });
//     }

//     // 3. SGPA calculation
//     let totalCredits = 0;
//     let totalPoints = 0;

//     marks.forEach(m => {
//       totalCredits += m.credits;
//       totalPoints += m.credits * m.gradePoint;
//     });

//     const sgpa = (totalPoints / totalCredits).toFixed(2);

//     res.json({
//       student,
//       semester,
//       sgpa,
//       marks
//     });

//   } catch (error) {
//     res.status(500).json({ message: error.message });
//   }
// };


// get semester wise results to fetch it in the tabular form in the student dashboard


exports.getStudentResult = async (req, res) => {
  try {
    const { rollNo, semester } = req.params;

    if (!rollNo || !semester) {
      return res.status(400).json({
        success: false,
        message: "Roll No and Semester required"
      });
    }

    const semNumber = Number(semester);

    // ✅ 1️⃣ Fetch only required student fields
    const student = await User.findOne({
      rollNo: rollNo.toUpperCase(),
      role: "student"
    })
      .select("_id name rollNo regulation branch")
     

    if (!student) {
      return res.status(404).json({
        success: false,
        message: "Student not found"
      });
    }

    // ✅ 2️⃣ Fetch only required marks fields
    const marks = await Marks.find({
      student: student._id,
      semester: semNumber
    })
      .select("subjectCode subjectName credits grade gradePoint -_id")
      .sort({ subjectCode: 1 })
      .lean();

    if (!marks.length) {
      return res.status(404).json({
        success: false,
        message: "No results found"
      });
    }

    // ✅ 3️⃣ Fast SGPA calculation (for loop is faster than forEach)
    let totalCredits = 0;
    let totalPoints = 0;

    for (let i = 0; i < marks.length; i++) {
      totalCredits += marks[i].credits;
      totalPoints += marks[i].credits * marks[i].gradePoint;
    }

    const sgpa =
      totalCredits > 0
        ? Number((totalPoints / totalCredits).toFixed(2))
        : 0;

    // ✅ 4️⃣ Clean response
    res.json({
      success: true,
      student,
      semester: semNumber,
      sgpa,
      totalSubjects: marks.length,
      marks
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Server error"
    });
  }
};




exports.getSemesterWiseResult = async (req, res) => {
  try {
    const { rollNo } = req.params;

    // 1️⃣ Find student
    const student = await User.findOne({
      rollNo: rollNo.toUpperCase(),
      role: "student"
    }).lean()

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
    }).lean();

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
      .sort({ subjectCode: 1 })
      .lean();

    res.json({
      semester: Number(semester),
      subjects: marks
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


// get attendence report of a student 

// exports.getStudentAttendanceReport = async (req, res) => {
//   try {
//     const { rollNo } = req.params;

//     // 1️⃣ Find student
//     const student = await User.findOne({
//       rollNo: rollNo.toUpperCase(),
//       role: "student"
//     }).lean();

//     if (!student) {
//       return res.status(404).json({
//         success: false,
//         message: "Student not found"
//       });
//     }

//     // ===============================
//     // 2️⃣ SEMESTER-WISE ATTENDANCE
//     // ===============================
//     const semesterWiseAttendance = await Attendance.aggregate([
//       {
//         $match: {
//           student: student._id
//         }
//       },
//       {
//         $group: {
//           _id: "$semester",
//           totalClasses: { $sum: 1 },
//           attendedClasses: {
//             $sum: {
//               $cond: [{ $eq: ["$status", "PRESENT"] }, 1, 0]
//             }
//           }
//         }
//       },
//       {
//         $project: {
//           _id: 0,
//           semester: "$_id",
//           totalClasses: 1,
//           attendedClasses: 1,
//           attendancePercentage: {
//             $round: [
//               {
//                 $multiply: [
//                   { $divide: ["$attendedClasses", "$totalClasses"] },
//                   100
//                 ]
//               },
//               2
//             ]
//           }
//         }
//       },
//       { $sort: { semester: 1 } }
//     ]);

//     // ===============================
//     // 3️⃣ SUBJECT-WISE ATTENDANCE (ALL SEMESTERS)
//     // ===============================
//     const subjectWiseAttendance = await Attendance.aggregate([
//       {
//         $match: {
//           student: student._id
//         }
//       },
//       {
//         $group: {
//           _id: {
//             subjectCode: "$subjectCode",
//             subjectName: "$subjectName",
//             semester: "$semester"
//           },
//           totalClasses: { $sum: 1 },
//           attendedClasses: {
//             $sum: {
//               $cond: [{ $eq: ["$status", "PRESENT"] }, 1, 0]
//             }
//           }
//         }
//       },
//       {
//         $project: {
//           _id: 0,
//           subjectCode: "$_id.subjectCode",
//           subjectName: "$_id.subjectName",
//           semester: "$_id.semester",
//           totalClasses: 1,
//           attendedClasses: 1,
//           attendancePercentage: {
//             $round: [
//               {
//                 $multiply: [
//                   { $divide: ["$attendedClasses", "$totalClasses"] },
//                   100
//                 ]
//               },
//               2
//             ]
//           }
//         }
//       },
//       { $sort: { semester: 1, subjectCode: 1 } }
//     ]);

//     // ===============================
//     // 4️⃣ FINAL RESPONSE
//     // ===============================
//     res.status(200).json({
//       success: true,
//       student: {
//         name: student.name,
//         rollNo: student.rollNo,
//         branch: student.branch,
//         regulation: student.regulation
//       },
//       semesterWiseAttendance,
//       subjectWiseAttendance
//     });
//   } catch (error) {
//     console.error("Attendance Error:", error);
//     res.status(500).json({
//       success: false,
//       message: "Internal server error"
//     });
//   }
// };


exports.getStudentAttendanceReport = async (req, res) => {
  try {
    const { rollNo } = req.params;

    if (!rollNo) {
      return res.status(400).json({
        success: false,
        message: "Roll number is required"
      });
    }

    // ✅ 1️⃣ Fetch only required student fields
    const student = await User.findOne({
      rollNo: rollNo.toUpperCase(),
      role: "student"
    })
      .select("_id name rollNo branch regulation")
      .lean();

    if (!student) {
      return res.status(404).json({
        success: false,
        message: "Student not found"
      });
    }

    // ✅ 2️⃣ Single aggregation with $facet (faster than 2 separate pipelines)
    const attendanceReport = await Attendance.aggregate([
      {
        $match: { student: student._id }
      },
      {
        $facet: {
          semesterWiseAttendance: [
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
                  $cond: [
                    { $eq: ["$totalClasses", 0] },
                    0,
                    {
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
                  ]
                }
              }
            },
            { $sort: { semester: 1 } }
          ],

          subjectWiseAttendance: [
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
                  $cond: [
                    { $eq: ["$totalClasses", 0] },
                    0,
                    {
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
                  ]
                }
              }
            },
            { $sort: { semester: 1, subjectCode: 1 } }
          ]
        }
      }
    ]);

    const { semesterWiseAttendance, subjectWiseAttendance } =
      attendanceReport[0];

    // ✅ 3️⃣ Final Response
    res.status(200).json({
      success: true,
      student,
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



// exports.getAttendanceByRollNo = async (req, res) => {
//   try {
//     const { rollNo } = req.params;
//     const { startDate, endDate, date } = req.query;

//     // 1️⃣ Find student
//     const student = await User.findOne({
//       rollNo: rollNo.toUpperCase(),
//       role: "student"
//     }).select("_id name rollNo branch year semester").lean();

//     if (!student) {
//       return res.status(404).json({
//         success: false,
//         message: "Student not found"
//       });
//     }

//     // 2️⃣ Base query
//     const query = {
//       student: student._id
//     };

//     let filterApplied = "ALL";
//     let range = null;

//     // 🟢 CASE 1: DATE RANGE (highest priority)
//     if (startDate && endDate) {
//       const from = new Date(startDate);
//       from.setHours(0, 0, 0, 0);

//       const to = new Date(endDate);
//       to.setHours(23, 59, 59, 999);

//       query.date = { $gte: from, $lte: to };
//       filterApplied = "DATE_RANGE";
//       range = { startDate, endDate };
//     }

//     // 🟢 CASE 2: SINGLE DATE
//     else if (date) {
//       const from = new Date(date);
//       from.setHours(0, 0, 0, 0);

//       const to = new Date(date);
//       to.setHours(23, 59, 59, 999);

//       query.date = { $gte: from, $lte: to };
//       filterApplied = "SINGLE_DATE";
//       range = { date };
//     }

//     // 3️⃣ Fetch attendance
//     const records = await Attendance.find(query)
//       .sort({ date: 1, fromTime: 1 })
//       .lean();

//     // 4️⃣ Group DATE-WISE
//     const attendanceByDate = {};

//     records.forEach(item => {
//       const dateKey = item.date.toISOString().split("T")[0];

//       if (!attendanceByDate[dateKey]) {
//         attendanceByDate[dateKey] = [];
//       }

//       attendanceByDate[dateKey].push({
//         subjectCode: item.subjectCode,
//         subjectName: item.subjectName,
//         fromTime: item.fromTime,
//         toTime: item.toTime,
//         status: item.status
//       });
//     });

//     // 5️⃣ Response
//     res.status(200).json({
//       success: true,
//       student,
//       filterApplied,
//       range,
//       totalDays: Object.keys(attendanceByDate).length,
//       attendance: attendanceByDate
//     });

//   } catch (error) {
//     console.error("Attendance fetch error:", error);
//     res.status(500).json({
//       success: false,
//       message: "Server error"
//     });
//   }
// };


exports.getAttendanceByRollNo = async (req, res) => {
  try {
    const { rollNo } = req.params;
    const { startDate, endDate, date } = req.query;

    // 1️⃣ Fetch only required student fields
    const student = await User.findOne({
      rollNo: rollNo.toUpperCase(),
      role: "student"
    })
      .select("_id name rollNo branch year semester")
      .lean();

    if (!student) {
      return res.status(404).json({
        success: false,
        message: "Student not found"
      });
    }

    const matchStage = {
      student: student._id
    };

    let filterApplied = "ALL";
    let range = null;

    // 🟢 DATE RANGE
    if (startDate && endDate) {
      const from = new Date(startDate);
      from.setHours(0, 0, 0, 0);

      const to = new Date(endDate);
      to.setHours(23, 59, 59, 999);

      matchStage.date = { $gte: from, $lte: to };
      filterApplied = "DATE_RANGE";
      range = { startDate, endDate };
    }

    // 🟢 SINGLE DATE
    else if (date) {
      const from = new Date(date);
      from.setHours(0, 0, 0, 0);

      const to = new Date(date);
      to.setHours(23, 59, 59, 999);

      matchStage.date = { $gte: from, $lte: to };
      filterApplied = "SINGLE_DATE";
      range = { date };
    }

    // 2️⃣ Aggregation
    const attendanceData = await Attendance.aggregate([
      { $match: matchStage },
      { $sort: { date: 1, fromTime: 1 } },
      {
        $group: {
          _id: {
            date: {
              $dateToString: { format: "%Y-%m-%d", date: "$date" }
            }
          },
          records: {
            $push: {
              subjectCode: "$subjectCode",
              subjectName: "$subjectName",
              fromTime: "$fromTime",
              toTime: "$toTime",
              status: "$status"
            }
          }
        }
      },
      {
        $project: {
          _id: 0,
          date: "$_id.date",
          records: 1
        }
      }
    ]);

    // 3️⃣ Convert to date-wise object format (frontend friendly)
    const attendanceByDate = {};
    attendanceData.forEach(day => {
      attendanceByDate[day.date] = day.records;
    });

    res.status(200).json({
      success: true,
      student,
      filterApplied,
      range,
      totalDays: attendanceData.length,
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
