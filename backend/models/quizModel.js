/**
 * @file quizModel.js
 * @description Mongoose schema for quizzes supporting AI generation, document source tracking, and review status.
 */

const mongoose = require('mongoose');

const submissionSchema = new mongoose.Schema({
  studentId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  score: { type: Number, required: true },
  totalQuestions: { type: Number, required: true },
  submittedAt: { type: Date, default: Date.now },
});

const questionSchema = new mongoose.Schema({
  questionText: { type: String, required: true },
  options: [{ type: String, required: true }],
  correctAnswer: { type: Number, required: true }, // Index of the correct option
  explanation: { type: String, default: '' },
});

const quizSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    courseId: { type: mongoose.Schema.Types.ObjectId, ref: 'Course', required: true },
    questions: [questionSchema],
    submissions: [submissionSchema],
    // Workflow tracking for AI-generated quizzes
    isApproved: { type: Boolean, default: false },
    approvalStatus: {
      type: String,
      enum: ['Pending_Generation', 'Pending_Review', 'Approved', 'Rejected'],
      default: 'Pending_Review',
    },
    sourceFileUrl: { type: String, default: '' }, // Optional reference document/lecture used to generate quiz
  },
  { timestamps: true }
);

module.exports = mongoose.model('Quiz', quizSchema);