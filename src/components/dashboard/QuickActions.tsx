import type { DashboardTab } from './DashboardSidebar';

interface QuickActionsProps {
  onNavigate: (tab: DashboardTab) => void;
}

export default function QuickActions({ onNavigate }: QuickActionsProps) {
  const actions: {
    tab: DashboardTab;
    title: string;
    description: string;
    btnText: string;
    iconBg: string;
    icon: string;
  }[] = [
    {
      tab: 'report',
      title: 'Report a New Scam',
      description: 'Lodge a detailed cyber fraud complaint with transaction references and suspect information.',
      btnText: 'Start Reporting',
      iconBg: 'bg-rose-600',
      icon: 'alert',
    },
    {
      tab: 'my-reports',
      title: 'Track Existing Reports',
      description: 'Check active status, investigation progress, and status timeline notes for your filed cases.',
      btnText: 'View Case Tracking',
      iconBg: 'bg-blue-600',
      icon: 'track',
    },
    {
      tab: 'evidence',
      title: 'Manage Evidence',
      description: 'Select, inspect and preview transaction slips, screenshots, and suspect communications.',
      btnText: 'Upload / Preview',
      iconBg: 'bg-indigo-600',
      icon: 'clip',
    },
  ];

  return (
    <div className="mt-8">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="text-lg font-bold text-slate-900">Quick Actions</h2>
          <p className="text-xs text-slate-500">Fast pathways to lodge complaints, verify files, and review cases</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {actions.map((act) => (
          <div
            key={act.tab}
            className="bg-white rounded-xl border border-slate-200/90 p-5 shadow-xs hover:shadow-md hover:border-blue-300 transition-all flex flex-col justify-between"
          >
            <div>
              <div className={`w-10 h-10 rounded-lg ${act.iconBg} text-white flex items-center justify-center mb-3 shadow-xs`}>
                {act.icon === 'alert' && (
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                    />
                  </svg>
                )}
                {act.icon === 'track' && (
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4"
                    />
                  </svg>
                )}
                {act.icon === 'clip' && (
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                    />
                  </svg>
                )}
              </div>
              <h3 className="font-bold text-slate-900 text-base">{act.title}</h3>
              <p className="text-xs text-slate-600 mt-1.5 leading-relaxed">{act.description}</p>
            </div>
            <button
              onClick={() => onNavigate(act.tab)}
              className="mt-4 inline-flex items-center text-xs font-semibold text-blue-700 hover:text-blue-800 group"
            >
              <span>{act.btnText}</span>
              <svg
                className="w-4 h-4 ml-1 transition-transform group-hover:translate-x-1"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
