const router = require("express").Router();
const AttendanceController = require("../controllers/AttendanceController");
const authorizeRoles  = require("../middleware/roleMiddleware");
const authMiddleware = require("../middleware/authMiddleware");
const AttendanceSession = require("../models/AttendanceSession");

const User = require("../models/User");

//to fetch the attendence semester wise 

// router.get("/defaulters", async (req, res) => {
//   const { regulation, branch, semester, min = 75 } = req.query;

//   const defaulters = await AttendanceSession.aggregate([
//     {
//       $lookup: {
//         from: "students",
//         localField: "studentId",
//         foreignField: "_id",
//         as: "student"
//       }
//     },
//     { $unwind: "$student" },

//     // 🔑 CORE FILTER (THIS FIXES YOUR ISSUE)
//     {
//       $match: {
//         "student.regulation": regulation,
//         "student.branch": branch,
//         "student.semester": Number(semester),
//         "student.academicStatus": "ACTIVE"
//       }
//     },

//     {
//       $group: {
//         _id: {
//           studentId: "$studentId",
//           rollNo: "$student.rollNo",
//           name: "$student.name"
//         },
//         totalClasses: { $sum: 1 },
//         presentCount: {
//           $sum: {
//             $cond: [{ $eq: ["$status", "PRESENT"] }, 1, 0]
//           }
//         }
//       }
//     },

//     {
//       $addFields: {
//         attendancePercentage: {
//           $round: [
//             {
//               $multiply: [
//                 { $divide: ["$presentCount", "$totalClasses"] },
//                 100
//               ]
//             },
//             2
//           ]
//         }
//       }
//     },

//     {
//       $match: {
//         attendancePercentage: { $lt: Number(min) }
//       }
//     },

//     {
//       $project: {
//         _id: 0,
//         rollNo: "$_id.rollNo",
//         name: "$_id.name",
//         attendancePercentage: 1
//       }
//     }
//   ]);

//   res.json(defaulters);
// });


router.get("/admin/attendance/semester-summary",AttendanceController.getSemesterAttendanceSummary)

// to get attendance of a student in particular subject from previous date 
router.get("/student/present-classes", AttendanceController.getStudentPresentClasses);



//student can fetch the attendence semester wise 
// router.get(
//   "/my-attendance/semester-wise",
//   authMiddleware,
//   async (req, res) => {
//     const studentId = req.user.id; 

//     const records = await AttendanceSession.find({
//       student: studentId
//     });

//     const summary = {};

//     records.forEach(r => {
//       if (!summary[r.semester]) {
//         summary[r.semester] = {
//           semester: r.semester,
//           totalClasses: 0,
//           attended: 0
//         };
//       }

//       summary[r.semester].totalClasses += 1;

//       if (r.status === "PRESENT") {
//         summary[r.semester].attended += 1;
//       }
//     });

//     const result = Object.values(summary)
//       .sort((a, b) => a.semester - b.semester)
//       .map(s => ({
//         semester: s.semester,
//         totalClasses: s.totalClasses,
//         attended: s.attended,

//       percentage: s.totalClasses === 0
//          ? "0.00"
//          : ((s.attended / s.totalClasses) * 100).toFixed(2)



//       }));

//     res.json(result);
//   }
// );


// student can fetch the semester subject wise attendence 
// router.get(
//   "/my-attendance/:semester",
//   authMiddleware,
//   authorizeRoles("admin","faculty"),
//   async (req, res) => {
//     const semester = Number(req.params.semester);

//     const records = await AttendanceSession.find({
//       student: req.user.id,
//       semester
//     });

//     const summary = {};

//     records.forEach(r => {
//       if (!summary[r.subjectCode]) {
//         summary[r.subjectCode] = {
//           subjectName: r.subjectName,
//           totalClasses: 0,
//           attended: 0
//         };
//       }

//       summary[r.subjectCode].totalClasses += 1;
//       if (r.status === "PRESENT") {
//         summary[r.subjectCode].attended += 1;
//       }
//     });

//     const result = Object.keys(summary).map(code => ({
//       subjectCode: code,
//       subjectName: summary[code].subjectName,
//       totalClasses: summary[code].totalClasses,
//       attended: summary[code].attended,
//       percentage: (
//         (summary[code].attended / summary[code].totalClasses) * 100
//       ).toFixed(2)
//     }));

//     res.json(result);
//   }
// );

//adding the attendences by the admin 
router.post("/add", authMiddleware,authorizeRoles("admin","faculty"), AttendanceController.addAttendence);

//Get Attendance by Student (Admin View)
router.get("/:studentId",authMiddleware, authorizeRoles("admin","faculty"),AttendanceController.getAttendenceStudentId);

// router.get(
//   "/:studentId/:semester",
//   authMiddleware,
//   authorizeRoles("admin"),
//   AttendanceController.getAttendenceStudentIdSemester
// );






module.exports = router