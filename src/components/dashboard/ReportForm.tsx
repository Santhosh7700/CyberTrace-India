import { useState } from 'react';
import type { ScamCategory, ScamReport } from '../../types/dashboard';

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

  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submittedReport, setSubmittedReport] = useState<ScamReport | null>(null);

  const categories: ScamCategory[] = [
    'UPI Fraud',
    'Phishing',
    'Fake Investment',
    'Job Scam',
    'Online Shopping Fraud',
    'Social Media Scam',
    'Other',
  ];

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

    // Simulate mock validation & submission
    setTimeout(() => {
      const newRefId = generateReferenceId();
      const now = new Date();
      const reportedDate = now.toISOString().split('T')[0];

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
        statusTimeline: {
          submittedAt: `${reportedDate} ${now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`,
          remarks: 'Report registered in frontend memory session. Reference number issued.',
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
          Your complaint has been acknowledged in the frontend session. A tracking reference ID has been generated:
        </p>

        <div className="my-6 p-4 rounded-xl bg-slate-50 border border-slate-200 inline-block font-mono text-xl font-extrabold text-blue-700 tracking-wider">
          {submittedReport.referenceId}
        </div>

        <div className="bg-amber-50 border border-amber-200 rounded-lg p-3 text-xs text-amber-800 text-left mb-6">
          <strong>Notice:</strong> This is an in-memory frontend mock session. In production, this record would be routed to the Cyber Police State Nodal Hub via the Spring Boot API.
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
          <button
            onClick={() => {
              setSubmittedReport(null);
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
          Please provide accurate details of the fraudulent incident. All information entered remains in your secure browser session.
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
              'Submit Complaint & Generate Reference ID'
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
