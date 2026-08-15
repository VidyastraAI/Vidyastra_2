const Lecture = require('../../models/lectureModel');

// Get all lectures for the lecture library from the database
exports.getAllLectures = async (req, res) => {
  try {
    const lectures = await Lecture.find({});
    res.status(200).json({
      success: true,
      data: lectures
    });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching lecture library from database', error: error.message });
  }
};

// Get single lecture by ID from the database
exports.getLectureById = async (req, res) => {
  try {
    const { id } = req.params;
    const lecture = await Lecture.findById(id);

    if (!lecture) {
      return res.status(404).json({ message: 'Lecture not found.' });
    }

    res.status(200).json({
      success: true,
      data: lecture
    });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching lecture details from database', error: error.message });
  }
};