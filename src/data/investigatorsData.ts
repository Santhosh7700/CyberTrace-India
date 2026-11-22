import type { DemoInvestigator, CaseAssignmentRecord } from '../types/allocation';
import type { InvestigatorCase } from '../types/investigator';
import { INITIAL_INVESTIGATOR_CASES } from './investigatorCases';

export const DEMO_INVESTIGATORS: DemoInvestigator[] = [
  {
    cyberId: 'CYB-IN-20481',
    badgeNumber: 'MH-CYB-0481',
    name: 'Insp. Rajesh Deshmukh',
    rank: 'Senior Cyber Forensic Inspector',
    unit: 'Cyber Crime Investigation Cell (Unit 4)',
    department: 'Financial & UPI Fraud Syndicate Unit',
    availability: 'Active Duty',
    avatarInitials: 'RD',
  },
  {
    cyberId: 'CYB-IN-10923',
    badgeNumber: 'DL-CYB-1923',
    name: 'Insp. Sunita Rao',
    rank: 'Lead Investigator — Phishing Intelligence',
    unit: 'Anti-Phishing & Malware Analysis Bureau',
    department: 'Domain Takedown & Credential Theft Wing',
    availability: 'Available',
    avatarInitials: 'SR',
  },
  {
    cyberId: 'CYB-IN-33104',
    badgeNumber: 'KA-CYB-3104',
    name: 'Insp. Vikram Malhotra',
    rank: 'Cyber Crime Analyst & Case Officer',
    unit: 'Online Employment & Investment Scam Squad',
    department: 'Telegram & Social Task Fraud Taskforce',
    availability: 'Available',
    avatarInitials: 'VM',
  },
  {
    cyberId: 'CYB-IN-44812',
    badgeNumber: 'TN-CYB-4812',
    name: 'Insp. Ananya Krishnan',
    rank: 'Digital Forensics Specialist',
    unit: 'E-Commerce & Digital Identity Verification',
    department: 'Merchant Gateway & Impersonation Desk',
    availability: 'Active Duty',
    avatarInitials: 'AK',
  },
];

// Inline mock data helpers
const createMockImageSvg = (label: string, category: string, refId: string, color = '#0284c7') => {
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
    <text x="400" y="420" font-family="sans-serif" font-size="16" font-weight="bold" fill="#334155" text-anchor="middle">${label}</text>
    <text x="400" y="445" font-family="sans-serif" font-size="12" fill="#64748b" text-anchor="middle">Official Case Attachment • Citizen Upload</text>
  </svg>`;
  return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;
};

const createMockPdfDataUrl = (title: string, category: string, refId: string) => {
  const content = `BT /F1 18 Tf 50 720 Td (CYBERTRACE INDIA - OFFICIAL EVIDENCE RECORD) Tj 0 -30 Td /F1 12 Tf (Case Reference: ${refId}) Tj 0 -20 Td (Scam Type: ${category}) Tj 0 -20 Td (Document: ${title}) Tj 0 -40 Td (Status: Citizen Submitted - Awaiting Allocation) Tj ET`;
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

// Additional Unassigned Cases for Admin Allocation workflow testing
export const INITIAL_UNASSIGNED_CASES: InvestigatorCase[] = [
  {
    id: 'case-unassigned-01',
    referenceId: 'CT-20261108-9011',
    assignedInvestigatorId: '',
    victimName: 'Citizen Arvind Joshi',
    category: 'UPI Fraud',
    reportedDate: '2026-11-08',
    amountLost: 48000,
    priority: 'High',
    status: 'Submitted',
    assignedOfficer: 'Unassigned',
    suspectIdentifiers: [
      { type: 'upi', value: 'rewards-refund.axis@okhdfcbank', normalized: 'rewards-refund.axis@okhdfcbank' },
      { type: 'phone', value: '+91 97112 34567', normalized: '9711234567' },
    ],
    transactionId: 'UPI/261108119821/REV',
    platform: 'PhonePe & SMS',
    description: 'Victim received an SMS about expired credit card loyalty reward points. Directed to approve an urgent UPI refund link which deducted Rs 48,000.',
    evidenceFiles: [
      {
        id: 'ev-unassigned-1',
        name: 'phonepe_debit_alert.png',
        size: 312000,
        type: 'image/png',
        previewUrl: createMockImageSvg('phonepe_debit_alert.png', 'UPI Fraud', 'CT-20261108-9011', '#0284c7'),
        selectedAt: '11:20 AM',
        reportRef: 'CT-20261108-9011',
        scamCategory: 'UPI Fraud',
      },
    ],
    timeline: [
      { stage: 'Submitted', timestamp: '2026-11-08 11:22 AM', note: 'Case registered by citizen. Awaiting administrative review and officer assignment.', actor: 'Citizen Victim (Initial Filing)' },
    ],
  },
  {
    id: 'case-unassigned-02',
    referenceId: 'CT-20261110-9022',
    assignedInvestigatorId: '',
    victimName: 'Citizen Meena Ranganathan',
    category: 'Fake Investment',
    reportedDate: '2026-11-10',
    amountLost: 115000,
    priority: 'Critical',
    status: 'Submitted',
    assignedOfficer: 'Unassigned',
    suspectIdentifiers: [
      { type: 'url', value: 'https://quant-alpha-yield.vip', normalized: 'quant-alpha-yield.vip' },
      { type: 'email', value: 'advisor@quant-alpha-yield.vip', normalized: 'advisor@quant-alpha-yield.vip' },
      { type: 'upi', value: 'alphaquant.escrow@icici', normalized: 'alphaquant.escrow@icici' },
    ],
    transactionId: 'IMPS/611109981245/INV',
    platform: 'Telegram & Web App',
    description: 'Promised 40% guaranteed returns on crypto-forex trading bot. Account locked after depositing initial capital plus margin deposit.',
    evidenceFiles: [
      {
        id: 'ev-unassigned-2',
        name: 'crypto_deposit_ledger.pdf',
        size: 645000,
        type: 'application/pdf',
        previewUrl: createMockPdfDataUrl('Crypto Forex Ledger Transfer', 'Fake Investment', 'CT-20261110-9022'),
        selectedAt: '02:40 PM',
        reportRef: 'CT-20261110-9022',
        scamCategory: 'Fake Investment',
      },
    ],
    timeline: [
      { stage: 'Submitted', timestamp: '2026-11-10 02:45 PM', note: 'High financial loss incident logged by citizen. Queued for immediate officer allocation.', actor: 'Citizen Victim (Initial Filing)' },
    ],
  },
  {
    id: 'case-unassigned-03',
    referenceId: 'CT-20261114-9033',
    assignedInvestigatorId: '',
    victimName: 'Citizen Rohan Varma',
    category: 'Job Scam',
    reportedDate: '2026-11-14',
    amountLost: 36000,
    priority: 'Medium',
    status: 'Submitted',
    assignedOfficer: 'Unassigned',
    suspectIdentifiers: [
      { type: 'phone', value: '+91 99880 12345', normalized: '9988012345' },
      { type: 'email', value: 'hr@amazon-global-seller-task.org', normalized: 'hr@amazon-global-seller-task.org' },
    ],
    transactionId: 'UPI/261114339188/JOB',
    platform: 'WhatsApp Task Group',
    description: 'Recruited to review hotel listings online. Earned small payouts initially, then coerced into paying an unlocking fee of Rs 36,000.',
    evidenceFiles: [
      {
        id: 'ev-unassigned-3',
        name: 'whatsapp_task_contract.jpg',
        size: 285000,
        type: 'image/jpeg',
        previewUrl: createMockImageSvg('whatsapp_task_contract.jpg', 'Job Scam', 'CT-20261114-9033', '#10b981'),
        selectedAt: '04:15 PM',
        reportRef: 'CT-20261114-9033',
        scamCategory: 'Job Scam',
      },
    ],
    timeline: [
      { stage: 'Submitted', timestamp: '2026-11-14 04:20 PM', note: 'Case filed with screenshots of recruiter communications.', actor: 'Citizen Victim (Initial Filing)' },
    ],
  },
  {
    id: 'case-unassigned-04',
    referenceId: 'CT-20261117-9044',
    assignedInvestigatorId: '',
    victimName: 'Citizen Shruti Bansal',
    category: 'Phishing',
    reportedDate: '2026-11-17',
    amountLost: 52000,
    priority: 'High',
    status: 'Submitted',
    assignedOfficer: 'Unassigned',
    suspectIdentifiers: [
      { type: 'url', value: 'https://pan-aadhaar-link-portal.net', normalized: 'pan-aadhaar-link-portal.net' },
      { type: 'phone', value: '+91 98119 55667', normalized: '9811955667' },
    ],
    transactionId: 'TXN-PAN-9812491',
    platform: 'SMS & Mobile Chrome',
    description: 'Urgent SMS to complete mandatory PAN-Aadhaar linking before midnight deadline. Harvested debit card number, CVV, and OTP, debiting Rs 52,000.',
    evidenceFiles: [
      {
        id: 'ev-unassigned-4',
        name: 'pan_link_phishing_sms.png',
        size: 195000,
        type: 'image/png',
        previewUrl: createMockImageSvg('pan_link_phishing_sms.png', 'Phishing', 'CT-20261117-9044', '#dc2626'),
        selectedAt: '09:10 AM',
        reportRef: 'CT-20261117-9044',
        scamCategory: 'Phishing',
      },
    ],
    timeline: [
      { stage: 'Submitted', timestamp: '2026-11-17 09:15 AM', note: 'Phishing portal complaint submitted. Urgent takedown requisition pending.', actor: 'Citizen Victim (Initial Filing)' },
    ],
  },
];

export const INITIAL_ASSIGNMENT_HISTORY: CaseAssignmentRecord[] = [
  {
    id: 'asg-01',
    caseRef: 'CT-20261002-1101',
    newInvestigatorId: 'CYB-IN-20481',
    newInvestigatorName: 'Insp. Rajesh Deshmukh',
    assignedByAdminId: 'CT-ADMIN-001',
    assignedByAdminName: 'Administrator V. Singhal',
    timestamp: '2026-10-03 02:15 PM',
    action: 'Initial Assignment',
    notes: 'High priority UPI cash-drain case assigned to Unit 4 forensic officer.',
  },
  {
    id: 'asg-02',
    caseRef: 'CT-20261011-1103',
    newInvestigatorId: 'CYB-IN-20481',
    newInvestigatorName: 'Insp. Rajesh Deshmukh',
    assignedByAdminId: 'CT-ADMIN-001',
    assignedByAdminName: 'Administrator V. Singhal',
    timestamp: '2026-10-12 09:30 AM',
    action: 'Initial Assignment',
    notes: 'Cryptocurrency arbitrage fraud linked with Pattern A syndicate.',
  },
  {
    id: 'asg-03',
    caseRef: 'CT-20261102-8491',
    newInvestigatorId: 'CYB-IN-20481',
    newInvestigatorName: 'Insp. Rajesh Deshmukh',
    assignedByAdminId: 'CT-ADMIN-001',
    assignedByAdminName: 'Administrator V. Singhal',
    timestamp: '2026-11-03 02:40 PM',
    action: 'Initial Assignment',
    notes: 'Google Pay collect scam verified; assigned for transaction recall.',
  },
];

// Unified default store combines existing 8 assigned cases + new unassigned cases
export function getInitialCaseAllocationStore(): {
  cases: InvestigatorCase[];
  assignmentHistory: CaseAssignmentRecord[];
} {
  return {
    cases: [...INITIAL_INVESTIGATOR_CASES, ...INITIAL_UNASSIGNED_CASES],
    assignmentHistory: INITIAL_ASSIGNMENT_HISTORY,
  };
}
