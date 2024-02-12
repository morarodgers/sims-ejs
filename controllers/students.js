const Student = require('../models/student')

const getAllStudents = async (req, res) => {
  const students = await Student.find({ createdBy: req.user.userId }).sort('createdAt')
  res.render('students', { students });
}
const getStudent = async (req, res) => {
  const {
    user: { userId },
    params: { id: studentId },
  } = req

  const student = await Student.findOne({
    _id: studentId,
    createdBy: userId,
  })
  if (!student) {
    req.flash("error",`No student with id ${studentId} found`);
  }
  res.redirect('/students');
};

const createStudent = async (req, res) => {
  try {
    const {firstName, secondName, surname, dateOfBirth, admNumber, className } = req.body;

    if (!firstName || !secondName || !surname || !dateOfBirth || !admNumber || !className) {
      req.flash("error", "first name, second name, surname, date of birth, admission number and class name fields cannot be empty.");
      return res.redirect('/students/new');
    } 

    req.body.createdBy = req.user.id;
    await Student.create(req.body);
    req.flash("info", "The student has been successfully added.")
  } catch (err) {
    req.flash("error", "Undefined error.")
  }
  res.redirect('/students');
};

const updateStudent = async (req, res) => {
  const {
    body: { firstName, secondName, surname, dateOfBirth, admNumber, className },
    user: { userId },
    params: { id: studentId },
  } = req

  if (!firstName || !secondName || !surname || !dateOfBirth || !admNumber || !className) {
    req.flash('error', "You must include the first name, second name, surname, date of birth, admission number and class name");
    return res.redirect(`/students/edit/${studentId}`);
  }

  const student = await Student.findByIdAndUpdate(
    { _id: studentId, createdBy: userId },
    req.body,
    { new: true, runValidators: true }
  )
  if (!student) {
    req.flash("error",`No student with id ${studentId} found`);
  } else {
    req.flash("info", "The student has been successfully deleted.");
  }
  res.redirect('/students');
}

const deleteStudent = async (req, res) => {
  const {
    user: { userId },
    params: { id: studentId },
  } = req

  const student = await Student.findByIdAndRemove({
    _id: studentId,
    createdBy: userId,
  })
  if (!student) {
    req.flash("error",`No student with id ${studentId} found`);
  } else {
    req.flash("info", "The student has been successfully deleted.");
  }
  res.redirect('/students');
};

module.exports = {
  createStudent,
  deleteStudent,
  getAllStudents,
  updateStudent,
  getStudent,
};