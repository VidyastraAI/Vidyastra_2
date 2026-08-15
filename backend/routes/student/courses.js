const express = require('express');
const router = express.Router();
const { getStudentCourses } = require('../../controllers/student/courses');
const { verifyToken } = require('../../middleware/authMiddleware');

router.get('/', verifyToken, getStudentCourses);

module.exports = router;