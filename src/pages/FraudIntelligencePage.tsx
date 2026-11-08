import { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { SYNTHETIC_REPORTS } from '../data/syntheticReports';
import { analyzeReports } from '../services/intelligenceEngine';
import IntelligenceOverviewCards from '../components/intelligence/IntelligenceOverviewCards';
import IndicatorAnalysisSection from '../components/intelligence/IndicatorAnalysisSection';
import type { IndicatorFilter } from '../components/intelligence/IndicatorAnalysisSection';
import PatternDetectionSection from '../components/intelligence/PatternDetectionSection';
import InteractiveNetworkGraph from '../components/intelligence/InteractiveNetworkGraph';
import AnalyticsVisualizations from '../components/intelligence/AnalyticsVisualizations';
import MatchedReportsExplorer from '../components/intelligence/MatchedReportsExplorer';
import CategorySummaryWidget from '../components/intelligence/CategorySummaryWidget';

const MASK_PREF_KEY = 'cybertrace_mask_sensitive';

function getInitialMaskPref(): boolean {
  try {
    const stored = localStorage.getItem(MASK_PREF_KEY);
    if (stored !== null) return stored === 'true';
  } catch {
    // localStorage unavailable — fall through to default
  }
  return true; // default: masked
}

export default function FraudIntelligencePage() {
  const [activeTab, setActiveTab] = useState<'overview' | 'graph' | 'indicators' | 'explorer' | 'analytics'>(
    'overview'
  );

  // ── Shared Mask Sensitive Data preference (persisted to localStorage) ──────
  const [maskSensitive, setMaskSensitive] = useState<boolean>(getInitialMaskPref);

  const handleMaskChange = (checked: boolean) => {
    setMaskSensitive(checked);
    try {
      localStorage.setItem(MASK_PREF_KEY, String(checked));
    } catch {
      // ignore if localStorage is unavailable
    }
  };

  // Legacy cluster filter — set by PatternDetectionSection or category widget
  const [selectedClusterRefs, setSelectedClusterRefs] = useState<string[] | undefined>(undefined);

  // Precise indicator filter — set by IndicatorAnalysisSection "View X Cases" button
  const [activeIndicatorFilter, setActiveIndicatorFilter] = useState<IndicatorFilter | undefined>(undefined);

  const [selectedCategoryFilter, setSelectedCategoryFilter] = useState<string>('ALL');

  // Run the in-memory Pattern Detection Engine on the synthetic dataset
  const analysisResult = useMemo(() => {
    return analyzeReports(SYNTHETIC_REPORTS);
  }, []);

  /** Called by PatternDetectionSection "View Pattern" button */
  const handleSelectCluster = (refs: string[]) => {
    setActiveIndicatorFilter(undefined); // clear precise filter
    setSelectedClusterRefs(refs);
    setActiveTab('explorer');
  };

  /** Called by IndicatorAnalysisSection "View X Cases" button — passes full indicator context */
  const handleSelectIndicatorFilter = (filter: IndicatorFilter) => {
    setSelectedClusterRefs(undefined);  // clear legacy cluster filter
    setActiveIndicatorFilter(filter);
    setActiveTab('explorer');
  };

  const handleCategoryWidgetSelect = (category: string) => {
    setSelectedCategoryFilter(category);
    setActiveIndicatorFilter(undefined);
    if (category !== 'ALL') {
      const matchingRefs = SYNTHETIC_REPORTS.filter((r) => r.category === category).map((r) => r.referenceId);
      setSelectedClusterRefs(matchingRefs);
      setActiveTab('explorer');
    } else {
      setSelectedClusterRefs(undefined);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 font-sans flex flex-col">
      {/* Top Intelligence Navbar */}
      <header className="bg-slate-900 border-b border-slate-800 text-white sticky top-0 z-40 shadow-md">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-10 flex items-center justify-between h-16">
          {/* Brand & Demo Pill */}
          <div className="flex items-center space-x-3">
            <Link to="/" className="flex items-center space-x-2 text-white font-bold text-lg tracking-tight">
              <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center text-white">
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
              </div>
              <span>CyberTrace</span>
            </Link>
            <span className="text-slate-500 text-sm hidden sm:inline">|</span>
            <div className="flex items-center space-x-2">
              <span className="text-xs font-bold text-blue-400 uppercase tracking-wider">Fraud Intelligence Engine</span>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/40">
                PROTOTYPE • SYNTHETIC DATA
              </span>
            </div>
          </div>

          {/* Quick Exit to Citizen Portal */}
          <div className="flex items-center space-x-3">
            {/* ── Shared Mask Sensitive Data toggle ── */}
            <label className="flex items-center space-x-2 text-xs font-medium text-slate-300 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={maskSensitive}
                onChange={(e) => handleMaskChange(e.target.checked)}
                className="rounded text-blue-500 focus:ring-blue-500 w-3.5 h-3.5"
              />
              <span>Mask Sensitive Data</span>
            </label>
            <Link
              to="/dashboard"
              className="text-xs font-semibold px-3 py-1.5 rounded-lg bg-slate-800 text-slate-300 hover:text-white hover:bg-slate-700 transition-colors"
            >
              Citizen Portal →
            </Link>
          </div>
        </div>
      </header>

      {/* Demo Advisory Alert */}
      <div className="bg-blue-900/90 text-blue-100 text-xs px-4 py-2 border-b border-blue-800 text-center">
        <strong>Investigative Prototype Notice:</strong> Algorithmic pattern matching across 18 synthetic victim reports. Matching indicators provide exploratory leads and do not constitute legal proof of culpability.
      </div>

      {/* Navigation Sub-Tabs */}
      <div className="bg-white border-b border-slate-200">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-10 flex space-x-6 overflow-x-auto">
          {[
            { id: 'overview', label: 'Intelligence Overview & Patterns' },
            { id: 'graph', label: 'Relationship Network Graph' },
            { id: 'indicators', label: 'Indicator Analysis' },
            { id: 'explorer', label: 'Matched Reports Dossier' },
            { id: 'analytics', label: 'Visual Analytics (6 Dimensions)' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as typeof activeTab)}
              className={`py-3.5 text-xs font-bold border-b-2 whitespace-nowrap transition-colors ${
                activeTab === tab.id
                  ? 'border-blue-700 text-blue-700'
                  : 'border-transparent text-slate-600 hover:text-slate-900'
              }`}
            >
              {tab.label}
              {/* Badge when explorer has an active indicator filter */}
              {tab.id === 'explorer' && activeIndicatorFilter && (
                <span className="ml-1.5 text-[10px] px-1.5 py-0.5 rounded-full bg-indigo-100 text-indigo-800 font-semibold">
                  {activeIndicatorFilter.type.toUpperCase()} filter
                </span>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Main Workspace Body */}
      <main className="flex-1 p-4 sm:p-6 lg:p-10 max-w-[1400px] w-full mx-auto space-y-8">
        {/* COMPACT CATEGORY SUMMARY WIDGET (Parts 3 & 6) */}
        <CategorySummaryWidget
          reports={SYNTHETIC_REPORTS}
          selectedCategory={selectedCategoryFilter}
          onSelectCategory={handleCategoryWidgetSelect}
        />

        {/* TAB 1: OVERVIEW & DETECTED PATTERNS */}
        {activeTab === 'overview' && (
          <div className="space-y-8">
            <IntelligenceOverviewCards summary={analysisResult.summary} />
            <PatternDetectionSection
              patterns={analysisResult.patterns}
              onSelectPatternReportRefs={handleSelectCluster}
            />

            {/* Embedded interactive network graph preview */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-base font-bold text-slate-900">Incident Relationship Network Graph</h3>
                  <p className="text-xs text-slate-500">Visual link topology connecting victim complaints to shared indicators</p>
                </div>
                <button
                  onClick={() => setActiveTab('graph')}
                  className="text-xs font-semibold text-blue-700 hover:text-blue-800"
                >
                  Full Graph View →
                </button>
              </div>
              <InteractiveNetworkGraph
                reports={SYNTHETIC_REPORTS}
                matchedIndicators={analysisResult.matchedIndicators}
                onOpenReportDetails={(ref: string) => {
                  setActiveIndicatorFilter(undefined);
                  setSelectedClusterRefs([ref]);
                  setActiveTab('explorer');
                }}
              />
            </div>
          </div>
        )}

        {/* TAB 2: INTERACTIVE NETWORK GRAPH (Full View) */}
        {activeTab === 'graph' && (
          <div className="space-y-4">
            <div>
              <h2 className="text-xl font-bold text-slate-900">Fraud Syndicate & Category Relationship Graph</h2>
              <p className="text-xs text-slate-500 mt-1">
                Deterministic bipartite link analysis: Inspect shared-indicator patterns or category-based incident classifications.
              </p>
            </div>
            <InteractiveNetworkGraph
              reports={SYNTHETIC_REPORTS}
              matchedIndicators={analysisResult.matchedIndicators}
              onOpenReportDetails={(ref: string) => {
                setActiveIndicatorFilter(undefined);
                setSelectedClusterRefs([ref]);
                setActiveTab('explorer');
              }}
            />
          </div>
        )}

        {/* TAB 3: INDICATOR ANALYSIS */}
        {activeTab === 'indicators' && (
          <div className="space-y-6">
            <IndicatorAnalysisSection
              indicators={analysisResult.matchedIndicators}
              onSelectIndicatorFilter={handleSelectIndicatorFilter}
              maskSensitive={maskSensitive}
            />
          </div>
        )}

        {/* TAB 4: MATCHED REPORTS EXPLORER */}
        {activeTab === 'explorer' && (
          <div className="space-y-6">
            <MatchedReportsExplorer
              reports={SYNTHETIC_REPORTS}
              indicators={analysisResult.matchedIndicators}
              selectedRefsFilter={selectedClusterRefs}
              onClearRefsFilter={() => setSelectedClusterRefs(undefined)}
              activeIndicatorFilter={activeIndicatorFilter}
              onClearIndicatorFilter={() => setActiveIndicatorFilter(undefined)}
              maskSensitive={maskSensitive}
            />
          </div>
        )}

        {/* TAB 5: VISUAL ANALYTICS (6 COMPLETE DIMENSIONS) */}
        {activeTab === 'analytics' && (
          <div className="space-y-6">
            <AnalyticsVisualizations
              reports={SYNTHETIC_REPORTS}
              indicators={analysisResult.matchedIndicators}
            />
          </div>
        )}
      </main>
    </div>
  );
}
