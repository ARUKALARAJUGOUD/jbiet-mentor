const Subject = require("../models/Subject");
const Marks = require("../models/Marks")
/**
 * ADD SUBJECT (Admin / Faculty)
 */








exports.addSubject = async (req, res) => {
  try {
    const {
      subjectCode,
      subjectName,
      regulation,
      branch,
      semester,
      credits
    } = req.body;

    // Basic validation
    if (
      !subjectCode ||
      !subjectName ||
      !regulation ||
      !branch ||
      !semester ||
      !credits
    ) {
      return res.status(400).json({ message: "All fields are required" });
    }

    // Prevent duplicate subject
    const existing = await Subject.findOne({
      subjectCode,
      regulation,
      branch,
      semester
    });

    if (existing) {
      return res.status(409).json({
        message: "Subject already exists for this regulation, branch & semester"
      });
    }

    const subject = await Subject.create({
      subjectCode,
      subjectName,
      regulation,
      branch,
      semester,
      credits
    });

    res.status(201).json({
      message: "Subject added successfully",
      subject
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};


/**
 * UPDATE SUBJECT (Admin only)
 */
exports.updateSubject = async (req, res) => {
  try {
    const subjectId = req.params.id;

    const {
      subjectCode,
      subjectName,
      regulation,
      branch,
      semester,
      credits
    } = req.body;

    // Check subject exists
    const subject = await Subject.findById(subjectId);
    if (!subject) {
      return res.status(404).json({ message: "Subject not found" });
    }

    // If academic identity is being changed, check duplicate
    if (
      subjectCode ||
      regulation ||
      branch ||
      semester
    ) {
      const duplicate = await Subject.findOne({
        _id: { $ne: subjectId },
        subjectCode: subjectCode || subject.subjectCode,
        regulation: regulation || subject.regulation,
        branch: branch || subject.branch,
        semester: semester || subject.semester
      });

      if (duplicate) {
        return res.status(409).json({
          message:
            "Another subject already exists with this code, regulation, branch and semester"
        });
      }
    }

    // Update fields
    subject.subjectCode = subjectCode || subject.subjectCode;
    subject.subjectName = subjectName || subject.subjectName;
    subject.regulation = regulation || subject.regulation;
    subject.branch = branch || subject.branch;
    subject.semester = semester || subject.semester;
    subject.credits = credits || subject.credits;

    await subject.save();

    res.json({
      message: "Subject updated successfully",
      subject
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};


/**
 * DELETE SUBJECT (Admin only)
 */
exports.deleteSubject = async (req, res) => {
  try {
    const subjectId = req.params.id;

    const subject = await Subject.findById(subjectId);

    if (!subject) {
      return res.status(404).json({ message: "Subject not found" });
    }

    await subject.deleteOne();

    res.json({
      message: "Subject deleted successfully"
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};





/**
 * @desc    Get subjects by regulation, branch, semester
 * @route   GET /api/subjects
 * @access  Public / Admin
 */
// exports.getSubjectsByFilter = async (req, res) => {
//   try {
//     const { regulation, branch, semester } = req.query;

//     // ✅ Validation
//     if (!regulation || !branch || !semester) {
//       return res.status(400).json({
//         success: false,
//         message: "regulation, branch and semester are required"
//       });
//     }

//     // ✅ Fetch subjects
//  const query = {};
// if (regulation) query.regulation = regulation;
// if (branch) query.branch = branch;
// if (semester) query.semester = semester;

// const subjects = await Subject.find(query).limit(20)

//       .select("subjectCode subjectName credits semester branch regulation")
//       .sort({ subjectCode: 1 });

//     // ✅ No subjects found
//     if (subjects.length === 0) {
//       return res.status(404).json({
//         success: false,
//         message: "No subjects found for given criteria"
//       });
//     }

//     res.status(200).json({
//       success: true,
//       count: subjects.length,
//       data: subjects
//     });
//   } catch (error) {
//     console.error("Error fetching subjects:", error);
//     res.status(500).json({
//       success: false,
//       message: "Server Error"
//     });
//   }
// };



exports.getSubjectsByFilter = async (req, res) => {
  try {
    const { regulation, branch, semester } = req.query;

    // ✅ Build dynamic query
    const query = {};

    if (regulation) query.regulation = regulation;
    if (branch) query.branch = branch;
    if (semester) query.semester = Number(semester);

    // ✅ Fetch subjects (default + filtered)
    const subjects = await Subject.find(query)
      .select("subjectCode subjectName credits semester branch regulation")
      .sort({ createdAt: -1 }) // latest first
      .limit(25);              // prevent heavy load

    // ✅ Empty is NOT an error
    return res.status(200).json({
      success: true,
      count: subjects.length,
      data: subjects
    });

  } catch (error) {
    console.error("Error fetching subjects:", error);
    res.status(500).json({
      success: false,
      message: "Server Error"
    });
  }
};


exports.getSubjectResultAnalysis = async (req, res) => {
  try {
    const {
      regulation,
      branch,
      semester,
      subjectCode,
      result
    } = req.query;

    // 🔒 Validation
    if (!regulation || !branch || !semester || !subjectCode || !result) {
      return res.status(400).json({
        success: false,
        message: "Required filters missing"
      });
    }

    const data = await Marks.aggregate([
      /* 1️⃣ Match ONLY Marks data */
      {
        $match: {
          semester: Number(semester),
          subjectCode: subjectCode.toUpperCase(),
          result: result.toUpperCase()
        }
      },

      /* 2️⃣ Join student */
      {
        $lookup: {
          from: "users",
          localField: "student",
          foreignField: "_id",
          as: "student"
        }
      },

      /* 3️⃣ Unwind */
      { $unwind: "$student" },

      /* 4️⃣ Filter student academic identity */
      {
        $match: {
          "student.regulation": regulation,
          "student.branch": branch,
          "student.role": "student"
          // ❌ DO NOT filter student.semester
        }
      },

      /* 5️⃣ Final projection */
      {
        $project: {
          _id: 0,
          rollNo: "$student.rollNo",
          name: "$student.name",
          subjectCode: 1,
          subjectName: 1,
          internalMarks: 1,
          externalMarks: 1,
          totalMarks: 1,
          grade: 1,
          gradePoint: 1,
          credits: 1,
          result: 1
        }
      }
    ]);

    res.status(200).json({
      success: true,
      totalStudents: data.length,
      students: data
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Server Error"
    });
  }
};



exports.getSubjectToppers = async (req, res) => {
  try {
    const {
      regulation,
      branch,
      semester,
      subjectCode,
      limit = 3   // default top 3
    } = req.query;

    // 🔒 Validation
    if (!regulation || !branch || !semester || !subjectCode) {
      return res.status(400).json({
        success: false,
        message: "Required filters missing"
      });
    }

    const toppers = await Marks.aggregate([
      /* 1️⃣ Match Marks */
      {
        $match: {
          semester: Number(semester),
          subjectCode: subjectCode.toUpperCase(),
          result: "PASS" // ❗ toppers must be PASS
        }
      },

      /* 2️⃣ Join Student */
      {
        $lookup: {
          from: "users",
          localField: "student",
          foreignField: "_id",
          as: "student"
        }
      },

      { $unwind: "$student" },

      /* 3️⃣ Filter Student Identity */
      {
        $match: {
          "student.regulation": regulation,
          "student.branch": branch,
          "student.role": "student"
        }
      },

      /* 4️⃣ Sort by performance */
      {
        $sort: {
          totalMarks: -1,
          gradePoint: -1
        }
      },

      /* 5️⃣ Limit */
      {
        $limit: Number(limit)
      },

      /* 6️⃣ Shape Response */
      {
        $project: {
          _id: 0,
          rollNo: "$student.rollNo",
          name: "$student.name",
          subjectCode: 1,
          subjectName: 1,
          totalMarks: 1,
          grade: 1,
          gradePoint: 1
        }
      }
    ]);

    res.status(200).json({
      success: true,
      count: toppers.length,
      toppers
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Server Error"
    });
  }
};

