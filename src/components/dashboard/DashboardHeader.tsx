import type { UserProfile } from '../../context/authContextDef';

interface HeaderProps {
  currentUser: UserProfile | null;
  onOpenMobileMenu: () => void;
  unreadCount?: number;
}

export default function DashboardHeader({
  currentUser,
  onOpenMobileMenu,
  unreadCount = 2,
}: HeaderProps) {
  // Current date formatted cleanly
  const today = new Intl.DateTimeFormat('en-IN', {
    weekday: 'short',
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  }).format(new Date());

  const getInitials = (name?: string) => {
    if (!name) return 'CT';
    const parts = name.trim().split(/\s+/);
    if (parts.length === 1) return parts[0].substring(0, 2).toUpperCase();
    return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
  };

  return (
    <header className="h-16 bg-white border-b border-slate-200 px-4 sm:px-6 lg:px-8 flex items-center justify-between sticky top-0 z-30 shadow-xs">
      {/* Left: Mobile hamburger & welcome */}
      <div className="flex items-center space-x-3">
        <button
          onClick={onOpenMobileMenu}
          className="p-2 -ml-2 rounded-lg text-slate-600 hover:text-slate-900 hover:bg-slate-100 lg:hidden focus:outline-none"
          aria-label="Open navigation menu"
        >
          <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>

        <div>
          <h1 className="text-base sm:text-lg font-bold text-slate-900 leading-tight">
            Welcome, <span className="text-blue-700">{currentUser?.fullName || 'Citizen'}</span>
          </h1>
          <p className="text-xs text-slate-500 hidden sm:block">
            Online Scam Evidence Gathering & Reporting Portal (Demo)
          </p>
        </div>
      </div>

      {/* Right: Date, Notifications, Avatar */}
      <div className="flex items-center space-x-3 sm:space-x-5">
        {/* Date Display */}
        <div className="hidden md:flex items-center text-xs font-medium text-slate-500 bg-slate-100 px-3 py-1.5 rounded-full border border-slate-200/60">
          <svg className="w-3.5 h-3.5 mr-1.5 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
            />
          </svg>
          {today}
        </div>

        {/* Notification Bell (UI only) */}
        <div className="relative">
          <button
            type="button"
            className="p-2 rounded-lg text-slate-500 hover:text-slate-800 hover:bg-slate-100 transition-colors relative"
            title="Notifications (2 unread system alerts)"
            aria-label="View notifications"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
              />
            </svg>
            {unreadCount > 0 && (
              <span className="absolute top-1.5 right-1.5 flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-600"></span>
              </span>
            )}
          </button>
        </div>

        {/* User Avatar */}
        <div className="flex items-center space-x-2 pl-2 border-l border-slate-200">
          <div className="w-9 h-9 rounded-full bg-blue-700 text-white font-semibold text-xs flex items-center justify-center ring-2 ring-blue-100 shadow-xs">
            {getInitials(currentUser?.fullName)}
          </div>
          <div className="hidden xl:block text-left">
            <p className="text-xs font-semibold text-slate-800 leading-none truncate max-w-[120px]">
              {currentUser?.fullName || 'Citizen User'}
            </p>
            <p className="text-[10px] text-slate-500 leading-tight mt-0.5">Verified Citizen</p>
          </div>
        </div>
      </div>
    </header>
  );
}
