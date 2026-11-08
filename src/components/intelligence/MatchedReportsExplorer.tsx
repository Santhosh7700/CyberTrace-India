import { useState } from 'react';
import type { SyntheticReport, MatchedIndicator, IndicatorType } from '../../types/intelligence';
import type { IndicatorFilter } from './IndicatorAnalysisSection';
import { maskIndicator } from '../../services/intelligenceEngine';

interface Props {
  reports: SyntheticReport[];
  indicators: MatchedIndicator[];
  /** Legacy cluster filter — set when user clicks "View Pattern" from PatternDetectionSection */
  selectedRefsFilter?: string[];
  onClearRefsFilter?: () => void;
  /** New precise indicator filter — set when user clicks "View X Cases" from IndicatorAnalysisSection */
  activeIndicatorFilter?: IndicatorFilter;
  onClearIndicatorFilter?: () => void;
  /** Shared mask preference controlled by parent (FraudIntelligencePage). */
  maskSensitive: boolean;
}

export default function MatchedReportsExplorer({
  reports,
  indicators,
  selectedRefsFilter,
  onClearRefsFilter,
  activeIndicatorFilter,
  onClearIndicatorFilter,
  maskSensitive,
}: Props) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');
  const [selectedType, setSelectedType] = useState<string>('ALL');
  const [inspectReport, setInspectReport] = useState<SyntheticReport | null>(null);

  /**
   * Build table rows.
   * When activeIndicatorFilter is set, the "Matching Indicator" for every row
   * is ALWAYS the filtered indicator — not an arbitrary first match.
   * When only selectedRefsFilter is set (pattern cluster), we fall back to
   * finding the best-matching indicator per report.
   */
  const reportRows = reports.map((rep) => {
    if (activeIndicatorFilter) {
      // The report must contain this exact normalized indicator
      const hasThisIndicator = rep.suspectIdentifiers?.some(
        (ident) => ident.type === activeIndicatorFilter.type && ident.normalized === activeIndicatorFilter.value
      ) ?? false;

      return {
        report: rep,
        matchingIndicator: activeIndicatorFilter.displayValue,
        indicatorType: activeIndicatorFilter.type as IndicatorType | 'none',
        sharedReportsCount: activeIndicatorFilter.count,
        isPatternMatched: hasThisIndicator,
        inActiveFilter: hasThisIndicator,
      };
    }

    // No activeIndicatorFilter — find any matched indicator with count >= 2
    const matchingInds = indicators.filter((ind) => ind.reportIds.includes(rep.id) && ind.count >= 2);
    // Pick the highest-count indicator (most significant match)
    const primaryInd = matchingInds.sort((a, b) => b.count - a.count)[0];

    return {
      report: rep,
      matchingIndicator: primaryInd ? primaryInd.displayValue : 'None (Isolated)',
      indicatorType: (primaryInd ? primaryInd.type : 'none') as IndicatorType | 'none',
      sharedReportsCount: primaryInd ? primaryInd.count : 1,
      isPatternMatched: matchingInds.length > 0,
      inActiveFilter: true, // No indicator filter active — all pass
    };
  });

  const filteredRows = reportRows.filter((row) => {
    // 1. If activeIndicatorFilter is set, only show reports that contain this indicator
    if (activeIndicatorFilter) {
      if (!row.inActiveFilter) return false;
    } else if (selectedRefsFilter && selectedRefsFilter.length > 0) {
      // 2. Cluster filter from pattern section
      if (!selectedRefsFilter.includes(row.report.referenceId)) return false;
    }

    // 3. Category filter
    if (selectedCategory !== 'ALL' && row.report.category !== selectedCategory) return false;

    // 4. Indicator Type filter (only relevant when no activeIndicatorFilter active)
    if (!activeIndicatorFilter && selectedType !== 'ALL' && row.indicatorType !== selectedType) return false;

    // 5. Text Search
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    const refMatch = row.report.referenceId.toLowerCase().includes(q);
    const catMatch = row.report.category.toLowerCase().includes(q);
    const indMatch = row.matchingIndicator.toLowerCase().includes(q);
    const descMatch = row.report.description.toLowerCase().includes(q);
    return refMatch || catMatch || indMatch || descMatch;
  });

  const getMaskedIndicator = (displayValue: string, type: IndicatorType | 'none'): string => {
    if (!maskSensitive || type === 'none') return displayValue;
    return maskIndicator(displayValue, type as IndicatorType);
  };

  return (
    <div className="bg-white rounded-xl border border-slate-200/90 shadow-2xs overflow-hidden">
      {/* Header */}
      <div className="p-5 border-b border-slate-100 flex flex-col md:flex-row md:items-start md:justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2 text-blue-700 text-xs font-bold uppercase tracking-wider mb-0.5">
            <span className="w-2 h-2 rounded-full bg-blue-600"></span>
            <span>Investigative Case Explorer</span>
          </div>
          <h3 className="text-base font-bold text-slate-900">Pattern-Matched Reports Dossier</h3>
          <p className="text-xs text-slate-500">
            Inspect individual synthetic citizen reports linked by the pattern detection engine
          </p>
        </div>

        <div className="flex flex-col gap-2 self-start md:self-auto">
          {/* Active Indicator Filter badge */}
          {activeIndicatorFilter && (
            <div className="flex items-center space-x-2 bg-indigo-50 border border-indigo-200 px-3 py-1.5 rounded-lg text-xs">
              <span className="text-[10px] uppercase font-bold text-indigo-700 bg-indigo-100 px-1.5 py-0.5 rounded">
                {activeIndicatorFilter.type}
              </span>
              <span className="text-indigo-900 font-mono font-semibold">
                {maskSensitive
                  ? maskIndicator(activeIndicatorFilter.displayValue, activeIndicatorFilter.type)
                  : activeIndicatorFilter.displayValue}
              </span>
              <span className="text-indigo-700">({activeIndicatorFilter.count} reports)</span>
              {onClearIndicatorFilter && (
                <button
                  onClick={onClearIndicatorFilter}
                  className="text-indigo-700 hover:text-indigo-900 font-bold ml-1"
                >
                  Clear ✕
                </button>
              )}
            </div>
          )}

          {/* Legacy cluster filter badge */}
          {!activeIndicatorFilter && selectedRefsFilter && (
            <div className="flex items-center space-x-2 bg-blue-50 border border-blue-200 px-3 py-1.5 rounded-lg text-xs">
              <span className="text-blue-900 font-semibold">Filtering by Cluster: {selectedRefsFilter.length} Reports</span>
              <button
                onClick={onClearRefsFilter}
                className="text-blue-700 hover:text-blue-900 font-bold ml-1"
              >
                Clear ✕
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="p-4 bg-slate-50/70 border-b border-slate-200 flex flex-col sm:flex-row sm:items-center gap-3">
        {/* Search */}
        <div className="relative flex-1">
          <input
            type="text"
            placeholder="Search by Case Ref, Category, Suspect Indicator, or Description..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-3 pr-4 py-2 rounded-lg border border-slate-200 text-xs bg-white focus:outline-none focus:border-blue-600"
          />
        </div>

        {/* Category filter */}
        <select
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
          className="text-xs border border-slate-200 rounded-lg px-3 py-2 bg-white focus:outline-none focus:border-blue-600"
        >
          <option value="ALL">All Scam Categories</option>
          <option value="UPI Fraud">UPI Fraud</option>
          <option value="Fake Investment">Fake Investment</option>
          <option value="Phishing">Phishing</option>
          <option value="Job Scam">Job Scam</option>
          <option value="Online Shopping Fraud">Online Shopping Fraud</option>
          <option value="Social Media Scam">Social Media Scam</option>
          <option value="Other">Other</option>
        </select>

        {/* Indicator Type filter — only shown when no activeIndicatorFilter active */}
        {!activeIndicatorFilter && (
          <select
            value={selectedType}
            onChange={(e) => setSelectedType(e.target.value)}
            className="text-xs border border-slate-200 rounded-lg px-3 py-2 bg-white focus:outline-none focus:border-blue-600"
          >
            <option value="ALL">All Indicator Types</option>
            <option value="upi">UPI ID</option>
            <option value="phone">Phone Number</option>
            <option value="url">Website / URL</option>
            <option value="email">Email</option>
          </select>
        )}

        <span className="text-xs text-slate-500 shrink-0">
          {filteredRows.length} of {reports.length} reports
        </span>
      </div>

      {/* Explorer Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs">
          <thead className="bg-slate-50 text-slate-500 uppercase tracking-wider font-semibold border-b border-slate-200">
            <tr>
              <th className="py-3 px-4">Case Reference ID</th>
              <th className="py-3 px-4">Scam Category</th>
              <th className="py-3 px-4">Report Date</th>
              <th className="py-3 px-4">Matching Indicator</th>
              <th className="py-3 px-4">Indicator Type</th>
              <th className="py-3 px-4 text-center">Shared Reports</th>
              <th className="py-3 px-4">Pattern Status</th>
              <th className="py-3 px-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 font-medium">
            {filteredRows.length === 0 ? (
              <tr>
                <td colSpan={8} className="py-10 text-center text-xs text-slate-400">
                  No reports match the current filter criteria.
                </td>
              </tr>
            ) : (
              filteredRows.map((row) => (
                <tr key={row.report.id} className="hover:bg-slate-50/70 transition-colors">
                  {/* Case Ref */}
                  <td className="py-3.5 px-4 font-mono font-bold text-blue-700">{row.report.referenceId}</td>

                  {/* Category */}
                  <td className="py-3.5 px-4 text-slate-900">{row.report.category}</td>

                  {/* Date */}
                  <td className="py-3.5 px-4 text-slate-500 font-mono text-[11px]">{row.report.reportedDate}</td>

                  {/* Matching Indicator — always reflects the active filter */}
                  <td className="py-3.5 px-4 font-mono text-slate-800">
                    <span className="truncate max-w-xs block">
                      {getMaskedIndicator(row.matchingIndicator, row.indicatorType)}
                    </span>
                  </td>

                  {/* Indicator Type */}
                  <td className="py-3.5 px-4">
                    {row.indicatorType !== 'none' ? (
                      <span
                        className={`uppercase text-[10px] font-bold px-2 py-0.5 rounded ${
                          row.indicatorType === 'upi'
                            ? 'bg-blue-100 text-blue-800'
                            : row.indicatorType === 'phone'
                            ? 'bg-green-100 text-green-800'
                            : row.indicatorType === 'email'
                            ? 'bg-purple-100 text-purple-800'
                            : 'bg-orange-100 text-orange-800'
                        }`}
                      >
                        {row.indicatorType}
                      </span>
                    ) : (
                      <span className="text-slate-400 text-[10px]">None</span>
                    )}
                  </td>

                  {/* Shared Reports */}
                  <td className="py-3.5 px-4 text-center">
                    <span
                      className={`inline-flex items-center justify-center w-6 h-6 rounded-full font-bold text-xs ${
                        row.sharedReportsCount >= 4
                          ? 'bg-rose-100 text-rose-800'
                          : row.sharedReportsCount >= 2
                          ? 'bg-amber-100 text-amber-800'
                          : 'bg-slate-100 text-slate-600'
                      }`}
                    >
                      {row.sharedReportsCount}
                    </span>
                  </td>

                  {/* Pattern Status */}
                  <td className="py-3.5 px-4">
                    {row.isPatternMatched ? (
                      <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold bg-rose-50 text-rose-700 border border-rose-200">
                        Linked to Pattern
                      </span>
                    ) : (
                      <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-medium bg-slate-100 text-slate-600">
                        Isolated Case
                      </span>
                    )}
                  </td>

                  {/* Actions */}
                  <td className="py-3.5 px-4 text-right">
                    <button
                      type="button"
                      onClick={() => setInspectReport(row.report)}
                      className="px-2.5 py-1 text-xs font-semibold text-blue-700 bg-blue-50 hover:bg-blue-100 rounded transition-colors"
                    >
                      Inspect
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* =====================================================================
          INDIVIDUAL CT CASE DOSSIER MODAL
          Shows ALL identifiers recorded on this report (not just matched one)
          ===================================================================== */}
      {inspectReport && (
        <div
          role="button"
          tabIndex={0}
          aria-label="Close dossier modal"
          className="fixed inset-0 z-50 bg-black/70 flex items-center justify-center p-4 cursor-pointer"
          onClick={() => setInspectReport(null)}
          onKeyDown={(e) => {
            if (e.key === 'Escape' || e.key === 'Enter') {
              setInspectReport(null);
            }
          }}
        >
          <div
            className="bg-white rounded-2xl max-w-xl w-full p-6 shadow-2xl overflow-hidden relative cursor-auto max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between pb-3 border-b border-slate-200">
              <div>
                <span className="text-[10px] uppercase font-bold text-blue-700 tracking-wider">
                  Synthetic Case Dossier
                </span>
                <h4 className="font-mono text-lg font-extrabold text-slate-900">{inspectReport.referenceId}</h4>
              </div>
              <button
                type="button"
                onClick={() => setInspectReport(null)}
                className="text-slate-400 hover:text-slate-700 text-lg font-bold"
              >
                ✕
              </button>
            </div>

            <div className="my-4 space-y-3 text-xs">
              <div className="grid grid-cols-2 gap-3 p-3 bg-slate-50 rounded-xl border border-slate-200/80">
                <div>
                  <span className="text-slate-400 text-[10px] block">Victim Pseudonym</span>
                  <span className="font-semibold text-slate-800">{inspectReport.victimName}</span>
                </div>
                <div>
                  <span className="text-slate-400 text-[10px] block">Financial Loss</span>
                  <span className="font-bold text-slate-900">₹{inspectReport.amountLost.toLocaleString('en-IN')}</span>
                </div>
                <div>
                  <span className="text-slate-400 text-[10px] block">Category</span>
                  <span className="font-medium text-blue-800">{inspectReport.category}</span>
                </div>
                <div>
                  <span className="text-slate-400 text-[10px] block">Reported Date</span>
                  <span className="font-mono text-slate-700">{inspectReport.reportedDate}</span>
                </div>
                <div>
                  <span className="text-slate-400 text-[10px] block">Platform</span>
                  <span className="font-semibold text-slate-700">{inspectReport.platform}</span>
                </div>
              </div>

              {/* ALL Suspect Identifiers on this report */}
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200/80">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-slate-400 text-[10px] font-bold uppercase tracking-wider">
                    All Reported Suspect Identifiers
                  </span>
                  {activeIndicatorFilter && (
                    <span className="text-[10px] text-indigo-700 bg-indigo-50 border border-indigo-200 px-2 py-0.5 rounded font-semibold">
                      Filter: {activeIndicatorFilter.type.toUpperCase()}
                    </span>
                  )}
                </div>

                {/* Render from structured suspectIdentifiers if available */}
                {inspectReport.suspectIdentifiers && inspectReport.suspectIdentifiers.length > 0 ? (
                  <div className="space-y-1.5">
                    {inspectReport.suspectIdentifiers.map((ident, idx) => {
                      // Highlight the identifier that matched the active filter
                      const isActiveMatch =
                        activeIndicatorFilter &&
                        ident.type === activeIndicatorFilter.type &&
                        ident.normalized === activeIndicatorFilter.value;

                      const displayVal = maskSensitive
                        ? maskIndicator(ident.value, ident.type)
                        : ident.value;

                      return (
                        <div
                          key={idx}
                          className={`flex items-center space-x-2 px-2.5 py-1.5 rounded-lg border font-mono text-[11px] ${
                            isActiveMatch
                              ? 'bg-indigo-50 border-indigo-300 text-indigo-900'
                              : 'bg-white border-slate-200 text-slate-800'
                          }`}
                        >
                          <span
                            className={`text-[10px] uppercase font-bold px-1.5 py-0.5 rounded shrink-0 ${
                              ident.type === 'upi'
                                ? 'bg-blue-100 text-blue-800'
                                : ident.type === 'phone'
                                ? 'bg-green-100 text-green-800'
                                : ident.type === 'email'
                                ? 'bg-purple-100 text-purple-800'
                                : 'bg-orange-100 text-orange-800'
                            }`}
                          >
                            {ident.type}
                          </span>
                          <span className="break-all">{displayVal}</span>
                          {isActiveMatch && (
                            <span className="text-[10px] text-indigo-700 font-semibold shrink-0">← match</span>
                          )}
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  /* Fallback to legacy flat fields */
                  <div className="space-y-1.5">
                    {inspectReport.suspectUpi && (
                      <p className="font-mono text-slate-800 text-[11px]">
                        <strong className="text-blue-700 uppercase text-[10px] mr-2">UPI</strong>
                        {maskSensitive ? maskIndicator(inspectReport.suspectUpi, 'upi') : inspectReport.suspectUpi}
                      </p>
                    )}
                    {inspectReport.suspectPhone && (
                      <p className="font-mono text-slate-800 text-[11px]">
                        <strong className="text-green-700 uppercase text-[10px] mr-2">Phone</strong>
                        {maskSensitive ? maskIndicator(inspectReport.suspectPhone, 'phone') : inspectReport.suspectPhone}
                      </p>
                    )}
                    {inspectReport.suspectUrl && (
                      <p className="font-mono text-slate-800 text-[11px]">
                        <strong className="text-orange-700 uppercase text-[10px] mr-2">URL</strong>
                        {inspectReport.suspectUrl}
                      </p>
                    )}
                    {inspectReport.suspectEmail && (
                      <p className="font-mono text-slate-800 text-[11px]">
                        <strong className="text-purple-700 uppercase text-[10px] mr-2">Email</strong>
                        {maskSensitive ? maskIndicator(inspectReport.suspectEmail, 'email') : inspectReport.suspectEmail}
                      </p>
                    )}
                  </div>
                )}
              </div>

              {/* Description */}
              <div>
                <span className="text-slate-400 text-[10px] font-bold uppercase tracking-wider block mb-1">
                  Incident Narrative
                </span>
                <p className="p-3 rounded-xl bg-slate-50 border border-slate-200 text-slate-700 leading-relaxed">
                  {inspectReport.description}
                </p>
              </div>
            </div>

            <div className="pt-3 border-t border-slate-200 text-right">
              <button
                type="button"
                onClick={() => setInspectReport(null)}
                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-semibold"
              >
                Close Dossier
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
