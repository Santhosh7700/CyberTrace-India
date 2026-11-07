interface StatItemProps {
  value: string;
  label: string;
}

function StatItem({ value, label }: StatItemProps) {
  return (
    <div className="text-center">
      <div className="text-2xl font-bold text-white">{value}</div>
      <div className="text-sm text-blue-200 mt-1">{label}</div>
    </div>
  );
}

export default function AboutSection() {
  const points = [
    {
      icon: <CollectIcon />,
      title: 'Collect Scam Reports',
      description:
        'Enable citizens to file structured online scam reports with supporting details and digital evidence.',
    },
    {
      icon: <OrganizeIcon />,
      title: 'Organize Digital Evidence',
      description:
        'Provide tools to upload, tag and organize screenshots, transaction records and other supporting files.',
    },
    {
      icon: <InvestigateIcon />,
      title: 'Support Investigators',
      description:
        'Help authorised investigators review reported incidents in an organized and accessible manner.',
    },
    {
      icon: <PatternIcon />,
      title: 'Identify Patterns',
      description:
        'Assist in identifying repeated scam indicators and emerging fraud patterns across reports.',
    },
    {
      icon: <AwarenessIcon />,
      title: 'Improve Awareness',
      description:
        'Raise public awareness about prevalent online fraud tactics and protective practices.',
    },
    {
      icon: <TrackIcon />,
      title: 'Track Your Report',
      description:
        'Allow citizens to monitor the status of their submitted reports through a transparent tracking system.',
    },
  ];

  return (
    <section id="about" className="bg-slate-50 py-16 lg:py-24">
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-10 xl:px-14">
        {/* Header */}
        <div className="text-center mb-14">
          <span className="inline-block mb-3 px-3 py-1 bg-blue-100 text-blue-700 text-xs font-semibold rounded-full tracking-wide uppercase border border-blue-200">
            Our Mission
          </span>
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-slate-900 mb-4">
            About CyberTrace-India
          </h2>
          <p className="text-slate-600 text-base sm:text-lg max-w-2xl mx-auto leading-relaxed">
            CyberTrace-India is an independent prototype platform designed to help citizens report
            online scams, preserve evidence and support efforts to combat digital fraud in India.
          </p>
        </div>

        {/* Feature Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {points.map(({ icon, title, description }) => (
            <div
              key={title}
              className="bg-white rounded-xl border border-slate-200 p-6 hover:shadow-md hover:border-blue-200 transition-all duration-200"
            >
              <div className="w-10 h-10 rounded-lg bg-blue-50 flex items-center justify-center mb-4 text-blue-600">
                {icon}
              </div>
              <h3 className="text-base font-semibold text-slate-800 mb-2">{title}</h3>
              <p className="text-sm text-slate-500 leading-relaxed">{description}</p>
            </div>
          ))}
        </div>

        {/* Stats Row */}
        <div className="mt-14 bg-blue-700 rounded-2xl p-8 grid grid-cols-2 sm:grid-cols-4 gap-6">
          <StatItem value="Citizens" label="Platform For" />
          <StatItem value="6+" label="Scam Categories" />
          <StatItem value="Secure" label="Evidence Storage" />
          <StatItem value="Free" label="To Use" />
        </div>
      </div>
    </section>
  );
}

/* ── Icons ───────────────────────────────────────────────────── */
function CollectIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
      <rect x="9" y="3" width="6" height="4" rx="1" stroke="currentColor" strokeWidth="1.8" />
      <path d="M9 12h6M9 16h4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  );
}

function OrganizeIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <rect x="3" y="3" width="7" height="7" rx="1.5" stroke="currentColor" strokeWidth="1.8" />
      <rect x="14" y="3" width="7" height="7" rx="1.5" stroke="currentColor" strokeWidth="1.8" />
      <rect x="3" y="14" width="7" height="7" rx="1.5" stroke="currentColor" strokeWidth="1.8" />
      <rect x="14" y="14" width="7" height="7" rx="1.5" stroke="currentColor" strokeWidth="1.8" />
    </svg>
  );
}

function InvestigateIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <circle cx="11" cy="11" r="7" stroke="currentColor" strokeWidth="1.8" />
      <path d="M16.5 16.5L21 21" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
      <path d="M9 11h4M11 9v4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  );
}

function PatternIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M3 3l7 7M14 3l7 7M3 14l7 7M14 14l7 7" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  );
}

function AwarenessIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M13.73 21a2 2 0 01-3.46 0" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  );
}

function TrackIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="1.8" />
      <path d="M12 6v6l4 2" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  );
}
