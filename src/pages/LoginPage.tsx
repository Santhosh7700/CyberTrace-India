import React, { useState } from 'react';
import { Link, useNavigate, useLocation, Navigate } from 'react-router-dom';
import { useAuth } from '../context/useAuth';

export default function LoginPage() {
  const { login, isAuthenticated, registeredUsersCount } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const routeState = location.state as { registeredEmail?: string; message?: string } | null;

  const [email, setEmail] = useState(() => routeState?.registeredEmail || '');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  // Validation errors
  const [errors, setErrors] = useState<{ email?: string; password?: string }>({});

  // Informational / mock feedback banners
  const [feedback, setFeedback] = useState<{
    type: 'info' | 'success' | 'warning';
    message: string;
  } | null>(() => (routeState?.message ? { type: 'info', message: routeState.message } : null));

  // If already authenticated, redirect to dashboard
  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />;
  }

  const validate = () => {
    const newErrors: { email?: string; password?: string } = {};

    if (!email.trim()) {
      newErrors.email = 'Email address is required.';
    } else {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email.trim())) {
        newErrors.email = 'Please enter a valid email address (e.g., citizen@example.com).';
      }
    }

    if (!password) {
      newErrors.password = 'Password is required.';
    } else if (password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters.';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setFeedback(null);

    if (!validate()) {
      return;
    }

    // Authenticate against temporary demo accounts created through registration
    const result = login(email, password);

    if (!result.success) {
      setFeedback({
        type: 'warning',
        message: result.error || 'Authentication failed. Please verify your credentials.',
      });
      return;
    }

    // Success: navigate to the authenticated welcome page
    const target = (location.state as { from?: string })?.from || '/dashboard';
    navigate(target, { replace: true });
  };

  const handleForgotPassword = (e: React.MouseEvent) => {
    e.preventDefault();
    setFeedback({
      type: 'warning',
      message:
        'Password recovery service is a placeholder and will be enabled when the citizen authentication system is fully implemented.',
    });
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-between">
      {/* Top Utility Header (Mobile & Tablet Back Link) */}
      <div className="max-w-[1400px] w-full mx-auto px-4 sm:px-6 lg:px-10 xl:px-14 py-4 flex items-center justify-between">
        <Link
          to="/"
          className="flex items-center gap-2 text-blue-800 font-bold text-xl tracking-tight hover:opacity-90 transition-opacity"
        >
          <ShieldIcon />
          <span>
            CyberTrace<span className="text-blue-500">India</span>
          </span>
        </Link>
        <Link
          to="/"
          className="inline-flex items-center gap-1.5 text-sm font-medium text-slate-600 hover:text-blue-700 transition-colors"
        >
          <ArrowLeftIcon />
          Back to Home
        </Link>
      </div>

      {/* Main Two-Column Container */}
      <main className="flex-1 max-w-[1400px] w-full mx-auto px-4 sm:px-6 lg:px-10 xl:px-14 py-6 sm:py-10 flex items-center">
        <div className="w-full grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          
          {/* Left Column: Branding, Illustration & Security Message */}
          <div className="lg:col-span-6 xl:col-span-7 flex flex-col justify-center text-center lg:text-left">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-blue-100 text-blue-700 text-xs font-semibold rounded-full tracking-wide uppercase border border-blue-200 self-center lg:self-start mb-4">
              <LockShieldIcon />
              <span>Official Citizen Access</span>
            </div>

            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-slate-900 leading-tight mb-4">
              Welcome <span className="text-blue-700">Back</span>
            </h1>

            <p className="text-slate-600 text-base sm:text-lg leading-relaxed max-w-xl mx-auto lg:mx-0 mb-8">
              Sign in to access your account and manage your reported cyber fraud cases.
            </p>

            {/* Cybersecurity Visual Illustration */}
            <div className="my-2 max-w-sm sm:max-w-md mx-auto lg:mx-0 w-full">
              <LoginIllustration />
            </div>

            {/* Small Security Reassurance Message */}
            <div className="mt-8 max-w-lg mx-auto lg:mx-0 bg-white border border-blue-100 rounded-xl p-4 flex items-start gap-3 shadow-xs">
              <div className="w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center text-blue-600 shrink-0 mt-0.5">
                <CheckBadgeIcon />
              </div>
              <div>
                <h2 className="text-xs font-semibold text-slate-800 uppercase tracking-wider">
                  Secure Citizen Portal
                </h2>
                <p className="text-xs text-slate-500 leading-relaxed mt-0.5">
                  Your session is safeguarded with end-to-end security protocols. All reported incident evidence and citizen data are strictly confidential.
                </p>
              </div>
            </div>
          </div>

          {/* Right Column: Citizen Login Form Card */}
          <div className="lg:col-span-6 xl:col-span-5 flex justify-center lg:justify-end">
            <div className="w-full max-w-md bg-white rounded-2xl border border-slate-200 shadow-sm p-6 sm:p-8 md:p-10">
              
              {/* Form Header */}
              <div className="mb-6">
                <h2 className="text-2xl font-bold text-slate-900 tracking-tight">Citizen Login</h2>
                <p className="text-sm text-slate-500 mt-1">
                  Enter your verified credentials to access your reported cases.
                </p>
              </div>

              {/* Help tip when no user has registered yet */}
              {!feedback && registeredUsersCount === 0 && (
                <div className="mb-5 p-3 bg-blue-50/70 border border-blue-200/60 rounded-xl text-xs text-blue-800 flex items-start gap-2">
                  <span className="shrink-0 mt-0.5"><InfoCircleIcon /></span>
                  <p>
                    <span className="font-semibold">Demo Authentication:</span> No accounts registered in this session yet. Please{' '}
                    <Link to="/register" className="font-bold underline hover:text-blue-950">
                      register a demo account
                    </Link>{' '}
                    first to test login.
                  </p>
                </div>
              )}

              {/* Informational Feedback Banner */}
              {feedback && (
                <div
                  className={`mb-6 p-4 rounded-xl text-xs sm:text-sm flex items-start gap-3 border ${
                    feedback.type === 'info'
                      ? 'bg-blue-50 border-blue-200 text-blue-800'
                      : feedback.type === 'warning'
                      ? 'bg-amber-50 border-amber-200 text-amber-800'
                      : 'bg-emerald-50 border-emerald-200 text-emerald-800'
                  }`}
                  role="alert"
                >
                  <span className="shrink-0 mt-0.5">
                    {feedback.type === 'info' ? (
                      <InfoCircleIcon />
                    ) : feedback.type === 'warning' ? (
                      <AlertTriangleIcon />
                    ) : (
                      <CheckCircleIcon />
                    )}
                  </span>
                  <p className="leading-relaxed">{feedback.message}</p>
                </div>
              )}

              {/* Login Form */}
              <form onSubmit={handleSubmit} noValidate className="space-y-5">
                
                {/* Email Field */}
                <div>
                  <label htmlFor="login-email" className="block text-sm font-medium text-slate-700 mb-1.5">
                    Email Address <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                      <MailIcon />
                    </div>
                    <input
                      id="login-email"
                      type="email"
                      autoComplete="email"
                      value={email}
                      onChange={(e) => {
                        setEmail(e.target.value);
                        if (errors.email) {
                          setErrors((prev) => ({ ...prev, email: undefined }));
                        }
                      }}
                      placeholder="e.g. citizen@example.com"
                      className={`block w-full pl-10 pr-3 py-2.5 text-sm bg-white border rounded-lg transition-colors focus:outline-none ${
                        errors.email
                          ? 'border-red-400 text-slate-900 focus:border-red-500 focus:ring-2 focus:ring-red-100'
                          : 'border-slate-300 text-slate-900 focus:border-blue-600 focus:ring-2 focus:ring-blue-100'
                      }`}
                      aria-invalid={!!errors.email}
                      aria-describedby={errors.email ? 'email-error' : undefined}
                    />
                  </div>
                  {errors.email && (
                    <p id="email-error" className="mt-1.5 text-xs text-red-600 flex items-center gap-1">
                      <AlertCircleIcon />
                      <span>{errors.email}</span>
                    </p>
                  )}
                </div>

                {/* Password Field */}
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label htmlFor="login-password" className="block text-sm font-medium text-slate-700">
                      Password <span className="text-red-500">*</span>
                    </label>
                    <button
                      type="button"
                      onClick={handleForgotPassword}
                      className="text-xs font-semibold text-blue-700 hover:text-blue-800 hover:underline transition-colors focus:outline-none focus:underline"
                    >
                      Forgot Password?
                    </button>
                  </div>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                      <KeyIcon />
                    </div>
                    <input
                      id="login-password"
                      type={showPassword ? 'text' : 'password'}
                      autoComplete="current-password"
                      value={password}
                      onChange={(e) => {
                        setPassword(e.target.value);
                        if (errors.password) {
                          setErrors((prev) => ({ ...prev, password: undefined }));
                        }
                      }}
                      placeholder="••••••••"
                      className={`block w-full pl-10 pr-10 py-2.5 text-sm bg-white border rounded-lg transition-colors focus:outline-none ${
                        errors.password
                          ? 'border-red-400 text-slate-900 focus:border-red-500 focus:ring-2 focus:ring-red-100'
                          : 'border-slate-300 text-slate-900 focus:border-blue-600 focus:ring-2 focus:ring-blue-100'
                      }`}
                      aria-invalid={!!errors.password}
                      aria-describedby={errors.password ? 'password-error' : undefined}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword((prev) => !prev)}
                      className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-600 focus:outline-none"
                      aria-label={showPassword ? 'Hide password' : 'Show password'}
                    >
                      {showPassword ? <EyeOffIcon /> : <EyeIcon />}
                    </button>
                  </div>
                  {errors.password && (
                    <p id="password-error" className="mt-1.5 text-xs text-red-600 flex items-center gap-1">
                      <AlertCircleIcon />
                      <span>{errors.password}</span>
                    </p>
                  )}
                </div>

                {/* Remember Me Checkbox */}
                <div className="flex items-center justify-between">
                  <label className="flex items-center gap-2 cursor-pointer select-none">
                    <input
                      type="checkbox"
                      checked={rememberMe}
                      onChange={(e) => setRememberMe(e.target.checked)}
                      className="w-4 h-4 text-blue-700 border-slate-300 rounded focus:ring-blue-500"
                    />
                    <span className="text-xs sm:text-sm text-slate-600">Remember Me</span>
                  </label>
                  <span className="text-xs text-slate-400">Secure Session</span>
                </div>

                {/* Sign In Button */}
                <button
                  type="submit"
                  className="w-full flex items-center justify-center gap-2 py-3 px-4 bg-blue-700 hover:bg-blue-800 text-white text-sm font-semibold rounded-lg shadow-sm transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                >
                  <SignInIcon />
                  Sign In
                </button>
              </form>

              {/* Bottom Registration & Home Links */}
              <div className="mt-6 pt-6 border-t border-slate-100 text-center space-y-3">
                <p className="text-xs sm:text-sm text-slate-600">
                  Don't have an account?{' '}
                  <Link
                    to="/register"
                    className="font-semibold text-blue-700 hover:text-blue-800 hover:underline transition-colors focus:outline-none"
                  >
                    Create Account
                  </Link>
                </p>

                <div>
                  <Link
                    to="/"
                    className="inline-flex items-center gap-1.5 text-xs text-slate-500 hover:text-blue-700 transition-colors"
                  >
                    <ArrowLeftIcon />
                    Back to Home
                  </Link>
                </div>
              </div>

            </div>
          </div>

        </div>
      </main>

      {/* Footer Disclaimer */}
      <footer className="border-t border-slate-200 py-4 bg-white">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-10 xl:px-14 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-slate-500 text-center sm:text-left">
          <span>CyberTrace-India • Citizen Cybercrime Reporting System Prototype</span>
          <span>Not an official government portal. For urgent emergency cyber fraud, call 1930.</span>
        </div>
      </footer>
    </div>
  );
}

/* ── Inline SVG Illustration ─────────────────────────────────── */
function LoginIllustration() {
  return (
    <div className="w-full aspect-16/10 max-h-72">
      <svg viewBox="0 0 520 320" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
        {/* Soft Background Plate */}
        <rect x="20" y="20" width="480" height="280" rx="20" fill="#f8fafc" stroke="#e2e8f0" strokeWidth="2" />
        
        {/* Decorative Grid Pattern */}
        <circle cx="60" cy="60" r="3" fill="#cbd5e1" />
        <circle cx="90" cy="60" r="3" fill="#cbd5e1" />
        <circle cx="120" cy="60" r="3" fill="#cbd5e1" />
        <circle cx="60" cy="90" r="3" fill="#cbd5e1" />
        <circle cx="90" cy="90" r="3" fill="#cbd5e1" />
        <circle cx="120" cy="90" r="3" fill="#cbd5e1" />

        {/* Central Shield Base */}
        <path
          d="M260 50 L340 90 L340 170 C340 225 305 265 260 280 C215 265 180 225 180 170 L180 90 Z"
          fill="#dbeafe"
          stroke="#2563eb"
          strokeWidth="3"
          strokeLinejoin="round"
        />

        {/* Inner Shield Layer */}
        <path
          d="M260 70 L320 100 L320 165 C320 210 295 242 260 256 C225 242 200 210 200 165 L200 100 Z"
          fill="#eff6ff"
        />

        {/* Lock Icon inside Shield */}
        <rect x="240" y="145" width="40" height="32" rx="6" fill="#1d4ed8" />
        <path
          d="M247 145 V133 C247 125.8 252.8 120 260 120 C267.2 120 273 125.8 273 133 V145"
          stroke="#1d4ed8"
          strokeWidth="4"
          strokeLinecap="round"
          fill="none"
        />
        <circle cx="260" cy="159" r="3" fill="#ffffff" />
        <path d="M260 162 V168" stroke="#ffffff" strokeWidth="2.5" strokeLinecap="round" />

        {/* Left Floating Card: Authentication Validated */}
        <rect x="50" y="140" width="120" height="70" rx="10" fill="#ffffff" stroke="#93c5fd" strokeWidth="2" filter="drop-shadow(0 4px 6px rgba(0,0,0,0.05))" />
        <circle cx="75" cy="165" r="12" fill="#dcfce7" />
        <path d="M70 165 L73 168 L80 161" stroke="#16a34a" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        <rect x="95" y="157" width="55" height="6" rx="3" fill="#94a3b8" />
        <rect x="95" y="168" width="40" height="5" rx="2.5" fill="#cbd5e1" />
        <path d="M75 190 H145" stroke="#e2e8f0" strokeWidth="2" strokeLinecap="round" />

        {/* Right Floating Card: Data Protected */}
        <rect x="350" y="100" width="125" height="75" rx="10" fill="#ffffff" stroke="#93c5fd" strokeWidth="2" filter="drop-shadow(0 4px 6px rgba(0,0,0,0.05))" />
        <circle cx="375" cy="125" r="12" fill="#eff6ff" />
        <path d="M375 119 L370 122 V127 C370 130 372 133 375 134 C378 133 380 130 380 127 V122 Z" fill="#3b82f6" />
        <rect x="395" y="118" width="60" height="6" rx="3" fill="#94a3b8" />
        <rect x="395" y="129" width="45" height="5" rx="2.5" fill="#cbd5e1" />
        <circle cx="375" cy="155" r="4" fill="#22c55e" />
        <text x="385" y="158" fill="#475569" fontSize="9" fontWeight="600" fontFamily="sans-serif">256-Bit SSL</text>

        {/* Connecting Dashed Security Lines */}
        <path d="M170 175 C185 175 185 170 195 170" stroke="#93c5fd" strokeWidth="2" strokeDasharray="4 4" />
        <path d="M325 140 C335 140 338 135 350 135" stroke="#93c5fd" strokeWidth="2" strokeDasharray="4 4" />

        {/* Bottom Key Card */}
        <rect x="330" y="210" width="110" height="40" rx="8" fill="#ffffff" stroke="#cbd5e1" strokeWidth="1.5" />
        <circle cx="350" cy="230" r="7" fill="#fef3c7" />
        <path d="M350 227 V233 M347 230 H353" stroke="#d97706" strokeWidth="1.5" strokeLinecap="round" />
        <text x="365" y="234" fill="#64748b" fontSize="10" fontWeight="500" fontFamily="sans-serif">Citizen Portal</text>
      </svg>
    </div>
  );
}

/* ── UI Icons ────────────────────────────────────────────────── */
function ShieldIcon() {
  return (
    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M12 2L4 6v5c0 5.25 3.4 10.15 8 11.35C16.6 21.15 20 16.25 20 11V6L12 2z"
        fill="#1d4ed8"
        opacity="0.15"
      />
      <path
        d="M12 2L4 6v5c0 5.25 3.4 10.15 8 11.35C16.6 21.15 20 16.25 20 11V6L12 2z"
        stroke="#1d4ed8"
        strokeWidth="1.5"
        strokeLinejoin="round"
      />
      <path d="M9 12l2 2 4-4" stroke="#1d4ed8" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function LockShieldIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M12 2L4 6v5c0 5.25 3.4 10.15 8 11.35C16.6 21.15 20 16.25 20 11V6L12 2z" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" />
    </svg>
  );
}

function ArrowLeftIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M19 12H5M12 19l-7-7 7-7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function CheckBadgeIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M9 12l2 2 4-4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.8" />
    </svg>
  );
}

function MailIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <polyline points="22,6 12,13 2,6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function KeyIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M21 2l-2 2m-1.5 1.5L14 9l-1.5-1.5-2 2L12 11l-3 3a5.5 5.5 0 11-1.5-1.5l3-3 1.5 1.5 2-2L14.5 7.5 18 4l2-2z"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function EyeIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" stroke="currentColor" strokeWidth="1.8" />
      <circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth="1.8" />
    </svg>
  );
}

function EyeOffIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M17.94 17.94A10.07 10.07 0 0112 20c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19m-6.72-1.07a3 3 0 11-4.24-4.24" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
      <line x1="1" y1="1" x2="23" y2="23" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function SignInIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M15 3h4a2 2 0 012 2v14a2 2 0 01-2 2h-4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      <polyline points="10 17 15 12 10 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      <line x1="15" y1="12" x2="3" y2="12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function AlertCircleIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden="true" className="shrink-0">
      <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" />
      <line x1="12" y1="8" x2="12" y2="12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      <line x1="12" y1="16" x2="12.01" y2="16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}

function InfoCircleIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true" className="shrink-0 text-blue-600">
      <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" />
      <line x1="12" y1="16" x2="12" y2="12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      <line x1="12" y1="8" x2="12.01" y2="8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}

function AlertTriangleIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true" className="shrink-0 text-amber-600">
      <path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      <line x1="12" y1="9" x2="12" y2="13" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      <line x1="12" y1="17" x2="12.01" y2="17" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}

function CheckCircleIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true" className="shrink-0 text-emerald-600">
      <path d="M22 11.08V12a10 10 0 11-5.93-9.14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      <polyline points="22 4 12 14.01 9 11.01" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
