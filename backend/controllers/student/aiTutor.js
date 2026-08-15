const { getAITutorResponseFromML } = require('../../services/mlService');

// Handle AI Tutor chat interactions by proxying to the ML service
exports.handleAITutorChat = async (req, res) => {
  try {
    const { message, subject, topic } = req.body;

    if (!message) {
      return res.status(400).json({
        success: false,
        message: 'Message content is required.',
      });
    }

    // Communicate strictly with the ML service
    const reply = await getAITutorResponseFromML({
      message,
      subject: subject || 'General',
      topic: topic || 'General',
    });

    res.status(200).json({
      success: true,
      reply,
    });
  } catch (error) {
    res.status(502).json({
      success: false,
      message: 'ML Service communication error. Please ensure the AI microservice is active.',
      error: error.message,
    });
  }
};