const quickLinks = [
  { label: 'Home', href: '#home' },
  { label: 'About', href: '#about' },
  { label: 'How It Works', href: '#how-it-works' },
  { label: 'Safety Guidelines', href: '#safety-guidelines' },
];

const legalLinks = [
  { label: 'Privacy Policy', href: '#privacy' },
  { label: 'Terms & Conditions', href: '#terms' },
];

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="bg-slate-900 text-slate-400">
      {/* Main footer content */}
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-10 xl:px-14 py-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
        {/* Brand column */}
        <div className="sm:col-span-2 lg:col-span-1">
          <div className="flex items-center gap-2 text-white font-bold text-lg mb-3">
            <ShieldIcon />
            <span>CyberTrace<span className="text-blue-400">India</span></span>
          </div>
          <p className="text-sm leading-relaxed mb-4">
            An independent prototype platform for citizens to report online scams, preserve digital evidence
            and support efforts against cybercrime in India.
          </p>
          <p className="text-xs text-slate-500 italic border border-slate-700 rounded-md px-3 py-2 bg-slate-800">
            ⚠ This is an independent project prototype. It is not affiliated with or endorsed by any government body.
          </p>
        </div>

        {/* Quick Links */}
        <div>
          <h4 className="text-white text-sm font-semibold mb-4 uppercase tracking-wide">Quick Links</h4>
          <ul className="space-y-2">
            {quickLinks.map((link) => (
              <li key={link.label}>
                <a
                  href={link.href}
                  className="text-sm hover:text-blue-400 transition-colors duration-200"
                >
                  {link.label}
                </a>
              </li>
            ))}
          </ul>
        </div>

        {/* Legal */}
        <div>
          <h4 className="text-white text-sm font-semibold mb-4 uppercase tracking-wide">Legal</h4>
          <ul className="space-y-2">
            {legalLinks.map((link) => (
              <li key={link.label}>
                <a
                  href={link.href}
                  onClick={(e) => { e.preventDefault(); alert(`${link.label} — will be available in a future update.`); }}
                  className="text-sm hover:text-blue-400 transition-colors duration-200 cursor-pointer"
                >
                  {link.label}
                </a>
              </li>
            ))}
          </ul>
        </div>

        {/* Contact */}
        <div>
          <h4 className="text-white text-sm font-semibold mb-4 uppercase tracking-wide">Contact</h4>
          <ul className="space-y-3 text-sm">
            <li className="flex items-start gap-2">
              <span className="text-blue-400 mt-0.5 shrink-0">
                <MailIcon />
              </span>
              <span>contact@cybertrace-india.example</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-blue-400 mt-0.5 shrink-0">
                <InfoIcon />
              </span>
              <span>For urgent matters, call <span className="text-white font-semibold">1930</span> (National Cybercrime Helpline)</span>
            </li>
          </ul>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-slate-800">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-10 xl:px-14 py-5 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-500">
          <span>© {year} CyberTrace-India. All rights reserved. Independent prototype — not an official government website.</span>
          <span>Built with React + TypeScript + Vite + Tailwind CSS</span>
        </div>
      </div>
    </footer>
  );
}

/* ── Icons ───────────────────────────────────────────────────── */
function ShieldIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M12 2L4 6v5c0 5.25 3.4 10.15 8 11.35C16.6 21.15 20 16.25 20 11V6L12 2z"
        fill="#1d4ed8"
        opacity="0.3"
      />
      <path
        d="M12 2L4 6v5c0 5.25 3.4 10.15 8 11.35C16.6 21.15 20 16.25 20 11V6L12 2z"
        stroke="#60a5fa"
        strokeWidth="1.5"
        strokeLinejoin="round"
      />
      <path d="M9 12l2 2 4-4" stroke="#60a5fa" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function MailIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
      <polyline points="22,6 12,13 2,6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function InfoIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="1.8" />
      <path d="M12 16v-4M12 8h.01" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  );
}
