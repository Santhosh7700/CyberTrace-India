import type { InvestigatorProfile, AdminProfile } from './authContextDef';

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

// Predefined Demo Admin Credentials (Task 09)
export const DEMO_ADMIN_CREDENTIALS = {
  adminId: 'CT-ADMIN-001',
  password: 'Admin@123',
  profile: {
    adminId: 'CT-ADMIN-001',
    name: 'Administrator V. Singhal',
    role: 'admin' as const,
    department: 'National Cyber Operations & Case Allocation Directorate',
    clearanceLevel: 'Supervisory Level 1 (Directorate)',
    lastActive: 'Active Session',
  } as AdminProfile,
};
