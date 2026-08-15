const crypto = require('crypto');
const User = require('../models/userModel');
const Otp = require('../models/otpModel'); // Ensure you have an OTP model created
const { sendOTPEmail } = require('../services/otpService');

const generateSalt = () => crypto.randomBytes(16).toString('hex');
const hashPassword = (password, salt) => crypto.scryptSync(password, salt, 64).toString('hex');
const generateToken = () => crypto.randomBytes(32).toString('hex');

// Register User
exports.registerUser = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists with this email.' });
    }

    const salt = generateSalt();
    const hashedPassword = hashPassword(password, salt);
    const authToken = generateToken();

    const newUser = new User({
      name,
      email,
      password: hashedPassword,
      salt,
      authToken,
      role: role || 'Student',
    });

    await newUser.save();
    res.status(201).json({ message: 'Registration successful. Please login.', userId: newUser._id });
  } catch (error) {
    res.status(500).json({ message: 'Server error during registration', error: error.message });
  }
};

// Login User
exports.loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: 'User not found.' });
    }

    const isMatch = user.password === hashPassword(password, user.salt);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid credentials.' });
    }

    const token = generateToken();
    user.authToken = token;
    await user.save();

    res.status(200).json({
      message: 'Login successful',
      token,
      role: user.role,
      user: { id: user._id, name: user.name, email: user.email, role: user.role },
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error during login', error: error.message });
  }
};

// Send OTP (Stores email & OTP in a separate Otp collection without requiring prior user lookup)
exports.sendOtp = async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) {
      return res.status(400).json({ message: 'Email is required.' });
    }

    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const otpExpires = Date.now() + 10 * 60 * 1000; // 10 minutes expiry

    // Upsert the OTP document for this email
    await Otp.findOneAndUpdate(
      { email },
      { otp, otpExpires },
      { upsert: true, new: true, setDefaultsOnInsert: true }
    );

    // Send via email service
    await sendOTPEmail(email, otp);

    res.status(200).json({ message: 'OTP sent successfully to email.' });
  } catch (error) {
    res.status(500).json({ message: 'Error sending OTP', error: error.message });
  }
};

// Verify OTP (Checks against the separate Otp collection)
exports.verifyOtp = async (req, res) => {
  try {
    const { email, otp } = req.body;
    if (!email || !otp) {
      return res.status(400).json({ message: 'Email and OTP are required.' });
    }

    const otpRecord = await Otp.findOne({ email });

    if (!otpRecord || otpRecord.otp !== otp || otpRecord.otpExpires < Date.now()) {
      return res.status(400).json({ message: 'Invalid or expired OTP.' });
    }

    // Remove OTP record after successful verification
    await Otp.deleteOne({ email });

    // Optional: If you also want to mark the user as verified if they exist
    await User.updateOne({ email }, { isVerified: true });

    res.status(200).json({ message: 'OTP verified successfully.' });
  } catch (error) {
    res.status(500).json({ message: 'Error verifying OTP', error: error.message });
  }
};