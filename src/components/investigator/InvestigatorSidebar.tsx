import { Link } from 'react-router-dom';

export type InvestigatorTab =
  | 'overview'
  | 'assigned-cases'
  | 'evidence-review'
  | 'fraud-intelligence'
  | 'history'
  | 'profile';

interface InvestigatorSidebarProps {
  activeTab: InvestigatorTab;
  onSelectTab: (tab: InvestigatorTab) => void;
  onLogout: () => void;
  isOpenMobile: boolean;
  onCloseMobile: () => void;
  badgeCounts?: {
    assigned?: number;
    evidence?: number;
  };
}

export default function InvestigatorSidebar({
  activeTab,
  onSelectTab,
  onLogout,
  isOpenMobile,
  onCloseMobile,
  badgeCounts,
}: InvestigatorSidebarProps) {
  const navItems: { id: InvestigatorTab; label: string; icon: string; badge?: number }[] = [
    { id: 'overview', label: 'Overview', icon: 'grid' },
    { id: 'assigned-cases', label: 'Assigned Cases', icon: 'briefcase', badge: badgeCounts?.assigned },
    { id: 'evidence-review', label: 'Evidence Review', icon: 'paperclip', badge: badgeCounts?.evidence },
    { id: 'fraud-intelligence', label: 'Fraud Intelligence', icon: 'cpu' },
    { id: 'history', label: 'Investigation History', icon: 'history' },
    { id: 'profile', label: 'Officer Profile', icon: 'badge' },
  ];

  const handleNavClick = (tab: InvestigatorTab) => {
    onSelectTab(tab);
    onCloseMobile();
  };

  const renderIcon = (type: string) => {
    switch (type) {
      case 'grid':
        return (
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
          </svg>
        );
      case 'briefcase':
        return (
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
          </svg>
        );
      case 'paperclip':
        return (
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13" />
          </svg>
        );
      case 'cpu':
        return (
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 3v2m6-2v2M9 19v2m6-2v2M3 9h2m-2 6h2m14-6h2m-2 6h2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2zM9 9h6v6H9V9z" />
          </svg>
        );
      case 'history':
        return (
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        );
      case 'badge':
        return (
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
          </svg>
        );
      default:
        return null;
    }
  };

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpenMobile && (
        <div
          role="button"
          tabIndex={0}
          aria-label="Close sidebar"
          onClick={onCloseMobile}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              onCloseMobile();
            }
          }}
          className="fixed inset-0 z-40 bg-slate-900/60 backdrop-blur-xs lg:hidden cursor-pointer"
        />
      )}

      {/* Sidebar Container */}
      <aside
        className={`fixed top-0 bottom-0 left-0 z-50 w-64 bg-slate-950 text-white flex flex-col border-r border-slate-800 transition-transform duration-300 ease-in-out lg:static lg:translate-x-0 ${
          isOpenMobile ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Brand Header */}
        <div className="h-16 px-5 border-b border-slate-800 flex items-center justify-between">
          <Link to="/investigator" className="flex items-center space-x-3">
            <div className="w-9 h-9 rounded-lg bg-indigo-600 flex items-center justify-center text-white font-bold shadow-md shadow-indigo-500/20">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 2L4 6v5c0 5.25 3.4 10.15 8 11.35C16.6 21.15 20 16.25 20 11V6L12 2z" />
              </svg>
            </div>
            <div>
              <span className="font-bold text-sm text-white tracking-tight block">CyberTrace</span>
              <span className="text-[10px] uppercase font-mono font-bold text-indigo-400 tracking-wider block">
                Investigator Hub
              </span>
            </div>
          </Link>

          {/* Close mobile button */}
          <button
            type="button"
            onClick={onCloseMobile}
            className="p-1 rounded-md text-slate-400 hover:text-white lg:hidden"
            aria-label="Close menu"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Officer Status Badge */}
        <div className="p-3 mx-3 my-3 bg-slate-900 rounded-xl border border-slate-800">
          <div className="flex items-center space-x-2">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
            <span className="text-[11px] font-semibold text-slate-300">Law Enforcement Session</span>
          </div>
          <p className="text-[10px] text-slate-400 font-mono mt-1">ID: CYB-IN-20481 • Unit 4</p>
        </div>

        {/* Navigation Items */}
        <div className="flex-1 py-2 px-3 space-y-1 overflow-y-auto">
          {navItems.map((item) => {
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => handleNavClick(item.id)}
                className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-lg text-xs font-semibold transition-all ${
                  isActive
                    ? 'bg-indigo-600 text-white shadow-xs'
                    : 'text-slate-400 hover:bg-slate-900 hover:text-slate-200'
                }`}
              >
                <div className="flex items-center space-x-3">
                  <span className={isActive ? 'text-white' : 'text-slate-400'}>{renderIcon(item.icon)}</span>
                  <span>{item.label}</span>
                </div>
                {item.badge !== undefined && item.badge > 0 && (
                  <span
                    className={`px-1.5 py-0.5 rounded-full text-[10px] font-mono font-bold ${
                      isActive ? 'bg-indigo-800 text-white' : 'bg-slate-800 text-slate-300'
                    }`}
                  >
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* Direct Link to Fraud Intelligence Module */}
        <div className="p-3 mx-3 mb-3 bg-gradient-to-br from-indigo-950/60 to-slate-900 rounded-xl border border-indigo-900/50">
          <span className="text-[10px] uppercase font-bold text-indigo-400 block mb-1">
            Global Pattern Engine
          </span>
          <p className="text-[11px] text-slate-400 mb-2">
            Cross-case link topology &amp; suspect indicator syndicates.
          </p>
          <Link
            to="/intelligence"
            className="inline-flex items-center justify-center w-full py-1.5 bg-indigo-600/80 hover:bg-indigo-600 text-white text-[11px] font-bold rounded-lg transition-colors"
          >
            Launch Intelligence →
          </Link>
        </div>

        {/* Sign Out Action */}
        <div className="p-3 border-t border-slate-800">
          <button
            type="button"
            onClick={onLogout}
            className="w-full flex items-center space-x-3 px-3 py-2 text-xs font-semibold text-rose-400 hover:bg-rose-950/30 hover:text-rose-300 rounded-lg transition-colors"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
            </svg>
            <span>Sign Out Session</span>
          </button>
        </div>
      </aside>
    </>
  );
}
