
const mongoose = require("mongoose");

const marksSchema = new mongoose.Schema(
  {
    student: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true
    },

    subjectCode: {
      type: String,
      required: true,
      uppercase: true,
      index: true
    },
      subjectName: {
      type: String,
      required: true
    },
      credits: {
      type: Number,
      required: true,
      min: 0.5,
      max: 6
    },
    semester: {
      type: Number,
      required: true,
      min: 1,
      max: 8,
      index: true
    },

    internalMarks: {
      type: Number,
      required: true,
      min: 0,
      max: 40
    },

    externalMarks: {
      type: Number,
      required: true,
      min: 0,
      max: 60
    },

    totalMarks: Number,

    grade: {
      type: String,
      enum: ["O", "A+", "A", "B+", "B", "C", "F"],
      required: true
    },

    gradePoint: {
      type: Number,
      required: true,
      min: 0,
      max: 10
    },
    result:{
      type:String,
      required:true
    }
  },
  { timestamps: true }
);

/* Auto-calc total marks */
marksSchema.pre("save", function (next) {
  this.totalMarks = this.internalMarks + this.externalMarks;
  next();
});

/* 🔥 Main performance index (MOST IMPORTANT) */
marksSchema.index({ student: 1, semester: 1 });


/* One subject per student per semester */
marksSchema.index(
  { student: 1, subjectCode: 1, semester: 1 },
  { unique: true }
);

module.exports = mongoose.model("Marks", marksSchema);
