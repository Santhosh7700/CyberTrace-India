import type { InvestigatorProfile, AuthUser } from '../../context/authContextDef';

interface InvestigatorHeaderProps {
  currentUser: AuthUser | null;
  onOpenMobileMenu: () => void;
  pendingReviewCount: number;
}

export default function InvestigatorHeader({
  currentUser,
  onOpenMobileMenu,
  pendingReviewCount,
}: InvestigatorHeaderProps) {
  const officer = currentUser?.role === 'investigator' ? (currentUser as InvestigatorProfile) : null;

  return (
    <header className="h-16 bg-white border-b border-slate-200 px-4 sm:px-6 lg:px-8 flex items-center justify-between sticky top-0 z-30 shadow-2xs">
      {/* Mobile Toggle & Breadcrumb */}
      <div className="flex items-center space-x-3">
        <button
          type="button"
          onClick={onOpenMobileMenu}
          className="p-2 rounded-lg text-slate-500 hover:text-slate-800 hover:bg-slate-100 lg:hidden focus:outline-none"
          aria-label="Open navigation menu"
        >
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>

        <div className="flex items-center space-x-2">
          <span className="w-2 h-2 rounded-full bg-indigo-600"></span>
          <span className="text-xs font-bold text-slate-800 uppercase tracking-wider hidden sm:inline">
            Investigation Command Console
          </span>
          <span className="text-xs text-slate-400 hidden sm:inline">•</span>
          <span className="text-xs font-mono text-indigo-700 font-semibold bg-indigo-50 px-2 py-0.5 rounded border border-indigo-200">
            {officer?.unit || 'Cyber Crime Investigation Cell'}
          </span>
        </div>
      </div>

      {/* Right Officer Meta Details */}
      <div className="flex items-center space-x-4">
        {/* Pending Case Alert Badge */}
        {pendingReviewCount > 0 && (
          <div className="hidden sm:flex items-center space-x-1.5 px-2.5 py-1 rounded-full bg-amber-50 text-amber-800 border border-amber-200 text-xs font-semibold">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-500"></span>
            <span>{pendingReviewCount} Actionable Cases</span>
          </div>
        )}

        {/* Officer Profile Card */}
        <div className="flex items-center space-x-3 pl-3 border-l border-slate-200">
          <div className="w-9 h-9 rounded-full bg-indigo-900 text-white flex items-center justify-center font-bold text-xs shadow-xs border border-indigo-700">
            {officer?.badgeNumber ? officer.badgeNumber.slice(-4) : 'CYB'}
          </div>
          <div className="hidden md:block text-left">
            <p className="text-xs font-bold text-slate-900 leading-tight">
              {officer?.name || 'Inspector Rajesh Deshmukh'}
            </p>
            <p className="text-[10px] text-slate-500 font-mono">
              Badge: {officer?.badgeNumber || 'MH-CYB-0481'} • {officer?.cyberId || 'CYB-IN-20481'}
            </p>
          </div>
        </div>
      </div>
    </header>
  );
}
