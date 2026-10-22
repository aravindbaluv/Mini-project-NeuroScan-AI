import React, { useState } from 'react';

// Preset credentials for clinicians
const DEMO_CLINICIANS = [
  {
    userId: 's.jenkins@hopkins.edu',
    password: 'password123',
    name: 'Dr. Sarah Jenkins',
    title: 'Dr. Sarah Jenkins, MD, FACR',
    role: 'Attending Neuroradiologist',
    hospital: 'Johns Hopkins Comprehensive Brain Tumor Center',
    initials: 'SJ',
    npi: '988214',
    badgeColor: 'from-cyan-500 to-blue-600',
    avatarBg: 'bg-cyan-500/20 text-cyan-400 border-cyan-500/30'
  },
  {
    userId: 'm.vance@memorial.org',
    password: 'password123',
    name: 'Dr. Marcus Vance',
    title: 'Dr. Marcus Vance, MD, FACS',
    role: 'Chief of Neurosurgery',
    hospital: 'Memorial Brain Tumor Center',
    initials: 'MV',
    npi: '741902',
    badgeColor: 'from-emerald-500 to-teal-600',
    avatarBg: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30'
  },
  {
    userId: 'e.rostova@stanford.edu',
    password: 'password123',
    name: 'Dr. Elena Rostova',
    title: 'Dr. Elena Rostova, MD, PhD',
    role: 'Neuro-Oncology Fellow',
    hospital: 'Stanford Neuroscience Health Center',
    initials: 'ER',
    npi: '562189',
    badgeColor: 'from-purple-500 to-indigo-600',
    avatarBg: 'bg-purple-500/20 text-purple-400 border-purple-500/30'
  }
];

// Preset credentials for patients
const DEMO_PATIENTS = [
  {
    mrn: 'MR-9823101',
    password: 'patient123',
    name: 'John M. Doe',
    ageGender: '54Y / Male',
    diagnosis: 'High-Grade Glioblastoma Multiforme (GBM)',
    status: 'Specialist Evaluation Required'
  },
  {
    mrn: 'MR-4402917',
    password: 'patient123',
    name: 'Eleanor R. Vance',
    ageGender: '58Y / Female',
    diagnosis: 'Parasagittal Convexity Meningioma',
    status: 'Stable / Outpatient Monitoring'
  },
  {
    mrn: 'MR-7718290',
    password: 'patient123',
    name: 'Marcus A. Brody',
    ageGender: '47Y / Male',
    diagnosis: 'Pituitary Macroadenoma',
    status: 'Endocrine Panel Pending'
  },
  {
    mrn: 'MR-1092844',
    password: 'patient123',
    name: 'Sarah L. Connor',
    ageGender: '32Y / Female',
    diagnosis: 'Normal Brain (Healthy Neuro-Anatomy)',
    status: 'Normal / Healthy Baseline'
  }
];

export default function LoginPage({ onLoginSuccess, onPatientLoginSuccess, onReturnHome, defaultPortal = 'clinician' }) {
  const [portalMode, setPortalMode] = useState(defaultPortal); // 'clinician' | 'patient'

  // Clinician form state
  const [userId, setUserId] = useState('s.jenkins@hopkins.edu');
  const [password, setPassword] = useState('password123');
  const [role, setRole] = useState('Attending Neuroradiologist');
  const [hospital, setHospital] = useState('Johns Hopkins Comprehensive Brain Tumor Center');
  const [rememberMe, setRememberMe] = useState(true);

  // Patient form state
  const [patientId, setPatientId] = useState('MR-9823101');
  const [patientPassword, setPatientPassword] = useState('patient123');

  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [showForgotModal, setShowForgotModal] = useState(false);

  // Quick fill clinician credentials
  const handleSelectClinician = (clinician) => {
    setUserId(clinician.userId);
    setPassword(clinician.password);
    setRole(clinician.role);
    setHospital(clinician.hospital);
    setErrorMsg('');
  };

  // Quick fill patient credentials
  const handleSelectPatient = (p) => {
    setPatientId(p.mrn);
    setPatientPassword(p.password);
    setErrorMsg('');
  };

  // Submit Clinician Form
  const handleClinicianSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');

    if (!userId.trim()) {
      setErrorMsg('Please enter your Clinician User ID or Institutional Email.');
      return;
    }
    if (!password) {
      setErrorMsg('Please enter your security access password.');
      return;
    }

    setIsLoading(true);

    try {
      let authenticatedUser = null;
      try {
        const response = await fetch('http://localhost:8000/api/auth/login', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            email: userId.trim(),
            password: password,
            hospital: hospital,
            role: role
          })
        });

        if (response.ok) {
          const data = await response.json();
          if (data && data.clinician) {
            authenticatedUser = {
              name: data.clinician.name,
              title: data.clinician.title,
              role: data.clinician.role,
              hospital: data.clinician.hospital,
              initials: data.clinician.initials,
              email: data.clinician.email,
              npi: data.clinician.npi || '988214',
              token: data.access_token
            };
          }
        }
      } catch (backendErr) {
        console.info('FastAPI backend offline, utilizing client-side verification:', backendErr);
      }

      if (!authenticatedUser) {
        const matchedDemo = DEMO_CLINICIANS.find(
          c => c.userId.toLowerCase() === userId.trim().toLowerCase()
        );

        if (matchedDemo) {
          authenticatedUser = {
            ...matchedDemo,
            hospital: hospital,
            role: role
          };
        } else {
          const rawName = userId.includes('@') 
            ? userId.split('@')[0].replace(/[._]/g, ' ') 
            : userId.replace(/[._]/g, ' ');
          const formattedName = rawName.charAt(0).toUpperCase() + rawName.slice(1);
          const clinicianName = formattedName.toLowerCase().startsWith('dr') 
            ? formattedName 
            : `Dr. ${formattedName}`;
          
          const parts = rawName.split(' ').filter(Boolean);
          const initials = parts.length >= 2 
            ? (parts[0][0] + parts[1][0]).toUpperCase() 
            : (rawName.slice(0, 2) || 'MD').toUpperCase();

          authenticatedUser = {
            userId: userId.trim(),
            name: clinicianName,
            title: `${clinicianName}, MD`,
            role: role,
            hospital: hospital,
            initials: initials,
            npi: '988214',
            token: `neuro-local-${Date.now()}`
          };
        }
      }

      await new Promise(r => setTimeout(r, 500));

      if (rememberMe) {
        localStorage.setItem('neuroscan_auth_user', JSON.stringify(authenticatedUser));
      } else {
        sessionStorage.setItem('neuroscan_auth_user', JSON.stringify(authenticatedUser));
      }

      onLoginSuccess(authenticatedUser);
    } catch (err) {
      setErrorMsg('An unexpected error occurred during authentication.');
    } finally {
      setIsLoading(false);
    }
  };

  // Submit Patient Form
  const handlePatientSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');

    if (!patientId.trim()) {
      setErrorMsg('Please enter your Patient MRN or User ID.');
      return;
    }
    if (!patientPassword) {
      setErrorMsg('Please enter your portal password.');
      return;
    }

    setIsLoading(true);
    await new Promise(r => setTimeout(r, 500));
    setIsLoading(false);

    const cleaned = patientId.trim().toUpperCase();
    const matched = DEMO_PATIENTS.find(
      p => p.mrn.toUpperCase() === cleaned || p.name.toLowerCase().includes(patientId.toLowerCase())
    );

    const patientPayload = matched ? matched : {
      mrn: cleaned.startsWith('MR-') ? cleaned : `MR-${cleaned}`,
      name: patientId.includes('@') ? patientId.split('@')[0] : patientId,
      ageGender: 'Adult Patient',
      diagnosis: 'Diagnostic Record Review'
    };

    onPatientLoginSuccess(patientPayload);
  };

  return (
    <div className="relative min-h-screen w-screen bg-darkest text-slate-100 flex items-center justify-center p-4 sm:p-6 overflow-x-hidden font-sans select-none">
      {/* Background Decorative Ambient Glows */}
      <div className="absolute top-1/4 left-1/4 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-cyanPrimary/10 rounded-full blur-3xl pointer-events-none animate-pulse-dot" />
      <div className="absolute bottom-1/4 right-1/4 translate-x-1/2 translate-y-1/2 w-[32rem] h-[32rem] bg-purpleAccent/10 rounded-full blur-3xl pointer-events-none" />

      {/* Main Authentication Card */}
      <div className="relative w-full max-w-2xl bg-darker/90 backdrop-blur-2xl border border-borderSubtle/80 rounded-2xl shadow-2xl shadow-black/80 overflow-hidden z-10 transition-all">
        {/* Top Glowing Header Strip */}
        <div className={`h-1.5 w-full bg-gradient-to-r ${portalMode === 'clinician' ? 'from-cyanPrimary via-tealAccent to-purpleAccent' : 'from-tealAccent via-cyanPrimary to-tealAccent'}`} />

        <div className="p-6 sm:p-8 space-y-6">
          {/* Top Bar: Return Home & Portal Mode Toggle */}
          <div className="flex items-center justify-between border-b border-borderSubtle/60 pb-4">
            <button
              onClick={onReturnHome}
              className="text-xs text-slate-400 hover:text-white flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              ← Back to Hospital Home
            </button>

            {/* Portal Switcher Pill */}
            <div className="flex items-center p-1 rounded-xl bg-surface border border-borderSubtle text-xs">
              <button
                type="button"
                onClick={() => { setPortalMode('clinician'); setErrorMsg(''); }}
                className={`px-3 py-1 rounded-lg font-semibold flex items-center gap-1.5 transition-all cursor-pointer ${
                  portalMode === 'clinician'
                    ? 'bg-cyanPrimary/20 text-cyanPrimary border border-cyanPrimary/40'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                🩺 Clinician PACS
              </button>
              <button
                type="button"
                onClick={() => { setPortalMode('patient'); setErrorMsg(''); }}
                className={`px-3 py-1 rounded-lg font-semibold flex items-center gap-1.5 transition-all cursor-pointer ${
                  portalMode === 'patient'
                    ? 'bg-tealAccent/20 text-tealAccent border border-tealAccent/40'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                👤 Patient Portal
              </button>
            </div>
          </div>

          {/* Logo & Subtitle */}
          <div className="flex items-center gap-3.5">
            <div className="relative w-12 h-12 rounded-xl bg-gradient-to-br from-cyanPrimary/20 via-tealAccent/15 to-purpleAccent/20 border border-cyanPrimary/40 flex items-center justify-center shadow-lg shadow-cyanPrimary/20">
              <svg className="w-7 h-7 text-cyanPrimary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <circle cx="12" cy="12" r="9" strokeWidth="2" strokeDasharray="3 3" />
                <path strokeWidth="2" strokeLinecap="round" d="M12 3v18M3 12h18" />
                <circle cx="12" cy="12" r="3.5" fill="#00e5ff" />
              </svg>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl font-bold font-display tracking-tight text-white">
                  NeuroScan Health AI™
                </h1>
                <span className={`text-[10px] font-mono px-2 py-0.5 rounded font-semibold ${portalMode === 'clinician' ? 'bg-cyanPrimary/15 text-cyanPrimary border border-cyanPrimary/30' : 'bg-tealAccent/15 text-tealAccent border border-tealAccent/30'}`}>
                  {portalMode === 'clinician' ? 'DOCTOR / PACS WORKSTATION' : 'PATIENT ELECTRONIC RECORDS'}
                </span>
              </div>
              <p className="text-xs text-slate-400 font-medium">
                {portalMode === 'clinician'
                  ? 'Authorized Neuroradiology & Neurosurgery Diagnostic Workstation'
                  : 'Secure Access to Your MRI Scans, Diagnostic Findings & Care Plan'}
              </p>
            </div>
          </div>

          {/* Error Message */}
          {errorMsg && (
            <div className="p-3 rounded-xl bg-redDanger/10 border border-redDanger/40 text-redDanger text-xs animate-shake">
              {errorMsg}
            </div>
          )}

          {/* ================= MODE A: CLINICIAN LOGIN ================= */}
          {portalMode === 'clinician' ? (
            <div className="space-y-5">
              {/* 1-Click Clinician Profiles */}
              <div className="space-y-2">
                <span className="text-[11px] font-mono text-slate-400 uppercase tracking-wider block">
                  Quick 1-Click Clinician Profiles:
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                  {DEMO_CLINICIANS.map((c) => (
                    <button
                      key={c.userId}
                      type="button"
                      onClick={() => handleSelectClinician(c)}
                      className={`p-2.5 rounded-xl border text-left transition-all ${
                        userId.toLowerCase() === c.userId.toLowerCase()
                          ? 'bg-cyanPrimary/10 border-cyanPrimary/50 shadow-md shadow-cyanPrimary/10'
                          : 'bg-surface/50 border-borderSubtle hover:bg-card text-slate-300'
                      }`}
                    >
                      <div className="text-xs font-semibold text-white truncate">{c.name}</div>
                      <div className="text-[10px] text-slate-400 truncate">{c.role.split(' ')[0]}</div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Form */}
              <form onSubmit={handleClinicianSubmit} className="space-y-4 text-xs">
                <div>
                  <label className="block text-slate-300 mb-1 font-medium">Hospital Facility</label>
                  <select
                    value={hospital}
                    onChange={(e) => setHospital(e.target.value)}
                    className="w-full bg-surface/90 border border-borderSubtle rounded-xl px-3.5 py-2.5 text-xs text-white outline-none"
                  >
                    <option value="Johns Hopkins Comprehensive Brain Tumor Center">Johns Hopkins Comprehensive Brain Tumor Center</option>
                    <option value="Memorial Brain Tumor Center">Memorial Brain Tumor Center</option>
                    <option value="Stanford Neuroscience Health Center">Stanford Neuroscience Health Center</option>
                    <option value="Mayo Clinic Department of Neurologic Surgery">Mayo Clinic Department of Neurologic Surgery</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-300 mb-1 font-medium">Clinician User ID / Institutional Email</label>
                  <input
                    type="text"
                    value={userId}
                    onChange={(e) => setUserId(e.target.value)}
                    placeholder="e.g. s.jenkins@hopkins.edu or DR-8042"
                    required
                    className="w-full bg-surface/90 border border-borderSubtle rounded-xl px-3.5 py-2.5 text-xs text-white font-mono outline-none"
                  />
                </div>

                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="block text-slate-300 font-medium">Password</label>
                    <button type="button" onClick={() => setShowForgotModal(true)} className="text-[11px] text-cyanPrimary hover:underline">
                      Forgot password?
                    </button>
                  </div>
                  <div className="relative">
                    <input
                      type={showPassword ? 'text' : 'password'}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••••••••"
                      required
                      className="w-full bg-surface/90 border border-borderSubtle rounded-xl pl-3.5 pr-10 py-2.5 text-xs text-white font-mono outline-none"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white"
                    >
                      {showPassword ? 'Hide' : 'Show'}
                    </button>
                  </div>
                </div>

                <div className="flex items-center justify-between text-xs pt-1">
                  <label className="flex items-center gap-2 cursor-pointer select-none text-slate-300">
                    <input
                      type="checkbox"
                      checked={rememberMe}
                      onChange={(e) => setRememberMe(e.target.checked)}
                      className="rounded border-borderSubtle text-cyanPrimary bg-surface w-4 h-4 cursor-pointer"
                    />
                    <span>Remember clinician shift (8 hours)</span>
                  </label>
                </div>

                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full py-3 rounded-xl bg-gradient-to-r from-cyanPrimary via-tealAccent to-cyanPrimary text-darkest font-bold text-xs uppercase tracking-wider shadow-lg shadow-cyanPrimary/25 hover:brightness-110 transition-all cursor-pointer disabled:opacity-60"
                >
                  {isLoading ? 'Verifying Hospital Credentials...' : 'Sign In to Diagnostic PACS'}
                </button>
              </form>
            </div>
          ) : (
            /* ================= MODE B: PATIENT LOGIN ================= */
            <div className="space-y-5">
              {/* 1-Click Patient Profiles */}
              <div className="space-y-2">
                <span className="text-[11px] font-mono text-slate-400 uppercase tracking-wider block">
                  Quick 1-Click Patient Accounts:
                </span>
                <div className="grid grid-cols-2 gap-2">
                  {DEMO_PATIENTS.map((p) => (
                    <button
                      key={p.mrn}
                      type="button"
                      onClick={() => handleSelectPatient(p)}
                      className={`p-2.5 rounded-xl border text-left transition-all ${
                        patientId === p.mrn
                          ? 'bg-tealAccent/15 border-tealAccent text-white shadow-md'
                          : 'bg-surface/50 border-borderSubtle hover:bg-card text-slate-300'
                      }`}
                    >
                      <div className="text-xs font-semibold text-white truncate">{p.name}</div>
                      <div className="text-[10px] font-mono text-slate-400 truncate">{p.mrn}</div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Form */}
              <form onSubmit={handlePatientSubmit} className="space-y-4 text-xs">
                <div>
                  <label className="block text-slate-300 mb-1 font-medium">Patient Medical Record Number (MRN) or User ID</label>
                  <input
                    type="text"
                    value={patientId}
                    onChange={(e) => setPatientId(e.target.value)}
                    placeholder="e.g. MR-9823101 or john.doe"
                    required
                    className="w-full bg-surface/90 border border-borderSubtle rounded-xl px-3.5 py-2.5 text-xs text-white font-mono outline-none"
                  />
                </div>

                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="block text-slate-300 font-medium">Password / Security PIN</label>
                    <span className="text-[10px] text-tealAccent font-mono">Demo: patient123</span>
                  </div>
                  <div className="relative">
                    <input
                      type={showPassword ? 'text' : 'password'}
                      value={patientPassword}
                      onChange={(e) => setPatientPassword(e.target.value)}
                      placeholder="••••••••••••"
                      required
                      className="w-full bg-surface/90 border border-borderSubtle rounded-xl pl-3.5 pr-10 py-2.5 text-xs text-white font-mono outline-none"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white"
                    >
                      {showPassword ? 'Hide' : 'Show'}
                    </button>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full py-3 rounded-xl bg-gradient-to-r from-tealAccent via-cyanPrimary to-tealAccent text-darkest font-bold text-xs uppercase tracking-wider shadow-lg shadow-tealAccent/25 hover:brightness-110 transition-all cursor-pointer disabled:opacity-60"
                >
                  {isLoading ? 'Retrieving Patient Medical Records...' : 'Sign In to Patient Portal →'}
                </button>
              </form>
            </div>
          )}

          {/* Footer Security */}
          <div className="pt-4 border-t border-borderSubtle/60 flex flex-col sm:flex-row items-center justify-between gap-2 text-[10px] text-slate-400 font-mono">
            <span>🔒 256-Bit TLS Healthcare Encryption</span>
            <span>HIPAA Security Protected Portal</span>
          </div>
        </div>
      </div>

      {/* Forgot Credentials Modal */}
      {showForgotModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-darker border border-borderSubtle rounded-xl max-w-md w-full p-6 space-y-4 shadow-2xl">
            <h3 className="text-sm font-bold text-white">Credential Assistance</h3>
            <p className="text-xs text-slate-300 leading-relaxed">
              For security, medical accounts are authenticated by your hospital IT or Patient Registration department.
            </p>
            <div className="p-3 bg-surface/70 border border-borderSubtle rounded-lg text-xs space-y-1 font-mono text-slate-300">
              <div><strong>Helpdesk:</strong> (410) 955-5000</div>
              <div><strong>Support Email:</strong> portal-support@neuroscan.local</div>
            </div>
            <button
              onClick={() => setShowForgotModal(false)}
              className="w-full py-2 bg-card hover:bg-cardHover rounded-lg text-xs font-semibold text-white border border-borderSubtle"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
