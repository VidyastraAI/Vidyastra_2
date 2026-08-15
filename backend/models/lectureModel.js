/**
 * @file lectureModel.js
 * @description Mongoose schema supporting multiple video files/parts per lecture.
 */

const mongoose = require('mongoose');

const videoPartSchema = new mongoose.Schema({
  partNumber: { type: Number, required: true },
  title: { type: String, required: true },
  videoUrl: { type: String, required: true }, // File path or storage URL
  duration: { type: String }, // e.g. "15 mins"
  processingStatus: {
    type: String,
    enum: ['Pending', 'Processing', 'Ready', 'Failed'],
    default: 'Pending',
  },
});

const lectureSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    description: { type: String },
    courseId: { type: mongoose.Schema.Types.ObjectId, ref: 'Course', required: true },
    videos: [videoPartSchema],
    transcript: { type: String, default: '' },
    uploadedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Lecture', lectureSchema);