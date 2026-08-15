const Notification = require('../../models/notificationModel');

// Get all notifications for the student
exports.getAllNotifications = async (req, res) => {
  try {
    const notifications = await Notification.find({}).sort({ createdAt: -1 });
    res.status(200).json({
      success: true,
      data: notifications
    });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching notifications', error: error.message });
  }
};

// Mark a specific notification as read
exports.markAsRead = async (req, res) => {
  try {
    const { id } = req.params;
    const notification = await Notification.findByIdAndUpdate(
      id,
      { isRead: true },
      { new: true }
    );

    if (!notification) {
      return res.status(404).json({ message: 'Notification not found.' });
    }

    res.status(200).json({
      success: true,
      message: 'Notification marked as read.',
      data: notification
    });
  } catch (error) {
    res.status(500).json({ message: 'Error updating notification status', error: error.message });
  }
};

// Delete a notification
exports.deleteNotification = async (req, res) => {
  try {
    const { id } = req.params;
    const notification = await Notification.findByIdAndDelete(id);

    if (!notification) {
      return res.status(404).json({ message: 'Notification not found.' });
    }

    res.status(200).json({
      success: true,
      message: 'Notification deleted successfully.'
    });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting notification', error: error.message });
  }
};