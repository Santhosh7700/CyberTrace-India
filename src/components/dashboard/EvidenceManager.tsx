import { useRef, useState } from 'react';
import type { EvidenceFileItem } from '../../types/dashboard';

interface EvidenceManagerProps {
  evidenceList: EvidenceFileItem[];
  onAddFiles: (items: EvidenceFileItem[]) => void;
  onRemoveFile: (id: string) => void;
}

export default function EvidenceManager({ evidenceList, onAddFiles, onRemoveFile }: EvidenceManagerProps) {
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [selectedPreview, setSelectedPreview] = useState<EvidenceFileItem | null>(null);
  const [dragOver, setDragOver] = useState(false);

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
  };

  const handleProcessFiles = (fileList: FileList | null) => {
    if (!fileList || fileList.length === 0) return;

    const newItems: EvidenceFileItem[] = [];

    Array.from(fileList).forEach((file) => {
      // Create object URL for preview if file is an image
      const isImg = file.type.startsWith('image/');
      const previewUrl = isImg ? URL.createObjectURL(file) : undefined;

      newItems.push({
        id: `ev-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
        name: file.name,
        size: file.size,
        type: file.type || 'application/octet-stream',
        previewUrl,
        selectedAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      });
    });

    onAddFiles(newItems);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    handleProcessFiles(e.dataTransfer.files);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(true);
  };

  const handleDragLeave = () => {
    setDragOver(false);
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Header Info Banner */}
      <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <div className="flex items-center space-x-2 text-indigo-700 text-xs font-bold uppercase tracking-wider mb-1">
              <span className="w-2 h-2 rounded-full bg-indigo-600"></span>
              <span>Digital Evidence Repository</span>
            </div>
            <h2 className="text-xl font-bold text-slate-900">Manage Scam Evidence Files</h2>
            <p className="text-xs text-slate-500 mt-1">
              Select screenshots, transaction receipts, bank statements, or suspect chat exports.
            </p>
          </div>
          <div className="text-xs font-semibold px-3 py-1.5 rounded-full bg-indigo-50 text-indigo-700 border border-indigo-200 self-start sm:self-auto">
            {evidenceList.length} File{evidenceList.length === 1 ? '' : 's'} Selected
          </div>
        </div>

        {/* Security & Memory notice */}
        <div className="mt-4 p-3 bg-amber-50/70 border border-amber-200 rounded-lg text-xs text-amber-800 flex items-start space-x-2">
          <svg className="w-4 h-4 text-amber-600 mt-0.5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          <div>
            <strong>Browser-Session Sandbox:</strong> Uploaded evidence files remain strictly inside your browser's memory session via object URLs. No data is transmitted to an external server in this frontend phase.
          </div>
        </div>
      </div>

      {/* Upload Dropzone */}
      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
        className={`border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-all ${
          dragOver
            ? 'border-blue-600 bg-blue-50/50'
            : 'border-slate-300 hover:border-blue-500 hover:bg-slate-50/50 bg-white'
        }`}
      >
        <input
          ref={fileInputRef}
          type="file"
          multiple
          accept="image/*,.pdf,.doc,.docx,.txt"
          onChange={(e) => handleProcessFiles(e.target.files)}
          className="hidden"
        />

        <div className="w-12 h-12 rounded-xl bg-blue-100 text-blue-700 mx-auto flex items-center justify-center mb-3">
          <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
            />
          </svg>
        </div>
        <p className="text-sm font-semibold text-slate-800">
          Click to select files or drag and drop evidence here
        </p>
        <p className="text-xs text-slate-500 mt-1">
          Supports PNG, JPG, WEBP, PDF, and DOC up to 10MB per file
        </p>
        <button
          type="button"
          className="mt-4 px-4 py-2 bg-blue-700 hover:bg-blue-800 text-white rounded-lg text-xs font-semibold shadow-xs"
        >
          Select Files from Device
        </button>
      </div>

      {/* Selected Files List */}
      <div className="bg-white rounded-xl border border-slate-200/90 shadow-xs overflow-hidden">
        <div className="p-4 border-b border-slate-100">
          <h3 className="text-sm font-bold text-slate-800">Staged Evidence Files ({evidenceList.length})</h3>
        </div>

        {evidenceList.length === 0 ? (
          <div className="p-8 text-center text-xs text-slate-400">
            No evidence files selected. Attach screenshots of fraudulent chats or payment slips to verify complaints.
          </div>
        ) : (
          <div className="divide-y divide-slate-100">
            {evidenceList.map((item) => (
              <div
                key={item.id}
                className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:bg-slate-50 transition-colors"
              >
                <div className="flex items-center space-x-3 min-w-0">
                  {/* File Icon or Thumbnail */}
                  {item.previewUrl ? (
                    <img
                      src={item.previewUrl}
                      alt={item.name}
                      className="w-12 h-12 rounded-lg object-cover border border-slate-200 shrink-0 cursor-pointer hover:opacity-80"
                      onClick={() => setSelectedPreview(item)}
                    />
                  ) : (
                    <div className="w-12 h-12 rounded-lg bg-slate-100 text-slate-500 flex items-center justify-center shrink-0 border border-slate-200">
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

                  <div className="min-w-0">
                    <p className="text-xs font-semibold text-slate-800 truncate">{item.name}</p>
                    <p className="text-[11px] text-slate-500 mt-0.5">
                      {formatFileSize(item.size)} • {item.type || 'Document'} • Added at {item.selectedAt}
                    </p>
                    <span className="inline-block mt-1 text-[10px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                      ✓ Ready for Evidence Dossier
                    </span>
                  </div>
                </div>

                <div className="flex items-center space-x-2 self-end sm:self-auto shrink-0">
                  {item.previewUrl && (
                    <button
                      type="button"
                      onClick={() => setSelectedPreview(item)}
                      className="px-3 py-1.5 text-xs font-semibold text-blue-700 bg-blue-50 hover:bg-blue-100 rounded-md transition-colors"
                    >
                      Preview
                    </button>
                  )}
                  <button
                    type="button"
                    onClick={() => onRemoveFile(item.id)}
                    className="px-3 py-1.5 text-xs font-semibold text-rose-600 bg-rose-50 hover:bg-rose-100 rounded-md transition-colors"
                    title="Remove file"
                  >
                    Remove
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Lightbox / Modal for Preview */}
      {selectedPreview && (
        <div
          role="button"
          tabIndex={0}
          aria-label="Close preview modal"
          className="fixed inset-0 z-50 bg-black/70 flex items-center justify-center p-4 cursor-pointer"
          onClick={() => setSelectedPreview(null)}
          onKeyDown={(e) => {
            if (e.key === 'Escape' || e.key === 'Enter') {
              setSelectedPreview(null);
            }
          }}
        >
          <div
            className="bg-white rounded-xl max-w-2xl w-full p-4 overflow-hidden relative cursor-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h4 className="text-sm font-bold text-slate-800 truncate pr-4">{selectedPreview.name}</h4>
              <button
                type="button"
                onClick={() => setSelectedPreview(null)}
                className="text-slate-400 hover:text-slate-700 text-lg font-bold"
              >
                ✕
              </button>
            </div>
            <div className="py-4 flex items-center justify-center max-h-[70vh] overflow-auto">
              {selectedPreview.previewUrl && (
                <img
                  src={selectedPreview.previewUrl}
                  alt={selectedPreview.name}
                  className="max-h-[60vh] max-w-full rounded-lg object-contain"
                />
              )}
            </div>
            <div className="text-right pt-2 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setSelectedPreview(null)}
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
