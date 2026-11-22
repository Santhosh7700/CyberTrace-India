import type { InvestigatorProfile, AuthUser } from '../../context/authContextDef';

interface InvestigatorProfileSectionProps {
  currentUser: AuthUser | null;
  assignedCount: number;
  resolvedCount: number;
}

export default function InvestigatorProfileSection({
  currentUser,
  assignedCount,
  resolvedCount,
}: InvestigatorProfileSectionProps) {
  const officer = currentUser?.role === 'investigator' ? (currentUser as InvestigatorProfile) : null;

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      {/* Officer Credential Card */}
      <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-2xs">
        <div className="p-6 sm:p-8 bg-gradient-to-r from-slate-900 to-indigo-950 text-white">
          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-5">
            <div className="w-20 h-20 rounded-2xl bg-indigo-600 flex items-center justify-center text-white font-extrabold text-2xl shadow-lg border-2 border-indigo-400">
              {officer?.badgeNumber ? officer.badgeNumber.slice(-4) : 'CYB'}
            </div>
            <div className="text-center sm:text-left">
              <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-[10px] font-bold uppercase tracking-wider mb-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
                Official Verified Law Enforcement
              </div>
              <h2 className="text-xl sm:text-2xl font-bold text-white">
                {officer?.name || 'Inspector Rajesh Deshmukh'}
              </h2>
              <p className="text-xs text-indigo-200 mt-0.5">
                {officer?.rank || 'Senior Cyber Forensic Inspector'}
              </p>
              <p className="text-xs text-slate-400 mt-1 font-mono">
                Cyber ID: {officer?.cyberId || 'CYB-IN-20481'} • Badge: {officer?.badgeNumber || 'MH-CYB-0481'}
              </p>
            </div>
          </div>
        </div>

        {/* Officer Details Grid */}
        <div className="p-6 sm:p-8 space-y-6 text-xs text-slate-700">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200">
              <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">Assigned Unit</span>
              <p className="font-semibold text-slate-900 text-xs sm:text-sm mt-0.5">
                {officer?.unit || 'Cyber Crime Investigation Cell (Unit 4)'}
              </p>
            </div>
            <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200">
              <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">Jurisdiction Zone</span>
              <p className="font-semibold text-slate-900 text-xs sm:text-sm mt-0.5">
                State Financial Crime &amp; Cyber Fraud Division
              </p>
            </div>
            <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200">
              <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">Active Assigned Cases</span>
              <p className="font-extrabold text-indigo-700 text-base mt-0.5">{assignedCount} Cases</p>
            </div>
            <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200">
              <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">Closed &amp; Resolved</span>
              <p className="font-extrabold text-emerald-700 text-base mt-0.5">{resolvedCount} Cases</p>
            </div>
          </div>

          <div className="p-4 bg-amber-50 rounded-xl border border-amber-200 text-[11px] text-amber-900 leading-relaxed">
            <strong>Demonstration Prototype Note:</strong> This officer credential profile is mock demonstration data for CyberTrace India. In production systems, officer profiles authenticate via National Cyber Crime Reporting Portal (NCRP) single sign-on with PKI smart-cards.
          </div>
        </div>
      </div>
    </div>
  );
}
