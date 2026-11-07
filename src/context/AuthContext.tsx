import React, { useState } from 'react';
import { AuthContext, type RegisteredAccount, type UserProfile, type AuthResponse } from './authContextDef';

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // In-memory list of registered accounts for the current session.
  // Note: Stored strictly in React state, never in localStorage/sessionStorage.
  const [registeredUsers, setRegisteredUsers] = useState<RegisteredAccount[]>([]);
  const [currentUser, setCurrentUser] = useState<UserProfile | null>(null);

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
    };

    const profile: UserProfile = {
      fullName: newAccount.fullName,
      email: newAccount.email,
      mobile: newAccount.mobile,
      registeredAt: newAccount.registeredAt,
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

    // Credentials match: update authenticated state (excluding password from profile)
    const profile: UserProfile = {
      fullName: account.fullName,
      email: account.email,
      mobile: account.mobile,
      registeredAt: account.registeredAt,
    };

    setCurrentUser(profile);
    return { success: true };
  };

  const logout = () => {
    setCurrentUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        isAuthenticated: !!currentUser,
        registeredUsersCount: registeredUsers.length,
        register,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
