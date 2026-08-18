const User = require('../../models/userModel');
const Course = require('../../models/courseModel');
const Lecture = require('../../models/lectureModel');

// Get courses enrolled by the logged-in student
exports.getStudentCourses = async (req, res) => {
  try {
    const studentId = req.user.id;

    const user = await User.findById(studentId).select('courses');

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'Student not found.'
      });
    }

    const courses = await Course.find({
      _id: { $in: user.courses || [] }
    })
      .populate('instructor', 'name email')
      .sort({ createdAt: -1 });

    const coursesWithDetails = await Promise.all(
      courses.map(async (course) => {
        const lectureCount = await Lecture.countDocuments({
          courseId: course._id
        });

        return {
          _id: course._id,
          title: course.title,
          description: course.description,
          category: course.category,
          price: course.price,
          instructor: course.instructor,
          lectureCount,
          createdAt: course.createdAt,
          updatedAt: course.updatedAt
        };
      })
    );

    return res.status(200).json({
      success: true,
      data: coursesWithDetails
    });

  } catch (error) {
    console.error('Get student courses error:', error);

    return res.status(500).json({
      success: false,
      message: 'Error fetching student courses.',
      error: error.message
    });
  }
};


// Get one enrolled course by ID
exports.getStudentCourseById = async (req, res) => {
  try {
    const studentId = req.user.id;
    const { courseId } = req.params;

    const user = await User.findById(studentId).select('courses');

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'Student not found.'
      });
    }

    const isEnrolled = user.courses?.some(
      (id) => id.toString() === courseId
    );

    if (!isEnrolled) {
      return res.status(403).json({
        success: false,
        message: 'You are not enrolled in this course.'
      });
    }

    const course = await Course.findById(courseId)
      .populate('instructor', 'name email');

    if (!course) {
      return res.status(404).json({
        success: false,
        message: 'Course not found.'
      });
    }

    const lectures = await Lecture.find({
      courseId: course._id
    }).sort({ createdAt: 1 });

    return res.status(200).json({
      success: true,
      data: {
        course,
        lectures
      }
    });

  } catch (error) {
    console.error('Get student course by ID error:', error);

    return res.status(500).json({
      success: false,
      message: 'Error fetching course details.',
      error: error.message
    });
  }
};