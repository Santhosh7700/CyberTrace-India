import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/useAuth';
import type { InvestigatorCase, InvestigationStatus } from '../types/investigator';
import { INITIAL_INVESTIGATOR_CASES } from '../data/investigatorCases';
import InvestigatorSidebar, { type InvestigatorTab } from '../components/investigator/InvestigatorSidebar';
import InvestigatorHeader from '../components/investigator/InvestigatorHeader';
import AssignedCasesTable from '../components/investigator/AssignedCasesTable';
import CaseDetailModal from '../components/investigator/CaseDetailModal';
import EvidenceReviewSection from '../components/investigator/EvidenceReviewSection';
import InvestigationHistorySection from '../components/investigator/InvestigationHistorySection';
import InvestigatorProfileSection from '../components/investigator/InvestigatorProfileSection';

export default function InvestigatorDashboardPage() {
  const { currentUser, logout } = useAuth();
  const navigate = useNavigate();

  // Active navigation tab
  const [activeTab, setActiveTab] = useState<InvestigatorTab>('overview');
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);

  // In-memory cases state initialized with synthetic sample incident records
  const [cases, setCases] = useState<InvestigatorCase[]>(INITIAL_INVESTIGATOR_CASES);

  // Active modal inspection case
  const [inspectedCase, setInspectedCase] = useState<InvestigatorCase | null>(null);

  // Statistics
  const totalAssignedCases = cases.length;
  const pendingReviewCount = cases.filter((c) => c.status === 'Submitted' || c.status === 'Under Review').length;
  const underInvestigationCount = cases.filter((c) => c.status === 'Under Investigation').length;
  const evidenceVerificationCount = cases.filter((c) => c.status === 'Evidence Verification').length;
  const casesResolvedCount = cases.filter((c) => c.status === 'Resolved' || c.status === 'Closed').length;

  // Flattened evidence list count
  const totalEvidenceCount = cases.reduce((acc, c) => acc + c.evidenceFiles.length, 0);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const handleUpdateStatus = (caseId: string, newStatus: InvestigationStatus, statusNote: string) => {
    const timestamp = new Date().toLocaleString([], {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
    });

    setCases((prev) =>
      prev.map((c) => {
        if (c.id !== caseId) return c;
        const updatedCase: InvestigatorCase = {
          ...c,
          status: newStatus,
          timeline: [
            ...c.timeline,
            {
              stage: newStatus,
              timestamp,
              note: statusNote,
              actor: 'Insp. R. Deshmukh (CYB-IN-20481)',
            },
          ],
        };
        // Also update active inspected case if open
        if (inspectedCase?.id === caseId) {
          setInspectedCase(updatedCase);
        }
        return updatedCase;
      })
    );
  };

  const handleQuickStatusChange = (caseId: string, newStatus: InvestigationStatus) => {
    handleUpdateStatus(caseId, newStatus, `Stage updated to ${newStatus} from quick-action switcher.`);
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col lg:flex-row text-slate-800 font-sans">
      {/* Investigator Sidebar */}
      <InvestigatorSidebar
        activeTab={activeTab}
        onSelectTab={(tab) => {
          if (tab === 'fraud-intelligence') {
            navigate('/intelligence');
            return;
          }
          setActiveTab(tab);
        }}
        onLogout={handleLogout}
        isOpenMobile={isMobileSidebarOpen}
        onCloseMobile={() => setIsMobileSidebarOpen(false)}
        badgeCounts={{
          assigned: pendingReviewCount,
          evidence: totalEvidenceCount,
        }}
      />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Header */}
        <InvestigatorHeader
          currentUser={currentUser}
          onOpenMobileMenu={() => setIsMobileSidebarOpen(true)}
          pendingReviewCount={pendingReviewCount}
        />

        {/* Dynamic Workspace Container */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-[1400px] w-full mx-auto space-y-6">
          
          {/* Prototype Demonstration Alert Banner */}
          <div className="p-3 bg-indigo-50 border border-indigo-200 rounded-xl flex items-center justify-between text-xs text-indigo-950 flex-wrap gap-2">
            <div className="flex items-center space-x-2">
              <span className="w-2 h-2 rounded-full bg-indigo-600 shrink-0"></span>
              <span>
                <strong>Investigator Workspace (Prototype Demonstration):</strong> You are authenticated as{' '}
                <span className="font-bold">Inspector Rajesh Deshmukh</span> (CYB-IN-20481). Status changes persist in active session.
              </span>
            </div>
            <Link
              to="/intelligence"
              className="text-xs font-bold text-indigo-700 hover:text-indigo-900 underline"
            >
              Open Fraud Intelligence Module →
            </Link>
          </div>

          {/* TAB 1: OVERVIEW DASHBOARD */}
          {activeTab === 'overview' && (
            <div className="space-y-6">
              {/* Statistics Cards */}
              <div>
                <h2 className="text-lg font-bold text-slate-900 mb-1">Investigation Unit Statistics</h2>
                <p className="text-xs text-slate-500 mb-4">
                  Real-time caseload metrics across Unit 4 assigned cyber complaints
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
                  {/* Card 1: Total */}
                  <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                      Total Assigned Cases
                    </span>
                    <p className="text-2xl font-black text-slate-900 font-mono mt-1">{totalAssignedCases}</p>
                    <span className="text-[11px] text-slate-500 mt-1 block">Active desk portfolio</span>
                  </div>

                  {/* Card 2: Pending Review */}
                  <div className="bg-white p-4 rounded-xl border border-amber-200 shadow-2xs bg-amber-50/20">
                    <span className="text-[10px] font-bold text-amber-700 uppercase tracking-wider block">
                      Pending Review
                    </span>
                    <p className="text-2xl font-black text-amber-900 font-mono mt-1">{pendingReviewCount}</p>
                    <span className="text-[11px] text-amber-700 mt-1 block">Awaiting preliminary assessment</span>
                  </div>

                  {/* Card 3: Under Investigation */}
                  <div className="bg-white p-4 rounded-xl border border-indigo-200 shadow-2xs bg-indigo-50/20">
                    <span className="text-[10px] font-bold text-indigo-700 uppercase tracking-wider block">
                      Under Investigation
                    </span>
                    <p className="text-2xl font-black text-indigo-900 font-mono mt-1">{underInvestigationCount}</p>
                    <span className="text-[11px] text-indigo-700 mt-1 block">Forensic analysis in progress</span>
                  </div>

                  {/* Card 4: Evidence Verification */}
                  <div className="bg-white p-4 rounded-xl border border-blue-200 shadow-2xs bg-blue-50/20">
                    <span className="text-[10px] font-bold text-blue-700 uppercase tracking-wider block">
                      Evidence Verification
                    </span>
                    <p className="text-2xl font-black text-blue-900 font-mono mt-1">{evidenceVerificationCount}</p>
                    <span className="text-[11px] text-blue-700 mt-1 block">Bank &amp; ISP notices dispatched</span>
                  </div>

                  {/* Card 5: Resolved */}
                  <div className="bg-white p-4 rounded-xl border border-emerald-200 shadow-2xs bg-emerald-50/20">
                    <span className="text-[10px] font-bold text-emerald-700 uppercase tracking-wider block">
                      Cases Resolved
                    </span>
                    <p className="text-2xl font-black text-emerald-900 font-mono mt-1">{casesResolvedCount}</p>
                    <span className="text-[11px] text-emerald-700 mt-1 block">Funds frozen / refund completed</span>
                  </div>
                </div>
              </div>

              {/* Quick Jump Callout to Fraud Intelligence */}
              <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white rounded-2xl p-6 shadow-md border border-slate-800 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                <div>
                  <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 text-[10px] font-bold uppercase tracking-wider mb-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-indigo-400"></span>
                    Integrated Pattern Engine
                  </div>
                  <h3 className="text-lg font-bold text-white">Cross-Incident Fraud Intelligence Analysis</h3>
                  <p className="text-xs text-slate-300 max-w-2xl mt-1 leading-relaxed">
                    Compare suspect UPI VPAs, phone numbers, email domains, and phishing URLs across all citizen reports using the interactive bipartite network graph.
                  </p>
                </div>
                <Link
                  to="/intelligence"
                  className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-bold transition-colors shadow-sm shrink-0"
                >
                  Launch Fraud Intelligence Engine →
                </Link>
              </div>

              {/* Assigned Cases Table */}
              <AssignedCasesTable
                cases={cases}
                onInspectCase={(c) => setInspectedCase(c)}
                onQuickStatusChange={handleQuickStatusChange}
              />
            </div>
          )}

          {/* TAB 2: ASSIGNED CASES */}
          {activeTab === 'assigned-cases' && (
            <div className="space-y-6">
              <AssignedCasesTable
                cases={cases}
                onInspectCase={(c) => setInspectedCase(c)}
                onQuickStatusChange={handleQuickStatusChange}
              />
            </div>
          )}

          {/* TAB 3: EVIDENCE REVIEW */}
          {activeTab === 'evidence-review' && (
            <EvidenceReviewSection
              cases={cases}
              onInspectCase={(c) => setInspectedCase(c)}
            />
          )}

          {/* TAB 5: INVESTIGATION HISTORY */}
          {activeTab === 'history' && (
            <InvestigationHistorySection
              cases={cases}
              onInspectCase={(c) => setInspectedCase(c)}
            />
          )}

          {/* TAB 6: OFFICER PROFILE */}
          {activeTab === 'profile' && (
            <InvestigatorProfileSection
              currentUser={currentUser}
              assignedCount={totalAssignedCases}
              resolvedCount={casesResolvedCount}
            />
          )}
        </main>
      </div>

      {/* Case Details Inspection Dossier Modal */}
      {inspectedCase && (
        <CaseDetailModal
          caseItem={inspectedCase}
          onClose={() => setInspectedCase(null)}
          onUpdateStatus={handleUpdateStatus}
        />
      )}
    </div>
  );
}
