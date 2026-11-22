import type { InvestigatorCase } from '../types/investigator';

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

const createMockPdfDataUrl = (title: string, category: string, refId: string) => {
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

export const INITIAL_INVESTIGATOR_CASES: InvestigatorCase[] = [
  {
    id: 'case-01',
    referenceId: 'CT-20261002-1101',
    assignedInvestigatorId: 'CYB-IN-20481',
    victimName: 'Citizen A. Sharma',
    category: 'UPI Fraud',
    reportedDate: '2026-10-02',
    amountLost: 32000,
    priority: 'High',
    status: 'Under Investigation',
    assignedOfficer: 'Insp. R. Deshmukh (CYB-IN-20481)',
    suspectIdentifiers: [
      { type: 'upi', value: 'quickpay.merchant88@okaxis', normalized: 'quickpay.merchant88@okaxis' },
      { type: 'phone', value: '+91 98230 11223', normalized: '9823011223' },
      { type: 'email', value: 'support@quickpay-portal.online', normalized: 'support@quickpay-portal.online' },
    ],
    transactionId: 'UPI/261002891234/PAY',
    platform: 'Google Pay',
    description: 'Victim asked to scan dynamic QR code for festival shopping cashback, draining bank account.',
    evidenceFiles: [
      {
        id: 'ev-inv-1',
        name: 'gpay_qr_scan_receipt.png',
        size: 384000,
        type: 'image/png',
        previewUrl: createMockImageSvg('gpay_qr_scan_receipt.png', 'UPI Fraud', 'CT-20261002-1101', '#1d4ed8'),
        selectedAt: '10:30 AM',
        reportRef: 'CT-20261002-1101',
        scamCategory: 'UPI Fraud',
      },
    ],
    timeline: [
      { stage: 'Submitted', timestamp: '2026-10-02 10:30 AM', note: 'Case registered by citizen with initial QR evidence.', actor: 'Citizen Victim (Initial Filing)' },
      { stage: 'Under Review', timestamp: '2026-10-03 02:15 PM', note: 'Assigned to Cyber Crime Cell, Unit 4.', actor: 'System Allocation Officer' },
      { stage: 'Under Investigation', timestamp: '2026-10-05 11:00 AM', note: 'UPI VPA quickpay.merchant88@okaxis issued nodal bank freeze notice.', actor: 'Insp. R. Deshmukh (CYB-IN-20481)' },
    ],
  },
  {
    id: 'case-02',
    referenceId: 'CT-20261011-1103',
    assignedInvestigatorId: 'CYB-IN-20481',
    victimName: 'Citizen K. Patel',
    category: 'Fake Investment',
    reportedDate: '2026-10-11',
    amountLost: 85000,
    priority: 'Critical',
    status: 'Evidence Verification',
    assignedOfficer: 'Insp. R. Deshmukh (CYB-IN-20481)',
    suspectIdentifiers: [
      { type: 'upi', value: 'quickpay.merchant88@okaxis', normalized: 'quickpay.merchant88@okaxis' },
      { type: 'email', value: 'support@quickpay-portal.online', normalized: 'support@quickpay-portal.online' },
      { type: 'url', value: 'https://pro-wealth-india.online', normalized: 'pro-wealth-india.online' },
    ],
    transactionId: 'IMPS/6101178239/INV',
    platform: 'Telegram & Web',
    description: 'Deposited funds for cryptocurrency portfolio arbitrage; withdrawal frozen demanding additional deposit.',
    evidenceFiles: [
      {
        id: 'ev-inv-2',
        name: 'crypto_deposit_slip.pdf',
        size: 785000,
        type: 'application/pdf',
        previewUrl: createMockPdfDataUrl('Crypto Arbitrage Transfer Slip', 'Fake Investment', 'CT-20261011-1103'),
        selectedAt: '03:45 PM',
        reportRef: 'CT-20261011-1103',
        scamCategory: 'Fake Investment',
      },
      {
        id: 'ev-inv-3',
        name: 'telegram_group_chat_log.png',
        size: 512000,
        type: 'image/png',
        previewUrl: createMockImageSvg('telegram_group_chat_log.png', 'Fake Investment', 'CT-20261011-1103', '#4338ca'),
        selectedAt: '03:48 PM',
        reportRef: 'CT-20261011-1103',
        scamCategory: 'Fake Investment',
      },
    ],
    timeline: [
      { stage: 'Submitted', timestamp: '2026-10-11 03:50 PM', note: 'Victim reported financial loss of Rs 85,000 via IMPS.', actor: 'Citizen Victim (Initial Filing)' },
      { stage: 'Under Review', timestamp: '2026-10-12 09:30 AM', note: 'Cross-referenced with Pattern A syndicate (quickpay.merchant88@okaxis).', actor: 'Insp. R. Deshmukh (CYB-IN-20481)' },
      { stage: 'Evidence Verification', timestamp: '2026-10-14 04:00 PM', note: 'Awaiting beneficiary bank account verification from Axis Bank nodal desk.', actor: 'Insp. R. Deshmukh (CYB-IN-20481)' },
    ],
  },
  {
    id: 'case-03',
    referenceId: 'CT-20261015-1049',
    assignedInvestigatorId: 'CYB-IN-20481',
    victimName: 'Citizen V. Menon',
    category: 'Phishing',
    reportedDate: '2026-10-15',
    amountLost: 15500,
    priority: 'Medium',
    status: 'Resolved',
    assignedOfficer: 'Insp. R. Deshmukh (CYB-IN-20481)',
    suspectIdentifiers: [
      { type: 'url', value: 'https://sbi-kyc-verify-alert.top', normalized: 'sbi-kyc-verify-alert.top' },
      { type: 'phone', value: '+91 91234 56789', normalized: '9123456789' },
    ],
    transactionId: 'TXN-9981240192',
    platform: 'SMS / Mobile Web',
    description: 'Received SMS warning SBI Netbanking KYC suspension. Clicked link and entered net banking credentials. OTP intercepted and money transferred immediately.',
    evidenceFiles: [
      {
        id: 'ev-inv-4',
        name: 'phishing_sms_capture.jpg',
        size: 215000,
        type: 'image/jpeg',
        previewUrl: createMockImageSvg('phishing_sms_capture.jpg', 'Phishing', 'CT-20261015-1049', '#b91c1c'),
        selectedAt: '01:05 PM',
        reportRef: 'CT-20261015-1049',
        scamCategory: 'Phishing',
      },
    ],
    timeline: [
      { stage: 'Submitted', timestamp: '2026-10-15 01:10 PM', note: 'Citizen reported credential interception via spoofed portal.', actor: 'Citizen Victim (Initial Filing)' },
      { stage: 'Under Investigation', timestamp: '2026-10-18 03:00 PM', note: 'CERT-In notice served; domain taken down.', actor: 'Insp. R. Deshmukh (CYB-IN-20481)' },
      { stage: 'Resolved', timestamp: '2026-10-24 05:45 PM', note: 'Partial amount Rs 15,500 frozen at gateway escrow and refunded.', actor: 'Insp. R. Deshmukh (CYB-IN-20481)' },
    ],
  },
  {
    id: 'case-04',
    referenceId: 'CT-20260918-2201',
    assignedInvestigatorId: 'CYB-IN-20481',
    victimName: 'Citizen S. Kulkarni',
    category: 'Job Scam',
    reportedDate: '2026-09-18',
    amountLost: 12000,
    priority: 'High',
    status: 'Under Investigation',
    assignedOfficer: 'Insp. R. Deshmukh (CYB-IN-20481)',
    suspectIdentifiers: [
      { type: 'phone', value: '+91 98765 01234', normalized: '9876501234' },
      { type: 'email', value: 'careers@india-parttime-global.vip', normalized: 'careers@india-parttime-global.vip' },
    ],
    transactionId: 'UPI/260918339102/JOB',
    platform: 'WhatsApp',
    description: 'Work-from-home YouTube video rating tasks. Requested registration fee to unlock higher earning tier.',
    evidenceFiles: [
      {
        id: 'ev-inv-5',
        name: 'telegram_job_offer_screenshot.png',
        size: 432000,
        type: 'image/png',
        previewUrl: createMockImageSvg('telegram_job_offer_screenshot.png', 'Job Scam', 'CT-20260918-2201', '#4f46e5'),
        selectedAt: '11:15 AM',
        reportRef: 'CT-20260918-2201',
        scamCategory: 'Job Scam',
      },
    ],
    timeline: [
      { stage: 'Submitted', timestamp: '2026-09-18 11:20 AM', note: 'Victim filed complaint with WhatsApp contact and payment screenshot.', actor: 'Citizen Victim (Initial Filing)' },
      { stage: 'Under Review', timestamp: '2026-09-19 09:10 AM', note: 'Phone +91 98765 01234 linked to 4 existing fraud complaints across states.', actor: 'System Allocation Officer' },
      { stage: 'Under Investigation', timestamp: '2026-09-21 02:45 PM', note: 'Telecom Service Provider requisition sent for subscriber CDR / Tower data.', actor: 'Insp. R. Deshmukh (CYB-IN-20481)' },
    ],
  },
  {
    id: 'case-05',
    referenceId: 'CT-20260925-2202',
    assignedInvestigatorId: 'CYB-IN-20481',
    victimName: 'Citizen T. Banerjee',
    category: 'Job Scam',
    reportedDate: '2026-09-25',
    amountLost: 24000,
    priority: 'High',
    status: 'Under Review',
    assignedOfficer: 'Insp. R. Deshmukh (CYB-IN-20481)',
    suspectIdentifiers: [
      { type: 'phone', value: '+91 98765 01234', normalized: '9876501234' },
      { type: 'upi', value: 'taskhr.payouts@ybl', normalized: 'taskhr.payouts@ybl' },
    ],
    transactionId: 'UPI/260925998811/JOB',
    platform: 'Telegram',
    description: 'Hotel review rating contract scam; victim completed tasks but payout required progressive prepayment.',
    evidenceFiles: [
      {
        id: 'ev-inv-6',
        name: 'upi_payment_confirmation.pdf',
        size: 340000,
        type: 'application/pdf',
        previewUrl: createMockPdfDataUrl('UPI Payment Confirmation Rs 24,000', 'Job Scam', 'CT-20260925-2202'),
        selectedAt: '02:00 PM',
        reportRef: 'CT-20260925-2202',
        scamCategory: 'Job Scam',
      },
    ],
    timeline: [
      { stage: 'Submitted', timestamp: '2026-09-25 02:05 PM', note: 'Complaint logged. Phone number coincides with Pattern B syndicate.', actor: 'Citizen Victim (Initial Filing)' },
      { stage: 'Under Review', timestamp: '2026-09-26 10:00 AM', note: 'Under initial review by cyber officer.', actor: 'Insp. R. Deshmukh (CYB-IN-20481)' },
    ],
  },
  {
    id: 'case-06',
    referenceId: 'CT-20261012-3301',
    assignedInvestigatorId: 'CYB-IN-20481',
    victimName: 'Citizen N. Choudhury',
    category: 'Phishing',
    reportedDate: '2026-10-12',
    amountLost: 62000,
    priority: 'Critical',
    status: 'Under Investigation',
    assignedOfficer: 'Insp. R. Deshmukh (CYB-IN-20481)',
    suspectIdentifiers: [
      { type: 'url', value: 'https://secure-sbi-kyc-update.xyz', normalized: 'secure-sbi-kyc-update.xyz' },
      { type: 'phone', value: '+91 91234 56789', normalized: '9123456789' },
    ],
    transactionId: 'TXN-8841209341',
    platform: 'SMS Phishing',
    description: 'SMS alert warned NetBanking will freeze within 24h. Clicked spoofed link and entered internet banking credentials.',
    evidenceFiles: [
      {
        id: 'ev-inv-7',
        name: 'malicious_apk_log.txt',
        size: 128000,
        type: 'text/plain',
        selectedAt: '05:30 PM',
        reportRef: 'CT-20261012-3301',
        scamCategory: 'Phishing',
      },
    ],
    timeline: [
      { stage: 'Submitted', timestamp: '2026-10-12 05:35 PM', note: 'High value breach reported. Immediate account hold advisory sent.', actor: 'Citizen Victim (Initial Filing)' },
      { stage: 'Under Investigation', timestamp: '2026-10-13 11:30 AM', note: 'Malicious domain added to national cyber safety blocklist.', actor: 'Insp. R. Deshmukh (CYB-IN-20481)' },
    ],
  },
  {
    id: 'case-07',
    referenceId: 'CT-20261102-8491',
    assignedInvestigatorId: 'CYB-IN-20481',
    victimName: 'Citizen N. Sen',
    category: 'UPI Fraud',
    reportedDate: '2026-11-02',
    amountLost: 45000,
    priority: 'Medium',
    status: 'Under Investigation',
    assignedOfficer: 'Insp. R. Deshmukh (CYB-IN-20481)',
    suspectIdentifiers: [
      { type: 'phone', value: '+91 98765 43210', normalized: '9876543210' },
      { type: 'upi', value: 'cashback.rewards99@okaxis', normalized: 'cashback.rewards99@okaxis' },
    ],
    transactionId: 'UPI/261101982341/PAY',
    platform: 'Google Pay / Telegram',
    description: 'Received a call claiming reward cashback on Google Pay. The caller instructed to accept a collect request on UPI app, resulting in Rs 45,000 debited without consent.',
    evidenceFiles: [
      {
        id: 'ev-inv-8',
        name: 'gpay_debit_notification.png',
        size: 348200,
        type: 'image/png',
        previewUrl: createMockImageSvg('gpay_debit_notification.png', 'UPI Fraud', 'CT-20261102-8491', '#1d4ed8'),
        selectedAt: '10:14 AM',
        reportRef: 'CT-20261102-8491',
        scamCategory: 'UPI Fraud',
      },
    ],
    timeline: [
      { stage: 'Submitted', timestamp: '2026-11-02 10:15 AM', note: 'Report lodged with debit notification screenshot.', actor: 'Citizen Victim (Initial Filing)' },
      { stage: 'Under Review', timestamp: '2026-11-03 02:40 PM', note: 'Review completed. Assigned to Inspector Deshmukh.', actor: 'System Allocation Officer' },
      { stage: 'Under Investigation', timestamp: '2026-11-05 11:20 AM', note: 'Axis Bank nodal desk contacted for transaction recall.', actor: 'Insp. R. Deshmukh (CYB-IN-20481)' },
    ],
  },
  {
    id: 'case-08',
    referenceId: 'CT-20261017-1104',
    assignedInvestigatorId: 'CYB-IN-20481',
    victimName: 'Citizen M. Iyer',
    category: 'Online Shopping Fraud',
    reportedDate: '2026-10-17',
    amountLost: 18500,
    priority: 'Low',
    status: 'Submitted',
    assignedOfficer: 'Insp. R. Deshmukh (CYB-IN-20481)',
    suspectIdentifiers: [
      { type: 'upi', value: 'quickpay.merchant88@okaxis', normalized: 'quickpay.merchant88@okaxis' },
      { type: 'url', value: 'https://flipdeals-clearance-outlet.vip', normalized: 'flipdeals-clearance-outlet.vip' },
    ],
    transactionId: 'UPI/261017771234/SHOP',
    platform: 'Instagram Store',
    description: 'Fake electronics discount store took UPI advance transfer and terminated customer service chat.',
    evidenceFiles: [
      {
        id: 'ev-inv-9',
        name: 'instagram_chat_receipt.png',
        size: 290000,
        type: 'image/png',
        previewUrl: createMockImageSvg('instagram_chat_receipt.png', 'Online Shopping Fraud', 'CT-20261017-1104', '#059669'),
        selectedAt: '04:10 PM',
        reportRef: 'CT-20261017-1104',
        scamCategory: 'Online Shopping Fraud',
      },
    ],
    timeline: [
      { stage: 'Submitted', timestamp: '2026-10-17 04:15 PM', note: 'Case lodged. Awaiting initial officer allocation.', actor: 'Citizen Victim (Initial Filing)' },
    ],
  },
];
