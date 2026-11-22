import type { InvestigatorCase } from '../../types/investigator';
import { CaseStatusBadge } from './CaseStatusBadge';

interface InvestigationHistorySectionProps {
  cases: InvestigatorCase[];
  onInspectCase: (caseItem: InvestigatorCase) => void;
}

export default function InvestigationHistorySection({
  cases,
  onInspectCase,
}: InvestigationHistorySectionProps) {
  // Aggregate all timeline entries across all cases, sorted chronologically
  const historyEntries = cases
    .flatMap((c) =>
      c.timeline.map((t, idx) => ({
        id: `${c.id}-${idx}`,
        parentCase: c,
        stage: t.stage,
        timestamp: t.timestamp,
        note: t.note,
        actor: t.actor || 'Officer / System',
      }))
    )
    .sort((a, b) => b.timestamp.localeCompare(a.timestamp));

  return (
    <div className="bg-white rounded-xl border border-slate-200/90 shadow-2xs overflow-hidden">
      <div className="p-5 border-b border-slate-100 flex items-center justify-between">
        <div>
          <div className="flex items-center space-x-2 text-indigo-700 text-xs font-bold uppercase tracking-wider mb-0.5">
            <span className="w-2 h-2 rounded-full bg-indigo-600"></span>
            <span>Audit Trail &amp; Case Progression</span>
          </div>
          <h3 className="text-base font-bold text-slate-900">Investigation Chronological History</h3>
          <p className="text-xs text-slate-500">
            System audit trail documenting state transitions, judicial notices, and investigative notes.
          </p>
        </div>
        <span className="text-xs text-slate-500 font-mono font-semibold">
          {historyEntries.length} logged events
        </span>
      </div>

      <div className="p-6">
        <div className="space-y-6 relative before:absolute before:inset-0 before:left-5 before:w-0.5 before:bg-slate-200">
          {historyEntries.map((entry) => (
            <div key={entry.id} className="relative flex items-start space-x-4 pl-2">
              {/* Dot Icon */}
              <div className="w-6 h-6 rounded-full bg-white border-2 border-indigo-600 flex items-center justify-center shrink-0 z-10 shadow-xs">
                <span className="w-2 h-2 rounded-full bg-indigo-600"></span>
              </div>

              {/* Event Content */}
              <div className="flex-1 bg-slate-50 p-4 rounded-xl border border-slate-200/80">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1 mb-1.5">
                  <div className="flex items-center space-x-2">
                    <span className="font-mono font-bold text-indigo-700 text-xs">
                      {entry.parentCase.referenceId}
                    </span>
                    <CaseStatusBadge status={entry.stage} />
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className="text-[11px] font-semibold text-slate-600 bg-slate-200/70 px-2 py-0.5 rounded">
                      {entry.actor}
                    </span>
                    <span className="text-[11px] text-slate-400 font-mono">{entry.timestamp}</span>
                  </div>
                </div>

                <p className="text-xs text-slate-700 font-medium">{entry.note}</p>

                <div className="mt-2 pt-2 border-t border-slate-200/60 flex items-center justify-between text-[11px]">
                  <span className="text-slate-500">
                    Category: <strong className="text-slate-700">{entry.parentCase.category}</strong> • Victim:{' '}
                    {entry.parentCase.victimName}
                  </span>
                  <button
                    type="button"
                    onClick={() => onInspectCase(entry.parentCase)}
                    className="text-indigo-600 hover:text-indigo-800 font-bold"
                  >
                    Open Case Dossier →
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
