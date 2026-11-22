import { useState } from 'react';
import type { DemoInvestigator } from '../../types/allocation';
import type { InvestigatorCase } from '../../types/investigator';

interface InvestigatorManagementSectionProps {
  investigators: DemoInvestigator[];
  cases: InvestigatorCase[];
  onInspectCase: (caseItem: InvestigatorCase) => void;
  onAllocateNewCase: (investigator: DemoInvestigator) => void;
}

export default function InvestigatorManagementSection({
  investigators,
  cases,
  onInspectCase,
  onAllocateNewCase,
}: InvestigatorManagementSectionProps) {
  const [selectedOfficerCyberId, setSelectedOfficerCyberId] = useState<string>(
    investigators[0]?.cyberId || ''
  );

  const selectedOfficer = investigators.find((inv) => inv.cyberId === selectedOfficerCyberId);
  const officerCases = cases.filter((c) => c.assignedInvestigatorId === selectedOfficerCyberId);

  const getStats = (cyberId: string) => {
    const assigned = cases.filter((c) => c.assignedInvestigatorId === cyberId);
    const active = assigned.filter(
      (c) => c.status === 'Under Review' || c.status === 'Under Investigation' || c.status === 'Evidence Verification'
    ).length;
    const resolved = assigned.filter((c) => c.status === 'Resolved' || c.status === 'Closed').length;
    return { total: assigned.length, active, resolved };
  };

  return (
    <div className="space-y-6">
      {/* Top Header Card */}
      <div className="bg-white rounded-xl border border-slate-200/90 p-5 shadow-2xs flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2 text-xs font-bold text-emerald-700 uppercase tracking-wider mb-1">
            <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
            <span>Roster &amp; Workload Monitoring</span>
          </div>
          <h2 className="text-lg font-bold text-slate-900">Cyber Investigative Officers &amp; Analysts</h2>
          <p className="text-xs text-slate-500">
            View active officers, real-time docket workloads, case resolution metrics, and assigned cases.
          </p>
        </div>
        <div className="px-3 py-1.5 bg-slate-100 rounded-lg text-xs font-mono font-bold text-slate-700">
          Total Officers: {investigators.length} Active
        </div>
      </div>

      {/* Officers Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
        {investigators.map((inv) => {
          const stats = getStats(inv.cyberId);
          const isSelected = selectedOfficerCyberId === inv.cyberId;

          return (
            <div
              key={inv.cyberId}
              onClick={() => setSelectedOfficerCyberId(inv.cyberId)}
              className={`bg-white rounded-xl p-5 border cursor-pointer transition-all shadow-2xs ${
                isSelected
                  ? 'border-emerald-600 ring-2 ring-emerald-500/20'
                  : 'border-slate-200 hover:border-slate-300'
              }`}
            >
              <div className="flex items-start justify-between mb-3">
                <div className="w-11 h-11 rounded-xl bg-slate-900 text-white font-extrabold flex items-center justify-center text-sm shadow-xs border border-slate-700">
                  {inv.avatarInitials}
                </div>
                <span
                  className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                    inv.availability === 'Active Duty'
                      ? 'bg-emerald-100 text-emerald-800'
                      : 'bg-blue-100 text-blue-800'
                  }`}
                >
                  {inv.availability}
                </span>
              </div>

              <h3 className="font-bold text-slate-900 text-sm">{inv.name}</h3>
              <p className="text-[11px] text-slate-500 font-mono mt-0.5">{inv.cyberId}</p>
              <p className="text-[11px] text-indigo-700 font-medium mt-1 truncate">{inv.rank}</p>

              <div className="mt-4 pt-3 border-t border-slate-100 grid grid-cols-3 gap-1 text-center">
                <div className="p-1.5 bg-slate-50 rounded-lg">
                  <span className="text-[10px] text-slate-400 font-bold block uppercase">Total</span>
                  <span className="text-xs font-black text-slate-800">{stats.total}</span>
                </div>
                <div className="p-1.5 bg-amber-50 rounded-lg">
                  <span className="text-[10px] text-amber-700 font-bold block uppercase">Active</span>
                  <span className="text-xs font-black text-amber-800">{stats.active}</span>
                </div>
                <div className="p-1.5 bg-emerald-50 rounded-lg">
                  <span className="text-[10px] text-emerald-700 font-bold block uppercase">Resolved</span>
                  <span className="text-xs font-black text-emerald-800">{stats.resolved}</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Selected Officer Detailed Case Docket */}
      {selectedOfficer && (
        <div className="bg-white rounded-xl border border-slate-200/90 shadow-2xs overflow-hidden">
          <div className="p-5 border-b border-slate-100 bg-slate-50/50 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <div>
              <div className="flex items-center space-x-2 text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-0.5">
                <span>Selected Officer Docket</span>
                <span>•</span>
                <span className="text-emerald-700 font-mono">{selectedOfficer.badgeNumber}</span>
              </div>
              <h3 className="text-base font-bold text-slate-900">
                {selectedOfficer.name} — Assigned Cases ({officerCases.length})
              </h3>
              <p className="text-xs text-slate-500">
                Unit: {selectedOfficer.unit} • {selectedOfficer.department}
              </p>
            </div>
            <button
              type="button"
              onClick={() => onAllocateNewCase(selectedOfficer)}
              className="px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-bold shadow-2xs transition-colors flex items-center space-x-1.5"
            >
              <span>+ Allocate Case to this Officer</span>
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 font-bold uppercase tracking-wider text-[11px]">
                <tr>
                  <th className="py-3 px-4">Case Reference ID</th>
                  <th className="py-3 px-4">Category</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4">Loss Amount</th>
                  <th className="py-3 px-4">Reported Date</th>
                  <th className="py-3 px-4 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {officerCases.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="py-8 text-center text-slate-400">
                      No cases are currently assigned to this investigator.
                    </td>
                  </tr>
                ) : (
                  officerCases.map((c) => (
                    <tr key={c.id} className="hover:bg-slate-50/80 transition-colors">
                      <td className="py-3 px-4 font-mono font-bold text-slate-900">
                        {c.referenceId}
                      </td>
                      <td className="py-3 px-4 font-medium text-slate-700">{c.category}</td>
                      <td className="py-3 px-4">
                        <span className="inline-flex px-2 py-0.5 rounded-full text-[11px] font-bold bg-slate-100 text-slate-800">
                          {c.status}
                        </span>
                      </td>
                      <td className="py-3 px-4 font-bold text-slate-900">
                        {c.amountLost > 0 ? `₹${c.amountLost.toLocaleString('en-IN')}` : '₹0'}
                      </td>
                      <td className="py-3 px-4 text-slate-500 font-mono text-[11px]">{c.reportedDate}</td>
                      <td className="py-3 px-4 text-right">
                        <button
                          type="button"
                          onClick={() => onInspectCase(c)}
                          className="px-2.5 py-1 text-slate-700 bg-slate-100 hover:bg-slate-200 rounded font-semibold text-[11px] transition-colors"
                        >
                          View Details
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
