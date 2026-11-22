import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/useAuth';
import { useCaseAllocation } from '../context/useCaseAllocation';
import type { InvestigatorCase } from '../types/investigator';
import AdminSidebar, { type AdminTab } from '../components/admin/AdminSidebar';
import AdminHeader from '../components/admin/AdminHeader';
import IncomingReportsSection from '../components/admin/IncomingReportsSection';
import CaseAllocationSection from '../components/admin/CaseAllocationSection';
import InvestigatorManagementSection from '../components/admin/InvestigatorManagementSection';
import AssignmentHistorySection from '../components/admin/AssignmentHistorySection';
import AllCasesMonitoringSection from '../components/admin/AllCasesMonitoringSection';
import AdminProfileSection from '../components/admin/AdminProfileSection';
import CaseDetailModal from '../components/investigator/CaseDetailModal';

export default function AdminDashboardPage() {
  const { currentUser, logout } = useAuth();
  const navigate = useNavigate();
  const { cases, investigators, assignmentHistory, assignCase, updateCaseStatus } = useCaseAllocation();

  // Navigation tab
  const [activeTab, setActiveTab] = useState<AdminTab>('overview');
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);

  // Active modal inspection case
  const [inspectedCaseId, setInspectedCaseId] = useState<string | null>(null);

  // Preselected case for allocation flow
  const [preselectedCaseId, setPreselectedCaseId] = useState<string | null>(null);

  const inspectedCase = inspectedCaseId ? cases.find((c) => c.id === inspectedCaseId) || null : null;

  // Dynamic statistics calculated directly from shared mock dataset
  const totalReportsCount = cases.length;
  const unassignedCases = cases.filter((c) => !c.assignedInvestigatorId || c.assignedInvestigatorId.trim() === '');
  const unassignedCount = unassignedCases.length;
  const assignedCasesCount = totalReportsCount - unassignedCount;
  const totalInvestigatorsCount = investigators.length;

  const underInvestigationCount = cases.filter((c) => c.status === 'Under Investigation').length;
  const resolvedCount = cases.filter((c) => c.status === 'Resolved' || c.status === 'Closed').length;
  const totalFinancialLoss = cases.reduce((acc, c) => acc + (c.amountLost || 0), 0);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const handleAllocateDirect = (caseItem: InvestigatorCase) => {
    setPreselectedCaseId(caseItem.id);
    setActiveTab('case-allocation');
  };

  const handleAllocateToOfficer = () => {
    setActiveTab('case-allocation');
  };

  const handleAssignAction = (caseId: string, investigatorId: string, notes?: string) => {
    const adminId = currentUser && 'adminId' in currentUser ? currentUser.adminId : 'CT-ADMIN-001';
    const adminName = currentUser && 'name' in currentUser ? currentUser.name : 'Administrator V. Singhal';
    return assignCase(caseId, investigatorId, adminId, adminName, notes);
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col lg:flex-row text-slate-800 font-sans">
      {/* Sidebar */}
      <AdminSidebar
        activeTab={activeTab}
        onSelectTab={(tab) => {
          setActiveTab(tab);
          if (tab !== 'case-allocation') {
            setPreselectedCaseId(null);
          }
        }}
        onLogout={handleLogout}
        isOpenMobile={isMobileSidebarOpen}
        onCloseMobile={() => setIsMobileSidebarOpen(false)}
        unassignedCount={unassignedCount}
        totalIncomingCount={totalReportsCount}
      />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        <AdminHeader
          onToggleMobileSidebar={() => setIsMobileSidebarOpen(true)}
          unassignedCount={unassignedCount}
        />

        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto space-y-6">
          
          {/* TAB 1: OVERVIEW */}
          {activeTab === 'overview' && (
            <div className="space-y-6">
              {/* Summary Cards Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-3.5">
                
                {/* Total Reports */}
                <div className="bg-white p-4 rounded-xl border border-slate-200/90 shadow-2xs">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                    Total Reports
                  </span>
                  <div className="flex items-baseline justify-between mt-1">
                    <span className="text-2xl font-black text-slate-900 font-mono">{totalReportsCount}</span>
                    <span className="text-[10px] font-bold text-blue-600 bg-blue-50 px-1.5 py-0.5 rounded">
                      Citizen Cases
                    </span>
                  </div>
                </div>

                {/* Pending Allocation */}
                <div className="bg-white p-4 rounded-xl border border-slate-200/90 shadow-2xs">
                  <span className="text-[10px] font-bold text-amber-700 uppercase tracking-wider block">
                    Pending Allocation
                  </span>
                  <div className="flex items-baseline justify-between mt-1">
                    <span className="text-2xl font-black text-amber-600 font-mono">{unassignedCount}</span>
                    <span className="text-[10px] font-bold text-amber-700 bg-amber-50 px-1.5 py-0.5 rounded">
                      Needs Officer
                    </span>
                  </div>
                </div>

                {/* Assigned Cases */}
                <div className="bg-white p-4 rounded-xl border border-slate-200/90 shadow-2xs">
                  <span className="text-[10px] font-bold text-emerald-700 uppercase tracking-wider block">
                    Assigned Cases
                  </span>
                  <div className="flex items-baseline justify-between mt-1">
                    <span className="text-2xl font-black text-emerald-700 font-mono">{assignedCasesCount}</span>
                    <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded">
                      Active Dockets
                    </span>
                  </div>
                </div>

                {/* Total Investigators */}
                <div className="bg-white p-4 rounded-xl border border-slate-200/90 shadow-2xs">
                  <span className="text-[10px] font-bold text-indigo-700 uppercase tracking-wider block">
                    Investigative Force
                  </span>
                  <div className="flex items-baseline justify-between mt-1">
                    <span className="text-2xl font-black text-indigo-700 font-mono">{totalInvestigatorsCount}</span>
                    <span className="text-[10px] font-bold text-indigo-700 bg-indigo-50 px-1.5 py-0.5 rounded">
                      Officers
                    </span>
                  </div>
                </div>

                {/* Under Investigation */}
                <div className="bg-white p-4 rounded-xl border border-slate-200/90 shadow-2xs">
                  <span className="text-[10px] font-bold text-purple-700 uppercase tracking-wider block">
                    Under Investigation
                  </span>
                  <div className="flex items-baseline justify-between mt-1">
                    <span className="text-2xl font-black text-purple-700 font-mono">{underInvestigationCount}</span>
                    <span className="text-[10px] font-bold text-purple-700 bg-purple-50 px-1.5 py-0.5 rounded">
                      In Flight
                    </span>
                  </div>
                </div>

                {/* Resolved Cases */}
                <div className="bg-white p-4 rounded-xl border border-slate-200/90 shadow-2xs">
                  <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">
                    Resolved / Closed
                  </span>
                  <div className="flex items-baseline justify-between mt-1">
                    <span className="text-2xl font-black text-slate-800 font-mono">{resolvedCount}</span>
                    <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded">
                      Completed
                    </span>
                  </div>
                </div>

              </div>

              {/* Central Action Card */}
              <div className="bg-gradient-to-r from-slate-900 via-emerald-950 to-slate-900 text-white rounded-2xl p-6 shadow-md border border-slate-800 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                <div>
                  <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-[10px] font-bold uppercase tracking-wider mb-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
                    Direct Case Allocation Desk
                  </div>
                  <h3 className="text-lg font-bold text-white">
                    {unassignedCount > 0
                      ? `${unassignedCount} Incoming Citizen Scam Complaints Require Officer Allocation`
                      : 'All Reported Scam Complaints Have Been Formally Allocated'}
                  </h3>
                  <p className="text-xs text-slate-300 max-w-2xl mt-1 leading-relaxed">
                    Total financial loss monitored: <strong>₹{totalFinancialLoss.toLocaleString('en-IN')}</strong>. Assign newly reported cases directly to qualified cyber forensics investigators to initiate freeze notices and bank inquiries.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setActiveTab('case-allocation')}
                  className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold transition-colors shadow-sm shrink-0"
                >
                  Open Allocation Desk →
                </button>
              </div>

              {/* 2-Column Dashboard Widgets */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Unassigned Quick Queue */}
                <div className="bg-white rounded-xl border border-slate-200/90 shadow-2xs p-5">
                  <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-3">
                    <h4 className="text-xs font-bold uppercase tracking-wider text-slate-800">
                      Unassigned Triage Queue ({unassignedCount})
                    </h4>
                    <button
                      type="button"
                      onClick={() => setActiveTab('incoming-reports')}
                      className="text-xs font-bold text-emerald-700 hover:underline"
                    >
                      View All Reports →
                    </button>
                  </div>
                  {unassignedCases.length === 0 ? (
                    <div className="p-8 text-center text-slate-400 text-xs">
                      No unassigned reports. All incoming cases are allocated.
                    </div>
                  ) : (
                    <div className="space-y-2.5">
                      {unassignedCases.slice(0, 4).map((c) => (
                        <div
                          key={c.id}
                          className="p-3 bg-slate-50 hover:bg-slate-100 rounded-xl border border-slate-200/80 flex items-center justify-between transition-colors"
                        >
                          <div>
                            <div className="flex items-center space-x-2">
                              <span className="font-mono font-bold text-slate-900 text-xs">{c.referenceId}</span>
                              <span className="text-[10px] font-semibold text-slate-500">[{c.category}]</span>
                            </div>
                            <span className="text-[11px] text-slate-500 block truncate max-w-xs mt-0.5">
                              {c.description}
                            </span>
                          </div>
                          <button
                            type="button"
                            onClick={() => handleAllocateDirect(c)}
                            className="px-3 py-1 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-bold shadow-2xs transition-colors shrink-0 ml-2"
                          >
                            Allocate
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Investigator Workload Summary */}
                <div className="bg-white rounded-xl border border-slate-200/90 shadow-2xs p-5">
                  <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-3">
                    <h4 className="text-xs font-bold uppercase tracking-wider text-slate-800">
                      Officer Workload Distribution
                    </h4>
                    <button
                      type="button"
                      onClick={() => setActiveTab('investigators')}
                      className="text-xs font-bold text-emerald-700 hover:underline"
                    >
                      Manage Roster →
                    </button>
                  </div>
                  <div className="space-y-3">
                    {investigators.map((inv) => {
                      const count = cases.filter((c) => c.assignedInvestigatorId === inv.cyberId).length;
                      const percentage = Math.min(Math.round((count / Math.max(cases.length, 1)) * 100), 100);

                      return (
                        <div key={inv.cyberId} className="space-y-1">
                          <div className="flex justify-between text-xs font-medium">
                            <span className="text-slate-800 font-bold">
                              {inv.name} <span className="text-slate-400 font-normal">({inv.cyberId})</span>
                            </span>
                            <span className="font-mono font-bold text-slate-700">{count} Cases</span>
                          </div>
                          <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
                            <div
                              className="bg-emerald-600 h-2 rounded-full transition-all duration-300"
                              style={{ width: `${percentage}%` }}
                            />
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: INCOMING REPORTS */}
          {activeTab === 'incoming-reports' && (
            <IncomingReportsSection
              cases={cases}
              onInspectCase={(c) => setInspectedCaseId(c.id)}
              onAllocateCase={handleAllocateDirect}
            />
          )}

          {/* TAB 3: CASE ALLOCATION */}
          {activeTab === 'case-allocation' && (
            <CaseAllocationSection
              cases={cases}
              investigators={investigators}
              onAssign={handleAssignAction}
              onInspectCase={(c) => setInspectedCaseId(c.id)}
              preselectedCaseId={preselectedCaseId}
            />
          )}

          {/* TAB 4: INVESTIGATOR MANAGEMENT */}
          {activeTab === 'investigators' && (
            <InvestigatorManagementSection
              investigators={investigators}
              cases={cases}
              onInspectCase={(c) => setInspectedCaseId(c.id)}
              onAllocateNewCase={handleAllocateToOfficer}
            />
          )}

          {/* TAB 5: ALL CASES MONITORING */}
          {activeTab === 'all-cases' && (
            <AllCasesMonitoringSection
              cases={cases}
              onInspectCase={(c) => setInspectedCaseId(c.id)}
              onAllocateCase={handleAllocateDirect}
            />
          )}

          {/* TAB 6: ASSIGNMENT HISTORY */}
          {activeTab === 'assignment-history' && (
            <AssignmentHistorySection history={assignmentHistory} />
          )}

          {/* TAB 7: PROFILE */}
          {activeTab === 'profile' && (
            <AdminProfileSection
              currentUser={currentUser}
              totalAllocationsCount={assignmentHistory.length}
            />
          )}

        </main>
      </div>

      {/* Case Details Inspection Dossier Modal */}
      {inspectedCase && (
        <CaseDetailModal
          caseItem={inspectedCase}
          onClose={() => setInspectedCaseId(null)}
          onUpdateStatus={(caseId, newStatus, statusNote) => {
            const adminName = currentUser && 'name' in currentUser ? currentUser.name : 'Directorate Admin';
            updateCaseStatus(caseId, newStatus, statusNote, adminName);
          }}
        />
      )}
    </div>
  );
}
