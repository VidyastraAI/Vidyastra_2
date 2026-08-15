const express = require('express');
const router = express.Router();
const { generateOrFetchQuiz } = require('../../controllers/student/aiQuiz');
const { verifyToken } = require('../../middleware/authMiddleware');

// Route protected by student authentication token and forwarding quiz requests to ML backend
router.post('/generate', verifyToken, generateOrFetchQuiz);

module.exports = router;