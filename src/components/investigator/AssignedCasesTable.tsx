import { useState } from 'react';
import type { InvestigatorCase, InvestigationStatus } from '../../types/investigator';
import { CaseStatusBadge, CasePriorityBadge } from './CaseStatusBadge';

interface AssignedCasesTableProps {
  cases: InvestigatorCase[];
  onInspectCase: (caseItem: InvestigatorCase) => void;
  onQuickStatusChange: (caseId: string, newStatus: InvestigationStatus) => void;
}

export default function AssignedCasesTable({
  cases,
  onInspectCase,
  onQuickStatusChange,
}: AssignedCasesTableProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStatus, setSelectedStatus] = useState<string>('ALL');
  const [selectedPriority, setSelectedPriority] = useState<string>('ALL');
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');

  const filteredCases = cases.filter((c) => {
    if (selectedStatus !== 'ALL' && c.status !== selectedStatus) return false;
    if (selectedPriority !== 'ALL' && c.priority !== selectedPriority) return false;
    if (selectedCategory !== 'ALL' && c.category !== selectedCategory) return false;

    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    const refMatch = c.referenceId.toLowerCase().includes(q);
    const victimMatch = c.victimName.toLowerCase().includes(q);
    const catMatch = c.category.toLowerCase().includes(q);
    const descMatch = c.description.toLowerCase().includes(q);
    const indMatch = c.suspectIdentifiers.some((i) => i.value.toLowerCase().includes(q));
    return refMatch || victimMatch || catMatch || descMatch || indMatch;
  });

  return (
    <div className="bg-white rounded-xl border border-slate-200/90 shadow-2xs overflow-hidden">
      {/* Header bar */}
      <div className="p-5 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <div className="flex items-center space-x-2 text-indigo-700 text-xs font-bold uppercase tracking-wider mb-0.5">
            <span className="w-2 h-2 rounded-full bg-indigo-600"></span>
            <span>Assigned Case Register</span>
          </div>
          <h3 className="text-base font-bold text-slate-900">Assigned Cyber Incident Complaints</h3>
          <p className="text-xs text-slate-500">
            Active investigations assigned to your desk under Unit 4 jurisdiction.
          </p>
        </div>

        <span className="text-xs font-semibold px-3 py-1 rounded-full bg-indigo-50 text-indigo-800 border border-indigo-200 self-start sm:self-auto">
          {filteredCases.length} of {cases.length} cases displayed
        </span>
      </div>

      {/* Filter and Search Bar */}
      <div className="p-4 bg-slate-50/70 border-b border-slate-200 flex flex-wrap items-center gap-3">
        {/* Search Input */}
        <div className="relative flex-1 min-w-[220px]">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by CT ID, victim, category, suspect identifier..."
            className="w-full px-3 py-2 text-xs bg-white rounded-lg border border-slate-200 focus:outline-none focus:border-indigo-600 font-sans"
          />
        </div>

        {/* Status Filter */}
        <select
          value={selectedStatus}
          onChange={(e) => setSelectedStatus(e.target.value)}
          className="text-xs border border-slate-200 rounded-lg px-3 py-2 bg-white focus:outline-none focus:border-indigo-600"
        >
          <option value="ALL">All Statuses</option>
          <option value="Submitted">Submitted</option>
          <option value="Under Review">Under Review</option>
          <option value="Under Investigation">Under Investigation</option>
          <option value="Evidence Verification">Evidence Verification</option>
          <option value="Resolved">Resolved</option>
          <option value="Closed">Closed</option>
        </select>

        {/* Priority Filter */}
        <select
          value={selectedPriority}
          onChange={(e) => setSelectedPriority(e.target.value)}
          className="text-xs border border-slate-200 rounded-lg px-3 py-2 bg-white focus:outline-none focus:border-indigo-600"
        >
          <option value="ALL">All Priorities</option>
          <option value="Critical">Critical</option>
          <option value="High">High</option>
          <option value="Medium">Medium</option>
          <option value="Low">Low</option>
        </select>

        {/* Category Filter */}
        <select
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
          className="text-xs border border-slate-200 rounded-lg px-3 py-2 bg-white focus:outline-none focus:border-indigo-600"
        >
          <option value="ALL">All Categories</option>
          <option value="UPI Fraud">UPI Fraud</option>
          <option value="Fake Investment">Fake Investment</option>
          <option value="Phishing">Phishing</option>
          <option value="Job Scam">Job Scam</option>
          <option value="Online Shopping Fraud">Online Shopping Fraud</option>
        </select>
      </div>

      {/* Cases Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs">
          <thead className="bg-slate-50 text-slate-500 uppercase tracking-wider font-semibold border-b border-slate-200">
            <tr>
              <th className="py-3 px-4">Case Reference ID</th>
              <th className="py-3 px-4">Scam Category</th>
              <th className="py-3 px-4">Report Date</th>
              <th className="py-3 px-4 text-right">Financial Loss</th>
              <th className="py-3 px-4 text-center">Priority</th>
              <th className="py-3 px-4">Investigation Status</th>
              <th className="py-3 px-4 text-right">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 font-medium">
            {filteredCases.length === 0 ? (
              <tr>
                <td colSpan={7} className="py-12 text-center text-xs text-slate-400">
                  No cases found matching your criteria.
                </td>
              </tr>
            ) : (
              filteredCases.map((c) => (
                <tr key={c.id} className="hover:bg-slate-50/70 transition-colors">
                  {/* Case Ref */}
                  <td className="py-3.5 px-4">
                    <span className="font-mono font-bold text-indigo-700 block">{c.referenceId}</span>
                    <span className="text-[10px] text-slate-400 font-normal">{c.victimName}</span>
                  </td>

                  {/* Category */}
                  <td className="py-3.5 px-4">
                    <span className="font-semibold text-slate-800">{c.category}</span>
                    <span className="block text-[10px] text-slate-400">{c.platform}</span>
                  </td>

                  {/* Report Date */}
                  <td className="py-3.5 px-4 font-mono text-slate-600 text-[11px]">{c.reportedDate}</td>

                  {/* Amount */}
                  <td className="py-3.5 px-4 text-right font-extrabold text-slate-900 font-mono">
                    ₹{c.amountLost.toLocaleString('en-IN')}
                  </td>

                  {/* Priority */}
                  <td className="py-3.5 px-4 text-center">
                    <CasePriorityBadge priority={c.priority} />
                  </td>

                  {/* Status with quick switcher */}
                  <td className="py-3.5 px-4">
                    <div className="flex items-center space-x-2">
                      <CaseStatusBadge status={c.status} />
                      <select
                        aria-label="Change status"
                        value={c.status}
                        onChange={(e) =>
                          onQuickStatusChange(c.id, e.target.value as InvestigationStatus)
                        }
                        className="text-[10px] py-0.5 px-1 bg-white border border-slate-200 rounded text-slate-500 hover:text-slate-800 focus:outline-none"
                      >
                        <option value="Submitted">Submitted</option>
                        <option value="Under Review">Under Review</option>
                        <option value="Under Investigation">Under Investigation</option>
                        <option value="Evidence Verification">Evidence Verification</option>
                        <option value="Resolved">Resolved</option>
                        <option value="Closed">Closed</option>
                      </select>
                    </div>
                  </td>

                  {/* Action */}
                  <td className="py-3.5 px-4 text-right">
                    <button
                      type="button"
                      onClick={() => onInspectCase(c)}
                      className="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-xs font-bold transition-colors shadow-2xs"
                    >
                      Inspect Case
                    </button>
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
