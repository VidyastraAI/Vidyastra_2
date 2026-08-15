import React, { useState } from 'react';
import { authApi } from '../../API/authApi';

export default function Register() {
  // Step Flow State: 'email' | 'otp' | 'details'
  const [step, setStep] = useState('email');

  // Form Data States
  const [role, setRole] = useState('Student');
  const [email, setEmail] = useState('');
  const [otpInput, setOtpInput] = useState('');
  const [fullName, setFullName] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  // UI States
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  // ----------------------------------------------------
  // STEP 1: Send OTP to Email
  // ----------------------------------------------------
  const handleSendOtp = async (e) => {
    e.preventDefault();
    if (!email.trim()) return;

    setLoading(true);
    setMessage('');

    try {
      // API Call to Send OTP
      await authApi.sendOtp(email.trim());
      setStep('otp');
      setMessage(`✓ Verification OTP sent to ${email.trim()}!`);
    } catch (error) {
      console.error('Send OTP Error:', error);
      const errMsg = error.response?.data?.message || 'Failed to send OTP. Please check your email.';
      setMessage(`❌ ${errMsg}`);
    } finally {
      setLoading(false);
    }
  };

  // ----------------------------------------------------
  // STEP 2: Verify OTP
  // ----------------------------------------------------
  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    if (!otpInput.trim()) return;

    setLoading(true);
    setMessage('');

    try {
      // API Call to Verify OTP
      await authApi.verifyOtp({ email: email.trim(), otp: otpInput.trim() });
      setStep('details');
      setMessage('✓ Email verified successfully! Fill details to complete registration.');
    } catch (error) {
      console.error('Verify OTP Error:', error);
      const errMsg = error.response?.data?.message || 'Invalid or expired OTP. Try again.';
      setMessage(`❌ ${errMsg}`);
    } finally {
      setLoading(false);
    }
  };

  // ----------------------------------------------------
  // STEP 3: Complete Account Registration
  // ----------------------------------------------------
  const handleFinalRegisterSubmit = async (e) => {
    e.preventDefault();

    if (password.length < 6) {
      setMessage('❌ Password must be at least 6 characters long!');
      return;
    }

    if (password !== confirmPassword) {
      setMessage('❌ Passwords do not match!');
      return;
    }

    setLoading(true);
    setMessage('');

    try {
      // API Call to Register User in Backend
      await authApi.register({
        name: fullName,
        email: email.trim(),
        password,
        role: role.toLowerCase(),
      });

      alert('Registration successful! Redirecting to login page...');
      window.location.href = '/login';
    } catch (error) {
      console.error('Registration error:', error);
      const errMsg = error.response?.data?.message || 'Failed to create account. Try again.';
      setMessage(`❌ ${errMsg}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-slate-50/95 backdrop-blur-md rounded-[32px] p-8 shadow-2xl space-y-6 border border-white/20 animate-fadeIn">
        
        {/* Brand Header */}
        <div className="text-center space-y-2">
          <div className="w-14 h-14 rounded-2xl bg-indigo-600 text-white font-black text-2xl flex items-center justify-center mx-auto shadow-lg shadow-indigo-500/30">
            V
          </div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">VidyAstra AI</h1>
          <p className="text-xs text-slate-500 font-medium">
            {step === 'email' && 'Step 1 of 3: Verify your Email'}
            {step === 'otp' && 'Step 2 of 3: Enter OTP Code'}
            {step === 'details' && 'Step 3 of 3: Complete Profile Details'}
          </p>
        </div>

        {/* Status Alert Message */}
        {message && (
          <div className={`p-3 border rounded-2xl text-xs font-bold text-center animate-fadeIn ${
            message.startsWith('✓')
              ? 'bg-emerald-50 border-emerald-200 text-emerald-700'
              : 'bg-rose-50 border-rose-200 text-rose-700'
          }`}>
            {message}
          </div>
        )}

        {/* =================================------------------ */}
        {/* STEP 1: EMAIL & ACCOUNT TYPE INPUT */}
        {/* =================================------------------ */}
        {step === 'email' && (
          <form onSubmit={handleSendOtp} className="space-y-4 animate-fadeIn">
            <div className="space-y-1">
              <label className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400">
                ACCOUNT TYPE
              </label>
              <div className="grid grid-cols-2 gap-2 bg-slate-200/60 p-1 rounded-2xl">
                {['Student', 'Faculty'].map((item) => (
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
                className="w-full px-4 py-3 bg-indigo-50/50 border border-indigo-100/80 rounded-2xl text-xs font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-600"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-2xl shadow-lg transition active:scale-95 disabled:opacity-50 cursor-pointer"
            >
              {loading ? 'Sending OTP...' : 'Send Verification OTP 📩'}
            </button>

            <p className="text-center text-xs font-medium text-slate-500 pt-2">
              Already have an account?{' '}
              <button
                type="button"
                onClick={() => { window.location.href = '/login'; }}
                className="font-bold text-indigo-600 hover:underline cursor-pointer"
              >
                Sign In
              </button>
            </p>
          </form>
        )}

        {/* =================================------------------ */}
        {/* STEP 2: VERIFY OTP INPUT */}
        {/* =================================------------------ */}
        {step === 'otp' && (
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
              className="w-full py-3.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-2xl shadow-lg transition active:scale-95 disabled:opacity-50 cursor-pointer"
            >
              {loading ? 'Verifying OTP...' : 'Verify OTP Code ✓'}
            </button>

            <button
              type="button"
              onClick={() => {
                setStep('email');
                setMessage('');
              }}
              className="w-full py-2 text-xs font-bold text-slate-500 hover:text-slate-800 text-center transition cursor-pointer"
            >
              ← Change Email Address
            </button>
          </form>
        )}

        {/* =================================------------------ */}
        {/* STEP 3: FULL NAME & PASSWORDS DETAILS */}
        {/* =================================------------------ */}
        {step === 'details' && (
          <form onSubmit={handleFinalRegisterSubmit} className="space-y-4 animate-fadeIn">
            <div className="space-y-1">
              <label className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400">
                FULL NAME
              </label>
              <input
                type="text"
                placeholder="e.g. Mohit"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                required
                className="w-full px-4 py-3 bg-indigo-50/50 border border-indigo-100/80 rounded-2xl text-xs font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-600"
              />
            </div>

            <div className="space-y-1">
              <label className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400">
                PASSWORD
              </label>
              <input
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full px-4 py-3 bg-indigo-50/50 border border-indigo-100/80 rounded-2xl text-xs font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-600"
              />
            </div>

            <div className="space-y-1">
              <label className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400">
                CONFIRM PASSWORD
              </label>
              <input
                type="password"
                placeholder="••••••••"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                className="w-full px-4 py-3 bg-indigo-50/50 border border-indigo-100/80 rounded-2xl text-xs font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-600"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-2xl shadow-lg transition active:scale-95 disabled:opacity-50 cursor-pointer"
            >
              {loading ? 'Creating Account...' : 'Complete Registration 🚀'}
            </button>
          </form>
        )}

      </div>
    </div>
  );
}