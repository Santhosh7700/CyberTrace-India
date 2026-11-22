import React, { useState, useEffect } from 'react';
import type { InvestigatorCase, InvestigationStatus, CasePriority } from '../types/investigator';
import type { CaseAssignmentRecord } from '../types/allocation';
import type { ScamReport } from '../types/dashboard';
import {
  DEMO_INVESTIGATORS,
  getInitialCaseAllocationStore,
} from '../data/investigatorsData';
import { CaseAllocationContext } from './caseAllocationContextDef';

const STORAGE_KEY_CASES = 'cybertrace_allocated_cases_v1';
const STORAGE_KEY_HISTORY = 'cybertrace_assignment_history_v1';

export const CaseAllocationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [cases, setCases] = useState<InvestigatorCase[]>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY_CASES);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed;
        }
      }
    } catch {
      // Fallback
    }
    return getInitialCaseAllocationStore().cases;
  });

  const [assignmentHistory, setAssignmentHistory] = useState<CaseAssignmentRecord[]>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY_HISTORY);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed)) {
          return parsed;
        }
      }
    } catch {
      // Fallback
    }
    return getInitialCaseAllocationStore().assignmentHistory;
  });

  // Sync to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_CASES, JSON.stringify(cases));
    } catch {
      // ignore
    }
  }, [cases]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_HISTORY, JSON.stringify(assignmentHistory));
    } catch {
      // ignore
    }
  }, [assignmentHistory]);

  const addCitizenReport = (report: ScamReport, victimName?: string) => {
    // Derive sensible priority based on amount lost
    let priority: CasePriority = 'Medium';
    if (report.amountLost >= 75000) priority = 'Critical';
    else if (report.amountLost >= 30000) priority = 'High';
    else if (report.amountLost < 10000) priority = 'Low';

    const newCase: InvestigatorCase = {
      id: `case-${report.id}`,
      referenceId: report.referenceId,
      assignedInvestigatorId: '',
      victimName: victimName || 'Citizen Reporter',
      category: report.category,
      reportedDate: report.reportedDate,
      amountLost: report.amountLost,
      priority,
      status: 'Submitted',
      assignedOfficer: 'Unassigned',
      suspectIdentifiers: report.suspectIdentifiers || [],
      transactionId: report.transactionId,
      platform: report.platform,
      description: report.description,
      evidenceFiles: report.evidenceFiles || [],
      timeline: [
        {
          stage: 'Submitted',
          timestamp: report.statusTimeline.submittedAt,
          note: report.statusTimeline.remarks || 'Case submitted by citizen through Citizen Portal.',
          actor: victimName ? `${victimName} (Citizen)` : 'Citizen Victim (Initial Filing)',
        },
      ],
    };

    setCases((prev) => {
      // Avoid duplicate insertion
      if (prev.some((c) => c.referenceId === report.referenceId)) {
        return prev;
      }
      return [newCase, ...prev];
    });
  };

  const assignCase = (
    caseId: string,
    investigatorId: string,
    adminId: string,
    adminName: string,
    notes?: string
  ): { success: boolean; error?: string } => {
    const targetCase = cases.find((c) => c.id === caseId || c.referenceId === caseId);
    if (!targetCase) {
      return { success: false, error: 'Case not found in system repository.' };
    }

    const investigator = DEMO_INVESTIGATORS.find((inv) => inv.cyberId === investigatorId);
    if (!investigator) {
      return { success: false, error: 'Target investigator not found.' };
    }

    const now = new Date();
    const timestampStr = now.toLocaleString([], {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
    });

    const isReassignment = Boolean(targetCase.assignedInvestigatorId && targetCase.assignedInvestigatorId !== investigatorId);
    const prevOfficerId = targetCase.assignedInvestigatorId;
    const prevOfficerName = targetCase.assignedOfficer !== 'Unassigned' ? targetCase.assignedOfficer : undefined;

    const actionType: 'Initial Assignment' | 'Reassignment' = isReassignment
      ? 'Reassignment'
      : 'Initial Assignment';

    const historyRecord: CaseAssignmentRecord = {
      id: `asg-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      caseRef: targetCase.referenceId,
      previousInvestigatorId: prevOfficerId || undefined,
      previousInvestigatorName: prevOfficerName,
      newInvestigatorId: investigator.cyberId,
      newInvestigatorName: `${investigator.name} (${investigator.cyberId})`,
      assignedByAdminId: adminId,
      assignedByAdminName: adminName,
      timestamp: timestampStr,
      action: actionType,
      notes:
        notes?.trim() ||
        (isReassignment
          ? `Case reassigned from ${prevOfficerName || 'previous officer'} to ${investigator.name}.`
          : `Case officially assigned to ${investigator.name} (${investigator.unit}).`),
    };

    const newStage: InvestigationStatus =
      targetCase.status === 'Submitted' ? 'Under Review' : targetCase.status;

    setCases((prev) =>
      prev.map((c) => {
        if (c.id !== targetCase.id) return c;
        return {
          ...c,
          assignedInvestigatorId: investigator.cyberId,
          assignedOfficer: `${investigator.name} (${investigator.cyberId})`,
          status: newStage,
          timeline: [
            ...c.timeline,
            {
              stage: newStage,
              timestamp: timestampStr,
              note:
                notes?.trim() ||
                `Case assigned to ${investigator.name} (${investigator.cyberId}) by ${adminName}.`,
              actor: `${adminName} (${adminId})`,
            },
          ],
        };
      })
    );

    setAssignmentHistory((prev) => [historyRecord, ...prev]);

    return { success: true };
  };

  const updateCaseStatus = (
    caseId: string,
    newStatus: InvestigationStatus,
    statusNote: string,
    actorName?: string
  ) => {
    const timestampStr = new Date().toLocaleString([], {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
    });

    setCases((prev) =>
      prev.map((c) => {
        if (c.id !== caseId && c.referenceId !== caseId) return c;
        return {
          ...c,
          status: newStatus,
          timeline: [
            ...c.timeline,
            {
              stage: newStatus,
              timestamp: timestampStr,
              note: statusNote,
              actor: actorName || c.assignedOfficer || 'Investigating Officer',
            },
          ],
        };
      })
    );
  };

  const resetToDefault = () => {
    const defaultData = getInitialCaseAllocationStore();
    setCases(defaultData.cases);
    setAssignmentHistory(defaultData.assignmentHistory);
    try {
      localStorage.removeItem(STORAGE_KEY_CASES);
      localStorage.removeItem(STORAGE_KEY_HISTORY);
    } catch {
      // ignore
    }
  };

  return (
    <CaseAllocationContext.Provider
      value={{
        cases,
        investigators: DEMO_INVESTIGATORS,
        assignmentHistory,
        addCitizenReport,
        assignCase,
        updateCaseStatus,
        resetToDefault,
      }}
    >
      {children}
    </CaseAllocationContext.Provider>
  );
};
