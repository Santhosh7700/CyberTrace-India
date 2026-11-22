import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import type { InvestigatorCase, InvestigationStatus } from '../../types/investigator';
import type { EvidenceFileItem } from '../../types/dashboard';
import { CaseStatusBadge, CasePriorityBadge } from './CaseStatusBadge';

interface CaseDetailModalProps {
  caseItem: InvestigatorCase;
  onClose: () => void;
  onUpdateStatus: (caseId: string, newStatus: InvestigationStatus, statusNote: string) => void;
}

export default function CaseDetailModal({ caseItem, onClose, onUpdateStatus }: CaseDetailModalProps) {
  const navigate = useNavigate();
  const [selectedStatus, setSelectedStatus] = useState<InvestigationStatus>(caseItem.status);
  const [statusNote, setStatusNote] = useState('');
  const [isUpdating, setIsUpdating] = useState(false);
  const [previewFile, setPreviewFile] = useState<EvidenceFileItem | null>(null);
  const [statusUpdateMessage, setStatusUpdateMessage] = useState<string | null>(null);

  const availableStatuses: InvestigationStatus[] = [
    'Submitted',
    'Under Review',
    'Under Investigation',
    'Evidence Verification',
    'Resolved',
    'Closed',
  ];

  const handleApplyStatusChange = (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedStatus === caseItem.status) return;

    setIsUpdating(true);
    setTimeout(() => {
      onUpdateStatus(
        caseItem.id,
        selectedStatus,
        statusNote.trim() || `Status updated to ${selectedStatus} by Officer Deshmukh.`
      );
      setIsUpdating(false);
      setStatusUpdateMessage(`Investigation status updated to "${selectedStatus}" (Session Mock State).`);
      setTimeout(() => setStatusUpdateMessage(null), 3500);
    }, 200);
  };

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
  };

  return (
    <div
      role="button"
      tabIndex={0}
      aria-label="Close Case Inspection Dossier"
      className="fixed inset-0 z-50 bg-black/75 backdrop-blur-xs flex items-center justify-center p-3 sm:p-5 cursor-pointer overflow-y-auto"
      onClick={onClose}
      onKeyDown={(e) => {
        if (e.key === 'Escape') onClose();
      }}
    >
      <div
        className="bg-white rounded-2xl max-w-4xl w-full shadow-2xl overflow-hidden relative cursor-auto max-h-[92vh] flex flex-col my-auto border border-slate-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Top Header */}
        <div className="p-5 sm:p-6 bg-slate-900 text-white flex items-start justify-between border-b border-slate-800 shrink-0">
          <div>
            <div className="flex items-center space-x-2 text-indigo-400 text-xs font-mono uppercase font-bold tracking-wider mb-1">
              <span>Official Forensic Case Dossier</span>
              <span>•</span>
              <CasePriorityBadge priority={caseItem.priority} />
            </div>
            <h3 className="text-xl sm:text-2xl font-black font-mono text-white tracking-tight flex items-center gap-3">
              {caseItem.referenceId}
              <CaseStatusBadge status={caseItem.status} />
            </h3>
            <p className="text-xs text-slate-400 mt-1">
              Assigned Investigator: <strong className="text-slate-200">{caseItem.assignedOfficer}</strong> • Reported: {caseItem.reportedDate}
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded-lg bg-slate-800 text-slate-400 hover:text-white hover:bg-slate-700 flex items-center justify-center font-bold text-sm transition-colors"
          >
            ✕
          </button>
        </div>

        {/* Modal Scrollable Body */}
        <div className="p-5 sm:p-6 overflow-y-auto space-y-6 text-xs text-slate-700 flex-1">
          {/* Status Update Confirmation Banner */}
          {statusUpdateMessage && (
            <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-emerald-800 text-xs font-semibold flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-600"></span>
              <span>{statusUpdateMessage}</span>
            </div>
          )}

          {/* Prototype Advisory Notice */}
          <div className="p-3 bg-amber-50/80 border border-amber-200 rounded-xl text-[11px] text-amber-900">
            <strong>Investigative Prototype Mode:</strong> Case statuses and timeline updates operate in frontend mock state. No legal writs or police notices are transmitted to real servers.
          </div>

          {/* Key Incident Metadata Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 p-4 bg-slate-50 rounded-xl border border-slate-200/80">
            <div>
              <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider block">Victim Pseudonym</span>
              <p className="font-semibold text-slate-900 text-xs sm:text-sm mt-0.5">{caseItem.victimName}</p>
            </div>
            <div>
              <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider block">Scam Category</span>
              <p className="font-semibold text-indigo-700 text-xs sm:text-sm mt-0.5">{caseItem.category}</p>
            </div>
            <div>
              <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider block">Financial Loss (INR)</span>
              <p className="font-extrabold text-slate-900 text-sm sm:text-base mt-0.5">
                ₹{caseItem.amountLost.toLocaleString('en-IN')}
              </p>
            </div>
            <div>
              <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider block">Platform / Medium</span>
              <p className="font-semibold text-slate-800 text-xs sm:text-sm mt-0.5">{caseItem.platform}</p>
            </div>
            {caseItem.transactionId && (
              <div className="col-span-2 sm:col-span-4 pt-2 border-t border-slate-200">
                <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider block">Transaction / UTR Reference</span>
                <p className="font-mono text-slate-800 text-xs mt-0.5 font-bold">{caseItem.transactionId}</p>
              </div>
            )}
          </div>

          {/* Suspect Identifiers List */}
          <div className="p-4 bg-slate-50 rounded-xl border border-slate-200/80 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">
                Reported Suspect Identifiers ({caseItem.suspectIdentifiers.length})
              </span>
              <span className="text-[10px] text-indigo-700 font-semibold bg-indigo-50 px-2 py-0.5 rounded border border-indigo-200">
                Correlated with Intelligence Engine
              </span>
            </div>

            <div className="flex flex-wrap gap-2">
              {caseItem.suspectIdentifiers.map((ident, idx) => (
                <div
                  key={idx}
                  className="inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-white border border-slate-200 font-mono text-[11px] shadow-2xs"
                >
                  <span
                    className={`text-[9px] uppercase font-bold px-1.5 py-0.5 rounded ${
                      ident.type === 'upi'
                        ? 'bg-blue-100 text-blue-800'
                        : ident.type === 'phone'
                        ? 'bg-green-100 text-green-800'
                        : ident.type === 'email'
                        ? 'bg-purple-100 text-purple-800'
                        : 'bg-orange-100 text-orange-800'
                    }`}
                  >
                    {ident.type}
                  </span>
                  <span className="text-slate-800 font-bold">{ident.value}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Incident Description */}
          <div>
            <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider block mb-1">
              Detailed Incident Statement
            </span>
            <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 text-slate-700 leading-relaxed font-sans">
              {caseItem.description}
            </div>
          </div>

          {/* Attached Evidence Files Section */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">
                Attached Forensic Evidence ({caseItem.evidenceFiles.length})
              </span>
              <span className="text-[10px] text-slate-400">Click to preview image / document</span>
            </div>

            {caseItem.evidenceFiles.length === 0 ? (
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-slate-400 text-center">
                No digital evidence documents attached to this complaint.
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {caseItem.evidenceFiles.map((ev) => (
                  <div
                    key={ev.id}
                    className="p-3 bg-white rounded-xl border border-slate-200 flex items-center justify-between shadow-2xs hover:border-indigo-300 transition-colors"
                  >
                    <div className="flex items-center space-x-3 min-w-0">
                      {ev.previewUrl && ev.type.startsWith('image/') ? (
                        <img
                          src={ev.previewUrl}
                          alt={ev.name}
                          onClick={() => setPreviewFile(ev)}
                          className="w-10 h-10 rounded-lg object-cover border border-slate-200 shrink-0 cursor-pointer hover:opacity-80"
                        />
                      ) : (
                        <div
                          onClick={() => setPreviewFile(ev)}
                          className="w-10 h-10 rounded-lg bg-indigo-50 text-indigo-700 font-bold text-[10px] font-mono flex items-center justify-center shrink-0 border border-indigo-200 cursor-pointer hover:bg-indigo-100"
                        >
                          {ev.type.includes('pdf') ? 'PDF' : 'DOC'}
                        </div>
                      )}
                      <div className="min-w-0">
                        <p className="font-semibold text-slate-800 text-xs truncate" title={ev.name}>
                          {ev.name}
                        </p>
                        <p className="text-[10px] text-slate-400 font-mono">
                          {formatFileSize(ev.size)} • {ev.selectedAt}
                        </p>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() => setPreviewFile(ev)}
                      className="px-2.5 py-1 text-xs font-semibold text-indigo-700 bg-indigo-50 hover:bg-indigo-100 rounded-lg transition-colors shrink-0 ml-2"
                    >
                      Inspect
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Investigation Status Transition Panel */}
          <div className="p-4 bg-indigo-50/50 rounded-xl border border-indigo-200 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold uppercase tracking-wider text-indigo-900">
                Update Case Investigation Stage
              </span>
              <span className="text-[10px] text-indigo-700 font-mono">Current: {caseItem.status}</span>
            </div>

            <form onSubmit={handleApplyStatusChange} className="space-y-3">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label htmlFor="new-status" className="block text-[11px] font-semibold text-slate-700 mb-1">
                    Select New Status
                  </label>
                  <select
                    id="new-status"
                    value={selectedStatus}
                    onChange={(e) => setSelectedStatus(e.target.value as InvestigationStatus)}
                    className="w-full px-3 py-2 bg-white rounded-lg border border-slate-300 font-semibold text-xs focus:outline-none focus:border-indigo-600 focus:ring-1 focus:ring-indigo-100"
                  >
                    {availableStatuses.map((st) => (
                      <option key={st} value={st}>
                        {st}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label htmlFor="status-note" className="block text-[11px] font-semibold text-slate-700 mb-1">
                    Officer Case Log / Note
                  </label>
                  <input
                    id="status-note"
                    type="text"
                    value={statusNote}
                    onChange={(e) => setStatusNote(e.target.value)}
                    placeholder="e.g. Bank freeze requisition sent under Section 91 CrPC"
                    className="w-full px-3 py-2 bg-white rounded-lg border border-slate-300 text-xs focus:outline-none focus:border-indigo-600 focus:ring-1 focus:ring-indigo-100"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end space-x-2">
                <button
                  type="submit"
                  disabled={isUpdating || selectedStatus === caseItem.status}
                  className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white rounded-lg text-xs font-bold transition-colors shadow-xs"
                >
                  {isUpdating ? 'Saving...' : 'Apply Status Update'}
                </button>
              </div>
            </form>
          </div>

          {/* Investigation Chronological Timeline */}
          <div>
            <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider block mb-2">
              Investigation Chronology &amp; Officer Remarks
            </span>

            <div className="space-y-3 pl-2 border-l-2 border-indigo-200">
              {caseItem.timeline.map((entry, idx) => (
                <div key={idx} className="relative pl-4">
                  <div className="absolute -left-[21px] top-1 w-3 h-3 rounded-full bg-indigo-600 border-2 border-white"></div>
                  <div className="flex items-center space-x-2">
                    <span className="font-bold text-slate-900 text-xs">{entry.stage}</span>
                    <span className="text-[10px] text-slate-400 font-mono">{entry.timestamp}</span>
                  </div>
                  <p className="text-slate-600 text-xs mt-0.5">{entry.note}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Modal Bottom Footer */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-3 shrink-0">
          <div className="flex items-center space-x-3 w-full sm:w-auto">
            <span className="text-[10px] text-slate-400 font-mono hidden md:inline">
              Dossier ID: {caseItem.id} • Officer: Insp. R. Deshmukh
            </span>
            <button
              type="button"
              onClick={() => {
                onClose();
                navigate('/intelligence');
              }}
              className="inline-flex items-center space-x-1.5 px-3 py-1.5 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 border border-indigo-200 rounded-lg text-xs font-bold transition-colors"
              title="Launch Fraud Intelligence Engine to cross-reference indicators with all syndicate reports"
            >
              <span>Cross-Reference in Fraud Intelligence</span>
              <span>→</span>
            </button>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="w-full sm:w-auto px-4 py-2 bg-slate-200 hover:bg-slate-300 text-slate-800 rounded-lg text-xs font-bold transition-colors"
          >
            Close Dossier
          </button>
        </div>

        {/* Nested Evidence Preview Modal */}
        {previewFile && (
          <div
            role="button"
            tabIndex={0}
            aria-label="Close evidence preview"
            className="fixed inset-0 z-60 bg-black/80 flex items-center justify-center p-4 cursor-pointer"
            onClick={() => setPreviewFile(null)}
            onKeyDown={(e) => {
              if (e.key === 'Escape') setPreviewFile(null);
            }}
          >
            <div
              className="bg-white rounded-2xl max-w-2xl w-full p-4 overflow-hidden relative cursor-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between pb-3 border-b border-slate-200 mb-3">
                <span className="text-xs font-bold text-slate-800 truncate">{previewFile.name}</span>
                <button
                  type="button"
                  onClick={() => setPreviewFile(null)}
                  className="text-slate-400 hover:text-slate-700 text-sm font-bold"
                >
                  ✕
                </button>
              </div>

              <div className="max-h-[65vh] overflow-auto flex items-center justify-center bg-slate-900 rounded-xl p-2">
                {previewFile.previewUrl && previewFile.type.startsWith('image/') ? (
                  <img
                    src={previewFile.previewUrl}
                    alt={previewFile.name}
                    className="max-h-[60vh] max-w-full rounded object-contain"
                  />
                ) : (
                  <div className="p-8 text-center text-slate-300">
                    <p className="font-mono text-sm font-bold mb-2">Forensic Document Record</p>
                    <p className="text-xs text-slate-400">{previewFile.name}</p>
                    <p className="text-[11px] text-slate-500 mt-2">
                      Verified evidence file registered under case reference {caseItem.referenceId}.
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
