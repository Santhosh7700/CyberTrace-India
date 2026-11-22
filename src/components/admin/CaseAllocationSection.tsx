import React, { useState } from 'react';
import type { InvestigatorCase } from '../../types/investigator';
import type { DemoInvestigator } from '../../types/allocation';
import { CasePriorityBadge } from '../investigator/CaseStatusBadge';

interface CaseAllocationSectionProps {
  cases: InvestigatorCase[];
  investigators: DemoInvestigator[];
  onAssign: (
    caseId: string,
    investigatorId: string,
    notes?: string
  ) => { success: boolean; error?: string };
  onInspectCase: (caseItem: InvestigatorCase) => void;
  preselectedCaseId?: string | null;
}

export default function CaseAllocationSection({
  cases,
  investigators,
  onAssign,
  onInspectCase,
  preselectedCaseId,
}: CaseAllocationSectionProps) {
  const [selectedCaseId, setSelectedCaseId] = useState<string>(() => {
    if (preselectedCaseId) return preselectedCaseId;
    const firstUnassigned = cases.find((c) => !c.assignedInvestigatorId);
    return firstUnassigned ? firstUnassigned.id : cases[0]?.id || '';
  });

  const [selectedInvestigatorId, setSelectedInvestigatorId] = useState<string>(
    investigators[0]?.cyberId || ''
  );
  const [assignmentNote, setAssignmentNote] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  const selectedCase = cases.find((c) => c.id === selectedCaseId);
  const selectedInvestigator = investigators.find((inv) => inv.cyberId === selectedInvestigatorId);

  // Investigator workload statistics computed from current cases
  const getInvestigatorStats = (cyberId: string) => {
    const assigned = cases.filter((c) => c.assignedInvestigatorId === cyberId);
    const active = assigned.filter(
      (c) => c.status === 'Under Review' || c.status === 'Under Investigation' || c.status === 'Evidence Verification'
    ).length;
    const resolved = assigned.filter((c) => c.status === 'Resolved' || c.status === 'Closed').length;
    return { total: assigned.length, active, resolved };
  };

  const handleConfirmAssignment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedCase || !selectedInvestigator) return;

    setIsSubmitting(true);
    setFeedback(null);

    setTimeout(() => {
      const result = onAssign(selectedCase.id, selectedInvestigator.cyberId, assignmentNote);
      setIsSubmitting(false);

      if (result.success) {
        setFeedback({
          type: 'success',
          message: `Case ${selectedCase.referenceId} successfully assigned to ${selectedInvestigator.name} (${selectedInvestigator.cyberId}). Case immediately synchronized with officer workspace.`,
        });
        setAssignmentNote('');
      } else {
        setFeedback({
          type: 'error',
          message: result.error || 'Failed to complete case allocation.',
        });
      }
    }, 250);
  };

  return (
    <div className="space-y-6">
      {/* Banner / Instructions */}
      <div className="bg-gradient-to-r from-slate-900 to-indigo-950 rounded-2xl p-6 text-white border border-slate-800 shadow-md">
        <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-[10px] font-bold uppercase tracking-wider mb-2">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
          Direct Officer Allocation Workflow
        </div>
        <h2 className="text-xl font-black tracking-tight text-white">Administrative Case Allocation Engine</h2>
        <p className="text-xs text-slate-300 mt-1 max-w-2xl leading-relaxed">
          Select an unassigned or active case, inspect its triage priority, assess investigator workloads, and formally assign ownership. Changes synchronize immediately across the Investigator Portal.
        </p>
      </div>

      {feedback && (
        <div
          className={`p-4 rounded-xl text-xs font-semibold flex items-center justify-between border ${
            feedback.type === 'success'
              ? 'bg-emerald-50 border-emerald-200 text-emerald-900'
              : 'bg-rose-50 border-rose-200 text-rose-900'
          }`}
        >
          <div className="flex items-center space-x-2">
            <span className="w-2 h-2 rounded-full bg-current"></span>
            <span>{feedback.message}</span>
          </div>
          <button
            type="button"
            onClick={() => setFeedback(null)}
            className="text-slate-400 hover:text-slate-700 font-bold ml-4"
          >
            ✕
          </button>
        </div>
      )}

      {/* Main 2-Column Allocation Workspace */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Column: Select Case & Case Preview (7 Cols) */}
        <div className="lg:col-span-7 space-y-4">
          <div className="bg-white rounded-xl border border-slate-200/90 p-5 shadow-2xs">
            <label htmlFor="case-select" className="block text-xs font-bold text-slate-800 uppercase tracking-wider mb-2">
              Step 1: Select Case for Allocation
            </label>
            <select
              id="case-select"
              value={selectedCaseId}
              onChange={(e) => setSelectedCaseId(e.target.value)}
              className="w-full text-xs bg-slate-50 border border-slate-300 rounded-lg p-2.5 font-mono text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500"
            >
              <optgroup label="Pending Allocation (Unassigned)">
                {cases
                  .filter((c) => !c.assignedInvestigatorId)
                  .map((c) => (
                    <option key={c.id} value={c.id}>
                      ★ {c.referenceId} — [{c.category}] — ₹{c.amountLost.toLocaleString('en-IN')} (Pending)
                    </option>
                  ))}
              </optgroup>
              <optgroup label="Currently Assigned Cases (Reassignment Allowed)">
                {cases
                  .filter((c) => c.assignedInvestigatorId)
                  .map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.referenceId} — [{c.category}] — Assigned to: {c.assignedOfficer}
                    </option>
                  ))}
              </optgroup>
            </select>
          </div>

          {/* Selected Case Dossier Card */}
          {selectedCase && (
            <div className="bg-white rounded-xl border border-slate-200/90 shadow-2xs p-5 space-y-4">
              <div className="flex items-start justify-between border-b border-slate-100 pb-3">
                <div>
                  <div className="flex items-center space-x-2 text-[10px] font-mono text-slate-500 uppercase tracking-wider mb-0.5">
                    <span>Reference Dossier</span>
                    <span>•</span>
                    <CasePriorityBadge priority={selectedCase.priority} />
                  </div>
                  <h3 className="text-lg font-black font-mono text-slate-900 tracking-tight">
                    {selectedCase.referenceId}
                  </h3>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Category: <strong className="text-slate-800">{selectedCase.category}</strong> • Reported:{' '}
                    {selectedCase.reportedDate}
                  </p>
                </div>
                <div className="text-right">
                  <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">Financial Loss</span>
                  <span className="text-base font-extrabold text-slate-900 font-mono">
                    ₹{selectedCase.amountLost.toLocaleString('en-IN')}
                  </span>
                </div>
              </div>

              {/* Status & Current Officer */}
              <div className="grid grid-cols-2 gap-3 text-xs">
                <div className="p-3 bg-slate-50 rounded-lg border border-slate-100">
                  <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">
                    Current Assignment
                  </span>
                  <span className="font-bold text-slate-800 text-xs mt-0.5 block truncate">
                    {selectedCase.assignedOfficer && selectedCase.assignedOfficer !== 'Unassigned' ? (
                      <span className="text-emerald-700 flex items-center gap-1">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                        {selectedCase.assignedOfficer}
                      </span>
                    ) : (
                      <span className="text-amber-600 flex items-center gap-1">
                        <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse"></span>
                        Unassigned (Awaiting Officer)
                      </span>
                    )}
                  </span>
                </div>

                <div className="p-3 bg-slate-50 rounded-lg border border-slate-100">
                  <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">Evidence Files</span>
                  <span className="font-bold text-slate-800 text-xs mt-0.5 block">
                    {selectedCase.evidenceFiles.length} file{selectedCase.evidenceFiles.length !== 1 ? 's' : ''} attached
                  </span>
                </div>
              </div>

              {/* Incident Description */}
              <div>
                <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block mb-1">
                  Citizen Incident Description
                </span>
                <p className="text-xs text-slate-700 bg-slate-50/70 p-3 rounded-lg border border-slate-100 leading-relaxed">
                  {selectedCase.description}
                </p>
              </div>

              {/* Suspect Identifiers Summary */}
              <div>
                <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block mb-1">
                  Reported Suspect Identifiers ({selectedCase.suspectIdentifiers.length})
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {selectedCase.suspectIdentifiers.map((ident, i) => (
                    <span
                      key={i}
                      className="px-2 py-0.5 bg-slate-100 text-slate-700 rounded text-[11px] font-mono border border-slate-200"
                    >
                      <strong className="uppercase text-slate-500 text-[9px] mr-1">[{ident.type}]</strong>
                      {ident.value}
                    </span>
                  ))}
                </div>
              </div>

              <div className="pt-2 flex justify-end">
                <button
                  type="button"
                  onClick={() => onInspectCase(selectedCase)}
                  className="text-xs font-bold text-indigo-700 hover:text-indigo-900 hover:underline"
                >
                  Inspect Full Case Dossier &amp; Evidence Files →
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Right Column: Step 2 Select Officer & Step 3 Confirm (5 Cols) */}
        <div className="lg:col-span-5 space-y-4">
          <form onSubmit={handleConfirmAssignment} className="bg-white rounded-xl border border-slate-200/90 shadow-2xs p-5 space-y-5">
            <div>
              <label htmlFor="investigator-workload-select" className="block text-xs font-bold text-slate-800 uppercase tracking-wider mb-2">
                Step 2: Select Investigating Officer
              </label>
              <div className="space-y-2.5 max-h-72 overflow-y-auto pr-1">
                {investigators.map((inv) => {
                  const isSelected = selectedInvestigatorId === inv.cyberId;
                  const stats = getInvestigatorStats(inv.cyberId);

                  return (
                    <label
                      key={inv.cyberId}
                      className={`block p-3 rounded-xl border cursor-pointer transition-all ${
                        isSelected
                          ? 'border-emerald-600 bg-emerald-50/50 shadow-xs ring-1 ring-emerald-500'
                          : 'border-slate-200 hover:border-slate-300 bg-white'
                      }`}
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex items-center space-x-2.5">
                          <input
                            type="radio"
                            name="investigatorSelection"
                            id="investigator-workload-select"
                            checked={isSelected}
                            onChange={() => setSelectedInvestigatorId(inv.cyberId)}
                            className="text-emerald-600 focus:ring-emerald-500"
                          />
                          <div>
                            <span className="font-bold text-slate-900 text-xs block">{inv.name}</span>
                            <span className="text-[10px] text-slate-500 font-mono block">
                              {inv.cyberId} • {inv.rank}
                            </span>
                          </div>
                        </div>
                        <span
                          className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                            stats.total >= 8
                              ? 'bg-amber-100 text-amber-800'
                              : 'bg-emerald-100 text-emerald-800'
                          }`}
                        >
                          {stats.total} Assigned ({stats.active} Active)
                        </span>
                      </div>
                      <div className="mt-2 text-[10px] text-slate-500 pl-6">
                        <span>Unit: {inv.unit}</span>
                      </div>
                    </label>
                  );
                })}
              </div>
            </div>

            {/* Step 3: Assignment Directives Note */}
            <div>
              <label htmlFor="assignment-directive-notes" className="block text-xs font-bold text-slate-800 uppercase tracking-wider mb-1.5">
                Step 3: Assignment Directives &amp; Notes
              </label>
              <textarea
                id="assignment-directive-notes"
                value={assignmentNote}
                onChange={(e) => setAssignmentNote(e.target.value)}
                placeholder="e.g. Priority inquiry for bank nodal freeze notice and Telegram channel tracing."
                rows={3}
                className="w-full text-xs p-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>

            {/* Confirm Allocation Button */}
            <button
              type="submit"
              disabled={isSubmitting || !selectedCase || !selectedInvestigator}
              className="w-full py-2.5 px-4 bg-emerald-600 hover:bg-emerald-700 disabled:bg-slate-300 text-white font-bold text-xs rounded-xl shadow-xs transition-all flex items-center justify-center space-x-2"
            >
              {isSubmitting ? (
                <span>Recording Officer Assignment...</span>
              ) : (
                <>
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M5 13l4 4L19 7" />
                  </svg>
                  <span>
                    {selectedCase?.assignedInvestigatorId
                      ? `Reassign Case to ${selectedInvestigator?.name.split(' ')[1] || 'Officer'}`
                      : `Confirm Allocation to ${selectedInvestigator?.name.split(' ')[1] || 'Officer'}`}
                  </span>
                </>
              )}
            </button>

            <p className="text-[11px] text-slate-400 text-center leading-relaxed">
              Upon confirmation, this case is bound to the officer's Cyber ID and will immediately populate their Assigned Cases workspace.
            </p>
          </form>
        </div>

      </div>
    </div>
  );
}
