import { useMemo } from 'react';
import type { SyntheticReport, MatchedIndicator } from '../../types/intelligence';

interface Props {
  reports: SyntheticReport[];
  indicators: MatchedIndicator[];
}

export default function AnalyticsVisualizations({ reports, indicators }: Props) {
  // 1. Top Reported UPI IDs
  const topUpis = useMemo(() => {
    return indicators
      .filter((i) => i.type === 'upi')
      .slice(0, 5)
      .map((i) => ({
        label: i.displayValue,
        count: i.count,
        reportRefs: i.reportRefs,
      }));
  }, [indicators]);

  // 2. Top Reported Phone Numbers
  const topPhones = useMemo(() => {
    return indicators
      .filter((i) => i.type === 'phone')
      .slice(0, 5)
      .map((i) => ({
        label: i.displayValue,
        count: i.count,
        reportRefs: i.reportRefs,
      }));
  }, [indicators]);

  // 3. Suspicious URLs / Domains Distribution (NEW)
  const topUrls = useMemo(() => {
    return indicators
      .filter((i) => i.type === 'url')
      .slice(0, 5)
      .map((i) => ({
        label: i.displayValue,
        shortLabel: i.displayValue.replace(/^https?:\/\//, '').replace(/\/.*$/, ''),
        count: i.count,
        reportRefs: i.reportRefs,
      }));
  }, [indicators]);

  // 4. Email Address Distribution (NEW)
  const topEmails = useMemo(() => {
    return indicators
      .filter((i) => i.type === 'email')
      .slice(0, 5)
      .map((i) => ({
        label: i.displayValue,
        count: i.count,
        reportRefs: i.reportRefs,
      }));
  }, [indicators]);

  // 5. Category Distribution
  const categoryCounts = useMemo(() => {
    const map: Record<string, number> = {};
    reports.forEach((r) => {
      map[r.category] = (map[r.category] || 0) + 1;
    });
    return Object.entries(map).map(([cat, count]) => ({
      category: cat,
      count,
      percent: Math.round((count / reports.length) * 100),
    }));
  }, [reports]);

  // 6. Timeline trend (grouped by week/month interval)
  const timelineData = useMemo(() => {
    const map: Record<string, number> = {};
    reports.forEach((r) => {
      const monthDay = r.reportedDate.slice(5); // e.g. "10-02"
      map[monthDay] = (map[monthDay] || 0) + 1;
    });
    return Object.entries(map)
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([date, count]) => ({ date, count }));
  }, [reports]);

  const maxUpiCount = Math.max(...topUpis.map((u) => u.count), 1);
  const maxPhoneCount = Math.max(...topPhones.map((p) => p.count), 1);
  const maxUrlCount = Math.max(...topUrls.map((u) => u.count), 1);
  const maxEmailCount = Math.max(...topEmails.map((e) => e.count), 1);

  return (
    <div className="space-y-6">
      <div className="border-b border-slate-200 pb-3">
        <h3 className="text-base font-bold text-slate-900">Fraud Intelligence & Pattern Analytics</h3>
        <p className="text-xs text-slate-500">
          Six dynamic analytical dimensions compiled directly from 18 synthetic incident records
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* CHART 1: Top Reported UPI IDs (Horizontal Bar) */}
        <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-2xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                1. UPI VPA Distribution
              </h4>
              <span className="text-[10px] text-blue-600 font-mono font-bold">Top Handles</span>
            </div>

            <div className="space-y-3.5">
              {topUpis.map((item) => {
                const widthPct = Math.round((item.count / maxUpiCount) * 100);
                return (
                  <div key={item.label} className="space-y-1">
                    <div className="flex justify-between items-baseline text-xs">
                      <span className="font-mono font-semibold text-slate-800 truncate max-w-[200px]" title={item.label}>
                        {item.label}
                      </span>
                      <span className="font-bold text-blue-700 font-mono">{item.count} report{item.count > 1 ? 's' : ''}</span>
                    </div>
                    <div className="w-full bg-slate-100 rounded-full h-2.5 overflow-hidden">
                      <div
                        className="bg-blue-600 h-2.5 rounded-full transition-all duration-500"
                        style={{ width: `${widthPct}%` }}
                      />
                    </div>
                    <div className="text-[10px] text-slate-400 font-mono truncate">
                      Refs: {item.reportRefs.join(', ')}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* CHART 2: Top Reported Phone Numbers (Horizontal Bar) */}
        <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-2xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                2. Phone Number Distribution
              </h4>
              <span className="text-[10px] text-amber-600 font-mono font-bold">Top Contacts</span>
            </div>

            <div className="space-y-3.5">
              {topPhones.map((item) => {
                const widthPct = Math.round((item.count / maxPhoneCount) * 100);
                return (
                  <div key={item.label} className="space-y-1">
                    <div className="flex justify-between items-baseline text-xs">
                      <span className="font-mono font-semibold text-slate-800">{item.label}</span>
                      <span className="font-bold text-amber-600 font-mono">{item.count} report{item.count > 1 ? 's' : ''}</span>
                    </div>
                    <div className="w-full bg-slate-100 rounded-full h-2.5 overflow-hidden">
                      <div
                        className="bg-amber-500 h-2.5 rounded-full transition-all duration-500"
                        style={{ width: `${widthPct}%` }}
                      />
                    </div>
                    <div className="text-[10px] text-slate-400 font-mono truncate">
                      Refs: {item.reportRefs.join(', ')}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* CHART 3: Suspicious URL Distribution (NEW Horizontal Bar) */}
        <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-2xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                3. Suspicious URL Distribution
              </h4>
              <span className="text-[10px] text-rose-600 font-mono font-bold">Phishing & Web</span>
            </div>

            <div className="space-y-3.5">
              {topUrls.map((item) => {
                const widthPct = Math.round((item.count / maxUrlCount) * 100);
                return (
                  <div key={item.label} className="space-y-1">
                    <div className="flex justify-between items-baseline text-xs">
                      <span className="font-mono font-semibold text-slate-800 truncate max-w-[200px]" title={item.label}>
                        {item.shortLabel}
                      </span>
                      <span className="font-bold text-rose-600 font-mono">{item.count} report{item.count > 1 ? 's' : ''}</span>
                    </div>
                    <div className="w-full bg-slate-100 rounded-full h-2.5 overflow-hidden">
                      <div
                        className="bg-rose-500 h-2.5 rounded-full transition-all duration-500"
                        style={{ width: `${widthPct}%` }}
                      />
                    </div>
                    <div className="text-[10px] text-slate-400 font-mono truncate">
                      Refs: {item.reportRefs.join(', ')}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* CHART 4: Email Distribution (NEW Horizontal Bar) */}
        <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-2xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                4. Suspect Email Distribution
              </h4>
              <span className="text-[10px] text-emerald-600 font-mono font-bold">Phishing & Impersonation</span>
            </div>

            <div className="space-y-3.5">
              {topEmails.map((item) => {
                const widthPct = Math.round((item.count / maxEmailCount) * 100);
                return (
                  <div key={item.label} className="space-y-1">
                    <div className="flex justify-between items-baseline text-xs">
                      <span className="font-mono font-semibold text-slate-800 truncate max-w-[200px]" title={item.label}>
                        {item.label}
                      </span>
                      <span className="font-bold text-emerald-600 font-mono">{item.count} report{item.count > 1 ? 's' : ''}</span>
                    </div>
                    <div className="w-full bg-slate-100 rounded-full h-2.5 overflow-hidden">
                      <div
                        className="bg-emerald-500 h-2.5 rounded-full transition-all duration-500"
                        style={{ width: `${widthPct}%` }}
                      />
                    </div>
                    <div className="text-[10px] text-slate-400 font-mono truncate">
                      Refs: {item.reportRefs.join(', ')}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* CHART 5: Category Distribution */}
        <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-2xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                5. Scam Category Distribution
              </h4>
              <span className="text-[10px] text-slate-400 font-mono">{reports.length} Reports</span>
            </div>

            <div className="space-y-2.5">
              {categoryCounts.map((c) => (
                <div key={c.category} className="flex items-center justify-between text-xs">
                  <span className="font-medium text-slate-700 truncate max-w-[130px]">{c.category}</span>
                  <div className="flex items-center space-x-2.5">
                    <div className="w-24 bg-slate-100 rounded-full h-2 overflow-hidden">
                      <div className="bg-indigo-600 h-2 rounded-full" style={{ width: `${c.percent}%` }} />
                    </div>
                    <span className="font-mono text-slate-500 w-12 text-right text-[11px]">
                      {c.count} ({c.percent}%)
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* CHART 6: Incident Lodgement Velocity */}
        <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-2xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                6. Incident Velocity Timeline
              </h4>
              <span className="text-[10px] text-slate-400 font-mono">Date vs Cases</span>
            </div>

            <div className="h-28 flex items-end justify-between space-x-1 pt-4 px-1">
              {timelineData.map((d) => {
                const heightPct = Math.round((d.count / 2) * 100);
                return (
                  <div key={d.date} className="flex-1 flex flex-col items-center group relative">
                    <div
                      className="w-full bg-slate-200 group-hover:bg-blue-600 rounded-t transition-colors"
                      style={{ height: `${Math.max(heightPct, 15)}%` }}
                      title={`${d.date}: ${d.count} report(s)`}
                    />
                    <span className="text-[8px] text-slate-400 mt-1 font-mono -rotate-45 origin-top-left">
                      {d.date}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500 mt-4">
            <span>Aggregated Span: Sep–Oct 2026</span>
            <span className="font-semibold text-blue-700">Multi-Node Correlation Active</span>
          </div>
        </div>
      </div>
    </div>
  );
}
