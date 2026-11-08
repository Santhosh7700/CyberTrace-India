import type { UserProfile } from '../../context/authContextDef';

interface CitizenProfileProps {
  currentUser: UserProfile | null;
}

export default function CitizenProfile({ currentUser }: CitizenProfileProps) {
  const getInitials = (name?: string) => {
    if (!name) return 'CT';
    const parts = name.trim().split(/\s+/);
    if (parts.length === 1) return parts[0].substring(0, 2).toUpperCase();
    return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header Profile Card */}
      <div className="bg-white rounded-xl border border-slate-200 p-6 sm:p-8 shadow-xs">
        <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-4 sm:space-y-0 sm:space-x-6">
          <div className="w-20 h-20 rounded-2xl bg-gradient-to-tr from-blue-700 to-indigo-600 text-white font-bold text-2xl flex items-center justify-center ring-4 ring-blue-50 shadow-md">
            {getInitials(currentUser?.fullName)}
          </div>
          <div className="flex-1">
            <div className="flex flex-wrap items-center gap-2">
              <h2 className="text-xl sm:text-2xl font-bold text-slate-900">
                {currentUser?.fullName || 'Verified Citizen'}
              </h2>
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                ✓ Identity Verified
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-1">
              Registered Indian Citizen Account • CyberTrace Evidence Portal
            </p>
          </div>
        </div>
      </div>

      {/* Account Details Information */}
      <div className="bg-white rounded-xl border border-slate-200 p-6 sm:p-8 shadow-xs">
        <div className="border-b border-slate-100 pb-4 mb-6">
          <h3 className="text-base font-bold text-slate-900">Citizen Profile Details</h3>
          <p className="text-xs text-slate-500 mt-0.5">
            Personal identity information associated with your mock session
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div>
            <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">
              Full Legal Name
            </label>
            <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg text-sm font-semibold text-slate-800">
              {currentUser?.fullName || 'Not provided'}
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">
              Registered Email Address
            </label>
            <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg text-sm font-semibold text-slate-800 break-all">
              {currentUser?.email || 'Not provided'}
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">
              Mobile Contact Number
            </label>
            <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg text-sm font-semibold text-slate-800">
              {currentUser?.mobile || 'Not provided'}
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">
              Session Registration Date
            </label>
            <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg text-sm font-semibold text-slate-800">
              {currentUser?.registeredAt || 'Active Session'}
            </div>
          </div>
        </div>

        {/* Security & Verification note */}
        <div className="mt-8 p-4 rounded-xl bg-slate-50 border border-slate-200 text-xs space-y-2">
          <div className="flex items-center space-x-2 font-bold text-slate-800">
            <svg className="w-4 h-4 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
              />
            </svg>
            <span>Citizen Protection & Data Integrity Guarantee</span>
          </div>
          <p className="text-slate-600 leading-relaxed">
            Your personal contact and incident records are compartmentalized. In future releases, multi-factor authentication (Aadhaar OTP / DigiLocker integration) will link official government police FIR lodging directly to your verified profile.
          </p>
        </div>

        <div className="mt-6 flex justify-end">
          <button
            type="button"
            disabled
            className="px-4 py-2 bg-slate-100 text-slate-400 rounded-lg text-xs font-semibold cursor-not-allowed border border-slate-200"
            title="Profile modification will be enabled when Spring Boot backend is connected"
          >
            Edit Profile (Disabled in Mock Mode)
          </button>
        </div>
      </div>
    </div>
  );
}
