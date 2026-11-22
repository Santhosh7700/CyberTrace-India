import React, { useState } from 'react';
import {
  AuthContext,
  type RegisteredAccount,
  type UserProfile,
  type InvestigatorProfile,
  type AdminProfile,
  type AuthUser,
  type AuthResponse,
} from './authContextDef';
import { DEMO_INVESTIGATOR_CREDENTIALS, DEMO_ADMIN_CREDENTIALS } from './authConstants';

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // In-memory list of registered citizen accounts for the current session.
  const [registeredUsers, setRegisteredUsers] = useState<RegisteredAccount[]>([]);
  const [currentUser, setCurrentUser] = useState<AuthUser | null>(null);

  const register = ({
    fullName,
    email,
    mobile,
    password,
  }: {
    fullName: string;
    email: string;
    mobile: string;
    password: string;
  }): AuthResponse => {
    const normalizedEmail = email.trim().toLowerCase();

    // Prevent duplicate email registration within the current session
    const exists = registeredUsers.some((u) => u.email.toLowerCase() === normalizedEmail);
    if (exists) {
      return {
        success: false,
        error: 'An account with this email address is already registered in this session.',
      };
    }

    const newAccount: RegisteredAccount = {
      fullName: fullName.trim(),
      email: normalizedEmail,
      mobile: mobile.trim(),
      password,
      registeredAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      role: 'citizen',
    };

    const profile: UserProfile = {
      fullName: newAccount.fullName,
      email: newAccount.email,
      mobile: newAccount.mobile,
      registeredAt: newAccount.registeredAt,
      role: 'citizen',
    };

    setRegisteredUsers((prev) => [...prev, newAccount]);
    setCurrentUser(profile);

    return { success: true };
  };

  const login = (email: string, password: string): AuthResponse => {
    const normalizedEmail = email.trim().toLowerCase();

    // Check credentials against the temporary demo accounts created through registration
    const account = registeredUsers.find((u) => u.email.toLowerCase() === normalizedEmail);

    if (!account) {
      return {
        success: false,
        error:
          'No demo account found with this email. Please register as a new citizen first or check for typos.',
      };
    }

    if (account.password !== password) {
      return {
        success: false,
        error: 'Incorrect password. Please verify your credentials and try again.',
      };
    }

    const profile: UserProfile = {
      fullName: account.fullName,
      email: account.email,
      mobile: account.mobile,
      registeredAt: account.registeredAt,
      role: 'citizen',
    };

    setCurrentUser(profile);
    return { success: true };
  };

  const loginInvestigator = (cyberId: string, password: string): AuthResponse => {
    const normalizedId = cyberId.trim().toUpperCase();

    // Strict validation against predefined demo credentials
    if (
      normalizedId === DEMO_INVESTIGATOR_CREDENTIALS.cyberId &&
      password === DEMO_INVESTIGATOR_CREDENTIALS.password
    ) {
      const investigatorProfile: InvestigatorProfile = {
        ...DEMO_INVESTIGATOR_CREDENTIALS.profile,
        lastActive: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setCurrentUser(investigatorProfile);
      return { success: true };
    }

    if (normalizedId !== DEMO_INVESTIGATOR_CREDENTIALS.cyberId) {
      return {
        success: false,
        error: `Invalid Cyber ID "${cyberId.trim()}". Only registered authorized cyber officers may log in.`,
      };
    }

    return {
      success: false,
      error: 'Invalid password for this Cyber ID. Please check your official credentials.',
    };
  };

  const loginAdmin = (adminId: string, password: string): AuthResponse => {
    const normalizedId = adminId.trim().toUpperCase();

    if (
      normalizedId === DEMO_ADMIN_CREDENTIALS.adminId &&
      password === DEMO_ADMIN_CREDENTIALS.password
    ) {
      const adminProfile: AdminProfile = {
        ...DEMO_ADMIN_CREDENTIALS.profile,
        lastActive: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setCurrentUser(adminProfile);
      return { success: true };
    }

    if (normalizedId !== DEMO_ADMIN_CREDENTIALS.adminId) {
      return {
        success: false,
        error: `Invalid Admin ID "${adminId.trim()}". Only registered nodal system administrators may log in.`,
      };
    }

    return {
      success: false,
      error: 'Invalid password for this Admin ID. Please verify your administrative credentials.',
    };
  };

  const logout = () => {
    setCurrentUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        isAuthenticated: !!currentUser,
        userRole: currentUser?.role || null,
        registeredUsersCount: registeredUsers.length,
        register,
        login,
        loginInvestigator,
        loginAdmin,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
