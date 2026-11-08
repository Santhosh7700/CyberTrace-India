interface StatsCardProps {
  title: string;
  value: number;
  subtitle: string;
  iconType: 'total' | 'review' | 'investigation' | 'resolved';
}

export default function StatsCard({ title, value, subtitle, iconType }: StatsCardProps) {
  const getColors = () => {
    switch (iconType) {
      case 'total':
        return {
          bg: 'bg-blue-50',
          text: 'text-blue-700',
          border: 'border-blue-100',
          iconBg: 'bg-blue-600',
        };
      case 'review':
        return {
          bg: 'bg-amber-50',
          text: 'text-amber-700',
          border: 'border-amber-100',
          iconBg: 'bg-amber-500',
        };
      case 'investigation':
        return {
          bg: 'bg-indigo-50',
          text: 'text-indigo-700',
          border: 'border-indigo-100',
          iconBg: 'bg-indigo-600',
        };
      case 'resolved':
        return {
          bg: 'bg-emerald-50',
          text: 'text-emerald-700',
          border: 'border-emerald-100',
          iconBg: 'bg-emerald-600',
        };
    }
  };

  const colors = getColors();

  return (
    <div className="bg-white rounded-xl border border-slate-200/80 p-5 shadow-xs hover:shadow-md transition-shadow">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">{title}</p>
          <p className="text-2xl sm:text-3xl font-extrabold text-slate-900 mt-1">{value}</p>
          <p className="text-xs text-slate-500 mt-1">{subtitle}</p>
        </div>
        <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-white ${colors.iconBg} shadow-sm`}>
          {iconType === 'total' && (
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
              />
            </svg>
          )}
          {iconType === 'review' && (
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          )}
          {iconType === 'investigation' && (
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
          )}
          {iconType === 'resolved' && (
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          )}
        </div>
      </div>
    </div>
  );
}
