const { getAINotesResponseFromML } = require('../../services/mlService');

// Fetch or generate AI notes via ML service
exports.generateOrFetchNotes = async (req, res) => {
  try {
    const { topic, course } = req.body;

    if (!topic) {
      return res.status(400).json({
        success: false,
        message: 'Topic keyword is required to generate AI revision notes.',
      });
    }

    // Communicate strictly with the ML service
    const notesData = await getAINotesResponseFromML({
      topic,
      course: course || 'General Studies',
    });

    res.status(200).json({
      success: true,
      data: notesData,
    });
  } catch (error) {
    res.status(502).json({
      success: false,
      message: 'ML Service communication error. Please ensure the AI microservice is active.',
      error: error.message,
    });
  }
};