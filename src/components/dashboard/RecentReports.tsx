import type { ScamReport, ReportStatus } from '../../types/dashboard';

interface RecentReportsProps {
  reports: ScamReport[];
  onViewDetails: (report: ScamReport) => void;
  onViewAll: () => void;
}

export default function RecentReports({ reports, onViewDetails, onViewAll }: RecentReportsProps) {
  const recent = reports.slice(0, 5);

  const getStatusBadge = (status: ReportStatus) => {
    switch (status) {
      case 'Submitted':
        return 'bg-blue-50 text-blue-700 border-blue-200';
      case 'Under Review':
        return 'bg-amber-50 text-amber-700 border-amber-200';
      case 'Under Investigation':
        return 'bg-indigo-50 text-indigo-700 border-indigo-200';
      case 'Resolved':
        return 'bg-emerald-50 text-emerald-700 border-emerald-200';
    }
  };

  const formatCurrency = (amt: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(amt);
  };

  return (
    <div className="mt-8 bg-white rounded-xl border border-slate-200/90 shadow-xs overflow-hidden">
      <div className="p-5 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
        <div>
          <h2 className="text-lg font-bold text-slate-900">Recent Incident Reports</h2>
          <p className="text-xs text-slate-500">Latest cyber incident complaints lodged under your citizen profile</p>
        </div>
        <button
          onClick={onViewAll}
          className="text-xs font-semibold text-blue-700 hover:text-blue-800 self-start sm:self-auto flex items-center"
        >
          View all reports ({reports.length})
          <svg className="w-3.5 h-3.5 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </div>

      {recent.length === 0 ? (
        <div className="p-12 text-center">
          <div className="w-12 h-12 rounded-full bg-slate-100 text-slate-400 mx-auto flex items-center justify-center mb-3">
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
              />
            </svg>
          </div>
          <h3 className="text-sm font-semibold text-slate-800">No reports filed yet</h3>
          <p className="text-xs text-slate-500 mt-1">Submit your first report using the "Report a Scam" button.</p>
        </div>
      ) : (
        <>
          {/* Desktop Table View */}
          <div className="hidden md:block overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-500 uppercase tracking-wider font-semibold border-b border-slate-200/80">
                <tr>
                  <th className="py-3 px-4">Case Reference</th>
                  <th className="py-3 px-4">Category</th>
                  <th className="py-3 px-4">Date Reported</th>
                  <th className="py-3 px-4">Amount Lost</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium">
                {recent.map((rep) => (
                  <tr key={rep.id} className="hover:bg-slate-50/70 transition-colors">
                    <td className="py-3.5 px-4 font-mono font-bold text-blue-700">{rep.referenceId}</td>
                    <td className="py-3.5 px-4 text-slate-800">{rep.category}</td>
                    <td className="py-3.5 px-4 text-slate-600">{rep.reportedDate}</td>
                    <td className="py-3.5 px-4 font-semibold text-slate-900">{formatCurrency(rep.amountLost)}</td>
                    <td className="py-3.5 px-4">
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-semibold border ${getStatusBadge(
                          rep.status
                        )}`}
                      >
                        {rep.status}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <button
                        onClick={() => onViewDetails(rep)}
                        className="px-3 py-1.5 rounded-md bg-blue-50 text-blue-700 hover:bg-blue-100 text-xs font-semibold transition-colors"
                      >
                        View Details
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile Card View */}
          <div className="md:hidden divide-y divide-slate-100">
            {recent.map((rep) => (
              <div key={rep.id} className="p-4 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-mono text-xs font-bold text-blue-700">{rep.referenceId}</span>
                  <span
                    className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold border ${getStatusBadge(
                      rep.status
                    )}`}
                  >
                    {rep.status}
                  </span>
                </div>
                <div className="flex justify-between items-baseline">
                  <div>
                    <h3 className="text-sm font-semibold text-slate-900">{rep.category}</h3>
                    <p className="text-xs text-slate-500">Reported on {rep.reportedDate}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-slate-400">Loss Amount</p>
                    <p className="text-sm font-bold text-slate-900">{formatCurrency(rep.amountLost)}</p>
                  </div>
                </div>
                <div className="pt-2 flex justify-end">
                  <button
                    onClick={() => onViewDetails(rep)}
                    className="w-full py-1.5 rounded-lg bg-blue-50 text-blue-700 font-semibold text-xs text-center hover:bg-blue-100"
                  >
                    View Details & Timeline
                  </button>
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
