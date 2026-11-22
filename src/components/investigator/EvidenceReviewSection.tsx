import { useState } from 'react';
import type { InvestigatorCase } from '../../types/investigator';
import type { EvidenceFileItem } from '../../types/dashboard';

interface EvidenceReviewSectionProps {
  cases: InvestigatorCase[];
  onInspectCase: (caseItem: InvestigatorCase) => void;
}

export default function EvidenceReviewSection({ cases, onInspectCase }: EvidenceReviewSectionProps) {
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');
  const [previewFile, setPreviewFile] = useState<{ file: EvidenceFileItem; caseItem: InvestigatorCase } | null>(null);

  // Extract all evidence items with parent case context
  const allEvidenceEntries = cases.flatMap((c) =>
    c.evidenceFiles.map((ev) => ({
      evidence: ev,
      parentCase: c,
    }))
  );

  const filteredEntries = allEvidenceEntries.filter((item) => {
    if (selectedCategory !== 'ALL' && item.parentCase.category !== selectedCategory) return false;
    return true;
  });

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
  };

  return (
    <div className="space-y-6">
      {/* Header bar */}
      <div className="bg-white rounded-xl border border-slate-200/90 p-5 shadow-2xs flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <div className="flex items-center space-x-2 text-indigo-700 text-xs font-bold uppercase tracking-wider mb-0.5">
            <span className="w-2 h-2 rounded-full bg-indigo-600"></span>
            <span>Digital Evidence Custody &amp; Review</span>
          </div>
          <h3 className="text-base font-bold text-slate-900">Forensic Evidence Repository</h3>
          <p className="text-xs text-slate-500">
            Audit attached payment slips, chat transcripts, and phishing captures across assigned complaints.
          </p>
        </div>

        {/* Category filter */}
        <div className="flex items-center space-x-2">
          <span className="text-xs text-slate-500 font-medium">Filter Category:</span>
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="text-xs border border-slate-200 rounded-lg px-3 py-1.5 bg-white focus:outline-none focus:border-indigo-600"
          >
            <option value="ALL">All Scam Types</option>
            <option value="UPI Fraud">UPI Fraud</option>
            <option value="Fake Investment">Fake Investment</option>
            <option value="Phishing">Phishing</option>
            <option value="Job Scam">Job Scam</option>
            <option value="Online Shopping Fraud">Online Shopping Fraud</option>
          </select>
        </div>
      </div>

      {/* Grid of Evidence Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredEntries.map((item) => {
          const { evidence, parentCase } = item;
          const isImage = evidence.previewUrl && evidence.type.startsWith('image/');

          return (
            <div
              key={evidence.id}
              className="bg-white rounded-xl border border-slate-200 p-4 shadow-2xs hover:border-indigo-300 transition-all flex flex-col justify-between"
            >
              <div>
                {/* Top badges */}
                <div className="flex items-center justify-between mb-2.5">
                  <span className="font-mono text-xs font-bold text-indigo-700">{parentCase.referenceId}</span>
                  <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-slate-100 text-slate-700">
                    {parentCase.category}
                  </span>
                </div>

                {/* Thumbnail / Placeholder */}
                <div
                  onClick={() => setPreviewFile({ file: evidence, caseItem: parentCase })}
                  className="w-full h-36 rounded-lg bg-slate-100 border border-slate-200 flex items-center justify-center cursor-pointer overflow-hidden mb-3 group hover:border-indigo-400"
                >
                  {isImage ? (
                    <img
                      src={evidence.previewUrl}
                      alt={evidence.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                    />
                  ) : (
                    <div className="text-center p-3">
                      <span className="text-xs font-mono font-bold text-indigo-700 block">
                        {evidence.type.includes('pdf') ? 'PDF DOCUMENT' : 'ATTACHMENT'}
                      </span>
                      <span className="text-[11px] text-slate-500 truncate max-w-[200px] block mt-1">
                        {evidence.name}
                      </span>
                    </div>
                  )}
                </div>

                {/* Evidence Metadata */}
                <div>
                  <p className="font-semibold text-slate-800 text-xs truncate" title={evidence.name}>
                    {evidence.name}
                  </p>
                  <p className="text-[10px] text-slate-400 font-mono mt-0.5">
                    {formatFileSize(evidence.size)} • Lodged {evidence.selectedAt}
                  </p>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-3 mt-3 border-t border-slate-100 flex items-center justify-between">
                <button
                  type="button"
                  onClick={() => setPreviewFile({ file: evidence, caseItem: parentCase })}
                  className="text-xs font-semibold text-indigo-700 hover:text-indigo-900"
                >
                  Inspect Evidence
                </button>
                <button
                  type="button"
                  onClick={() => onInspectCase(parentCase)}
                  className="px-2.5 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded text-xs font-semibold transition-colors"
                >
                  View Case
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Preview Modal */}
      {previewFile && (
        <div
          role="button"
          tabIndex={0}
          aria-label="Close evidence preview"
          className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4 cursor-pointer"
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
              <div>
                <span className="text-xs font-mono font-bold text-indigo-700">
                  {previewFile.caseItem.referenceId}
                </span>
                <h4 className="text-xs font-bold text-slate-800 truncate">{previewFile.file.name}</h4>
              </div>
              <button
                type="button"
                onClick={() => setPreviewFile(null)}
                className="text-slate-400 hover:text-slate-700 text-sm font-bold"
              >
                ✕
              </button>
            </div>

            <div className="max-h-[65vh] overflow-auto flex items-center justify-center bg-slate-900 rounded-xl p-2">
              {previewFile.file.previewUrl && previewFile.file.type.startsWith('image/') ? (
                <img
                  src={previewFile.file.previewUrl}
                  alt={previewFile.file.name}
                  className="max-h-[60vh] max-w-full rounded object-contain"
                />
              ) : (
                <div className="p-8 text-center text-slate-300">
                  <p className="font-mono text-sm font-bold mb-2">Forensic Record Document</p>
                  <p className="text-xs text-slate-400">{previewFile.file.name}</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
