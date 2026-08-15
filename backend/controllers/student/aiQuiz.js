const { getAIQuizResponseFromML } = require('../../services/mlService');

// Fetch or generate quizzes via ML service
exports.generateOrFetchQuiz = async (req, res) => {
  try {
    const { topic, difficulty } = req.body;

    if (!topic) {
      return res.status(400).json({
        success: false,
        message: 'Topic keyword is required to generate an AI quiz.',
      });
    }

    // Communicate strictly with the ML service
    const quizData = await getAIQuizResponseFromML({
      topic,
      difficulty: difficulty || 'Medium',
    });

    res.status(200).json({
      success: true,
      data: quizData,
    });
  } catch (error) {
    res.status(502).json({
      success: false,
      message: 'ML Service communication error. Please ensure the AI microservice is active.',
      error: error.message,
    });
  }
};