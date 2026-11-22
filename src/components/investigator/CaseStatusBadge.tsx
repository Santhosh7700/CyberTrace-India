import type { InvestigationStatus, CasePriority } from '../../types/investigator';

interface CaseStatusBadgeProps {
  status: InvestigationStatus;
}

export function CaseStatusBadge({ status }: CaseStatusBadgeProps) {
  switch (status) {
    case 'Submitted':
      return (
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-slate-100 text-slate-700 border border-slate-300">
          Submitted
        </span>
      );
    case 'Under Review':
      return (
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-amber-50 text-amber-800 border border-amber-200">
          Under Review
        </span>
      );
    case 'Under Investigation':
      return (
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-indigo-50 text-indigo-800 border border-indigo-200">
          Under Investigation
        </span>
      );
    case 'Evidence Verification':
      return (
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-blue-50 text-blue-800 border border-blue-200">
          Evidence Verification
        </span>
      );
    case 'Resolved':
      return (
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-800 border border-emerald-200">
          Resolved
        </span>
      );
    case 'Closed':
      return (
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-slate-100 text-slate-500 border border-slate-200">
          Closed
        </span>
      );
    default:
      return (
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-slate-100 text-slate-700">
          {status}
        </span>
      );
  }
}

interface CasePriorityBadgeProps {
  priority: CasePriority;
}

export function CasePriorityBadge({ priority }: CasePriorityBadgeProps) {
  switch (priority) {
    case 'Critical':
      return (
        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-rose-100 text-rose-800 border border-rose-300">
          <span className="w-1.5 h-1.5 rounded-full bg-rose-600"></span>
          Critical
        </span>
      );
    case 'High':
      return (
        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-amber-100 text-amber-800 border border-amber-300">
          <span className="w-1.5 h-1.5 rounded-full bg-amber-600"></span>
          High
        </span>
      );
    case 'Medium':
      return (
        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-blue-100 text-blue-800 border border-blue-300">
          Medium
        </span>
      );
    case 'Low':
      return (
        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-slate-100 text-slate-600 border border-slate-200">
          Low
        </span>
      );
  }
}
