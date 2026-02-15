const AttendanceSession = require("../models/AttendanceSession")
const Subject = require("../models/Subject")
const User = require('../models/User')
//add the subject details by admin
// exports.SubjectAdd =  async (req, res) => {
//   const { subjectCode, subjectName, regulation, branch, semester } = req.body;

//   const subject = await Subject.create({
//     subjectCode,
//     subjectName,
//     regulation,
//     branch,
//     semester
//   });

//   res.status(201).json(subject);
// };


// exports.addAttendence = async (req, res) => {
//   const {
//     studentId,
//     semester,
//     regulation,
//     branch,
//     subjectCode,
//     date,
//     fromTime,
//     toTime,
//     status
//   } = req.body;

//   if (fromTime >= toTime) {
//     return res.status(400).json({ message: "Invalid time range" });
//   }

//   // 🔎 Correct subject lookup
//   const subject = await Subject.findOne({
//     subjectCode: subjectCode.toUpperCase(),
//     semester,
//     regulation,
//     branch
//   });

//   if (!subject) {
//     return res.status(400).json({
//       message: "Invalid subject for this semester, branch and regulation"
//     });
//   }

//   // 🔐 Time overlap check
//   const sessions = await AttendanceSession.find({
//     student: studentId,
//     semester,
//     date
//   });

//   const isOverlap = sessions.some(s =>
//     fromTime < s.toTime && toTime > s.fromTime
//   );

//   if (isOverlap) {
//     return res.status(400).json({
//       message: "Attendance already exists for this time slot"
//     });
//   }

//   const attendance = await AttendanceSession.create({
//     student: studentId,
//     semester,
//     regulation,
//     branch,
//     subjectCode: subject.subjectCode,
//     subjectName: subject.subjectName, // ✅ 100% correct now
//     date,
//     fromTime,
//     toTime,
//     status
//   });

//   res.status(201).json(attendance);
// };

exports.addAttendence = async (req, res) => {
  try {
    const {
      rollNo,          // ✅ CHANGED
      semester,
      regulation,
      branch,
      subjectCode,
      date,
      fromTime,
      toTime,
      status
    } = req.body;

    if (fromTime >= toTime) {
      return res.status(400).json({ message: "Invalid time range" });
    }

    // 🔍 Find student by rollNo
    const student = await User.findOne({
      rollNo: rollNo.toUpperCase(),
      role: "student"
    });

    if (!student) {
      return res.status(404).json({ message: "Student not found" });
    }

    // 🔎 Subject lookup
    const subject = await Subject.findOne({
      subjectCode: subjectCode.toUpperCase(),
      semester,
      regulation,
      branch
    });

    if (!subject) {
      return res.status(400).json({
        message: "Invalid subject for this semester, branch and regulation"
      });
    }

    // 🔐 Time overlap check
    const sessions = await AttendanceSession.find({
      student: student._id,
      semester,
      date
    });

    const isOverlap = sessions.some(s =>
      fromTime < s.toTime && toTime > s.fromTime
    );

    if (isOverlap) {
      return res.status(400).json({
        message: "Attendance already exists for this time slot"
      });
    }

    // ✅ Create attendance
    const attendance = await AttendanceSession.create({
      student: student._id,
      rollNo: student.rollNo,        // (optional but useful)
      semester,
      regulation,
      branch,
      subjectCode: subject.subjectCode,
      subjectName: subject.subjectName,
      date,
      fromTime,
      toTime,
      status
    });

    res.status(201).json(attendance);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};




exports.getAttendenceStudentId =  async (req, res) => {
  const attendance = await AttendanceSession.find({
    student: req.params.studentId
  }).sort({ date: 1, fromTime: 1 });

  res.json(attendance);
}

exports.getAttendenceStudentIdSemester = async (req, res) => {
    const { studentId, semester } = req.params;

    const attendance = await AttendanceSession.find({
      student: studentId,
      semester
    }).sort({ date: 1, fromTime: 1 });

    res.json(attendance);
  }




  // const mongoose = require("mongoose");
  // const User = require("../models/User");
  // const Attendance = require("../models/Attendance");
  
  exports.getSemesterAttendanceSummary = async (req, res) => {
    try {
      // const { regulation, branch, semester, minPercentage } = req.query;
      const { regulation, branch, semester, minPercentage, maxPercentage } = req.query;
  
      if (!regulation || !branch || !semester) {
        return res.status(400).json({
          message: "regulation, branch and semester are required"
        });
      }
  
      // const semesterNum = Number(semester);
      // const minPercent = minPercentage ? Number(minPercentage) : 0;
      const semesterNum = Number(semester);
      const minPercent = minPercentage ? Number(minPercentage) : 0;
      const maxPercent = maxPercentage ? Number(maxPercentage) : 100;
  
      const data = await User.aggregate([
        // 1️⃣ Filter students
        {
          $match: {
            role: "student",
            regulation,
            branch,
            semester: semesterNum,
            academicStatus: "ACTIVE"
          }
        },
  
        // 2️⃣ Join attendance
        {
          $lookup: {
            from: "attendances",
            let: { studentId: "$_id" },
            pipeline: [
              {
                $match: {
                  $expr: {
                    $and: [
                      { $eq: ["$student", "$$studentId"] },
                      { $eq: ["$semester", semesterNum] }
                    ]
                  }
                }
              }
            ],
            as: "attendanceRecords"
          }
        },
  
        // 3️⃣ Calculate totals
        {
          $addFields: {
            totalClasses: { $size: "$attendanceRecords" },
            presentClasses: {
              $size: {
                $filter: {
                  input: "$attendanceRecords",
                  as: "att",
                  cond: { $eq: ["$$att.status", "PRESENT"] }
                }
              }
            }
          }
        },
  
        // 4️⃣ Calculate percentage
        {
          $addFields: {
            attendancePercentage: {
              $cond: [
                { $eq: ["$totalClasses", 0] },
                0,
                {
                  $round: [
                    {
                      $multiply: [
                        { $divide: ["$presentClasses", "$totalClasses"] },
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
  
        // 5️⃣ Filter by percentage (75%, 65%, etc.)
        // {
        //   $match: {
        //     attendancePercentage: { $gte: minPercent }
        //   }
        // }
        

        {
  $match: {
    attendancePercentage: {
      $gte: minPercent,
      $lte: maxPercent
    }
  }
}

        ,
  
        // 6️⃣ Final projection
        {
          $project: {
            _id: 0,
            studentId: "$_id",
            name: 1,
            rollNo: 1,
            regulation: 1,
            branch: 1,
            semester: 1,
            totalClasses: 1,
            presentClasses: 1,
            attendancePercentage: 1
          }
        },
  
        // 7️⃣ Sort (optional)
        {
          $sort: { attendancePercentage: -1 }
        }
      ]);
  
      res.status(200).json({
        count: data.length,
        students: data
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Server error" });
    }
  };
  


  // to get the prevoius date  wise attendance by rollno and subject details of subject 


//   const User = require("../models/User");
// const Subject = require("../models/Subject");
// const Attendance = require("../models/Attendance");
exports.getStudentPresentClasses = async (req, res) => {
  try {
    const {
      rollNo,
      regulation,
      branch,
      semester,
      subjectName
    } = req.query;   // 👈 changed here

    const student = await User.findOne({
      rollNo: rollNo.toUpperCase(),
      role: "student"
    });

    if (!student) {
      return res.status(404).json({ message: "Student not found" });
    }

    const subject = await Subject.findOne({
      subjectName,
      regulation,
      branch,
      semester
    });

    if (!subject) {
      return res.status(404).json({ message: "Subject not found" });
    }

    const attendanceList = await AttendanceSession.find({
      student: student._id,
      subjectCode: subject.subjectCode,
      semester,
      status: "PRESENT"
    })
      .select("date fromTime toTime -_id")
      .sort({ date: -1 });

    res.json(attendanceList);

  } catch (err) {
    res.status(500).json({ message: "Server Error" });
  }
};

