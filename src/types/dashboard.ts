import type { SuspectIdentifier } from './intelligence';

export type ScamCategory =
  | 'UPI Fraud'
  | 'Phishing'
  | 'Fake Investment'
  | 'Job Scam'
  | 'Online Shopping Fraud'
  | 'Social Media Scam'
  | 'Other';

export type ReportStatus = 'Submitted' | 'Under Review' | 'Under Investigation' | 'Resolved';

export interface EvidenceFileItem {
  id: string;
  name: string;
  size: number;
  type: string;
  previewUrl?: string;
  selectedAt: string;
  reportRef?: string;
  scamCategory?: ScamCategory;
}

export interface ScamReport {
  id: string;
  referenceId: string;
  category: ScamCategory;
  incidentDate: string;
  reportedDate: string;
  amountLost: number;
  transactionId?: string;
  suspectContact: string; // Backward compatibility display summary
  suspectIdentifiers: SuspectIdentifier[]; // Structured multi-identifier array
  platform: string;
  description: string;
  status: ReportStatus;
  evidenceFiles: EvidenceFileItem[];
  statusTimeline: {
    submittedAt: string;
    underReviewAt?: string;
    underInvestigationAt?: string;
    resolvedAt?: string;
    remarks?: string;
  };
}
