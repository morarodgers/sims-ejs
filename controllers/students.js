const Student = require('../models/student');
const parseVErr = require("../utils/parseValidationErrs");

const gender_values = Student.schema.path("gender").enumValues;


const getAllStudents = async (req, res) => {
  const students = await Student.find({ createdBy: req.user.id });
  res.render("pages/students", {
    students: students,
    errors: req.flash("error"),
    info: req.flash("info"),
  });
};

const createStudent = (req, res) => {
  const student_values = {
    firstName:"",
    secondName:"",
    surname:"",
    dateOfBirth:"",
    admNumber:"",
    className:"",
    gender:"",
    action:"/students/add",
    submit: "Add",
    title: "Add a student",
  };
  res.render("pages/student", {
    gender_values,
    student_values,
    errors: req.flash("error"),
    info: req.flash("info"),
  });
};

const addStudent = async(req, res, next) => {
  try {
    await Student.create({
      firstName: req.body.firstName,
      secondName: req.body.secondName,
      surname: req.body.surname,
      dateOfBirth: req.body.dateOfBirth,
      admNumber: req.body.admNumber,
      className: req.body.className,
      gender: req.body.gender,
      createdBy: req.user.id,
    });
  } catch (e) {
    if (e.name === "ValidationError") {
      parseVErr(e, req);
      const student_values = {
        firstName: req.body.firstName,
        secondName: req.body.secondName,
        surname: req.body.surname,
        dateOfBirth: req.body.dateOfBirth,
        admNumber: req.body.admNumber,
        className: req.body.className,
        gender: req.body.gender,
        action:"/students/add",
        submit: "Add",
        title: "Add a student",
      };
      return res.render("pages/student", {
        gender_values,
        student_values,
        errors: req.flash("error"),
        info: req.flash("info"),
      });
    } else {
      return next(e);
    }
  }
  req.flash("info", "The student has been successfully added.")
  res.redirect("/students")
};

const editStudent = async (req, res) => {
  const student = await Student.findOne({
    _id: req.params.student,
    createdBy: req.user.id,
  });
  if (!student) {
    req.flash("error", "That student was not found.");
    return res.redirect("/students");
  }
  const student_values = {};
  student_values.firstName = student.firstName || "";
  student_values.secondName = student.secondName || "";
  student_values.surname = student.surname || "";
  student_values.dateOfBirth = student.dateOfBirth || "";
  student_values.admNumber = student.admNumber || "";
  student_values.className = student.className || "";
  student_values.gender = student.gender || "";
  student_values.action = `/students/update/${student._id}`;
  student_values.submit = "Update";
  student_values.title = "Edit a Studnet Entry";
  res.render("pages/student", {
    gender_values,
    student_values,
    errors: req.flash("error"),
    info: req.flash("info"),
  });
};

const updateStudent = async (req, res, next) => {
  let student = null;
  try {
    student = await Student.findOneAndUpdate(
      { _id: req.params.student, createdBy: req.user.id },
      req.body,
      { runValidators: true }
    );
  } catch (e) {
    if (e.name === "ValidationError") {
      parseVErr(e, req);
      const student_values = {};
      student_values.firstName = req.body.firstName;
      student_values.secondName = req.body.secondName;
      student_values.surname = req.body.surname;
      student_values.dateOfBirth = req.body.dateOfBirth;
      student_values.admNumber = req.body.admNumber;
      student_values.className = req.body.className;
      student_values.gender = req.body.gender;
      student_values.action = `/students/update/${req.params.student}`;
      student_values.submit = "Update";
      student_values.title = "Edit a Student Entry";
      return res.render("pages/student", {
        gender_values,
        student_values,
        errors: req.flash("error"),
        info: req.flash("info"),
      });
    } else {
      return next(e);
    }
  }
  if (student) {
    req.flash("info", "The student entry was updated.");
  } else {
    req.flash("error", "The student entry was not found.");
  }
  res.redirect("/students");
};

const deleteStudent = async (req, res, next) => {
  const student = await Student.findOneAndDelete({
    _id: req.params.student,
    createdBy: req.user.id,
  });
  if (!student) {
    req.flash("error",`The student was not found`);
  } else {
    req.flash("info", "The student has been successfully deleted.");
  }
  res.redirect('/students');
};

module.exports = {
  getAllStudents,
  createStudent,
  addStudent,
  editStudent,
  updateStudent,
  deleteStudent
};