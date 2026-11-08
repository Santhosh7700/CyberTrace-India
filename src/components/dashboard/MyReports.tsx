import { useState } from 'react';
import type { ScamReport, ReportStatus, EvidenceFileItem } from '../../types/dashboard';

interface MyReportsProps {
  reports: ScamReport[];
  selectedReportForDetails?: ScamReport | null;
  onSelectReport: (report: ScamReport | null) => void;
  onNewReportClick: () => void;
}

export default function MyReports({
  reports,
  selectedReportForDetails,
  onSelectReport,
  onNewReportClick,
}: MyReportsProps) {
  const [filterStatus, setFilterStatus] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [evidencePreviewFile, setEvidencePreviewFile] = useState<EvidenceFileItem | null>(null);

  const filteredReports = reports.filter((rep) => {
    const matchesFilter = filterStatus === 'ALL' || rep.status === filterStatus;
    const matchesSearch =
      rep.referenceId.toLowerCase().includes(searchQuery.toLowerCase()) ||
      rep.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
      rep.platform.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const getStatusBadge = (status: ReportStatus) => {
    switch (status) {
      case 'Submitted':
        return 'bg-blue-50 text-blue-700 border-blue-200';
      case 'Under Review':
        return 'bg-amber-50 text-amber-700 border-amber-200';
      case 'Under Investigation':
        return 'bg-indigo-50 text-indigo-700 border-indigo-200';
      case 'Resolved':
        return 'bg-emerald-50 text-emerald-700 border-emerald-200';
    }
  };

  const formatCurrency = (amt: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(amt);
  };

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
  };

  // Timeline Step calculation
  const getTimelineSteps = (report: ScamReport) => {
    const stages = [
      {
        step: 1,
        title: 'Report Submitted',
        desc: 'Citizen complaint acknowledged with attached evidence files and case reference issued.',
        date: report.statusTimeline.submittedAt,
        isCompleted: true,
      },
      {
        step: 2,
        title: 'Initial Review',
        desc: 'Verification of suspect handles, bank accounts, and evidence artifacts.',
        date: report.statusTimeline.underReviewAt || (report.status !== 'Submitted' ? 'Completed' : 'Pending verification'),
        isCompleted: ['Under Review', 'Under Investigation', 'Resolved'].includes(report.status),
      },
      {
        step: 3,
        title: 'Under Investigation',
        desc: 'Case routed to State Cyber Cell; intermediary freeze orders requested.',
        date: report.statusTimeline.underInvestigationAt || (['Under Investigation', 'Resolved'].includes(report.status) ? 'Active' : 'Awaiting assignment'),
        isCompleted: ['Under Investigation', 'Resolved'].includes(report.status),
      },
      {
        step: 4,
        title: 'Action / Resolution',
        desc: 'Nodal authority action executed; recovery or dossier submitted.',
        date: report.statusTimeline.resolvedAt || (report.status === 'Resolved' ? 'Closed' : 'In progress'),
        isCompleted: report.status === 'Resolved',
      },
    ];
    return stages;
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Top Banner */}
      <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-xs flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2 text-blue-700 text-xs font-bold uppercase tracking-wider mb-1">
            <span className="w-2 h-2 rounded-full bg-blue-600"></span>
            <span>Case Tracking Dossier</span>
          </div>
          <h2 className="text-xl font-bold text-slate-900">Submitted Cyber Incident Reports</h2>
          <p className="text-xs text-slate-500 mt-1">
            Track real-time investigation stages, attached evidence, and official remarks.
          </p>
        </div>
        <button
          onClick={onNewReportClick}
          className="px-4 py-2 bg-blue-700 hover:bg-blue-800 text-white rounded-lg text-xs font-semibold shadow-xs self-start sm:self-auto"
        >
          + Report Another Incident
        </button>
      </div>

      {/* Case Details Modal / Panel if selected */}
      {selectedReportForDetails && (
        <div className="bg-white rounded-xl border-2 border-blue-500/80 shadow-md p-6 sm:p-8 animate-fadeIn">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between pb-4 border-b border-slate-200 gap-2">
            <div>
              <div className="flex items-center space-x-3">
                <span className="font-mono text-lg font-extrabold text-blue-700">
                  {selectedReportForDetails.referenceId}
                </span>
                <span
                  className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold border ${getStatusBadge(
                    selectedReportForDetails.status
                  )}`}
                >
                  {selectedReportForDetails.status}
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-1">
                Category: <strong className="text-slate-700">{selectedReportForDetails.category}</strong> • Reported on{' '}
                {selectedReportForDetails.reportedDate}
              </p>
            </div>
            <button
              onClick={() => onSelectReport(null)}
              className="px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold self-start sm:self-auto"
            >
              Close Details ✕
            </button>
          </div>

          {/* Details Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 my-6 p-4 rounded-xl bg-slate-50 border border-slate-200/80 text-xs">
            <div>
              <span className="text-slate-400 block font-medium">Financial Loss</span>
              <span className="text-base font-bold text-slate-900">
                {formatCurrency(selectedReportForDetails.amountLost)}
              </span>
            </div>
            <div>
              <span className="text-slate-400 block font-medium">Platform / Medium</span>
              <span className="font-semibold text-slate-800">{selectedReportForDetails.platform}</span>
            </div>
            {selectedReportForDetails.transactionId && (
              <div>
                <span className="text-slate-400 block font-medium">Transaction Reference / UTR</span>
                <span className="font-mono font-semibold text-slate-800">
                  {selectedReportForDetails.transactionId}
                </span>
              </div>
            )}

            {/* Suspect Identifiers — structured multi-identifier display */}
            <div className="sm:col-span-3">
              <span className="text-slate-400 block font-medium mb-2">Suspect Identifiers</span>
              {selectedReportForDetails.suspectIdentifiers && selectedReportForDetails.suspectIdentifiers.length > 0 ? (
                <div className="flex flex-wrap gap-2">
                  {selectedReportForDetails.suspectIdentifiers.map((ident, idx) => (
                    <span
                      key={idx}
                      className="inline-flex items-center space-x-1.5 px-2.5 py-1.5 rounded-lg bg-white border border-slate-200 font-mono text-[11px] text-slate-800 shadow-2xs"
                    >
                      <span
                        className={`text-[10px] uppercase font-bold px-1.5 py-0.5 rounded ${
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
                      <span className="text-rose-700 font-semibold break-all">{ident.value}</span>
                    </span>
                  ))}
                </div>
              ) : (
                // Fallback: render legacy suspectContact string
                <span className="font-semibold text-rose-700 break-all font-mono text-[11px]">
                  {selectedReportForDetails.suspectContact}
                </span>
              )}
            </div>

            <div className="sm:col-span-3">
              <span className="text-slate-400 block font-medium">Incident Description</span>
              <p className="text-slate-700 mt-1 leading-relaxed bg-white p-3 rounded-lg border border-slate-200">
                {selectedReportForDetails.description}
              </p>
            </div>
          </div>

          {/* Associated Evidence Files Section */}
          <div className="mb-6">
            <h3 className="text-sm font-bold text-slate-900 mb-3 flex items-center justify-between">
              <span className="flex items-center">
                <svg className="w-4 h-4 mr-1.5 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13" />
                </svg>
                Attached Evidence Files ({selectedReportForDetails.evidenceFiles?.length || 0})
              </span>
            </h3>

            {(!selectedReportForDetails.evidenceFiles || selectedReportForDetails.evidenceFiles.length === 0) ? (
              <div className="p-4 rounded-lg bg-slate-50 border border-slate-200 text-xs text-slate-500">
                No supporting evidence files were attached when lodging this report.
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {selectedReportForDetails.evidenceFiles.map((ev) => (
                  <div
                    key={ev.id}
                    className="p-3 rounded-lg border border-slate-200 bg-white flex items-center justify-between gap-2 shadow-2xs hover:border-blue-300 transition-colors"
                  >
                    <div className="flex items-center space-x-2.5 min-w-0">
                      {ev.previewUrl ? (
                        <img
                          src={ev.previewUrl}
                          alt={ev.name}
                          onClick={() => setEvidencePreviewFile(ev)}
                          className="w-10 h-10 rounded object-cover border border-slate-200 shrink-0 cursor-pointer hover:opacity-80"
                        />
                      ) : (
                        <div className="w-10 h-10 rounded bg-slate-100 text-slate-500 flex items-center justify-center shrink-0 border border-slate-200">
                          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                          </svg>
                        </div>
                      )}
                      <div className="min-w-0">
                        <p className="text-xs font-semibold text-slate-800 truncate">{ev.name}</p>
                        <p className="text-[10px] text-slate-400">
                          {formatFileSize(ev.size)} • {ev.type || 'Document'}
                        </p>
                      </div>
                    </div>
                    {ev.previewUrl && (
                      <button
                        type="button"
                        onClick={() => setEvidencePreviewFile(ev)}
                        className="px-2.5 py-1 text-xs font-semibold text-blue-700 bg-blue-50 hover:bg-blue-100 rounded transition-colors shrink-0"
                      >
                        Preview
                      </button>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Visual Progress Timeline */}
          <div className="mt-8 pt-6 border-t border-slate-100">
            <h3 className="text-sm font-bold text-slate-900 mb-6 flex items-center justify-between">
              <span>Official Case Timeline & Status Progression</span>
              <span className="text-[11px] font-normal text-amber-700 bg-amber-50 px-2.5 py-0.5 rounded-full border border-amber-200">
                Frontend Simulation Notice: Status reflects sample case data
              </span>
            </h3>

            <div className="relative pl-6 border-l-2 border-blue-200 space-y-8 ml-4">
              {getTimelineSteps(selectedReportForDetails).map((stage) => (
                <div key={stage.step} className="relative group">
                  {/* Step Dot */}
                  <div
                    className={`absolute -left-[31px] top-0 w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ring-4 ring-white ${
                      stage.isCompleted ? 'bg-blue-600 text-white shadow-sm' : 'bg-slate-200 text-slate-500'
                    }`}
                  >
                    {stage.isCompleted ? '✓' : stage.step}
                  </div>
                  <div>
                    <div className="flex items-center justify-between">
                      <h4
                        className={`text-sm font-bold ${
                          stage.isCompleted ? 'text-slate-900' : 'text-slate-400'
                        }`}
                      >
                        {stage.step}. {stage.title}
                      </h4>
                      <span className="text-[11px] text-slate-400 font-mono">{stage.date}</span>
                    </div>
                    <p className="text-xs text-slate-600 mt-1">{stage.desc}</p>
                  </div>
                </div>
              ))}
            </div>

            {selectedReportForDetails.statusTimeline.remarks && (
              <div className="mt-6 p-4 rounded-xl bg-blue-50/70 border border-blue-200 text-xs">
                <strong className="text-blue-900 block mb-1">Nodal Officer Remarks:</strong>
                <p className="text-blue-800">{selectedReportForDetails.statusTimeline.remarks}</p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Reports Filters & Search */}
      <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-xs flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        {/* Search */}
        <div className="relative flex-1">
          <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-slate-400">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </span>
          <input
            type="text"
            placeholder="Search by Reference ID, category or platform..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 rounded-lg border border-slate-200 text-xs focus:outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-100"
          />
        </div>

        {/* Status Filter Chips */}
        <div className="flex items-center space-x-1.5 overflow-x-auto pb-1 md:pb-0">
          {['ALL', 'Submitted', 'Under Review', 'Under Investigation', 'Resolved'].map((st) => (
            <button
              key={st}
              onClick={() => setFilterStatus(st)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors ${
                filterStatus === st
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {st}
            </button>
          ))}
        </div>
      </div>

      {/* Reports List */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
        {filteredReports.length === 0 ? (
          <div className="p-12 text-center">
            <div className="w-12 h-12 rounded-full bg-slate-100 text-slate-400 mx-auto flex items-center justify-center mb-3">
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                />
              </svg>
            </div>
            <h4 className="text-sm font-semibold text-slate-800">No reports matched your criteria</h4>
            <p className="text-xs text-slate-500 mt-1">Try clearing filters or enter a different reference number.</p>
          </div>
        ) : (
          <>
            {/* Desktop Table */}
            <div className="hidden md:block overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 text-slate-500 uppercase tracking-wider font-semibold border-b border-slate-200">
                  <tr>
                    <th className="py-3 px-4">Case Reference</th>
                    <th className="py-3 px-4">Scam Type</th>
                    <th className="py-3 px-4">Report Date</th>
                    <th className="py-3 px-4">Financial Loss</th>
                    <th className="py-3 px-4">Evidence</th>
                    <th className="py-3 px-4">Current Status</th>
                    <th className="py-3 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-medium">
                  {filteredReports.map((rep) => (
                    <tr key={rep.id} className="hover:bg-slate-50/70 transition-colors">
                      <td className="py-3.5 px-4 font-mono font-bold text-blue-700">{rep.referenceId}</td>
                      <td className="py-3.5 px-4 text-slate-800">{rep.category}</td>
                      <td className="py-3.5 px-4 text-slate-600">{rep.reportedDate}</td>
                      <td className="py-3.5 px-4 font-semibold text-slate-900">{formatCurrency(rep.amountLost)}</td>
                      <td className="py-3.5 px-4">
                        <span className="inline-flex items-center text-xs text-slate-600 bg-slate-100 px-2 py-0.5 rounded">
                          <svg className="w-3.5 h-3.5 mr-1 text-slate-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13" />
                          </svg>
                          {rep.evidenceFiles?.length || 0} file{(rep.evidenceFiles?.length || 0) === 1 ? '' : 's'}
                        </span>
                      </td>
                      <td className="py-3.5 px-4">
                        <span
                          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-semibold border ${getStatusBadge(
                            rep.status
                          )}`}
                        >
                          {rep.status}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 text-right">
                        <button
                          onClick={() => onSelectReport(rep)}
                          className="px-3 py-1.5 rounded-md bg-blue-50 text-blue-700 hover:bg-blue-100 text-xs font-semibold transition-colors"
                        >
                          Track Timeline
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Mobile List View */}
            <div className="md:hidden divide-y divide-slate-100">
              {filteredReports.map((rep) => (
                <div key={rep.id} className="p-4 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-xs font-bold text-blue-700">{rep.referenceId}</span>
                    <span
                      className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold border ${getStatusBadge(
                        rep.status
                      )}`}
                    >
                      {rep.status}
                    </span>
                  </div>
                  <div className="flex justify-between items-baseline">
                    <div>
                      <h4 className="text-sm font-semibold text-slate-900">{rep.category}</h4>
                      <p className="text-xs text-slate-500">Reported {rep.reportedDate} • {rep.evidenceFiles?.length || 0} attached file(s)</p>
                    </div>
                    <div className="text-right">
                      <p className="text-xs text-slate-400">Financial Loss</p>
                      <p className="text-sm font-bold text-slate-900">{formatCurrency(rep.amountLost)}</p>
                    </div>
                  </div>
                  <div className="pt-2">
                    <button
                      onClick={() => onSelectReport(rep)}
                      className="w-full py-1.5 rounded-lg bg-blue-50 text-blue-700 font-semibold text-xs text-center hover:bg-blue-100"
                    >
                      View Case Timeline & Evidence
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>

      {/* Lightbox Modal for Evidence Preview */}
      {evidencePreviewFile && (
        <div
          role="button"
          tabIndex={0}
          aria-label="Close evidence preview"
          className="fixed inset-0 z-50 bg-black/70 flex items-center justify-center p-4 cursor-pointer"
          onClick={() => setEvidencePreviewFile(null)}
          onKeyDown={(e) => {
            if (e.key === 'Escape' || e.key === 'Enter') {
              setEvidencePreviewFile(null);
            }
          }}
        >
          <div
            className="bg-white rounded-xl max-w-2xl w-full p-4 overflow-hidden relative cursor-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h4 className="text-sm font-bold text-slate-800 truncate pr-4">{evidencePreviewFile.name}</h4>
              <button
                type="button"
                onClick={() => setEvidencePreviewFile(null)}
                className="text-slate-400 hover:text-slate-700 text-lg font-bold"
              >
                ✕
              </button>
            </div>
            <div className="py-4 flex items-center justify-center max-h-[70vh] overflow-auto">
              {evidencePreviewFile.previewUrl && (
                <img
                  src={evidencePreviewFile.previewUrl}
                  alt={evidencePreviewFile.name}
                  className="max-h-[60vh] max-w-full rounded-lg object-contain"
                />
              )}
            </div>
            <div className="text-right pt-2 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setEvidencePreviewFile(null)}
                className="px-4 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-semibold"
              >
                Close Preview
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
