import React, { useState } from 'react';
import { authApi } from '../../API/authApi';

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
      // POST /auth/login
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

      // Redirect Based on Role
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
      setMessage(`❌ ${errMsg}`);
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
      setMessage(`✓ Verification OTP sent to ${forgotEmail}!`);
    } catch (error) {
      console.error('Send OTP Error:', error);
      const errMsg = error.response?.data?.message || 'Failed to send OTP. Please check your email.';
      setMessage(`❌ ${errMsg}`);
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
      setMessage('✓ OTP Verified! Enter your new password.');
    } catch (error) {
      console.error('Verify OTP Error:', error);
      const errMsg = error.response?.data?.message || 'Invalid or expired OTP. Please try again.';
      setMessage(`❌ ${errMsg}`);
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
      setMessage('✓ Password reset successful. Please sign in.');
    } catch (error) {
      console.error('Reset Password Error:', error);
      const errMsg = error.response?.data?.message || 'Failed to reset password. Try again.';
      setMessage(`❌ ${errMsg}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center p-4">
      
      {/* Login Card */}
      <div className="w-full max-w-md bg-slate-50/95 backdrop-blur-md rounded-[32px] p-8 shadow-2xl space-y-6 border border-white/20 animate-fadeIn">
        
        {/* Brand Header */}
        <div className="text-center space-y-2">
          <div className="w-14 h-14 rounded-2xl bg-indigo-600 text-white font-black text-2xl flex items-center justify-center mx-auto shadow-lg shadow-indigo-500/30">
            V
          </div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">VidyAstra AI</h1>
          <p className="text-xs text-slate-500 font-medium">
            {viewMode === 'login'
              ? 'Sign in to access your intelligent dashboard'
              : 'Reset your password securely'}
          </p>
        </div>

        {/* Status Message */}
        {message && (
          <div className="p-3 bg-indigo-50 border border-indigo-200 rounded-2xl text-xs font-bold text-indigo-700 text-center animate-fadeIn">
            {message}
          </div>
        )}

        {/* LOGIN FORM */}
        {viewMode === 'login' && (
          <form onSubmit={handleLoginSubmit} className="space-y-5">
            
            {/* Select Portal Role */}
            <div className="space-y-1.5">
              <label className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400">
                SELECT PORTAL ACCESS
              </label>
              <div className="grid grid-cols-3 gap-1 bg-slate-200/60 p-1 rounded-2xl">
                {['Student', 'Faculty', 'Admin'].map((item) => (
                  <button
                    key={item}
                    type="button"
                    onClick={() => setRole(item)}
                    className={`py-2 rounded-xl text-xs font-bold transition ${
                      role === item
                        ? 'bg-white text-indigo-600 shadow-sm'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    {item}
                  </button>
                ))}
              </div>
            </div>

            {/* Email Field */}
            <div className="space-y-1">
              <label className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400">
                EMAIL ADDRESS
              </label>
              <input
                type="email"
                placeholder="name@domain.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full px-4 py-3 bg-indigo-50/50 border border-indigo-100/80 rounded-2xl text-xs font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-600 transition"
              />
            </div>

            {/* Password Field */}
            <div className="space-y-1">
              <div className="flex justify-between items-center">
                <label className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400">
                  PASSWORD
                </label>
                <button
                  type="button"
                  onClick={() => {
                    setViewMode('forgot_email');
                    setForgotEmail(email);
                    setMessage('');
                  }}
                  className="text-xs font-bold text-indigo-600 hover:underline transition"
                >
                  Forgot password?
                </button>
              </div>
              <input
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full px-4 py-3 bg-indigo-50/50 border border-indigo-100/80 rounded-2xl text-xs font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-600 transition"
              />
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-2xl shadow-lg shadow-indigo-600/30 transition active:scale-95 disabled:opacity-50"
            >
              {loading ? 'Authenticating...' : `Sign In as ${role}`}
            </button>

            {/* Redirection to Register Page */}
            <p className="text-center text-xs font-medium text-slate-500 pt-2">
              Don't have an account?{' '}
              <button
                type="button"
                onClick={() => { window.location.href = '/register'; }}
                className="font-bold text-indigo-600 hover:underline cursor-pointer"
              >
                Create an account
              </button>
            </p>

          </form>
        )}

        {/* FORGOT PASSWORD STEP 1 */}
        {viewMode === 'forgot_email' && (
          <form onSubmit={handleSendOtp} className="space-y-4 animate-fadeIn">
            <div className="space-y-1">
              <label className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400">
                ENTER YOUR REGISTERED EMAIL
              </label>
              <input
                type="email"
                placeholder="name@domain.com"
                value={forgotEmail}
                onChange={(e) => setForgotEmail(e.target.value)}
                required
                className="w-full px-4 py-3 bg-indigo-50/50 border border-indigo-100 rounded-2xl text-xs font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-600"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-2xl shadow-lg transition active:scale-95 disabled:opacity-50"
            >
              {loading ? 'Sending OTP Code...' : 'Send OTP Code 📩'}
            </button>

            <button
              type="button"
              onClick={() => {
                setViewMode('login');
                setMessage('');
              }}
              className="w-full py-2 text-xs font-bold text-slate-500 hover:text-slate-800 text-center transition"
            >
              ← Back to Sign In
            </button>
          </form>
        )}

        {/* FORGOT PASSWORD STEP 2 */}
        {viewMode === 'forgot_otp' && (
          <form onSubmit={handleVerifyOtp} className="space-y-4 animate-fadeIn">
            <div className="space-y-1">
              <label className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400">
                ENTER VERIFICATION OTP
              </label>
              <input
                type="text"
                placeholder="Enter received OTP"
                value={otpInput}
                onChange={(e) => setOtpInput(e.target.value)}
                required
                className="w-full px-4 py-3 bg-indigo-50/50 border border-indigo-100 rounded-2xl text-center text-lg font-black tracking-widest text-indigo-600 focus:outline-none focus:ring-2 focus:ring-indigo-600"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-2xl shadow-lg transition active:scale-95 disabled:opacity-50"
            >
              {loading ? 'Verifying OTP...' : 'Verify OTP Code ✓'}
            </button>

            <button
              type="button"
              onClick={() => setViewMode('forgot_email')}
              className="w-full py-2 text-xs font-bold text-slate-500 hover:text-slate-800 text-center transition"
            >
              ← Change Email Address
            </button>
          </form>
        )}

        {/* FORGOT PASSWORD STEP 3 */}
        {viewMode === 'forgot_reset' && (
          <form onSubmit={handleResetPasswordSubmit} className="space-y-4 animate-fadeIn">
            <div className="space-y-1">
              <label className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400">
                CREATE NEW PASSWORD
              </label>
              <input
                type="password"
                placeholder="At least 6 characters"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                required
                className="w-full px-4 py-3 bg-indigo-50/50 border border-indigo-100 rounded-2xl text-xs font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-600"
              />
            </div>

            <div className="space-y-1">
              <label className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400">
                CONFIRM NEW PASSWORD
              </label>
              <input
                type="password"
                placeholder="Re-enter new password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                className="w-full px-4 py-3 bg-indigo-50/50 border border-indigo-100 rounded-2xl text-xs font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-600"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-2xl shadow-lg transition active:scale-95 disabled:opacity-50"
            >
              {loading ? 'Updating Password...' : 'Set New Password & Sign In 🔐'}
            </button>
          </form>
        )}

      </div>

    </div>
  );
}