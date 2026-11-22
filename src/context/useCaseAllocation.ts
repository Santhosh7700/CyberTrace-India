import { useContext } from 'react';
import { CaseAllocationContext } from './caseAllocationContextDef';

export function useCaseAllocation() {
  const context = useContext(CaseAllocationContext);
  if (!context) {
    throw new Error('useCaseAllocation must be used within a CaseAllocationProvider');
  }
  return context;
}
