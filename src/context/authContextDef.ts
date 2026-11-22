import { createContext } from 'react';

export type UserRole = 'citizen' | 'investigator' | 'admin';

export interface UserProfile {
  fullName: string;
  email: string;
  mobile: string;
  registeredAt: string;
  role: 'citizen';
}

export interface InvestigatorProfile {
  cyberId: string;
  badgeNumber: string;
  name: string;
  rank: string;
  unit: string;
  role: 'investigator';
  lastActive: string;
}

export interface AdminProfile {
  adminId: string;
  name: string;
  role: 'admin';
  department: string;
  clearanceLevel: string;
  lastActive: string;
}

export type AuthUser = UserProfile | InvestigatorProfile | AdminProfile;

export interface RegisteredAccount extends UserProfile {
  password: string; // In-memory only within the React session state
}

export interface AuthResponse {
  success: boolean;
  error?: string;
}

export interface AuthContextType {
  currentUser: AuthUser | null;
  isAuthenticated: boolean;
  userRole: UserRole | null;
  registeredUsersCount: number;
  register: (data: { fullName: string; email: string; mobile: string; password: string }) => AuthResponse;
  login: (email: string, password: string) => AuthResponse;
  loginInvestigator: (cyberId: string, password: string) => AuthResponse;
  loginAdmin: (adminId: string, password: string) => AuthResponse;
  logout: () => void;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);
