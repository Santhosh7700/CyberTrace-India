import { useState } from 'react';
import type { InvestigatorCase } from '../../types/investigator';
import { CasePriorityBadge } from '../investigator/CaseStatusBadge';

interface IncomingReportsSectionProps {
  cases: InvestigatorCase[];
  onInspectCase: (caseItem: InvestigatorCase) => void;
  onAllocateCase: (caseItem: InvestigatorCase) => void;
}

export default function IncomingReportsSection({
  cases,
  onInspectCase,
  onAllocateCase,
}: IncomingReportsSectionProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('ALL');
  const [allocationStatusFilter, setAllocationStatusFilter] = useState<'ALL' | 'UNASSIGNED' | 'ASSIGNED'>('ALL');

  const filteredCases = cases.filter((c) => {
    const matchesSearch =
      c.referenceId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.victimName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.category.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesCategory = categoryFilter === 'ALL' || c.category === categoryFilter;

    const isAssigned = Boolean(c.assignedInvestigatorId && c.assignedInvestigatorId.trim() !== '');
    const matchesAllocation =
      allocationStatusFilter === 'ALL' ||
      (allocationStatusFilter === 'UNASSIGNED' && !isAssigned) ||
      (allocationStatusFilter === 'ASSIGNED' && isAssigned);

    return matchesSearch && matchesCategory && matchesAllocation;
  });

  return (
    <div className="space-y-4">
      {/* Search & Filter Toolbar */}
      <div className="bg-white rounded-xl border border-slate-200/90 p-4 shadow-2xs flex flex-col md:flex-row gap-3 items-center justify-between">
        <div className="relative w-full md:w-96">
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search by CT Reference ID, victim, keyword..."
            className="w-full pl-9 pr-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-white transition-colors"
          />
          <svg
            className="w-4 h-4 text-slate-400 absolute left-3 top-2.5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>

        <div className="flex flex-wrap items-center gap-2.5 w-full md:w-auto">
          {/* Category Dropdown */}
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            aria-label="Filter by scam category"
            className="text-xs bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-2 font-medium text-slate-700 focus:outline-none focus:ring-2 focus:ring-emerald-500"
          >
            <option value="ALL">All Categories</option>
            <option value="UPI Fraud">UPI Fraud</option>
            <option value="Fake Investment">Fake Investment</option>
            <option value="Job Scam">Job Scam</option>
            <option value="Phishing">Phishing</option>
            <option value="Online Shopping Fraud">Online Shopping Fraud</option>
            <option value="Social Media Scam">Social Media Scam</option>
            <option value="Other">Other</option>
          </select>

          {/* Allocation Status Switcher */}
          <div className="flex bg-slate-100 p-0.5 rounded-lg text-xs font-semibold">
            <button
              type="button"
              onClick={() => setAllocationStatusFilter('ALL')}
              className={`px-3 py-1.5 rounded-md transition-all ${
                allocationStatusFilter === 'ALL'
                  ? 'bg-white text-slate-900 shadow-2xs font-bold'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              All ({cases.length})
            </button>
            <button
              type="button"
              onClick={() => setAllocationStatusFilter('UNASSIGNED')}
              className={`px-3 py-1.5 rounded-md transition-all ${
                allocationStatusFilter === 'UNASSIGNED'
                  ? 'bg-amber-600 text-white shadow-2xs font-bold'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Pending Allocation ({cases.filter((c) => !c.assignedInvestigatorId).length})
            </button>
            <button
              type="button"
              onClick={() => setAllocationStatusFilter('ASSIGNED')}
              className={`px-3 py-1.5 rounded-md transition-all ${
                allocationStatusFilter === 'ASSIGNED'
                  ? 'bg-emerald-600 text-white shadow-2xs font-bold'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Assigned ({cases.filter((c) => c.assignedInvestigatorId).length})
            </button>
          </div>
        </div>
      </div>

      {/* Reports Table Card */}
      <div className="bg-white rounded-xl border border-slate-200/90 shadow-2xs overflow-hidden">
        <div className="p-4 border-b border-slate-100 flex items-center justify-between">
          <div>
            <h3 className="text-sm font-bold text-slate-900">Incoming Citizen Fraud Complaints</h3>
            <p className="text-xs text-slate-500">
              Verified reports lodged through the Citizen Portal awaiting officer review and triage.
            </p>
          </div>
          <span className="text-xs font-mono font-bold text-slate-500">
            Showing {filteredCases.length} of {cases.length} reports
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50/75 border-b border-slate-200/80 text-slate-600 font-bold uppercase tracking-wider text-[11px]">
              <tr>
                <th className="py-3 px-4">Case Reference ID</th>
                <th className="py-3 px-4">Category &amp; Priority</th>
                <th className="py-3 px-4">Submission Date</th>
                <th className="py-3 px-4">Loss Amount</th>
                <th className="py-3 px-4">Evidence</th>
                <th className="py-3 px-4">Current Allocation</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredCases.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-10 text-center text-slate-400">
                    No incoming reports matched the applied search criteria.
                  </td>
                </tr>
              ) : (
                filteredCases.map((c) => {
                  const isAssigned = Boolean(c.assignedInvestigatorId && c.assignedInvestigatorId.trim() !== '');

                  return (
                    <tr key={c.id} className="hover:bg-slate-50/80 transition-colors">
                      <td className="py-3 px-4">
                        <div className="font-mono font-bold text-slate-900 text-xs">{c.referenceId}</div>
                        <div className="text-[11px] text-slate-500 truncate max-w-xs">{c.description}</div>
                      </td>
                      <td className="py-3 px-4">
                        <div className="font-semibold text-slate-800">{c.category}</div>
                        <div className="mt-0.5">
                          <CasePriorityBadge priority={c.priority} />
                        </div>
                      </td>
                      <td className="py-3 px-4 text-slate-600 font-mono text-[11px] whitespace-nowrap">
                        {c.reportedDate}
                      </td>
                      <td className="py-3 px-4 font-bold text-slate-900">
                        {c.amountLost > 0 ? `₹${c.amountLost.toLocaleString('en-IN')}` : '₹0'}
                      </td>
                      <td className="py-3 px-4">
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-slate-100 text-slate-700 font-semibold text-[11px]">
                          <svg className="w-3.5 h-3.5 text-slate-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13" />
                          </svg>
                          {c.evidenceFiles.length} file{c.evidenceFiles.length !== 1 ? 's' : ''}
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        {isAssigned ? (
                          <div className="flex flex-col">
                            <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-full w-max">
                              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                              Assigned
                            </span>
                            <span className="text-[10px] text-slate-500 font-mono mt-0.5 truncate max-w-[180px]">
                              {c.assignedOfficer}
                            </span>
                          </div>
                        ) : (
                          <span className="inline-flex items-center gap-1 text-[11px] font-bold text-amber-700 bg-amber-50 border border-amber-200 px-2 py-0.5 rounded-full w-max">
                            <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse"></span>
                            Unassigned
                          </span>
                        )}
                      </td>
                      <td className="py-3 px-4 text-right whitespace-nowrap">
                        <div className="flex items-center justify-end space-x-2">
                          <button
                            type="button"
                            onClick={() => onInspectCase(c)}
                            className="px-2.5 py-1 text-slate-700 bg-slate-100 hover:bg-slate-200 rounded font-semibold text-[11px] transition-colors"
                          >
                            Inspect Dossier
                          </button>
                          <button
                            type="button"
                            onClick={() => onAllocateCase(c)}
                            className={`px-3 py-1 rounded font-bold text-[11px] transition-colors ${
                              isAssigned
                                ? 'bg-indigo-50 hover:bg-indigo-100 text-indigo-700 border border-indigo-200'
                                : 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-2xs'
                            }`}
                          >
                            {isAssigned ? 'Reassign' : 'Allocate Officer'}
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
