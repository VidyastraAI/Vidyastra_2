const express = require('express');
const router = express.Router();
const { getStudentDashboard } = require('../../controllers/student/dashboard');
const { verifyToken } = require('../../middleware/authMiddleware');

router.get('/', verifyToken, getStudentDashboard);

module.exports = router;