/**
 * @file otpService.js
 * @description Service module for generating and dispatching OTP verification emails.
 */

const { sendEmail } = require('./emailService.js');

/**
 * Sends a One-Time Password (OTP) verification email to the user.
 * 
 * @param {string} email - Recipient email address
 * @param {string} otp - The generated OTP code
 * @returns {Promise<void>}
 */
const sendOTPEmail = async (email, otp) => {
  const subject = "Vidyastra AI - Verification Code";
  const html = `
    <div style="font-family: sans-serif; padding: 20px; border: 1px solid #ddd; border-radius: 8px;">
      <h2>Verification Required</h2>
      <p>Hello,</p>
      <p>Your verification code for Vidyastra AI is:</p>
      <h1 style="color: #4f46e5; letter-spacing: 5px;">${otp}</h1>
      <p>This code expires in 10 minutes.</p>
      <p>If you did not request this, please ignore this email.</p>
    </div>
  `;
  
  await sendEmail(email, subject, html);
};

module.exports = {
  sendOTPEmail
};