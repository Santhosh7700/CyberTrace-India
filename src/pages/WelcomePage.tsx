import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/useAuth';

export default function WelcomePage() {
  const { currentUser, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    navigate('/', { replace: true });
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-between">
      {/* Navigation Header */}
      <header className="bg-white border-b border-blue-100 shadow-xs">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-10 xl:px-14 h-16 flex items-center justify-between">
          <Link
            to="/"
            className="flex items-center gap-2 text-blue-800 font-bold text-xl tracking-tight hover:opacity-90 transition-opacity"
          >
            <ShieldIcon />
            <span>
              CyberTrace<span className="text-blue-500">India</span>
            </span>
          </Link>

          <div className="flex items-center gap-4">
            <div className="hidden sm:flex items-center gap-2 px-3 py-1 bg-blue-50 border border-blue-200 rounded-full text-xs text-blue-700">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span className="font-medium">{currentUser?.fullName}</span>
            </div>

            <button
              type="button"
              onClick={handleLogout}
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 text-xs sm:text-sm font-medium text-red-700 bg-red-50 border border-red-200 rounded-lg hover:bg-red-100 transition-colors"
            >
              <LogoutIcon />
              <span>Logout</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 max-w-[1000px] w-full mx-auto px-4 sm:px-6 py-10 flex flex-col justify-center">
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 sm:p-10 space-y-8">
          
          {/* Success Banner if arriving from new registration */}
          {(location.state as { fromRegistration?: boolean } | null)?.fromRegistration && (
            <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-xl text-emerald-900 text-xs sm:text-sm flex items-start gap-3">
              <span className="shrink-0 mt-0.5 text-emerald-600">
                <CheckCircleIcon />
              </span>
              <div>
                <span className="font-semibold">Account created successfully!</span> You have been automatically authenticated into your citizen session.
              </div>
            </div>
          )}

          {/* Header Message */}
          <div className="text-center sm:text-left border-b border-slate-100 pb-6">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-emerald-100 text-emerald-800 text-xs font-semibold rounded-full tracking-wide uppercase border border-emerald-200 mb-3">
              <CheckCircleIcon />
              <span>Authenticated Citizen Session</span>
            </div>
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-slate-900">
              Welcome, <span className="text-blue-700">{currentUser?.fullName || 'Citizen'}</span>
            </h1>
            <p className="text-base text-slate-600 mt-2 font-medium">
              Your account session is active.
            </p>
          </div>

          {/* User Profile Card */}
          <div className="bg-slate-50 border border-slate-200 rounded-xl p-5 sm:p-6">
            <h2 className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-4">
              Demo Session Profile Details
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              <div className="bg-white p-3.5 rounded-lg border border-slate-200">
                <span className="text-xs text-slate-400 block">Citizen Name</span>
                <span className="text-sm font-semibold text-slate-800 break-words">{currentUser?.fullName}</span>
              </div>
              <div className="bg-white p-3.5 rounded-lg border border-slate-200">
                <span className="text-xs text-slate-400 block">Registered Email</span>
                <span className="text-sm font-semibold text-slate-800 break-words">{currentUser?.email}</span>
              </div>
              <div className="bg-white p-3.5 rounded-lg border border-slate-200">
                <span className="text-xs text-slate-400 block">Mobile Number</span>
                <span className="text-sm font-semibold text-slate-800">{currentUser?.mobile}</span>
              </div>
            </div>
          </div>

          {/* Task 05 Dashboard Notice Placeholder */}
          <div className="bg-blue-50 border border-blue-200 rounded-xl p-5 sm:p-6 flex flex-col sm:flex-row items-start gap-4">
            <div className="w-10 h-10 rounded-lg bg-blue-100 text-blue-700 flex items-center justify-center shrink-0">
              <DashboardIcon />
            </div>
            <div className="space-y-1.5 flex-1">
              <h3 className="text-base font-semibold text-blue-950">
                Victim Dashboard Coming in Task 05
              </h3>
              <p className="text-xs sm:text-sm text-blue-800 leading-relaxed">
                The comprehensive Citizen / Victim Dashboard will be developed in the upcoming task. It will provide the complete workflow to:
              </p>
              <ul className="text-xs text-blue-800 space-y-1 list-disc list-inside pt-1">
                <li>Submit structured scam reports (UPI fraud, phishing, fake calls, etc.)</li>
                <li>Upload digital evidence documents and transaction screenshots</li>
                <li>Track investigation progress and view assigned case numbers</li>
              </ul>
              <p className="text-xs text-blue-600 italic pt-1">
                Note: In this frontend prototype, session state is retained in-memory during page use and resets on a full browser reload.
              </p>
            </div>
          </div>

          {/* Actions */}
          <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-3 border-t border-slate-100">
            <Link
              to="/"
              className="text-xs sm:text-sm font-medium text-slate-600 hover:text-blue-700 transition-colors inline-flex items-center gap-1.5"
            >
              <ArrowLeftIcon />
              <span>Back to Public Landing Page</span>
            </Link>

            <button
              type="button"
              onClick={handleLogout}
              className="w-full sm:w-auto px-5 py-2.5 bg-blue-700 text-white text-xs sm:text-sm font-semibold rounded-lg hover:bg-blue-800 transition-colors shadow-sm inline-flex items-center justify-center gap-2"
            >
              <LogoutIcon />
              <span>Logout</span>
            </button>
          </div>

        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-200 py-4 bg-white text-center text-xs text-slate-500">
        CyberTrace-India • Citizen Cybercrime Reporting System Prototype (Task 04)
      </footer>
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

function CheckCircleIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M22 11.08V12a10 10 0 11-5.93-9.14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      <polyline points="22 4 12 14.01 9 11.01" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function DashboardIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <rect x="3" y="3" width="7" height="9" rx="1.5" stroke="currentColor" strokeWidth="1.8" />
      <rect x="14" y="3" width="7" height="5" rx="1.5" stroke="currentColor" strokeWidth="1.8" />
      <rect x="14" y="12" width="7" height="9" rx="1.5" stroke="currentColor" strokeWidth="1.8" />
      <rect x="3" y="16" width="7" height="5" rx="1.5" stroke="currentColor" strokeWidth="1.8" />
    </svg>
  );
}

function LogoutIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
      <polyline points="16 17 21 12 16 7" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
      <line x1="21" y1="12" x2="9" y2="12" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function ArrowLeftIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M19 12H5M12 19l-7-7 7-7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
