/**
 * @file assignmentModel.js
 * @description Updated Mongoose schema supporting file uploads via Multer and AI verification/grading status.
 */

const mongoose = require('mongoose');

const submissionSchema = new mongoose.Schema({
  studentId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  fileUrl: { type: String, required: true }, // Stored file path from multer
  submittedAt: { type: Date, default: Date.now },
  grade: { type: Number, default: null },
  feedback: { type: String, default: '' },
  // AI verification pipeline status for submitted work
  isApproved: { type: Boolean, default: false },
  approvalStatus: {
    type: String,
    enum: ['Pending_AI_Check', 'Pending_Review', 'Approved', 'Rejected'],
    default: 'Pending_AI_Check',
  },
  aiFeedback: { type: String, default: '' },
});

const assignmentSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    description: { type: String, required: true },
    courseId: { type: mongoose.Schema.Types.ObjectId, ref: 'Course', required: true },
    dueDate: { type: Date, required: true },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    submissions: [submissionSchema],
  },
  { timestamps: true }
);

module.exports = mongoose.model('Assignment', assignmentSchema);