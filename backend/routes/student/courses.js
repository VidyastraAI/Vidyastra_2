const express = require('express');
const router = express.Router();

const {
  getStudentCourses,
  getStudentCourseById
} = require('../../controllers/student/courses');

const { verifyToken } = require('../../middleware/authMiddleware');

router.get('/', verifyToken, getStudentCourses);

router.get('/:courseId', verifyToken, getStudentCourseById);

module.exports = router;