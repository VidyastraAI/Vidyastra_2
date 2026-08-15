const Assignment = require('../../models/assignmentModel');
const { getAIAssignmentResponseFromML } = require('../../services/mlService');

// Get all assignments
exports.getAssignments = async (req, res) => {
  try {
    const assignments = await Assignment.find({});
    res.status(200).json({
      success: true,
      data: assignments
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error fetching assignments', error: error.message });
  }
};

// Submit an assignment (with optional ML evaluation/processing)
exports.submitAssignment = async (req, res) => {
  try {
    const { id } = req.params;
    const { submissionText } = req.body;
    const userId = req.user.id || req.user._id;

    const assignment = await Assignment.findById(id);
    if (!assignment) {
      return res.status(404).json({ success: false, message: 'Assignment not found.' });
    }

    // Check if submission date has passed
    if (new Date(assignment.dueDate) < new Date()) {
      return res.status(400).json({ success: false, message: 'Submission closed. Due date has passed.' });
    }

    // Optional: Communicate with the ML service to evaluate or analyze the submission content
    let mlFeedback = null;
    try {
      const mlResult = await getAIAssignmentResponseFromML({
        assignmentId: id,
        title: assignment.title,
        description: assignment.description,
        submissionText: submissionText || 'File Uploaded Successfully',
        userId,
      });
      mlFeedback = mlResult.feedback || mlResult;
    } catch (mlError) {
      console.warn('ML Service evaluation warning during submission:', mlError.message);
    }

    // Update submission info
    assignment.status = 'Submitted';
    assignment.submissionText = submissionText || 'File Uploaded Successfully';
    assignment.submittedBy = userId;
    assignment.submittedAt = new Date();
    if (mlFeedback) {
      assignment.mlFeedback = mlFeedback;
    }

    await assignment.save();

    res.status(200).json({
      success: true,
      message: 'Assignment submitted successfully!',
      data: assignment,
      mlFeedback: mlFeedback || undefined,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error submitting assignment', error: error.message });
  }
};