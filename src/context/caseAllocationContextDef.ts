import { createContext } from 'react';
import type { InvestigatorCase, InvestigationStatus } from '../types/investigator';
import type { DemoInvestigator, CaseAssignmentRecord } from '../types/allocation';

export interface CaseAllocationContextType {
  cases: InvestigatorCase[];
  investigators: DemoInvestigator[];
  assignmentHistory: CaseAssignmentRecord[];
  assignCase: (
    caseId: string,
    investigatorId: string,
    adminId: string,
    adminName: string,
    notes?: string
  ) => { success: boolean; error?: string };
  updateCaseStatus: (
    caseId: string,
    newStatus: InvestigationStatus,
    statusNote: string,
    actorName?: string
  ) => void;
  resetToDefault: () => void;
}

export const CaseAllocationContext = createContext<CaseAllocationContextType | undefined>(undefined);
