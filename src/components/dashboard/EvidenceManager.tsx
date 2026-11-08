import { useState } from 'react';
import type { EvidenceFileItem } from '../../types/dashboard';

interface EvidenceManagerProps {
  evidenceList: EvidenceFileItem[];
  onRemoveFile: (id: string) => void;
  onNavigateToReport: () => void;
}

export default function EvidenceManager({
  evidenceList,
  onRemoveFile,
  onNavigateToReport,
}: EvidenceManagerProps) {
  const [selectedPreview, setSelectedPreview] = useState<EvidenceFileItem | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
  };

  // Check file classification
  const isImageFile = (type: string, name: string) => {
    return (
      type.startsWith('image/') ||
      name.endsWith('.png') ||
      name.endsWith('.jpg') ||
      name.endsWith('.jpeg') ||
      name.endsWith('.webp') ||
      name.endsWith('.gif') ||
      name.endsWith('.svg')
    );
  };

  const isPdfFile = (type: string, name: string) => {
    return type === 'application/pdf' || name.toLowerCase().endsWith('.pdf');
  };

  const isDocFile = (type: string, name: string) => {
    const lower = name.toLowerCase();
    return (
      type.includes('word') ||
      type.includes('document') ||
      lower.endsWith('.doc') ||
      lower.endsWith('.docx')
    );
  };

  // Filter evidence by filename, scam type, and case reference ID
  const filteredEvidence = evidenceList.filter((item) => {
    const query = searchQuery.toLowerCase().trim();
    if (!query) return true;

    const nameMatch = item.name.toLowerCase().includes(query);
    const refMatch = item.reportRef ? item.reportRef.toLowerCase().includes(query) : false;
    const scamMatch = item.scamCategory ? item.scamCategory.toLowerCase().includes(query) : false;

    return nameMatch || refMatch || scamMatch;
  });

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      {/* Header Info Banner */}
      <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <div className="flex items-center space-x-2 text-indigo-700 text-xs font-bold uppercase tracking-wider mb-1">
              <span className="w-2 h-2 rounded-full bg-indigo-600"></span>
              <span>Case Evidence Repository</span>
            </div>
            <h2 className="text-xl font-bold text-slate-900">Evidence Management</h2>
            <p className="text-xs text-slate-500 mt-1">
              Repository of all supporting evidence artifacts associated with your filed cyber scam reports.
            </p>
          </div>
          <button
            onClick={onNavigateToReport}
            className="px-4 py-2 bg-blue-700 hover:bg-blue-800 text-white rounded-lg text-xs font-semibold shadow-xs self-start sm:self-auto flex items-center"
          >
            <svg className="w-3.5 h-3.5 mr-1.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
            </svg>
            Attach Evidence with New Report
          </button>
        </div>

        {/* Frontend Demo Notice */}
        <div className="mt-4 p-3 bg-blue-50/70 border border-blue-200 rounded-lg text-xs text-blue-900 flex items-start space-x-2">
          <svg className="w-4 h-4 text-blue-600 mt-0.5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          <div>
            <strong>Frontend Demo Session:</strong> Evidence files are submitted along with individual incident reports and stored in browser session state using object URLs. In a production release, these files are uploaded to secure cloud storage and verified by the State Cyber Police Nodal Cell.
          </div>
        </div>
      </div>

      {/* Filter / Search Bar */}
      <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-xs flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div className="relative flex-1">
          <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-slate-400">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </span>
          <input
            type="text"
            placeholder="Search evidence by filename, scam type (e.g. UPI Fraud, Phishing) or Case Ref..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 rounded-lg border border-slate-200 text-xs focus:outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-100"
          />
        </div>
        <div className="text-xs font-semibold px-3 py-1.5 rounded-full bg-slate-100 text-slate-700 self-start sm:self-auto">
          {filteredEvidence.length} of {evidenceList.length} File{evidenceList.length === 1 ? '' : 's'}
        </div>
      </div>

      {/* Repository Table / List */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
        {evidenceList.length === 0 ? (
          <div className="p-12 text-center">
            <div className="w-12 h-12 rounded-full bg-slate-100 text-slate-400 mx-auto flex items-center justify-center mb-3">
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13"
                />
              </svg>
            </div>
            <h4 className="text-sm font-semibold text-slate-800">No Evidence Files Stored</h4>
            <p className="text-xs text-slate-500 mt-1 max-w-md mx-auto">
              Evidence files are attached when filing complaints under "Report a Scam". Once a report is lodged, its evidence files will appear here.
            </p>
            <button
              onClick={onNavigateToReport}
              className="mt-4 px-4 py-2 bg-blue-700 hover:bg-blue-800 text-white rounded-lg text-xs font-semibold shadow-xs"
            >
              Lodge a Report with Evidence
            </button>
          </div>
        ) : filteredEvidence.length === 0 ? (
          <div className="p-10 text-center text-xs text-slate-500">
            No evidence files match your search query "{searchQuery}".
          </div>
        ) : (
          <>
            {/* Desktop Table View */}
            <div className="hidden lg:block overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 text-slate-500 uppercase tracking-wider font-semibold border-b border-slate-200">
                  <tr>
                    <th className="py-3 px-4">File Name</th>
                    <th className="py-3 px-4">File Type</th>
                    <th className="py-3 px-4">File Size</th>
                    <th className="py-3 px-4">Scam Type</th>
                    <th className="py-3 px-4">Associated Case Reference ID</th>
                    <th className="py-3 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-medium">
                  {filteredEvidence.map((item) => {
                    const isImg = isImageFile(item.type, item.name);
                    const isPdf = isPdfFile(item.type, item.name);

                    return (
                      <tr key={item.id} className="hover:bg-slate-50/70 transition-colors">
                        {/* 1. File Name */}
                        <td className="py-3.5 px-4">
                          <div className="flex items-center space-x-3">
                            {isImg && item.previewUrl ? (
                              <img
                                src={item.previewUrl}
                                alt={item.name}
                                onClick={() => setSelectedPreview(item)}
                                className="w-10 h-10 rounded-lg object-cover border border-slate-200 shrink-0 cursor-pointer hover:opacity-80"
                                title="Click to view preview"
                              />
                            ) : isPdf ? (
                              <div
                                onClick={() => setSelectedPreview(item)}
                                className="w-10 h-10 rounded-lg bg-rose-50 text-rose-600 flex items-center justify-center shrink-0 border border-rose-200 cursor-pointer hover:bg-rose-100"
                                title="Click to view PDF"
                              >
                                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                  <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth="2"
                                    d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z"
                                  />
                                </svg>
                              </div>
                            ) : (
                              <div
                                onClick={() => setSelectedPreview(item)}
                                className="w-10 h-10 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center shrink-0 border border-blue-200 cursor-pointer hover:bg-blue-100"
                                title="Click to inspect"
                              >
                                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                  <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth="2"
                                    d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                                  />
                                </svg>
                              </div>
                            )}
                            <div className="min-w-0">
                              <button
                                type="button"
                                onClick={() => setSelectedPreview(item)}
                                className="font-semibold text-slate-900 hover:text-blue-700 truncate max-w-xs text-left cursor-pointer block"
                                title="Click to preview file"
                              >
                                {item.name}
                              </button>
                              <p className="text-[10px] text-slate-400">Added at {item.selectedAt}</p>
                            </div>
                          </div>
                        </td>

                        {/* 2. File Type */}
                        <td className="py-3.5 px-4 text-slate-600">
                          <span className="font-mono text-[11px] bg-slate-100 px-2 py-0.5 rounded text-slate-700">
                            {item.type || 'Document'}
                          </span>
                        </td>

                        {/* 3. File Size */}
                        <td className="py-3.5 px-4 text-slate-600 font-mono">{formatFileSize(item.size)}</td>

                        {/* 4. Scam Type */}
                        <td className="py-3.5 px-4">
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-blue-50 text-blue-800 border border-blue-200">
                            {item.scamCategory || 'Cyber Fraud'}
                          </span>
                        </td>

                        {/* 5. Associated Case Reference ID */}
                        <td className="py-3.5 px-4">
                          {item.reportRef ? (
                            <span className="font-mono text-xs font-bold text-slate-800 bg-slate-100 px-2.5 py-1 rounded border border-slate-200">
                              {item.reportRef}
                            </span>
                          ) : (
                            <span className="text-slate-400 text-xs">Unassigned</span>
                          )}
                        </td>

                        {/* 6. Actions */}
                        <td className="py-3.5 px-4 text-right">
                          <div className="flex items-center justify-end space-x-2">
                            <button
                              type="button"
                              onClick={() => setSelectedPreview(item)}
                              className="px-2.5 py-1 text-xs font-semibold text-blue-700 bg-blue-50 hover:bg-blue-100 rounded-md transition-colors"
                            >
                              View Preview
                            </button>
                            <button
                              type="button"
                              onClick={() => onRemoveFile(item.id)}
                              className="px-2.5 py-1 text-xs font-semibold text-rose-600 bg-rose-50 hover:bg-rose-100 rounded-md transition-colors"
                              title="Remove file from repository"
                            >
                              Remove
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* Mobile / Tablet Cards View */}
            <div className="lg:hidden divide-y divide-slate-100">
              {filteredEvidence.map((item) => {
                const isImg = isImageFile(item.type, item.name);
                const isPdf = isPdfFile(item.type, item.name);

                return (
                  <div key={item.id} className="p-4 space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-blue-50 text-blue-800 border border-blue-200">
                        {item.scamCategory || 'Cyber Fraud'}
                      </span>
                      {item.reportRef ? (
                        <span className="font-mono text-xs font-bold text-slate-800 bg-slate-100 px-2 py-0.5 rounded border border-slate-200">
                          {item.reportRef}
                        </span>
                      ) : (
                        <span className="text-slate-400 text-xs">Unassigned</span>
                      )}
                    </div>

                    <div className="flex items-center space-x-3">
                      {isImg && item.previewUrl ? (
                        <img
                          src={item.previewUrl}
                          alt={item.name}
                          onClick={() => setSelectedPreview(item)}
                          className="w-12 h-12 rounded-lg object-cover border border-slate-200 shrink-0 cursor-pointer"
                        />
                      ) : isPdf ? (
                        <div
                          onClick={() => setSelectedPreview(item)}
                          className="w-12 h-12 rounded-lg bg-rose-50 text-rose-600 flex items-center justify-center shrink-0 border border-rose-200 cursor-pointer"
                        >
                          <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth="2"
                              d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z"
                            />
                          </svg>
                        </div>
                      ) : (
                        <div
                          onClick={() => setSelectedPreview(item)}
                          className="w-12 h-12 rounded-lg bg-slate-100 text-slate-500 flex items-center justify-center shrink-0 border border-slate-200 cursor-pointer"
                        >
                          <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth="2"
                              d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                            />
                          </svg>
                        </div>
                      )}
                      <div className="min-w-0 flex-1">
                        <button
                          type="button"
                          onClick={() => setSelectedPreview(item)}
                          className="text-xs font-semibold text-slate-900 hover:text-blue-700 text-left truncate block w-full"
                        >
                          {item.name}
                        </button>
                        <p className="text-[11px] text-slate-500 mt-0.5">
                          {formatFileSize(item.size)} • {item.type || 'Document'}
                        </p>
                      </div>
                    </div>

                    <div className="pt-1 flex justify-end space-x-2">
                      <button
                        type="button"
                        onClick={() => setSelectedPreview(item)}
                        className="px-3 py-1.5 text-xs font-semibold text-blue-700 bg-blue-50 hover:bg-blue-100 rounded-lg"
                      >
                        View Preview
                      </button>
                      <button
                        type="button"
                        onClick={() => onRemoveFile(item.id)}
                        className="px-3 py-1.5 text-xs font-semibold text-rose-600 bg-rose-50 hover:bg-rose-100 rounded-lg"
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </>
        )}
      </div>

      {/* Lightbox / Document Preview Modal */}
      {selectedPreview && (
        <div
          role="button"
          tabIndex={0}
          aria-label="Close preview modal"
          className="fixed inset-0 z-50 bg-black/75 backdrop-blur-xs flex items-center justify-center p-3 sm:p-5 cursor-pointer"
          onClick={() => setSelectedPreview(null)}
          onKeyDown={(e) => {
            if (e.key === 'Escape' || e.key === 'Enter') {
              setSelectedPreview(null);
            }
          }}
        >
          <div
            className="bg-white rounded-2xl max-w-4xl w-full p-4 sm:p-6 shadow-2xl overflow-hidden relative cursor-auto flex flex-col max-h-[90vh]"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="flex items-start justify-between pb-4 border-b border-slate-200">
              <div className="min-w-0 pr-4">
                <div className="flex flex-wrap items-center gap-2 mb-1">
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-blue-50 text-blue-800 border border-blue-200">
                    {selectedPreview.scamCategory || 'Cyber Fraud'}
                  </span>
                  {selectedPreview.reportRef && (
                    <span className="font-mono text-xs font-bold text-slate-800 bg-slate-100 px-2 py-0.5 rounded border border-slate-200">
                      Case Ref: {selectedPreview.reportRef}
                    </span>
                  )}
                </div>
                <h4 className="text-base font-bold text-slate-900 truncate">{selectedPreview.name}</h4>
                <p className="text-xs text-slate-500 mt-0.5">
                  Type: <span className="font-medium text-slate-700">{selectedPreview.type || 'Document'}</span> • Size:{' '}
                  <span className="font-mono text-slate-700">{formatFileSize(selectedPreview.size)}</span>
                </p>
              </div>
              <button
                type="button"
                onClick={() => setSelectedPreview(null)}
                className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 hover:text-slate-800 flex items-center justify-center font-bold text-sm shrink-0"
                aria-label="Close preview"
              >
                ✕
              </button>
            </div>

            {/* Modal Content - File Viewer */}
            <div className="py-4 flex-1 overflow-auto flex items-center justify-center bg-slate-50/50 rounded-xl my-3 border border-slate-100 min-h-[300px]">
              {/* IMAGE PREVIEW */}
              {isImageFile(selectedPreview.type, selectedPreview.name) && (
                selectedPreview.previewUrl ? (
                  <img
                    src={selectedPreview.previewUrl}
                    alt={selectedPreview.name}
                    className="max-h-[65vh] max-w-full rounded-lg object-contain shadow-xs"
                  />
                ) : (
                  <div className="text-center p-6 text-slate-500">
                    <p className="text-sm font-semibold">Image preview unavailable</p>
                    <p className="text-xs text-slate-400 mt-1">Temporary object URL expired or revoked.</p>
                  </div>
                )
              )}

              {/* PDF PREVIEW */}
              {isPdfFile(selectedPreview.type, selectedPreview.name) && (
                selectedPreview.previewUrl ? (
                  <div className="w-full h-[65vh] flex flex-col">
                    <iframe
                      src={selectedPreview.previewUrl}
                      title={selectedPreview.name}
                      className="w-full h-full rounded-lg border border-slate-300 bg-white"
                    />
                  </div>
                ) : (
                  <div className="text-center p-8 text-slate-500">
                    <svg className="w-12 h-12 text-rose-500 mx-auto mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z"
                      />
                    </svg>
                    <p className="text-sm font-semibold text-slate-800">PDF Document Inspection</p>
                    <p className="text-xs text-slate-500 mt-1">
                      Direct preview for {selectedPreview.name} is ready for verification.
                    </p>
                  </div>
                )
              )}

              {/* DOC / DOCX PREVIEW */}
              {isDocFile(selectedPreview.type, selectedPreview.name) && (
                <div className="text-center p-8 max-w-md">
                  <div className="w-14 h-14 rounded-2xl bg-blue-100 text-blue-700 mx-auto flex items-center justify-center mb-3">
                    <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                      />
                    </svg>
                  </div>
                  <h5 className="text-sm font-bold text-slate-800">Word Document File</h5>
                  <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                    Direct in-browser preview is unsupported for proprietary Word (.doc/.docx) formats without an external office rendering service.
                  </p>
                  <div className="mt-3 p-2.5 bg-blue-50 border border-blue-200 rounded-lg text-[11px] text-blue-800">
                    Document is securely staged in the citizen case dossier ({formatFileSize(selectedPreview.size)}).
                  </div>
                </div>
              )}

              {/* OTHER FORMATS */}
              {!isImageFile(selectedPreview.type, selectedPreview.name) &&
                !isPdfFile(selectedPreview.type, selectedPreview.name) &&
                !isDocFile(selectedPreview.type, selectedPreview.name) && (
                  <div className="text-center p-8 max-w-md">
                    <div className="w-12 h-12 rounded-xl bg-slate-100 text-slate-500 mx-auto flex items-center justify-center mb-2">
                      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                    <p className="text-sm font-semibold text-slate-800">{selectedPreview.name}</p>
                    <p className="text-xs text-slate-500 mt-1">
                      Direct preview for format ({selectedPreview.type}) is not available in browser sandbox.
                    </p>
                  </div>
                )}
            </div>

            {/* Modal Footer */}
            <div className="pt-3 border-t border-slate-200 flex items-center justify-between text-xs text-slate-500">
              <span>Attached to Case: <strong className="text-slate-700 font-mono">{selectedPreview.reportRef || 'N/A'}</strong></span>
              <button
                type="button"
                onClick={() => setSelectedPreview(null)}
                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-semibold transition-colors"
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
