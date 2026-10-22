import React, { useState } from 'react';

// Patient records mapped by MRN / User ID
const PATIENT_DATA = {
  'MR-9823101': {
    mrn: 'MR-9823101',
    name: 'John M. Doe',
    ageGender: '54Y / Male',
    email: 'john.doe@email.com',
    dob: 'May 14, 1972',
    phone: '+1 (410) 555-0182',
    hospital: 'Johns Hopkins Comprehensive Brain Tumor Center',
    primaryPhysician: 'Dr. Sarah Jenkins, MD, FACR (Neuroradiologist)',
    surgeon: 'Dr. Marcus Vance, MD, FACS (Chief of Neurosurgery)',
    latestScan: {
      studyId: '#NS-8042-GBM',
      date: 'October 13, 2026',
      sequence: 'MRI 3.0T AX T1-CE + FLAIR',
      status: 'Specialist Evaluation Required',
      statusSeverity: 'amber',
      diagnosis: 'High-Grade Glioblastoma Multiforme (GBM)',
      summaryTitle: 'Contrast-Enhancing Intra-Axial Right Frontal-Temporal Lesion',
      plainEnglishSummary: 'Your recent MRI scan identified a localized mass in the right frontal-temporal region of the brain. The area shows active contrast enhancement and surrounding tissue swelling (edema). Your clinical care team has reviewed the volumetric measurements and scheduled an immediate multidisciplinary neurosurgical consultation.',
      volumetrics: {
        volume: '28.4 cm³',
        diameter: '41.8 mm',
        location: 'Right Frontal-Temporal Lobe',
        midlineShift: '4.2 mm'
      },
      nextSteps: [
        'Neurosurgical Consultation with Dr. Marcus Vance on Thursday, Oct 16 at 10:00 AM',
        'Functional Speech & Motor Tractography MRI scheduled for pre-operative planning',
        'Continue anti-edema corticosteroid medication as prescribed by oncology'
      ]
    }
  },
  'MR-4402917': {
    mrn: 'MR-4402917',
    name: 'Eleanor R. Vance',
    ageGender: '58Y / Female',
    email: 'e.vance@email.com',
    dob: 'August 22, 1968',
    phone: '+1 (410) 555-0429',
    hospital: 'Memorial Brain Tumor Center',
    primaryPhysician: 'Dr. Sarah Jenkins, MD, FACR',
    surgeon: 'Dr. Marcus Vance, MD, FACS',
    latestScan: {
      studyId: '#NS-7119-MEN',
      date: 'October 12, 2026',
      sequence: 'MRI 3.0T AX T1-CE + T2',
      status: 'Stable / Outpatient Monitoring',
      statusSeverity: 'blue',
      diagnosis: 'Parasagittal Convexity Meningioma (WHO Grade I)',
      summaryTitle: 'Well-Circumscribed Extra-Axial Dural-Based Neoplasm',
      plainEnglishSummary: 'Your MRI scan shows a well-defined extra-axial benign lesion along the right parietal convexity. The findings are characteristic of a slow-growing Grade I meningioma with a typical dural tail sign. No acute brain parenchymal invasion is noted.',
      volumetrics: {
        volume: '16.2 cm³',
        diameter: '32.5 mm',
        location: 'Right Parietal Convexity',
        midlineShift: '1.8 mm'
      },
      nextSteps: [
        'Outpatient Neurosurgical Review on Monday, Oct 20 at 2:30 PM',
        'Evaluation for elective stereotactic radiosurgery vs. watchful surveillance',
        'Follow-up contrast MRI recommended in 6 months'
      ]
    }
  },
  'MR-7718290': {
    mrn: 'MR-7718290',
    name: 'Marcus A. Brody',
    ageGender: '47Y / Male',
    email: 'm.brody@email.com',
    dob: 'November 03, 1979',
    phone: '+1 (410) 555-0814',
    hospital: 'Stanford Neuroscience Health Center',
    primaryPhysician: 'Dr. Elena Rostova, MD',
    surgeon: 'Dr. Marcus Vance, MD, FACS',
    latestScan: {
      studyId: '#NS-4902-PIT',
      date: 'October 10, 2026',
      sequence: 'MRI 3.0T PITUITARY PROTOCOL (T1+C)',
      status: 'Endocrine Panel Pending',
      statusSeverity: 'purple',
      diagnosis: 'Pituitary Macroadenoma (Sellar / Suprasellar)',
      summaryTitle: 'Sellar Mass with Minimal Suprasellar Extension',
      plainEnglishSummary: 'Your specialized pituitary protocol MRI demonstrates an adenoma located within the sella turcica, extending mildly upward toward the optic chiasm. Visual field testing is recommended alongside serum hormone evaluations.',
      volumetrics: {
        volume: '8.7 cm³',
        diameter: '22.4 mm',
        location: 'Sella Turcica / Midline Centered',
        midlineShift: '0.0 mm'
      },
      nextSteps: [
        'Complete Serum Pituitary Hormone Panel (Prolactin, IGF-1, Cortisol)',
        'Formal Neuro-Ophthalmology Visual Field Exam on Friday, Oct 17',
        'Endocrine consultation to determine medical vs. transsphenoidal surgical path'
      ]
    }
  },
  'MR-1092844': {
    mrn: 'MR-1092844',
    name: 'Sarah L. Connor',
    ageGender: '32Y / Female',
    email: 's.connor@email.com',
    dob: 'January 19, 1994',
    phone: '+1 (410) 555-0992',
    hospital: 'Johns Hopkins Comprehensive Brain Tumor Center',
    primaryPhysician: 'Dr. Sarah Jenkins, MD, FACR',
    surgeon: 'N/A (Non-Neoplastic)',
    latestScan: {
      studyId: '#NS-1025-NRM',
      date: 'October 14, 2026',
      sequence: 'MRI 3.0T BRAIN SCREENING (T1+T2)',
      status: 'Normal / Healthy Baseline',
      statusSeverity: 'green',
      diagnosis: 'Normal Brain (Healthy Neuro-Anatomy)',
      summaryTitle: 'Unremarkable Brain Parenchyma & Ventricular System',
      plainEnglishSummary: 'Congratulations! Your brain screening MRI demonstrates completely normal neuro-anatomy. No tumors, aneurysms, abnormal contrast enhancements, or midline shifts were detected. Cerebral ventricles, sulci, and brainstem are symmetric and healthy.',
      volumetrics: {
        volume: '0.0 cm³',
        diameter: '0.0 mm',
        location: 'Symmetrical / Normal',
        midlineShift: '0.0 mm'
      },
      nextSteps: [
        'No oncologic or neurosurgical intervention indicated',
        'General neurology follow-up for routine headache/migraine care if symptoms persist',
        'Diagnostic report archived in your permanent electronic health record'
      ]
    }
  }
};

export default function PatientPortal({ patientUser, onLogout, onSwitchToDoctor }) {
  // Resolve patient details from patientUser
  const mrnKey = patientUser?.mrn || 'MR-9823101';
  const patient = PATIENT_DATA[mrnKey] || PATIENT_DATA['MR-9823101'];
  const [activeTab, setActiveTab] = useState('overview'); // 'overview' | 'scan' | 'appointments' | 'messages'
  const [showMessageModal, setShowMessageModal] = useState(false);
  const [messageText, setMessageText] = useState('');
  const [messageSent, setMessageSent] = useState(false);

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!messageText.trim()) return;
    setMessageSent(true);
    setTimeout(() => {
      setMessageSent(false);
      setMessageText('');
      setShowMessageModal(false);
    }, 1400);
  };

  const handleExportPatientSummary = () => {
    const txt = `================================================================================
PATIENT HEALTH PORTAL — DIAGNOSTIC MRI SUMMARY
Johns Hopkins Comprehensive Brain Tumor Center
================================================================================
PATIENT DETAILS:
  Name: ${patient.name}
  MRN / Patient ID: ${patient.mrn}
  Date of Birth: ${patient.dob}
  Contact: ${patient.phone} | ${patient.email}

ATTENDING CARE TEAM:
  Neuroradiologist: ${patient.primaryPhysician}
  Lead Neurosurgeon: ${patient.surgeon}
  Clinical Facility: ${patient.hospital}

LATEST MRI SCAN FINDINGS (${patient.latestScan.date}):
  Study ID: ${patient.latestScan.studyId}
  Sequence: ${patient.latestScan.sequence}
  Diagnosis: ${patient.latestScan.diagnosis}
  Status: ${patient.latestScan.status}

PLAIN-ENGLISH SUMMARY:
${patient.latestScan.plainEnglishSummary}

AI VOLUMETRICS:
  - Estimated Volume: ${patient.latestScan.volumetrics.volume}
  - Maximum Diameter: ${patient.latestScan.volumetrics.diameter}
  - Anatomical Location: ${patient.latestScan.volumetrics.location}
  - Midline Shift: ${patient.latestScan.volumetrics.midlineShift}

RECOMMENDED NEXT STEPS:
${patient.latestScan.nextSteps.map((s, i) => `  ${i + 1}. ${s}`).join('\n')}

================================================================================
Downloaded from NeuroScan AI Patient Care Portal on ${new Date().toLocaleDateString()}
================================================================================`;

    const blob = new Blob([txt], { type: 'text/plain;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.download = `Patient_Summary_${patient.mrn.replace(/[^a-zA-Z0-9]/g, '_')}.txt`;
    link.href = url;
    link.click();
    URL.revokeObjectURL(url);
  };

  const handleExportHtmlReport = () => {
    const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>Patient Diagnostic MRI Summary — ${patient.name}</title>
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; background: #f8fafc; color: #0f172a; padding: 24px; line-height: 1.6; }
    .box { max-width: 800px; margin: 0 auto; background: #fff; padding: 36px; border: 1px solid #e2e8f0; border-radius: 10px; box-shadow: 0 4px 15px rgba(0,0,0,0.05); }
    .header { border-bottom: 2px solid #0284c7; padding-bottom: 16px; margin-bottom: 20px; }
    .title { font-size: 22px; font-weight: 800; color: #0f172a; }
    .sub { color: #64748b; font-size: 13px; }
    .banner { background: #f0f9ff; border: 1px solid #bae6fd; padding: 16px; border-radius: 8px; margin-bottom: 20px; }
    .grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 12px; margin-bottom: 20px; font-size: 13.5px; }
    .p-title { font-size: 14px; font-weight: 800; text-transform: uppercase; color: #0284c7; margin-top: 20px; margin-bottom: 8px; }
    .p-text { font-size: 14px; color: #334155; }
    .btn-print { background: #0284c7; color: #fff; border: none; padding: 8px 18px; border-radius: 4px; font-weight: 600; cursor: pointer; float: right; }
    @media print { .btn-print { display: none; } body { padding: 0; } .box { border: none; box-shadow: none; padding: 0; } }
  </style>
</head>
<body>
  <div class="box">
    <button class="btn-print" onclick="window.print()">Print / Save PDF</button>
    <div class="header">
      <div class="title">PATIENT DIAGNOSTIC MRI SUMMARY</div>
      <div class="sub">${patient.hospital || 'NeuroScan Health Medical Center'} • Patient Care Portal</div>
    </div>
    <div class="grid">
      <div><strong>Patient Name:</strong> ${patient.name}</div>
      <div><strong>Medical Record (MRN):</strong> ${patient.mrn}</div>
      <div><strong>Attending Physician:</strong> ${patient.primaryPhysician || 'Dr. Sarah Jenkins, MD'}</div>
      <div><strong>Examination Date:</strong> ${patient.latestScan.date}</div>
      <div><strong>Modality:</strong> ${patient.latestScan.sequence}</div>
      <div><strong>Clinical Care Plan:</strong> ${patient.latestScan.diagnosis}</div>
    </div>
    <div class="p-title">Plain-English Findings</div>
    <div class="banner">
      <div class="p-text">${patient.latestScan.plainEnglishSummary}</div>
    </div>
    <div class="p-title">Measurements & Volumetrics</div>
    <div class="grid">
      <div><strong>Estimated Lesion Volume:</strong> ${patient.latestScan.volumetrics.volume}</div>
      <div><strong>Max Dimension:</strong> ${patient.latestScan.volumetrics.diameter}</div>
      <div><strong>Anatomical Location:</strong> ${patient.latestScan.volumetrics.location}</div>
      <div><strong>Midline Mass Effect:</strong> ${patient.latestScan.volumetrics.midlineShift}</div>
    </div>
    <div class="p-title">Next Care Milestones</div>
    <div class="p-text">
      <ul>
        ${patient.latestScan.nextSteps.map(s => `<li>${s}</li>`).join('')}
      </ul>
    </div>
  </div>
</body>
</html>`;

    const blob = new Blob([html], { type: 'text/html;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.download = `Patient_MRI_Summary_${patient.mrn.replace(/[^a-zA-Z0-9]/g, '_')}.html`;
    link.href = url;
    link.click();
    URL.revokeObjectURL(url);
  };


  return (
    <div className="min-h-screen w-screen bg-darkest text-slate-100 flex flex-col font-sans select-none overflow-x-hidden">
      {/* Top Patient Portal Navigation Bar */}
      <header className="h-16 px-6 bg-darker/90 backdrop-blur-md border-b border-borderSubtle flex items-center justify-between z-30 sticky top-0">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-tealAccent/20 to-cyanPrimary/20 border border-tealAccent/40 flex items-center justify-center shadow-lg shadow-tealAccent/20">
            <svg className="w-6 h-6 text-tealAccent" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-lg font-bold font-display bg-gradient-to-r from-white to-tealAccent bg-clip-text text-transparent">
                MyHealth AI™
              </h1>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-tealAccent/15 border border-tealAccent/30 text-tealAccent font-semibold">
                PATIENT PORTAL
              </span>
            </div>
            <p className="text-xs text-slate-400 font-medium">NeuroScan Health Oncology Patient Care Network</p>
          </div>
        </div>

        {/* Patient Status Badges & Quick Action Controls */}
        <div className="flex items-center gap-3">
          <div className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-full bg-surface/80 border border-borderSubtle text-xs">
            <span className="text-slate-400 text-[11px]">MRN:</span>
            <span className="font-mono text-cyanPrimary font-semibold">{patient.mrn}</span>
            <span className="text-slate-500">•</span>
            <span className="text-slate-200 font-medium">{patient.name}</span>
          </div>

          <button
            onClick={onSwitchToDoctor}
            className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-card border border-borderSubtle hover:border-cyanPrimary text-xs font-semibold text-slate-300 hover:text-white transition-all cursor-pointer"
            title="Clinician PACS Workstation (Doctors Only)"
          >
            <svg className="w-3.5 h-3.5 text-cyanPrimary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <rect x="2" y="3" width="20" height="14" rx="2" ry="2" strokeWidth="2"/>
              <line x1="8" y1="21" x2="16" y2="21" strokeWidth="2"/>
              <line x1="12" y1="17" x2="12" y2="21" strokeWidth="2"/>
            </svg>
            Clinician PACS Workstation
          </button>

          <button
            onClick={onLogout}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-redDanger/10 border border-redDanger/30 text-xs font-semibold text-redDanger hover:bg-redDanger/20 transition-all cursor-pointer"
          >
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
            </svg>
            Sign Out
          </button>
        </div>
      </header>

      {/* Main Patient Dashboard Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 lg:p-8 space-y-6">
        {/* Welcome Hero Banner */}
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-card via-surface to-darker border border-borderSubtle p-6 sm:p-8 shadow-xl">
          <div className="absolute top-0 right-0 w-80 h-80 bg-tealAccent/5 rounded-full blur-3xl pointer-events-none" />
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <span className="w-2.5 h-2.5 rounded-full bg-greenSuccess animate-pulse-dot" />
                <span className="text-xs font-mono font-semibold text-greenSuccess uppercase tracking-wider">
                  Secure Electronic Medical Records (HIPAA Protected)
                </span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-extrabold font-display text-white tracking-tight">
                Welcome back, {patient.name}
              </h2>
              <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-2xl leading-relaxed">
                Review your recent diagnostic neuroimaging, treatment plan milestones, and communicate directly with your attending neuro-oncology team at <strong>{patient.hospital}</strong>.
              </p>
            </div>

            <div className="flex flex-wrap gap-2.5 shrink-0">
              <button
                onClick={() => window.print()}
                className="px-4 py-2.5 rounded-xl bg-card hover:bg-cardHover border border-borderSubtle text-xs font-semibold text-white flex items-center gap-2 transition-all cursor-pointer shadow-md"
              >
                <svg className="w-4 h-4 text-cyanPrimary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <polyline points="6 9 6 2 18 2 18 9"/>
                  <path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"/>
                  <rect x="6" y="14" width="12" height="8"/>
                </svg>
                Print Health Summary
              </button>
              <button
                onClick={handleExportHtmlReport}
                className="px-4 py-2.5 rounded-xl bg-tealAccent/15 hover:bg-tealAccent/25 border border-tealAccent/40 text-xs font-semibold text-tealAccent flex items-center gap-2 transition-all cursor-pointer shadow-md"
                title="Download interactive standalone HTML report"
              >
                <svg className="w-4 h-4 text-tealAccent" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                </svg>
                Export Report (.HTML)
              </button>
              <button
                onClick={handleExportPatientSummary}
                className="px-4 py-2.5 rounded-xl bg-card hover:bg-cardHover border border-borderSubtle text-xs font-semibold text-slate-300 flex items-center gap-2 transition-all cursor-pointer shadow-md"
                title="Download patient records as plain-text summary"
              >
                <svg className="w-4 h-4 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                Export Text (.TXT)
              </button>
              <button
                onClick={() => setShowMessageModal(true)}
                className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-tealAccent to-cyanPrimary text-darkest font-bold text-xs uppercase tracking-wider flex items-center gap-2 transition-all hover:brightness-110 cursor-pointer shadow-lg shadow-tealAccent/25"
              >
                <svg className="w-4 h-4 text-darkest" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                </svg>
                Message Care Team
              </button>
            </div>
          </div>
        </div>

        {/* Tab Navigation Controls */}
        <div className="flex border-b border-borderSubtle gap-2 text-xs font-semibold">
          <button
            onClick={() => setActiveTab('overview')}
            className={`pb-3 px-3 transition-colors cursor-pointer border-b-2 ${
              activeTab === 'overview'
                ? 'border-cyanPrimary text-cyanPrimary'
                : 'border-transparent text-slate-400 hover:text-white'
            }`}
          >
            📋 Latest MRI Results & Care Plan
          </button>
          <button
            onClick={() => setActiveTab('scan')}
            className={`pb-3 px-3 transition-colors cursor-pointer border-b-2 ${
              activeTab === 'scan'
                ? 'border-cyanPrimary text-cyanPrimary'
                : 'border-transparent text-slate-400 hover:text-white'
            }`}
          >
            🧠 Interactive Scan Preview
          </button>
          <button
            onClick={() => setActiveTab('careteam')}
            className={`pb-3 px-3 transition-colors cursor-pointer border-b-2 ${
              activeTab === 'careteam'
                ? 'border-cyanPrimary text-cyanPrimary'
                : 'border-transparent text-slate-400 hover:text-white'
            }`}
          >
            🩺 Care Team & Facility Info
          </button>
        </div>

        {/* Tab 1: Latest MRI Diagnostic Report Overview */}
        {activeTab === 'overview' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left 2 Cols: Main Scan Card */}
            <div className="lg:col-span-2 space-y-6">
              <div className="bg-darker/90 border border-borderSubtle rounded-2xl p-6 shadow-xl space-y-5">
                <div className="flex flex-wrap items-center justify-between gap-3 border-b border-borderSubtle/60 pb-4">
                  <div>
                    <span className="text-[11px] font-mono text-slate-400 uppercase tracking-wider block">
                      Study Date: {patient.latestScan.date} • {patient.latestScan.studyId}
                    </span>
                    <h3 className="text-xl font-bold font-display text-white mt-0.5">
                      {patient.latestScan.diagnosis}
                    </h3>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${
                    patient.latestScan.statusSeverity === 'green' ? 'bg-greenSuccess/15 text-greenSuccess border border-greenSuccess/30' :
                    patient.latestScan.statusSeverity === 'amber' ? 'bg-amberWarning/15 text-amber-300 border border-amberWarning/30' :
                    'bg-cyanPrimary/15 text-cyanPrimary border border-cyanPrimary/30'
                  }`}>
                    {patient.latestScan.status}
                  </span>
                </div>

                {/* Plain-English Explanation */}
                <div className="p-4 rounded-xl bg-surface/80 border border-borderSubtle space-y-2">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-cyanPrimary font-mono flex items-center gap-1.5">
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    Understanding Your Results (Plain English Summary)
                  </h4>
                  <p className="text-xs text-slate-200 leading-relaxed">
                    {patient.latestScan.plainEnglishSummary}
                  </p>
                </div>

                {/* Volumetric Metrics Grid */}
                <div>
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-300 mb-3 font-mono">
                    AI Morphometric Findings
                  </h4>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    <div className="p-3 rounded-xl bg-card/60 border border-borderSubtle">
                      <span className="text-[10px] text-slate-400 block font-mono">ESTIMATED VOLUME</span>
                      <span className="text-sm font-bold font-mono text-white mt-1 block">
                        {patient.latestScan.volumetrics.volume}
                      </span>
                    </div>
                    <div className="p-3 rounded-xl bg-card/60 border border-borderSubtle">
                      <span className="text-[10px] text-slate-400 block font-mono">MAX DIAMETER</span>
                      <span className="text-sm font-bold font-mono text-cyanPrimary mt-1 block">
                        {patient.latestScan.volumetrics.diameter}
                      </span>
                    </div>
                    <div className="p-3 rounded-xl bg-card/60 border border-borderSubtle">
                      <span className="text-[10px] text-slate-400 block font-mono">ANATOMIC REGION</span>
                      <span className="text-xs font-semibold text-slate-200 mt-1 block truncate">
                        {patient.latestScan.volumetrics.location}
                      </span>
                    </div>
                    <div className="p-3 rounded-xl bg-card/60 border border-borderSubtle">
                      <span className="text-[10px] text-slate-400 block font-mono">MIDLINE SHIFT</span>
                      <span className="text-sm font-bold font-mono text-amberWarning mt-1 block">
                        {patient.latestScan.volumetrics.midlineShift}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Recommended Next Clinical Steps */}
                <div className="space-y-2 pt-2 border-t border-borderSubtle/60">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-300 font-mono">
                    Next Recommended Clinical Actions
                  </h4>
                  <ul className="space-y-2 text-xs text-slate-300">
                    {patient.latestScan.nextSteps.map((step, idx) => (
                      <li key={idx} className="flex items-start gap-2.5 p-2 rounded-lg bg-surface/50 border border-borderSubtle/40">
                        <span className="w-5 h-5 rounded-full bg-cyanPrimary/20 text-cyanPrimary font-bold text-[10px] flex items-center justify-center shrink-0 mt-0.5">
                          {idx + 1}
                        </span>
                        <span className="leading-relaxed">{step}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>

            {/* Right 1 Col: Care Team & Quick Actions */}
            <div className="space-y-6">
              {/* Doctor & Facility Card */}
              <div className="bg-darker/90 border border-borderSubtle rounded-2xl p-5 shadow-xl space-y-4">
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-300 font-mono flex items-center gap-2">
                  <svg className="w-4 h-4 text-cyanPrimary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                  </svg>
                  Your Medical Care Team
                </h3>

                <div className="space-y-3 text-xs">
                  <div className="p-3 rounded-xl bg-surface/60 border border-borderSubtle">
                    <span className="text-[10px] text-slate-400 font-mono block">ATTENDING NEURORADIOLOGIST</span>
                    <span className="font-semibold text-white block mt-0.5">{patient.primaryPhysician}</span>
                    <span className="text-[10px] text-cyanPrimary block mt-1">Direct Radiology Sign-Off</span>
                  </div>

                  {patient.surgeon !== 'N/A (Non-Neoplastic)' && (
                    <div className="p-3 rounded-xl bg-surface/60 border border-borderSubtle">
                      <span className="text-[10px] text-slate-400 font-mono block">LEAD NEUROSURGEON</span>
                      <span className="font-semibold text-white block mt-0.5">{patient.surgeon}</span>
                      <span className="text-[10px] text-tealAccent block mt-1">Surgical Oncology Lead</span>
                    </div>
                  )}

                  <div className="p-3 rounded-xl bg-surface/60 border border-borderSubtle">
                    <span className="text-[10px] text-slate-400 font-mono block">PRIMARY CLINICAL CENTER</span>
                    <span className="font-medium text-slate-200 block mt-0.5">{patient.hospital}</span>
                  </div>
                </div>

                <button
                  onClick={() => setShowMessageModal(true)}
                  className="w-full py-2.5 bg-card hover:bg-cardHover border border-borderSubtle rounded-xl text-xs font-semibold text-cyanPrimary flex items-center justify-center gap-2 transition-colors cursor-pointer"
                >
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                  Ask a Question to Dr. Jenkins
                </button>
              </div>

              {/* Patient Resources & Helplines */}
              <div className="p-5 rounded-2xl bg-gradient-to-br from-card/80 to-surface/90 border border-borderSubtle space-y-3 text-xs">
                <h4 className="font-bold text-white flex items-center gap-2">
                  <svg className="w-4 h-4 text-greenSuccess" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192l-3.536 3.536M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-5 0a4 4 0 11-8 0 4 4 0 018 0z" />
                  </svg>
                  24/7 Patient Support Line
                </h4>
                <p className="text-slate-300 text-[11px] leading-relaxed">
                  If you experience acute neurological symptoms (sudden headache, vision changes, or limb weakness), contact the hospital emergency desk immediately.
                </p>
                <div className="font-mono text-cyanPrimary font-bold text-sm">
                  ☎ (410) 955-5000 (Neuro-Oncology Triage)
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Tab 2: Interactive Scan Preview */}
        {activeTab === 'scan' && (
          <div className="bg-darker/90 border border-borderSubtle rounded-2xl p-6 shadow-xl space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-base font-bold text-white">MRI Cross-Sectional Scan Overview</h3>
                <p className="text-xs text-slate-400">High-resolution axial slice reconstructed from your 3.0T MRI study</p>
              </div>
              <span className="font-mono text-xs text-cyanPrimary bg-cyanPrimary/10 border border-cyanPrimary/30 px-2.5 py-1 rounded">
                {patient.latestScan.sequence}
              </span>
            </div>

            <div className="flex flex-col md:flex-row items-center justify-center gap-8 py-6 bg-darkest/70 rounded-xl border border-borderSubtle/60 p-4">
              <div className="relative w-72 h-72 rounded-2xl bg-surface border-2 border-borderSubtle overflow-hidden flex items-center justify-center shadow-2xl">
                {/* SVG Brain Cross Section Simulation */}
                <svg viewBox="0 0 512 512" className="w-full h-full">
                  {/* Skull */}
                  <ellipse cx="256" cy="256" rx="195" ry="230" fill="#475569" />
                  <ellipse cx="256" cy="256" rx="189" ry="224" fill="#0f172a" />
                  {/* Parenchyma */}
                  <ellipse cx="256" cy="256" rx="185" ry="220" fill="#334155" />
                  <ellipse cx="256" cy="256" rx="150" ry="180" fill="#475569" />
                  {/* Ventricles */}
                  <ellipse cx="232" cy="236" rx="10" ry="32" fill="#090d16" />
                  <ellipse cx="280" cy="236" rx="10" ry="32" fill="#090d16" />
                  {/* Tumor Region if present */}
                  {patient.latestScan.diagnosis.includes('Glioblastoma') && (
                    <g>
                      <ellipse cx="205" cy="220" rx="50" ry="46" fill="rgba(255, 23, 68, 0.4)" stroke="#ff1744" strokeWidth="3" />
                      <ellipse cx="205" cy="220" rx="30" ry="26" fill="#1e293b" />
                    </g>
                  )}
                  {patient.latestScan.diagnosis.includes('Meningioma') && (
                    <ellipse cx="118" cy="272" rx="42" ry="46" fill="rgba(255, 179, 0, 0.45)" stroke="#ffb300" strokeWidth="3" />
                  )}
                  {patient.latestScan.diagnosis.includes('Pituitary') && (
                    <ellipse cx="256" cy="248" rx="28" ry="24" fill="rgba(139, 92, 246, 0.45)" stroke="#8b5cf6" strokeWidth="3" />
                  )}
                </svg>
                <div className="absolute top-2 left-2 text-[10px] font-mono text-slate-400 bg-darkest/80 px-2 py-0.5 rounded">
                  AX T1-CE • SLICE 14/28
                </div>
              </div>

              <div className="max-w-md space-y-3 text-xs">
                <div className="p-3 bg-surface/70 border border-borderSubtle rounded-xl space-y-1">
                  <h4 className="font-bold text-white text-xs">Visual Scan Key:</h4>
                  <p className="text-slate-300 text-[11px] leading-relaxed">
                    The highlighted region identifies the targeted region analyzed by the U-Net deep learning model and validated by attending neuroradiologists.
                  </p>
                </div>
                <div className="p-3 bg-surface/70 border border-borderSubtle rounded-xl space-y-1">
                  <h4 className="font-bold text-white text-xs">Full Diagnostic DICOM PACS:</h4>
                  <p className="text-slate-300 text-[11px] leading-relaxed">
                    Doctors use the full-resolution PACS workstation for continuous multi-slice scrolling, caliper measurements, and surgical 3D localization.
                  </p>
                </div>
                <button
                  onClick={onSwitchToDoctor}
                  className="w-full py-2 bg-gradient-to-r from-cyanPrimary to-tealAccent text-darkest font-bold text-xs uppercase tracking-wider rounded-xl transition-all hover:brightness-110"
                >
                  View in Clinical PACS Workstation →
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Tab 3: Care Team & Hospital Facility */}
        {activeTab === 'careteam' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-darker/90 border border-borderSubtle rounded-2xl p-6 shadow-xl space-y-4">
              <h3 className="text-sm font-bold text-white font-mono uppercase tracking-wider">
                Comprehensive Neuro-Oncology Clinic
              </h3>
              <p className="text-xs text-slate-300 leading-relaxed">
                Your case is managed under a multidisciplinary tumor board combining neuroradiology, neurosurgery, radiation oncology, and neuro-pathology.
              </p>
              <div className="space-y-2 text-xs font-mono text-slate-300 bg-surface/60 p-4 rounded-xl border border-borderSubtle">
                <div><strong>Center:</strong> {patient.hospital}</div>
                <div><strong>Address:</strong> 600 N Wolfe St, Baltimore, MD 21287</div>
                <div><strong>Clinic Hours:</strong> Mon - Fri: 8:00 AM - 5:30 PM</div>
                <div><strong>Emergency:</strong> 24/7 Acute Neuro Triage Available</div>
              </div>
            </div>

            <div className="bg-darker/90 border border-borderSubtle rounded-2xl p-6 shadow-xl space-y-4">
              <h3 className="text-sm font-bold text-white font-mono uppercase tracking-wider">
                Patient Portal Credentials & Privacy
              </h3>
              <p className="text-xs text-slate-300 leading-relaxed">
                Your medical records are encrypted using 256-bit AES encryption compliant with HIPAA Title II security provisions.
              </p>
              <div className="space-y-1 text-xs font-mono text-slate-400 bg-surface/60 p-4 rounded-xl border border-borderSubtle">
                <div><strong>Patient MRN:</strong> {patient.mrn}</div>
                <div><strong>Registered Phone:</strong> {patient.phone}</div>
                <div><strong>DOB:</strong> {patient.dob}</div>
                <div className="text-greenSuccess pt-1"><strong>Status:</strong> Active Portal Account</div>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Message Doctor Modal */}
      {showMessageModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-darker border border-borderSubtle rounded-2xl max-w-lg w-full p-6 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between border-b border-borderSubtle pb-3">
              <div>
                <h3 className="text-sm font-bold text-white">Send Message to Care Team</h3>
                <span className="text-[11px] text-slate-400">Recipient: {patient.primaryPhysician}</span>
              </div>
              <button 
                onClick={() => setShowMessageModal(false)}
                className="text-slate-400 hover:text-white text-lg font-bold"
              >
                ✕
              </button>
            </div>

            {messageSent ? (
              <div className="p-6 text-center space-y-2 text-xs">
                <div className="w-12 h-12 rounded-full bg-greenSuccess/20 text-greenSuccess border border-greenSuccess/30 flex items-center justify-center mx-auto text-xl">
                  ✓
                </div>
                <h4 className="font-bold text-white text-sm">Message Sent Successfully!</h4>
                <p className="text-slate-400">Your care team will review your inquiry within 1 business day.</p>
              </div>
            ) : (
              <form onSubmit={handleSendMessage} className="space-y-3 text-xs">
                <div>
                  <label className="block text-slate-300 mb-1 font-medium">Subject</label>
                  <input
                    type="text"
                    defaultValue={`Inquiry regarding MRI study ${patient.latestScan.studyId}`}
                    className="w-full bg-surface border border-borderSubtle rounded-xl px-3 py-2 text-white outline-none focus:border-cyanPrimary"
                  />
                </div>
                <div>
                  <label className="block text-slate-300 mb-1 font-medium">Message Details</label>
                  <textarea
                    rows="4"
                    value={messageText}
                    onChange={(e) => setMessageText(e.target.value)}
                    placeholder="Describe your question regarding your scan, medication, or upcoming appointments..."
                    required
                    className="w-full bg-surface border border-borderSubtle rounded-xl px-3 py-2 text-white outline-none focus:border-cyanPrimary resize-none"
                  />
                </div>
                <div className="text-[11px] text-slate-400">
                  ⚠️ For urgent medical emergencies, please dial 911 or visit the nearest emergency department.
                </div>
                <div className="flex justify-end gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setShowMessageModal(false)}
                    className="px-4 py-2 rounded-xl bg-card border border-borderSubtle text-slate-300 hover:text-white text-xs font-semibold"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 rounded-xl bg-gradient-to-r from-tealAccent to-cyanPrimary text-darkest font-bold text-xs uppercase tracking-wider"
                  >
                    Send to Doctor
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
