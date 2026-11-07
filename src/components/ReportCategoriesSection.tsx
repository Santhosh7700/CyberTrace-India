interface CategoryCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
}

function CategoryCard({ icon, title, description }: CategoryCardProps) {
  return (
    <div className="bg-white rounded-xl border border-slate-200 p-6 hover:shadow-md hover:border-blue-300 transition-all duration-200 flex flex-col items-start gap-4 cursor-default">
      <div className="w-12 h-12 rounded-xl bg-blue-50 flex items-center justify-center text-blue-600 shrink-0">
        {icon}
      </div>
      <div>
        <h3 className="text-sm font-semibold text-slate-800 mb-1">{title}</h3>
        <p className="text-sm text-slate-500 leading-relaxed">{description}</p>
      </div>
    </div>
  );
}

export default function ReportCategoriesSection() {
  const categories: CategoryCardProps[] = [
    {
      icon: <UPIIcon />,
      title: 'UPI / Payment Fraud',
      description:
        'Fraudulent UPI transactions, fake payment links, QR code scams and unauthorized money transfers.',
    },
    {
      icon: <PhishingIcon />,
      title: 'Phishing Websites',
      description:
        'Deceptive websites impersonating banks, government portals or popular services to steal credentials.',
    },
    {
      icon: <CallsIcon />,
      title: 'Fake Calls and Messages',
      description:
        'Vishing calls, smishing texts, fake KYC requests and impersonation of officials.',
    },
    {
      icon: <EmailIcon />,
      title: 'Email Scams',
      description:
        'Phishing emails, fake invoice scams, lottery fraud and business email compromise.',
    },
    {
      icon: <SocialIcon />,
      title: 'Social Media Fraud',
      description:
        'Fake profiles, online romance scams, fraudulent investment groups and giveaway fraud.',
    },
    {
      icon: <ShoppingIcon />,
      title: 'Online Shopping Fraud',
      description:
        'Fake e-commerce listings, non-delivery of goods, counterfeit products and advance-fee fraud.',
    },
  ];

  return (
    <section id="report-categories" className="bg-slate-50 py-16 lg:py-24">
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-10 xl:px-14">
        {/* Header */}
        <div className="text-center mb-14">
          <span className="inline-block mb-3 px-3 py-1 bg-blue-100 text-blue-700 text-xs font-semibold rounded-full tracking-wide uppercase border border-blue-200">
            Scam Categories
          </span>
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-slate-900 mb-4">
            What Can You Report?
          </h2>
          <p className="text-slate-600 text-base sm:text-lg max-w-xl mx-auto">
            CyberTrace-India covers a wide range of digital fraud types reported by citizens across India.
          </p>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {categories.map((cat) => (
            <CategoryCard key={cat.title} {...cat} />
          ))}
        </div>
      </div>
    </section>
  );
}

/* ── Icons ───────────────────────────────────────────────────── */
function UPIIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <rect x="2" y="5" width="20" height="14" rx="2" stroke="currentColor" strokeWidth="1.8" />
      <path d="M2 10h20" stroke="currentColor" strokeWidth="1.8" />
      <path d="M6 15h3M15 15h3" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  );
}

function PhishingIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="1.8" />
      <path d="M12 8v4M12 16h.01" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  );
}

function CallsIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07A19.5 19.5 0 013.07 10.8 19.79 19.79 0 01.0 2.18 2 2 0 012 0h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L6.09 7.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0122 16.92z"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function EmailIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <polyline points="22,6 12,13 2,6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function SocialIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <circle cx="18" cy="5" r="3" stroke="currentColor" strokeWidth="1.8" />
      <circle cx="6" cy="12" r="3" stroke="currentColor" strokeWidth="1.8" />
      <circle cx="18" cy="19" r="3" stroke="currentColor" strokeWidth="1.8" />
      <path d="M8.59 13.51l6.83 3.98M15.41 6.51L8.59 10.49" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  );
}

function ShoppingIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <line x1="3" y1="6" x2="21" y2="6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
      <path d="M16 10a4 4 0 01-8 0" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
