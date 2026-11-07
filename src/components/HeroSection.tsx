export default function HeroSection() {
  return (
    <section
      id="home"
      className="bg-white py-16 lg:py-24"
    >
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-10 xl:px-14">
        <div className="flex flex-col-reverse lg:flex-row items-center gap-12 lg:gap-16">
          {/* Text Content */}
          <div className="flex-1 text-center lg:text-left">
            <span className="inline-block mb-4 px-3 py-1 bg-blue-50 text-blue-700 text-xs font-semibold rounded-full tracking-wide uppercase border border-blue-200">
              Citizen Cybercrime Reporting Platform
            </span>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-slate-900 leading-tight mb-6">
              Report Online Scams.{' '}
              <span className="text-blue-700">Help Build a Safer Digital India.</span>
            </h1>
            <p className="text-slate-600 text-base sm:text-lg leading-relaxed mb-8 max-w-xl mx-auto lg:mx-0">
              CyberTrace-India provides a structured platform for citizens to report online fraud,
              submit digital evidence and track their reported cases.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center lg:justify-start">
              <a
                href="#how-it-works"
                className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-blue-700 text-white text-sm font-semibold rounded-md hover:bg-blue-800 transition-colors duration-200 shadow-sm"
              >
                <ReportIcon />
                Report a Scam
                <span className="text-blue-300 text-xs font-normal">(Coming Soon)</span>
              </a>
              <a
                href="#how-it-works"
                className="inline-flex items-center justify-center gap-2 px-6 py-3 border border-blue-300 text-blue-700 text-sm font-semibold rounded-md hover:bg-blue-50 transition-colors duration-200"
              >
                Learn How It Works
                <ArrowRightIcon />
              </a>
            </div>

            {/* Trust Indicators */}
            <div className="mt-10 flex flex-wrap gap-5 justify-center lg:justify-start">
              {[
                { icon: <LockIcon />, label: 'Secure Submission' },
                { icon: <EyeIcon />, label: 'Anonymous Reports' },
                { icon: <ClockIcon />, label: 'Track Your Case' },
              ].map(({ icon, label }) => (
                <div key={label} className="flex items-center gap-2 text-slate-500 text-sm">
                  <span className="text-blue-500">{icon}</span>
                  {label}
                </div>
              ))}
            </div>
          </div>

          {/* Illustration */}
          <div className="flex-1 w-full max-w-sm lg:max-w-none flex justify-center">
            <HeroIllustration />
          </div>
        </div>
      </div>
    </section>
  );
}

/* ── Inline SVG Illustration ─────────────────────────────────── */
function HeroIllustration() {
  return (
    <div className="relative w-72 h-72 sm:w-80 sm:h-80 lg:w-96 lg:h-96">
      <svg viewBox="0 0 400 400" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
        {/* Background circle */}
        <circle cx="200" cy="200" r="190" fill="#eff6ff" />

        {/* Shield body */}
        <path
          d="M200 60 L290 100 L290 200 C290 265 245 320 200 340 C155 320 110 265 110 200 L110 100 Z"
          fill="#dbeafe"
          stroke="#3b82f6"
          strokeWidth="4"
          strokeLinejoin="round"
        />

        {/* Shield inner fill */}
        <path
          d="M200 85 L270 118 L270 200 C270 253 234 299 200 316 C166 299 130 253 130 200 L130 118 Z"
          fill="#bfdbfe"
        />

        {/* Checkmark */}
        <path
          d="M168 198 L190 220 L232 175"
          stroke="#1d4ed8"
          strokeWidth="8"
          strokeLinecap="round"
          strokeLinejoin="round"
        />

        {/* Decorative floating elements */}
        {/* Lock */}
        <rect x="52" y="150" width="44" height="38" rx="6" fill="white" stroke="#93c5fd" strokeWidth="2" />
        <rect x="62" y="162" width="24" height="16" rx="3" fill="#bfdbfe" />
        <path d="M64 150 Q64 138 76 138 Q88 138 88 150" stroke="#60a5fa" strokeWidth="2.5" fill="none" strokeLinecap="round" />
        <circle cx="76" cy="170" r="3" fill="#1d4ed8" />

        {/* Document */}
        <rect x="300" y="130" width="52" height="64" rx="6" fill="white" stroke="#93c5fd" strokeWidth="2" />
        <path d="M312 148 h28 M312 160 h28 M312 172 h18" stroke="#93c5fd" strokeWidth="2" strokeLinecap="round" />
        <path d="M316 142 L336 128" stroke="#bfdbfe" strokeWidth="2" />

        {/* Magnifier */}
        <circle cx="80" cy="290" r="22" fill="white" stroke="#93c5fd" strokeWidth="2" />
        <circle cx="78" cy="288" r="12" fill="#dbeafe" stroke="#60a5fa" strokeWidth="2" />
        <path d="M87 297 L99 309" stroke="#3b82f6" strokeWidth="3" strokeLinecap="round" />

        {/* Star / Alert badge */}
        <circle cx="320" cy="290" r="22" fill="#fef3c7" stroke="#fbbf24" strokeWidth="2" />
        <text x="320" y="296" textAnchor="middle" fontSize="20" fill="#d97706">!</text>

        {/* Connecting dots */}
        <circle cx="200" cy="52" r="5" fill="#93c5fd" />
        <circle cx="315" cy="108" r="4" fill="#93c5fd" />
        <circle cx="88" cy="108" r="4" fill="#93c5fd" />
      </svg>
    </div>
  );
}

/* ── Small Icons ─────────────────────────────────────────────── */
function ReportIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M12 2L4 6v5c0 5.25 3.4 10.15 8 11.35C16.6 21.15 20 16.25 20 11V6L12 2z" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" />
      <path d="M9 12l2 2 4-4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function ArrowRightIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M5 12h14M13 6l6 6-6 6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function LockIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <rect x="5" y="11" width="14" height="10" rx="2" stroke="currentColor" strokeWidth="1.8" />
      <path d="M8 11V7a4 4 0 118 0v4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  );
}

function EyeIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" stroke="currentColor" strokeWidth="1.8" />
      <circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth="1.8" />
    </svg>
  );
}

function ClockIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="1.8" />
      <path d="M12 6v6l4 2" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  );
}
