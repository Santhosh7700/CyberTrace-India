interface StepProps {
  number: number;
  title: string;
  description: string;
  icon: React.ReactNode;
  isLast?: boolean;
}

function Step({ number, title, description, icon, isLast = false }: StepProps) {
  return (
    <div className="flex flex-col items-center text-center relative">
      {/* Connector line (not on last step) */}
      {!isLast && (
        <div className="hidden lg:block absolute top-10 left-[calc(50%+40px)] w-[calc(100%-80px)] h-0.5 bg-blue-200 z-0" />
      )}

      {/* Step circle */}
      <div className="relative z-10 w-20 h-20 rounded-full bg-blue-50 border-2 border-blue-200 flex items-center justify-center mb-5 text-blue-600 group-hover:bg-blue-100 transition-colors">
        {icon}
        <span className="absolute -top-1 -right-1 w-6 h-6 rounded-full bg-blue-700 text-white text-xs font-bold flex items-center justify-center">
          {number}
        </span>
      </div>

      <h3 className="text-base font-semibold text-slate-800 mb-2">{title}</h3>
      <p className="text-sm text-slate-500 leading-relaxed max-w-[200px]">{description}</p>
    </div>
  );
}

export default function HowItWorksSection() {
  const steps = [
    {
      title: 'Register',
      description: 'Create a free citizen account to start using the platform securely.',
      icon: <RegisterIcon />,
    },
    {
      title: 'Report',
      description: 'Submit structured details about an online scam you have encountered.',
      icon: <ReportStepIcon />,
    },
    {
      title: 'Upload',
      description: 'Provide supporting digital evidence such as screenshots or transaction records.',
      icon: <UploadIcon />,
    },
    {
      title: 'Track',
      description: 'Monitor the status of your submitted report through your dashboard.',
      icon: <TrackStepIcon />,
    },
  ];

  return (
    <section id="how-it-works" className="bg-white py-16 lg:py-24">
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-10 xl:px-14">
        {/* Header */}
        <div className="text-center mb-14">
          <span className="inline-block mb-3 px-3 py-1 bg-blue-100 text-blue-700 text-xs font-semibold rounded-full tracking-wide uppercase border border-blue-200">
            Simple Process
          </span>
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-slate-900 mb-4">
            How It Works
          </h2>
          <p className="text-slate-600 text-base sm:text-lg max-w-xl mx-auto">
            Reporting a scam takes only a few minutes. Here is how the process works.
          </p>
        </div>

        {/* Steps Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10 lg:gap-4 relative">
          {steps.map((step, index) => (
            <Step
              key={step.title}
              number={index + 1}
              title={step.title}
              description={step.description}
              icon={step.icon}
              isLast={index === steps.length - 1}
            />
          ))}
        </div>

        {/* CTA */}
        <div className="mt-14 text-center">
          <div className="inline-flex items-center gap-3 bg-blue-50 border border-blue-200 rounded-xl px-6 py-4">
            <InfoIcon />
            <p className="text-sm text-blue-700">
              <span className="font-semibold">Report submission workflow</span> will be available in the next development phase.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ── Icons ───────────────────────────────────────────────────── */
function RegisterIcon() {
  return (
    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
      <circle cx="12" cy="7" r="4" stroke="currentColor" strokeWidth="1.8" />
      <path d="M16 11h6M19 8v6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  );
}

function ReportStepIcon() {
  return (
    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M14 2v6h6M12 18v-4M10 16h4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  );
}

function UploadIcon() {
  return (
    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M17 8l-5-5-5 5M12 3v12" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function TrackStepIcon() {
  return (
    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function InfoIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true" className="text-blue-500 shrink-0">
      <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="1.8" />
      <path d="M12 16v-4M12 8h.01" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  );
}
