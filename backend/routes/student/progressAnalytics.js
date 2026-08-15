const express = require('express');
const router = express.Router();
const { getProgressAnalytics } = require('../../controllers/student/progressAnalytics');
const { verifyToken } = require('../../middleware/authMiddleware');

router.get('/', verifyToken, getProgressAnalytics);

module.exports = router;