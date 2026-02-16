const mongoose = require("mongoose");

const subjectSchema = new mongoose.Schema(
  {
    // ===== SUBJECT IDENTIFICATION =====
    subjectCode: {
      type: String,
      required: true,
      uppercase: true,
      trim: true,
      index: true,
    },

    subjectName: {
      type: String,
      required: true,
      trim: true,
    },

    // ===== ACADEMIC MAPPING =====
    regulation: {
      type: String,
      required: true,
      enum: ["R18", "R20", "R22", "R23", "R24", "R25"],
      index: true,
    },

    branch: {
      type: String,
      required: true,
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
      index: true,
    },

    semester: {
      type: Number,
      required: true,
      min: 1,
      max: 8,
      index: true,
    },

    credits: {
      type: Number,
      required: true,
      min: 0,
      max: 15,
    },
  },
  {
    timestamps: true,
  },
);

/**
 * Prevent duplicate subject entries
 * Same subjectCode should not repeat
 * for same regulation + branch + semester
 */
subjectSchema.index(
  { subjectCode: 1, regulation: 1, branch: 1, semester: 1 },
  { unique: true },
);

module.exports = mongoose.model("Subject", subjectSchema);
