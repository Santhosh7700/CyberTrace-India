import { useAuth } from '../../context/useAuth';
import type { AdminProfile } from '../../context/authContextDef';

interface AdminHeaderProps {
  onToggleMobileSidebar: () => void;
  unassignedCount: number;
}

export default function AdminHeader({ onToggleMobileSidebar, unassignedCount }: AdminHeaderProps) {
  const { currentUser } = useAuth();
  const admin = currentUser?.role === 'admin' ? (currentUser as AdminProfile) : null;

  return (
    <header className="bg-white border-b border-slate-200 sticky top-0 z-30 shadow-2xs">
      <div className="px-4 sm:px-6 lg:px-8 py-3.5 flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <button
            onClick={onToggleMobileSidebar}
            className="p-2 rounded-lg text-slate-600 hover:bg-slate-100 lg:hidden"
            aria-label="Open sidebar"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
          <div>
            <div className="flex items-center space-x-2">
              <span className="text-xs font-bold text-emerald-700 uppercase tracking-wider font-mono">
                Central Operations Console
              </span>
              <span className="text-slate-300">•</span>
              <span className="text-xs text-slate-500 font-medium hidden sm:inline">
                National Scam Case Allocation &amp; Supervision
              </span>
            </div>
            <h1 className="text-lg sm:text-xl font-black text-slate-900 tracking-tight flex items-center gap-2">
              <span>Admin Allocation Portal</span>
              {unassignedCount > 0 && (
                <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-amber-100 text-amber-800 border border-amber-300">
                  {unassignedCount} Pending Allocation
                </span>
              )}
            </h1>
          </div>
        </div>

        {/* Admin Identity pill */}
        <div className="flex items-center space-x-3">
          <div className="hidden md:flex flex-col text-right">
            <span className="text-xs font-bold text-slate-900">{admin?.name || 'Administrator V. Singhal'}</span>
            <span className="text-[10px] text-slate-500 font-mono">
              ID: {admin?.adminId || 'CT-ADMIN-001'} • Clearance L1
            </span>
          </div>
          <div className="w-9 h-9 rounded-xl bg-emerald-600 text-white font-extrabold flex items-center justify-center text-xs shadow-xs border border-emerald-400">
            {admin?.name
              ? admin.name
                  .split(' ')
                  .map((n) => n[0])
                  .join('')
                  .slice(0, 2)
              : 'AS'}
          </div>
        </div>
      </div>
    </header>
  );
}
