const express = require('express');
const router = express.Router();
const {
  getAllNotifications,
  markAsRead,
  deleteNotification
} = require('../../controllers/student/notifications');
const { verifyToken } = require('../../middleware/authMiddleware');

router.get('/', verifyToken, getAllNotifications);
router.patch('/:id/read', verifyToken, markAsRead);
router.delete('/:id', verifyToken, deleteNotification);

module.exports = router;