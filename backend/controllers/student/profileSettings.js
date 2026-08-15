const User = require('../../models/userModel'); // Adjust path to your user model if necessary
const bcrypt = require('bcryptjs');

// Get student profile details
exports.getProfile = async (req, res) => {
  try {
    // Assuming req.user is populated via auth middleware (e.g., verifyToken)
    const userId = req.user.id || req.user._id;
    const user = await User.findById(userId).select('-password');

    if (!user) {
      return res.status(404).json({ success: false, message: 'User profile not found.' });
    }

    res.status(200).json({
      success: true,
      data: user
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error fetching profile', error: error.message });
  }
};

// Update student profile details & password
exports.updateProfile = async (req, res) => {
  try {
    const userId = req.user.id || req.user._id;
    const { name, fullName, email, institution, phone, password } = req.body;

    const updateData = {};
    if (name) updateData.name = name;
    if (fullName) updateData.fullName = fullName;
    if (email) updateData.email = email;
    if (institution) updateData.institution = institution;
    if (phone) updateData.phone = phone;

    // Handle password update if provided
    if (password) {
      const salt = await bcrypt.genSalt(10);
      updateData.password = await bcrypt.hash(password, salt);
    }

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { $set: updateData },
      { new: true, runValidators: true }
    ).select('-password');

    if (!updatedUser) {
      return res.status(404).json({ success: false, message: 'User not found.' });
    }

    res.status(200).json({
      success: true,
      message: 'Profile updated successfully!',
      data: updatedUser
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error updating profile', error: error.message });
  }
};