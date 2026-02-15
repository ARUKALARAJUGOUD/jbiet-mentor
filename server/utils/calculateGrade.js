module.exports = function calculateGrade(totalMarks) {
  if (totalMarks >= 90) return { grade: "O", gradePoint: 10 };
  if (totalMarks >= 80) return { grade: "A+", gradePoint: 9 };
  if (totalMarks >= 70) return { grade: "A", gradePoint: 8 };
  if (totalMarks >= 60) return { grade: "B+", gradePoint: 7 };
  if (totalMarks >= 50) return { grade: "B", gradePoint: 6 };
  if (totalMarks >= 40) return { grade: "C", gradePoint: 5 };
  return { grade: "F", gradePoint: 0 };
};
