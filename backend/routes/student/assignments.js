const express = require('express');
const router = express.Router();
const {
  getAssignments,
  submitAssignment
} = require('../../controllers/student/assignments');
const { verifyToken } = require('../../middleware/authMiddleware');

router.get('/', verifyToken, getAssignments);
router.post('/:id/submit', verifyToken, submitAssignment);

module.exports = router;