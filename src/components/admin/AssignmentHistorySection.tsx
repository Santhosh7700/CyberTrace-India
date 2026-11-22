import type { CaseAssignmentRecord } from '../../types/allocation';

interface AssignmentHistorySectionProps {
  history: CaseAssignmentRecord[];
}

export default function AssignmentHistorySection({ history }: AssignmentHistorySectionProps) {
  return (
    <div className="bg-white rounded-xl border border-slate-200/90 shadow-2xs overflow-hidden">
      <div className="p-5 border-b border-slate-100 flex items-center justify-between">
        <div>
          <div className="flex items-center space-x-2 text-xs font-bold text-emerald-700 uppercase tracking-wider mb-1">
            <span className="w-2 h-2 rounded-full bg-emerald-600"></span>
            <span>Administrative Audit Log</span>
          </div>
          <h3 className="text-base font-bold text-slate-900">Case Allocation &amp; Reassignment History</h3>
          <p className="text-xs text-slate-500">
            Immutable log of officer allocation events, administrator directives, and transfer timestamps.
          </p>
        </div>
        <span className="text-xs font-mono font-bold text-slate-500">
          {history.length} logged assignments
        </span>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs">
          <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 font-bold uppercase tracking-wider text-[11px]">
            <tr>
              <th className="py-3.5 px-4">Case Reference ID</th>
              <th className="py-3.5 px-4">Action Type</th>
              <th className="py-3.5 px-4">Assigned Investigator</th>
              <th className="py-3.5 px-4">Previous Officer</th>
              <th className="py-3.5 px-4">Allocated By (Admin)</th>
              <th className="py-3.5 px-4">Timestamp</th>
              <th className="py-3.5 px-4">Directives / Notes</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {history.length === 0 ? (
              <tr>
                <td colSpan={7} className="py-8 text-center text-slate-400">
                  No allocation history entries recorded yet.
                </td>
              </tr>
            ) : (
              history.map((record) => (
                <tr key={record.id} className="hover:bg-slate-50/75 transition-colors">
                  <td className="py-3 px-4 font-mono font-bold text-emerald-800">
                    {record.caseRef}
                  </td>
                  <td className="py-3 px-4">
                    <span
                      className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold ${
                        record.action === 'Reassignment'
                          ? 'bg-purple-100 text-purple-800'
                          : 'bg-emerald-100 text-emerald-800'
                      }`}
                    >
                      <span className="w-1.5 h-1.5 rounded-full bg-current"></span>
                      {record.action}
                    </span>
                  </td>
                  <td className="py-3 px-4 font-bold text-slate-900">
                    {record.newInvestigatorName}
                  </td>
                  <td className="py-3 px-4 text-slate-500">
                    {record.previousInvestigatorName ? (
                      <span className="font-mono text-[11px] text-slate-600">
                        {record.previousInvestigatorName}
                      </span>
                    ) : (
                      <span className="text-slate-400 italic text-[11px]">None (New Filing)</span>
                    )}
                  </td>
                  <td className="py-3 px-4 font-semibold text-slate-700">
                    {record.assignedByAdminName}
                  </td>
                  <td className="py-3 px-4 font-mono text-[11px] text-slate-500 whitespace-nowrap">
                    {record.timestamp}
                  </td>
                  <td className="py-3 px-4 text-slate-600 max-w-xs truncate text-[11px]">
                    {record.notes || 'Routine case assignment.'}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
