const User = require('../../models/userModel');
const Course = require('../../models/courseModel');

// Get Enrolled Courses for Student
exports.getStudentCourses = async (req, res) => {
  try {
    const userId = req.user.id;

    // Fetch user and safely populate courses with strictPopulate set to false
    const user = await User.findById(userId).populate({
      path: 'courses',
      model: 'Course',
      strictPopulate: false
    });

    if (!user) {
      return res.status(404).json({ message: 'User not found.' });
    }

    // Fallback: if user.courses isn't an array of populated documents or is empty,
    // query courses directly using User's course IDs or fetch all courses if preferred.
    let courses = user.courses || [];
    if (courses.length === 0 || typeof courses[0] === 'string' || courses[0] instanceof require('mongoose').Types.ObjectId) {
      courses = await Course.find({ _id: { $in: user.courses || [] } });
    }

    res.status(200).json({
      success: true,
      data: courses
    });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching student courses', error: error.message });
  }
};