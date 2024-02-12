const express = require('express');
const router = express.Router();

const {
  createStudent,
  deleteStudent,
  getAllStudents,
  updateStudent,
  getStudent,
} = require('../controllers/students');

router.route('/').post(createStudent)
router.route('/').get(getAllStudents)
router.route('/:id').get(getStudent)
router.route('/:id').delete(deleteStudent)
router.route('/:id').patch(updateStudent)

module.exports = router