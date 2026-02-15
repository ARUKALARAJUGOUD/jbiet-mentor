const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { accessToken, refreshToken } = require("../utils/generateToken");
const Marks = require("../models/Marks");
const calculateGrade = require("../utils/calculateGrade")

exports.register = async (req, res) => {
  
  try {
    const {
      name,
      password,
      role,

      // student
      rollNo,
      branch,
      regulation,
      year,
      semester,
      academicStatus,

      // faculty
      facultyId,
      department,
      designation,
      email,
      phone
    } = req.body;

    // BEFORE hashing password

    // 🔐 Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // ================= STUDENT =================
    if (role === "student") {
      if (!rollNo || !branch || !regulation || !year || !semester) {
        return res.status(400).json({
          message:
            "rollNo, branch, regulation, year, and semester are required for students"
        });
      }

      const exists = await User.findOne({ rollNo });
      if (exists) {
        return res.status(400).json({
          message: "Roll number already exists"
        });
      }

      const user = await User.create({
        name,
        rollNo,
        password: hashedPassword,
        role,
        branch,
        regulation,
        year,
        semester,
        academicStatus: academicStatus || "ACTIVE",
        email,
        phone
      });

      return res.status(201).json({
        message: "Student registered successfully",
        userId: user._id
      });
    }

    // ================= FACULTY =================
    if (role === "faculty") {
      if (!facultyId || !department || !designation) {
        return res.status(400).json({
          message:
            "facultyId, department, and designation are required for faculty"
        });
      }

      const exists = await User.findOne({ facultyId });
      if (exists) {
        return res.status(400).json({
          message: "Faculty ID already exists"
        });
      }

      const user = await User.create({
        name,
        facultyId,
        password: hashedPassword,
        role,
        department,
        designation,
        email,
        phone
      });

      return res.status(201).json({
        message: "Faculty registered successfully",
        userId: user._id
      });
    }

    // // ================= ADMIN =================
    // const user = await User.create({
    //   name,
    //   password: hashedPassword,
    //   role
    // });

    // res.status(201).json({
    //   message: "Admin registered successfully",
    //   userId: user._id
    // });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      message: err.message
    });
  }

};




exports.login = async (req, res) => {
  console.log("API HIT : /login")
  try {
    let { userId, password } = req.body;

    if (!userId || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    userId = userId.trim().toUpperCase();
    password = password.trim();

    // 🔍 Try student first, then faculty
    const user = await User.findOne({
      $or: [
        { rollNo: userId },
        { facultyId: userId }
      ]
    }).select("+password");

    if (!user) {
      return res.status(401).json({ message: "Invalid ID or password" });
    }

    const match = await bcrypt.compare(password, user.password);
    if (!match) {
      return res.status(401).json({ message: "Invalid ID or password" });
    }

    const at = accessToken(user);
    const rt = refreshToken(user);

    res.cookie("refreshToken", rt, {
      httpOnly: true,
      sameSite: "lax",
      secure: false
    });

    res.json({
      accessToken: at,
      user: {
        id: user._id,
        name: user.name,
        role: user.role,
        rollNo: user.rollNo || null,
        facultyId: user.facultyId || null
      }
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Login failed" });
  }
};




/* REFRESH TOKEN */
exports.refresh = (req, res) => {
  console.log("API HIT : /refresh ")
  const token = req.cookies.refreshToken;
  if (!token) return res.sendStatus(401);

  jwt.verify(token, process.env.JWT_REFRESH_SECRET, (err, decoded) => {
    if (err) return res.sendStatus(403);

    const newAccess = jwt.sign(
      { id: decoded.id },
      process.env.JWT_ACCESS_SECRET,
      { expiresIn: "15m" }
    );

    res.json({ accessToken: newAccess });
  });
};

/* DASHBOARD */
exports.dashboard = async (req, res) => {
  const user = await User.findById(req.user.id).select("-password");
  res.json(user);
};

exports.MarksAdd =   async (req, res) => {
    try {
      const {
        rollNo,
        subjectCode,
        semester,
        internalMarks,
        externalMarks,
        regulation,
        branch
      } = req.body;

      const student = await User.findOne({ rollNo });
      if (!student) {
        return res.status(404).json({ error: "Student not found" });
      }

      const subject = await Subject.findOne({
        subjectCode,
        semester,
        regulation,
        branch
      });

      if (!subject) {
        return res.status(400).json({ error: "Invalid subject details" });
      }

      const internal = Number(internalMarks);
      const external = Number(externalMarks);
      const totalMarks = internal + external;

      // ✅ PASS / FAIL RULES
      const isExternalPass = external >= 21;
      const isTotalPass = totalMarks >= 40;

      let grade = "F";
      let gradePoint = 0;
      let result = "FAIL";

      if (isExternalPass && isTotalPass) {
        const gradeData = calculateGrade(totalMarks);
        grade = gradeData.grade;
        gradePoint = gradeData.gradePoint;
        result = "PASS";
      }

      const marks = await Marks.findOneAndUpdate(
        {
          student: student._id,
          subjectCode,
          semester
        },
        {
          student: student._id,
          rollNo: student.rollNo,
          subjectCode,
          subjectName: subject.subjectName,
          semester,
          internalMarks: internal,
          externalMarks: external,
          totalMarks,
          grade,
          gradePoint,
          result,
          credits: subject.credits
        },
        { new: true, upsert: true }
      );

      res.status(200).json({
        message: "Marks saved successfully",
        marks
      });

    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }

// Delete the subject through the subject code 
exports.deleteSubject = async (req, res) => {
  try {
    const { studentId, semester, subjectCode } = req.params;

    const deleted = await Marks.findOneAndDelete({
      student: studentId,
      subjectCode,
      semester: Number(semester)
    });

    if (!deleted) {
      return res.status(404).json({
        message: "Subject not found for this student in this semester"
      });
    }

    res.json({
      message: "Subject deleted successfully",
      deletedSubject: {
        subjectCode: deleted.subjectCode,
        subjectName: deleted.subjectName,
        semester: deleted.semester
      }
    });

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};



/* LOGOUT */
exports.logout = (req, res) => {
  res.clearCookie("refreshToken", {
    httpOnly: true,
    secure: false,
    sameSite: "lax"
  });
  res.json({ message: "Logged out" });
};
