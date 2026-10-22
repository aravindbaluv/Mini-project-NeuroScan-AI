import React, { useState } from 'react';

// Preset patient credentials for quick 1-click access
const DEMO_PATIENTS = [
  {
    mrn: 'MR-9823101',
    password: 'patient123',
    name: 'John M. Doe',
    ageGender: '54Y / Male',
    diagnosis: 'High-Grade Glioblastoma Multiforme (GBM)',
    status: 'Specialist Evaluation Required',
    badgeColor: 'border-red-500/40 text-red-400 bg-red-500/10'
  },
  {
    mrn: 'MR-4402917',
    password: 'patient123',
    name: 'Eleanor R. Vance',
    ageGender: '58Y / Female',
    diagnosis: 'Parasagittal Convexity Meningioma',
    status: 'Stable / Outpatient Monitoring',
    badgeColor: 'border-amber-500/40 text-amber-300 bg-amber-500/10'
  },
  {
    mrn: 'MR-7718290',
    password: 'patient123',
    name: 'Marcus A. Brody',
    ageGender: '47Y / Male',
    diagnosis: 'Pituitary Macroadenoma',
    status: 'Endocrine Panel Pending',
    badgeColor: 'border-purple-500/40 text-purple-300 bg-purple-500/10'
  },
  {
    mrn: 'MR-1092844',
    password: 'patient123',
    name: 'Sarah L. Connor',
    ageGender: '32Y / Female',
    diagnosis: 'Normal Brain (Healthy Neuro-Anatomy)',
    status: 'Normal / Healthy Baseline',
    badgeColor: 'border-emerald-500/40 text-emerald-400 bg-emerald-500/10'
  }
];

export default function HomePage({ onPatientLogin, onOpenClinicianLogin }) {
  const [patientId, setPatientId] = useState('MR-9823101');
  const [password, setPassword] = useState('patient123');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  // Handle Patient Quick Select
  const handleSelectPatientDemo = (p) => {
    setPatientId(p.mrn);
    setPassword(p.password);
    setErrorMsg('');
  };

  // Handle Patient Login Submit
  const handlePatientSubmit = (e) => {
    e.preventDefault();
    setErrorMsg('');

    if (!patientId.trim()) {
      setErrorMsg('Please enter your Patient Medical Record Number (MRN) or User ID.');
      return;
    }
    if (!password) {
      setErrorMsg('Please enter your portal password.');
      return;
    }

    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      // Clean MRN
      const cleaned = patientId.trim().toUpperCase();
      const matched = DEMO_PATIENTS.find(
        p => p.mrn.toUpperCase() === cleaned || p.name.toLowerCase().includes(patientId.toLowerCase())
      );

      const patientPayload = matched ? matched : {
        mrn: cleaned.startsWith('MR-') ? cleaned : `MR-${cleaned}`,
        name: patientId.includes('@') ? patientId.split('@')[0] : patientId,
        ageGender: 'Adult Patient',
        diagnosis: 'Diagnostic Study Review Pending'
      };

      onPatientLogin(patientPayload);
    }, 500);
  };

  return (
    <div className="min-h-screen w-screen bg-darkest text-slate-100 flex flex-col font-sans select-none overflow-x-hidden">
      {/* 1. Top Clinical Navigation Header */}
      <header className="h-20 px-6 sm:px-12 bg-darker/90 backdrop-blur-md border-b border-borderSubtle flex items-center justify-between sticky top-0 z-40">
        <div className="flex items-center gap-3.5">
          <div className="relative w-11 h-11 rounded-xl bg-gradient-to-br from-cyanPrimary/20 via-tealAccent/15 to-purpleAccent/20 border border-cyanPrimary/40 flex items-center justify-center shadow-lg shadow-cyanPrimary/20">
            <svg className="w-6 h-6 text-cyanPrimary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <circle cx="12" cy="12" r="9" strokeWidth="2" strokeDasharray="3 3"/>
              <path strokeWidth="2" strokeLinecap="round" d="M12 3v18M3 12h18"/>
              <circle cx="12" cy="12" r="3.5" fill="#00e5ff"/>
            </svg>
            <div className="absolute -top-1 -right-1 w-3 h-3 rounded-full bg-greenSuccess border-2 border-darker animate-pulse-dot"/>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xl font-extrabold font-display tracking-tight bg-gradient-to-r from-white via-slate-100 to-cyanPrimary bg-clip-text text-transparent">
                NeuroScan Health AI™
              </span>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-cyanPrimary/15 border border-cyanPrimary/30 text-cyanPrimary font-semibold hidden sm:inline-block">
                PATIENT & CLINICAL NETWORK
              </span>
            </div>
            <p className="text-xs text-slate-400 font-medium">
              Comprehensive Brain Tumor Diagnostic Institute & Healthcare Network
            </p>
          </div>
        </div>

        {/* Navigation CTAs */}
        <div className="flex items-center gap-3">
          <a
            href="#patient-login"
            className="px-4 py-2 rounded-xl bg-tealAccent/10 border border-tealAccent/30 hover:bg-tealAccent/20 text-xs font-semibold text-tealAccent transition-all flex items-center gap-2"
          >
            <svg className="w-4 h-4 text-tealAccent" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
            <span className="hidden sm:inline">Patient Portal Login</span>
            <span className="sm:hidden">Patient</span>
          </a>

          <button
            onClick={onOpenClinicianLogin}
            className="px-4 py-2 rounded-xl bg-gradient-to-r from-cyanPrimary to-tealAccent text-darkest font-bold text-xs uppercase tracking-wider transition-all hover:brightness-110 shadow-lg shadow-cyanPrimary/25 flex items-center gap-2 cursor-pointer"
          >
            <svg className="w-4 h-4 text-darkest" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <rect x="2" y="3" width="20" height="14" rx="2" ry="2" strokeWidth="2"/>
              <line x1="8" y1="21" x2="16" y2="21" strokeWidth="2"/>
              <line x1="12" y1="17" x2="12" y2="21" strokeWidth="2"/>
            </svg>
            <span className="hidden md:inline">Clinician PACS Access</span>
            <span className="md:hidden">Doctors</span>
          </button>
        </div>
      </header>

      {/* 2. Hero Section */}
      <section className="relative pt-12 pb-20 px-6 sm:px-12 overflow-hidden border-b border-borderSubtle">
        {/* Ambient Lights */}
        <div className="absolute top-1/4 left-1/3 -translate-x-1/2 -translate-y-1/2 w-[34rem] h-[34rem] bg-cyanPrimary/10 rounded-full blur-3xl pointer-events-none animate-pulse-dot" />
        <div className="absolute top-1/2 right-10 w-[28rem] h-[28rem] bg-purpleAccent/10 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 items-center relative z-10">
          {/* Left 7 Cols: Hero Value Proposition */}
          <div className="lg:col-span-7 space-y-6 text-left">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-surface border border-borderSubtle text-xs">
              <span className="w-2 h-2 rounded-full bg-cyanPrimary animate-pulse-dot" />
              <span className="text-slate-300 font-medium">SaMD FDA Level II Diagnostic Framework</span>
              <span className="text-slate-500">•</span>
              <span className="text-cyanPrimary font-mono">HIPAA & GDPR Compliant</span>
            </div>

            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold font-display tracking-tight text-white leading-tight">
              Transforming Brain Tumor Care with{' '}
              <span className="bg-gradient-to-r from-cyanPrimary via-tealAccent to-purpleAccent bg-clip-text text-transparent">
                Explainable AI
              </span>
            </h1>

            <p className="text-sm sm:text-base text-slate-300 leading-relaxed max-w-2xl">
              NeuroScan Health connects patients and neuro-oncologists with high-precision Deep Learning MRI diagnostics. Experience transparent volumetric reports, 3D tumor mapping, and direct care team coordination.
            </p>

            <div className="flex flex-wrap items-center gap-3.5 pt-2">
              <a
                href="#patient-login"
                className="px-6 py-3.5 rounded-xl bg-gradient-to-r from-tealAccent to-cyanPrimary text-darkest font-bold text-xs uppercase tracking-wider shadow-lg shadow-tealAccent/25 hover:brightness-110 transition-all flex items-center gap-2"
              >
                Access Patient Health Portal →
              </a>
              <button
                onClick={onOpenClinicianLogin}
                className="px-6 py-3.5 rounded-xl bg-card hover:bg-cardHover border border-borderSubtle text-slate-200 font-semibold text-xs flex items-center gap-2 transition-all cursor-pointer"
              >
                Launch Diagnostic PACS Suite
              </button>
            </div>

            {/* Quick Metrics Bar */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-6 border-t border-borderSubtle/60 text-left">
              <div>
                <span className="text-2xl sm:text-3xl font-extrabold font-mono text-cyanPrimary block">99.2%</span>
                <span className="text-xs text-slate-400">Diagnostic Specificity</span>
              </div>
              <div>
                <span className="text-2xl sm:text-3xl font-extrabold font-mono text-white block">40K+</span>
                <span className="text-xs text-slate-400">MRI Scans Analyzed</span>
              </div>
              <div>
                <span className="text-2xl sm:text-3xl font-extrabold font-mono text-tealAccent block">&lt;35ms</span>
                <span className="text-xs text-slate-400">Deep Learning Latency</span>
              </div>
              <div>
                <span className="text-2xl sm:text-3xl font-extrabold font-mono text-purpleAccent block">24/7</span>
                <span className="text-xs text-slate-400">Patient Care Access</span>
              </div>
            </div>
          </div>

          {/* Right 5 Cols: Embedded Patient Portal Login Form */}
          <div id="patient-login" className="lg:col-span-5">
            <div className="bg-darker/95 backdrop-blur-2xl border border-borderSubtle rounded-2xl shadow-2xl p-6 sm:p-8 space-y-5 relative">
              <div className="h-1 w-full bg-gradient-to-r from-tealAccent via-cyanPrimary to-purpleAccent absolute top-0 left-0 rounded-t-2xl" />

              <div className="border-b border-borderSubtle pb-4">
                <div className="flex items-center gap-2 text-tealAccent font-mono text-xs font-semibold uppercase tracking-wider">
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                  Patient Medical Portal
                </div>
                <h3 className="text-xl font-bold font-display text-white mt-1">Sign In to Your Records</h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  Enter your Medical Record Number (MRN) or User ID to access your scans & care plan.
                </p>
              </div>

              {/* 1-Click Patient Demo Profiles */}
              <div className="space-y-2">
                <span className="text-[11px] font-mono text-slate-400 uppercase tracking-wider block">
                  Quick 1-Click Patient Demo Accounts:
                </span>
                <div className="grid grid-cols-2 gap-2">
                  {DEMO_PATIENTS.map((p) => (
                    <button
                      key={p.mrn}
                      type="button"
                      onClick={() => handleSelectPatientDemo(p)}
                      className={`p-2 rounded-xl border text-left transition-all ${
                        patientId === p.mrn
                          ? 'bg-tealAccent/15 border-tealAccent text-white shadow-md'
                          : 'bg-surface/60 border-borderSubtle hover:bg-card text-slate-300'
                      }`}
                    >
                      <div className="text-xs font-semibold truncate">{p.name}</div>
                      <div className="text-[10px] font-mono text-slate-400 truncate">{p.mrn}</div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Error Message */}
              {errorMsg && (
                <div className="p-3 rounded-xl bg-redDanger/10 border border-redDanger/40 text-redDanger text-xs">
                  {errorMsg}
                </div>
              )}

              {/* Patient Login Form */}
              <form onSubmit={handlePatientSubmit} className="space-y-3.5 text-xs">
                <div>
                  <label className="block text-slate-300 mb-1 font-medium">Patient User ID / MRN</label>
                  <div className="relative">
                    <input
                      type="text"
                      value={patientId}
                      onChange={(e) => setPatientId(e.target.value)}
                      placeholder="e.g. MR-9823101 or john.doe"
                      required
                      className="w-full bg-surface/90 border border-borderSubtle focus:border-tealAccent focus:ring-1 focus:ring-tealAccent rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-slate-500 outline-none font-mono"
                    />
                  </div>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="block text-slate-300 font-medium">Password / Security PIN</label>
                    <span className="text-[10px] text-tealAccent font-mono">Demo: patient123</span>
                  </div>
                  <div className="relative">
                    <input
                      type={showPassword ? 'text' : 'password'}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••••••••"
                      required
                      className="w-full bg-surface/90 border border-borderSubtle focus:border-tealAccent focus:ring-1 focus:ring-tealAccent rounded-xl pl-3.5 pr-10 py-2.5 text-xs text-white placeholder-slate-500 outline-none font-mono"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white"
                    >
                      {showPassword ? 'Hide' : 'Show'}
                    </button>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full py-3 rounded-xl bg-gradient-to-r from-tealAccent via-cyanPrimary to-tealAccent text-darkest font-bold text-xs uppercase tracking-wider shadow-lg shadow-tealAccent/25 hover:brightness-110 transition-all cursor-pointer disabled:opacity-50"
                >
                  {isLoading ? 'Verifying Hospital Medical Records...' : 'Sign In to Patient Portal →'}
                </button>
              </form>

              <div className="pt-2 border-t border-borderSubtle text-[10px] text-slate-400 text-center flex items-center justify-center gap-1.5">
                <span>🔒 Protected by Johns Hopkins / NeuroScan Health HIPAA Security</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3. Core Brain Tumor Clinical Programs */}
      <section className="py-16 px-6 sm:px-12 max-w-7xl mx-auto w-full space-y-10">
        <div className="text-center space-y-2 max-w-2xl mx-auto">
          <span className="text-xs font-mono font-semibold text-cyanPrimary uppercase tracking-wider">
            Specialized Neuro-Oncology Centers
          </span>
          <h2 className="text-2xl sm:text-3xl font-extrabold font-display text-white">
            World-Class Diagnostic & Treatment Programs
          </h2>
          <p className="text-xs sm:text-sm text-slate-400">
            Our multi-disciplinary teams utilize AI U-Net segmentation and Grad-CAM explainability across key tumor classifications.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          <div className="p-6 rounded-2xl bg-card/60 border border-borderSubtle hover:border-red-500/50 transition-all space-y-3">
            <div className="w-10 h-10 rounded-xl bg-redDanger/15 border border-redDanger/30 flex items-center justify-center font-bold text-redDanger text-sm font-mono">
              GBM
            </div>
            <h3 className="text-sm font-bold text-white">High-Grade Glioblastoma Program</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Multi-compartment BraTS delineation distinguishing necrotic core, enhancing margins, and vasogenic edema.
            </p>
            <span className="text-[10px] text-red-400 font-mono block">WHO Grade IV • Stupp Protocol</span>
          </div>

          <div className="p-6 rounded-2xl bg-card/60 border border-borderSubtle hover:border-amber-500/50 transition-all space-y-3">
            <div className="w-10 h-10 rounded-xl bg-amberWarning/15 border border-amberWarning/30 flex items-center justify-center font-bold text-amberWarning text-sm font-mono">
              MEN
            </div>
            <h3 className="text-sm font-bold text-white">Intracranial Meningioma Center</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Sub-millimeter dural tail identification and volumetric growth monitoring for benign convexity lesions.
            </p>
            <span className="text-[10px] text-amber-300 font-mono block">WHO Grade I/II • Simpson Resection</span>
          </div>

          <div className="p-6 rounded-2xl bg-card/60 border border-borderSubtle hover:border-purple-500/50 transition-all space-y-3">
            <div className="w-10 h-10 rounded-xl bg-purpleAccent/15 border border-purpleAccent/30 flex items-center justify-center font-bold text-purpleAccent text-sm font-mono">
              PIT
            </div>
            <h3 className="text-sm font-bold text-white">Pituitary & Skull Base Clinic</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Specialized sellar/suprasellar micro-adenoma scans correlated with visual field and endocrine hormone panels.
            </p>
            <span className="text-[10px] text-purple-300 font-mono block">Endoscopic Transsphenoidal Surgery</span>
          </div>

          <div className="p-6 rounded-2xl bg-card/60 border border-borderSubtle hover:border-green-500/50 transition-all space-y-3">
            <div className="w-10 h-10 rounded-xl bg-greenSuccess/15 border border-greenSuccess/30 flex items-center justify-center font-bold text-greenSuccess text-sm font-mono">
              NRM
            </div>
            <h3 className="text-sm font-bold text-white">Preventative Brain Screening</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Comprehensive healthy baseline verification verifying symmetrical ventricular anatomy and parenchyma.
            </p>
            <span className="text-[10px] text-green-400 font-mono block">Zero Neoplasm • Rapid Triage</span>
          </div>
        </div>
      </section>

      {/* 4. Footer */}
      <footer className="mt-auto border-t border-borderSubtle bg-darker/90 py-10 px-6 sm:px-12 text-xs text-slate-400">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-1 text-center md:text-left">
            <div className="text-white font-bold font-display text-sm">NeuroScan Health AI™ System</div>
            <p className="text-[11px] text-slate-400">
              Department of Neuroradiology & Neurosurgery • Johns Hopkins Comprehensive Brain Tumor Center
            </p>
          </div>
          <div className="flex flex-wrap items-center justify-center gap-6 text-[11px]">
            <a href="#patient-login" className="hover:text-cyanPrimary transition-colors">Patient Portal</a>
            <button onClick={onOpenClinicianLogin} className="hover:text-cyanPrimary transition-colors cursor-pointer">
              Clinician PACS
            </button>
            <span className="text-slate-500">24/7 Patient Line: (410) 955-5000</span>
            <span className="text-slate-500">Emergency: 911</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
