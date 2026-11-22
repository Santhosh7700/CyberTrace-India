import React, { useState } from 'react';
import { Link, useNavigate, useLocation, Navigate } from 'react-router-dom';
import { useAuth } from '../context/useAuth';
import { DEMO_INVESTIGATOR_CREDENTIALS, DEMO_ADMIN_CREDENTIALS } from '../context/authConstants';

type LoginMode = 'citizen' | 'investigator' | 'admin';

export default function LoginPage() {
  const { login, loginInvestigator, loginAdmin, isAuthenticated, userRole, registeredUsersCount } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const routeState = location.state as { registeredEmail?: string; message?: string } | null;

  // Active Login Mode Switcher
  const [loginMode, setLoginMode] = useState<LoginMode>('citizen');

  // Citizen Login State
  const [email, setEmail] = useState(() => routeState?.registeredEmail || '');
  const [citizenPassword, setCitizenPassword] = useState('');
  const [citizenShowPassword, setCitizenShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);

  // Investigator Login State
  const [cyberId, setCyberId] = useState('');
  const [investigatorPassword, setInvestigatorPassword] = useState('');
  const [investigatorShowPassword, setInvestigatorShowPassword] = useState(false);

  // Admin Login State (Task 09)
  const [adminId, setAdminId] = useState('');
  const [adminPassword, setAdminPassword] = useState('');
  const [adminShowPassword, setAdminShowPassword] = useState(false);

  // Validation errors
  const [errors, setErrors] = useState<{
    email?: string;
    citizenPassword?: string;
    cyberId?: string;
    investigatorPassword?: string;
    adminId?: string;
    adminPassword?: string;
  }>({});

  // Feedback banners
  const [feedback, setFeedback] = useState<{
    type: 'info' | 'success' | 'warning';
    message: string;
  } | null>(() => (routeState?.message ? { type: 'info', message: routeState.message } : null));

  // If already authenticated, redirect to appropriate role portal
  if (isAuthenticated) {
    if (userRole === 'admin') {
      return <Navigate to="/admin" replace />;
    }
    if (userRole === 'investigator') {
      return <Navigate to="/investigator" replace />;
    }
    return <Navigate to="/dashboard" replace />;
  }

  const validateCitizen = () => {
    const newErrors: { email?: string; citizenPassword?: string } = {};

    if (!email.trim()) {
      newErrors.email = 'Email address is required.';
    } else {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email.trim())) {
        newErrors.email = 'Please enter a valid email address (e.g., citizen@example.com).';
      }
    }

    if (!citizenPassword) {
      newErrors.citizenPassword = 'Password is required.';
    } else if (citizenPassword.length < 6) {
      newErrors.citizenPassword = 'Password must be at least 6 characters.';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateInvestigator = () => {
    const newErrors: { cyberId?: string; investigatorPassword?: string } = {};

    if (!cyberId.trim()) {
      newErrors.cyberId = 'Official Cyber ID is required.';
    } else if (cyberId.trim().length < 5) {
      newErrors.cyberId = 'Please enter a valid Cyber ID (e.g., CYB-IN-20481).';
    }

    if (!investigatorPassword) {
      newErrors.investigatorPassword = 'Official authorization password is required.';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateAdmin = () => {
    const newErrors: { adminId?: string; adminPassword?: string } = {};

    if (!adminId.trim()) {
      newErrors.adminId = 'Official Admin ID is required.';
    } else if (adminId.trim().length < 4) {
      newErrors.adminId = 'Please enter a valid Admin ID (e.g., CT-ADMIN-001).';
    }

    if (!adminPassword) {
      newErrors.adminPassword = 'Admin authorization password is required.';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleCitizenSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setFeedback(null);

    if (!validateCitizen()) return;

    const result = login(email, citizenPassword);
    if (!result.success) {
      setFeedback({
        type: 'warning',
        message: result.error || 'Authentication failed. Please verify your credentials.',
      });
      return;
    }

    const target = (location.state as { from?: string })?.from || '/dashboard';
    navigate(target, { replace: true });
  };

  const handleInvestigatorSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setFeedback(null);

    if (!validateInvestigator()) return;

    const result = loginInvestigator(cyberId, investigatorPassword);
    if (!result.success) {
      setFeedback({
        type: 'warning',
        message: result.error || 'Investigator authentication failed. Invalid Cyber ID or password.',
      });
      return;
    }

    navigate('/investigator', { replace: true });
  };

  const handleAdminSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setFeedback(null);

    if (!validateAdmin()) return;

    const result = loginAdmin(adminId, adminPassword);
    if (!result.success) {
      setFeedback({
        type: 'warning',
        message: result.error || 'Admin authentication failed. Invalid Admin ID or password.',
      });
      return;
    }

    navigate('/admin', { replace: true });
  };

  const handleUseDemoInvestigator = () => {
    setCyberId(DEMO_INVESTIGATOR_CREDENTIALS.cyberId);
    setInvestigatorPassword(DEMO_INVESTIGATOR_CREDENTIALS.password);
    setErrors({});
    setFeedback({
      type: 'info',
      message: 'Demo credentials loaded. Click "Authorize & Sign In" to access the Investigator Dashboard.',
    });
  };

  const handleUseDemoAdmin = () => {
    setAdminId(DEMO_ADMIN_CREDENTIALS.adminId);
    setAdminPassword(DEMO_ADMIN_CREDENTIALS.password);
    setErrors({});
    setFeedback({
      type: 'info',
      message: 'Demo admin credentials loaded. Click "Authenticate as Administrator" to enter the Admin Allocation Portal.',
    });
  };

  const handleForgotPassword = (e: React.MouseEvent) => {
    e.preventDefault();
    setFeedback({
      type: 'warning',
      message:
        loginMode === 'citizen'
          ? 'Password recovery service is a placeholder and will be enabled when the citizen authentication system is fully implemented.'
          : loginMode === 'investigator'
          ? 'For officer credential recovery, contact the State Cyber Crime Command Center nodal administrator (Extension 1930).'
          : 'For administrator credential recovery, contact the National Directorate Systems Support Cell.',
    });
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-between">
      {/* Top Utility Header */}
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

      {/* Main Container */}
      <main className="flex-1 max-w-[1400px] w-full mx-auto px-4 sm:px-6 lg:px-10 xl:px-14 py-6 sm:py-10 flex items-center">
        <div className="w-full grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          
          {/* Left Column: Branding, Illustration & Context Message */}
          <div className="lg:col-span-6 xl:col-span-7 flex flex-col justify-center text-center lg:text-left">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-blue-100 text-blue-700 text-xs font-semibold rounded-full tracking-wide uppercase border border-blue-200 self-center lg:self-start mb-4">
              <LockShieldIcon />
              <span>
                {loginMode === 'citizen'
                  ? 'Official Citizen Access'
                  : loginMode === 'investigator'
                  ? 'Law Enforcement Command Gateway'
                  : 'Directorate Administrative Access'}
              </span>
            </div>

            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-slate-900 leading-tight mb-4">
              {loginMode === 'citizen' ? (
                <>
                  Welcome <span className="text-blue-700">Back</span>
                </>
              ) : loginMode === 'investigator' ? (
                <>
                  Investigator <span className="text-indigo-700">Command</span>
                </>
              ) : (
                <>
                  System <span className="text-emerald-700">Administration</span>
                </>
              )}
            </h1>

            <p className="text-slate-600 text-base sm:text-lg leading-relaxed max-w-xl mx-auto lg:mx-0 mb-8">
              {loginMode === 'citizen'
                ? 'Sign in to access your account, track reported scam complaints, and submit supporting forensic evidence.'
                : loginMode === 'investigator'
                ? 'Restricted law enforcement gateway for cybercrime officers, forensic analysts, and financial intelligence units.'
                : 'Central Case Allocation & Supervision Console for incoming citizen complaints and officer management.'}
            </p>

            {/* Cybersecurity Visual Illustration */}
            <div className="my-2 max-w-sm sm:max-w-md mx-auto lg:mx-0 w-full">
              <LoginIllustration mode={loginMode} />
            </div>

            {/* Security Notice Message */}
            <div className="mt-8 max-w-lg mx-auto lg:mx-0 bg-white border border-slate-200 rounded-xl p-4 flex items-start gap-3 shadow-xs">
              <div
                className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 mt-0.5 ${
                  loginMode === 'citizen' ? 'bg-blue-50 text-blue-600' : 'bg-indigo-50 text-indigo-700'
                }`}
              >
                <CheckBadgeIcon />
              </div>
              <div>
                <h2 className="text-xs font-semibold text-slate-800 uppercase tracking-wider">
                  {loginMode === 'citizen' ? 'Secure Citizen Portal' : 'Restricted Law Enforcement Portal'}
                </h2>
                <p className="text-xs text-slate-500 leading-relaxed mt-0.5">
                  {loginMode === 'citizen'
                    ? 'Your session is safeguarded with end-to-end security protocols. All reported incident evidence and citizen data are strictly confidential.'
                    : 'Unauthorized access attempts are logged with client fingerprints and reported under Section 43/66 of the Information Technology Act.'}
                </p>
              </div>
            </div>
          </div>

          {/* Right Column: Unified Login Form Card */}
          <div className="lg:col-span-6 xl:col-span-5 flex justify-center lg:justify-end">
            <div className="w-full max-w-md bg-white rounded-2xl border border-slate-200 shadow-sm p-6 sm:p-8">
              
              {/* Mode Switcher Segmented Control */}
              <div className="mb-6 bg-slate-100 p-1 rounded-xl grid grid-cols-3 gap-1 text-[11px] font-bold">
                <button
                  type="button"
                  onClick={() => {
                    setLoginMode('citizen');
                    setErrors({});
                    setFeedback(null);
                  }}
                  className={`py-2 rounded-lg transition-all flex items-center justify-center gap-1.5 ${
                    loginMode === 'citizen'
                      ? 'bg-white text-blue-800 shadow-xs border border-slate-200/80 font-extrabold'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  <UserIcon />
                  <span>Citizen</span>
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setLoginMode('investigator');
                    setErrors({});
                    setFeedback(null);
                  }}
                  className={`py-2 rounded-lg transition-all flex items-center justify-center gap-1.5 ${
                    loginMode === 'investigator'
                      ? 'bg-slate-900 text-white shadow-xs font-extrabold'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  <BadgeIcon />
                  <span>Investigator</span>
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setLoginMode('admin');
                    setErrors({});
                    setFeedback(null);
                  }}
                  className={`py-2 rounded-lg transition-all flex items-center justify-center gap-1.5 ${
                    loginMode === 'admin'
                      ? 'bg-emerald-700 text-white shadow-xs font-extrabold'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  <LockShieldIcon />
                  <span>Admin</span>
                </button>
              </div>

              {/* Form Title */}
              <div className="mb-5">
                <h2 className="text-2xl font-bold text-slate-900 tracking-tight">
                  {loginMode === 'citizen'
                    ? 'Citizen Sign In'
                    : loginMode === 'investigator'
                    ? 'Officer Authentication'
                    : 'Administrator Portal'}
                </h2>
                <p className="text-xs text-slate-500 mt-1">
                  {loginMode === 'citizen'
                    ? 'Enter your verified credentials to access your reported complaints.'
                    : loginMode === 'investigator'
                    ? 'Provide your assigned Cyber ID and official authorization password.'
                    : 'Provide your designated Administrator ID and supervisory password.'}
                </p>
              </div>

              {/* Citizen: Tip when no accounts exist */}
              {loginMode === 'citizen' && !feedback && registeredUsersCount === 0 && (
                <div className="mb-5 p-3 bg-blue-50/70 border border-blue-200/60 rounded-xl text-xs text-blue-800 flex items-start gap-2">
                  <span className="shrink-0 mt-0.5"><InfoCircleIcon /></span>
                  <p>
                    <span className="font-semibold">Demo Authentication:</span> No accounts registered in this session yet.{' '}
                    <Link to="/register" className="font-bold underline hover:text-blue-950">
                      Create a demo citizen account
                    </Link>{' '}
                    first to test login.
                  </p>
                </div>
              )}

              {/* Investigator: Demo Credentials Quick-Fill Card */}
              {loginMode === 'investigator' && (
                <div className="mb-5 p-3.5 bg-amber-50/80 border border-amber-200 rounded-xl text-xs text-amber-900">
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="font-bold uppercase tracking-wider text-[10px] text-amber-800 flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full bg-amber-500"></span>
                      Demo Credentials (Development Only)
                    </span>
                    <button
                      type="button"
                      onClick={handleUseDemoInvestigator}
                      className="px-2 py-0.5 bg-amber-200/70 hover:bg-amber-200 text-amber-900 font-bold rounded text-[10px] transition-colors"
                    >
                      Autofill Demo
                    </button>
                  </div>
                  <div className="font-mono text-[11px] space-y-0.5 bg-white/70 p-2 rounded border border-amber-200/60">
                    <div>
                      <strong className="text-slate-600">Cyber ID:</strong> {DEMO_INVESTIGATOR_CREDENTIALS.cyberId}
                    </div>
                    <div>
                      <strong className="text-slate-600">Password:</strong> {DEMO_INVESTIGATOR_CREDENTIALS.password}
                    </div>
                  </div>
                  <p className="text-[10px] text-amber-700 mt-1 italic">
                    Demonstration only. Not linked to real police or law enforcement databases.
                  </p>
                </div>
              )}

              {/* Admin: Demo Credentials Quick-Fill Card (Task 09) */}
              {loginMode === 'admin' && (
                <div className="mb-5 p-3.5 bg-emerald-50/80 border border-emerald-200 rounded-xl text-xs text-emerald-950">
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="font-bold uppercase tracking-wider text-[10px] text-emerald-800 flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                      Demo Admin Credentials (Task 09)
                    </span>
                    <button
                      type="button"
                      onClick={handleUseDemoAdmin}
                      className="px-2 py-0.5 bg-emerald-200/80 hover:bg-emerald-300 text-emerald-950 font-bold rounded text-[10px] transition-colors"
                    >
                      Autofill Demo
                    </button>
                  </div>
                  <div className="font-mono text-[11px] space-y-0.5 bg-white/80 p-2 rounded border border-emerald-200/70">
                    <div>
                      <strong className="text-slate-600">Admin ID:</strong> {DEMO_ADMIN_CREDENTIALS.adminId}
                    </div>
                    <div>
                      <strong className="text-slate-600">Password:</strong> {DEMO_ADMIN_CREDENTIALS.password}
                    </div>
                  </div>
                  <p className="text-[10px] text-emerald-800 mt-1 italic">
                    Administrator portal connects citizen intake and officer case allocation workflows.
                  </p>
                </div>
              )}

              {/* Informational Feedback Banner */}
              {feedback && (
                <div
                  className={`mb-5 p-3.5 rounded-xl text-xs flex items-start gap-2.5 border ${
                    feedback.type === 'info'
                      ? 'bg-blue-50 border-blue-200 text-blue-800'
                      : feedback.type === 'warning'
                      ? 'bg-rose-50 border-rose-200 text-rose-800'
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

              {/* ─────────────────────────────────────────────────────────── */}
              {/* MODE A: CITIZEN LOGIN FORM                                  */}
              {/* ─────────────────────────────────────────────────────────── */}
              {loginMode === 'citizen' && (
                <form onSubmit={handleCitizenSubmit} noValidate className="space-y-4">
                  {/* Email Field */}
                  <div>
                    <label htmlFor="login-email" className="block text-xs font-semibold text-slate-700 mb-1">
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
                        className={`block w-full pl-10 pr-3 py-2.5 text-xs sm:text-sm bg-white border rounded-lg transition-colors focus:outline-none ${
                          errors.email
                            ? 'border-red-400 text-slate-900 focus:ring-2 focus:ring-red-100'
                            : 'border-slate-300 text-slate-900 focus:border-blue-600 focus:ring-2 focus:ring-blue-100'
                        }`}
                      />
                    </div>
                    {errors.email && (
                      <p className="mt-1 text-xs text-red-600 flex items-center gap-1">
                        <AlertCircleIcon />
                        <span>{errors.email}</span>
                      </p>
                    )}
                  </div>

                  {/* Password Field */}
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <label htmlFor="login-citizen-password" className="block text-xs font-semibold text-slate-700">
                        Password <span className="text-red-500">*</span>
                      </label>
                      <button
                        type="button"
                        onClick={handleForgotPassword}
                        className="text-xs font-semibold text-blue-700 hover:text-blue-800 hover:underline"
                      >
                        Forgot Password?
                      </button>
                    </div>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                        <KeyIcon />
                      </div>
                      <input
                        id="login-citizen-password"
                        type={citizenShowPassword ? 'text' : 'password'}
                        autoComplete="current-password"
                        value={citizenPassword}
                        onChange={(e) => {
                          setCitizenPassword(e.target.value);
                          if (errors.citizenPassword) {
                            setErrors((prev) => ({ ...prev, citizenPassword: undefined }));
                          }
                        }}
                        placeholder="••••••••"
                        className={`block w-full pl-10 pr-10 py-2.5 text-xs sm:text-sm bg-white border rounded-lg transition-colors focus:outline-none ${
                          errors.citizenPassword
                            ? 'border-red-400 text-slate-900 focus:ring-2 focus:ring-red-100'
                            : 'border-slate-300 text-slate-900 focus:border-blue-600 focus:ring-2 focus:ring-blue-100'
                        }`}
                      />
                      <button
                        type="button"
                        onClick={() => setCitizenShowPassword((prev) => !prev)}
                        className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-600"
                        aria-label={citizenShowPassword ? 'Hide password' : 'Show password'}
                      >
                        {citizenShowPassword ? <EyeOffIcon /> : <EyeIcon />}
                      </button>
                    </div>
                    {errors.citizenPassword && (
                      <p className="mt-1 text-xs text-red-600 flex items-center gap-1">
                        <AlertCircleIcon />
                        <span>{errors.citizenPassword}</span>
                      </p>
                    )}
                  </div>

                  {/* Remember Me */}
                  <div className="flex items-center justify-between">
                    <label className="flex items-center gap-2 cursor-pointer select-none">
                      <input
                        type="checkbox"
                        checked={rememberMe}
                        onChange={(e) => setRememberMe(e.target.checked)}
                        className="w-4 h-4 text-blue-700 border-slate-300 rounded focus:ring-blue-500"
                      />
                      <span className="text-xs text-slate-600">Remember Me</span>
                    </label>
                    <span className="text-[11px] text-slate-400">Citizen Session</span>
                  </div>

                  {/* Submit Button */}
                  <button
                    type="submit"
                    className="w-full flex items-center justify-center gap-2 py-2.5 px-4 bg-blue-700 hover:bg-blue-800 text-white text-xs sm:text-sm font-bold rounded-lg shadow-xs transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <SignInIcon />
                    Sign In as Citizen
                  </button>
                </form>
              )}

              {/* ─────────────────────────────────────────────────────────── */}
              {/* MODE B: INVESTIGATOR LOGIN FORM                             */}
              {/* ─────────────────────────────────────────────────────────── */}
              {loginMode === 'investigator' && (
                <form onSubmit={handleInvestigatorSubmit} noValidate className="space-y-4">
                  {/* Authorized Personnel Banner */}
                  <div className="p-2.5 bg-slate-900 text-white rounded-lg flex items-center gap-2 text-[11px]">
                    <span className="w-2 h-2 rounded-full bg-emerald-400 shrink-0"></span>
                    <span className="font-semibold text-slate-200">
                      Authorized Cyber Personnel Only
                    </span>
                    <span className="text-slate-400 ml-auto font-mono text-[10px]">CCIC-4</span>
                  </div>

                  {/* Cyber ID Field */}
                  <div>
                    <label htmlFor="investigator-cyber-id" className="block text-xs font-semibold text-slate-700 mb-1">
                      Cyber ID / Officer Credential <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                        <BadgeIcon />
                      </div>
                      <input
                        id="investigator-cyber-id"
                        type="text"
                        autoComplete="username"
                        value={cyberId}
                        onChange={(e) => {
                          setCyberId(e.target.value);
                          if (errors.cyberId) {
                            setErrors((prev) => ({ ...prev, cyberId: undefined }));
                          }
                        }}
                        placeholder="e.g. CYB-IN-20481"
                        className={`block w-full pl-10 pr-3 py-2.5 text-xs sm:text-sm font-mono uppercase bg-white border rounded-lg transition-colors focus:outline-none ${
                          errors.cyberId
                            ? 'border-red-400 text-slate-900 focus:ring-2 focus:ring-red-100'
                            : 'border-slate-300 text-slate-900 focus:border-indigo-600 focus:ring-2 focus:ring-indigo-100'
                        }`}
                      />
                    </div>
                    {errors.cyberId && (
                      <p className="mt-1 text-xs text-red-600 flex items-center gap-1">
                        <AlertCircleIcon />
                        <span>{errors.cyberId}</span>
                      </p>
                    )}
                  </div>

                  {/* Password Field */}
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <label htmlFor="investigator-password" className="block text-xs font-semibold text-slate-700">
                        Authorization Password <span className="text-red-500">*</span>
                      </label>
                      <button
                        type="button"
                        onClick={handleForgotPassword}
                        className="text-xs font-semibold text-indigo-700 hover:text-indigo-800 hover:underline"
                      >
                        Need Help?
                      </button>
                    </div>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                        <KeyIcon />
                      </div>
                      <input
                        id="investigator-password"
                        type={investigatorShowPassword ? 'text' : 'password'}
                        autoComplete="current-password"
                        value={investigatorPassword}
                        onChange={(e) => {
                          setInvestigatorPassword(e.target.value);
                          if (errors.investigatorPassword) {
                            setErrors((prev) => ({ ...prev, investigatorPassword: undefined }));
                          }
                        }}
                        placeholder="••••••••••••"
                        className={`block w-full pl-10 pr-10 py-2.5 text-xs sm:text-sm bg-white border rounded-lg transition-colors focus:outline-none ${
                          errors.investigatorPassword
                            ? 'border-red-400 text-slate-900 focus:ring-2 focus:ring-red-100'
                            : 'border-slate-300 text-slate-900 focus:border-indigo-600 focus:ring-2 focus:ring-indigo-100'
                        }`}
                      />
                      <button
                        type="button"
                        onClick={() => setInvestigatorShowPassword((prev) => !prev)}
                        className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-600"
                        aria-label={investigatorShowPassword ? 'Hide password' : 'Show password'}
                      >
                        {investigatorShowPassword ? <EyeOffIcon /> : <EyeIcon />}
                      </button>
                    </div>
                    {errors.investigatorPassword && (
                      <p className="mt-1 text-xs text-red-600 flex items-center gap-1">
                        <AlertCircleIcon />
                        <span>{errors.investigatorPassword}</span>
                      </p>
                    )}
                  </div>

                  {/* Submit Button */}
                  <button
                    type="submit"
                    className="w-full flex items-center justify-center gap-2 py-2.5 px-4 bg-slate-900 hover:bg-slate-800 text-white text-xs sm:text-sm font-bold rounded-lg shadow-xs transition-colors focus:outline-none focus:ring-2 focus:ring-slate-700"
                  >
                    <LockShieldIcon />
                    Authorize &amp; Sign In as Investigator
                  </button>

                  <p className="text-[10px] text-slate-400 text-center">
                    Law enforcement registration is managed internally. No public investigator registration is permitted.
                  </p>
                </form>
              )}

              {/* ─────────────────────────────────────────────────────────── */}
              {/* MODE C: ADMIN LOGIN FORM (Task 09)                          */}
              {/* ─────────────────────────────────────────────────────────── */}
              {loginMode === 'admin' && (
                <form onSubmit={handleAdminSubmit} noValidate className="space-y-4">
                  {/* Directorate Header Banner */}
                  <div className="p-2.5 bg-emerald-950 text-white rounded-lg flex items-center gap-2 text-[11px] border border-emerald-800">
                    <span className="w-2 h-2 rounded-full bg-emerald-400 shrink-0 animate-pulse"></span>
                    <span className="font-semibold text-emerald-100">
                      National Directorate Case Allocation Console
                    </span>
                    <span className="text-emerald-300 ml-auto font-mono text-[10px]">DIR-OPS</span>
                  </div>

                  {/* Admin ID Field */}
                  <div>
                    <label htmlFor="admin-id" className="block text-xs font-semibold text-slate-700 mb-1">
                      Administrator ID <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                        <BadgeIcon />
                      </div>
                      <input
                        id="admin-id"
                        type="text"
                        autoComplete="username"
                        value={adminId}
                        onChange={(e) => {
                          setAdminId(e.target.value);
                          if (errors.adminId) {
                            setErrors((prev) => ({ ...prev, adminId: undefined }));
                          }
                        }}
                        placeholder="e.g. CT-ADMIN-001"
                        className={`block w-full pl-10 pr-3 py-2.5 text-xs sm:text-sm font-mono uppercase bg-white border rounded-lg transition-colors focus:outline-none ${
                          errors.adminId
                            ? 'border-red-400 text-slate-900 focus:ring-2 focus:ring-red-100'
                            : 'border-slate-300 text-slate-900 focus:border-emerald-600 focus:ring-2 focus:ring-emerald-100'
                        }`}
                      />
                    </div>
                    {errors.adminId && (
                      <p className="mt-1 text-xs text-red-600 flex items-center gap-1">
                        <AlertCircleIcon />
                        <span>{errors.adminId}</span>
                      </p>
                    )}
                  </div>

                  {/* Password Field */}
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <label htmlFor="admin-password" className="block text-xs font-semibold text-slate-700">
                        Supervisory Password <span className="text-red-500">*</span>
                      </label>
                      <button
                        type="button"
                        onClick={handleForgotPassword}
                        className="text-xs font-semibold text-emerald-700 hover:text-emerald-800 hover:underline"
                      >
                        Need Help?
                      </button>
                    </div>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                        <KeyIcon />
                      </div>
                      <input
                        id="admin-password"
                        type={adminShowPassword ? 'text' : 'password'}
                        autoComplete="current-password"
                        value={adminPassword}
                        onChange={(e) => {
                          setAdminPassword(e.target.value);
                          if (errors.adminPassword) {
                            setErrors((prev) => ({ ...prev, adminPassword: undefined }));
                          }
                        }}
                        placeholder="••••••••••••"
                        className={`block w-full pl-10 pr-10 py-2.5 text-xs sm:text-sm bg-white border rounded-lg transition-colors focus:outline-none ${
                          errors.adminPassword
                            ? 'border-red-400 text-slate-900 focus:ring-2 focus:ring-red-100'
                            : 'border-slate-300 text-slate-900 focus:border-emerald-600 focus:ring-2 focus:ring-emerald-100'
                        }`}
                      />
                      <button
                        type="button"
                        onClick={() => setAdminShowPassword((prev) => !prev)}
                        className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-600"
                        aria-label={adminShowPassword ? 'Hide password' : 'Show password'}
                      >
                        {adminShowPassword ? <EyeOffIcon /> : <EyeIcon />}
                      </button>
                    </div>
                    {errors.adminPassword && (
                      <p className="mt-1 text-xs text-red-600 flex items-center gap-1">
                        <AlertCircleIcon />
                        <span>{errors.adminPassword}</span>
                      </p>
                    )}
                  </div>

                  {/* Submit Button */}
                  <button
                    type="submit"
                    className="w-full flex items-center justify-center gap-2 py-2.5 px-4 bg-emerald-700 hover:bg-emerald-800 text-white text-xs sm:text-sm font-bold rounded-lg shadow-xs transition-colors focus:outline-none focus:ring-2 focus:ring-emerald-600"
                  >
                    <LockShieldIcon />
                    Authenticate as Administrator
                  </button>

                  <p className="text-[10px] text-slate-400 text-center">
                    Strict administrative clearance required. All case transfers and allocations are digitally audited.
                  </p>
                </form>
              )}

              {/* Bottom Footer Area */}
              <div className="mt-6 pt-5 border-t border-slate-100 text-center space-y-2.5">
                {loginMode === 'citizen' ? (
                  <p className="text-xs text-slate-600">
                    Don't have an account?{' '}
                    <Link
                      to="/register"
                      className="font-bold text-blue-700 hover:text-blue-800 hover:underline"
                    >
                      Create Citizen Account
                    </Link>
                  </p>
                ) : (
                  <p className="text-xs text-slate-500">
                    Are you a citizen victim?{' '}
                    <button
                      type="button"
                      onClick={() => {
                        setLoginMode('citizen');
                        setErrors({});
                        setFeedback(null);
                      }}
                      className="font-bold text-blue-700 hover:underline ml-1"
                    >
                      Switch to Citizen Login
                    </button>
                  </p>
                )}

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
          <span>CyberTrace-India • Unified Authentication Gateway (Prototype)</span>
          <span>Emergency Cyber Fraud Reporting Toll-Free: 1930</span>
        </div>
      </footer>
    </div>
  );
}

/* ── Inline SVG Illustration ─────────────────────────────────── */
function LoginIllustration({ mode }: { mode: LoginMode }) {
  const isInvestigator = mode === 'investigator';

  return (
    <div className="w-full aspect-16/10 max-h-72">
      <svg viewBox="0 0 520 320" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
        <rect x="20" y="20" width="480" height="280" rx="20" fill="#f8fafc" stroke="#e2e8f0" strokeWidth="2" />
        
        {/* Grid dots */}
        <circle cx="60" cy="60" r="3" fill="#cbd5e1" />
        <circle cx="90" cy="60" r="3" fill="#cbd5e1" />
        <circle cx="120" cy="60" r="3" fill="#cbd5e1" />
        <circle cx="60" cy="90" r="3" fill="#cbd5e1" />
        <circle cx="90" cy="90" r="3" fill="#cbd5e1" />
        <circle cx="120" cy="90" r="3" fill="#cbd5e1" />

        {/* Central Shield */}
        <path
          d="M260 50 L340 90 L340 170 C340 225 305 265 260 280 C215 265 180 225 180 170 L180 90 Z"
          fill={isInvestigator ? '#e0e7ff' : '#dbeafe'}
          stroke={isInvestigator ? '#4338ca' : '#2563eb'}
          strokeWidth="3"
          strokeLinejoin="round"
        />

        {/* Inner Shield */}
        <path
          d="M260 70 L320 100 L320 165 C320 210 295 242 260 256 C225 242 200 210 200 165 L200 100 Z"
          fill={isInvestigator ? '#eef2ff' : '#eff6ff'}
        />

        {/* Lock or Badge Icon */}
        <rect x="240" y="145" width="40" height="32" rx="6" fill={isInvestigator ? '#312e81' : '#1d4ed8'} />
        <path
          d="M247 145 V133 C247 125.8 252.8 120 260 120 C267.2 120 273 125.8 273 133 V145"
          stroke={isInvestigator ? '#312e81' : '#1d4ed8'}
          strokeWidth="4"
          strokeLinecap="round"
          fill="none"
        />
        <circle cx="260" cy="159" r="3" fill="#ffffff" />
        <path d="M260 162 V168" stroke="#ffffff" strokeWidth="2.5" strokeLinecap="round" />

        {/* Left Floating Card */}
        <rect
          x="50"
          y="140"
          width="120"
          height="70"
          rx="10"
          fill="#ffffff"
          stroke={isInvestigator ? '#a5b4fc' : '#93c5fd'}
          strokeWidth="2"
        />
        <circle cx="75" cy="165" r="12" fill={isInvestigator ? '#e0e7ff' : '#dcfce7'} />
        <path
          d="M70 165 L73 168 L80 161"
          stroke={isInvestigator ? '#4338ca' : '#16a34a'}
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <rect x="95" y="157" width="55" height="6" rx="3" fill="#94a3b8" />
        <rect x="95" y="168" width="40" height="5" rx="2.5" fill="#cbd5e1" />
        <path d="M75 190 H145" stroke="#e2e8f0" strokeWidth="2" strokeLinecap="round" />

        {/* Right Floating Card */}
        <rect
          x="350"
          y="100"
          width="125"
          height="75"
          rx="10"
          fill="#ffffff"
          stroke={isInvestigator ? '#a5b4fc' : '#93c5fd'}
          strokeWidth="2"
        />
        <circle cx="375" cy="125" r="12" fill={isInvestigator ? '#e0e7ff' : '#eff6ff'} />
        <text
          x="375"
          y="129"
          textAnchor="middle"
          fill={isInvestigator ? '#4338ca' : '#2563eb'}
          fontSize="10"
          fontWeight="bold"
        >
          {isInvestigator ? '★' : '✓'}
        </text>
        <rect x="395" y="118" width="60" height="6" rx="3" fill="#94a3b8" />
        <rect x="395" y="129" width="45" height="5" rx="2.5" fill="#cbd5e1" />
        <text x="375" y="158" fill="#475569" fontSize="9" fontWeight="600" fontFamily="sans-serif">
          {isInvestigator ? 'CYBER-CELL 4' : '256-Bit SSL'}
        </text>

        {/* Connecting Dashed Security Lines */}
        <path d="M170 175 C185 175 185 170 195 170" stroke="#93c5fd" strokeWidth="2" strokeDasharray="4 4" />
        <path d="M325 140 C335 140 338 135 350 135" stroke="#93c5fd" strokeWidth="2" strokeDasharray="4 4" />

        {/* Bottom Key Card */}
        <rect x="330" y="210" width="125" height="40" rx="8" fill="#ffffff" stroke="#cbd5e1" strokeWidth="1.5" />
        <circle cx="350" cy="230" r="7" fill={isInvestigator ? '#ede9fe' : '#fef3c7'} />
        <path
          d="M350 227 V233 M347 230 H353"
          stroke={isInvestigator ? '#7c3aed' : '#d97706'}
          strokeWidth="1.5"
          strokeLinecap="round"
        />
        <text x="365" y="234" fill="#64748b" fontSize="10" fontWeight="600" fontFamily="sans-serif">
          {isInvestigator ? 'Officer Auth' : 'Citizen Portal'}
        </text>
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

function UserIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
      <circle cx="12" cy="7" r="4"></circle>
    </svg>
  );
}

function BadgeIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"></path>
    </svg>
  );
}
