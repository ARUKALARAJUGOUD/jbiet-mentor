exports.getSemesterGPA = async (req, res) => {
  const semester = Number(req.params.semester);

  const records = await Marks.find({
    student: req.user.id,
    semester
  });

  let totalCredits = 0;
  let weightedPoints = 0;

  records.forEach(r => {
    totalCredits += r.credits;
    weightedPoints += r.gradePoint * r.credits;
  });

  const sgpa =
    totalCredits > 0
      ? (weightedPoints / totalCredits).toFixed(2)
      : 0;

  res.json({ semester, sgpa });
};
