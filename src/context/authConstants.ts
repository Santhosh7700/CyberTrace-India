import type { InvestigatorProfile } from './authContextDef';

// Predefined Demo Investigator Credentials (Task 07)
export const DEMO_INVESTIGATOR_CREDENTIALS = {
  cyberId: 'CYB-IN-20481',
  password: 'Investigator@123',
  profile: {
    cyberId: 'CYB-IN-20481',
    badgeNumber: 'MH-CYB-0481',
    name: 'Inspector Rajesh Deshmukh',
    rank: 'Senior Cyber Forensic Inspector',
    unit: 'Cyber Crime Investigation Cell (Unit 4)',
    role: 'investigator' as const,
    lastActive: 'Active Session',
  } as InvestigatorProfile,
};
