import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/useAuth';
import type { ScamReport, EvidenceFileItem } from '../types/dashboard';
import { INITIAL_MOCK_REPORTS } from '../data/mockReports';
import DashboardSidebar, { type DashboardTab } from '../components/dashboard/DashboardSidebar';
import DashboardHeader from '../components/dashboard/DashboardHeader';
import StatsCard from '../components/dashboard/StatsCard';
import QuickActions from '../components/dashboard/QuickActions';
import RecentReports from '../components/dashboard/RecentReports';
import ReportForm from '../components/dashboard/ReportForm';
import EvidenceManager from '../components/dashboard/EvidenceManager';
import MyReports from '../components/dashboard/MyReports';
import CitizenProfile from '../components/dashboard/CitizenProfile';

export default function DashboardPage() {
  const { currentUser, logout } = useAuth();
  const navigate = useNavigate();

  // Active navigation tab
  const [activeTab, setActiveTab] = useState<DashboardTab>('dashboard');
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);

  // In-memory reports state initialized with realistic mock cases
  const [reports, setReports] = useState<ScamReport[]>(INITIAL_MOCK_REPORTS);

  // In-memory evidence files state
  const [evidenceList, setEvidenceList] = useState<EvidenceFileItem[]>([]);

  // Selected report for timeline / details view
  const [selectedReportForDetails, setSelectedReportForDetails] = useState<ScamReport | null>(null);

  // Dynamic statistics calculations
  const totalReportsCount = reports.length;
  const underReviewCount = reports.filter((r) => r.status === 'Under Review').length;
  const underInvestigationCount = reports.filter((r) => r.status === 'Under Investigation').length;
  const resolvedCount = reports.filter((r) => r.status === 'Resolved').length;

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const handleNewReportSubmitted = (newReport: ScamReport) => {
    // Add newly submitted complaint at the front of the reports list
    setReports((prev) => [newReport, ...prev]);
  };

  const handleViewReportDetails = (report: ScamReport) => {
    setSelectedReportForDetails(report);
    setActiveTab('my-reports');
  };

  const handleAddEvidenceFiles = (newFiles: EvidenceFileItem[]) => {
    setEvidenceList((prev) => [...prev, ...newFiles]);
  };

  const handleRemoveEvidenceFile = (id: string) => {
    setEvidenceList((prev) => {
      const target = prev.find((item) => item.id === id);
      if (target?.previewUrl) {
        URL.revokeObjectURL(target.previewUrl);
      }
      return prev.filter((item) => item.id !== id);
    });
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col lg:flex-row text-slate-800 font-sans">
      {/* Sidebar Navigation */}
      <DashboardSidebar
        activeTab={activeTab}
        onSelectTab={(tab) => {
          setActiveTab(tab);
          if (tab !== 'my-reports') {
            setSelectedReportForDetails(null);
          }
        }}
        onLogout={handleLogout}
        isOpenMobile={isMobileSidebarOpen}
        onCloseMobile={() => setIsMobileSidebarOpen(false)}
      />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Header Bar */}
        <DashboardHeader
          currentUser={currentUser}
          onOpenMobileMenu={() => setIsMobileSidebarOpen(true)}
          unreadCount={2}
        />

        {/* Dynamic Section Container */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-[1400px] w-full mx-auto">
          {/* TAB 1: Overview Dashboard */}
          {activeTab === 'dashboard' && (
            <div className="space-y-6">
              {/* Overview Statistics */}
              <div>
                <h2 className="text-lg font-bold text-slate-900 mb-1">Incident Overview Statistics</h2>
                <p className="text-xs text-slate-500 mb-4">
                  Aggregated status of cyber incidents lodged under your citizen profile
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  <StatsCard
                    title="Total Reports"
                    value={totalReportsCount}
                    subtitle="All lodged incidents"
                    iconType="total"
                  />
                  <StatsCard
                    title="Under Review"
                    value={underReviewCount}
                    subtitle="Document verification"
                    iconType="review"
                  />
                  <StatsCard
                    title="Investigation"
                    value={underInvestigationCount}
                    subtitle="Assigned to Cyber Cell"
                    iconType="investigation"
                  />
                  <StatsCard
                    title="Resolved Cases"
                    value={resolvedCount}
                    subtitle="Funds held / closed"
                    iconType="resolved"
                  />
                </div>
              </div>

              {/* Quick Actions */}
              <QuickActions onNavigate={(tab) => setActiveTab(tab)} />

              {/* Recent Reports Table */}
              <RecentReports
                reports={reports}
                onViewDetails={handleViewReportDetails}
                onViewAll={() => setActiveTab('my-reports')}
              />
            </div>
          )}

          {/* TAB 2: Report a Scam */}
          {activeTab === 'report' && (
            <ReportForm
              onSubmitSuccess={handleNewReportSubmitted}
              onCancel={() => setActiveTab('my-reports')}
            />
          )}

          {/* TAB 3: My Reports / Case Tracking */}
          {activeTab === 'my-reports' && (
            <MyReports
              reports={reports}
              selectedReportForDetails={selectedReportForDetails}
              onSelectReport={setSelectedReportForDetails}
              onNewReportClick={() => setActiveTab('report')}
            />
          )}

          {/* TAB 4: Evidence Management */}
          {activeTab === 'evidence' && (
            <EvidenceManager
              evidenceList={evidenceList}
              onAddFiles={handleAddEvidenceFiles}
              onRemoveFile={handleRemoveEvidenceFile}
            />
          )}

          {/* TAB 5: Profile */}
          {activeTab === 'profile' && <CitizenProfile currentUser={currentUser} />}
        </main>
      </div>
    </div>
  );
}
