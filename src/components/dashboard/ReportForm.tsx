import { useState, useRef, useEffect } from 'react';
import type { ScamCategory, ScamReport, EvidenceFileItem } from '../../types/dashboard';
import type { IndicatorType, SuspectIdentifier } from '../../types/intelligence';
import { normalizeIndicator } from '../../services/intelligenceEngine';

interface ReportFormProps {
  onSubmitSuccess: (newReport: ScamReport) => void;
  onCancel: () => void;
}

export interface FormIdentifierRow {
  id: string;
  type: IndicatorType;
  value: string;
}

interface FormState {
  category: ScamCategory | '';
  incidentDate: string;
  amountLost: string;
  transactionId: string;
  platform: string;
  description: string;
}

interface FormErrors {
  category?: string;
  incidentDate?: string;
  amountLost?: string;
  suspectIdentifiers?: string;
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
    platform: '',
    description: '',
  });

  // Multi-identifier repeatable state
  const [identifiers, setIdentifiers] = useState<FormIdentifierRow[]>([
    { id: 'ident-init-1', type: 'upi', value: '' },
  ]);

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
      setErrors((prev) => {
        const rest = { ...prev };
        delete rest.evidence;
        return rest;
      });
    }

    if (validItems.length > 0) {
      setEvidenceFiles((prev) => [...prev, ...validItems]);
    }
  };

  const handleRemoveFile = (fileId: string) => {
    setEvidenceFiles((prev) => {
      const target = prev.find((f) => f.id === fileId);
      if (target?.previewUrl) {
        URL.revokeObjectURL(target.previewUrl);
      }
      return prev.filter((f) => f.id !== fileId);
    });
  };

  // Repeatable identifier handlers
  const handleAddIdentifier = () => {
    if (identifiers.length >= 8) {
      setErrors((prev) => ({ ...prev, suspectIdentifiers: 'Maximum of 8 suspect identifiers allowed.' }));
      return;
    }
    const nextType: IndicatorType = identifiers.length === 1 ? 'phone' : identifiers.length === 2 ? 'url' : 'email';
    setIdentifiers((prev) => [
      ...prev,
      { id: `ident-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`, type: nextType, value: '' },
    ]);
  };

  const handleRemoveIdentifier = (id: string) => {
    if (identifiers.length <= 1) return;
    setIdentifiers((prev) => prev.filter((item) => item.id !== id));
  };

  const handleUpdateIdentifierType = (id: string, type: IndicatorType) => {
    setIdentifiers((prev) =>
      prev.map((item) => (item.id === id ? { ...item, type } : item))
    );
  };

  const handleUpdateIdentifierValue = (id: string, value: string) => {
    setIdentifiers((prev) =>
      prev.map((item) => (item.id === id ? { ...item, value } : item))
    );
    if (errors.suspectIdentifiers) {
      setErrors((prev) => {
        const next = { ...prev };
        delete next.suspectIdentifiers;
        return next;
      });
    }
  };

  const getPlaceholderForType = (type: IndicatorType): string => {
    switch (type) {
      case 'upi':
        return 'e.g. merchant.pay@okaxis or scammer@upi';
      case 'phone':
        return 'e.g. +91 98765 43210 or 9876543210';
      case 'url':
        return 'e.g. https://secure-login-portal.site/verify or scamdomain.com';
      case 'email':
        return 'e.g. support@fraudulent-domain.com';
    }
  };

  const validate = (): boolean => {
    const errs: FormErrors = {};

    if (!formData.category) {
      errs.category = 'Please select a scam category.';
    }

    if (!formData.incidentDate) {
      errs.incidentDate = 'Date of incident is required.';
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

    // Validate suspect identifiers
    const filledIdentifiers = identifiers.map((i) => ({ ...i, value: i.value.trim() })).filter((i) => i.value.length > 0);
    if (filledIdentifiers.length === 0) {
      errs.suspectIdentifiers = 'At least one suspect identifier (Phone, UPI, URL, or Email) is required.';
    } else {
      // Validate individual values
      for (const item of filledIdentifiers) {
        if (item.type === 'upi' && !item.value.includes('@')) {
          errs.suspectIdentifiers = `Invalid UPI ID "${item.value}". UPI ID must contain an "@" symbol (e.g. scammer@okaxis).`;
          break;
        }
        if (item.type === 'phone') {
          const digits = item.value.replace(/\D/g, '');
          if (digits.length < 8) {
            errs.suspectIdentifiers = `Invalid Phone Number "${item.value}". Must contain at least 8 digits.`;
            break;
          }
        }
        if (item.type === 'email') {
          const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
          if (!emailRegex.test(item.value)) {
            errs.suspectIdentifiers = `Invalid Email Address "${item.value}". Please provide a valid email format.`;
            break;
          }
        }
        if (item.type === 'url') {
          if (item.value.length < 4 || (!item.value.includes('.') && !item.value.includes('/'))) {
            errs.suspectIdentifiers = `Invalid Website / URL "${item.value}". Please provide a valid URL or domain.`;
            break;
          }
        }
      }

      // Check duplicates
      if (!errs.suspectIdentifiers) {
        const seen = new Set<string>();
        for (const item of filledIdentifiers) {
          const normalized = normalizeIndicator(item.value, item.type);
          const key = `${item.type}:${normalized}`;
          if (seen.has(key)) {
            errs.suspectIdentifiers = `Duplicate suspect identifier detected: "${item.value}".`;
            break;
          }
          seen.add(key);
        }
      }
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

      // Construct normalized suspect identifiers array
      const filledIdentifiers = identifiers
        .map((i) => ({ ...i, value: i.value.trim() }))
        .filter((i) => i.value.length > 0);

      const parsedSuspectIdentifiers: SuspectIdentifier[] = filledIdentifiers.map((item) => ({
        id: item.id,
        type: item.type,
        value: item.value,
        normalized: normalizeIndicator(item.value, item.type),
      }));

      // Backward compatible summary string
      const suspectContactSummary = parsedSuspectIdentifiers
        .map((i) => `[${i.type.toUpperCase()}] ${i.value}`)
        .join(', ');

      const newReport: ScamReport = {
        id: `rep-${Date.now()}`,
        referenceId: newRefId,
        category: formData.category as ScamCategory,
        incidentDate: formData.incidentDate,
        reportedDate,
        amountLost: Number(formData.amountLost) || 0,
        transactionId: formData.transactionId.trim() || undefined,
        suspectContact: suspectContactSummary,
        suspectIdentifiers: parsedSuspectIdentifiers,
        platform: formData.platform.trim(),
        description: formData.description.trim(),
        status: 'Submitted',
        evidenceFiles: associatedEvidence,
        statusTimeline: {
          submittedAt: `${reportedDate} ${now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`,
          remarks: `Report registered with ${associatedEvidence.length} supporting evidence file(s) and ${parsedSuspectIdentifiers.length} suspect identifier(s) in frontend session.`,
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

        {/* Suspect Identifiers Summary */}
        {submittedReport.suspectIdentifiers && submittedReport.suspectIdentifiers.length > 0 && (
          <div className="mb-6 p-4 rounded-lg bg-slate-50 border border-slate-200 text-left text-xs">
            <div className="font-semibold text-slate-700 mb-2 flex items-center justify-between">
              <span>Attached Suspect Identifiers ({submittedReport.suspectIdentifiers.length}):</span>
              <span className="text-[10px] text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200 font-bold">
                Linked to Intelligence
              </span>
            </div>
            <div className="flex flex-wrap gap-2">
              {submittedReport.suspectIdentifiers.map((ident, idx) => (
                <span
                  key={idx}
                  className="inline-flex items-center space-x-1.5 px-2.5 py-1 rounded bg-white border border-slate-200 text-slate-700 font-mono"
                >
                  <span className="text-[10px] uppercase font-bold text-blue-700 px-1 py-0.2 bg-blue-50 rounded">
                    {ident.type}
                  </span>
                  <span>{ident.value}</span>
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Evidence files summary */}
        {submittedReport.evidenceFiles.length > 0 && (
          <div className="mb-6 p-4 rounded-lg bg-blue-50/60 border border-blue-200 text-left text-xs">
            <div className="font-semibold text-blue-900 mb-2 flex items-center justify-between">
              <span>Attached Evidence Files ({submittedReport.evidenceFiles.length}):</span>
              <span className="text-[10px] text-blue-700 bg-blue-100 px-2 py-0.5 rounded-full">Stored in Session</span>
            </div>
            <ul className="space-y-1.5 max-h-36 overflow-y-auto pr-1">
              {submittedReport.evidenceFiles.map((f) => (
                <li key={f.id} className="flex items-center justify-between bg-white px-3 py-1.5 rounded border border-blue-100 text-slate-700">
                  <span className="font-medium truncate max-w-xs">{f.name}</span>
                  <span className="text-slate-400 text-[11px] font-mono shrink-0 ml-2">
                    {formatFileSize(f.size)}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        )}

        <div className="bg-slate-50 rounded-lg p-4 text-xs text-slate-500 mb-6 text-left border border-slate-200 space-y-1">
          <p className="font-semibold text-slate-700">Next Steps & Session Persistence:</p>
          <p>• Your incident report is immediately visible under the <strong>My Reports</strong> tab.</p>
          <p>• All attached files are registered in the <strong>Evidence Repository</strong> linked to reference <span className="font-mono text-blue-600 font-semibold">{submittedReport.referenceId}</span>.</p>
          <p>• Suspect indicators are cross-analyzed in the <strong>Fraud Intelligence Engine</strong>.</p>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
          <button
            type="button"
            onClick={() => {
              setSubmittedReport(null);
              setFormData({
                category: '',
                incidentDate: '',
                amountLost: '',
                transactionId: '',
                platform: '',
                description: '',
              });
              setIdentifiers([{ id: 'ident-init-1', type: 'upi', value: '' }]);
              setEvidenceFiles([]);
            }}
            className="w-full sm:w-auto px-5 py-2.5 rounded-lg border border-slate-300 hover:bg-slate-50 text-slate-700 text-sm font-semibold transition-colors"
          >
            Submit Another Complaint
          </button>
          <button
            type="button"
            onClick={onCancel}
            className="w-full sm:w-auto px-6 py-2.5 rounded-lg bg-blue-700 hover:bg-blue-800 text-white text-sm font-semibold shadow-xs transition-colors"
          >
            View in My Reports →
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl border border-slate-200/90 shadow-2xs overflow-hidden max-w-4xl mx-auto">
      {/* Header */}
      <div className="p-6 border-b border-slate-100 bg-linear-to-r from-blue-900 to-indigo-950 text-white">
        <div className="flex items-center space-x-2 text-blue-300 text-xs font-bold uppercase tracking-wider mb-1">
          <span className="w-2 h-2 rounded-full bg-blue-400"></span>
          <span>Incident Submission Portal</span>
        </div>
        <h2 className="text-xl font-extrabold tracking-tight">Report a Cyber Incident / Online Scam</h2>
        <p className="text-xs text-blue-200/80 mt-1">
          Provide complete incident details, repeatable suspect identifiers (Phone, UPI, URL, Email), and supporting evidence.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="p-6 sm:p-8 space-y-6">
        {/* Scam Category */}
        <div>
          <label htmlFor="scam-category" className="block text-xs font-semibold text-slate-700 mb-1.5">
            Category of Cyber Scam <span className="text-rose-500">*</span>
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
            <option value="">-- Select Scam Category --</option>
            {categories.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
          {errors.category && <p className="text-xs text-rose-500 mt-1">{errors.category}</p>}
        </div>

        {/* 2-Column Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
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

          {/* Platform Used */}
          <div>
            <label htmlFor="platform" className="block text-xs font-semibold text-slate-700 mb-1.5">
              Platform / Medium Used <span className="text-rose-500">*</span>
            </label>
            <input
              id="platform"
              type="text"
              placeholder="e.g. WhatsApp, Telegram, Google Pay, Instagram, Chrome"
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

        {/* STRUCTURED REPEATABLE SUSPECT IDENTIFIERS SECTION */}
        <div className="p-4 sm:p-5 rounded-xl bg-slate-50 border border-slate-200/90 space-y-3">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
            <div>
              <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider">
                Suspect Identifiers (Phone, UPI, URL, Email) <span className="text-rose-500">*</span>
              </label>
              <p className="text-[11px] text-slate-500">
                Add each identifier used by the scammer. Multiple entries allow multi-point fraud link analysis.
              </p>
            </div>
            <button
              type="button"
              onClick={handleAddIdentifier}
              disabled={identifiers.length >= 8}
              className="inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-blue-50 text-blue-700 hover:bg-blue-100 border border-blue-200 text-xs font-bold self-start transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <span>+ Add Identifier</span>
            </button>
          </div>

          <div className="space-y-2.5 pt-1">
            {identifiers.map((item) => (
              <div
                key={item.id}
                className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 p-2.5 bg-white rounded-lg border border-slate-200 shadow-2xs"
              >
                {/* Identifier Type Select */}
                <div className="w-full sm:w-44 shrink-0">
                  <select
                    value={item.type}
                    onChange={(e) => handleUpdateIdentifierType(item.id, e.target.value as IndicatorType)}
                    className="w-full px-2.5 py-2 text-xs font-semibold rounded border border-slate-300 bg-slate-50 focus:outline-none focus:border-blue-600 focus:bg-white"
                  >
                    <option value="upi">UPI ID / VPA</option>
                    <option value="phone">Phone Number</option>
                    <option value="url">Website / URL</option>
                    <option value="email">Email Address</option>
                  </select>
                </div>

                {/* Identifier Value Input */}
                <div className="flex-1">
                  <input
                    type="text"
                    value={item.value}
                    onChange={(e) => handleUpdateIdentifierValue(item.id, e.target.value)}
                    placeholder={getPlaceholderForType(item.type)}
                    className="w-full px-3 py-2 text-xs font-mono rounded border border-slate-300 focus:outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-100"
                  />
                </div>

                {/* Remove button */}
                <div className="flex items-center justify-end">
                  {identifiers.length > 1 ? (
                    <button
                      type="button"
                      onClick={() => handleRemoveIdentifier(item.id)}
                      className="px-2.5 py-2 text-xs text-rose-600 hover:text-rose-800 hover:bg-rose-50 rounded font-semibold transition-colors"
                      title="Remove identifier"
                    >
                      ✕ Remove
                    </button>
                  ) : (
                    <span className="text-[10px] text-slate-400 px-2 py-1 italic">Required</span>
                  )}
                </div>
              </div>
            ))}
          </div>

          {errors.suspectIdentifiers && (
            <p className="text-xs text-rose-500 font-medium pt-1">{errors.suspectIdentifiers}</p>
          )}

          <div className="text-[11px] text-slate-500 bg-white p-2.5 rounded-lg border border-slate-200/80 flex items-center justify-between">
            <span>
              Configured: <strong>{identifiers.filter((i) => i.value.trim().length > 0).length}</strong> identifier(s) • Max: 8
            </span>
            <span className="text-slate-400">All indicators are automatically normalized for pattern correlation</span>
          </div>
        </div>

        {/* Detailed Description */}
        <div>
          <label htmlFor="description" className="block text-xs font-semibold text-slate-700 mb-1.5">
            Detailed Incident Description <span className="text-rose-500">*</span>
          </label>
          <textarea
            id="description"
            rows={4}
            placeholder="Describe the step-by-step chronology of what occurred: how you were contacted, what instructions were given, what payment requests were made, and how the fraud occurred..."
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
              <p className="text-[11px] text-slate-400">Minimum 30 characters required.</p>
            )}
            <span className="text-[11px] text-slate-400">{formData.description.length} characters</span>
          </div>
        </div>

        {/* ========================================================================= */}
        {/* ATTACH SUPPORTING EVIDENCE SECTION */}
        {/* ========================================================================= */}
        <div className="pt-2 border-t border-slate-100">
          <div className="flex items-center justify-between mb-2">
            <div>
              <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider">
                Attach Supporting Evidence <span className="text-slate-400 font-normal lowercase">(optional)</span>
              </label>
              <p className="text-[11px] text-slate-500">
                Upload screenshots, payment receipts, bank SMS captures, PDF statements, or chat transcripts (Max 10 MB per file).
              </p>
            </div>
            {evidenceFiles.length > 0 && (
              <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-blue-50 text-blue-700 border border-blue-200">
                {evidenceFiles.length} file{evidenceFiles.length > 1 ? 's' : ''} attached
              </span>
            )}
          </div>

          {/* Hidden File Input */}
          <input
            ref={fileInputRef}
            type="file"
            multiple
            accept="image/png,image/jpeg,image/webp,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
            onChange={(e) => handleProcessFiles(e.target.files)}
            className="hidden"
          />

          {/* Drag & Drop Dropzone */}
          <div
            onDragOver={(e) => {
              e.preventDefault();
              setIsDragOver(true);
            }}
            onDragLeave={() => setIsDragOver(false)}
            onDrop={(e) => {
              e.preventDefault();
              setIsDragOver(false);
              handleProcessFiles(e.dataTransfer.files);
            }}
            onClick={() => fileInputRef.current?.click()}
            className={`border-2 border-dashed rounded-xl p-6 text-center cursor-pointer transition-colors ${
              isDragOver
                ? 'border-blue-500 bg-blue-50/70'
                : 'border-slate-300 hover:border-blue-400 bg-slate-50/50 hover:bg-slate-50'
            }`}
          >
            <div className="w-12 h-12 rounded-full bg-blue-100 text-blue-600 mx-auto flex items-center justify-center mb-2">
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                />
              </svg>
            </div>
            <p className="text-xs font-semibold text-slate-800">
              Drag and drop evidence files here, or <span className="text-blue-700 underline">browse files</span>
            </p>
            <p className="text-[11px] text-slate-400 mt-1">
              Supports PNG, JPG, WEBP, PDF, DOC, DOCX • Up to 10 MB per file
            </p>
          </div>

          {/* Evidence Error */}
          {errors.evidence && <p className="text-xs text-rose-500 mt-1.5">{errors.evidence}</p>}

          {/* Attached Files List Preview */}
          {evidenceFiles.length > 0 && (
            <div className="mt-4 space-y-2">
              <span className="text-xs font-semibold text-slate-700 block">Selected Attachments:</span>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {evidenceFiles.map((file) => (
                  <div
                    key={file.id}
                    className="flex items-center justify-between p-2.5 rounded-lg border border-slate-200 bg-white shadow-2xs hover:border-slate-300 transition-colors"
                  >
                    <div className="flex items-center space-x-3 overflow-hidden">
                      {/* Thumbnail / Icon */}
                      {file.previewUrl ? (
                        <img
                          src={file.previewUrl}
                          alt={file.name}
                          className="w-10 h-10 rounded object-cover border border-slate-200 shrink-0 cursor-pointer"
                          onClick={() => setPreviewModalFile(file)}
                        />
                      ) : (
                        <div className="w-10 h-10 rounded bg-slate-100 border border-slate-200 flex items-center justify-center text-slate-500 shrink-0 font-mono text-[10px] font-bold">
                          {file.type.includes('pdf') ? 'PDF' : 'DOC'}
                        </div>
                      )}

                      <div className="overflow-hidden">
                        <p className="text-xs font-medium text-slate-800 truncate" title={file.name}>
                          {file.name}
                        </p>
                        <p className="text-[11px] text-slate-400 font-mono">
                          {formatFileSize(file.size)} • {file.type.split('/')[1]?.toUpperCase() || 'FILE'}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center space-x-1 shrink-0 ml-2">
                      {file.previewUrl && (
                        <button
                          type="button"
                          onClick={() => setPreviewModalFile(file)}
                          className="p-1 text-slate-400 hover:text-blue-600 rounded text-xs"
                          title="Preview image"
                        >
                          👁
                        </button>
                      )}
                      <button
                        type="button"
                        onClick={() => handleRemoveFile(file.id)}
                        className="p-1 text-slate-400 hover:text-rose-600 rounded text-xs font-bold"
                        title="Remove file"
                      >
                        ✕
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Modal for viewing image preview */}
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

        {/* Form Actions */}
        <div className="pt-4 border-t border-slate-200 flex items-center justify-between">
          <button
            type="button"
            onClick={onCancel}
            className="px-5 py-2.5 text-xs font-semibold text-slate-600 hover:text-slate-800 transition-colors"
          >
            Cancel
          </button>
          <div className="flex items-center space-x-3">
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-6 py-2.5 rounded-lg bg-blue-700 hover:bg-blue-800 text-white text-xs font-bold shadow-xs transition-colors flex items-center space-x-2 disabled:opacity-50"
            >
              {isSubmitting ? (
                <>
                  <svg
                    className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    />
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    />
                  </svg>
                  <span>Registering Incident...</span>
                </>
              ) : (
                <span>Submit Complaint & Evidence →</span>
              )}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}
