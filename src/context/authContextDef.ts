import { createContext } from 'react';

export interface UserProfile {
  fullName: string;
  email: string;
  mobile: string;
  registeredAt: string;
}

export interface RegisteredAccount extends UserProfile {
  password: string; // In-memory only within the React session state
}

export interface AuthResponse {
  success: boolean;
  error?: string;
}

export interface AuthContextType {
  currentUser: UserProfile | null;
  isAuthenticated: boolean;
  registeredUsersCount: number;
  register: (data: { fullName: string; email: string; mobile: string; password: string }) => AuthResponse;
  login: (email: string, password: string) => AuthResponse;
  logout: () => void;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);
