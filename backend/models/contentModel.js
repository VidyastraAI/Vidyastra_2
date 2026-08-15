/**
 * @file contentModel.js
 * @description Updated Mongoose schema supporting status workflow for AI-generated notes.
 */

const mongoose = require('mongoose');

const contentSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    type: { type: String, enum: ['notes', 'resource', 'module', 'assignment_material'], required: true },
    courseId: { type: mongoose.Schema.Types.ObjectId, ref: 'Course', required: true },
    fileUrl: { type: String, required: true },
    uploadedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    // Workflow tracking for AI-generated content (notes)
    isApproved: { type: Boolean, default: false },
    approvalStatus: {
      type: String,
      enum: ['Pending_Generation', 'Pending_Review', 'Approved', 'Rejected'],
      default: 'Pending_Review',
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Content', contentSchema);