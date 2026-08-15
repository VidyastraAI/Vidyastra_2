const express = require('express');
const router = express.Router();
const { generateOrFetchNotes } = require('../../controllers/student/aiNotes');
const { verifyToken } = require('../../middleware/authMiddleware');

// Route protected by student authentication token and forwarding notes requests to ML backend
router.post('/generate', verifyToken, generateOrFetchNotes);

module.exports = router;