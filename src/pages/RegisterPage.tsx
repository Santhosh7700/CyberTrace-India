import React, { useState } from 'react';
import { Link } from 'react-router-dom';

export default function RegisterPage() {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [mobile, setMobile] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [agreeTerms, setAgreeTerms] = useState(false);

  // Password visibility states
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Validation errors
  const [errors, setErrors] = useState<{
    fullName?: string;
    email?: string;
    mobile?: string;
    password?: string;
    confirmPassword?: string;
    agreeTerms?: string;
  }>({});

  // Submission success state
  const [submitted, setSubmitted] = useState(false);

  // Modal states for Terms and Privacy
  const [activeModal, setActiveModal] = useState<'terms' | 'privacy' | null>(null);

  // Password strength calculations
  const hasLength = password.length >= 8;
  const hasUpper = /[A-Z]/.test(password);
  const hasLower = /[a-z]/.test(password);
  const hasNumber = /[0-9]/.test(password);
  const hasSpecial = /[!@#$%^&*(),.?":{}|<>_~`\-+=\\[\]]/.test(password);

  const criteriaMetCount = [hasLength, hasUpper, hasLower, hasNumber, hasSpecial].filter(Boolean).length;

  const getStrengthInfo = () => {
    if (!password) return { score: 0, label: '', color: 'bg-slate-200', text: 'text-slate-400' };
    if (criteriaMetCount <= 2) return { score: 1, label: 'Weak', color: 'bg-red-500', text: 'text-red-600' };
    if (criteriaMetCount === 3) return { score: 2, label: 'Fair', color: 'bg-amber-500', text: 'text-amber-600' };
    if (criteriaMetCount === 4) return { score: 3, label: 'Good', color: 'bg-blue-600', text: 'text-blue-600' };
    return { score: 4, label: 'Strong', color: 'bg-emerald-600', text: 'text-emerald-600' };
  };

  const strength = getStrengthInfo();

  const validate = () => {
    const newErrors: {
      fullName?: string;
      email?: string;
      mobile?: string;
      password?: string;
      confirmPassword?: string;
      agreeTerms?: string;
    } = {};

    // 1. Full Name: required, not whitespace only
    if (!fullName.trim()) {
      newErrors.fullName = 'Full Name is required.';
    }

    // 2. Email Address: valid format
    if (!email.trim()) {
      newErrors.email = 'Email Address is required.';
    } else {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email.trim())) {
        newErrors.email = 'Please enter a valid email address (e.g., citizen@example.com).';
      }
    }

    // 3. 10-digit Indian Mobile Number
    const cleanedMobile = mobile.trim().replace(/[\s-]/g, '');
    if (!cleanedMobile) {
      newErrors.mobile = 'Mobile Number is required.';
    } else if (!/^[6-9]\d{9}$/.test(cleanedMobile)) {
      newErrors.mobile = 'Please enter a valid 10-digit Indian mobile number starting with 6-9.';
    }

    // 4. Password validation: >= 8 chars, uppercase, lowercase, number, special char
    if (!password) {
      newErrors.password = 'Password is required.';
    } else if (password.length < 8) {
      newErrors.password = 'Password must be at least 8 characters long.';
    } else if (!hasUpper || !hasLower || !hasNumber || !hasSpecial) {
      newErrors.password =
        'Password must include at least one uppercase letter, one lowercase letter, one number, and one special character.';
    }

    // 5. Confirm Password
    if (!confirmPassword) {
      newErrors.confirmPassword = 'Confirm Password is required.';
    } else if (confirmPassword !== password) {
      newErrors.confirmPassword = 'Passwords do not match.';
    }

    // 6. Terms and conditions checkbox
    if (!agreeTerms) {
      newErrors.agreeTerms = 'You must agree to the Terms and Conditions and Privacy Policy.';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!validate()) {
      return;
    }

    // Validated successfully
    // Frontend prototype only: no server request, no localStorage/sessionStorage persistence
    setSubmitted(true);
  };

  const resetForm = () => {
    setFullName('');
    setEmail('');
    setMobile('');
    setPassword('');
    setConfirmPassword('');
    setAgreeTerms(false);
    setErrors({});
    setSubmitted(false);
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
        <div className="w-full grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start lg:items-center">
          
          {/* Left Column: Branding, Illustration & Security Message */}
          <div className="lg:col-span-5 xl:col-span-6 flex flex-col justify-center text-center lg:text-left">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-blue-100 text-blue-700 text-xs font-semibold rounded-full tracking-wide uppercase border border-blue-200 self-center lg:self-start mb-4">
              <UserShieldIcon />
              <span>Citizen Registration</span>
            </div>

            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-slate-900 leading-tight mb-4">
              Create Your <span className="text-blue-700">Account</span>
            </h1>

            <p className="text-slate-600 text-base sm:text-lg leading-relaxed max-w-xl mx-auto lg:mx-0 mb-8">
              Join CyberTrace-India to report online fraud, securely organize evidence and track your submitted reports.
            </p>

            {/* Registration Cybersecurity Illustration */}
            <div className="my-2 max-w-sm sm:max-w-md mx-auto lg:mx-0 w-full">
              <RegisterIllustration />
            </div>

            {/* Small Security & Privacy Reassurance */}
            <div className="mt-8 max-w-lg mx-auto lg:mx-0 bg-white border border-blue-100 rounded-xl p-4 flex items-start gap-3 shadow-xs">
              <div className="w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center text-blue-600 shrink-0 mt-0.5">
                <LockClosedIcon />
              </div>
              <div>
                <h2 className="text-xs font-semibold text-slate-800 uppercase tracking-wider">
                  Citizen Privacy &amp; Data Protection
                </h2>
                <p className="text-xs text-slate-500 leading-relaxed mt-0.5">
                  Your submitted details and evidence records are safeguarded with strict privacy protocols. Personal information is strictly used for scam reporting and case management.
                </p>
              </div>
            </div>
          </div>

          {/* Right Column: Registration Form Card */}
          <div className="lg:col-span-7 xl:col-span-6 flex justify-center lg:justify-end">
            <div className="w-full max-w-xl bg-white rounded-2xl border border-slate-200 shadow-sm p-6 sm:p-8 md:p-10">
              
              {/* Card Header */}
              <div className="mb-6">
                <h2 className="text-2xl font-bold text-slate-900 tracking-tight">Citizen Registration</h2>
                <p className="text-sm text-slate-500 mt-1">
                  Fill in your details below to register as a citizen reporter.
                </p>
              </div>

              {/* Success Notification Box */}
              {submitted ? (
                <div className="p-6 bg-emerald-50 border border-emerald-200 rounded-xl text-center space-y-4">
                  <div className="w-12 h-12 mx-auto rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center">
                    <CheckCircleBigIcon />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-emerald-900">Registration Form Validated!</h3>
                    <p className="text-xs sm:text-sm text-emerald-800 mt-1 leading-relaxed">
                      All citizen registration inputs have been successfully verified on the frontend.
                    </p>
                  </div>
                  <div className="p-3 bg-white border border-emerald-200 rounded-lg text-xs text-slate-600 text-left">
                    <span className="font-semibold text-slate-800">Prototype Notice:</span> This is a frontend demonstration. No real account has been created, and no sensitive data has been stored or sent to a server.
                  </div>
                  <div className="pt-2 flex flex-col sm:flex-row gap-3 justify-center">
                    <Link
                      to="/login"
                      className="inline-flex items-center justify-center gap-2 px-5 py-2.5 bg-blue-700 text-white text-sm font-semibold rounded-lg hover:bg-blue-800 transition-colors shadow-sm"
                    >
                      <span>Proceed to Sign In</span>
                      <ArrowRightIcon />
                    </Link>
                    <button
                      type="button"
                      onClick={resetForm}
                      className="px-4 py-2.5 border border-slate-300 text-slate-700 text-sm font-medium rounded-lg hover:bg-slate-50 transition-colors"
                    >
                      Register Another Account
                    </button>
                  </div>
                </div>
              ) : (
                <form onSubmit={handleSubmit} noValidate className="space-y-4">
                  
                  {/* 1. Full Name */}
                  <div>
                    <label htmlFor="reg-fullname" className="block text-sm font-medium text-slate-700 mb-1">
                      Full Name <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                        <UserIcon />
                      </div>
                      <input
                        id="reg-fullname"
                        type="text"
                        autoComplete="name"
                        value={fullName}
                        onChange={(e) => {
                          setFullName(e.target.value);
                          if (errors.fullName) setErrors((prev) => ({ ...prev, fullName: undefined }));
                        }}
                        placeholder="Enter your full name"
                        className={`block w-full pl-10 pr-3 py-2.5 text-sm bg-white border rounded-lg transition-colors focus:outline-none ${
                          errors.fullName
                            ? 'border-red-400 text-slate-900 focus:border-red-500 focus:ring-2 focus:ring-red-100'
                            : 'border-slate-300 text-slate-900 focus:border-blue-600 focus:ring-2 focus:ring-blue-100'
                        }`}
                        aria-invalid={!!errors.fullName}
                        aria-describedby={errors.fullName ? 'fullname-error' : undefined}
                      />
                    </div>
                    {errors.fullName && (
                      <p id="fullname-error" className="mt-1.5 text-xs text-red-600 flex items-center gap-1">
                        <AlertCircleIcon />
                        <span>{errors.fullName}</span>
                      </p>
                    )}
                  </div>

                  {/* 2. Email Address */}
                  <div>
                    <label htmlFor="reg-email" className="block text-sm font-medium text-slate-700 mb-1">
                      Email Address <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                        <MailIcon />
                      </div>
                      <input
                        id="reg-email"
                        type="email"
                        autoComplete="email"
                        value={email}
                        onChange={(e) => {
                          setEmail(e.target.value);
                          if (errors.email) setErrors((prev) => ({ ...prev, email: undefined }));
                        }}
                        placeholder="Enter your email address"
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

                  {/* 3. Mobile Number */}
                  <div>
                    <label htmlFor="reg-mobile" className="block text-sm font-medium text-slate-700 mb-1">
                      Mobile Number <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                        <PhoneIcon />
                      </div>
                      <input
                        id="reg-mobile"
                        type="tel"
                        autoComplete="tel"
                        maxLength={10}
                        value={mobile}
                        onChange={(e) => {
                          // Allow digits only
                          const val = e.target.value.replace(/\D/g, '');
                          setMobile(val);
                          if (errors.mobile) setErrors((prev) => ({ ...prev, mobile: undefined }));
                        }}
                        placeholder="Enter your 10-digit mobile number"
                        className={`block w-full pl-10 pr-3 py-2.5 text-sm bg-white border rounded-lg transition-colors focus:outline-none ${
                          errors.mobile
                            ? 'border-red-400 text-slate-900 focus:border-red-500 focus:ring-2 focus:ring-red-100'
                            : 'border-slate-300 text-slate-900 focus:border-blue-600 focus:ring-2 focus:ring-blue-100'
                        }`}
                        aria-invalid={!!errors.mobile}
                        aria-describedby={errors.mobile ? 'mobile-error' : undefined}
                      />
                    </div>
                    {errors.mobile ? (
                      <p id="mobile-error" className="mt-1.5 text-xs text-red-600 flex items-center gap-1">
                        <AlertCircleIcon />
                        <span>{errors.mobile}</span>
                      </p>
                    ) : (
                      <p className="mt-1 text-xs text-slate-400">Standard 10-digit Indian mobile number (e.g. 9876543210)</p>
                    )}
                  </div>

                  {/* 4. Password */}
                  <div>
                    <label htmlFor="reg-password" className="block text-sm font-medium text-slate-700 mb-1">
                      Password <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                        <KeyIcon />
                      </div>
                      <input
                        id="reg-password"
                        type={showPassword ? 'text' : 'password'}
                        autoComplete="new-password"
                        value={password}
                        onChange={(e) => {
                          setPassword(e.target.value);
                          if (errors.password) setErrors((prev) => ({ ...prev, password: undefined }));
                        }}
                        placeholder="Create a strong password"
                        className={`block w-full pl-10 pr-10 py-2.5 text-sm bg-white border rounded-lg transition-colors focus:outline-none ${
                          errors.password
                            ? 'border-red-400 text-slate-900 focus:border-red-500 focus:ring-2 focus:ring-red-100'
                            : 'border-slate-300 text-slate-900 focus:border-blue-600 focus:ring-2 focus:ring-blue-100'
                        }`}
                        aria-invalid={!!errors.password}
                        aria-describedby="password-requirements"
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

                    {/* Password Strength Indicator */}
                    {password && (
                      <div className="mt-2 space-y-1.5">
                        <div className="flex items-center justify-between text-xs">
                          <span className="text-slate-500">Password strength:</span>
                          <span className={`font-semibold ${strength.text}`}>{strength.label}</span>
                        </div>
                        <div className="grid grid-cols-4 gap-1.5 h-1.5">
                          <div className={`rounded-full ${strength.score >= 1 ? strength.color : 'bg-slate-200'}`} />
                          <div className={`rounded-full ${strength.score >= 2 ? strength.color : 'bg-slate-200'}`} />
                          <div className={`rounded-full ${strength.score >= 3 ? strength.color : 'bg-slate-200'}`} />
                          <div className={`rounded-full ${strength.score >= 4 ? strength.color : 'bg-slate-200'}`} />
                        </div>
                      </div>
                    )}

                    {errors.password && (
                      <p className="mt-1.5 text-xs text-red-600 flex items-center gap-1">
                        <AlertCircleIcon />
                        <span>{errors.password}</span>
                      </p>
                    )}

                    {/* Password Checklist Helper */}
                    <div id="password-requirements" className="mt-2 p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-xs space-y-1">
                      <p className="font-semibold text-slate-600">Password requirements:</p>
                      <div className="grid grid-cols-2 gap-x-2 gap-y-0.5 text-slate-500">
                        <span className={hasLength ? 'text-emerald-700 font-medium' : ''}>
                          {hasLength ? '✓' : '•'} 8+ characters
                        </span>
                        <span className={hasUpper ? 'text-emerald-700 font-medium' : ''}>
                          {hasUpper ? '✓' : '•'} Uppercase letter
                        </span>
                        <span className={hasLower ? 'text-emerald-700 font-medium' : ''}>
                          {hasLower ? '✓' : '•'} Lowercase letter
                        </span>
                        <span className={hasNumber ? 'text-emerald-700 font-medium' : ''}>
                          {hasNumber ? '✓' : '•'} Number (0-9)
                        </span>
                        <span className={hasSpecial ? 'text-emerald-700 font-medium col-span-2' : 'col-span-2'}>
                          {hasSpecial ? '✓' : '•'} Special character (!@#$%^&*)
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* 5. Confirm Password */}
                  <div>
                    <label htmlFor="reg-confirmpassword" className="block text-sm font-medium text-slate-700 mb-1">
                      Confirm Password <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                        <KeyIcon />
                      </div>
                      <input
                        id="reg-confirmpassword"
                        type={showConfirmPassword ? 'text' : 'password'}
                        autoComplete="new-password"
                        value={confirmPassword}
                        onChange={(e) => {
                          setConfirmPassword(e.target.value);
                          if (errors.confirmPassword) setErrors((prev) => ({ ...prev, confirmPassword: undefined }));
                        }}
                        placeholder="Re-enter your password"
                        className={`block w-full pl-10 pr-10 py-2.5 text-sm bg-white border rounded-lg transition-colors focus:outline-none ${
                          errors.confirmPassword
                            ? 'border-red-400 text-slate-900 focus:border-red-500 focus:ring-2 focus:ring-red-100'
                            : 'border-slate-300 text-slate-900 focus:border-blue-600 focus:ring-2 focus:ring-blue-100'
                        }`}
                        aria-invalid={!!errors.confirmPassword}
                        aria-describedby={errors.confirmPassword ? 'confirmpassword-error' : undefined}
                      />
                      <button
                        type="button"
                        onClick={() => setShowConfirmPassword((prev) => !prev)}
                        className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-600 focus:outline-none"
                        aria-label={showConfirmPassword ? 'Hide confirm password' : 'Show confirm password'}
                      >
                        {showConfirmPassword ? <EyeOffIcon /> : <EyeIcon />}
                      </button>
                    </div>
                    {errors.confirmPassword && (
                      <p id="confirmpassword-error" className="mt-1.5 text-xs text-red-600 flex items-center gap-1">
                        <AlertCircleIcon />
                        <span>{errors.confirmPassword}</span>
                      </p>
                    )}
                  </div>

                  {/* 6. Terms and Conditions Checkbox */}
                  <div className="pt-1">
                    <label className="flex items-start gap-2.5 cursor-pointer select-none">
                      <input
                        type="checkbox"
                        checked={agreeTerms}
                        onChange={(e) => {
                          setAgreeTerms(e.target.checked);
                          if (errors.agreeTerms) setErrors((prev) => ({ ...prev, agreeTerms: undefined }));
                        }}
                        className="w-4 h-4 mt-0.5 text-blue-700 border-slate-300 rounded focus:ring-blue-500"
                      />
                      <span className="text-xs sm:text-sm text-slate-600 leading-normal">
                        I agree to the{' '}
                        <button
                          type="button"
                          onClick={() => setActiveModal('terms')}
                          className="font-semibold text-blue-700 hover:text-blue-800 hover:underline inline focus:outline-none"
                        >
                          Terms and Conditions
                        </button>{' '}
                        and{' '}
                        <button
                          type="button"
                          onClick={() => setActiveModal('privacy')}
                          className="font-semibold text-blue-700 hover:text-blue-800 hover:underline inline focus:outline-none"
                        >
                          Privacy Policy
                        </button>
                        .
                      </span>
                    </label>
                    {errors.agreeTerms && (
                      <p className="mt-1.5 text-xs text-red-600 flex items-center gap-1">
                        <AlertCircleIcon />
                        <span>{errors.agreeTerms}</span>
                      </p>
                    )}
                  </div>

                  {/* Submit Button */}
                  <div className="pt-2">
                    <button
                      type="submit"
                      className="w-full flex items-center justify-center gap-2 py-3 px-4 bg-blue-700 hover:bg-blue-800 text-white text-sm font-semibold rounded-lg shadow-sm transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                    >
                      <UserPlusIcon />
                      Create Account
                    </button>
                  </div>
                </form>
              )}

              {/* Bottom Navigation */}
              <div className="mt-6 pt-6 border-t border-slate-100 text-center space-y-3">
                <p className="text-xs sm:text-sm text-slate-600">
                  Already have an account?{' '}
                  <Link
                    to="/login"
                    className="font-semibold text-blue-700 hover:text-blue-800 hover:underline transition-colors"
                  >
                    Sign In
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

      {/* Terms / Privacy Modal Dialog */}
      {activeModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 sm:p-8 shadow-xl border border-slate-200">
            <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-100">
              <h3 className="text-lg font-bold text-slate-900">
                {activeModal === 'terms' ? 'Terms and Conditions' : 'Privacy Policy'}
              </h3>
              <button
                type="button"
                onClick={() => setActiveModal(null)}
                className="text-slate-400 hover:text-slate-600 p-1 rounded-md"
                aria-label="Close dialog"
              >
                <XIcon />
              </button>
            </div>
            <div className="text-sm text-slate-600 space-y-3 max-h-72 overflow-y-auto pr-2 leading-relaxed">
              {activeModal === 'terms' ? (
                <>
                  <p>
                    <strong>1. Platform Purpose:</strong> CyberTrace-India is an independent system prototype intended for educational, informational, and mock incident reporting demonstration.
                  </p>
                  <p>
                    <strong>2. Citizen Responsibility:</strong> Users agree to submit truthful incident details when using the platform. Submitting false reports or abusive material is prohibited.
                  </p>
                  <p>
                    <strong>3. Official Disclaimers:</strong> This platform is not an official law enforcement agency. Urgent financial frauds should be reported directly to your bank and helpline 1930.
                  </p>
                </>
              ) : (
                <>
                  <p>
                    <strong>1. Information Collection:</strong> In this prototype phase, no sensitive personal credentials, passwords, or transaction data are permanently recorded or transmitted to third-party databases.
                  </p>
                  <p>
                    <strong>2. Data Protection:</strong> Citizen report structures are designed following standard data protection and privacy practices to safeguard victim identity.
                  </p>
                  <p>
                    <strong>3. Evidence Confidentiality:</strong> Any uploaded screenshots or digital evidence are intended for authorized investigator analysis and fraud indicator detection only.
                  </p>
                </>
              )}
            </div>
            <div className="mt-6 pt-3 border-t border-slate-100 text-right">
              <button
                type="button"
                onClick={() => setActiveModal(null)}
                className="px-4 py-2 bg-blue-700 text-white text-xs sm:text-sm font-semibold rounded-lg hover:bg-blue-800 transition-colors"
              >
                I Understand
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

/* ── Custom SVG Illustration ─────────────────────────────────── */
function RegisterIllustration() {
  return (
    <div className="w-full aspect-16/10 max-h-72">
      <svg viewBox="0 0 520 320" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
        {/* Background Card */}
        <rect x="20" y="20" width="480" height="280" rx="20" fill="#f8fafc" stroke="#e2e8f0" strokeWidth="2" />

        {/* Decorative Grid Nodes */}
        <circle cx="60" cy="60" r="3" fill="#cbd5e1" />
        <circle cx="90" cy="60" r="3" fill="#cbd5e1" />
        <circle cx="120" cy="60" r="3" fill="#cbd5e1" />
        <circle cx="60" cy="90" r="3" fill="#cbd5e1" />
        <circle cx="90" cy="90" r="3" fill="#cbd5e1" />
        <circle cx="120" cy="90" r="3" fill="#cbd5e1" />

        {/* Central Citizen Identity Card */}
        <rect x="180" y="60" width="160" height="200" rx="14" fill="#ffffff" stroke="#3b82f6" strokeWidth="2.5" filter="drop-shadow(0 10px 15px rgba(37,99,235,0.08))" />
        
        {/* Card Header Band */}
        <path d="M180 74 C180 66.2 186.2 60 194 60 H326 C333.8 60 340 66.2 340 74 V95 H180 Z" fill="#dbeafe" />
        <circle cx="205" cy="77" r="7" fill="#1d4ed8" />
        <rect x="220" y="74" width="70" height="6" rx="3" fill="#1d4ed8" />

        {/* User Avatar Circle */}
        <circle cx="260" cy="135" r="26" fill="#eff6ff" stroke="#93c5fd" strokeWidth="2" />
        <circle cx="260" cy="128" r="10" fill="#3b82f6" />
        <path d="M243 149 C243 141 250 141 260 141 C270 141 277 141 277 149" fill="#3b82f6" />

        {/* ID Card Form Lines */}
        <rect x="210" y="175" width="100" height="6" rx="3" fill="#94a3b8" />
        <rect x="220" y="188" width="80" height="5" rx="2.5" fill="#cbd5e1" />
        <rect x="230" y="200" width="60" height="5" rx="2.5" fill="#cbd5e1" />

        {/* Verified Shield Badge on Card */}
        <circle cx="260" cy="232" r="14" fill="#dcfce7" stroke="#16a34a" strokeWidth="2" />
        <path d="M255 232 L258 235 L266 227" stroke="#16a34a" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />

        {/* Left Floating Box: Security Encryption Key */}
        <rect x="45" y="140" width="115" height="75" rx="10" fill="#ffffff" stroke="#93c5fd" strokeWidth="2" filter="drop-shadow(0 4px 6px rgba(0,0,0,0.05))" />
        <circle cx="70" cy="165" r="12" fill="#eff6ff" />
        <path d="M68 160 A4 4 0 0 1 74 165 V168 H66 V165 A4 4 0 0 1 68 160" stroke="#1d4ed8" strokeWidth="1.5" fill="none" />
        <rect x="65" y="166" width="10" height="8" rx="2" fill="#1d4ed8" />
        <rect x="90" y="157" width="55" height="5" rx="2.5" fill="#94a3b8" />
        <rect x="90" y="167" width="40" height="4" rx="2" fill="#cbd5e1" />
        <text x="70" y="200" fill="#16a34a" fontSize="9" fontWeight="600" fontFamily="sans-serif">Verified Identity</text>

        {/* Right Floating Box: Evidence Storage Ready */}
        <rect x="360" y="125" width="120" height="80" rx="10" fill="#ffffff" stroke="#93c5fd" strokeWidth="2" filter="drop-shadow(0 4px 6px rgba(0,0,0,0.05))" />
        <circle cx="385" cy="155" r="12" fill="#eff6ff" />
        <path d="M381 155 L384 158 L391 151" stroke="#2563eb" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        <rect x="405" y="148" width="55" height="5" rx="2.5" fill="#94a3b8" />
        <rect x="405" y="158" width="40" height="4" rx="2" fill="#cbd5e1" />
        <text x="380" y="190" fill="#2563eb" fontSize="9" fontWeight="600" fontFamily="sans-serif">Case Tracker</text>

        {/* Connecting Dashed Security Lines */}
        <path d="M160 177 C170 177 170 170 180 170" stroke="#93c5fd" strokeWidth="2" strokeDasharray="4 4" />
        <path d="M340 165 C350 165 350 165 360 165" stroke="#93c5fd" strokeWidth="2" strokeDasharray="4 4" />
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

function UserShieldIcon() {
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

function ArrowRightIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M5 12h14M12 5l7 7-7 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function LockClosedIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <rect x="5" y="11" width="14" height="10" rx="2" stroke="currentColor" strokeWidth="1.8" />
      <path d="M8 11V7a4 4 0 118 0v4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  );
}

function UserIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
      <circle cx="12" cy="7" r="4" stroke="currentColor" strokeWidth="1.8" />
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

function PhoneIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07A19.5 19.5 0 013.07 10.8 19.79 19.79 0 01.0 2.18 2 2 0 012 0h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L6.09 7.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0122 16.92z"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
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

function UserPlusIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M16 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      <circle cx="8.5" cy="7" r="4" stroke="currentColor" strokeWidth="2" />
      <line x1="20" y1="8" x2="20" y2="14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      <line x1="23" y1="11" x2="17" y2="11" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
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

function CheckCircleBigIcon() {
  return (
    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M22 11.08V12a10 10 0 11-5.93-9.14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      <polyline points="22 4 12 14.01 9 11.01" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function XIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M6 6l12 12M6 18L18 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}
