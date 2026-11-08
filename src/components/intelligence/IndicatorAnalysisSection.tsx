import { useState } from 'react';
import type { MatchedIndicator, IndicatorType } from '../../types/intelligence';
import { maskIndicator } from '../../services/intelligenceEngine';

export interface IndicatorFilter {
  type: IndicatorType;
  value: string;         // normalized value used for matching
  displayValue: string;  // human-readable raw value
  reportRefs: string[];
  count: number;
}

interface Props {
  indicators: MatchedIndicator[];
  /** Called when the user clicks "View X Cases" on a repeated indicator. */
  onSelectIndicatorFilter?: (filter: IndicatorFilter) => void;
  /** Shared mask preference controlled by parent (FraudIntelligencePage). */
  maskSensitive: boolean;
}

export default function IndicatorAnalysisSection({ indicators, onSelectIndicatorFilter, maskSensitive }: Props) {
  const [activeTab, setActiveTab] = useState<IndicatorType>('upi');
  const [searchQuery, setSearchQuery] = useState('');

  const tabs: { id: IndicatorType; label: string; count: number }[] = [
    { id: 'upi', label: 'UPI ID Analysis', count: indicators.filter((i) => i.type === 'upi').length },
    { id: 'phone', label: 'Phone Numbers', count: indicators.filter((i) => i.type === 'phone').length },
    { id: 'url', label: 'Suspicious Websites / URLs', count: indicators.filter((i) => i.type === 'url').length },
    { id: 'email', label: 'Email Addresses', count: indicators.filter((i) => i.type === 'email').length },
  ];

  const currentIndicators = indicators.filter((item) => {
    if (item.type !== activeTab) return false;
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    const valMatch = item.displayValue.toLowerCase().includes(q);
    const catMatch = item.categories.some((c) => c.toLowerCase().includes(q));
    const refMatch = item.reportRefs.some((r) => r.toLowerCase().includes(q));
    return valMatch || catMatch || refMatch;
  });

  return (
    <div className="bg-white rounded-xl border border-slate-200/90 shadow-2xs overflow-hidden">
      {/* Section Header */}
      <div className="p-5 border-b border-slate-100 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2 text-indigo-700 text-xs font-bold uppercase tracking-wider mb-0.5">
            <span className="w-2 h-2 rounded-full bg-indigo-600"></span>
            <span>Indicator Aggregation &amp; Matching</span>
          </div>
          <h3 className="text-base font-bold text-slate-900">Extracted Suspect Indicators</h3>
          <p className="text-xs text-slate-500">
            Compare repeated indicators across all reports to expose multi-victim fraud nodes
          </p>
        </div>
      </div>

      {/* Indicator Type Tabs */}
      <div className="flex border-b border-slate-200 bg-slate-50/70 overflow-x-auto px-4">
        {tabs.map((t) => (
          <button
            key={t.id}
            onClick={() => setActiveTab(t.id)}
            className={`py-3 px-4 text-xs font-semibold border-b-2 whitespace-nowrap transition-colors flex items-center space-x-2 ${
              activeTab === t.id
                ? 'border-blue-700 text-blue-700 bg-white'
                : 'border-transparent text-slate-600 hover:text-slate-900'
            }`}
          >
            <span>{t.label}</span>
            <span
              className={`px-1.5 py-0.5 rounded-full text-[10px] ${
                activeTab === t.id ? 'bg-blue-100 text-blue-800' : 'bg-slate-200 text-slate-600'
              }`}
            >
              {t.count}
            </span>
          </button>
        ))}
      </div>

      {/* Search Input */}
      <div className="p-4 bg-white border-b border-slate-100">
        <input
          type="text"
          placeholder={`Filter ${activeTab.toUpperCase()} indicators by value, category, or report ref...`}
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg focus:outline-none focus:border-blue-600"
        />
      </div>

      {/* Indicators Table */}
      <div className="overflow-x-auto">
        {currentIndicators.length === 0 ? (
          <div className="p-8 text-center text-xs text-slate-400">
            No indicators found matching the query for this category.
          </div>
        ) : (
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-500 uppercase tracking-wider font-semibold border-b border-slate-200">
              <tr>
                <th className="py-3 px-4">Indicator Value</th>
                <th className="py-3 px-4 text-center">Connected Reports</th>
                <th className="py-3 px-4">Associated Categories</th>
                <th className="py-3 px-4">First Reported</th>
                <th className="py-3 px-4">Most Recent</th>
                <th className="py-3 px-4">Matching Status</th>
                <th className="py-3 px-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium">
              {currentIndicators.map((item) => {
                const displayVal = maskSensitive
                  ? maskIndicator(item.displayValue, item.type)
                  : item.displayValue;

                return (
                  <tr key={item.value} className="hover:bg-slate-50/70 transition-colors">
                    {/* Value */}
                    <td className="py-3.5 px-4 font-mono font-bold text-slate-900">
                      <div className="flex items-center space-x-2">
                        <span className="truncate max-w-xs">{displayVal}</span>
                        {item.count >= 2 && (
                          <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-rose-50 text-rose-700 border border-rose-200">
                            REPEATED
                          </span>
                        )}
                      </div>
                    </td>

                    {/* Count */}
                    <td className="py-3.5 px-4 text-center">
                      <span
                        className={`inline-flex items-center justify-center w-6 h-6 rounded-full font-extrabold text-xs ${
                          item.count >= 4
                            ? 'bg-rose-100 text-rose-800'
                            : item.count >= 2
                            ? 'bg-amber-100 text-amber-800'
                            : 'bg-slate-100 text-slate-700'
                        }`}
                      >
                        {item.count}
                      </span>
                    </td>

                    {/* Categories */}
                    <td className="py-3.5 px-4">
                      <div className="flex flex-wrap gap-1">
                        {item.categories.map((c) => (
                          <span
                            key={c}
                            className="text-[10px] bg-slate-100 text-slate-700 px-2 py-0.5 rounded border border-slate-200/60"
                          >
                            {c}
                          </span>
                        ))}
                      </div>
                    </td>

                    {/* Dates */}
                    <td className="py-3.5 px-4 text-slate-500 font-mono text-[11px]">{item.firstReportedDate}</td>
                    <td className="py-3.5 px-4 text-slate-700 font-mono text-[11px]">{item.lastReportedDate}</td>

                    {/* Status badge */}
                    <td className="py-3.5 px-4">
                      <span
                        className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold border ${
                          item.status === 'High Match'
                            ? 'bg-rose-50 text-rose-700 border-rose-200'
                            : item.status === 'Medium Match'
                            ? 'bg-amber-50 text-amber-700 border-amber-200'
                            : 'bg-slate-50 text-slate-600 border-slate-200'
                        }`}
                      >
                        {item.status} ({item.count} hits)
                      </span>
                    </td>

                    {/* Action */}
                    <td className="py-3.5 px-4 text-right">
                      {onSelectIndicatorFilter && item.count >= 2 ? (
                        <button
                          type="button"
                          onClick={() =>
                            onSelectIndicatorFilter({
                              type: item.type,
                              value: item.value,
                              displayValue: item.displayValue,
                              reportRefs: item.reportRefs,
                              count: item.count,
                            })
                          }
                          className="px-2.5 py-1 text-xs font-semibold text-blue-700 bg-blue-50 hover:bg-blue-100 rounded transition-colors"
                        >
                          View {item.count} Cases
                        </button>
                      ) : (
                        <span className="text-slate-400 text-[11px]">Single Case</span>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
