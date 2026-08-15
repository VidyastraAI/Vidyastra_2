const express = require('express');
const router = express.Router();
const { handleAITutorChat } = require('../../controllers/student/aiTutor');
const { verifyToken } = require('../../middleware/authMiddleware');

// Route protected by student authentication token and forwarding to ML-backed controller
router.post('/tutor', verifyToken, handleAITutorChat);

module.exports = router;