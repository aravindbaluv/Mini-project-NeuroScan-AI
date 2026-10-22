import React, { useState, useEffect, useRef } from 'react';
import HomePage from './components/HomePage';
import PatientPortal from './components/PatientPortal';
import LoginPage from './components/LoginPage';

// Clinical preset case data
const CLINICAL_PRESETS = {
  glioma: {
    id: '#NS-8042-GBM',
    patientName: 'Doe, John M.',
    mrn: 'MR-9823101',
    ageGender: '54Y / Male',
    sequence: 'MRI 3.0T AX T1-CE + FLAIR',
    tumorType: 'GLIOMA',
    diagnosis: 'High-Grade Glioblastoma Multiforme (GBM)',
    whoGrade: 'WHO Grade IV',
    confidence: 98.4,
    probabilities: { glioma: 98.4, meningioma: 1.2, pituitary: 0.3, normal: 0.1 },
    volumetrics: { volume: '28.4 cm³', diameter: '41.8 mm', laterality: 'Right Frontal-Temporal', midlineShift: '4.2 mm' },
    bbox: { x: 145, y: 155, w: 125, h: 130 },
    xai: { saliency: '0.94 / 1.00', dice: '0.962', note: 'Maximal Grad-CAM attention at contrast-enhancing peripheral rim and necrotic core.' }
  },
  meningioma: {
    id: '#NS-7119-MEN',
    patientName: 'Vance, Eleanor R.',
    mrn: 'MR-4402917',
    ageGender: '58Y / Female',
    sequence: 'MRI 3.0T AX T1-CE + T2',
    tumorType: 'MENINGIOMA',
    diagnosis: 'Parasagittal Convexity Meningioma',
    whoGrade: 'WHO Grade I',
    confidence: 97.6,
    probabilities: { glioma: 1.5, meningioma: 97.6, pituitary: 0.7, normal: 0.2 },
    volumetrics: { volume: '16.2 cm³', diameter: '32.5 mm', laterality: 'Right Parietal Convexity', midlineShift: '1.8 mm' },
    bbox: { x: 70, y: 220, w: 95, h: 105 },
    xai: { saliency: '0.92 / 1.00', dice: '0.954', note: 'Attention gradients localize to broad-based dural attachment along parietal convexity.' }
  },
  pituitary: {
    id: '#NS-4902-PIT',
    patientName: 'Brody, Marcus A.',
    mrn: 'MR-7718290',
    ageGender: '47Y / Male',
    sequence: 'MRI 3.0T PITUITARY PROTOCOL (T1+C)',
    tumorType: 'PITUITARY',
    diagnosis: 'Pituitary Macroadenoma (Sellar/Suprasellar)',
    whoGrade: 'WHO Grade I',
    confidence: 98.9,
    probabilities: { glioma: 0.3, meningioma: 0.6, pituitary: 98.9, normal: 0.2 },
    volumetrics: { volume: '8.7 cm³', diameter: '22.4 mm', laterality: 'Sellar / Midline Centered', midlineShift: '0.0 mm' },
    bbox: { x: 205, y: 205, w: 85, h: 85 },
    xai: { saliency: '0.96 / 1.00', dice: '0.968', note: 'Focal activation in sella turcica with suprasellar elevation toward optic chiasm.' }
  },
  normal: {
    id: '#NS-1025-NRM',
    patientName: 'Connor, Sarah L.',
    mrn: 'MR-1092844',
    ageGender: '32Y / Female',
    sequence: 'MRI 3.0T BRAIN SCREENING (T1+T2)',
    tumorType: 'NORMAL',
    diagnosis: 'Normal Brain (Healthy Neuro-Anatomy)',
    whoGrade: 'Non-Neoplastic',
    confidence: 99.6,
    probabilities: { glioma: 0.2, meningioma: 0.1, pituitary: 0.1, normal: 99.6 },
    volumetrics: { volume: '0.0 cm³', diameter: '0.0 mm', laterality: 'Symmetrical', midlineShift: '0.0 mm' },
    bbox: null,
    xai: { saliency: '0.12 / 1.00', dice: 'N/A', note: 'Homogeneous background activation. Normal ventricular symmetry confirmed.' }
  }
};

export default function App() {
  // Current Case & AI Results
  const [currentCaseKey, setCurrentCaseKey] = useState('glioma');
  const [currentCase, setCurrentCase] = useState(CLINICAL_PRESETS.glioma);
  const [backendStatus, setBackendStatus] = useState('Connecting to FastAPI...');
  const [isBackendOnline, setIsBackendOnline] = useState(false);
  const [isInferencing, setIsInferencing] = useState(false);

  // PACS Viewer Controls
  const [currentSlice, setCurrentSlice] = useState(14);
  const [zoom, setZoom] = useState(1.0);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [brightness, setBrightness] = useState(100);
  const [contrast, setContrast] = useState(100);
  const [gradcamAlpha, setGradcamAlpha] = useState(65);
  const [isInverted, setIsInverted] = useState(false);
  const [activePreset, setActivePreset] = useState('brain');

  // Overlay Toggles
  const [showBbox, setShowBbox] = useState(true);
  const [showSeg, setShowSeg] = useState(true);
  const [showGradCam, setShowGradCam] = useState(true);
  const [activeTool, setActiveTool] = useState('select'); // 'select' | 'measure'

  // Caliper Measurement Tool
  const [caliper, setCaliper] = useState({ p1: null, p2: null, distMm: 0, measuring: false });

  // Modals & Chatbot State
  const [showDbModal, setShowDbModal] = useState(false);
  const [showReportModal, setShowReportModal] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [showChatbot, setShowChatbot] = useState(false);
  const [showUserDropdown, setShowUserDropdown] = useState(false);
  const [showExportMenu, setShowExportMenu] = useState(false);
  const [workstationMode, setWorkstationMode] = useState('react'); // 'react' | 'standalone'

  // Multi-View Navigation (Public Homepage, Patient Portal, Clinician PACS)
  const [viewState, setViewState] = useState(() => {
    try {
      if (localStorage.getItem('neuroscan_auth_user')) return 'doctor-pacs';
      if (localStorage.getItem('neuroscan_patient_user')) return 'patient-portal';
    } catch (e) {}
    return 'home';
  });
  const [loginPortalMode, setLoginPortalMode] = useState('clinician'); // 'clinician' | 'patient'
  const [currentPatient, setCurrentPatient] = useState(() => {
    try {
      const saved = localStorage.getItem('neuroscan_patient_user');
      if (saved) return JSON.parse(saved);
    } catch (e) {}
    return {
      mrn: 'MR-9823101',
      name: 'John M. Doe',
      diagnosis: 'High-Grade Glioblastoma Multiforme (GBM)'
    };
  });

  // Authentication & Clinician Profile
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    try {
      const saved = localStorage.getItem('neuroscan_auth_user') || sessionStorage.getItem('neuroscan_auth_user');
      return !!saved;
    } catch (e) {
      return false;
    }
  });

  const [currentUser, setCurrentUser] = useState(() => {
    try {
      const saved = localStorage.getItem('neuroscan_auth_user') || sessionStorage.getItem('neuroscan_auth_user');
      if (saved) return JSON.parse(saved);
    } catch (e) {}
    return {
      name: 'Dr. Sarah Jenkins',
      title: 'Dr. Sarah Jenkins, MD, FACR',
      role: 'Attending Neuroradiologist',
      hospital: 'Johns Hopkins Comprehensive Brain Tumor Center',
      initials: 'SJ',
      npi: '988214'
    };
  });

  const handlePatientLogin = (patient) => {
    setCurrentPatient(patient);
    try {
      localStorage.setItem('neuroscan_patient_user', JSON.stringify(patient));
    } catch (e) {}
    setViewState('patient-portal');
  };

  const handleClinicianLogin = (user) => {
    setCurrentUser(user);
    setIsAuthenticated(true);
    setViewState('doctor-pacs');
    setShowLoginModal(false);
  };

  const handleLogout = () => {
    try {
      localStorage.removeItem('neuroscan_auth_user');
      localStorage.removeItem('neuroscan_patient_user');
      sessionStorage.removeItem('neuroscan_auth_user');
      sessionStorage.removeItem('neuroscan_patient_user');
    } catch (e) {}
    setIsAuthenticated(false);
    setViewState('home');
  };
  const [chatMessages, setChatMessages] = useState([
    {
      sender: 'bot',
      text: 'Hello Dr. Jenkins! I am your AI clinical neuro-oncology co-pilot synchronized with your active MRI study. Ask me about tumor morphology, U-Net volumetrics, Grad-CAM attention, or surgical guidelines.'
    }
  ]);
  const [chatInput, setChatInput] = useState('');
  const [isBotTyping, setIsBotTyping] = useState(false);
  const [dbRecords, setDbRecords] = useState([]);

  const canvasRef = useRef(null);

  // Check FastAPI + PyTorch Backend Status on Load
  useEffect(() => {
    async function checkBackend() {
      try {
        const res = await fetch('http://localhost:8000/api/health');
        if (res.ok) {
          const data = await res.json();
          setBackendStatus(`FastAPI + PyTorch (${data.device})`);
          setIsBackendOnline(true);
          return;
        }
      } catch (err) {
        // Fallback
      }
      setBackendStatus('FastAPI: Standby (Using Native Client Pipeline)');
      setIsBackendOnline(false);
    }
    checkBackend();
  }, []);

  // Update current case
  useEffect(() => {
    if (CLINICAL_PRESETS[currentCaseKey]) {
      setCurrentCase(CLINICAL_PRESETS[currentCaseKey]);
    }
  }, [currentCaseKey]);

  // Render Canvas
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    canvas.width = 512;
    canvas.height = 512;

    ctx.save();
    ctx.clearRect(0, 0, 512, 512);

    // Apply Transformation (Zoom & Pan)
    ctx.translate(256 + pan.x, 256 + pan.y);
    ctx.scale(zoom, zoom);
    ctx.translate(-256, -256);

    // 1. Draw MRI Brain Anatomy
    drawMriAnatomy(ctx, currentCaseKey, currentSlice);

    // 2. Windowing / Invert Filter
    applyFilters(ctx, brightness, contrast, isInverted);

    // 3. Grad-CAM Overlay
    if (showGradCam && currentCase.bbox) {
      drawGradCamHeatmap(ctx, currentCase.bbox, gradcamAlpha / 100);
    }

    // 4. U-Net Segmentation Mask
    if (showSeg && currentCase.bbox) {
      drawUnetSegmentation(ctx, currentCase.bbox, currentCase.tumorType);
    }

    // 5. Bounding Box
    if (showBbox && currentCase.bbox) {
      drawBoundingBox(ctx, currentCase.bbox, currentCase.diagnosis, currentCase.confidence);
    }

    // 6. Caliper Line
    if (caliper.p1 && caliper.p2) {
      drawCaliper(ctx, caliper.p1, caliper.p2, caliper.distMm);
    }

    ctx.restore();
  }, [currentCaseKey, currentSlice, zoom, pan, brightness, contrast, gradcamAlpha, isInverted, showBbox, showSeg, showGradCam, caliper]);

  // Handle Preset Windowing
  const handleWindowPreset = (preset) => {
    setActivePreset(preset);
    if (preset === 'brain') { setBrightness(100); setContrast(100); }
    else if (preset === 'subdural') { setBrightness(115); setContrast(145); }
    else if (preset === 'bone') { setBrightness(75); setContrast(185); }
  };

  // Trigger FastAPI Prediction
  const runPyTorchInference = async () => {
    setIsInferencing(true);
    const canvas = canvasRef.current;
    if (!canvas) return;
    const base64Img = canvas.toDataURL('image/png');

    try {
      if (isBackendOnline) {
        const res = await fetch('http://localhost:8000/api/predict', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            image_base64: base64Img,
            patient_name: currentCase.patientName,
            mrn: currentCase.mrn,
            age_gender: currentCase.ageGender,
            sequence: currentCase.sequence
          })
        });

        if (res.ok) {
          const data = await res.json();
          setCurrentCase(prev => ({
            ...prev,
            tumorType: data.primary_class,
            diagnosis: data.diagnosis_name,
            confidence: data.confidence,
            probabilities: data.probabilities,
            volumetrics: {
              volume: `${data.volume_cm3} cm³`,
              diameter: `${data.max_diameter_mm} mm`,
              laterality: data.laterality,
              midlineShift: `${data.midline_shift_mm} mm`
            },
            bbox: data.bbox
          }));
        }
      }
    } catch (e) {
      console.error(e);
    } finally {
      setTimeout(() => setIsInferencing(false), 900);
    }
  };

  // --- Clinical Export Suite Handlers ---
  const handleExportPdf = () => {
    setShowExportMenu(false);
    setShowReportModal(true);
    setTimeout(() => {
      window.print();
    }, 400);
  };

  const handleExportMriPng = () => {
    setShowExportMenu(false);
    const canvas = canvasRef.current;
    if (!canvas) return;

    const expCanvas = document.createElement('canvas');
    const ctx = expCanvas.getContext('2d');
    expCanvas.width = 1024;
    expCanvas.height = 1024;

    ctx.fillStyle = '#070a12';
    ctx.fillRect(0, 0, 1024, 1024);

    ctx.drawImage(canvas, 0, 0, 1024, 1024);

    ctx.fillStyle = 'rgba(7, 10, 18, 0.85)';
    ctx.fillRect(0, 0, 1024, 70);
    ctx.fillRect(0, 954, 1024, 70);

    ctx.fillStyle = '#00e5ff';
    ctx.font = 'bold 22px "Inter", sans-serif';
    ctx.fillText('NEUROSCAN AI™ 4.2 Pro • MEDICAL PACS EXPORT', 24, 42);

    ctx.fillStyle = '#94a3b8';
    ctx.font = '16px "JetBrains Mono", monospace';
    ctx.fillText(`PATIENT: ${currentCase.patientName} | MRN: ${currentCase.mrn}`, 540, 42);

    ctx.fillStyle = currentCase.tumorType === 'NORMAL' ? '#00e676' : '#ff1744';
    ctx.font = 'bold 20px "Inter", sans-serif';
    ctx.fillText(`DIAGNOSIS: ${currentCase.diagnosis} (${currentCase.confidence}%)`, 24, 995);

    ctx.fillStyle = '#00e5ff';
    ctx.font = '16px "JetBrains Mono", monospace';
    ctx.fillText(`VOL: ${currentCase.volumetrics.volume} | DIAM: ${currentCase.volumetrics.diameter} | SHIFT: ${currentCase.volumetrics.midlineShift}`, 520, 995);

    const link = document.createElement('a');
    link.download = `NeuroScan_${currentCase.mrn.replace(/[^a-zA-Z0-9]/g, '_')}_Slice${currentSlice}.png`;
    link.href = expCanvas.toDataURL('image/png');
    link.click();
  };

  const handleExportStudyJson = () => {
    setShowExportMenu(false);
    const data = {
      system: 'NeuroScan AI™ Clinical Diagnostic PACS',
      version: '4.2.0',
      exportedAt: new Date().toISOString(),
      patient: {
        name: currentCase.patientName,
        mrn: currentCase.mrn,
        ageGender: currentCase.ageGender,
        sequence: currentCase.sequence
      },
      slice: currentSlice,
      aiFindings: {
        tumorType: currentCase.tumorType,
        diagnosis: currentCase.diagnosis,
        whoGrade: currentCase.whoGrade,
        confidence: currentCase.confidence,
        probabilities: currentCase.probabilities,
        volumetrics: currentCase.volumetrics,
        bbox: currentCase.bbox,
        xai: currentCase.xai
      }
    };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.download = `NeuroScan_Study_${currentCase.mrn.replace(/[^a-zA-Z0-9]/g, '_')}.json`;
    link.href = url;
    link.click();
    URL.revokeObjectURL(url);
  };

  const handleExportCohortCsv = () => {
    setShowExportMenu(false);
    const headers = [
      'Record ID',
      'Patient Name',
      'MRN',
      'Age / Gender',
      'Study Sequence',
      'Tumor Classification',
      'Diagnosis',
      'Confidence (%)',
      'Volume (cm3)',
      'Diameter (mm)',
      'Midline Shift (mm)',
      'Laterality'
    ];
    const rows = Object.values(CLINICAL_PRESETS).map(c => [
      `"${c.id}"`,
      `"${c.patientName}"`,
      `"${c.mrn}"`,
      `"${c.ageGender}"`,
      `"${c.sequence}"`,
      `"${c.tumorType}"`,
      `"${c.diagnosis}"`,
      c.confidence,
      `"${c.volumetrics.volume}"`,
      `"${c.volumetrics.diameter}"`,
      `"${c.volumetrics.midlineShift}"`,
      `"${c.volumetrics.laterality}"`
    ]);
    const csvContent = '\uFEFF' + [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.download = `NeuroScan_Cohort_Database_${new Date().toISOString().slice(0, 10)}.csv`;
    link.href = url;
    link.click();
    URL.revokeObjectURL(url);
  };

  const handleExportSummaryTxt = () => {
    setShowExportMenu(false);
    const txt = `================================================================================
NEUROSCAN AI™ — CLINICAL NEURO-ONCOLOGY DIAGNOSTIC REPORT
Certified Deep Learning Medical PACS Workstation (SaMD Draft Specification)
================================================================================

PATIENT DEMOGRAPHICS:
  • Patient Name:     ${currentCase.patientName}
  • Patient ID / MRN: ${currentCase.mrn}
  • Age / Gender:     ${currentCase.ageGender}
  • Examination Date: ${new Date().toLocaleDateString()}
  • MRI Sequence:     ${currentCase.sequence}

QUANTITATIVE AI MORPHOMETRICS (PyTorch U-Net & Grad-CAM):
  • Primary Classification: ${currentCase.diagnosis}
  • Classification Confidence: ${currentCase.confidence}%
  • Lesion Volume:          ${currentCase.volumetrics.volume}
  • Maximal Dimension:      ${currentCase.volumetrics.diameter}
  • Anatomical Location:    ${currentCase.volumetrics.laterality}
  • Midline Shift:          ${currentCase.volumetrics.midlineShift}

EXPLAINABLE AI (Grad-CAM Saliency):
  • Visual Saliency Score:  ${currentCase.xai?.saliency || '0.94 / 1.00'}
  • Dice Similarity Index:  ${currentCase.xai?.dice || '0.962'}
  • Attention Interpretation: ${currentCase.xai?.note || 'Maximal Grad-CAM attention at contrast-enhancing peripheral rim.'}

RADIOLOGICAL IMPRESSION:
${currentCase.diagnosis} demonstrated on contrast-enhanced 3.0T MRI. Volumetric segmentation and feature maps confirm focal neoplasm.

================================================================================
ELECTRONICALLY SIGNED & VERIFIED BY:
${currentUser?.title || 'Dr. Sarah Jenkins, MD, FACR'}
NeuroScan AI Health Technologies • Export Timestamp: ${new Date().toISOString()}
================================================================================`;
    const blob = new Blob([txt], { type: 'text/plain;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.download = `NeuroScan_Report_${currentCase.mrn.replace(/[^a-zA-Z0-9]/g, '_')}.txt`;
    link.href = url;
    link.click();
    URL.revokeObjectURL(url);
  };

  const handleExportHtmlReport = () => {
    setShowExportMenu(false);
    const canvas = canvasRef.current;
    const canvasImg = canvas ? canvas.toDataURL('image/png') : '';
    const safeMrn = currentCase.mrn.replace(/[^a-zA-Z0-9]/g, '_');

    const htmlContent = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>NeuroScan AI Report — ${currentCase.patientName} (${currentCase.mrn})</title>
  <style>
    :root { --primary: #0284c7; --text-main: #0f172a; --text-muted: #64748b; --border: #e2e8f0; --bg: #f8fafc; }
    * { box-sizing: border-box; margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; }
    body { background: var(--bg); color: var(--text-main); padding: 24px; line-height: 1.5; }
    .report-wrap { max-width: 900px; margin: 0 auto; background: #fff; border: 1px solid var(--border); border-radius: 10px; box-shadow: 0 4px 20px rgba(0,0,0,0.06); padding: 36px; }
    .print-bar { display: flex; justify-content: space-between; align-items: center; background: #0f172a; color: #fff; padding: 12px 20px; border-radius: 6px; margin-bottom: 24px; }
    .print-btn { background: #0284c7; color: #fff; border: none; padding: 8px 18px; border-radius: 4px; font-weight: 600; cursor: pointer; }
    .hospital-header { border-bottom: 2px solid #0f172a; padding-bottom: 16px; margin-bottom: 20px; }
    .hosp-badge { font-size: 11px; font-weight: 800; letter-spacing: 1.5px; color: var(--primary); text-transform: uppercase; }
    .hosp-title { font-size: 22px; font-weight: 800; color: #0f172a; margin-top: 4px; }
    .meta-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 12px; background: #f1f5f9; padding: 14px 18px; border-radius: 6px; margin-bottom: 20px; font-size: 13px; }
    .diag-box { background: ${currentCase.tumorType === 'NORMAL' ? '#f0fdf4' : '#fff1f2'}; border-left: 4px solid ${currentCase.tumorType === 'NORMAL' ? '#16a34a' : '#dc2626'}; padding: 16px; border-radius: 0 6px 6px 0; margin-bottom: 20px; }
    .diag-title { font-size: 18px; font-weight: 800; color: ${currentCase.tumorType === 'NORMAL' ? '#16a34a' : '#dc2626'}; }
    .metrics-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 12px; margin-bottom: 20px; }
    .metric-card { background: #f8fafc; border: 1px solid var(--border); border-radius: 6px; padding: 12px; text-align: center; }
    .metric-val { font-size: 17px; font-weight: 800; color: #0f172a; }
    .metric-lbl { font-size: 11px; color: var(--text-muted); text-transform: uppercase; font-weight: 600; margin-top: 4px; }
    .scan-view-box { text-align: center; background: #070a12; padding: 12px; border-radius: 6px; margin-bottom: 20px; }
    .scan-img { max-height: 260px; max-width: 100%; border-radius: 4px; }
    .report-text { font-size: 13.5px; color: #334155; line-height: 1.6; margin-bottom: 16px; }
    .signature-row { display: flex; justify-content: space-between; margin-top: 36px; padding-top: 20px; border-top: 1px solid var(--border); font-size: 12px; color: var(--text-muted); }
    @media print { body { padding: 0; } .print-bar { display: none !important; } .report-wrap { border: none; box-shadow: none; padding: 0; } }
  </style>
</head>
<body>
  <div class="report-wrap">
    <div class="print-bar">
      <div><strong>NeuroScan AI™ Diagnostic Report</strong> • ${currentCase.mrn}</div>
      <button class="print-btn" onclick="window.print()">Print / Save PDF</button>
    </div>
    <div class="hospital-header">
      <div class="hosp-badge">Clinical Neuro-Oncology & PACS Center</div>
      <div class="hosp-title">DEPARTMENT OF NEURORADIOLOGY DIAGNOSTIC REPORT</div>
    </div>
    <div class="meta-grid">
      <div><strong>PATIENT:</strong> ${currentCase.patientName}</div>
      <div><strong>MRN:</strong> ${currentCase.mrn}</div>
      <div><strong>EXAM DATE:</strong> ${new Date().toLocaleDateString()}</div>
      <div><strong>AGE / GENDER:</strong> ${currentCase.ageGender}</div>
      <div><strong>MODALITY:</strong> ${currentCase.sequence}</div>
      <div><strong>AI INFERENCE:</strong> PyTorch Dual-Task U-Net</div>
    </div>
    <div class="diag-box">
      <div class="diag-title">${currentCase.diagnosis}</div>
      <div>AI Softmax Confidence: ${currentCase.confidence}% • Classification: ${currentCase.tumorType}</div>
    </div>
    ${canvasImg ? `
      <div class="scan-view-box">
        <img class="scan-img" src="${canvasImg}" alt="MRI Slice">
        <div style="font-size: 11px; color: #94a3b8; margin-top: 6px; font-family: monospace;">AXIAL MRI WITH AI SEGMENTATION & CALIPER</div>
      </div>
    ` : ''}
    <div class="metrics-grid">
      <div class="metric-card"><div class="metric-val">${currentCase.volumetrics.volume}</div><div class="metric-lbl">Volume</div></div>
      <div class="metric-card"><div class="metric-val">${currentCase.volumetrics.diameter}</div><div class="metric-lbl">Max Diameter</div></div>
      <div class="metric-card"><div class="metric-val">${currentCase.volumetrics.midlineShift}</div><div class="metric-lbl">Midline Shift</div></div>
      <div class="metric-card"><div class="metric-val" style="font-size: 13px;">${currentCase.volumetrics.laterality}</div><div class="metric-lbl">Location</div></div>
    </div>
    <p class="report-text"><strong>Indication:</strong> Intracranial neuroimaging study evaluation for acute neurological presentation.</p>
    <p class="report-text"><strong>Impression:</strong> ${currentCase.diagnosis} confirmed by quantitative AI segmentation and Grad-CAM attention heatmap analysis.</p>
    <div class="signature-row">
      <div>NeuroScan AI™ Automated Inference Engine • BraTS Benchmark</div>
      <div style="text-align: right;">${currentUser?.title || 'Attending Neuroradiologist, MD, FACR'} • Electronically Verified</div>
    </div>
  </div>
</body>
</html>`;

    const blob = new Blob([htmlContent], { type: 'text/html;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.download = `NeuroScan_Report_${safeMrn}.html`;
    link.href = url;
    link.click();
    URL.revokeObjectURL(url);
  };


  // 1. View: Public Hospital Web Homepage (Patients & Visitors)
  if (viewState === 'home') {
    return (
      <HomePage
        onPatientLogin={handlePatientLogin}
        onOpenClinicianLogin={() => {
          setLoginPortalMode('clinician');
          setViewState('login');
        }}
      />
    );
  }

  // 2. View: Dual Portal Login (Clinician or Patient)
  if (viewState === 'login') {
    return (
      <LoginPage
        defaultPortal={loginPortalMode}
        onLoginSuccess={handleClinicianLogin}
        onPatientLoginSuccess={handlePatientLogin}
        onReturnHome={() => setViewState('home')}
      />
    );
  }

  // 3. View: Patient Health Portal Dashboard
  if (viewState === 'patient-portal') {
    return (
      <PatientPortal
        patientUser={currentPatient}
        onLogout={handleLogout}
        onSwitchToDoctor={() => {
          setLoginPortalMode('clinician');
          setViewState('login');
        }}
      />
    );
  }

  // 4. View: Clinician PACS Workstation (when viewState === 'doctor-pacs')
  if (!isAuthenticated && viewState === 'doctor-pacs') {
    return (
      <LoginPage
        defaultPortal="clinician"
        onLoginSuccess={handleClinicianLogin}
        onPatientLoginSuccess={handlePatientLogin}
        onReturnHome={() => setViewState('home')}
      />
    );
  }

  return (
    <div className="flex flex-col w-screen h-screen bg-darkest text-slate-100 overflow-hidden font-sans">
      {/* Top Clinical Header */}
      <header className="h-16 px-6 bg-darker/90 backdrop-blur-md border-b border-borderSubtle flex items-center justify-between z-30">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-cyanPrimary/20 to-purpleAccent/20 border border-cyanPrimary/40 flex items-center justify-center shadow-lg shadow-cyanPrimary/20">
            <svg className="w-6 h-6 text-cyanPrimary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <circle cx="12" cy="12" r="9" strokeWidth="2"/>
              <path strokeWidth="2" d="M12 3a9 9 0 0 1 9 9M12 3v18M3 12h18"/>
            </svg>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-lg font-bold font-display bg-gradient-to-r from-white to-cyanPrimary bg-clip-text text-transparent">
                NeuroScan AI
              </h1>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-cyanPrimary/10 border border-cyanPrimary/30 text-cyanPrimary font-semibold">
                React + FastAPI + PyTorch
              </span>
            </div>
            <p className="text-xs text-slate-400">Deep Learning U-Net Brain Tumor Detection & Grad-CAM XAI</p>
          </div>
        </div>

        {/* Telemetry Strip */}
        <div className="hidden lg:flex items-center gap-4 px-4 py-1.5 rounded-full bg-surface/80 border border-borderSubtle text-xs">
          <div>
            <span className="text-[10px] text-slate-400 block font-mono">PATIENT MRN</span>
            <span className="font-mono font-semibold text-white">{currentCase.mrn}</span>
          </div>
          <div className="w-px h-6 bg-borderSubtle"></div>
          <div>
            <span className="text-[10px] text-slate-400 block font-mono">STUDY SEQUENCE</span>
            <span className="font-mono text-cyanPrimary font-semibold">{currentCase.sequence}</span>
          </div>
          <div className="w-px h-6 bg-borderSubtle"></div>
          <div>
            <span className="text-[10px] text-slate-400 block font-mono">BACKEND API</span>
            <span className="flex items-center gap-1.5 font-mono text-greenSuccess font-semibold">
              <span className="w-2 h-2 rounded-full bg-greenSuccess animate-pulse-dot"></span>
              {backendStatus}
            </span>
          </div>
        </div>

        {/* Workstation Mode Switcher: React Suite vs Standalone PACS (Port 8080) */}
        <div className="flex items-center p-1 rounded-xl bg-surface/90 border border-borderSubtle">
          <button
            onClick={() => setWorkstationMode('react')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer ${
              workstationMode === 'react'
                ? 'bg-gradient-to-r from-cyanPrimary to-tealAccent text-darkest shadow-md shadow-cyanPrimary/20 font-bold'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="currentColor">
              <circle cx="12" cy="12" r="2.5"/>
              <ellipse cx="12" cy="12" rx="10" ry="4" fill="none" stroke="currentColor" strokeWidth="1.8"/>
              <ellipse cx="12" cy="12" rx="10" ry="4" fill="none" stroke="currentColor" strokeWidth="1.8" transform="rotate(60 12 12)"/>
              <ellipse cx="12" cy="12" rx="10" ry="4" fill="none" stroke="currentColor" strokeWidth="1.8" transform="rotate(120 12 12)"/>
            </svg>
            React AI Suite
          </button>
          <button
            onClick={() => setWorkstationMode('standalone')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer ${
              workstationMode === 'standalone'
                ? 'bg-gradient-to-r from-purpleAccent to-indigo-500 text-white shadow-md shadow-purpleAccent/20 font-bold'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <rect x="2" y="3" width="20" height="14" rx="2" ry="2" strokeWidth="2"/>
              <line x1="8" y1="21" x2="16" y2="21" strokeWidth="2"/>
              <line x1="12" y1="17" x2="12" y2="21" strokeWidth="2"/>
            </svg>
            Standalone PACS (8080)
          </button>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2.5">
          <button
            onClick={() => setViewState('home')}
            className="px-3 py-1.5 rounded-lg bg-surface/80 border border-borderSubtle hover:border-cyanPrimary text-xs font-semibold text-slate-300 hover:text-white transition-all flex items-center gap-1.5 cursor-pointer"
            title="Return to Public Hospital Homepage"
          >
            <svg className="w-3.5 h-3.5 text-cyanPrimary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
            </svg>
            Hospital Home
          </button>
          <button
            onClick={() => setViewState('patient-portal')}
            className="px-3 py-1.5 rounded-lg bg-surface/80 border border-borderSubtle hover:border-tealAccent text-xs font-semibold text-slate-300 hover:text-white transition-all flex items-center gap-1.5 cursor-pointer"
            title="Switch to Patient Portal View"
          >
            <svg className="w-3.5 h-3.5 text-tealAccent" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
            Patient Portal
          </button>
          <button
            onClick={() => setShowDbModal(true)}
            className="px-3.5 py-2 rounded-lg bg-card border border-borderSubtle hover:border-cyanPrimary text-xs font-semibold hover:text-white transition-all flex items-center gap-2"
          >
            <svg className="w-4 h-4 text-greenSuccess" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <ellipse cx="12" cy="5" rx="9" ry="3" strokeWidth="2"/>
              <path strokeWidth="2" d="M21 12c0 1.66-4 3-9 3s-9-1.34-9-3M3 5v14c0 1.66 4 3 9 3s9-1.34 9-3V5"/>
            </svg>
            MySQL Database
          </button>
          <button
            onClick={() => setShowReportModal(true)}
            className="px-3.5 py-2 rounded-lg bg-card border border-borderSubtle hover:border-cyanPrimary text-xs font-semibold hover:text-white transition-all flex items-center gap-2 cursor-pointer"
          >
            <svg className="w-4 h-4 text-cyanPrimary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>
            </svg>
            Clinical Report
          </button>

          {/* Export Hub Dropdown */}
          <div className="relative">
            <button
              onClick={() => setShowExportMenu(!showExportMenu)}
              className="px-3.5 py-2 rounded-lg bg-card border border-borderSubtle hover:border-cyanPrimary text-xs font-semibold hover:text-white transition-all flex items-center gap-2 cursor-pointer"
              title="Export Clinical Report, MRI Scan, JSON, CSV & TXT"
            >
              <svg className="w-4 h-4 text-cyanPrimary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
              </svg>
              <span>Export</span>
              <svg className="w-3 h-3 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
              </svg>
            </button>

            {showExportMenu && (
              <div className="absolute right-0 mt-2 w-72 bg-darker/95 backdrop-blur-xl border border-borderSubtle rounded-xl shadow-2xl p-2 z-50 space-y-1">
                <div className="px-3 py-2 border-b border-borderSubtle/60">
                  <div className="text-[11px] font-bold uppercase tracking-wider text-cyanPrimary font-mono">Clinical Export Hub</div>
                  <div className="text-[10px] text-slate-400">Download active study findings & media</div>
                </div>
                <button
                  onClick={handleExportHtmlReport}
                  className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs text-left hover:bg-card transition-colors cursor-pointer"
                >
                  <span className="w-6 h-6 rounded bg-tealAccent/20 text-tealAccent flex items-center justify-center font-bold text-[10px]">HTML</span>
                  <div>
                    <div className="text-white font-medium">Standalone HTML Dossier (.HTML)</div>
                    <div className="text-[10px] text-slate-400">Self-contained file with embedded MRI scan</div>
                  </div>
                </button>
                <button
                  onClick={handleExportPdf}
                  className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs text-left hover:bg-card transition-colors cursor-pointer"
                >
                  <span className="w-6 h-6 rounded bg-redDanger/20 text-red-400 flex items-center justify-center font-bold text-[10px]">PDF</span>
                  <div>
                    <div className="text-white font-medium">Radiology Report (PDF / Print)</div>
                    <div className="text-[10px] text-slate-400">Signed diagnostic clinical documentation</div>
                  </div>
                </button>
                <button
                  onClick={handleExportMriPng}
                  className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs text-left hover:bg-card transition-colors cursor-pointer"
                >
                  <span className="w-6 h-6 rounded bg-cyanPrimary/20 text-cyanPrimary flex items-center justify-center font-bold text-[10px]">PNG</span>
                  <div>
                    <div className="text-white font-medium">MRI Scan + AI Overlays (PNG)</div>
                    <div className="text-[10px] text-slate-400">High-res capture with Grad-CAM & Caliper HUD</div>
                  </div>
                </button>
                <button
                  onClick={handleExportStudyJson}
                  className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs text-left hover:bg-card transition-colors cursor-pointer"
                >
                  <span className="w-6 h-6 rounded bg-amberWarning/20 text-amber-300 flex items-center justify-center font-bold text-[10px]">JSON</span>
                  <div>
                    <div className="text-white font-medium">Study Morphometric Data (JSON)</div>
                    <div className="text-[10px] text-slate-400">Volumetrics, coordinates & raw metadata</div>
                  </div>
                </button>
                <button
                  onClick={handleExportCohortCsv}
                  className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs text-left hover:bg-card transition-colors cursor-pointer"
                >
                  <span className="w-6 h-6 rounded bg-greenSuccess/20 text-greenSuccess flex items-center justify-center font-bold text-[10px]">CSV</span>
                  <div>
                    <div className="text-white font-medium">Patient Cohort Database (CSV)</div>
                    <div className="text-[10px] text-slate-400">Excel-compatible tabular patient records</div>
                  </div>
                </button>
                <button
                  onClick={handleExportSummaryTxt}
                  className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs text-left hover:bg-card transition-colors cursor-pointer"
                >
                  <span className="w-6 h-6 rounded bg-purpleAccent/20 text-purple-300 flex items-center justify-center font-bold text-[10px]">TXT</span>
                  <div>
                    <div className="text-white font-medium">Diagnostic Summary (.TXT)</div>
                    <div className="text-[10px] text-slate-400">Lightweight plain-text clinical notes</div>
                  </div>
                </button>
              </div>
            )}
          </div>

          {/* Clinician Profile & Session Dropdown */}
          <div className="relative">
            <button
              onClick={() => setShowUserDropdown(!showUserDropdown)}
              className="flex items-center gap-2.5 pl-2 pr-3 py-1.5 rounded-lg bg-card/90 border border-borderSubtle hover:border-cyanPrimary transition-all cursor-pointer"
              title="Clinician Profile & Session"
            >
              <div className="w-7 h-7 rounded-md bg-gradient-to-br from-cyanPrimary/25 to-purpleAccent/25 border border-cyanPrimary/40 flex items-center justify-center font-bold text-xs text-cyanPrimary">
                {currentUser?.initials || 'MD'}
              </div>
              <div className="text-left hidden xl:block">
                <div className="text-xs font-semibold text-white leading-tight">
                  {currentUser?.name || 'Dr. Jenkins'}
                </div>
                <div className="text-[10px] text-slate-400 leading-tight">
                  {currentUser?.role?.replace('Attending ', '') || 'Clinician'}
                </div>
              </div>
              <svg className="w-3.5 h-3.5 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
              </svg>
            </button>

            {/* Clinician Dropdown Menu */}
            {showUserDropdown && (
              <div className="absolute right-0 mt-2 w-64 bg-darker/95 backdrop-blur-xl border border-borderSubtle rounded-xl shadow-2xl p-3 z-50 space-y-2.5">
                <div className="border-b border-borderSubtle/70 pb-2">
                  <div className="text-xs font-bold text-white">{currentUser?.title || currentUser?.name}</div>
                  <div className="text-[11px] text-cyanPrimary font-medium">{currentUser?.role}</div>
                  <div className="text-[10px] text-slate-400 truncate">{currentUser?.hospital}</div>
                  <div className="text-[10px] text-slate-400 font-mono mt-0.5">NPI: #{currentUser?.npi || '988214'}</div>
                </div>
                <button
                  onClick={() => {
                    setShowUserDropdown(false);
                    handleLogout();
                  }}
                  className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-semibold text-redDanger bg-redDanger/10 hover:bg-redDanger/20 border border-redDanger/30 transition-colors cursor-pointer"
                >
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                  </svg>
                  Sign Out / Switch Clinician
                </button>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Workspace Display: Standalone Embedded PACS vs React Native PACS */}
      {workstationMode === 'standalone' ? (
        <div className="flex-1 w-full h-full relative bg-darkest flex flex-col overflow-hidden">
          {/* Standalone Control & Telemetry Strip */}
          <div className="h-10 px-6 bg-surface/90 border-b border-borderSubtle flex items-center justify-between text-xs z-10 shrink-0">
            <div className="flex items-center gap-3">
              <span className="flex items-center gap-1.5 font-mono text-greenSuccess font-semibold">
                <span className="w-2 h-2 rounded-full bg-greenSuccess animate-pulse-dot"></span>
                EMBEDDED STANDALONE PACS STUDIO (Port 8080)
              </span>
              <span className="text-slate-500">•</span>
              <span className="text-slate-300 font-mono text-[11px]">
                Active Case: {currentCase.patientName} ({currentCase.mrn})
              </span>
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={() => setWorkstationMode('react')}
                className="px-3 py-1 rounded-lg bg-cyanPrimary/10 border border-cyanPrimary/30 text-cyanPrimary hover:bg-cyanPrimary/20 font-semibold text-xs flex items-center gap-1.5 cursor-pointer"
              >
                ← Return to React AI Suite
              </button>
              <a
                href="http://localhost:8080"
                target="_blank"
                rel="noreferrer"
                className="px-3 py-1 rounded-lg bg-card hover:bg-cardHover border border-borderSubtle text-slate-200 font-semibold text-xs flex items-center gap-1.5"
              >
                <svg className="w-3.5 h-3.5 text-cyanPrimary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                </svg>
                Open in Full Window
              </a>
            </div>
          </div>

          {/* Embedded Standalone PACS Iframe */}
          <iframe
            src="http://localhost:8080"
            title="NeuroScan AI Standalone PACS Workstation"
            className="flex-1 w-full h-[calc(100vh-6.5rem)] border-none bg-darkest"
          />
        </div>
      ) : (
        /* Main React Workspace Layout */
        <main className="flex-1 flex overflow-hidden">
        {/* Left Sidebar: Cases & Windowing */}
        <aside className="w-72 bg-darker/60 border-r border-borderSubtle p-4 flex flex-col gap-4 overflow-y-auto">
          <div>
            <h2 className="text-xs font-bold uppercase tracking-wider text-slate-300 font-display mb-2.5">Clinical Cases</h2>
            <div className="flex flex-col gap-2">
              {Object.entries(CLINICAL_PRESETS).map(([key, item]) => (
                <div
                  key={key}
                  onClick={() => setCurrentCaseKey(key)}
                  className={`p-2.5 rounded-lg border cursor-pointer transition-all ${
                    currentCaseKey === key
                      ? 'bg-cyanPrimary/10 border-cyanPrimary shadow-md shadow-cyanPrimary/10'
                      : 'bg-card/60 border-borderSubtle hover:bg-cardHover'
                  }`}
                >
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-mono font-bold text-slate-300">{item.id}</span>
                    <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${
                      item.tumorType === 'GLIOMA' ? 'bg-redDanger/20 text-red-400' :
                      item.tumorType === 'MENINGIOMA' ? 'bg-amberWarning/20 text-amber-300' :
                      item.tumorType === 'PITUITARY' ? 'bg-purpleAccent/20 text-purple-300' :
                      'bg-greenSuccess/20 text-emerald-300'
                    }`}>
                      {item.tumorType}
                    </span>
                  </div>
                  <div className="text-xs font-semibold text-white mt-1 truncate">{item.diagnosis}</div>
                  <div className="text-[11px] text-slate-400">{item.volumetrics.laterality}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Window Presets */}
          <div>
            <h2 className="text-xs font-bold uppercase tracking-wider text-slate-300 font-display mb-2">Window / Level</h2>
            <div className="grid grid-cols-3 gap-1.5 mb-3">
              {['brain', 'subdural', 'bone'].map((p) => (
                <button
                  key={p}
                  onClick={() => handleWindowPreset(p)}
                  className={`py-1.5 text-xs font-semibold rounded capitalize border transition-all ${
                    activePreset === p ? 'bg-cyanPrimary/20 border-cyanPrimary text-cyanPrimary' : 'bg-card border-borderSubtle text-slate-400'
                  }`}
                >
                  {p}
                </button>
              ))}
            </div>

            {/* Slider Controls */}
            <div className="space-y-2.5 bg-card/40 p-3 rounded-lg border border-borderSubtle text-xs">
              <div>
                <div className="flex justify-between mb-1">
                  <span className="text-slate-400">Brightness</span>
                  <span className="font-mono text-cyanPrimary">{brightness}%</span>
                </div>
                <input
                  type="range" min="50" max="180" value={brightness}
                  onChange={(e) => setBrightness(Number(e.target.value))}
                  className="w-full accent-cyanPrimary h-1 bg-slate-700 rounded-lg cursor-pointer"
                />
              </div>

              <div>
                <div className="flex justify-between mb-1">
                  <span className="text-slate-400">Contrast</span>
                  <span className="font-mono text-cyanPrimary">{contrast}%</span>
                </div>
                <input
                  type="range" min="50" max="200" value={contrast}
                  onChange={(e) => setContrast(Number(e.target.value))}
                  className="w-full accent-cyanPrimary h-1 bg-slate-700 rounded-lg cursor-pointer"
                />
              </div>

              <div>
                <div className="flex justify-between mb-1">
                  <span className="text-slate-400">Grad-CAM Opacity</span>
                  <span className="font-mono text-cyanPrimary">{gradcamAlpha}%</span>
                </div>
                <input
                  type="range" min="0" max="100" value={gradcamAlpha}
                  onChange={(e) => setGradcamAlpha(Number(e.target.value))}
                  className="w-full accent-cyanPrimary h-1 bg-slate-700 rounded-lg cursor-pointer"
                />
              </div>
            </div>
          </div>
        </aside>

        {/* Center Panel: PACS Viewport */}
        <section className="flex-1 flex flex-col bg-black relative overflow-hidden">
          {/* Viewer Toolbar */}
          <div className="h-11 bg-darker/90 border-b border-borderSubtle px-4 flex items-center justify-between text-xs z-10">
            <div className="flex items-center gap-2">
              <button
                onClick={() => setActiveTool('select')}
                className={`px-2.5 py-1 rounded font-semibold transition-all ${
                  activeTool === 'select' ? 'bg-cyanPrimary/20 border border-cyanPrimary text-cyanPrimary' : 'bg-card text-slate-400'
                }`}
              >
                Pan / Zoom
              </button>
              <button
                onClick={() => setActiveTool('measure')}
                className={`px-2.5 py-1 rounded font-semibold transition-all ${
                  activeTool === 'measure' ? 'bg-amberWarning/20 border border-amberWarning text-amber-300' : 'bg-card text-slate-400'
                }`}
              >
                Caliper (mm)
              </button>
            </div>

            {/* Overlays */}
            <div className="flex items-center gap-2">
              <label className="flex items-center gap-1.5 cursor-pointer text-slate-300 select-none">
                <input type="checkbox" checked={showBbox} onChange={(e) => setShowBbox(e.target.checked)} className="accent-redDanger" />
                <span>Bounding Box</span>
              </label>
              <label className="flex items-center gap-1.5 cursor-pointer text-slate-300 select-none">
                <input type="checkbox" checked={showSeg} onChange={(e) => setShowSeg(e.target.checked)} className="accent-cyanPrimary" />
                <span>U-Net Mask</span>
              </label>
              <label className="flex items-center gap-1.5 cursor-pointer text-slate-300 select-none">
                <input type="checkbox" checked={showGradCam} onChange={(e) => setShowGradCam(e.target.checked)} className="accent-amberWarning" />
                <span>Grad-CAM XAI</span>
              </label>
            </div>

            <div className="flex items-center gap-2">
              <button onClick={() => setZoom(z => Math.max(0.6, z - 0.2))} className="p-1 bg-card hover:bg-cardHover rounded text-slate-300">－</button>
              <span className="font-mono text-slate-400 text-xs w-10 text-center">{Math.round(zoom * 100)}%</span>
              <button onClick={() => setZoom(z => Math.min(3.0, z + 0.2))} className="p-1 bg-card hover:bg-cardHover rounded text-slate-300">＋</button>
              <button onClick={() => setIsInverted(v => !v)} className={`px-2 py-1 rounded text-xs font-semibold ${isInverted ? 'bg-cyanPrimary/20 text-cyanPrimary' : 'bg-card text-slate-400'}`}>
                Invert
              </button>
              <button onClick={() => { setZoom(1.0); setPan({ x: 0, y: 0 }); }} className="px-2 py-1 bg-card hover:bg-cardHover rounded text-slate-400">
                Reset
              </button>
            </div>
          </div>

          {/* Canvas Viewport */}
          <div className="flex-1 relative flex items-center justify-center overflow-hidden bg-black">
            <canvas ref={canvasRef} className="max-w-full max-h-full object-contain aspect-square shadow-2xl" />

            {/* DICOM HUD Overlays */}
            <div className="absolute top-3 left-4 text-[11px] font-mono text-slate-400 leading-relaxed pointer-events-none">
              <div>PATIENT: <span className="text-white font-bold">{currentCase.patientName}</span></div>
              <div>MRN: <span className="text-white">{currentCase.mrn}</span></div>
              <div>DOB: 14-MAY-1970 [{currentCase.ageGender}]</div>
              <div>SERIES: 3 [AX T1-CE]</div>
            </div>

            <div className="absolute top-3 right-4 text-[11px] font-mono text-right text-slate-400 leading-relaxed pointer-events-none">
              <div>HOSPITAL: <span className="text-cyanPrimary font-bold">NEURO-ONCOLOGY CENTER</span></div>
              <div>MAGNETOM: 3.0 TESLA MRI</div>
              <div>FOV: 240 x 240 mm</div>
              <div>SLICE THICK: 1.50 mm</div>
            </div>

            <div className="absolute bottom-3 left-4 text-[11px] font-mono text-slate-400 pointer-events-none">
              <div>ZOOM: {zoom.toFixed(1)}x | MATRIX: 512 x 512</div>
              <div>MODEL: <span className="text-greenSuccess">PyTorch U-Net + Grad-CAM</span></div>
            </div>

            <div className="absolute bottom-3 right-4 text-[11px] font-mono text-right text-slate-400 pointer-events-none">
              <div>CONFIDENCE: <span className="text-greenSuccess font-bold">{currentCase.confidence}%</span></div>
              <div>SLICE: {currentSlice} / 24</div>
            </div>

            {/* Scanning radar line animation */}
            {isInferencing && (
              <div className="absolute inset-x-0 h-0.5 bg-gradient-to-r from-transparent via-cyanPrimary to-transparent shadow-[0_0_15px_#00e5ff] animate-scan-laser pointer-events-none"></div>
            )}
          </div>

          {/* Slice Timeline Scrubber */}
          <div className="h-12 bg-darker/90 border-t border-borderSubtle px-6 flex items-center gap-4 z-10">
            <span className="font-mono text-xs text-slate-400">Slice <strong>{currentSlice}</strong> / 24</span>
            <input
              type="range" min="1" max="24" value={currentSlice}
              onChange={(e) => setCurrentSlice(Number(e.target.value))}
              className="flex-1 accent-cyanPrimary h-1.5 bg-slate-700 rounded cursor-pointer"
            />
          </div>
        </section>

        {/* Right Analytics Sidebar: Detection, Classification & Volumetrics */}
        <aside className="w-96 bg-darker/60 border-l border-borderSubtle p-4 flex flex-col gap-4 overflow-y-auto">
          {/* Detection Status Hero */}
          <div className={`p-4 rounded-xl border ${
            currentCase.tumorType === 'NORMAL'
              ? 'bg-gradient-to-br from-greenSuccess/15 to-surface border-greenSuccess/40'
              : 'bg-gradient-to-br from-redDanger/15 to-surface border-redDanger/40'
          }`}>
            <div className="flex items-center justify-between mb-2">
              <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${
                currentCase.tumorType === 'NORMAL' ? 'bg-greenSuccess/20 text-emerald-300' : 'bg-redDanger/20 text-red-400'
              }`}>
                {currentCase.tumorType === 'NORMAL' ? 'NO TUMOR DETECTED' : 'TUMOR DETECTED'}
              </span>
              <span className="font-mono text-xs text-cyanPrimary font-bold">{currentCase.confidence}% Confidence</span>
            </div>
            <h3 className="text-base font-bold text-white font-display leading-tight">{currentCase.diagnosis}</h3>
            <p className="text-xs text-slate-400 mt-1">{currentCase.whoGrade} • Deep Learning Prediction</p>
          </div>

          {/* Softmax Probability Distribution */}
          <div className="bg-card/50 p-3.5 rounded-xl border border-borderSubtle">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-300 font-display mb-3">Multi-Class Probabilities</h4>
            <div className="space-y-2.5">
              {[
                { label: 'Glioma / Glioblastoma', key: 'glioma', color: 'from-rose-500 to-red-600' },
                { label: 'Meningioma', key: 'meningioma', color: 'from-amber-400 to-amber-500' },
                { label: 'Pituitary Adenoma', key: 'pituitary', color: 'from-purple-400 to-purple-500' },
                { label: 'Healthy Control', key: 'normal', color: 'from-emerald-400 to-emerald-500' },
              ].map(({ label, key, color }) => (
                <div key={key}>
                  <div className="flex justify-between text-xs mb-1">
                    <span className="text-slate-300">{label}</span>
                    <span className="font-mono font-bold text-white">{currentCase.probabilities[key]}%</span>
                  </div>
                  <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
                    <div
                      className={`h-full bg-gradient-to-r ${color} transition-all duration-500`}
                      style={{ width: `${currentCase.probabilities[key]}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* 3D Volumetrics Grid */}
          <div className="bg-card/50 p-3.5 rounded-xl border border-borderSubtle">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-300 font-display mb-2.5">Localization & Volumetrics</h4>
            <div className="grid grid-cols-2 gap-2">
              <div className="bg-surface/60 p-2.5 rounded-lg border border-borderSubtle">
                <span className="text-[10px] text-slate-400 block font-bold font-mono">EST. VOLUME</span>
                <span className="text-sm font-bold text-cyanPrimary font-display">{currentCase.volumetrics.volume}</span>
              </div>
              <div className="bg-surface/60 p-2.5 rounded-lg border border-borderSubtle">
                <span className="text-[10px] text-slate-400 block font-bold font-mono">MAX DIAMETER</span>
                <span className="text-sm font-bold text-white font-display">{currentCase.volumetrics.diameter}</span>
              </div>
              <div className="bg-surface/60 p-2.5 rounded-lg border border-borderSubtle">
                <span className="text-[10px] text-slate-400 block font-bold font-mono">LATERALIZATION</span>
                <span className="text-xs font-semibold text-white">{currentCase.volumetrics.laterality}</span>
              </div>
              <div className="bg-surface/60 p-2.5 rounded-lg border border-borderSubtle">
                <span className="text-[10px] text-slate-400 block font-bold font-mono">MIDLINE SHIFT</span>
                <span className="text-sm font-bold text-amberWarning font-display">{currentCase.volumetrics.midlineShift}</span>
              </div>
            </div>
          </div>

          {/* Explainable AI (Grad-CAM) */}
          <div className="bg-card/50 p-3.5 rounded-xl border border-borderSubtle">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-300 font-display mb-1.5">Explainability (Grad-CAM XAI)</h4>
            <p className="text-xs text-slate-400 leading-relaxed">{currentCase.xai.note}</p>
            <div className="flex justify-between items-center text-xs mt-2 pt-2 border-t border-borderSubtle">
              <span className="text-slate-400">Saliency Score:</span>
              <span className="font-mono text-greenSuccess font-bold">{currentCase.xai.saliency}</span>
            </div>
          </div>

          {/* Run Inference Button */}
          <button
            onClick={runPyTorchInference}
            disabled={isInferencing}
            className="w-full mt-auto py-3 rounded-xl bg-gradient-to-r from-purpleAccent to-cyanPrimary text-white font-semibold text-xs shadow-lg shadow-cyanPrimary/20 hover:brightness-110 active:scale-[0.99] transition-all flex items-center justify-center gap-2"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z"/>
            </svg>
            {isInferencing ? 'Running PyTorch U-Net & Grad-CAM...' : 'Re-Run Model Inference'}
          </button>
        </aside>
      </main>
      )}

      {/* MySQL Database Modal */}
      {showDbModal && (
        <div className="fixed inset-0 bg-black/75 backdrop-blur-sm z-50 flex items-center justify-center p-6">
          <div className="bg-surface border border-borderSubtle rounded-2xl w-full max-w-4xl max-h-[85vh] flex flex-col shadow-2xl overflow-hidden">
            <div className="p-4 border-b border-borderSubtle flex items-center justify-between">
              <h3 className="text-base font-bold text-white flex items-center gap-2 font-display">
                <span className="w-2.5 h-2.5 rounded-full bg-greenSuccess"></span>
                MySQL Patient Clinical Database
              </h3>
              <button onClick={() => setShowDbModal(false)} className="text-slate-400 hover:text-white text-lg">✕</button>
            </div>
            <div className="p-6 overflow-y-auto">
              <table className="w-full text-xs text-left border-collapse">
                <thead>
                  <tr className="border-b border-borderSubtle text-slate-400 font-mono">
                    <th className="py-2.5">MRN</th>
                    <th>PATIENT NAME</th>
                    <th>AGE/GENDER</th>
                    <th>DIAGNOSIS</th>
                    <th>CONFIDENCE</th>
                    <th>VOLUME</th>
                    <th>ACTIONS</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-borderSubtle/50">
                  {Object.values(CLINICAL_PRESETS).map((p) => (
                    <tr key={p.id} className="hover:bg-card/40">
                      <td className="py-3 font-mono text-cyanPrimary">{p.mrn}</td>
                      <td className="font-semibold text-white">{p.patientName}</td>
                      <td>{p.ageGender}</td>
                      <td>
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                          p.tumorType === 'GLIOMA' ? 'bg-redDanger/20 text-red-400' :
                          p.tumorType === 'MENINGIOMA' ? 'bg-amberWarning/20 text-amber-300' :
                          p.tumorType === 'PITUITARY' ? 'bg-purpleAccent/20 text-purple-300' :
                          'bg-greenSuccess/20 text-emerald-300'
                        }`}>
                          {p.tumorType}
                        </span>
                      </td>
                      <td className="font-mono font-bold text-white">{p.confidence}%</td>
                      <td className="font-mono text-slate-300">{p.volumetrics.volume}</td>
                      <td>
                        <button
                          onClick={() => { setCurrentCase(p); setShowDbModal(false); }}
                          className="px-2.5 py-1 rounded bg-cyanPrimary/10 text-cyanPrimary hover:bg-cyanPrimary/20 font-semibold text-[11px]"
                        >
                          Load Scan
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="p-4 border-t border-borderSubtle flex items-center justify-between">
              <button
                onClick={handleExportCohortCsv}
                className="px-3.5 py-2 bg-greenSuccess/15 border border-greenSuccess/40 hover:bg-greenSuccess/25 text-greenSuccess rounded-lg text-xs font-semibold flex items-center gap-2 transition-colors cursor-pointer"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                Export All Records (.CSV)
              </button>
              <button onClick={() => setShowDbModal(false)} className="px-4 py-2 bg-card hover:bg-cardHover rounded-lg text-xs font-semibold cursor-pointer">
                Close Database
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Clinical Diagnostic Report Modal */}
      {showReportModal && (
        <div className="fixed inset-0 bg-black/75 backdrop-blur-sm z-50 flex items-center justify-center p-6">
          <div className="bg-white text-slate-900 rounded-lg w-full max-w-2xl max-h-[90vh] flex flex-col shadow-2xl overflow-hidden font-sans">
            <div className="p-6 overflow-y-auto space-y-4">
              <div className="border-b-2 border-slate-900 pb-3">
                <h2 className="text-lg font-extrabold text-slate-900 tracking-tight">DEPARTMENT OF NEURORADIOLOGY</h2>
                <p className="text-xs text-slate-600">AI-Assisted MRI Brain Tumor Diagnostic Report • PyTorch U-Net & Grad-CAM</p>
              </div>

              <div className="grid grid-cols-2 text-xs border border-slate-300 p-3 bg-slate-50 gap-2">
                <div><strong>Patient:</strong> {currentCase.patientName}</div>
                <div><strong>MRN:</strong> {currentCase.mrn}</div>
                <div><strong>Age/Sex:</strong> {currentCase.ageGender}</div>
                <div><strong>Study:</strong> {currentCase.sequence}</div>
              </div>

              <div className="text-xs space-y-2">
                <h4 className="font-bold border-b border-slate-200 pb-1">QUANTITATIVE AI MORPHOMETRIC FINDINGS</h4>
                <ul className="list-disc pl-5 space-y-1 text-slate-700">
                  <li><strong>Classification:</strong> {currentCase.diagnosis} ({currentCase.confidence}% Confidence)</li>
                  <li><strong>Volumetric Quantification:</strong> {currentCase.volumetrics.volume}</li>
                  <li><strong>Maximal Dimension:</strong> {currentCase.volumetrics.diameter}</li>
                  <li><strong>Midline Shift:</strong> {currentCase.volumetrics.midlineShift}</li>
                </ul>
              </div>

              <div className="text-xs space-y-1">
                <h4 className="font-bold border-b border-slate-200 pb-1">RADIOLOGICAL IMPRESSION</h4>
                <div className="p-3 bg-blue-50 border-l-4 border-blue-600 text-slate-800 font-medium">
                  {currentCase.diagnosis} demonstrated on contrast-enhanced MRI. U-Net multi-compartment segmentation and Grad-CAM saliency confirm focal neoplasm.
                </div>
              </div>
            </div>
            <div className="p-4 bg-slate-100 border-t flex flex-wrap items-center justify-between gap-2 text-xs">
              <div className="flex items-center gap-1.5">
                <button
                  onClick={handleExportMriPng}
                  className="px-3 py-1.5 bg-white border border-slate-300 rounded font-semibold text-slate-700 hover:bg-slate-50 flex items-center gap-1 shadow-sm cursor-pointer"
                  title="Export high-resolution MRI with AI annotations as PNG"
                >
                  🖼️ Save PNG
                </button>
                <button
                  onClick={handleExportStudyJson}
                  className="px-3 py-1.5 bg-white border border-slate-300 rounded font-semibold text-slate-700 hover:bg-slate-50 flex items-center gap-1 shadow-sm cursor-pointer"
                  title="Export deep morphometric study data as JSON"
                >
                  📊 JSON Data
                </button>
                <button
                  onClick={handleExportSummaryTxt}
                  className="px-3 py-1.5 bg-white border border-slate-300 rounded font-semibold text-slate-700 hover:bg-slate-50 flex items-center gap-1 shadow-sm cursor-pointer"
                  title="Export clinical diagnostic text summary"
                >
                  📝 Text Summary
                </button>
              </div>
              <div className="flex items-center gap-2">
                <button onClick={() => setShowReportModal(false)} className="px-4 py-1.5 border rounded font-semibold text-slate-700 hover:bg-slate-200 cursor-pointer">Close</button>
                <button onClick={() => window.print()} className="px-4 py-1.5 bg-blue-600 text-white rounded font-semibold hover:bg-blue-700 flex items-center gap-1.5 shadow-sm cursor-pointer">
                  <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
                  </svg>
                  Print / Save PDF
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// Canvas Helpers
function drawMriAnatomy(ctx, caseKey, slice) {
  const cx = 256;
  const cy = 256;
  const sliceFactor = 1 - Math.abs(slice - 14) / 16;
  const rx = 185 * Math.max(0.7, sliceFactor);
  const ry = 220 * Math.max(0.75, sliceFactor);

  // Scalp & Skull
  ctx.beginPath();
  ctx.ellipse(cx, cy, rx + 10, ry + 10, 0, 0, Math.PI * 2);
  ctx.fillStyle = '#64748b';
  ctx.fill();

  ctx.beginPath();
  ctx.ellipse(cx, cy, rx + 4, ry + 4, 0, 0, Math.PI * 2);
  ctx.fillStyle = '#0f172a';
  ctx.fill();

  // Brain Parenchyma
  ctx.beginPath();
  ctx.ellipse(cx, cy, rx, ry, 0, 0, Math.PI * 2);
  ctx.fillStyle = '#334155';
  ctx.fill();

  // White matter
  ctx.beginPath();
  ctx.ellipse(cx, cy, rx * 0.82, ry * 0.82, 0, 0, Math.PI * 2);
  ctx.fillStyle = '#475569';
  ctx.fill();

  // Ventricles
  ctx.fillStyle = '#090d16';
  ctx.beginPath();
  ctx.ellipse(cx - 24, cy - 20, 10, 32, -0.2, 0, Math.PI * 2);
  ctx.fill();

  ctx.beginPath();
  ctx.ellipse(cx + 24, cy - 20, caseKey === 'glioma' ? 4 : 10, 32, 0.2, 0, Math.PI * 2);
  ctx.fill();

  // Specific Tumor Pathology
  if (caseKey === 'glioma') {
    // Enhancing Ring
    ctx.beginPath();
    ctx.ellipse(205, 220, 50, 46, 0.2, 0, Math.PI * 2);
    ctx.lineWidth = 14;
    ctx.strokeStyle = '#f1f5f9';
    ctx.stroke();

    // Necrotic Core
    ctx.beginPath();
    ctx.ellipse(205, 220, 32, 28, 0.2, 0, Math.PI * 2);
    ctx.fillStyle = '#1e293b';
    ctx.fill();
  } else if (caseKey === 'meningioma') {
    ctx.beginPath();
    ctx.ellipse(118, 272, 42, 46, -0.2, 0, Math.PI * 2);
    ctx.fillStyle = '#e2e8f0';
    ctx.fill();
  } else if (caseKey === 'pituitary') {
    ctx.beginPath();
    ctx.ellipse(248, 248, 30, 26, 0, 0, Math.PI * 2);
    ctx.fillStyle = '#cbd5e1';
    ctx.fill();
  }
}

function applyFilters(ctx, b, c, invert) {
  if (b === 100 && c === 100 && !invert) return;
  const imgData = ctx.getImageData(0, 0, 512, 512);
  const data = imgData.data;
  const bMult = b / 100;
  const cFactor = (259 * (c + 255)) / (255 * (259 - c));

  for (let i = 0; i < data.length; i += 4) {
    let r = data[i], g = data[i + 1], bVal = data[i + 2];
    if (invert) { r = 255 - r; g = 255 - g; bVal = 255 - bVal; }
    r = cFactor * (r * bMult - 128) + 128;
    g = cFactor * (g * bMult - 128) + 128;
    bVal = cFactor * (bVal * bMult - 128) + 128;
    data[i] = Math.max(0, Math.min(255, r));
    data[i + 1] = Math.max(0, Math.min(255, g));
    data[i + 2] = Math.max(0, Math.min(255, bVal));
  }
  ctx.putImageData(imgData, 0, 0);
}

function drawGradCamHeatmap(ctx, bbox, opacity) {
  ctx.save();
  ctx.globalAlpha = opacity;
  const hx = bbox.x + bbox.w / 2;
  const hy = bbox.y + bbox.h / 2;
  const rad = Math.max(bbox.w, bbox.h) * 0.85;

  const grad = ctx.createRadialGradient(hx, hy, 4, hx, hy, rad);
  grad.addColorStop(0, 'rgba(255, 0, 0, 0.95)');
  grad.addColorStop(0.35, 'rgba(255, 165, 0, 0.85)');
  grad.addColorStop(0.65, 'rgba(255, 255, 0, 0.65)');
  grad.addColorStop(0.85, 'rgba(0, 230, 118, 0.35)');
  grad.addColorStop(1, 'rgba(0, 229, 255, 0)');

  ctx.fillStyle = grad;
  ctx.beginPath();
  ctx.arc(hx, hy, rad, 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();
}

function drawUnetSegmentation(ctx, bbox, tumorType) {
  ctx.save();
  ctx.globalAlpha = 0.55;
  const cx = bbox.x + bbox.w / 2;
  const cy = bbox.y + bbox.h / 2;

  // Edema
  ctx.fillStyle = '#ffd600';
  ctx.beginPath();
  ctx.ellipse(cx, cy, bbox.w * 0.58, bbox.h * 0.58, 0.2, 0, Math.PI * 2);
  ctx.fill();

  // Active Tumor
  ctx.fillStyle = '#00e5ff';
  ctx.beginPath();
  ctx.ellipse(cx, cy, bbox.w * 0.42, bbox.h * 0.42, 0.2, 0, Math.PI * 2);
  ctx.fill();

  // Necrotic Core
  ctx.fillStyle = '#ff1744';
  ctx.beginPath();
  ctx.ellipse(cx, cy, bbox.w * 0.24, bbox.h * 0.24, 0.2, 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();
}

function drawBoundingBox(ctx, bbox, label, conf) {
  ctx.save();
  ctx.strokeStyle = '#ff1744';
  ctx.lineWidth = 2;
  ctx.setLineDash([6, 4]);
  ctx.strokeRect(bbox.x, bbox.y, bbox.w, bbox.h);

  // Label Badge
  ctx.setLineDash([]);
  ctx.fillStyle = '#ff1744';
  ctx.font = 'bold 11px monospace';
  const text = `${label.split(' ')[0]} [${conf}%]`;
  ctx.fillRect(bbox.x, bbox.y - 18, ctx.measureText(text).width + 8, 18);
  ctx.fillStyle = '#fff';
  ctx.fillText(text, bbox.x + 4, bbox.y - 4);
  ctx.restore();
}

function drawCaliper(ctx, p1, p2, dist) {
  ctx.save();
  ctx.strokeStyle = '#ffb300';
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(p1.x, p1.y);
  ctx.lineTo(p2.x, p2.y);
  ctx.stroke();
  ctx.restore();
}
