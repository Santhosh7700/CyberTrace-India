import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/useAuth';
import type { UserRole } from '../context/authContextDef';

interface ProtectedRouteProps {
  children: React.ReactNode;
  allowedRole?: UserRole;
}

export default function ProtectedRoute({ children, allowedRole }: ProtectedRouteProps) {
  const { isAuthenticated, userRole } = useAuth();
  const location = useLocation();

  if (!isAuthenticated) {
    // Redirect unauthenticated users to unified login with return state
    return <Navigate to="/login" replace state={{ from: location.pathname }} />;
  }

  // Role-based protection: if allowedRole is specified and doesn't match, redirect to the user's appropriate area
  if (allowedRole && userRole !== allowedRole) {
    if (userRole === 'investigator') {
      return <Navigate to="/investigator" replace />;
    }
    if (userRole === 'citizen') {
      return <Navigate to="/dashboard" replace />;
    }
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
}
