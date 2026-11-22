import type { ScamCategory, EvidenceFileItem } from './dashboard';
import type { SuspectIdentifier } from './intelligence';

export type InvestigationStatus =
  | 'Submitted'
  | 'Under Review'
  | 'Under Investigation'
  | 'Evidence Verification'
  | 'Resolved'
  | 'Closed';

export type CasePriority = 'Critical' | 'High' | 'Medium' | 'Low';

export interface InvestigatorCase {
  id: string;
  referenceId: string; // CT-YYYYMMDD-XXXX
  assignedInvestigatorId: string; // e.g. 'CYB-IN-20481'
  victimName: string;
  category: ScamCategory;
  reportedDate: string;
  amountLost: number;
  priority: CasePriority;
  status: InvestigationStatus;
  suspectIdentifiers: SuspectIdentifier[];
  transactionId?: string;
  platform: string;
  description: string;
  assignedOfficer: string;
  evidenceFiles: EvidenceFileItem[];
  timeline: {
    stage: InvestigationStatus;
    timestamp: string;
    note: string;
    actor?: string; // Officer badge ID or Citizen/System
  }[];
}
