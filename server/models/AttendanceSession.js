

const mongoose = require("mongoose");

const attendanceSchema = new mongoose.Schema(
  {
    // ===== STUDENT =====
    student: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true
    },

    // ===== SUBJECT =====
    subjectCode: {
      type: String,
      required: true,
      uppercase: true,
      index: true
    },
    subjectName: {
      type: String,
      required: true,
      trim: true
    },
    semester: {
      type: Number,
      required: true,
      min: 1,
      max: 8,
      index: true
    },

    // ===== DATE & TIME =====
    date: {
      type: Date,
      required: true,
      index: true
    },

    fromTime: {
      type: String, // "09:00"
      required: true
    },

    toTime: {
      type: String, // "10:00"
      required: true
    },

    // ===== ATTENDANCE STATUS =====
    status: {
      type: String,
      enum: ["PRESENT", "ABSENT"],
      required: true
    }
  },
  {
    timestamps: true
  }
);

/**
 * 🚫 Prevent duplicate attendance
 * Same student cannot have attendance
 * at the same date + same time slot
 * (even if subject is different)
 */
attendanceSchema.index(
  {
    student: 1,
    date: 1,
    fromTime: 1,
    toTime: 1
  },
  { unique: true }
);

module.exports = mongoose.model("Attendance", attendanceSchema);
