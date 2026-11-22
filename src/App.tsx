import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { CaseAllocationProvider } from './context/CaseAllocationContext';
import ProtectedRoute from './components/ProtectedRoute';
import LandingPage from './pages/LandingPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import DashboardPage from './pages/DashboardPage';
import FraudIntelligencePage from './pages/FraudIntelligencePage';
import InvestigatorDashboardPage from './pages/InvestigatorDashboardPage';
import AdminDashboardPage from './pages/AdminDashboardPage';

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <CaseAllocationProvider>
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<LandingPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />

            {/* Task 06: Protected Fraud Intelligence & Pattern Analysis Workspace (Investigator Only) */}
            <Route
              path="/intelligence"
              element={
                <ProtectedRoute allowedRole="investigator">
                  <FraudIntelligencePage />
                </ProtectedRoute>
              }
            />

            {/* Task 05: Protected Citizen Dashboard Route */}
            <Route
              path="/dashboard"
              element={
                <ProtectedRoute allowedRole="citizen">
                  <DashboardPage />
                </ProtectedRoute>
              }
            />

            {/* Task 07: Protected Law Enforcement Investigator Dashboard Route */}
            <Route
              path="/investigator"
              element={
                <ProtectedRoute allowedRole="investigator">
                  <InvestigatorDashboardPage />
                </ProtectedRoute>
              }
            />

            {/* Task 09: Protected Admin Case Allocation & Directorate Route */}
            <Route
              path="/admin"
              element={
                <ProtectedRoute allowedRole="admin">
                  <AdminDashboardPage />
                </ProtectedRoute>
              }
            />

            {/* Legacy / Helper redirects */}
            <Route path="/welcome" element={<Navigate to="/dashboard" replace />} />

            {/* Fallback to home */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </CaseAllocationProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
