import type { InvestigatorCase } from './investigator';

export interface DemoInvestigator {
  cyberId: string;
  badgeNumber: string;
  name: string;
  rank: string;
  unit: string;
  department: string; // e.g., 'Unit 4 — Financial & UPI Fraud'
  availability: 'Available' | 'Active Duty' | 'On Leave' | 'High Workload';
  avatarInitials: string;
}

export interface CaseAssignmentRecord {
  id: string;
  caseRef: string;
  previousInvestigatorId?: string;
  previousInvestigatorName?: string;
  newInvestigatorId: string;
  newInvestigatorName: string;
  assignedByAdminId: string;
  assignedByAdminName: string;
  timestamp: string;
  action: 'Initial Assignment' | 'Reassignment';
  notes?: string;
}

export interface CaseAllocationStore {
  cases: InvestigatorCase[];
  assignmentHistory: CaseAssignmentRecord[];
}
