import { useState } from 'react';
import type { InvestigatorCase } from '../../types/investigator';
import { CaseStatusBadge, CasePriorityBadge } from '../investigator/CaseStatusBadge';

interface AllCasesMonitoringSectionProps {
  cases: InvestigatorCase[];
  onInspectCase: (caseItem: InvestigatorCase) => void;
  onAllocateCase: (caseItem: InvestigatorCase) => void;
}

export default function AllCasesMonitoringSection({
  cases,
  onInspectCase,
  onAllocateCase,
}: AllCasesMonitoringSectionProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');

  const filteredCases = cases.filter((c) => {
    const matchesSearch =
      c.referenceId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.assignedOfficer.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.description.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus = statusFilter === 'ALL' || c.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-4">
      {/* Filter toolbar */}
      <div className="bg-white rounded-xl border border-slate-200/90 p-4 shadow-2xs flex flex-col md:flex-row gap-3 items-center justify-between">
        <div className="relative w-full md:w-96">
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search reference, officer, category, keyword..."
            className="w-full pl-9 pr-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
          />
          <svg className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>

        <div className="flex items-center gap-2">
          <label htmlFor="status-filter-select" className="text-xs text-slate-500 font-medium">Filter by Stage:</label>
          <select
            id="status-filter-select"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="text-xs bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 font-medium text-slate-700 focus:outline-none focus:ring-2 focus:ring-emerald-500"
          >
            <option value="ALL">All Stages ({cases.length})</option>
            <option value="Submitted">Submitted (Unassigned/New)</option>
            <option value="Under Review">Under Review</option>
            <option value="Under Investigation">Under Investigation</option>
            <option value="Evidence Verification">Evidence Verification</option>
            <option value="Resolved">Resolved</option>
            <option value="Closed">Closed</option>
          </select>
        </div>
      </div>

      {/* Cases Table */}
      <div className="bg-white rounded-xl border border-slate-200/90 shadow-2xs overflow-hidden">
        <div className="p-4 border-b border-slate-100 flex items-center justify-between">
          <h3 className="text-sm font-bold text-slate-900">National Central Incident Registry</h3>
          <span className="text-xs font-mono font-bold text-slate-500">
            {filteredCases.length} of {cases.length} records
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 font-bold uppercase tracking-wider text-[11px]">
              <tr>
                <th className="py-3 px-4">Case Reference ID</th>
                <th className="py-3 px-4">Category</th>
                <th className="py-3 px-4">Priority</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4">Assigned Investigating Officer</th>
                <th className="py-3 px-4">Loss Amount</th>
                <th className="py-3 px-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredCases.map((c) => (
                <tr key={c.id} className="hover:bg-slate-50/80 transition-colors">
                  <td className="py-3 px-4 font-mono font-bold text-slate-900">
                    {c.referenceId}
                  </td>
                  <td className="py-3 px-4 font-semibold text-slate-800">{c.category}</td>
                  <td className="py-3 px-4">
                    <CasePriorityBadge priority={c.priority} />
                  </td>
                  <td className="py-3 px-4">
                    <CaseStatusBadge status={c.status} />
                  </td>
                  <td className="py-3 px-4">
                    {c.assignedOfficer && c.assignedOfficer !== 'Unassigned' ? (
                      <span className="text-slate-800 font-medium">{c.assignedOfficer}</span>
                    ) : (
                      <span className="text-amber-700 font-bold bg-amber-50 px-2 py-0.5 rounded text-[10px]">
                        Pending Allocation
                      </span>
                    )}
                  </td>
                  <td className="py-3 px-4 font-bold text-slate-900">
                    ₹{c.amountLost.toLocaleString('en-IN')}
                  </td>
                  <td className="py-3 px-4 text-right whitespace-nowrap">
                    <div className="flex items-center justify-end space-x-2">
                      <button
                        type="button"
                        onClick={() => onInspectCase(c)}
                        className="px-2.5 py-1 text-slate-700 bg-slate-100 hover:bg-slate-200 rounded font-semibold text-[11px] transition-colors"
                      >
                        Inspect
                      </button>
                      <button
                        type="button"
                        onClick={() => onAllocateCase(c)}
                        className="px-2.5 py-1 text-emerald-700 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 rounded font-bold text-[11px] transition-colors"
                      >
                        {c.assignedInvestigatorId ? 'Reassign' : 'Allocate'}
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
