const express = require('express');
const router = express.Router();
const {
  getProfile,
  updateProfile
} = require('../../controllers/student/profileSettings');
const { verifyToken } = require('../../middleware/authMiddleware');

router.get('/', verifyToken, getProfile);
router.put('/', verifyToken, updateProfile);

module.exports = router;