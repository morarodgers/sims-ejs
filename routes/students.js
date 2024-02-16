const express = require('express');
const router = express.Router();

const {
  getAllStudents,
  createStudent,
  addStudent,
  editStudent,
  updateStudent,
  deleteStudent
} = require('../controllers/students');

router.route('/').get(getAllStudents)
router.route('/add').get(createStudent).post(addStudent)
router.route('/edit/:student').get(editStudent)
router.route('/update/:student').post(updateStudent)
router.route('/delete/:student').delete(deleteStudent)

module.exports = router