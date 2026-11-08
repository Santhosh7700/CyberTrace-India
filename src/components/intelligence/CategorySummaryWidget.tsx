import type { SyntheticReport } from '../../types/intelligence';
import type { ScamCategory } from '../../types/dashboard';

interface Props {
  reports: SyntheticReport[];
  selectedCategory?: string;
  onSelectCategory?: (category: string) => void;
}

export default function CategorySummaryWidget({
  reports,
  selectedCategory,
  onSelectCategory,
}: Props) {
  const total = reports.length;

  const categories: ScamCategory[] = [
    'UPI Fraud',
    'Fake Investment',
    'Phishing',
    'Job Scam',
    'Online Shopping Fraud',
    'Social Media Scam',
    'Other',
  ];

  const categoryStats = categories.map((cat) => {
    const matchingReports = reports.filter((r) => r.category === cat);
    const count = matchingReports.length;
    const percentage = total > 0 ? Math.round((count / total) * 100) : 0;
    const totalLoss = matchingReports.reduce((sum, r) => sum + r.amountLost, 0);

    return {
      name: cat,
      count,
      percentage,
      totalLoss,
      refs: matchingReports.map((r) => r.referenceId),
    };
  }).filter((item) => item.count > 0);

  return (
    <div className="bg-white rounded-xl border border-slate-200/90 p-4 shadow-2xs">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between pb-3 mb-3 border-b border-slate-100 gap-2">
        <div>
          <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center">
            <span className="w-2 h-2 rounded-full bg-blue-600 mr-1.5"></span>
            Scam Category Classification Summary
          </h4>
          <p className="text-[11px] text-slate-500">
            Registered complaint distribution across {total} synthetic cases. Click a category to highlight its cases.
          </p>
        </div>
        {selectedCategory && selectedCategory !== 'ALL' && (
          <button
            onClick={() => onSelectCategory && onSelectCategory('ALL')}
            className="text-[11px] font-semibold text-blue-700 bg-blue-50 px-2 py-0.5 rounded border border-blue-200 hover:bg-blue-100 self-start sm:self-auto"
          >
            Clear Selection ({selectedCategory}) ✕
          </button>
        )}
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        {categoryStats.map((item) => {
          const isSelected = selectedCategory === item.name;
          return (
            <div
              key={item.name}
              onClick={() => onSelectCategory && onSelectCategory(isSelected ? 'ALL' : item.name)}
              className={`p-3 rounded-xl border cursor-pointer transition-all ${
                isSelected
                  ? 'border-blue-600 bg-blue-50/70 shadow-xs ring-1 ring-blue-500'
                  : 'border-slate-200 hover:border-slate-300 hover:bg-slate-50/50 bg-white'
              }`}
            >
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-[10px] font-bold text-slate-600 uppercase tracking-tight truncate max-w-[90px]">
                  {item.name}
                </span>
                <span className="font-mono text-xs font-black text-slate-900">{item.count}</span>
              </div>

              {/* Progress bar */}
              <div className="w-full bg-slate-100 rounded-full h-1.5 mb-2 overflow-hidden">
                <div
                  className={`h-1.5 rounded-full ${isSelected ? 'bg-blue-600' : 'bg-slate-700'}`}
                  style={{ width: `${item.percentage}%` }}
                />
              </div>

              <div className="flex items-center justify-between text-[11px] font-mono font-semibold">
                <span className={isSelected ? 'text-blue-700' : 'text-slate-700'}>{item.percentage}%</span>
                <span className={isSelected ? 'text-blue-700' : 'text-slate-700'}>₹{(item.totalLoss / 1000).toFixed(0)}k</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
