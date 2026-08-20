import React, { useState } from 'react';
import { authApi } from '../../API/authApi';
import nitjLogo from '../../../assets/nitj_logo.png'; // Update with your actual image path

export default function Login() {
  // Main Auth States
  const [role, setRole] = useState('Student'); // 'Student' | 'Faculty' | 'Admin'
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  
  // Forgot Password Flow States
  const [viewMode, setViewMode] = useState('login'); // 'login' | 'forgot_email' | 'forgot_otp' | 'forgot_reset'
  
  // Forgot Password Fields
  const [forgotEmail, setForgotEmail] = useState('');
  const [otpInput, setOtpInput] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  // REAL BACKEND API: Login Handler
  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    try {
      const res = await authApi.login({
        email: email.trim(),
        password,
        role: role.toLowerCase(),
      });
      
      if (res.data?.token) {
        localStorage.setItem('token', res.data.token);
      }
      if (res.data?.user) {
        localStorage.setItem('user', JSON.stringify(res.data.user));
      }

      const userRole = (res.data?.user?.role || role).toLowerCase();

      if (userRole === 'admin') {
        window.location.href = '/admin/home';
      } else if (userRole === 'faculty') {
        window.location.href = '/faculty/home';
      } else {
        window.location.href = '/student/home';
      }
    } catch (error) {
      console.error('Login Error:', error);
      const errMsg = error.response?.data?.message || 'Invalid email or password. Please try again.';
      setMessage(`STATUS: ${errMsg}`);
    } finally {
      setLoading(false);
    }
  };

  // REAL BACKEND API: Send OTP
  const handleSendOtp = async (e) => {
    e.preventDefault();
    if (!forgotEmail) return;

    setLoading(true);
    setMessage('');

    try {
      await authApi.sendOtp(forgotEmail);
      setViewMode('forgot_otp');
      setMessage(`Verification OTP sent to ${forgotEmail}`);
    } catch (error) {
      console.error('Send OTP Error:', error);
      const errMsg = error.response?.data?.message || 'Failed to send OTP. Please check your email.';
      setMessage(`STATUS: ${errMsg}`);
    } finally {
      setLoading(false);
    }
  };

  // REAL BACKEND API: Verify OTP
  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    if (!otpInput) return;

    setLoading(true);
    setMessage('');

    try {
      await authApi.verifyOtp({ email: forgotEmail, otp: otpInput.trim() });
      setViewMode('forgot_reset');
      setMessage('OTP Verified successfully. Enter your new password.');
    } catch (error) {
      console.error('Verify OTP Error:', error);
      const errMsg = error.response?.data?.message || 'Invalid or expired OTP. Please try again.';
      setMessage(`STATUS: ${errMsg}`);
    } finally {
      setLoading(false);
    }
  };

  // REAL BACKEND API: Reset Password
  const handleResetPasswordSubmit = async (e) => {
    e.preventDefault();
    if (newPassword.length < 6) {
      alert('Password must be at least 6 characters long.');
      return;
    }
    if (newPassword !== confirmPassword) {
      alert('New Password and Confirm Password do not match!');
      return;
    }

    setLoading(true);
    setMessage('');

    try {
      await authApi.updateProfile({ email: forgotEmail, password: newPassword });
      alert('Password Reset Successful! You can now sign in with your new password.');
      
      setViewMode('login');
      setEmail(forgotEmail);
      setPassword(newPassword);
      setForgotEmail('');
      setOtpInput('');
      setNewPassword('');
      setConfirmPassword('');
      setMessage('Password reset successful. Please sign in.');
    } catch (error) {
      console.error('Reset Password Error:', error);
      const errMsg = error.response?.data?.message || 'Failed to reset password. Try again.';
      setMessage(`STATUS: ${errMsg}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#e9ecef] font-sans text-slate-800">
      {/* Top Gold Line */}
      <div className="h-[3px] bg-[#fbb03b] w-full"></div>

      {/* Responsive NITJ Header */}
      <header className="bg-[#003b6d] text-white px-4 sm:px-8 py-3">
        <div className="flex flex-col sm:flex-row items-center justify-center sm:justify-start space-y-2 sm:space-y-0 sm:space-x-4 max-w-7xl mx-auto text-center sm:text-left">
          {/* Logo Image */}
          <img 
            src={nitjLogo} 
            alt="NIT Jalandhar Logo" 
            className="w-16 h-16 sm:w-20 sm:h-20 object-contain shrink-0" 
          />
          <div className="font-serif">
            <div className="text-xs sm:text-sm font-normal text-slate-100 leading-snug tracking-wide">
              डॉ बी आर अम्बेडकर
            </div>
            <div className="text-sm sm:text-lg md:text-xl font-bold tracking-normal leading-tight">
              राष्ट्रीय प्रौद्योगिकी संस्थान जालंधर
            </div>
            <div className="text-[10px] sm:text-xs text-slate-200 tracking-normal">
              Dr B R Ambedkar
            </div>
            <div className="text-base sm:text-xl md:text-2xl font-semibold tracking-tight leading-none text-white">
              National Institute of Technology Jalandhar
            </div>
          </div>
        </div>
      </header>

      {/* Sub-Header Navigation Bar */}
      <nav className="bg-[#1a1a1a] text-[#fbb03b] text-xs sm:text-sm px-4 sm:px-8 py-2 font-medium text-center sm:text-left">
        | VIDYASTRA - ACADEMIC PORTAL |
      </nav>

      {/* Main Login Card */}
      <main className="flex-1 flex items-center justify-center p-4">
        <div className="w-full max-w-[420px] bg-white rounded-xl shadow-md border border-gray-200 p-5 sm:p-8 my-auto">
          
          {/* Header Key Lock SVG Icon */}
          <div className="flex items-center justify-center space-x-3 mb-6">
            <div className="p-2.5 bg-[#fdf8e2] rounded-lg border border-[#f3e9b6]">
              <svg className="w-6 h-6 text-[#b38600]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
            </div>
            <h2 className="text-xl sm:text-2xl font-bold text-[#003366] tracking-tight">
              {viewMode === 'login' ? 'VIDYASTRA Login' : 'Reset Password'}
            </h2>
          </div>

          {/* Alert Message */}
          {message && (
            <div className={`p-2.5 mb-4 border rounded text-xs font-semibold text-center ${
              !message.startsWith('STATUS:') 
                ? 'bg-green-50 border-green-300 text-green-800' 
                : 'bg-red-50 border-red-300 text-red-800'
            }`}>
              {message}
            </div>
          )}

          {/* LOGIN FORM */}
          {viewMode === 'login' && (
            <form onSubmit={handleLoginSubmit} className="space-y-4">
              
              {/* Role Selection */}
              <div>
                <label className="block text-xs font-bold text-[#003366] mb-1">
                  Portal Role:
                </label>
                <div className="grid grid-cols-3 gap-1 bg-gray-100 p-1 rounded border border-gray-300 text-xs font-semibold">
                  {['Student', 'Faculty', 'Admin'].map((item) => (
                    <button
                      key={item}
                      type="button"
                      onClick={() => setRole(item)}
                      className={`py-1.5 sm:py-1 rounded transition ${
                        role === item
                          ? 'bg-[#337ab7] text-white'
                          : 'text-gray-700 hover:bg-gray-200'
                      }`}
                    >
                      {item}
                    </button>
                  ))}
                </div>
              </div>

              {/* Username Field */}
              <div>
                <label className="block text-xs font-bold text-[#003366] mb-1">
                  Username:
                </label>
                <input
                  type="email"
                  placeholder="Enter Username"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="w-full px-3 py-2 text-sm border border-gray-300 rounded focus:outline-none focus:border-[#337ab7]"
                />
              </div>

              {/* Password Field */}
              <div>
                <label className="block text-xs font-bold text-[#003366] mb-1">
                  Password:
                </label>
                <input
                  type="password"
                  placeholder="Enter Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="w-full px-3 py-2 text-sm border border-gray-300 rounded focus:outline-none focus:border-[#337ab7]"
                />
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading}
                className="w-full py-2.5 bg-[#337ab7] hover:bg-[#286090] text-white font-bold text-sm rounded transition disabled:opacity-50 mt-2"
              >
                {loading ? 'Authenticating...' : 'Login'}
              </button>

              {/* Links */}
              <div className="text-right pt-2">
                <button
                  type="button"
                  onClick={() => {
                    setViewMode('forgot_email');
                    setForgotEmail(email);
                    setMessage('');
                  }}
                  className="text-xs text-red-600 hover:underline font-semibold"
                >
                  Forgot Password?
                </button>
              </div>

              <div className="text-center pt-2 text-xs border-t border-gray-100 text-gray-600">
                Don't have an account?{' '}
                <button
                  type="button"
                  onClick={() => { window.location.href = '/register'; }}
                  className="text-[#337ab7] font-bold hover:underline"
                >
                  Register here
                </button>
              </div>

            </form>
          )}

          {/* FORGOT PASSWORD STEP 1 */}
          {viewMode === 'forgot_email' && (
            <form onSubmit={handleSendOtp} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-[#003366] mb-1">
                  Registered Email:
                </label>
                <input
                  type="email"
                  placeholder="Enter Username/Email"
                  value={forgotEmail}
                  onChange={(e) => setForgotEmail(e.target.value)}
                  required
                  className="w-full px-3 py-2 text-sm border border-gray-300 rounded focus:outline-none focus:border-[#337ab7]"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-2.5 bg-[#337ab7] hover:bg-[#286090] text-white font-bold text-sm rounded transition disabled:opacity-50"
              >
                {loading ? 'Sending OTP...' : 'Send OTP'}
              </button>

              <button
                type="button"
                onClick={() => {
                  setViewMode('login');
                  setMessage('');
                }}
                className="w-full text-xs text-red-600 hover:underline text-center block pt-1"
              >
                Back to Login
              </button>
            </form>
          )}

          {/* FORGOT PASSWORD STEP 2 */}
          {viewMode === 'forgot_otp' && (
            <form onSubmit={handleVerifyOtp} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-[#003366] mb-1">
                  Verification OTP:
                </label>
                <input
                  type="text"
                  placeholder="Enter OTP Code"
                  value={otpInput}
                  onChange={(e) => setOtpInput(e.target.value)}
                  required
                  className="w-full px-3 py-2 text-center text-sm font-bold tracking-widest border border-gray-300 rounded focus:outline-none focus:border-[#337ab7]"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-2.5 bg-[#337ab7] hover:bg-[#286090] text-white font-bold text-sm rounded transition disabled:opacity-50"
              >
                {loading ? 'Verifying...' : 'Verify OTP'}
              </button>

              <button
                type="button"
                onClick={() => setViewMode('forgot_email')}
                className="w-full text-xs text-gray-600 hover:underline text-center block"
              >
                Change Email Address
              </button>
            </form>
          )}

          {/* FORGOT PASSWORD STEP 3 */}
          {viewMode === 'forgot_reset' && (
            <form onSubmit={handleResetPasswordSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-[#003366] mb-1">
                  New Password:
                </label>
                <input
                  type="password"
                  placeholder="Enter New Password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  required
                  className="w-full px-3 py-2 text-sm border border-gray-300 rounded focus:outline-none focus:border-[#337ab7]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#003366] mb-1">
                  Confirm Password:
                </label>
                <input
                  type="password"
                  placeholder="Confirm New Password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                  className="w-full px-3 py-2 text-sm border border-gray-300 rounded focus:outline-none focus:border-[#337ab7]"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-2.5 bg-[#337ab7] hover:bg-[#286090] text-white font-bold text-sm rounded transition disabled:opacity-50"
              >
                {loading ? 'Updating Password...' : 'Reset Password'}
              </button>
            </form>
          )}

        </div>
      </main>

      {/* Official Blue Footer */}
      <footer className="bg-[#003b6d] text-white text-center py-3 px-4 text-[11px] sm:text-xs leading-relaxed mt-auto">
        <p>Copyright 2026 © VidyAstra | NIT Jalandhar</p>
        <p className="text-slate-300">
          Developed by: Computer Centre, Dr. B.R. Ambedkar National Institute of Technology, Jalandhar
        </p>
      </footer>
    </div>
  );
}