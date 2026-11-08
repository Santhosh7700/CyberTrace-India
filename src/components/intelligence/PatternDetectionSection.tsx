import type { FraudPattern } from '../../types/intelligence';

interface Props {
  patterns: FraudPattern[];
  onSelectPatternReportRefs: (refs: string[]) => void;
}

export default function PatternDetectionSection({ patterns, onSelectPatternReportRefs }: Props) {
  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
        <div>
          <div className="flex items-center space-x-2 text-rose-700 text-xs font-bold uppercase tracking-wider mb-0.5">
            <span className="w-2 h-2 rounded-full bg-rose-600 animate-pulse"></span>
            <span>Automated Pattern Detection Engine</span>
          </div>
          <h3 className="text-base font-bold text-slate-900">Detected Incident Syndicates & Shared Indicators</h3>
          <p className="text-xs text-slate-500">
            Algorithmic grouping of independent victim reports sharing exact normalized payment handles, phones, or URLs
          </p>
        </div>

        {/* Disclaimer Notice */}
        <div className="text-[11px] text-amber-800 bg-amber-50 px-3 py-1.5 rounded-lg border border-amber-200 max-w-md">
          <strong>Investigative Caution:</strong> A matching indicator represents a potential lead and does not establish criminal activity or prove liability without forensic verification.
        </div>
      </div>

      {patterns.length === 0 ? (
        <div className="bg-white rounded-xl border border-slate-200 p-8 text-center text-xs text-slate-400">
          No interconnected patterns detected across current reports.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {patterns.map((p) => {
            const isHigh = p.riskScore === 'High';
            return (
              <div
                key={p.id}
                className={`bg-white rounded-xl border p-5 shadow-2xs hover:shadow-md transition-all flex flex-col justify-between ${
                  isHigh ? 'border-rose-200 hover:border-rose-400' : 'border-amber-200 hover:border-amber-400'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider border ${
                        isHigh
                          ? 'bg-rose-50 text-rose-700 border-rose-200'
                          : 'bg-amber-50 text-amber-700 border-amber-200'
                      }`}
                    >
                      {p.riskScore} Risk Syndicate
                    </span>
                    <span className="text-xs font-bold text-slate-500 font-mono">
                      {p.connectedReportsCount} Reports
                    </span>
                  </div>

                  <h4 className="font-bold text-slate-900 text-sm leading-snug line-clamp-1">{p.title}</h4>
                  <p className="text-xs text-slate-600 mt-2 leading-relaxed">{p.summary}</p>

                  {/* Metrics snapshot */}
                  <div className="grid grid-cols-2 gap-2 my-4 p-2.5 rounded-lg bg-slate-50 border border-slate-100 text-[11px]">
                    <div>
                      <span className="text-slate-400 block text-[10px]">Combined Loss</span>
                      <span className="font-bold text-slate-900">₹{p.totalFinancialLoss.toLocaleString('en-IN')}</span>
                    </div>
                    <div>
                      <span className="text-slate-400 block text-[10px]">Date Span</span>
                      <span className="font-medium text-slate-700">{p.firstReportedDate.slice(5)} to {p.lastReportedDate.slice(5)}</span>
                    </div>
                  </div>

                  {/* Shared Category Badges */}
                  <div className="flex flex-wrap gap-1 mb-4">
                    {p.categories.map((c) => (
                      <span key={c} className="text-[10px] font-medium bg-slate-100 text-slate-600 px-2 py-0.5 rounded">
                        {c}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                  <span className="text-[11px] text-slate-400 font-mono">
                    Refs: {p.reportRefs.slice(0, 2).join(', ')}
                    {p.reportRefs.length > 2 && ` +${p.reportRefs.length - 2}`}
                  </span>
                  <button
                    type="button"
                    onClick={() => onSelectPatternReportRefs(p.reportRefs)}
                    className="text-xs font-semibold text-blue-700 hover:text-blue-800 flex items-center"
                  >
                    Explore Cluster
                    <svg className="w-3.5 h-3.5 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                    </svg>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
