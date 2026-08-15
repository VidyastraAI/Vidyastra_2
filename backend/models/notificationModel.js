/**
 * @file notificationModel.js
 * @description Mongoose schema for notifications supporting targeted recipients or role-based broadcasts.
 */

const mongoose = require('mongoose');

const notificationSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    message: { type: String, required: true },
    recipient: { 
      type: mongoose.Schema.Types.ObjectId, 
      ref: 'User', 
      default: null // null means it applies to audienceRole or all users globally
    },
    audienceRole: { 
      type: String, 
      enum: ['all', 'admin', 'faculty', 'student'], 
      default: 'all' // Defaults to all users
    },
    isRead: { type: Boolean, default: false },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Notification', notificationSchema);
