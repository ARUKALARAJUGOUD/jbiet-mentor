const mongoose = require("mongoose");

const attendanceSchema = new mongoose.Schema(
  {
    student: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    subjectCode: {
      type: String,
      required: true,
      uppercase: true,
    },

    subjectName: {
      type: String,
      required: true,
      trim: true,
    },

    semester: {
      type: Number,
      required: true,
      min: 1,
      max: 8,
    },

    date: {
      type: Date,
      required: true,
    },

    fromTime: {
      type: String,
      required: true,
    },

    toTime: {
      type: String,
      required: true,
    },

    status: {
      type: String,
      enum: ["PRESENT", "ABSENT"],
      required: true,
    },
  },
  { timestamps: true },
);

attendanceSchema.index({
  student: 1,
  semester: 1,
  subjectCode: 1,
  status: 1,
});

/* 🔥 1️⃣ Main student attendance query */
attendanceSchema.index({ student: 1, semester: 1, date: 1 });
attendanceSchema.index({ student: 1, date: 1 });

/* 🔥 2️⃣ Prevent duplicate attendance */
attendanceSchema.index(
  { student: 1, date: 1, fromTime: 1, toTime: 1 },
  { unique: true },
);

/* 🔥 3️⃣ Optional: date-based admin filtering */
attendanceSchema.index({ date: 1 });

module.exports = mongoose.model("Attendance", attendanceSchema);
