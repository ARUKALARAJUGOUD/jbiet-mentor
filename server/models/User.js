const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    // ===== BASIC INFO =====
    name: {
      type: String,
      required: true,
      trim: true,
    },

    // ===== STUDENT IDENTIFIER =====
    rollNo: {
      type: String,
      unique: true,
      uppercase: true,
      trim: true,
      index: true,
      required: function () {
        return this.role === "student";
      },
    },

    // ===== FACULTY IDENTIFIER =====
    facultyId: {
      type: String,
      unique: true,
      trim: true,
      uppercase: true,
      index: true,
      required: function () {
        return this.role === "faculty";
      },
    },

    // ===== AUTH =====
    password: {
      type: String,
      required: true,
      trim: true,
      minlength: 6,
      select: false,
    },

    // ===== ROLE =====
    role: {
      type: String,
      enum: ["student", "admin", "faculty"],
      default: "student",
      index: true,
    },

    // ===== CONTACT DETAILS (STUDENT + FACULTY) =====
    email: {
      type: String,
      lowercase: true,
      trim: true,
      unique: true,
      sparse: true, // allows null for admin if needed
    },

    phone: {
      type: String,
      trim: true,
    },

    // ===== ACADEMIC DETAILS (STUDENTS ONLY) =====
    regulation: {
      type: String,
      enum: ["R18", "R20", "R22", "R23", "R24", "R25"],
      required: function () {
        return this.role === "student";
      },
      index: true,
    },

    branch: {
      type: String,
      enum: [
        "AI&DS",
        "AI&ML",
        "CE",
        "CSE",
        "CSE(AI&ML)",
        "CSE(DS)",
        "ECE",
        "ECM",
        "EEE",
        "IT",
        "ME",
      ],
      required: function () {
        return this.role === "student";
      },
      index: true,
    },

    year: {
      type: Number,
      min: 1,
      max: 4,
      required: function () {
        return this.role === "student";
      },
      index: true,
    },

    semester: {
      type: Number,
      min: 1,
      max: 8,
      required: function () {
        return this.role === "student";
      },
      index: true,
    },

    academicStatus: {
      type: String,
      enum: ["ACTIVE", "COMPLETED", "DROPPED"],
      default: "ACTIVE",
      index: true,
    },

    // ===== FACULTY DETAILS ONLY =====
    department: {
      type: String,
      enum: ["CSE", "ECE", "EEE", "MECH", "CIVIL", "IT"],
      required: function () {
        return this.role === "faculty";
      },
      index: true,
    },

    designation: {
      type: String,
      enum: [
        "Professor",
        "Associate Professor",
        "Assistant Professor",
        "Lecturer",
      ],
      required: function () {
        return this.role === "faculty";
      },
    },
  },
  {
    timestamps: true,
  },
);

//
// 🔥 INDEXES
//

// Student advanced filtering
userSchema.index(
  {
    role: 1,
    regulation: 1,
    branch: 1,
    year: 1,
    semester: 1,
    academicStatus: 1,
  },
  { name: "student_advanced_filter_index" },
);

// Faculty filtering
userSchema.index(
  {
    role: 1,
    department: 1,
    designation: 1,
  },
  { name: "faculty_filter_index" },
);


userSchema.index({ rollNo: 1, role: 1 });

// Unique identifiers
userSchema.index(
  { rollNo: 1 },
  { unique: true, sparse: true, name: "rollno_unique_index" },
);

userSchema.index(
  { facultyId: 1 },
  { unique: true, sparse: true, name: "facultyid_unique_index" },
);

module.exports = mongoose.model("User", userSchema);
