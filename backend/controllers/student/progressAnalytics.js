const User = require('../../models/userModel');
const Quiz = require('../../models/quizModel');
const Lecture = require('../../models/lectureModel');

// Get user progress and analytics metrics based on existing models
exports.getProgressAnalytics = async (req, res) => {
  try {
    const userId = req.user.id || req.user._id;

    // Fetch user details, quizzes count, and lectures count concurrently
    const [user, quizzesCount, lecturesCount] = await Promise.all([
      User.findById(userId),
      Quiz.countDocuments({}),
      Lecture.countDocuments({})
    ]);

    res.status(200).json({
      success: true,
      data: {
        progress: {
          completedModules: user?.enrolledCourses?.length || 0,
          totalModules: 10,
          quizScores: []
        },
        quizzesCount,
        lecturesCount
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error fetching progress analytics', error: error.message });
  }
};