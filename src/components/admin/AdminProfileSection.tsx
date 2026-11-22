import type { AdminProfile, AuthUser } from '../../context/authContextDef';

interface AdminProfileSectionProps {
  currentUser: AuthUser | null;
  totalAllocationsCount: number;
}

export default function AdminProfileSection({ currentUser, totalAllocationsCount }: AdminProfileSectionProps) {
  const admin = currentUser?.role === 'admin' ? (currentUser as AdminProfile) : null;

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      {/* Officer Credential Card */}
      <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-2xs">
        <div className="p-6 sm:p-8 bg-gradient-to-r from-slate-900 to-emerald-950 text-white">
          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-5">
            <div className="w-20 h-20 rounded-2xl bg-emerald-600 flex items-center justify-center text-white font-extrabold text-2xl shadow-lg border-2 border-emerald-400">
              {admin?.adminId ? admin.adminId.slice(-3) : 'ADM'}
            </div>
            <div className="text-center sm:text-left">
              <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-[10px] font-bold uppercase tracking-wider mb-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
                Official Command Administrator
              </div>
              <h2 className="text-xl sm:text-2xl font-bold text-white">
                {admin?.name || 'Administrator V. Singhal'}
              </h2>
              <p className="text-xs text-emerald-200 mt-0.5">
                {admin?.department || 'National Cyber Operations & Case Allocation Directorate'}
              </p>
              <p className="text-xs text-slate-400 mt-1 font-mono">
                Admin ID: {admin?.adminId || 'CT-ADMIN-001'} • Clearance: {admin?.clearanceLevel || 'Supervisory L1'}
              </p>
            </div>
          </div>
        </div>

        {/* Details Grid */}
        <div className="p-6 sm:p-8 space-y-6 text-xs text-slate-700">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200">
              <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">Assigned Directorate</span>
              <p className="font-semibold text-slate-900 text-xs sm:text-sm mt-0.5">
                Central Cyber Operations Control Hub
              </p>
            </div>
            <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200">
              <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">Supervisory Clearance</span>
              <p className="font-semibold text-slate-900 text-xs sm:text-sm mt-0.5">
                {admin?.clearanceLevel || 'Directorate Clearance L1'}
              </p>
            </div>
            <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200">
              <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">Case Allocations Logged</span>
              <p className="font-extrabold text-emerald-700 text-base mt-0.5">{totalAllocationsCount} Allocations</p>
            </div>
            <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200">
              <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">Active Session State</span>
              <p className="font-semibold text-slate-900 text-xs sm:text-sm mt-0.5">
                Frontend Demonstration Session (Memory + Storage)
              </p>
            </div>
          </div>

          <div className="p-4 bg-slate-50 rounded-xl border border-slate-200">
            <h4 className="font-bold text-slate-900 mb-1">Administrative Role Responsibilities</h4>
            <ul className="space-y-1 text-slate-600 list-disc list-inside">
              <li>Reviewing citizen-submitted cyber fraud reports.</li>
              <li>Evaluating case severity and triage priority based on financial loss and syndicate patterns.</li>
              <li>Allocating incidents to specialized investigative units and cyber forensic officers.</li>
              <li>Supervising officer workloads, resolution metrics, and system audit logs.</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
