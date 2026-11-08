import type { ScamReport } from '../types/dashboard';

// Helper function to create an inline SVG Data URL for realistic mock previews
const createMockImageSvg = (label: string, category: string, refId: string, color = '#1d4ed8') => {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="800" height="600" viewBox="0 0 800 600">
    <rect width="800" height="600" fill="#f8fafc"/>
    <rect x="20" y="20" width="760" height="560" rx="12" fill="#ffffff" stroke="#cbd5e1" stroke-width="2"/>
    <rect x="20" y="20" width="760" height="64" rx="12" fill="${color}"/>
    <text x="40" y="58" font-family="sans-serif" font-size="20" font-weight="bold" fill="#ffffff">CYBERTRACE INDIA • EVIDENCE RECORD</text>
    <text x="40" y="120" font-family="monospace" font-size="14" font-weight="bold" fill="#64748b">CASE REF: ${refId}</text>
    <text x="40" y="150" font-family="sans-serif" font-size="16" font-weight="bold" fill="#0f172a">CATEGORY: ${category}</text>
    <text x="40" y="180" font-family="sans-serif" font-size="14" fill="#475569">FILE: ${label}</text>
    <rect x="40" y="210" width="720" height="330" rx="8" fill="#f1f5f9" stroke="#e2e8f0"/>
    <circle cx="400" cy="330" r="48" fill="#e2e8f0"/>
    <path d="M376 330 L400 306 L424 330 M400 306 L400 360" stroke="${color}" stroke-width="4" stroke-linecap="round" stroke-linejoin="round" fill="none"/>
    <text x="400" y="420" font-family="sans-serif" font-size="16" font-weight="bold" fill="#334155" text-anchor="middle">${label}</text>
    <text x="400" y="445" font-family="sans-serif" font-size="12" fill="#64748b" text-anchor="middle">Official Case Attachment • Verified Evidence File</text>
  </svg>`;
  return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;
};

// Helper function to create an inline PDF Data URL for realistic mock PDF viewer preview
const createMockPdfDataUrl = (title: string, category: string, refId: string) => {
  // Minimal valid PDF standard binary representation
  const content = `BT /F1 18 Tf 50 720 Td (CYBERTRACE INDIA - OFFICIAL EVIDENCE RECORD) Tj 0 -30 Td /F1 12 Tf (Case Reference: ${refId}) Tj 0 -20 Td (Scam Type: ${category}) Tj 0 -20 Td (Document: ${title}) Tj 0 -40 Td (Status: Attached to Cyber Crime Complaint Dossier) Tj 0 -20 Td (Verified in Citizen Session) Tj ET`;
  const pdfString = `%PDF-1.4
1 0 obj <</Type /Catalog /Pages 2 0 R>> endobj
2 0 obj <</Type /Pages /Kids [3 0 R] /Count 1>> endobj
3 0 obj <</Type /Page /Parent 2 0 R /MediaBox [0 0 612 792] /Resources <</Font <</F1 4 0 R>>>> /Contents 5 0 R>> endobj
4 0 obj <</Type /Font /Subtype /Type1 /BaseFont /Helvetica>> endobj
5 0 obj <</Length ${content.length}>> stream
${content}
endstream endobj
xref
0 6
0000000000 65535 f 
0000000009 00000 n 
0000000056 00000 n 
0000000115 00000 n 
0000000244 00000 n 
0000000318 00000 n 
trailer <</Size 6 /Root 1 0 R>>
startxref
${400 + content.length}
%%EOF`;
  return `data:application/pdf;base64,${btoa(pdfString)}`;
};

export const INITIAL_MOCK_REPORTS: ScamReport[] = [
  {
    id: 'rep-1',
    referenceId: 'CT-20261102-8491',
    category: 'UPI Fraud',
    incidentDate: '2026-11-01',
    reportedDate: '2026-11-02',
    amountLost: 45000,
    transactionId: 'UPI/261101982341/PAY',
    suspectContact: '+91 98765 43210',
    suspectIdentifiers: [
      { type: 'phone', value: '+91 98765 43210', normalized: '9876543210' },
      { type: 'upi', value: 'cashback.rewards99@okaxis', normalized: 'cashback.rewards99@okaxis' },
    ],
    platform: 'Google Pay / Telegram',
    description: 'Received a call claiming reward cashback on Google Pay. The caller instructed to accept a collect request on UPI app, resulting in Rs 45,000 being debited without consent.',
    status: 'Under Investigation',
    evidenceFiles: [
      {
        id: 'ev-mock-1',
        name: 'gpay_debit_notification.png',
        size: 348200,
        type: 'image/png',
        previewUrl: createMockImageSvg('gpay_debit_notification.png', 'UPI Fraud', 'CT-20261102-8491', '#1d4ed8'),
        selectedAt: '10:14 AM',
        reportRef: 'CT-20261102-8491',
        scamCategory: 'UPI Fraud',
      },
      {
        id: 'ev-mock-2',
        name: 'telegram_chat_transcript.pdf',
        size: 1048576,
        type: 'application/pdf',
        previewUrl: createMockPdfDataUrl('Telegram Fraudulent Chat Log', 'UPI Fraud', 'CT-20261102-8491'),
        selectedAt: '10:15 AM',
        reportRef: 'CT-20261102-8491',
        scamCategory: 'UPI Fraud',
      },
    ],
    statusTimeline: {
      submittedAt: '2026-11-02 10:15 AM',
      underReviewAt: '2026-11-03 02:40 PM',
      underInvestigationAt: '2026-11-05 11:20 AM',
      remarks: 'Cyber Cell assigned officer; UPI handle flagged to bank nodal team.',
    },
  },
  {
    id: 'rep-2',
    referenceId: 'CT-20261028-3312',
    category: 'Fake Investment',
    incidentDate: '2026-10-25',
    reportedDate: '2026-10-28',
    amountLost: 120000,
    transactionId: 'IMPS/6102578912/INV',
    suspectContact: 'invest-support@pro-wealth-india.online',
    suspectIdentifiers: [
      { type: 'email', value: 'invest-support@pro-wealth-india.online', normalized: 'invest-support@pro-wealth-india.online' },
      { type: 'url', value: 'https://pro-wealth-india.online', normalized: 'pro-wealth-india.online' },
    ],
    platform: 'WhatsApp & Web Portal',
    description: 'Lured into a high-yield institutional stock trading WhatsApp group promising 30% weekly returns. Deposited funds through IMPS; website subsequently locked account and demanded additional tax deposit.',
    status: 'Under Review',
    evidenceFiles: [
      {
        id: 'ev-mock-3',
        name: 'bank_imps_transfer_receipt.pdf',
        size: 524288,
        type: 'application/pdf',
        previewUrl: createMockPdfDataUrl('Bank IMPS Transfer Slip Rs 1,20,000', 'Fake Investment', 'CT-20261028-3312'),
        selectedAt: '04:28 PM',
        reportRef: 'CT-20261028-3312',
        scamCategory: 'Fake Investment',
      },
    ],
    statusTimeline: {
      submittedAt: '2026-10-28 04:30 PM',
      underReviewAt: '2026-10-30 09:15 AM',
      remarks: 'Evidence documents and transaction slips verified. Case queuing for nodal bank freeze.',
    },
  },
  {
    id: 'rep-3',
    referenceId: 'CT-20261015-1049',
    category: 'Phishing',
    incidentDate: '2026-10-14',
    reportedDate: '2026-10-15',
    amountLost: 15500,
    transactionId: 'TXN-9981240192',
    suspectContact: 'https://sbi-kyc-verify-alert.top',
    suspectIdentifiers: [
      { type: 'url', value: 'https://sbi-kyc-verify-alert.top', normalized: 'sbi-kyc-verify-alert.top' },
      { type: 'phone', value: '+91 91234 56789', normalized: '9123456789' },
    ],
    platform: 'SMS / Mobile Web',
    description: 'Received SMS warning SBI Netbanking KYC suspension. Clicked link and entered net banking credentials. OTP intercepted and money transferred immediately.',
    status: 'Resolved',
    evidenceFiles: [
      {
        id: 'ev-mock-4',
        name: 'phishing_sms_screenshot.jpg',
        size: 215000,
        type: 'image/jpeg',
        previewUrl: createMockImageSvg('phishing_sms_screenshot.jpg', 'Phishing', 'CT-20261015-1049', '#b91c1c'),
        selectedAt: '01:05 PM',
        reportRef: 'CT-20261015-1049',
        scamCategory: 'Phishing',
      },
    ],
    statusTimeline: {
      submittedAt: '2026-10-15 01:10 PM',
      underReviewAt: '2026-10-16 10:00 AM',
      underInvestigationAt: '2026-10-18 03:00 PM',
      resolvedAt: '2026-10-24 05:45 PM',
      remarks: 'Phishing domain taken down by CERT-In; Rs 15,500 placed on hold at recipient gateway.',
    },
  },
  {
    id: 'rep-4',
    referenceId: 'CT-20260930-6720',
    category: 'Job Scam',
    incidentDate: '2026-09-29',
    reportedDate: '2026-09-30',
    amountLost: 8500,
    transactionId: 'UPI/260929443102/JOB',
    suspectContact: 'hr.recruit@workfromhome-flipkart.vip',
    suspectIdentifiers: [
      { type: 'email', value: 'hr.recruit@workfromhome-flipkart.vip', normalized: 'hr.recruit@workfromhome-flipkart.vip' },
      { type: 'phone', value: '+91 98765 01234', normalized: '9876501234' },
    ],
    platform: 'Telegram',
    description: 'Offered work-from-home product rating gig. After small initial payout, required prepaid security deposit to unlock VIP merchant tasks; contact stopped responding after final transfer.',
    status: 'Resolved',
    evidenceFiles: [
      {
        id: 'ev-mock-5',
        name: 'telegram_task_instructions.png',
        size: 412000,
        type: 'image/png',
        previewUrl: createMockImageSvg('telegram_task_instructions.png', 'Job Scam', 'CT-20260930-6720', '#4f46e5'),
        selectedAt: '06:10 PM',
        reportRef: 'CT-20260930-6720',
        scamCategory: 'Job Scam',
      },
    ],
    statusTimeline: {
      submittedAt: '2026-09-30 06:12 PM',
      underReviewAt: '2026-10-02 11:30 AM',
      underInvestigationAt: '2026-10-05 04:20 PM',
      resolvedAt: '2026-10-12 02:00 PM',
      remarks: 'Mule account frozen by cyber crime coordination centre (I4C).',
    },
  },
];
