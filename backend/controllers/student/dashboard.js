const User = require('../../models/userModel');
const Course = require('../../models/courseModel');
const Assignment = require('../../models/assignmentModel');
const Quiz = require('../../models/quizModel');

// Get Student Dashboard Data including independent Course model fetching
exports.getStudentDashboard = async (req, res) => {
  try {
    const userId = req.user.id;
    
    // Fetch user details
    const user = await User.findById(userId);
    
    if (!user) {
      return res.status(404).json({ message: 'User not found.' });
    }

    // Fetch courses, assignments, and quizzes from their respective models
    const courses = await Course.find({ _id: { $in: user.courses || [] } });
    const assignments = await Assignment.find({ student: userId });
    const quizzes = await Quiz.find({ student: userId });

    // Enrolled Courses count
    const enrolledCoursesCount = courses.length;

    // Filter pending assignments and count pending quizzes
    const pendingAssignments = assignments.filter(a => a.status === 'Pending');
    const pendingQuizzesCount = quizzes.filter(q => q.status === 'Pending').length;

    // Calculate Overall Progress dynamically from fetched course documents
    let overallProgressValue = 0;
    if (enrolledCoursesCount > 0) {
      const totalProgress = courses.reduce((acc, course) => acc + (course.progress || 0), 0);
      overallProgressValue = Math.round(totalProgress / enrolledCoursesCount);
    }

    // Profile Name & Streak
    const profileName = user.name || 'Student';
    const studyStreak = user.studyStreak ? `${user.studyStreak} Days` : '0 Days';
    const overallProgress = `${overallProgressValue}%`;

    const stats = {
      enrolledCoursesCount,
      pendingQuizzesCount,
      studyStreak,
      overallProgress
    };

    const aiRecommendation = user.aiRecommendation || {
      topic: 'General Studies',
      description: 'Keep up with your course modules and quizzes to optimize your learning path.'
    };

    res.status(200).json({
      profileName,
      stats,
      courses,
      assignments: pendingAssignments,
      quizzes,
      aiRecommendation
    });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching student dashboard data from respective models', error: error.message });
  }
};