interface TipProps {
  icon: React.ReactNode;
  tip: string;
}

function TipCard({ icon, tip }: TipProps) {
  return (
    <div className="flex items-start gap-4 bg-white rounded-xl border border-slate-200 p-5 hover:shadow-sm hover:border-blue-200 transition-all duration-200">
      <div className="w-9 h-9 rounded-lg bg-blue-50 flex items-center justify-center text-blue-600 shrink-0 mt-0.5">
        {icon}
      </div>
      <p className="text-sm text-slate-700 leading-relaxed">{tip}</p>
    </div>
  );
}

export default function SafetyGuidelinesSection() {
  const tips: TipProps[] = [
    {
      icon: <LockIcon />,
      tip: 'Never share your OTP, PIN, password or bank login credentials with anyone — including calls claiming to be from your bank or government.',
    },
    {
      icon: <CheckIcon />,
      tip: 'Always verify payment requests independently before transferring money, even if the request appears to come from a known contact.',
    },
    {
      icon: <LinkIcon />,
      tip: 'Avoid clicking on suspicious links received via SMS, email or social media. Verify the sender and the URL before proceeding.',
    },
    {
      icon: <CameraIcon />,
      tip: 'Preserve all evidence including screenshots, transaction IDs, call recordings and chat logs before reporting a fraud.',
    },
    {
      icon: <BankIcon />,
      tip: 'If you suspect financial fraud, contact your bank immediately to block transactions. Quick action can minimize losses.',
    },
    {
      icon: <ShieldIcon />,
      tip: 'Enable two-factor authentication on all your financial accounts, email and social media for an additional layer of protection.',
    },
  ];

  return (
    <section id="safety-guidelines" className="bg-blue-700 py-16 lg:py-24">
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-10 xl:px-14">
        {/* Header */}
        <div className="text-center mb-14">
          <span className="inline-block mb-3 px-3 py-1 bg-blue-600 text-blue-100 text-xs font-semibold rounded-full tracking-wide uppercase border border-blue-500">
            Stay Protected
          </span>
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white mb-4">
            Safety Guidelines
          </h2>
          <p className="text-blue-100 text-base sm:text-lg max-w-xl mx-auto">
            Protect yourself from online fraud. Follow these essential practices to stay safe in the digital world.
          </p>
        </div>

        {/* Tips Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {tips.map((tip, i) => (
            <TipCard key={i} {...tip} />
          ))}
        </div>

        {/* Emergency Box */}
        <div className="mt-12 bg-blue-800 rounded-2xl p-6 sm:p-8 flex flex-col sm:flex-row items-center gap-5 text-center sm:text-left border border-blue-600">
          <div className="w-14 h-14 rounded-full bg-blue-600 flex items-center justify-center shrink-0 text-white">
            <EmergencyIcon />
          </div>
          <div>
            <h3 className="text-white font-semibold text-base mb-1">Report Cybercrime to National Helpline</h3>
            <p className="text-blue-200 text-sm leading-relaxed">
              For urgent cyber fraud incidents, call the{' '}
              <span className="font-bold text-white">National Cybercrime Helpline: 1930</span> or visit{' '}
              <span className="font-semibold text-blue-100">cybercrime.gov.in</span>
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ── Icons ───────────────────────────────────────────────────── */
function LockIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <rect x="5" y="11" width="14" height="10" rx="2" stroke="currentColor" strokeWidth="1.8" />
      <path d="M8 11V7a4 4 0 118 0v4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  );
}

function CheckIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z" stroke="currentColor" strokeWidth="1.8" />
      <path d="M9 12l2 2 4-4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function LinkIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M10 13a5 5 0 007.54.54l3-3a5 5 0 00-7.07-7.07l-1.72 1.71" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
      <path d="M14 11a5 5 0 00-7.54-.54l-3 3a5 5 0 007.07 7.07l1.71-1.71" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  );
}

function CameraIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M23 19a2 2 0 01-2 2H3a2 2 0 01-2-2V8a2 2 0 012-2h4l2-3h6l2 3h4a2 2 0 012 2z" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
      <circle cx="12" cy="13" r="4" stroke="currentColor" strokeWidth="1.8" />
    </svg>
  );
}

function BankIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M3 21h18M3 10h18M5 6l7-3 7 3M4 10v11M20 10v11M8 10v11M12 10v11M16 10v11" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function ShieldIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M12 2L4 6v5c0 5.25 3.4 10.15 8 11.35C16.6 21.15 20 16.25 20 11V6L12 2z" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" />
      <path d="M9 12l2 2 4-4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function EmergencyIcon() {
  return (
    <svg width="26" height="26" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07A19.5 19.5 0 013.07 10.8 19.79 19.79 0 01.0 2.18 2 2 0 012 0h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L6.09 7.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0122 16.92z" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
