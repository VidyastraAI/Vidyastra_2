const express = require('express');
const router = express.Router();
const { getAllLectures, getLectureById } = require('../../controllers/student/lectureLibrary');
const { verifyToken } = require('../../middleware/authMiddleware');

router.get('/', verifyToken, getAllLectures);
router.get('/:id', verifyToken, getLectureById);

module.exports = router;