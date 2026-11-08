import { useState, useRef, useEffect } from 'react';
import type { ScamCategory, ScamReport, EvidenceFileItem } from '../../types/dashboard';

interface ReportFormProps {
  onSubmitSuccess: (newReport: ScamReport) => void;
  onCancel: () => void;
}

interface FormState {
  category: ScamCategory | '';
  incidentDate: string;
  amountLost: string;
  transactionId: string;
  suspectContact: string;
  platform: string;
  description: string;
}

interface FormErrors {
  category?: string;
  incidentDate?: string;
  amountLost?: string;
  suspectContact?: string;
  platform?: string;
  description?: string;
  evidence?: string;
}

export default function ReportForm({ onSubmitSuccess, onCancel }: ReportFormProps) {
  const [formData, setFormData] = useState<FormState>({
    category: '',
    incidentDate: '',
    amountLost: '',
    transactionId: '',
    suspectContact: '',
    platform: '',
    description: '',
  });

  // Attached evidence state during reporting
  const [evidenceFiles, setEvidenceFiles] = useState<EvidenceFileItem[]>([]);
  const [previewModalFile, setPreviewModalFile] = useState<EvidenceFileItem | null>(null);
  const [isDragOver, setIsDragOver] = useState(false);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submittedReport, setSubmittedReport] = useState<ScamReport | null>(null);

  // Clean up object URLs on component unmount
  useEffect(() => {
    return () => {
      evidenceFiles.forEach((file) => {
        if (file.previewUrl) {
          URL.revokeObjectURL(file.previewUrl);
        }
      });
    };
  }, [evidenceFiles]);

  const categories: ScamCategory[] = [
    'UPI Fraud',
    'Phishing',
    'Fake Investment',
    'Job Scam',
    'Online Shopping Fraud',
    'Social Media Scam',
    'Other',
  ];

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
  };

  const handleProcessFiles = (fileList: FileList | null) => {
    if (!fileList || fileList.length === 0) return;

    const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB
    const validItems: EvidenceFileItem[] = [];
    let fileError = '';

    Array.from(fileList).forEach((file) => {
      if (file.size > MAX_FILE_SIZE) {
        fileError = `File "${file.name}" exceeds the 10 MB limit.`;
        return;
      }

      const isImg = file.type.startsWith('image/');
      const previewUrl = isImg ? URL.createObjectURL(file) : undefined;

      validItems.push({
        id: `ev-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
        name: file.name,
        size: file.size,
        type: file.type || 'application/octet-stream',
        previewUrl,
        selectedAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      });
    });

    if (fileError) {
      setErrors((prev) => ({ ...prev, evidence: fileError }));
    } else {
      setErrors((prev) => ({ ...prev, evidence: undefined }));
    }

    if (validItems.length > 0) {
      setEvidenceFiles((prev) => [...prev, ...validItems]);
    }
  };

  const handleRemoveEvidence = (id: string) => {
    setEvidenceFiles((prev) => {
      const target = prev.find((item) => item.id === id);
      if (target?.previewUrl) {
        URL.revokeObjectURL(target.previewUrl);
      }
      return prev.filter((item) => item.id !== id);
    });
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    handleProcessFiles(e.dataTransfer.files);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = () => {
    setIsDragOver(false);
  };

  const validate = (): boolean => {
    const errs: FormErrors = {};

    if (!formData.category) {
      errs.category = 'Please select a scam category.';
    }

    if (!formData.incidentDate) {
      errs.incidentDate = 'Incident date is required.';
    } else {
      const selected = new Date(formData.incidentDate);
      const today = new Date();
      today.setHours(23, 59, 59, 999);
      if (selected > today) {
        errs.incidentDate = 'Incident date cannot be in the future.';
      }
    }

    if (!formData.amountLost.trim()) {
      errs.amountLost = 'Approximate financial loss is required (enter 0 if no direct loss).';
    } else {
      const parsed = Number(formData.amountLost);
      if (isNaN(parsed) || parsed < 0) {
        errs.amountLost = 'Please enter a valid non-negative number.';
      }
    }

    if (!formData.suspectContact.trim()) {
      errs.suspectContact = 'Provide suspect phone number, email, UPI ID or website URL.';
    } else if (formData.suspectContact.trim().length < 4) {
      errs.suspectContact = 'Suspect detail is too short.';
    }

    if (!formData.platform.trim()) {
      errs.platform = 'Platform used (e.g. WhatsApp, Telegram, Google Pay, Website) is required.';
    }

    if (!formData.description.trim()) {
      errs.description = 'Detailed incident description is required.';
    } else if (formData.description.trim().length < 30) {
      errs.description = 'Please provide at least 30 characters explaining the sequence of events.';
    }

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const generateReferenceId = () => {
    const now = new Date();
    const yyyy = now.getFullYear();
    const mm = String(now.getMonth() + 1).padStart(2, '0');
    const dd = String(now.getDate()).padStart(2, '0');
    const rand = Math.floor(1000 + Math.random() * 9000);
    return `CT-${yyyy}${mm}${dd}-${rand}`;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setIsSubmitting(true);

    setTimeout(() => {
      const newRefId = generateReferenceId();
      const now = new Date();
      const reportedDate = now.toISOString().split('T')[0];

      // Associate all attached evidence files with this reference ID and scam category
      const associatedEvidence = evidenceFiles.map((file) => ({
        ...file,
        reportRef: newRefId,
        scamCategory: formData.category as ScamCategory,
      }));

      const newReport: ScamReport = {
        id: `rep-${Date.now()}`,
        referenceId: newRefId,
        category: formData.category as ScamCategory,
        incidentDate: formData.incidentDate,
        reportedDate,
        amountLost: Number(formData.amountLost) || 0,
        transactionId: formData.transactionId.trim() || undefined,
        suspectContact: formData.suspectContact.trim(),
        platform: formData.platform.trim(),
        description: formData.description.trim(),
        status: 'Submitted',
        evidenceFiles: associatedEvidence,
        statusTimeline: {
          submittedAt: `${reportedDate} ${now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`,
          remarks: `Report registered with ${associatedEvidence.length} supporting evidence file(s) in frontend demo session.`,
        },
      };

      setIsSubmitting(false);
      setSubmittedReport(newReport);
      onSubmitSuccess(newReport);
    }, 400);
  };

  if (submittedReport) {
    return (
      <div className="bg-white rounded-xl border border-emerald-200 p-8 shadow-sm text-center max-w-2xl mx-auto my-6">
        <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 mx-auto flex items-center justify-center mb-4">
          <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <span className="inline-block px-3 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200 mb-2">
          Mock Report Submitted Successfully
        </span>
        <h2 className="text-2xl font-bold text-slate-900">Cyber Incident Complaint Registered</h2>
        <p className="text-sm text-slate-600 mt-2">
          Your complaint along with <strong>{submittedReport.evidenceFiles.length} attached evidence item(s)</strong> has been saved to your active browser session:
        </p>

        <div className="my-5 p-4 rounded-xl bg-slate-50 border border-slate-200 inline-block font-mono text-xl font-extrabold text-blue-700 tracking-wider">
          {submittedReport.referenceId}
        </div>

        {/* Evidence files summary */}
        {submittedReport.evidenceFiles.length > 0 && (
          <div className="mb-6 p-4 rounded-lg bg-blue-50/60 border border-blue-200 text-left text-xs">
            <span className="font-semibold text-blue-900 block mb-2">
              Attached Evidence ({submittedReport.evidenceFiles.length}):
            </span>
            <ul className="space-y-1 text-slate-700">
              {submittedReport.evidenceFiles.map((ev) => (
                <li key={ev.id} className="flex items-center space-x-2">
                  <span className="text-blue-600 font-bold">•</span>
                  <span className="font-medium truncate max-w-xs">{ev.name}</span>
                  <span className="text-slate-400">({formatFileSize(ev.size)})</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        <div className="bg-amber-50 border border-amber-200 rounded-lg p-3 text-xs text-amber-800 text-left mb-6">
          <strong>Notice:</strong> This is an in-memory frontend demo session. Files are retained temporarily in browser memory and are not uploaded to any remote server.
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
          <button
            onClick={() => {
              setSubmittedReport(null);
              setEvidenceFiles([]);
              setFormData({
                category: '',
                incidentDate: '',
                amountLost: '',
                transactionId: '',
                suspectContact: '',
                platform: '',
                description: '',
              });
            }}
            className="w-full sm:w-auto px-5 py-2.5 rounded-lg bg-blue-700 hover:bg-blue-800 text-white text-xs font-semibold shadow-xs"
          >
            Lodge Another Report
          </button>
          <button
            onClick={onCancel}
            className="w-full sm:w-auto px-5 py-2.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold"
          >
            Go to My Reports
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl border border-slate-200/90 shadow-xs p-6 sm:p-8 max-w-4xl mx-auto">
      <div className="border-b border-slate-100 pb-5 mb-6">
        <div className="flex items-center space-x-2 text-rose-600 text-xs font-bold uppercase tracking-wider mb-1">
          <span className="w-2 h-2 rounded-full bg-rose-600"></span>
          <span>Official Incident Lodgement Form</span>
        </div>
        <h2 className="text-xl sm:text-2xl font-bold text-slate-900">Report an Online Cyber Scam</h2>
        <p className="text-xs sm:text-sm text-slate-500 mt-1">
          Please provide accurate details and attach supporting evidence. Information entered is maintained in your frontend session.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Category */}
          <div>
            <label htmlFor="scam-category" className="block text-xs font-semibold text-slate-700 mb-1.5">
              Scam Category <span className="text-rose-500">*</span>
            </label>
            <select
              id="scam-category"
              value={formData.category}
              onChange={(e) => setFormData({ ...formData, category: e.target.value as ScamCategory })}
              className={`w-full px-3.5 py-2.5 rounded-lg border text-sm bg-white focus:outline-none focus:ring-2 ${
                errors.category
                  ? 'border-rose-400 focus:ring-rose-200'
                  : 'border-slate-300 focus:border-blue-600 focus:ring-blue-100'
              }`}
            >
              <option value="">-- Select Incident Category --</option>
              {categories.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
            {errors.category && <p className="text-xs text-rose-500 mt-1">{errors.category}</p>}
          </div>

          {/* Incident Date */}
          <div>
            <label htmlFor="incident-date" className="block text-xs font-semibold text-slate-700 mb-1.5">
              Date of Incident <span className="text-rose-500">*</span>
            </label>
            <input
              id="incident-date"
              type="date"
              value={formData.incidentDate}
              onChange={(e) => setFormData({ ...formData, incidentDate: e.target.value })}
              className={`w-full px-3.5 py-2.5 rounded-lg border text-sm bg-white focus:outline-none focus:ring-2 ${
                errors.incidentDate
                  ? 'border-rose-400 focus:ring-rose-200'
                  : 'border-slate-300 focus:border-blue-600 focus:ring-blue-100'
              }`}
            />
            {errors.incidentDate && <p className="text-xs text-rose-500 mt-1">{errors.incidentDate}</p>}
          </div>

          {/* Approximate Financial Loss */}
          <div>
            <label htmlFor="amount-lost" className="block text-xs font-semibold text-slate-700 mb-1.5">
              Approximate Financial Loss (INR ₹) <span className="text-rose-500">*</span>
            </label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-sm font-semibold text-slate-400">
                ₹
              </span>
              <input
                id="amount-lost"
                type="number"
                min="0"
                step="1"
                placeholder="e.g. 25000 (0 if no money lost)"
                value={formData.amountLost}
                onChange={(e) => setFormData({ ...formData, amountLost: e.target.value })}
                className={`w-full pl-8 pr-3.5 py-2.5 rounded-lg border text-sm bg-white focus:outline-none focus:ring-2 ${
                  errors.amountLost
                    ? 'border-rose-400 focus:ring-rose-200'
                    : 'border-slate-300 focus:border-blue-600 focus:ring-blue-100'
                }`}
              />
            </div>
            {errors.amountLost && <p className="text-xs text-rose-500 mt-1">{errors.amountLost}</p>}
          </div>

          {/* Transaction ID / UTR (Optional) */}
          <div>
            <label htmlFor="txn-id" className="block text-xs font-semibold text-slate-700 mb-1.5">
              Transaction ID / UTR / Reference No.{' '}
              <span className="text-slate-400 font-normal">(Optional)</span>
            </label>
            <input
              id="txn-id"
              type="text"
              placeholder="e.g. UPI/345210987654 or Bank IMPS ref"
              value={formData.transactionId}
              onChange={(e) => setFormData({ ...formData, transactionId: e.target.value })}
              className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 text-sm bg-white focus:outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-100 font-mono"
            />
            <p className="text-[11px] text-slate-400 mt-1">Helps financial intelligence units trace recipient accounts.</p>
          </div>

          {/* Suspect Contact */}
          <div>
            <label htmlFor="suspect-contact" className="block text-xs font-semibold text-slate-700 mb-1.5">
              Suspect Phone / Email / Website / UPI ID <span className="text-rose-500">*</span>
            </label>
            <input
              id="suspect-contact"
              type="text"
              placeholder="e.g. +91 98765 00000, scammer@fake.com, or malicious URL"
              value={formData.suspectContact}
              onChange={(e) => setFormData({ ...formData, suspectContact: e.target.value })}
              className={`w-full px-3.5 py-2.5 rounded-lg border text-sm bg-white focus:outline-none focus:ring-2 ${
                errors.suspectContact
                  ? 'border-rose-400 focus:ring-rose-200'
                  : 'border-slate-300 focus:border-blue-600 focus:ring-blue-100'
              }`}
            />
            {errors.suspectContact && <p className="text-xs text-rose-500 mt-1">{errors.suspectContact}</p>}
          </div>

          {/* Platform Used */}
          <div>
            <label htmlFor="platform" className="block text-xs font-semibold text-slate-700 mb-1.5">
              Platform / Medium Used <span className="text-rose-500">*</span>
            </label>
            <input
              id="platform"
              type="text"
              placeholder="e.g. WhatsApp, Telegram, Instagram, Google Pay, Netbanking"
              value={formData.platform}
              onChange={(e) => setFormData({ ...formData, platform: e.target.value })}
              className={`w-full px-3.5 py-2.5 rounded-lg border text-sm bg-white focus:outline-none focus:ring-2 ${
                errors.platform
                  ? 'border-rose-400 focus:ring-rose-200'
                  : 'border-slate-300 focus:border-blue-600 focus:ring-blue-100'
              }`}
            />
            {errors.platform && <p className="text-xs text-rose-500 mt-1">{errors.platform}</p>}
          </div>
        </div>

        {/* Detailed Incident Description */}
        <div>
          <label htmlFor="description" className="block text-xs font-semibold text-slate-700 mb-1.5">
            Detailed Incident Description <span className="text-rose-500">*</span>
          </label>
          <textarea
            id="description"
            rows={4}
            placeholder="Explain chronologically how the suspect contacted you, what instructions they gave, and how the fraud occurred..."
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            className={`w-full px-3.5 py-2.5 rounded-lg border text-sm bg-white focus:outline-none focus:ring-2 ${
              errors.description
                ? 'border-rose-400 focus:ring-rose-200'
                : 'border-slate-300 focus:border-blue-600 focus:ring-blue-100'
            }`}
          />
          <div className="flex justify-between items-center mt-1">
            {errors.description ? (
              <p className="text-xs text-rose-500">{errors.description}</p>
            ) : (
              <p className="text-[11px] text-slate-400">Include exact dates, times, and amounts mentioned by the fraudster.</p>
            )}
            <span className="text-[11px] text-slate-400">{formData.description.length} chars</span>
          </div>
        </div>

        {/* INTEGRATED SECTION: Attach Supporting Evidence */}
        <div className="pt-2 border-t border-slate-100">
          <div className="flex items-center justify-between mb-3">
            <div>
              <h3 className="text-sm font-bold text-slate-900 flex items-center">
                <svg className="w-4 h-4 mr-1.5 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13" />
                </svg>
                Attach Supporting Evidence
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Attach transaction receipts, WhatsApp/Telegram screenshots, bank statements, or malicious links (PNG, JPG, WEBP, PDF, DOC). Max 10 MB per file.
              </p>
            </div>
            <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-slate-100 text-slate-700">
              {evidenceFiles.length} attached
            </span>
          </div>

          {/* Drag and Drop Zone */}
          <div
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            onClick={() => fileInputRef.current?.click()}
            className={`border-2 border-dashed rounded-xl p-5 text-center cursor-pointer transition-colors ${
              isDragOver
                ? 'border-blue-600 bg-blue-50/60'
                : 'border-slate-300 hover:border-blue-500 hover:bg-slate-50/70 bg-slate-50/30'
            }`}
          >
            <input
              ref={fileInputRef}
              type="file"
              multiple
              accept="image/png,image/jpeg,image/webp,.pdf,.doc,.docx"
              onChange={(e) => handleProcessFiles(e.target.files)}
              className="hidden"
            />
            <div className="flex flex-col items-center justify-center">
              <svg className="w-8 h-8 text-blue-600 mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                />
              </svg>
              <p className="text-xs font-semibold text-slate-800">
                Click to browse files or drag and drop evidence here
              </p>
              <p className="text-[11px] text-slate-400 mt-0.5">
                PNG, JPG, WEBP, PDF, DOC up to 10 MB
              </p>
            </div>
          </div>

          {errors.evidence && (
            <p className="text-xs text-rose-500 mt-1.5 font-medium">{errors.evidence}</p>
          )}

          {/* Attached Files List Preview */}
          {evidenceFiles.length > 0 && (
            <div className="mt-4 divide-y divide-slate-100 rounded-lg border border-slate-200 bg-white overflow-hidden">
              {evidenceFiles.map((item) => (
                <div
                  key={item.id}
                  className="p-3 flex items-center justify-between gap-3 hover:bg-slate-50 transition-colors"
                >
                  <div className="flex items-center space-x-3 min-w-0">
                    {item.previewUrl ? (
                      <img
                        src={item.previewUrl}
                        alt={item.name}
                        onClick={() => setPreviewModalFile(item)}
                        className="w-10 h-10 rounded-md object-cover border border-slate-200 shrink-0 cursor-pointer hover:opacity-80"
                        title="Click to preview"
                      />
                    ) : (
                      <div className="w-10 h-10 rounded-md bg-slate-100 text-slate-500 flex items-center justify-center shrink-0 border border-slate-200">
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
                      <p className="text-xs font-semibold text-slate-800 truncate max-w-xs sm:max-w-md">{item.name}</p>
                      <p className="text-[11px] text-slate-400">
                        {formatFileSize(item.size)} • {item.type || 'Document'}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-2 shrink-0">
                    {item.previewUrl && (
                      <button
                        type="button"
                        onClick={() => setPreviewModalFile(item)}
                        className="px-2.5 py-1 text-xs font-semibold text-blue-700 bg-blue-50 hover:bg-blue-100 rounded transition-colors"
                      >
                        Preview
                      </button>
                    )}
                    <button
                      type="button"
                      onClick={() => handleRemoveEvidence(item.id)}
                      className="px-2.5 py-1 text-xs font-semibold text-rose-600 bg-rose-50 hover:bg-rose-100 rounded transition-colors"
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

        {/* Action Buttons */}
        <div className="pt-4 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-end gap-3">
          <button
            type="button"
            onClick={onCancel}
            className="w-full sm:w-auto px-5 py-2.5 rounded-lg border border-slate-300 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full sm:w-auto px-6 py-2.5 rounded-lg bg-blue-700 hover:bg-blue-800 text-white text-xs font-semibold shadow-sm transition-colors flex items-center justify-center disabled:opacity-50"
          >
            {isSubmitting ? (
              <>
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
                Registering Complaint...
              </>
            ) : (
              `Submit Report & ${evidenceFiles.length} Evidence File${evidenceFiles.length === 1 ? '' : 's'}`
            )}
          </button>
        </div>
      </form>

      {/* Lightbox / Modal for Preview */}
      {previewModalFile && (
        <div
          role="button"
          tabIndex={0}
          aria-label="Close preview modal"
          className="fixed inset-0 z-50 bg-black/70 flex items-center justify-center p-4 cursor-pointer"
          onClick={() => setPreviewModalFile(null)}
          onKeyDown={(e) => {
            if (e.key === 'Escape' || e.key === 'Enter') {
              setPreviewModalFile(null);
            }
          }}
        >
          <div
            className="bg-white rounded-xl max-w-2xl w-full p-4 overflow-hidden relative cursor-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h4 className="text-sm font-bold text-slate-800 truncate pr-4">{previewModalFile.name}</h4>
              <button
                type="button"
                onClick={() => setPreviewModalFile(null)}
                className="text-slate-400 hover:text-slate-700 text-lg font-bold"
              >
                ✕
              </button>
            </div>
            <div className="py-4 flex items-center justify-center max-h-[70vh] overflow-auto">
              {previewModalFile.previewUrl && (
                <img
                  src={previewModalFile.previewUrl}
                  alt={previewModalFile.name}
                  className="max-h-[60vh] max-w-full rounded-lg object-contain"
                />
              )}
            </div>
            <div className="text-right pt-2 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setPreviewModalFile(null)}
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
