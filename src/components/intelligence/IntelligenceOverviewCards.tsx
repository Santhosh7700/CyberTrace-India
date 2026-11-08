import type { IntelligenceSummary } from '../../types/intelligence';

interface Props {
  summary: IntelligenceSummary;
}

export default function IntelligenceOverviewCards({ summary }: Props) {
  const cards = [
    {
      label: 'Reports Analysed',
      val: summary.totalReports,
      desc: 'Synthetic incidents processed',
      color: 'blue',
      icon: 'reports',
    },
    {
      label: 'Unique UPI IDs',
      val: summary.uniqueUpis,
      desc: 'Distinct payment handles',
      color: 'indigo',
      icon: 'upi',
    },
    {
      label: 'Repeated Phone Numbers',
      val: summary.repeatedPhones,
      desc: 'Linked to multiple victims',
      color: 'amber',
      icon: 'phone',
    },
    {
      label: 'Suspicious URLs',
      val: summary.suspiciousUrls,
      desc: 'Phishing & counterfeit domains',
      color: 'rose',
      icon: 'url',
    },
    {
      label: 'Connected Patterns',
      val: summary.patternsCount,
      desc: 'Multi-report fraud clusters',
      color: 'purple',
      icon: 'patterns',
    },
    {
      label: 'Requires Investigation',
      val: summary.requiresReviewCount,
      desc: 'High & medium risk clusters',
      color: 'emerald',
      icon: 'review',
    },
  ];

  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mb-4">
        <div>
          <h2 className="text-lg font-bold text-slate-900">Pattern Analysis Overview</h2>
          <p className="text-xs text-slate-500">
            Real-time heuristic aggregations computed directly from 18 synthetic incident reports
          </p>
        </div>
        <span className="text-xs font-semibold px-2.5 py-1 rounded-md bg-blue-50 text-blue-800 border border-blue-200 self-start sm:self-auto font-mono">
          Engine Status: Active (100% In-Memory)
        </span>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        {cards.map((c) => (
          <div
            key={c.label}
            className="bg-white rounded-xl border border-slate-200/90 p-4 shadow-2xs hover:shadow-sm transition-shadow flex flex-col justify-between"
          >
            <div>
              <p className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">{c.label}</p>
              <p className="text-2xl font-black text-slate-900 mt-1">{c.val}</p>
            </div>
            <p className="text-[10px] text-slate-400 mt-2 border-t border-slate-100 pt-1.5 leading-tight">{c.desc}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
