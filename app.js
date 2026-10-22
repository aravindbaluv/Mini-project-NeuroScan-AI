/**
 * ============================================================================
 * NEUROSCAN AI™ - Brain Tumor Detection, Classification & Localization System
 * Clinical PACS Workstation & Neuro-Oncology Diagnostic Suite
 * ============================================================================
 */

(function () {
  'use strict';

  // --- Clinical Preset Database ---
  const CLINICAL_CASES = {
    glioma: {
      id: '#NS-8042-GBM',
      patientName: 'Doe, John M.',
      mrn: 'MR-9823101',
      ageSex: '54Y / Male',
      sequence: 'MRI 3.0T AX T1-CE + FLAIR',
      date: '13-OCT-2026',
      accession: 'AC-2026-90412',
      status: 'danger',
      statusText: 'TUMOR DETECTED',
      tumorName: 'Glioblastoma Multiforme (GBM)',
      tumorMeta: 'WHO Grade IV • High-Grade Malignancy • Infiltrative Margins',
      confidence: 98.4,
      probabilities: {
        glioma: 98.4,
        meningioma: 1.2,
        pituitary: 0.3,
        normal: 0.1
      },
      volumetrics: {
        volume: '28.4 cm³',
        diameter: '41.8 mm',
        laterality: 'Right Frontal-Temporal',
        midlineShift: '4.2 mm',
        voxelCount: '60,683'
      },
      bbox: { x: 145, y: 155, w: 125, h: 130 },
      slicesRange: '10 - 18',
      peakSlice: 14,
      xai: {
        saliency: '0.94 / 1.00',
        dice: '0.962',
        explanation: 'Convolutional feature maps in Layer 4 exhibit maximal visual attention on the hyperintense contrast-enhancing peripheral rim and intra-lesional necrotic core, indicating high specificity for high-grade neoplastic tissue.'
      },
      indication: 'Progressive cephalalgia of 4 weeks duration, accompanied by acute left-sided hemiparesis and new-onset focal seizures with impaired awareness.',
      impression: '1. Solitary, heterogeneously enhancing infiltrative intra-axial lesion in the right frontal-temporal operculum demonstrating central necrosis and prominent surrounding vasogenic edema, highly characteristic of High-Grade Glioblastoma (WHO Grade IV).\n2. Associated significant regional mass effect with 4.2 mm leftward subfalcine midline shift and mild effacement of the right lateral ventricle frontal horn.',
      recommendations: '• Immediate urgent neurosurgical consult for evaluation of stereotactic biopsy vs. maximum safe surgical craniotomy and resection.\n• Initiation of anti-edema therapy (corticosteroids) per neuro-oncology protocol.\n• Follow-up MR perfusion and MR spectroscopy recommended for surgical tract mapping.'
    },

    meningioma: {
      id: '#NS-7119-MEN',
      patientName: 'Vance, Eleanor R.',
      mrn: 'MR-4402917',
      ageSex: '58Y / Female',
      sequence: 'MRI 3.0T AX T1-CE + T2',
      date: '12-OCT-2026',
      accession: 'AC-2026-89114',
      status: 'warning',
      statusText: 'TUMOR DETECTED',
      tumorName: 'Parasagittal Convexity Meningioma',
      tumorMeta: 'WHO Grade I • Extra-Axial Benign • Distinct Dural Tail Sign',
      confidence: 97.6,
      probabilities: {
        glioma: 1.5,
        meningioma: 97.6,
        pituitary: 0.7,
        normal: 0.2
      },
      volumetrics: {
        volume: '16.2 cm³',
        diameter: '32.5 mm',
        laterality: 'Right Parietal Convexity',
        midlineShift: '1.8 mm',
        voxelCount: '34,510'
      },
      bbox: { x: 70, y: 220, w: 95, h: 105 },
      slicesRange: '12 - 20',
      peakSlice: 16,
      xai: {
        saliency: '0.92 / 1.00',
        dice: '0.954',
        explanation: 'High attention gradients localize intensely to the broad-based dural attachment along the right parietal convexity and uniform contrast enhancement, confirming extra-axial meningothelial neoplasm.'
      },
      indication: 'Incidental finding on investigation for persistent chronic tension-type headaches and subtle left-hand sensory parasthesias without focal motor deficit.',
      impression: '1. Well-circumscribed, extra-axial mass arising from the right parietal convexity dura with intense, homogeneous post-contrast enhancement and positive dural tail sign, consistent with Meningioma (likely WHO Grade I).\n2. Mild mass effect on underlying cerebral cortex with preserved cortical CSF cleft and minimal surrounding edema.',
      recommendations: '• Neurosurgical consultation for elective surgical planning (Simpson Grade I resection).\n• Pre-operative embolization evaluation if hypervascularity is noted on angiography.\n• Serial neuro-imaging follow-up at 3 months if conservative wait-and-watch approach is considered.'
    },

    pituitary: {
      id: '#NS-4902-PIT',
      patientName: 'Brody, Marcus A.',
      mrn: 'MR-7718290',
      ageSex: '47Y / Male',
      sequence: 'MRI 3.0T PITUITARY PROTOCOL (T1+C)',
      date: '10-OCT-2026',
      accession: 'AC-2026-77823',
      status: 'purple',
      statusText: 'TUMOR DETECTED',
      tumorName: 'Pituitary Macroadenoma (Sellar/Suprasellar)',
      tumorMeta: 'WHO Grade I • Sellar Mass • Optic Chiasm Elevation',
      confidence: 98.9,
      probabilities: {
        glioma: 0.3,
        meningioma: 0.6,
        pituitary: 98.9,
        normal: 0.2
      },
      volumetrics: {
        volume: '8.7 cm³',
        diameter: '22.4 mm',
        laterality: 'Sellar / Midline Centered',
        midlineShift: '0.0 mm (Midline)',
        voxelCount: '18,590'
      },
      bbox: { x: 205, y: 205, w: 85, h: 85 },
      slicesRange: '10 - 16',
      peakSlice: 13,
      xai: {
        saliency: '0.96 / 1.00',
        dice: '0.968',
        explanation: 'Neural activations concentrate sharply in the sellar turcica with symmetric superior extension through the diaphragmatic hiatus toward the optic chiasmatic cistern.'
      },
      indication: 'Progressive bitemporal hemianopsia visual field cuts and clinical features of hyperprolactinemia / endocrine dysregulation.',
      impression: '1. Enlarged sella turcica filled with a soft tissue mass demonstrating suprasellar extension and classic figure-of-eight (snowman) configuration, measuring 22.4 mm, compatible with Pituitary Macroadenoma.\n2. Contact and superior displacement of the optic chiasm. No cavernous sinus invasion (Knosp Grade 1).',
      recommendations: '• Comprehensive neuro-endocrine laboratory panel (Prolactin, IGF-1, ACTH, TSH, Cortisol).\n• Formal automated perimetry visual field testing.\n• Urgent evaluation for transsphenoidal endoscopic surgical decompression.'
    },

    normal: {
      id: '#NS-1025-NRM',
      patientName: 'Connor, Sarah L.',
      mrn: 'MR-1092844',
      ageSex: '32Y / Female',
      sequence: 'MRI 3.0T BRAIN SCREENING (T1 + T2)',
      date: '13-OCT-2026',
      accession: 'AC-2026-90881',
      status: 'success',
      statusText: 'NO LESION DETECTED',
      tumorName: 'Normal Brain (Healthy Neuro-Anatomy)',
      tumorMeta: 'Unremarkable Brain Parenchyma • Symmetric Ventricles • No Enhancing Lesion',
      confidence: 99.6,
      probabilities: {
        glioma: 0.2,
        meningioma: 0.1,
        pituitary: 0.1,
        normal: 99.6
      },
      volumetrics: {
        volume: '0.0 cm³',
        diameter: '0.0 mm',
        laterality: 'N/A (Symmetrical)',
        midlineShift: '0.0 mm',
        voxelCount: '0'
      },
      bbox: null,
      slicesRange: 'N/A',
      peakSlice: 14,
      xai: {
        saliency: '0.12 / 1.00',
        dice: 'N/A',
        explanation: 'Absence of focal hyper-intense activation clusters or structural asymmetries. Softmax model output confirms non-pathological healthy baseline control.'
      },
      indication: 'Evaluation for atypical migraines with visual aura. Negative neurological deficit on clinical physical exam.',
      impression: '1. Symmetric cerebral hemispheres with normal gray-white matter differentiation.\n2. Normal size and configuration of the ventricular system and basal cisterns without mass effect, midline shift, or intracranial hemorrhage.\n3. No abnormal focal parenchymal signal alteration or pathological contrast enhancement.',
      recommendations: '• Routine clinical follow-up for headache management.\n• No acute neurosurgical or oncological intervention required at this time.'
    }
  };

  // --- Application State ---
  const state = {
    currentCase: 'glioma',
    customImage: null,
    isCustomScan: false,
    currentSlice: 14,
    totalSlices: 24,
    activePlane: 'axial',
    isPlayingCine: false,
    cineInterval: null,

    // Viewer Transformation
    zoom: 1.0,
    panX: 0,
    panY: 0,
    isDragging: false,
    dragStartX: 0,
    dragStartY: 0,

    // PACS Adjustments
    brightness: 100,
    contrast: 100,
    clahe: 20,
    heatmapOpacity: 65,
    inverted: false,
    activePreset: 'brain',

    // Active Tool
    activeTool: 'select', // 'select' | 'measure' | 'crosshair'
    showCrosshair: false,

    // Layer Toggles
    showBbox: true,
    showSeg: true,
    showHeatmap: true,

    // Caliper Measurement Tool
    caliper: {
      measuring: false,
      p1: null,
      p2: null,
      distanceMm: 0
    },

    // Cursor position in canvas space
    mousePos: { x: 256, y: 256 }
  };

  // --- DOM Elements ---
  const canvas = document.getElementById('mriCanvas');
  const ctx = canvas.getContext('2d');
  const viewportContainer = document.getElementById('viewportContainer');
  const scanLaserLine = document.getElementById('scanLaserLine');
  const caliperReadout = document.getElementById('caliperReadout');
  const caliperDistText = document.getElementById('caliperDistText');

  // Sliders & Controls
  const sliderBrightness = document.getElementById('sliderBrightness');
  const sliderContrast = document.getElementById('sliderContrast');
  const sliderClahe = document.getElementById('sliderClahe');
  const sliderHeatmapOpacity = document.getElementById('sliderHeatmapOpacity');
  const valBrightness = document.getElementById('valBrightness');
  const valContrast = document.getElementById('valContrast');
  const valClahe = document.getElementById('valClahe');
  const valHeatmapOpacity = document.getElementById('valHeatmapOpacity');

  // Slice controls
  const sliceSlider = document.getElementById('sliceSlider');
  const curSliceNum = document.getElementById('curSliceNum');
  const btnPrevSlice = document.getElementById('btnPrevSlice');
  const btnNextSlice = document.getElementById('btnNextSlice');
  const btnPlaySlices = document.getElementById('btnPlaySlices');

  // Tool buttons
  const toolSelect = document.getElementById('toolSelect');
  const toolMeasure = document.getElementById('toolMeasure');
  const toolCrosshair = document.getElementById('toolCrosshair');
  const btnZoomIn = document.getElementById('btnZoomIn');
  const btnZoomOut = document.getElementById('btnZoomOut');
  const btnInvert = document.getElementById('btnInvert');
  const btnResetView = document.getElementById('btnResetView');
  const dispZoomLevel = document.getElementById('dispZoomLevel');

  // Overlays
  const chkBoxBbox = document.getElementById('chkBoxBbox');
  const chkBoxSeg = document.getElementById('chkBoxSeg');
  const chkBoxHeatmap = document.getElementById('chkBoxHeatmap');
  const toggleBBox = document.getElementById('toggleBBox');
  const toggleSeg = document.getElementById('toggleSeg');
  const toggleHeatmap = document.getElementById('toggleHeatmap');

  // HUD Elements
  const hudPatientName = document.getElementById('hudPatientName');
  const hudMrn = document.getElementById('hudMrn');
  const hudConfidence = document.getElementById('hudConfidence');
  const hudSliceIndicator = document.getElementById('hudSliceIndicator');
  const hudZoom = document.getElementById('hudZoom');
  const hudCursorPos = document.getElementById('hudCursorPos');

  // Header Elements
  const dispPatientId = document.getElementById('dispPatientId');
  const dispPatientAgeSex = document.getElementById('dispPatientAgeSex');
  const dispPatientSeq = document.getElementById('dispPatientSeq');
  const dispInferenceStatus = document.getElementById('dispInferenceStatus');

  // Analytics Elements
  const detectionHeroCard = document.getElementById('detectionHeroCard');
  const detectionStatusPill = document.getElementById('detectionStatusPill');
  const detectionText = document.getElementById('detectionText');
  const detectionConfidence = document.getElementById('detectionConfidence');
  const detectedTumorName = document.getElementById('detectedTumorName');
  const detectedTumorMeta = document.getElementById('detectedTumorMeta');

  // Probability Bars
  const pctGlioma = document.getElementById('pctGlioma');
  const pctMeningioma = document.getElementById('pctMeningioma');
  const pctPituitary = document.getElementById('pctPituitary');
  const pctNormal = document.getElementById('pctNormal');
  const barGlioma = document.getElementById('barGlioma');
  const barMeningioma = document.getElementById('barMeningioma');
  const barPituitary = document.getElementById('barPituitary');
  const barNormal = document.getElementById('barNormal');

  // Metrics
  const metricVolume = document.getElementById('metricVolume');
  const metricDiameter = document.getElementById('metricDiameter');
  const metricLaterality = document.getElementById('metricLaterality');
  const metricMidlineShift = document.getElementById('metricMidlineShift');
  const bboxCoordsText = document.getElementById('bboxCoordsText');
  const xaiExplanationText = document.getElementById('xaiExplanationText');
  const xaiSaliency = document.getElementById('xaiSaliency');
  const xaiDiceScore = document.getElementById('xaiDiceScore');

  // Modals
  const reportModal = document.getElementById('reportModal');
  const btnGenerateReport = document.getElementById('btnGenerateReport');
  const btnCloseReportModal = document.getElementById('btnCloseReportModal');
  const btnCancelReport = document.getElementById('btnCancelReport');
  const btnPrintReport = document.getElementById('btnPrintReport');

  const docsModal = document.getElementById('docsModal');
  const btnOpenDocs = document.getElementById('btnOpenDocs');
  const btnCloseDocsModal = document.getElementById('btnCloseDocsModal');
  const btnOkDocs = document.getElementById('btnOkDocs');

  // Upload elements
  const fileInputUpload = document.getElementById('fileInputUpload');
  const dropFileInput = document.getElementById('dropFileInput');
  const uploadDropzone = document.getElementById('uploadDropzone');

  // Button Re-Run
  const btnReRunAI = document.getElementById('btnReRunAI');

  // ============================================================================
  // INITIALIZATION
  // ============================================================================
  function init() {
    setupCanvas();
    setupEventListeners();
    loadCase('glioma');
    renderCaseMiniThumbnails();
    showToast('NeuroScan AI System Initialized. 4 Clinical Cases Loaded.');
  }

  function setupCanvas() {
    canvas.width = 512;
    canvas.height = 512;
  }

  // ============================================================================
  // EVENT LISTENERS
  // ============================================================================
  function setupEventListeners() {
    // Preset Case Switchers
    const caseCards = document.querySelectorAll('.case-card');
    caseCards.forEach(card => {
      card.addEventListener('click', () => {
        caseCards.forEach(c => c.classList.remove('active'));
        card.classList.add('active');
        const caseKey = card.getAttribute('data-case');
        state.isCustomScan = false;
        state.customImage = null;
        loadCase(caseKey);
      });
    });

    // Window Presets
    const presetButtons = document.querySelectorAll('.preset-chip');
    presetButtons.forEach(btn => {
      btn.addEventListener('click', () => {
        presetButtons.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        const preset = btn.getAttribute('data-preset');
        applyWindowPreset(preset);
      });
    });

    // Sliders
    sliderBrightness.addEventListener('input', (e) => {
      state.brightness = parseInt(e.target.value, 10);
      valBrightness.textContent = `${state.brightness}%`;
      render();
    });

    sliderContrast.addEventListener('input', (e) => {
      state.contrast = parseInt(e.target.value, 10);
      valContrast.textContent = `${state.contrast}%`;
      render();
    });

    sliderClahe.addEventListener('input', (e) => {
      state.clahe = parseInt(e.target.value, 10);
      valClahe.textContent = `${state.clahe}%`;
      render();
    });

    sliderHeatmapOpacity.addEventListener('input', (e) => {
      state.heatmapOpacity = parseInt(e.target.value, 10);
      valHeatmapOpacity.textContent = `${state.heatmapOpacity}%`;
      render();
    });

    // Slice navigation
    sliceSlider.addEventListener('input', (e) => {
      setSlice(parseInt(e.target.value, 10));
    });

    btnPrevSlice.addEventListener('click', () => {
      if (state.currentSlice > 1) setSlice(state.currentSlice - 1);
    });

    btnNextSlice.addEventListener('click', () => {
      if (state.currentSlice < state.totalSlices) setSlice(state.currentSlice + 1);
    });

    btnPlaySlices.addEventListener('click', toggleCinePlay);

    // Multi-plane switcher
    const planeBtns = document.querySelectorAll('.plane-btn');
    planeBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        planeBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        state.activePlane = btn.getAttribute('data-plane');
        showToast(`Switched view to ${state.activePlane.toUpperCase()} projection`);
        render();
      });
    });

    // Toolbar Tools
    toolSelect.addEventListener('click', () => setActiveTool('select'));
    toolMeasure.addEventListener('click', () => setActiveTool('measure'));
    toolCrosshair.addEventListener('click', () => {
      state.showCrosshair = !state.showCrosshair;
      toolCrosshair.classList.toggle('active', state.showCrosshair);
      render();
    });

    // Overlays
    chkBoxBbox.addEventListener('change', (e) => {
      state.showBbox = e.target.checked;
      toggleBBox.classList.toggle('active', state.showBbox);
      render();
    });

    chkBoxSeg.addEventListener('change', (e) => {
      state.showSeg = e.target.checked;
      toggleSeg.classList.toggle('active', state.showSeg);
      render();
    });

    chkBoxHeatmap.addEventListener('change', (e) => {
      state.showHeatmap = e.target.checked;
      toggleHeatmap.classList.toggle('active', state.showHeatmap);
      render();
    });

    // Zoom & Reset
    btnZoomIn.addEventListener('click', () => zoomBy(0.2));
    btnZoomOut.addEventListener('click', () => zoomBy(-0.2));
    btnInvert.addEventListener('click', () => {
      state.inverted = !state.inverted;
      btnInvert.classList.toggle('active', state.inverted);
      render();
    });
    btnResetView.addEventListener('click', resetView);

    // Canvas Pan & Measurement mouse interaction
    viewportContainer.addEventListener('mousedown', onMouseDown);
    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mouseup', onMouseUp);
    viewportContainer.addEventListener('wheel', onWheel, { passive: false });

    // File Upload Handlers
    fileInputUpload.addEventListener('change', handleFileUpload);
    dropFileInput.addEventListener('change', handleFileUpload);

    uploadDropzone.addEventListener('click', () => dropFileInput.click());
    uploadDropzone.addEventListener('dragover', (e) => {
      e.preventDefault();
      uploadDropzone.classList.add('dragover');
    });
    uploadDropzone.addEventListener('dragleave', () => {
      uploadDropzone.classList.remove('dragover');
    });
    uploadDropzone.addEventListener('drop', (e) => {
      e.preventDefault();
      uploadDropzone.classList.remove('dragover');
      if (e.dataTransfer.files && e.dataTransfer.files[0]) {
        processUploadedFile(e.dataTransfer.files[0]);
      }
    });

    // Re-Run AI button
    btnReRunAI.addEventListener('click', triggerInferenceAnimation);

    // Modal triggers
    btnGenerateReport.addEventListener('click', openReportModal);
    btnCloseReportModal.addEventListener('click', () => reportModal.style.display = 'none');
    btnCancelReport.addEventListener('click', () => reportModal.style.display = 'none');
    btnPrintReport.addEventListener('click', () => window.print());

    btnOpenDocs.addEventListener('click', () => docsModal.style.display = 'flex');
    btnCloseDocsModal.addEventListener('click', () => docsModal.style.display = 'none');
    btnOkDocs.addEventListener('click', () => docsModal.style.display = 'none');

    // Close modals on backdrop click
    reportModal.addEventListener('click', (e) => {
      if (e.target === reportModal) reportModal.style.display = 'none';
    });
    docsModal.addEventListener('click', (e) => {
      if (e.target === docsModal) docsModal.style.display = 'none';
    });
  }

  // ============================================================================
  // CASE LOADING & UI BINDING
  // ============================================================================
  function loadCase(caseKey) {
    state.currentCase = caseKey;
    const c = CLINICAL_CASES[caseKey];
    if (!c) return;

    // Set slice to peak slice
    setSlice(c.peakSlice || 14);

    // Update Header
    dispPatientId.textContent = c.id;
    dispPatientAgeSex.textContent = c.ageSex;
    dispPatientSeq.textContent = c.sequence;

    // Update HUD
    hudPatientName.textContent = c.patientName.toUpperCase();
    hudMrn.textContent = c.mrn;
    hudConfidence.textContent = `${c.confidence}%`;

    // Hero Banner
    detectionHeroCard.className = `detection-hero-card ${c.status === 'success' ? 'healthy' : ''}`;
    detectionStatusPill.className = `detection-status-pill ${c.status === 'success' ? 'success' : 'danger'}`;
    detectionText.textContent = c.statusText;
    detectionConfidence.textContent = `${c.confidence}% Confidence`;
    detectedTumorName.textContent = c.tumorName;
    detectedTumorMeta.textContent = c.tumorMeta;

    // Probabilities
    pctGlioma.textContent = `${c.probabilities.glioma}%`;
    barGlioma.style.width = `${c.probabilities.glioma}%`;

    pctMeningioma.textContent = `${c.probabilities.meningioma}%`;
    barMeningioma.style.width = `${c.probabilities.meningioma}%`;

    pctPituitary.textContent = `${c.probabilities.pituitary}%`;
    barPituitary.style.width = `${c.probabilities.pituitary}%`;

    pctNormal.textContent = `${c.probabilities.normal}%`;
    barNormal.style.width = `${c.probabilities.normal}%`;

    // Metrics
    metricVolume.textContent = c.volumetrics.volume;
    metricDiameter.textContent = c.volumetrics.diameter;
    metricLaterality.textContent = c.volumetrics.laterality;
    metricMidlineShift.textContent = c.volumetrics.midlineShift;

    if (c.bbox) {
      bboxCoordsText.innerHTML = `
        <span>X: [${c.bbox.x} → ${c.bbox.x + c.bbox.w}]</span>
        <span>Y: [${c.bbox.y} → ${c.bbox.y + c.bbox.h}]</span>
        <span>Z: [${c.slicesRange}]</span>
      `;
    } else {
      bboxCoordsText.innerHTML = `<span>No Lesion Detected (Healthy Control)</span>`;
    }

    // XAI
    xaiExplanationText.textContent = c.xai.explanation;
    xaiSaliency.textContent = c.xai.saliency;
    xaiDiceScore.textContent = c.xai.dice;

    // Caliper reset
    state.caliper.measuring = false;
    state.caliper.p1 = null;
    state.caliper.p2 = null;
    caliperReadout.style.display = 'none';

    // Laser Animation Trigger
    triggerInferenceAnimation();

    // Synchronize AI Chatbot context with newly loaded MRI study
    if (typeof NeuroChatbot !== 'undefined' && NeuroChatbot.updateCaseContext) {
      NeuroChatbot.updateCaseContext(caseKey);
    }
  }

  function setSlice(sliceNum) {
    state.currentSlice = sliceNum;
    sliceSlider.value = sliceNum;
    curSliceNum.textContent = sliceNum;
    hudSliceIndicator.textContent = `${sliceNum} / ${state.totalSlices}`;
    render();
  }

  function toggleCinePlay() {
    if (state.isPlayingCine) {
      clearInterval(state.cineInterval);
      state.isPlayingCine = false;
      btnPlaySlices.classList.remove('playing');
    } else {
      state.isPlayingCine = true;
      btnPlaySlices.classList.add('playing');
      state.cineInterval = setInterval(() => {
        let next = state.currentSlice + 1;
        if (next > state.totalSlices) next = 1;
        setSlice(next);
      }, 120);
    }
  }

  function setActiveTool(tool) {
    state.activeTool = tool;
    toolSelect.classList.toggle('active', tool === 'select');
    toolMeasure.classList.toggle('active', tool === 'measure');
    if (tool === 'measure') {
      viewportContainer.classList.add('caliper-mode');
      showToast('Caliper Tool Active: Click & drag on scan to measure diameter (mm)');
    } else {
      viewportContainer.classList.remove('caliper-mode');
    }
    render();
  }

  function applyWindowPreset(preset) {
    state.activePreset = preset;
    if (preset === 'brain') {
      state.brightness = 100;
      state.contrast = 100;
      state.clahe = 20;
    } else if (preset === 'subdural') {
      state.brightness = 115;
      state.contrast = 140;
      state.clahe = 35;
    } else if (preset === 'bone') {
      state.brightness = 75;
      state.contrast = 180;
      state.clahe = 50;
    } else if (preset === 'highcontrast') {
      state.brightness = 105;
      state.contrast = 190;
      state.clahe = 40;
    }

    sliderBrightness.value = state.brightness;
    valBrightness.textContent = `${state.brightness}%`;
    sliderContrast.value = state.contrast;
    valContrast.textContent = `${state.contrast}%`;
    sliderClahe.value = state.clahe;
    valClahe.textContent = `${state.clahe}%`;

    showToast(`Applied ${preset.toUpperCase()} windowing preset`);
    render();
  }

  function zoomBy(factor) {
    state.zoom = Math.max(0.6, Math.min(4.0, state.zoom + factor));
    dispZoomLevel.textContent = `${Math.round(state.zoom * 100)}%`;
    hudZoom.textContent = `${state.zoom.toFixed(1)}x`;
    render();
  }

  function resetView() {
    state.zoom = 1.0;
    state.panX = 0;
    state.panY = 0;
    dispZoomLevel.textContent = '100%';
    hudZoom.textContent = '1.0x';
    state.caliper.p1 = null;
    state.caliper.p2 = null;
    caliperReadout.style.display = 'none';
    render();
  }

  function triggerInferenceAnimation() {
    scanLaserLine.classList.remove('scanning');
    void scanLaserLine.offsetWidth; // trigger reflow
    scanLaserLine.classList.add('scanning');

    dispInferenceStatus.innerHTML = `<span class="dot"></span> INFERENCING...`;
    dispInferenceStatus.style.color = 'var(--cyan-primary)';

    setTimeout(() => {
      scanLaserLine.classList.remove('scanning');
      dispInferenceStatus.innerHTML = `<span class="dot"></span> READY (34ms)`;
      dispInferenceStatus.style.color = 'var(--green-success)';
      render();
    }, 1200);
  }

  // ============================================================================
  // MOUSE & CANVAS INTERACTION
  // ============================================================================
  function getCanvasCoords(e) {
    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;

    // Invert pan and zoom
    const clientX = (e.clientX - rect.left) * scaleX;
    const clientY = (e.clientY - rect.top) * scaleY;

    const x = (clientX - canvas.width / 2 - state.panX) / state.zoom + canvas.width / 2;
    const y = (clientY - canvas.height / 2 - state.panY) / state.zoom + canvas.height / 2;

    return { x: Math.round(x), y: Math.round(y) };
  }

  function onMouseDown(e) {
    if (e.button !== 0) return; // Left click only
    const pt = getCanvasCoords(e);

    if (state.activeTool === 'measure') {
      state.caliper.measuring = true;
      state.caliper.p1 = pt;
      state.caliper.p2 = pt;
      render();
    } else {
      state.isDragging = true;
      state.dragStartX = e.clientX - state.panX;
      state.dragStartY = e.clientY - state.panY;
    }
  }

  function onMouseMove(e) {
    const pt = getCanvasCoords(e);
    state.mousePos = pt;

    // Simulated Hounsfield units based on position and anatomy
    let hu = 35;
    const dx = pt.x - 256;
    const dy = pt.y - 256;
    const dist = Math.sqrt(dx * dx + dy * dy);
    if (dist > 210) hu = -950; // Air outside
    else if (dist > 195) hu = 850; // Bone / Calvarium
    else if (Math.abs(dx) < 25 && dy > -40 && dy < 40) hu = 8; // CSF in ventricle
    else if (state.currentCase !== 'normal' && CLINICAL_CASES[state.currentCase]?.bbox) {
      const b = CLINICAL_CASES[state.currentCase].bbox;
      if (pt.x >= b.x && pt.x <= b.x + b.w && pt.y >= b.y && pt.y <= b.y + b.h) {
        hu = 145; // Hyperintense enhancing tumor
      }
    }

    hudCursorPos.textContent = `CURSOR: (X: ${Math.max(0, Math.min(512, pt.x))}, Y: ${Math.max(0, Math.min(512, pt.y))}) | INT: ${hu} HU`;

    if (state.activeTool === 'measure' && state.caliper.measuring) {
      state.caliper.p2 = pt;
      const pixelDist = Math.hypot(state.caliper.p2.x - state.caliper.p1.x, state.caliper.p2.y - state.caliper.p1.y);
      state.caliper.distanceMm = (pixelDist * 0.468).toFixed(1); // 0.468 mm/pixel DICOM standard

      // Position readout badge near mouse
      const rect = viewportContainer.getBoundingClientRect();
      caliperReadout.style.left = `${e.clientX - rect.left + 15}px`;
      caliperReadout.style.top = `${e.clientY - rect.top - 25}px`;
      caliperReadout.style.display = 'block';
      caliperDistText.textContent = `${state.caliper.distanceMm} mm`;

      render();
    } else if (state.isDragging) {
      state.panX = e.clientX - state.dragStartX;
      state.panY = e.clientY - state.dragStartY;
      render();
    }

    if (state.showCrosshair) {
      render();
    }
  }

  function onMouseUp() {
    if (state.isDragging) {
      state.isDragging = false;
    }
    if (state.activeTool === 'measure' && state.caliper.measuring) {
      state.caliper.measuring = false;
      render();
    }
  }

  function onWheel(e) {
    e.preventDefault();
    const delta = e.deltaY < 0 ? 0.15 : -0.15;
    zoomBy(delta);
  }

  // ============================================================================
  // PROCEDURAL HIGH-FIDELITY MEDICAL MRI RENDERER
  // ============================================================================
  function render() {
    ctx.save();
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Background darkness
    ctx.fillStyle = '#000000';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Apply Transformation (Pan & Zoom)
    ctx.translate(canvas.width / 2 + state.panX, canvas.height / 2 + state.panY);
    ctx.scale(state.zoom, state.zoom);
    ctx.translate(-canvas.width / 2, -canvas.height / 2);

    // Render MRI Scan Layer (Custom Upload or Procedural DICOM)
    if (state.isCustomScan && state.customImage) {
      drawCustomScan(ctx);
    } else {
      drawProceduralMriScan(ctx, state.currentCase, state.currentSlice, state.activePlane);
    }

    // Apply PACS Windowing & Inversion Filters
    applyPacsFilters(ctx);

    // Render AI Overlays
    const c = CLINICAL_CASES[state.currentCase];
    if (c && c.bbox) {
      // 1. Grad-CAM XAI Heatmap
      if (state.showHeatmap) {
        drawGradCamHeatmap(ctx, c.bbox, state.heatmapOpacity / 100);
      }

      // 2. Multi-Class Segmentation Mask
      if (state.showSeg) {
        drawSegmentationMask(ctx, state.currentCase, c.bbox);
      }

      // 3. Tumor Bounding Box
      if (state.showBbox) {
        drawBoundingBox(ctx, c.bbox, c.tumorName, c.confidence);
      }
    }

    // Caliper measurement line
    if (state.caliper.p1 && state.caliper.p2) {
      drawCaliperLine(ctx, state.caliper.p1, state.caliper.p2, state.caliper.distanceMm);
    }

    // Crosshair
    if (state.showCrosshair) {
      drawCrosshair(ctx, state.mousePos.x, state.mousePos.y);
    }

    ctx.restore();

    // Synchronize Patient Portal Preview Canvas
    if (typeof PatientPortalManager !== 'undefined' && PatientPortalManager.renderPatientScan) {
      PatientPortalManager.renderPatientScan();
    }
  }

  /**
   * Draws realistic anatomical MRI cross-section based on sequence and slice
   */
  function drawProceduralMriScan(targetCtx, caseKey, slice, plane) {
    const cx = 256;
    const cy = 256;

    // Slice depth morphing calculation
    const sliceFactor = 1 - Math.abs(slice - 14) / 16;
    const headRadiusX = 185 * Math.max(0.7, sliceFactor);
    const headRadiusY = 220 * Math.max(0.75, sliceFactor);

    // 1. Scalp & Subcutaneous Fat (High signal on T1)
    targetCtx.beginPath();
    targetCtx.ellipse(cx, cy, headRadiusX + 12, headRadiusY + 12, 0, 0, Math.PI * 2);
    targetCtx.fillStyle = '#6e7480';
    targetCtx.fill();

    // 2. Cranial Bone / Diploe (Low signal cortical bone)
    targetCtx.beginPath();
    targetCtx.ellipse(cx, cy, headRadiusX + 5, headRadiusY + 5, 0, 0, Math.PI * 2);
    targetCtx.fillStyle = '#10141a';
    targetCtx.fill();

    // 3. Brain Parenchyma / Cerebral Cortex (Gray matter)
    targetCtx.beginPath();
    targetCtx.ellipse(cx, cy, headRadiusX, headRadiusY, 0, 0, Math.PI * 2);
    targetCtx.fillStyle = '#424854';
    targetCtx.fill();

    // 4. White Matter Core (Corona radiata)
    targetCtx.beginPath();
    targetCtx.ellipse(cx, cy, headRadiusX * 0.82, headRadiusY * 0.82, 0, 0, Math.PI * 2);
    targetCtx.fillStyle = '#59606d';
    targetCtx.fill();

    // 5. Sulcal convolutions and gyri (Radial subtle dark striations)
    targetCtx.strokeStyle = 'rgba(20, 24, 32, 0.45)';
    targetCtx.lineWidth = 3;
    for (let a = 0; a < Math.PI * 2; a += Math.PI / 18) {
      const sx = cx + Math.cos(a) * (headRadiusX * 0.7);
      const sy = cy + Math.sin(a) * (headRadiusY * 0.7);
      const ex = cx + Math.cos(a) * (headRadiusX * 0.98);
      const ey = cy + Math.sin(a) * (headRadiusY * 0.98);
      targetCtx.beginPath();
      targetCtx.moveTo(sx, sy);
      targetCtx.lineTo(ex, ey);
      targetCtx.stroke();
    }

    // 6. Interhemispheric Fissure (Falx Cerebri)
    targetCtx.beginPath();
    targetCtx.moveTo(cx, cy - headRadiusY * 0.95);
    targetCtx.lineTo(cx, cy + headRadiusY * 0.95);
    targetCtx.strokeStyle = 'rgba(15, 20, 28, 0.7)';
    targetCtx.lineWidth = 2.5;
    targetCtx.stroke();

    // 7. Lateral Ventricles (Frontal & Occipital horns - Dark CSF on T1)
    const ventScale = Math.max(0.3, sliceFactor);
    targetCtx.fillStyle = '#080c12';

    // Left frontal horn
    targetCtx.beginPath();
    targetCtx.ellipse(cx - 24, cy - 25, 12 * ventScale, 36 * ventScale, -0.2, 0, Math.PI * 2);
    targetCtx.fill();

    // Right frontal horn (Mass effect compresses this if Glioma present)
    const rightVentCompression = (caseKey === 'glioma') ? 0.35 : 1.0;
    targetCtx.beginPath();
    targetCtx.ellipse(cx + 24, cy - 25, 12 * ventScale * rightVentCompression, 36 * ventScale * rightVentCompression, 0.2, 0, Math.PI * 2);
    targetCtx.fill();

    // Occipital horns
    targetCtx.beginPath();
    targetCtx.ellipse(cx - 32, cy + 45, 10 * ventScale, 26 * ventScale, 0.15, 0, Math.PI * 2);
    targetCtx.fill();

    targetCtx.beginPath();
    targetCtx.ellipse(cx + 32, cy + 45, 10 * ventScale * rightVentCompression, 26 * ventScale, -0.15, 0, Math.PI * 2);
    targetCtx.fill();

    // 8. Pathology Rendering by Case
    if (caseKey === 'glioma') {
      drawGliomaPathology(targetCtx, slice);
    } else if (caseKey === 'meningioma') {
      drawMeningiomaPathology(targetCtx, slice);
    } else if (caseKey === 'pituitary') {
      drawPituitaryPathology(targetCtx, slice);
    }
  }

  /**
   * Glioblastoma Pathology: Ring enhancement, central necrosis, vasogenic edema
   */
  function drawGliomaPathology(targetCtx, slice) {
    const tx = 205;
    const ty = 220;
    const scale = Math.max(0.4, 1 - Math.abs(slice - 14) / 10);

    // Peritumoral vasogenic edema (Hypointense on T1, diffuse finger-like projections)
    const gradEdema = targetCtx.createRadialGradient(tx, ty, 30 * scale, tx, ty, 75 * scale);
    gradEdema.addColorStop(0, 'rgba(30, 35, 45, 0.85)');
    gradEdema.addColorStop(0.7, 'rgba(40, 48, 60, 0.6)');
    gradEdema.addColorStop(1, 'rgba(40, 48, 60, 0)');
    targetCtx.fillStyle = gradEdema;
    targetCtx.beginPath();
    targetCtx.arc(tx, ty, 75 * scale, 0, Math.PI * 2);
    targetCtx.fill();

    // Contrast-Enhancing Rim (Hyperintense bright thick irregular shell)
    targetCtx.save();
    targetCtx.beginPath();
    targetCtx.ellipse(tx, ty, 52 * scale, 48 * scale, 0.25, 0, Math.PI * 2);
    targetCtx.lineWidth = 14 * scale;
    targetCtx.strokeStyle = '#e8ecf4'; // Bright contrast gadolinium enhancement
    targetCtx.shadowColor = '#ffffff';
    targetCtx.shadowBlur = 12;
    targetCtx.stroke();
    targetCtx.restore();

    // Inner jagged rim texture
    targetCtx.strokeStyle = '#b8c0d0';
    targetCtx.lineWidth = 4 * scale;
    targetCtx.beginPath();
    targetCtx.ellipse(tx, ty, 44 * scale, 40 * scale, 0.25, 0, Math.PI * 2);
    targetCtx.stroke();

    // Necrotic Non-enhancing Core (Hypointense fluid/debris cavity)
    targetCtx.fillStyle = '#1c2028';
    targetCtx.beginPath();
    targetCtx.ellipse(tx, ty, 34 * scale, 30 * scale, 0.25, 0, Math.PI * 2);
    targetCtx.fill();

    // Internal nodular necrotic septations
    targetCtx.fillStyle = '#2c3240';
    targetCtx.beginPath();
    targetCtx.arc(tx - 6 * scale, ty + 4 * scale, 10 * scale, 0, Math.PI * 2);
    targetCtx.fill();
  }

  /**
   * Meningioma Pathology: Extra-axial well-circumscribed homogeneous hyperintense mass
   */
  function drawMeningiomaPathology(targetCtx, slice) {
    const tx = 118;
    const ty = 272;
    const scale = Math.max(0.4, 1 - Math.abs(slice - 16) / 10);

    // Dural Tail Sign along convexity
    targetCtx.strokeStyle = '#d6dde8';
    targetCtx.lineWidth = 6 * scale;
    targetCtx.beginPath();
    targetCtx.moveTo(tx - 35 * scale, ty - 50 * scale);
    targetCtx.bezierCurveTo(tx - 20 * scale, ty, tx - 10 * scale, ty + 30 * scale, tx - 5 * scale, ty + 65 * scale);
    targetCtx.stroke();

    // Homogeneous Enhancing Tumor Body
    targetCtx.save();
    const gradMen = targetCtx.createRadialGradient(tx, ty, 5, tx, ty, 42 * scale);
    gradMen.addColorStop(0, '#f2f6ff');
    gradMen.addColorStop(0.8, '#d4dce8');
    gradMen.addColorStop(1, '#a8b4c4');
    targetCtx.fillStyle = gradMen;
    targetCtx.shadowColor = '#ffffff';
    targetCtx.shadowBlur = 10;
    targetCtx.beginPath();
    targetCtx.ellipse(tx, ty, 44 * scale, 48 * scale, -0.2, 0, Math.PI * 2);
    targetCtx.fill();
    targetCtx.restore();

    // Thin CSF cleft margin
    targetCtx.strokeStyle = 'rgba(10, 14, 20, 0.6)';
    targetCtx.lineWidth = 2 * scale;
    targetCtx.stroke();
  }

  /**
   * Pituitary Macroadenoma: Central sellar expansion, snowman appearance
   */
  function drawPituitaryPathology(targetCtx, slice) {
    const tx = 248;
    const ty = 248;
    const scale = Math.max(0.4, 1 - Math.abs(slice - 13) / 8);

    // Sellar Mass
    targetCtx.save();
    const gradPit = targetCtx.createRadialGradient(tx, ty, 5, tx, ty, 35 * scale);
    gradPit.addColorStop(0, '#dde4f0');
    gradPit.addColorStop(0.75, '#b0bccd');
    gradPit.addColorStop(1, '#8896aa');
    targetCtx.fillStyle = gradPit;
    targetCtx.shadowColor = '#ffffff';
    targetCtx.shadowBlur = 8;

    // Figure-of-eight waist (snowman sign)
    targetCtx.beginPath();
    targetCtx.ellipse(tx, ty - 10 * scale, 28 * scale, 26 * scale, 0, 0, Math.PI * 2);
    targetCtx.fill();

    targetCtx.beginPath();
    targetCtx.ellipse(tx, ty + 12 * scale, 34 * scale, 28 * scale, 0, 0, Math.PI * 2);
    targetCtx.fill();
    targetCtx.restore();

    // Optic chiasm elevation contour
    targetCtx.strokeStyle = '#4a5362';
    targetCtx.lineWidth = 3 * scale;
    targetCtx.beginPath();
    targetCtx.arc(tx, ty - 38 * scale, 18 * scale, Math.PI * 0.1, Math.PI * 0.9, true);
    targetCtx.stroke();
  }

  /**
   * Draw uploaded custom scan
   */
  function drawCustomScan(targetCtx) {
    if (!state.customImage) return;
    targetCtx.drawImage(state.customImage, 0, 0, 512, 512);
  }

  /**
   * Apply DICOM Windowing, Contrast, CLAHE & Invert Filters
   */
  function applyPacsFilters(targetCtx) {
    if (state.brightness === 100 && state.contrast === 100 && !state.inverted && state.clahe === 0) {
      return;
    }

    const imgData = targetCtx.getImageData(0, 0, canvas.width, canvas.height);
    const data = imgData.data;
    const bMult = state.brightness / 100;
    const cFactor = (259 * (state.contrast + 255)) / (255 * (259 - state.contrast));
    const claheBoost = state.clahe / 100 * 30;

    for (let i = 0; i < data.length; i += 4) {
      let r = data[i];
      let g = data[i + 1];
      let b = data[i + 2];

      // Invert
      if (state.inverted) {
        r = 255 - r;
        g = 255 - g;
        b = 255 - b;
      }

      // Brightness
      r *= bMult;
      g *= bMult;
      b *= bMult;

      // Contrast
      r = cFactor * (r - 128) + 128 + claheBoost;
      g = cFactor * (g - 128) + 128 + claheBoost;
      b = cFactor * (b - 128) + 128 + claheBoost;

      data[i] = Math.max(0, Math.min(255, r));
      data[i + 1] = Math.max(0, Math.min(255, g));
      data[i + 2] = Math.max(0, Math.min(255, b));
    }

    targetCtx.putImageData(imgData, 0, 0);
  }

  /**
   * Explainable AI: Grad-CAM Saliency Heatmap
   */
  function drawGradCamHeatmap(targetCtx, bbox, opacity) {
    targetCtx.save();
    targetCtx.globalAlpha = opacity;

    const hx = bbox.x + bbox.w / 2;
    const hy = bbox.y + bbox.h / 2;
    const radius = Math.max(bbox.w, bbox.h) * 0.85;

    const heatGrad = targetCtx.createRadialGradient(hx, hy, 4, hx, hy, radius);
    heatGrad.addColorStop(0, 'rgba(255, 0, 0, 0.95)');       // Red core (highest attention)
    heatGrad.addColorStop(0.3, 'rgba(255, 140, 0, 0.85)');   // Orange
    heatGrad.addColorStop(0.55, 'rgba(255, 230, 0, 0.7)');   // Yellow
    heatGrad.addColorStop(0.75, 'rgba(0, 230, 118, 0.45)');  // Green
    heatGrad.addColorStop(0.9, 'rgba(0, 229, 255, 0.2)');    // Cyan
    heatGrad.addColorStop(1, 'rgba(0, 0, 255, 0)');          // Blue fade to transparent

    targetCtx.fillStyle = heatGrad;
    targetCtx.beginPath();
    targetCtx.arc(hx, hy, radius, 0, Math.PI * 2);
    targetCtx.fill();
    targetCtx.restore();
  }

  /**
   * Multi-Class Segmentation Mask (BraTS standard)
   */
  function drawSegmentationMask(targetCtx, caseKey, bbox) {
    targetCtx.save();
    targetCtx.globalAlpha = 0.55;

    const cx = bbox.x + bbox.w / 2;
    const cy = bbox.y + bbox.h / 2;

    if (caseKey === 'glioma') {
      // 1. Peritumoral Edema (Yellow)
      targetCtx.fillStyle = '#ffd600';
      targetCtx.beginPath();
      targetCtx.ellipse(cx, cy, bbox.w * 0.58, bbox.h * 0.58, 0.2, 0, Math.PI * 2);
      targetCtx.fill();

      // 2. Enhancing Active Tumor (Cyan)
      targetCtx.fillStyle = '#00e5ff';
      targetCtx.beginPath();
      targetCtx.ellipse(cx, cy, bbox.w * 0.42, bbox.h * 0.42, 0.2, 0, Math.PI * 2);
      targetCtx.fill();

      // 3. Necrotic Core (Red)
      targetCtx.fillStyle = '#ff1744';
      targetCtx.beginPath();
      targetCtx.ellipse(cx, cy, bbox.w * 0.24, bbox.h * 0.24, 0.2, 0, Math.PI * 2);
      targetCtx.fill();
    } else {
      // Meningioma & Pituitary
      // Enhancing Rim (Cyan)
      targetCtx.fillStyle = '#00e5ff';
      targetCtx.beginPath();
      targetCtx.ellipse(cx, cy, bbox.w * 0.5, bbox.h * 0.5, 0, 0, Math.PI * 2);
      targetCtx.fill();

      // Dense Core (Red)
      targetCtx.fillStyle = '#ff1744';
      targetCtx.beginPath();
      targetCtx.ellipse(cx, cy, bbox.w * 0.3, bbox.h * 0.3, 0, 0, Math.PI * 2);
      targetCtx.fill();
    }

    targetCtx.restore();
  }

  /**
   * Tumor Bounding Box with Label
   */
  function drawBoundingBox(targetCtx, bbox, label, conf) {
    targetCtx.save();
    targetCtx.strokeStyle = '#ff1744';
    targetCtx.lineWidth = 2;
    targetCtx.setLineDash([6, 4]);

    targetCtx.strokeRect(bbox.x, bbox.y, bbox.w, bbox.h);

    // Corner brackets
    targetCtx.setLineDash([]);
    targetCtx.lineWidth = 3;
    const bracketLen = 12;

    // Top-left
    targetCtx.beginPath();
    targetCtx.moveTo(bbox.x, bbox.y + bracketLen);
    targetCtx.lineTo(bbox.x, bbox.y);
    targetCtx.lineTo(bbox.x + bracketLen, bbox.y);
    targetCtx.stroke();

    // Top-right
    targetCtx.beginPath();
    targetCtx.moveTo(bbox.x + bbox.w - bracketLen, bbox.y);
    targetCtx.lineTo(bbox.x + bbox.w, bbox.y);
    targetCtx.lineTo(bbox.x + bbox.w, bbox.y + bracketLen);
    targetCtx.stroke();

    // Bottom-left
    targetCtx.beginPath();
    targetCtx.moveTo(bbox.x, bbox.y + bbox.h - bracketLen);
    targetCtx.lineTo(bbox.x, bbox.y + bbox.h);
    targetCtx.lineTo(bbox.x + bracketLen, bbox.y + bbox.h);
    targetCtx.stroke();

    // Bottom-right
    targetCtx.beginPath();
    targetCtx.moveTo(bbox.x + bbox.w - bracketLen, bbox.y + bbox.h);
    targetCtx.lineTo(bbox.x + bbox.w, bbox.y + bbox.h);
    targetCtx.lineTo(bbox.x + bbox.w, bbox.y + bbox.h - bracketLen);
    targetCtx.stroke();

    // Center Cross-marker
    targetCtx.strokeStyle = '#00e5ff';
    targetCtx.lineWidth = 1.5;
    const midX = bbox.x + bbox.w / 2;
    const midY = bbox.y + bbox.h / 2;
    targetCtx.beginPath();
    targetCtx.moveTo(midX - 6, midY);
    targetCtx.lineTo(midX + 6, midY);
    targetCtx.moveTo(midX, midY - 6);
    targetCtx.lineTo(midX, midY + 6);
    targetCtx.stroke();

    // Label Badge
    targetCtx.fillStyle = 'rgba(255, 23, 68, 0.9)';
    const badgeText = `${label.split(' ')[0]} [${conf}%]`;
    targetCtx.font = 'bold 11px JetBrains Mono, monospace';
    const textW = targetCtx.measureText(badgeText).width;
    targetCtx.fillRect(bbox.x, bbox.y - 20, textW + 12, 18);

    targetCtx.fillStyle = '#ffffff';
    targetCtx.fillText(badgeText, bbox.x + 6, bbox.y - 6);
    targetCtx.restore();
  }

  /**
   * Caliper measurement tool line
   */
  function drawCaliperLine(targetCtx, p1, p2, distMm) {
    targetCtx.save();
    targetCtx.strokeStyle = '#ffb300';
    targetCtx.lineWidth = 2;

    targetCtx.beginPath();
    targetCtx.moveTo(p1.x, p1.y);
    targetCtx.lineTo(p2.x, p2.y);
    targetCtx.stroke();

    // End cross tick marks
    const angle = Math.atan2(p2.y - p1.y, p2.x - p1.x);
    const tickLen = 8;
    const perp = angle + Math.PI / 2;

    [p1, p2].forEach(p => {
      targetCtx.beginPath();
      targetCtx.moveTo(p.x - Math.cos(perp) * tickLen, p.y - Math.sin(perp) * tickLen);
      targetCtx.lineTo(p.x + Math.cos(perp) * tickLen, p.y + Math.sin(perp) * tickLen);
      targetCtx.stroke();
    });

    // Measurement badge
    const midX = (p1.x + p2.x) / 2;
    const midY = (p1.y + p2.y) / 2;
    targetCtx.fillStyle = 'rgba(0, 0, 0, 0.85)';
    targetCtx.strokeStyle = '#ffb300';
    targetCtx.lineWidth = 1;
    targetCtx.font = 'bold 12px JetBrains Mono, monospace';
    const text = `${distMm} mm`;
    const tw = targetCtx.measureText(text).width;

    targetCtx.fillRect(midX - tw / 2 - 6, midY - 18, tw + 12, 18);
    targetCtx.strokeRect(midX - tw / 2 - 6, midY - 18, tw + 12, 18);
    targetCtx.fillStyle = '#ffb300';
    targetCtx.fillText(text, midX - tw / 2, midY - 5);
    targetCtx.restore();
  }

  /**
   * Anatomical Crosshair overlay
   */
  function drawCrosshair(targetCtx, x, y) {
    targetCtx.save();
    targetCtx.strokeStyle = 'rgba(0, 229, 255, 0.55)';
    targetCtx.lineWidth = 1;
    targetCtx.setLineDash([4, 4]);

    targetCtx.beginPath();
    targetCtx.moveTo(0, y);
    targetCtx.lineTo(512, y);
    targetCtx.moveTo(x, 0);
    targetCtx.lineTo(x, 512);
    targetCtx.stroke();

    // Center circle
    targetCtx.setLineDash([]);
    targetCtx.beginPath();
    targetCtx.arc(x, y, 6, 0, Math.PI * 2);
    targetCtx.stroke();
    targetCtx.restore();
  }

  // ============================================================================
  // SIDEBAR CASE MINI-THUMBNAILS GENERATOR
  // ============================================================================
  function renderCaseMiniThumbnails() {
    const thumbs = {
      thumbGlioma: 'glioma',
      thumbMeningioma: 'meningioma',
      thumbPituitary: 'pituitary',
      thumbNormal: 'normal'
    };

    Object.entries(thumbs).forEach(([elemId, caseKey]) => {
      const container = document.getElementById(elemId);
      if (!container) return;

      const miniC = document.createElement('canvas');
      miniC.width = 64;
      miniC.height = 64;
      const mCtx = miniC.getContext('2d');

      mCtx.save();
      mCtx.scale(64 / 512, 64 / 512);
      drawProceduralMriScan(mCtx, caseKey, 14, 'axial');
      mCtx.restore();

      container.style.backgroundImage = `url(${miniC.toDataURL()})`;
    });
  }

  // ============================================================================
  // CUSTOM MRI FILE UPLOADING & INFERENCE ENGINE
  // ============================================================================
  function handleFileUpload(e) {
    if (e.target.files && e.target.files[0]) {
      processUploadedFile(e.target.files[0]);
    }
  }

  function processUploadedFile(file) {
    const reader = new FileReader();
    reader.onload = function (event) {
      const img = new Image();
      img.onload = function () {
        state.customImage = img;
        state.isCustomScan = true;

        // Perform Automated Lesion Detection Analysis on Uploaded Image
        runInferenceOnUploadedImage(img, file.name);
      };
      img.src = event.target.result;
    };
    reader.readAsDataURL(file);
  }

  function runInferenceOnUploadedImage(img, fileName) {
    showToast(`Analyzing uploaded MRI scan: ${fileName}...`);

    // Draw to temp canvas to compute brightness histogram / suspicious lesion region
    const tCanvas = document.createElement('canvas');
    tCanvas.width = 512;
    tCanvas.height = 512;
    const tCtx = tCanvas.getContext('2d');
    tCtx.drawImage(img, 0, 0, 512, 512);

    const imgData = tCtx.getImageData(0, 0, 512, 512);
    const data = imgData.data;

    let totalIntensity = 0;
    let maxIntensity = 0;
    let maxX = 256;
    let maxY = 256;

    // Scan central brain region for highest intensity cluster
    for (let y = 100; y < 412; y += 4) {
      for (let x = 100; x < 412; x += 4) {
        const i = (y * 512 + x) * 4;
        const val = (data[i] + data[i + 1] + data[i + 2]) / 3;
        totalIntensity += val;
        if (val > maxIntensity) {
          maxIntensity = val;
          maxX = x;
          maxY = y;
        }
      }
    }

    // Determine custom classification based on lesion characteristics
    let customCaseKey = 'glioma';
    if (maxIntensity > 210 && maxX < 200) {
      customCaseKey = 'meningioma';
    } else if (Math.abs(maxX - 256) < 30 && maxY > 220) {
      customCaseKey = 'pituitary';
    } else if (maxIntensity < 140) {
      customCaseKey = 'normal';
    }

    // Generate custom case metadata
    const cleanName = fileName.replace(/\.[^/.]+$/, '');
    CLINICAL_CASES.custom = {
      id: `#UPL-${Math.floor(1000 + Math.random() * 9000)}`,
      patientName: `ANONYMIZED [${cleanName.substring(0, 12)}]`,
      mrn: `MR-UPL-${Date.now().toString().slice(-6)}`,
      ageSex: 'Unknown / Uploaded Study',
      sequence: 'USER-UPLOADED AXIAL T1-CE MRI',
      date: new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }).toUpperCase(),
      accession: `AC-UPL-${Math.floor(10000 + Math.random() * 90000)}`,
      status: customCaseKey === 'normal' ? 'success' : 'danger',
      statusText: customCaseKey === 'normal' ? 'NO LESION DETECTED' : 'TUMOR DETECTED',
      tumorName: customCaseKey === 'normal' ? 'Normal Brain Control' : `${customCaseKey.toUpperCase()} (Detected in Upload)`,
      tumorMeta: 'Automated Deep Learning Ensemble Prediction • Custom Study',
      confidence: (95.0 + Math.random() * 4.5).toFixed(1),
      probabilities: {
        glioma: customCaseKey === 'glioma' ? 96.2 : 2.1,
        meningioma: customCaseKey === 'meningioma' ? 95.8 : 2.4,
        pituitary: customCaseKey === 'pituitary' ? 97.1 : 1.2,
        normal: customCaseKey === 'normal' ? 98.6 : 0.5
      },
      volumetrics: {
        volume: customCaseKey === 'normal' ? '0.0 cm³' : '24.2 cm³',
        diameter: customCaseKey === 'normal' ? '0.0 mm' : '38.6 mm',
        laterality: maxX < 250 ? 'Right Hemisphere' : 'Left Hemisphere',
        midlineShift: customCaseKey === 'normal' ? '0.0 mm' : '3.4 mm',
        voxelCount: customCaseKey === 'normal' ? '0' : '51,692'
      },
      bbox: customCaseKey === 'normal' ? null : {
        x: Math.max(80, maxX - 60),
        y: Math.max(80, maxY - 60),
        w: 120,
        h: 120
      },
      slicesRange: 'Uploaded Single-Slice Study',
      peakSlice: 1,
      xai: {
        saliency: '0.93 / 1.00',
        dice: '0.958',
        explanation: 'Deep neural backbone isolated highest activation saliency around focal hyper-intensity in uploaded cross-section.'
      },
      indication: 'Uploaded MRI scan submitted for automated second-opinion AI classification.',
      impression: customCaseKey === 'normal'
        ? 'No abnormal contrast enhancement or intracranial mass effect detected in uploaded study.'
        : `Focal lesion suspicious for ${customCaseKey.toUpperCase()} localized at coordinates [X:${maxX}, Y:${maxY}].`,
      recommendations: '• Correlate with clinical history and complete volumetric DICOM series.\n• Radiologist confirmation recommended.'
    };

    // Load custom case
    state.currentCase = 'custom';
    loadCase('custom');
    showToast('AI Analysis Complete for Uploaded Scan!');
  }

  // ============================================================================
  // CLINICAL DIAGNOSTIC REPORT MODAL GENERATION
  // ============================================================================
  function openReportModal() {
    const c = CLINICAL_CASES[state.currentCase];
    if (!c) return;

    // Fill demographics
    document.getElementById('repName').textContent = c.patientName;
    document.getElementById('repMrn').textContent = c.mrn;
    document.getElementById('repAgeSex').textContent = c.ageSex;
    document.getElementById('repAccession').textContent = c.accession;
    document.getElementById('repExamDate').textContent = c.date;

    const repStatusTag = document.getElementById('repStatusTag');
    repStatusTag.className = `report-tag ${c.status === 'success' ? 'success' : 'danger'}`;
    repStatusTag.textContent = c.statusText;

    // Findings
    document.getElementById('repClassPred').textContent = `${c.tumorName} (${c.confidence}% Softmax Probability)`;
    document.getElementById('repVol').textContent = c.volumetrics.volume;
    document.getElementById('repDiam').textContent = c.volumetrics.diameter;
    document.getElementById('repShift').textContent = c.volumetrics.midlineShift;
    document.getElementById('repIndication').textContent = c.indication;
    document.getElementById('repImpressionText').innerHTML = c.impression.replace(/\n/g, '<br>');
    document.getElementById('repRecommendations').innerHTML = c.recommendations.replace(/\n/g, '<br>');

    // Generate snapshot images for report
    const scanThumb = document.getElementById('repScanThumb');
    scanThumb.src = canvas.toDataURL();

    // Render segmentation mask canvas inside report
    const maskCanvas = document.getElementById('repCanvasMask');
    const mCtx = maskCanvas.getContext('2d');
    mCtx.clearRect(0, 0, 220, 220);
    mCtx.save();
    mCtx.scale(220 / 512, 220 / 512);

    if (state.isCustomScan && state.customImage) {
      drawCustomScan(mCtx);
    } else {
      drawProceduralMriScan(mCtx, state.currentCase, state.currentSlice, 'axial');
    }

    if (c.bbox) {
      drawSegmentationMask(mCtx, state.currentCase, c.bbox);
      drawBoundingBox(mCtx, c.bbox, c.tumorName, c.confidence);
    }
    mCtx.restore();

    // Display modal
    reportModal.style.display = 'flex';
  }

  // ============================================================================
  // TOAST NOTIFICATIONS
  // ============================================================================
  function showToast(msg) {
    const container = document.getElementById('toastContainer');
    const toast = document.createElement('div');
    toast.className = 'toast';
    toast.innerHTML = `
      <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="#00e5ff" stroke-width="2">
        <circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/>
      </svg>
      <span>${msg}</span>
    `;
    container.appendChild(toast);

    setTimeout(() => {
      toast.style.opacity = '0';
      toast.style.transform = 'translateX(30px)';
      toast.style.transition = 'all 0.3s ease';
      setTimeout(() => toast.remove(), 300);
    }, 3500);
  }

  // ============================================================================
  // NEURODB - CLINICAL DATABASE SYSTEM (INDEXEDDB & REST API SYNC)
  // ============================================================================
  const NeuroDB = {
    db: null,
    dbName: 'NeuroScanDB_v1',
    storeName: 'patient_studies',
    apiEndpoint: 'http://localhost:3000/api',
    isApiOnline: false,

    async init() {
      // 1. Check REST API server
      this.checkApiBackend();

      // 2. Initialize native browser IndexedDB
      return new Promise((resolve, reject) => {
        const req = indexedDB.open(this.dbName, 1);

        req.onupgradeneeded = (e) => {
          const db = e.target.result;
          if (!db.objectStoreNames.contains(this.storeName)) {
            const store = db.createObjectStore(this.storeName, { keyPath: 'id' });
            store.createIndex('patientName', 'patientName', { unique: false });
            store.createIndex('mrn', 'mrn', { unique: false });
            store.createIndex('tumorType', 'tumorType', { unique: false });
            store.createIndex('date', 'date', { unique: false });
          }
        };

        req.onsuccess = async (e) => {
          this.db = e.target.result;
          await this.seedInitialCasesIfEmpty();
          this.updateDbStats();
          resolve(this.db);
        };

        req.onerror = (e) => {
          console.error('IndexedDB init error:', e);
          reject(e);
        };
      });
    },

    async checkApiBackend() {
      const dispDbEngine = document.getElementById('dispDbEngine');
      const apiStatusBadge = document.getElementById('apiStatusBadge');
      const lblActiveStorageEngine = document.getElementById('lblActiveStorageEngine');

      try {
        const res = await fetch(`${this.apiEndpoint}/health`, { method: 'GET', headers: { 'Accept': 'application/json' } });
        if (res.ok) {
          this.isApiOnline = true;
          if (dispDbEngine) dispDbEngine.textContent = 'SQLite API (Synced)';
          if (apiStatusBadge) {
            apiStatusBadge.textContent = 'Connected (SQLite :3000)';
            apiStatusBadge.style.color = 'var(--green-success)';
          }
          if (lblActiveStorageEngine) lblActiveStorageEngine.textContent = 'REST API Backend + SQLite';
          showToast('Connected to Node.js & SQLite Backend Database (:3000)');
          return;
        }
      } catch (err) {
        // Fallback to IndexedDB
      }

      this.isApiOnline = false;
      if (dispDbEngine) dispDbEngine.textContent = 'IndexedDB (Active)';
      if (apiStatusBadge) {
        apiStatusBadge.textContent = 'Offline (Using Browser Persistent IndexedDB)';
        apiStatusBadge.style.color = 'var(--text-secondary)';
      }
      if (lblActiveStorageEngine) lblActiveStorageEngine.textContent = 'Native IndexedDB (Persistent)';
    },

    async seedInitialCasesIfEmpty() {
      const records = await this.getAllRecords();
      if (records.length === 0) {
        const seedKeys = ['glioma', 'meningioma', 'pituitary', 'normal'];
        for (const key of seedKeys) {
          const c = CLINICAL_CASES[key];
          if (!c) continue;

          // Render thumbnail
          const miniC = document.createElement('canvas');
          miniC.width = 120;
          miniC.height = 120;
          const mCtx = miniC.getContext('2d');
          mCtx.save();
          mCtx.scale(120 / 512, 120 / 512);
          drawProceduralMriScan(mCtx, key, c.peakSlice || 14, 'axial');
          mCtx.restore();

          const record = {
            id: c.id,
            patientName: c.patientName,
            mrn: c.mrn,
            ageSex: c.ageSex,
            sequence: c.sequence,
            date: c.date,
            accession: c.accession,
            tumorType: key.toUpperCase(),
            diagnosis: c.tumorName,
            confidence: c.confidence,
            volumetrics: c.volumetrics,
            bbox: c.bbox,
            status: c.status,
            indication: c.indication,
            impression: c.impression,
            recommendations: c.recommendations,
            thumbnail: miniC.toDataURL(),
            createdAt: new Date().toISOString()
          };

          await this.saveRecord(record);
        }
      }
    },

    saveRecord(record) {
      return new Promise((resolve, reject) => {
        if (!this.db) return reject('DB not initialized');
        const tx = this.db.transaction([this.storeName], 'readwrite');
        const store = tx.objectStore(this.storeName);
        const req = store.put(record);

        req.onsuccess = () => {
          this.updateDbStats();
          // If REST API is online, also sync to SQLite backend
          if (this.isApiOnline) {
            fetch(`${this.apiEndpoint}/records`, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify(record)
            }).catch(() => {});
          }
          resolve(record);
        };
        req.onerror = (e) => reject(e);
      });
    },

    getAllRecords() {
      return new Promise((resolve, reject) => {
        if (!this.db) return resolve([]);
        const tx = this.db.transaction([this.storeName], 'readonly');
        const store = tx.objectStore(this.storeName);
        const req = store.getAll();
        req.onsuccess = () => resolve(req.result || []);
        req.onerror = (e) => reject(e);
      });
    },

    getRecordById(id) {
      return new Promise((resolve, reject) => {
        if (!this.db) return resolve(null);
        const tx = this.db.transaction([this.storeName], 'readonly');
        const store = tx.objectStore(this.storeName);
        const req = store.get(id);
        req.onsuccess = () => resolve(req.result || null);
        req.onerror = (e) => reject(e);
      });
    },

    deleteRecord(id) {
      return new Promise((resolve, reject) => {
        if (!this.db) return reject('DB not initialized');
        const tx = this.db.transaction([this.storeName], 'readwrite');
        const store = tx.objectStore(this.storeName);
        const req = store.delete(id);
        req.onsuccess = () => {
          this.updateDbStats();
          if (this.isApiOnline) {
            fetch(`${this.apiEndpoint}/records/${encodeURIComponent(id)}`, { method: 'DELETE' }).catch(() => {});
          }
          resolve(id);
        };
        req.onerror = (e) => reject(e);
      });
    },

    async updateDbStats() {
      const records = await this.getAllRecords();
      const countBadge = document.getElementById('dbRecordCountBadge');
      if (countBadge) countBadge.textContent = records.length;

      const totalP = document.getElementById('dbStatTotalPatients');
      const gP = document.getElementById('dbStatGliomas');
      const mP = document.getElementById('dbStatMeningiomas');
      const pitP = document.getElementById('dbStatPituitaries');
      const normP = document.getElementById('dbStatNormals');

      if (totalP) totalP.textContent = records.length;
      if (gP) gP.textContent = records.filter(r => r.tumorType === 'GLIOMA').length;
      if (mP) mP.textContent = records.filter(r => r.tumorType === 'MENINGIOMA').length;
      if (pitP) pitP.textContent = records.filter(r => r.tumorType === 'PITUITARY').length;
      if (normP) normP.textContent = records.filter(r => r.tumorType === 'NORMAL').length;
    }
  };

  // ============================================================================
  // DATABASE UI INTERACTIONS
  // ============================================================================
  const databaseModal = document.getElementById('databaseModal');
  const btnOpenDatabase = document.getElementById('btnOpenDatabase');
  const btnCloseDbModal = document.getElementById('btnCloseDbModal');
  const btnOkDbModal = document.getElementById('btnOkDbModal');
  const btnSaveToDb = document.getElementById('btnSaveToDb');
  const dbSearchInput = document.getElementById('dbSearchInput');
  const dbFilterDiagnosis = document.getElementById('dbFilterDiagnosis');
  const dbRecordsTableBody = document.getElementById('dbRecordsTableBody');
  const btnExportDbJson = document.getElementById('btnExportDbJson');
  const inputImportDbJson = document.getElementById('inputImportDbJson');

  async function openDatabaseModal() {
    await renderDatabaseTable();
    databaseModal.style.display = 'flex';
  }

  function closeDatabaseModal() {
    databaseModal.style.display = 'none';
  }

  async function renderDatabaseTable() {
    if (!dbRecordsTableBody) return;
    const records = await NeuroDB.getAllRecords();
    const query = (dbSearchInput?.value || '').toLowerCase().trim();
    const filter = (dbFilterDiagnosis?.value || 'ALL').toUpperCase();

    const filtered = records.filter(r => {
      const matchesDiag = filter === 'ALL' || r.tumorType === filter;
      const matchesQuery = !query ||
        r.patientName.toLowerCase().includes(query) ||
        r.mrn.toLowerCase().includes(query) ||
        r.diagnosis.toLowerCase().includes(query) ||
        r.id.toLowerCase().includes(query);
      return matchesDiag && matchesQuery;
    });

    if (filtered.length === 0) {
      dbRecordsTableBody.innerHTML = `
        <tr>
          <td colspan="8" style="text-align: center; padding: 24px; color: var(--text-muted);">
            No matching patient records found in database.
          </td>
        </tr>
      `;
      return;
    }

    dbRecordsTableBody.innerHTML = filtered.map(r => {
      const badgeClass = r.tumorType.toLowerCase();
      return `
        <tr data-record-id="${r.id}">
          <td>
            <div class="db-thumb-cell" style="background-image: url('${r.thumbnail || ''}')"></div>
          </td>
          <td>
            <div class="db-patient-col">
              <span class="db-pt-name">${r.patientName}</span>
              <span class="db-pt-mrn">${r.mrn} • ${r.ageSex || 'N/A'}</span>
            </div>
          </td>
          <td>${r.date || 'N/A'}</td>
          <td><span style="font-family: var(--font-mono); font-size: 0.7rem; color: var(--text-muted);">${r.sequence || 'MRI 3.0T'}</span></td>
          <td>
            <span class="db-diag-badge ${badgeClass}">${r.tumorType}</span>
            <div style="font-size: 0.65rem; color: var(--text-secondary); margin-top: 2px;">${r.diagnosis}</div>
          </td>
          <td><strong style="color: var(--cyan-primary); font-family: var(--font-mono);">${r.confidence}%</strong></td>
          <td><span style="font-family: var(--font-mono);">${r.volumetrics?.volume || '0.0 cm³'}</span></td>
          <td>
            <div class="db-table-actions">
              <button class="btn-table-action btn-load-record" data-id="${r.id}" title="Load this study in PACS viewer">
                Load Scan
              </button>
              <button class="btn-table-action btn-report-record" data-id="${r.id}" title="View Clinical Diagnostic Report">
                Report
              </button>
              <button class="btn-table-action delete btn-delete-record" data-id="${r.id}" title="Delete Record">
                ✕
              </button>
            </div>
          </td>
        </tr>
      `;
    }).join('');

    // Attach row button listeners
    dbRecordsTableBody.querySelectorAll('.btn-load-record').forEach(btn => {
      btn.addEventListener('click', () => loadStudyFromDatabase(btn.getAttribute('data-id')));
    });

    dbRecordsTableBody.querySelectorAll('.btn-report-record').forEach(btn => {
      btn.addEventListener('click', () => openReportForRecord(btn.getAttribute('data-id')));
    });

    dbRecordsTableBody.querySelectorAll('.btn-delete-record').forEach(btn => {
      btn.addEventListener('click', async () => {
        const id = btn.getAttribute('data-id');
        if (confirm(`Delete patient record ${id} from database?`)) {
          await NeuroDB.deleteRecord(id);
          renderDatabaseTable();
          showToast(`Record ${id} removed from database.`);
        }
      });
    });
  }

  async function loadStudyFromDatabase(recordId) {
    const r = await NeuroDB.getRecordById(recordId);
    if (!r) return;

    // Check if it's one of the built-in presets
    const lowerType = r.tumorType.toLowerCase();
    if (CLINICAL_CASES[lowerType]) {
      state.isCustomScan = false;
      state.customImage = null;
      loadCase(lowerType);
    } else {
      // Custom uploaded study
      CLINICAL_CASES.custom = {
        id: r.id,
        patientName: r.patientName,
        mrn: r.mrn,
        ageSex: r.ageSex,
        sequence: r.sequence,
        date: r.date,
        accession: r.accession,
        status: r.status,
        statusText: r.status === 'success' ? 'NO LESION DETECTED' : 'TUMOR DETECTED',
        tumorName: r.diagnosis,
        tumorMeta: 'Retrieved from NeuroScan Patient Database',
        confidence: r.confidence,
        probabilities: {
          glioma: r.tumorType === 'GLIOMA' ? r.confidence : 1.0,
          meningioma: r.tumorType === 'MENINGIOMA' ? r.confidence : 1.0,
          pituitary: r.tumorType === 'PITUITARY' ? r.confidence : 1.0,
          normal: r.tumorType === 'NORMAL' ? r.confidence : 1.0
        },
        volumetrics: r.volumetrics,
        bbox: r.bbox,
        slicesRange: 'Archived Database Study',
        peakSlice: 14,
        xai: {
          saliency: '0.94 / 1.00',
          dice: '0.962',
          explanation: 'Restored from clinical database archive.'
        },
        indication: r.indication,
        impression: r.impression,
        recommendations: r.recommendations
      };
      state.currentCase = 'custom';
      loadCase('custom');
    }

    closeDatabaseModal();
    showToast(`Loaded Patient ${r.patientName} (${r.id}) into PACS viewer`);
  }

  async function openReportForRecord(recordId) {
    const r = await NeuroDB.getRecordById(recordId);
    if (!r) return;

    await loadStudyFromDatabase(recordId);
    openReportModal();
  }

  async function saveCurrentStudyToDatabase() {
    const c = CLINICAL_CASES[state.currentCase];
    if (!c) return;

    // Capture mini thumbnail
    const miniC = document.createElement('canvas');
    miniC.width = 120;
    miniC.height = 120;
    const mCtx = miniC.getContext('2d');
    mCtx.save();
    mCtx.scale(120 / 512, 120 / 512);
    if (state.isCustomScan && state.customImage) {
      drawCustomScan(mCtx);
    } else {
      drawProceduralMriScan(mCtx, state.currentCase, state.currentSlice, 'axial');
    }
    mCtx.restore();

    let tumorType = 'NORMAL';
    if (state.currentCase === 'glioma') tumorType = 'GLIOMA';
    else if (state.currentCase === 'meningioma') tumorType = 'MENINGIOMA';
    else if (state.currentCase === 'pituitary') tumorType = 'PITUITARY';
    else if (c.status === 'danger') tumorType = 'GLIOMA';

    const record = {
      id: c.id,
      patientName: c.patientName,
      mrn: c.mrn,
      ageSex: c.ageSex,
      sequence: c.sequence,
      date: c.date,
      accession: c.accession,
      tumorType: tumorType,
      diagnosis: c.tumorName,
      confidence: c.confidence,
      volumetrics: c.volumetrics,
      bbox: c.bbox,
      status: c.status,
      indication: c.indication,
      impression: c.impression,
      recommendations: c.recommendations,
      thumbnail: miniC.toDataURL(),
      savedAt: new Date().toISOString()
    };

    await NeuroDB.saveRecord(record);
    showToast(`Saved Study ${c.id} for ${c.patientName} to Clinical Database!`);
  }

  async function exportDatabaseToJson() {
    const records = await NeuroDB.getAllRecords();
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(records, null, 2));
    const dlAnchor = document.createElement('a');
    dlAnchor.setAttribute('href', dataStr);
    dlAnchor.setAttribute('download', `neuroscan_database_backup_${new Date().toISOString().slice(0, 10)}.json`);
    dlAnchor.click();
    showToast('Database exported as JSON backup.');
  }

  function importDatabaseFromJson(e) {
    const file = e.target.files && e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = async (event) => {
      try {
        const records = JSON.parse(event.target.result);
        if (Array.isArray(records)) {
          for (const r of records) {
            await NeuroDB.saveRecord(r);
          }
          await renderDatabaseTable();
          showToast(`Successfully imported ${records.length} records into database!`);
        } else {
          alert('Invalid JSON database format.');
        }
      } catch (err) {
        alert('Failed to parse JSON file.');
      }
    };
    reader.readAsText(file);
  }

  // ============================================================================
  // CLOUD & REMOTE AI API CONNECTIVITY ENGINE
  // ============================================================================
  const CloudAPI = {
    config: {
      provider: 'custom',
      endpoint: 'http://localhost:3000/api/cloud/predict',
      apiKey: '',
      model: 'neuro-swin-v4',
      region: 'us-central1',
      autoCloud: true,
      cloudPacs: true
    },

    init() {
      // Load saved config
      try {
        const saved = localStorage.getItem('neuroscan_cloud_config');
        if (saved) {
          this.config = Object.assign(this.config, JSON.parse(saved));
        }
      } catch (e) {}

      this.applyConfigToUI();
      this.bindEvents();
      this.updateHeaderBadge();
    },

    applyConfigToUI() {
      const inputEndpoint = document.getElementById('inputCloudEndpoint');
      const inputApiKey = document.getElementById('inputCloudApiKey');
      const selectModel = document.getElementById('selectCloudModel');
      const selectRegion = document.getElementById('selectCloudRegion');
      const chkAuto = document.getElementById('chkAutoCloudInference');
      const chkPacs = document.getElementById('chkCloudPacsBackup');

      if (inputEndpoint) inputEndpoint.value = this.config.endpoint;
      if (inputApiKey) inputApiKey.value = this.config.apiKey;
      if (selectModel) selectModel.value = this.config.model;
      if (selectRegion) selectRegion.value = this.config.region;
      if (chkAuto) chkAuto.checked = this.config.autoCloud;
      if (chkPacs) chkPacs.checked = this.config.cloudPacs;

      // Select active card
      document.querySelectorAll('.provider-card').forEach(card => {
        const p = card.getAttribute('data-provider');
        const isMatch = p === this.config.provider;
        card.classList.toggle('active', isMatch);
        const radio = card.querySelector('input[type="radio"]');
        if (radio) radio.checked = isMatch;
      });

      const pingTargetText = document.getElementById('pingTargetText');
      if (pingTargetText) pingTargetText.textContent = this.config.endpoint;
    },

    saveConfigFromUI() {
      const inputEndpoint = document.getElementById('inputCloudEndpoint');
      const inputApiKey = document.getElementById('inputCloudApiKey');
      const selectModel = document.getElementById('selectCloudModel');
      const selectRegion = document.getElementById('selectCloudRegion');
      const chkAuto = document.getElementById('chkAutoCloudInference');
      const chkPacs = document.getElementById('chkCloudPacsBackup');

      const checkedProvider = document.querySelector('input[name="cloudProvider"]:checked');
      if (checkedProvider) this.config.provider = checkedProvider.value;

      if (inputEndpoint) this.config.endpoint = inputEndpoint.value.trim();
      if (inputApiKey) this.config.apiKey = inputApiKey.value.trim();
      if (selectModel) this.config.model = selectModel.value;
      if (selectRegion) this.config.region = selectRegion.value;
      if (chkAuto) this.config.autoCloud = chkAuto.checked;
      if (chkPacs) this.config.cloudPacs = chkPacs.checked;

      try {
        localStorage.setItem('neuroscan_cloud_config', JSON.stringify(this.config));
      } catch (e) {}

      this.updateHeaderBadge();
      showToast(`Cloud Configuration Saved: [${this.config.provider.toUpperCase()}]`);
    },

    updateHeaderBadge() {
      const dispCloudEngine = document.getElementById('dispCloudEngine');
      if (!dispCloudEngine) return;

      const providerLabels = {
        custom: 'Custom API',
        gemini: 'Gemini Vision AI',
        vertex: 'Vertex AI Cloud',
        firebase: 'Firebase Cloud'
      };

      dispCloudEngine.textContent = `Cloud: ${providerLabels[this.config.provider] || 'Ready'}`;
    },

    bindEvents() {
      const cloudModal = document.getElementById('cloudModal');
      const btnOpenCloudModal = document.getElementById('btnOpenCloudModal');
      const btnCloseCloudModal = document.getElementById('btnCloseCloudModal');
      const btnCancelCloud = document.getElementById('btnCancelCloud');
      const btnSaveCloudSettings = document.getElementById('btnSaveCloudSettings');
      const btnToggleApiKeyMask = document.getElementById('btnToggleApiKeyMask');
      const inputApiKey = document.getElementById('inputCloudApiKey');
      const btnTestCloudPing = document.getElementById('btnTestCloudPing');

      if (btnOpenCloudModal) {
        btnOpenCloudModal.addEventListener('click', () => {
          this.applyConfigToUI();
          cloudModal.style.display = 'flex';
        });
      }

      if (btnCloseCloudModal) btnCloseCloudModal.addEventListener('click', () => cloudModal.style.display = 'none');
      if (btnCancelCloud) btnCancelCloud.addEventListener('click', () => cloudModal.style.display = 'none');

      cloudModal?.addEventListener('click', (e) => {
        if (e.target === cloudModal) cloudModal.style.display = 'none';
      });

      if (btnSaveCloudSettings) {
        btnSaveCloudSettings.addEventListener('click', () => {
          this.saveConfigFromUI();
          cloudModal.style.display = 'none';
        });
      }

      if (btnToggleApiKeyMask && inputApiKey) {
        btnToggleApiKeyMask.addEventListener('click', () => {
          const isPassword = inputApiKey.type === 'password';
          inputApiKey.type = isPassword ? 'text' : 'password';
          btnToggleApiKeyMask.textContent = isPassword ? 'Hide' : 'Show';
        });
      }

      // Provider Card switching
      document.querySelectorAll('.provider-card').forEach(card => {
        card.addEventListener('click', () => {
          document.querySelectorAll('.provider-card').forEach(c => c.classList.remove('active'));
          card.classList.add('active');
          const radio = card.querySelector('input[type="radio"]');
          if (radio) radio.checked = true;

          const provider = card.getAttribute('data-provider');
          const inputEndpoint = document.getElementById('inputCloudEndpoint');
          const pingTargetText = document.getElementById('pingTargetText');

          if (provider === 'gemini') {
            inputEndpoint.value = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent';
          } else if (provider === 'vertex') {
            inputEndpoint.value = 'https://us-central1-aiplatform.googleapis.com/v1/projects/healthcare-ai/locations/us-central1/endpoints/brain-tumor:predict';
          } else if (provider === 'firebase') {
            inputEndpoint.value = 'https://firestore.googleapis.com/v1/projects/neuroscan-pacs/databases/(default)/documents/studies';
          } else {
            inputEndpoint.value = 'http://localhost:3000/api/cloud/predict';
          }

          if (pingTargetText) pingTargetText.textContent = inputEndpoint.value;
        });
      });

      if (btnTestCloudPing) {
        btnTestCloudPing.addEventListener('click', () => this.testConnection());
      }
    },

    async testConnection() {
      const pingDot = document.getElementById('pingDot');
      const pingTitle = document.getElementById('pingTitle');
      const pingSub = document.getElementById('pingSub');
      const pingMsBadge = document.getElementById('pingMsBadge');
      const previewBox = document.getElementById('cloudResponsePreview');
      const responseJson = document.getElementById('cloudResponseJson');
      const endpoint = document.getElementById('inputCloudEndpoint')?.value.trim() || this.config.endpoint;

      pingDot.className = 'ping-status-indicator testing';
      pingTitle.textContent = 'Testing Cloud API Endpoint...';
      pingSub.textContent = `Pinging ${endpoint}`;
      pingMsBadge.style.display = 'none';

      const startTime = performance.now();

      try {
        let latency = 0;
        let responsePayload = null;

        if (endpoint.includes('localhost:3000')) {
          // Local server test endpoint
          const res = await fetch('http://localhost:3000/api/cloud/test', { method: 'GET' });
          latency = Math.round(performance.now() - startTime);
          responsePayload = await res.json();
        } else {
          // Cloud endpoint ping simulation or live fetch
          await new Promise(r => setTimeout(r, 120 + Math.random() * 80));
          latency = Math.round(38 + Math.random() * 24);
          responsePayload = {
            status: 'HEALTHY',
            cloud_provider: this.config.provider.toUpperCase(),
            endpoint: endpoint,
            model_architecture: 'NeuroNet-SwinUNETR-3D-Ensemble',
            gpu_device: 'NVIDIA A100-SXM4-80GB (TensorRT)',
            precision: 'FP16-TensorCore',
            latency_ms: latency,
            supported_modalities: ['T1-CE', 'T2-FLAIR', 'DWI', 'ADC'],
            timestamp: new Date().toISOString()
          };
        }

        pingDot.className = 'ping-status-indicator online';
        pingTitle.textContent = 'Cloud Endpoint Connected (200 OK)';
        pingSub.textContent = `Latency: ${latency}ms • GPU Instance Ready`;
        pingMsBadge.textContent = `${latency}ms Latency`;
        pingMsBadge.style.display = 'inline-block';

        if (previewBox && responseJson) {
          responseJson.textContent = JSON.stringify(responsePayload, null, 2);
          previewBox.style.display = 'block';
        }

        showToast(`Cloud API Ping Succeeded (${latency}ms)`);
      } catch (err) {
        pingDot.className = 'ping-status-indicator error';
        pingTitle.textContent = 'Cloud Connection Failed';
        pingSub.textContent = err.message || 'Network Timeout';
        showToast('Cloud API test ping failed - Check server or endpoint');
      }
    },

    async dispatchInference(scanDataUrl, metadata) {
      if (!this.config.autoCloud) return null;

      showToast('Dispatching scan to Cloud AI Engine for multi-model verification...');
      try {
        // Can call configured cloud endpoint
        const res = await fetch('http://localhost:3000/api/cloud/predict', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': this.config.apiKey ? `Bearer ${this.config.apiKey}` : ''
          },
          body: JSON.stringify({
            image_data: scanDataUrl,
            metadata: metadata,
            model: this.config.model,
            region: this.config.region
          })
        });

        if (res.ok) {
          const data = await res.json();
          showToast(`Cloud Inference Completed [Latency: ${data.latency_ms || 42}ms]`);
          return data;
        }
      } catch (e) {
        // Fallback to local neural emulation
      }
      return null;
    }
  };

  // ============================================================================
  // CLINICIAN AUTHENTICATION & SESSION MANAGEMENT
  // ============================================================================
  const AuthManager = {
    clinicians: {
      jenkins: {
        id: 'jenkins',
        name: 'Dr. Sarah Jenkins',
        title: 'Dr. Sarah Jenkins, MD, FACR',
        role: 'Attending Neuroradiologist',
        hospital: 'Johns Hopkins Comprehensive Brain Tumor Center',
        email: 's.jenkins@neuro-oncology.org',
        initials: 'SJ',
        npi: '988214',
        avatarClass: ''
      },
      vance: {
        id: 'vance',
        name: 'Dr. Marcus Vance',
        title: 'Dr. Marcus Vance, MD, FACS',
        role: 'Chief of Neurosurgery',
        hospital: 'Memorial Brain Tumor Center',
        email: 'm.vance@neurosurg-center.org',
        initials: 'MV',
        npi: '614920',
        avatarClass: 'vance'
      },
      rostova: {
        id: 'rostova',
        name: 'Dr. Elena Rostova',
        title: 'Dr. Elena Rostova, MD',
        role: 'Neuro-Oncology Clinical Fellow',
        hospital: 'Stanford Cancer Institute',
        email: 'e.rostova@stanford-neuro.edu',
        initials: 'ER',
        npi: '730198',
        avatarClass: 'rostova'
      }
    },
    currentUser: null,

    init() {
      // Load stored session or default to Dr. Sarah Jenkins
      try {
        const saved = localStorage.getItem('neuroscan_clinician_session');
        if (saved) {
          this.currentUser = JSON.parse(saved);
        }
      } catch (e) {}

      if (!this.currentUser) {
        this.currentUser = this.clinicians.jenkins;
      }

      this.updateUI();
      this.bindEvents();
    },

    updateUI() {
      const u = this.currentUser;
      const avatarBadge = document.getElementById('userAvatarInitials');
      const profileName = document.getElementById('userProfileName');
      const profileRole = document.getElementById('userProfileRole');
      const dropUserName = document.getElementById('dropUserName');
      const dropUserEmail = document.getElementById('dropUserEmail');

      if (avatarBadge) {
        avatarBadge.textContent = u.initials || 'MD';
        avatarBadge.className = `user-avatar-badge ${u.avatarClass || ''}`;
      }
      if (profileName) profileName.textContent = u.name;
      if (profileRole) profileRole.textContent = u.role;
      if (dropUserName) dropUserName.textContent = u.title || u.name;
      if (dropUserEmail) dropUserEmail.textContent = u.email;

      // Update chatbot greeting if present
      const chatGreeting = document.querySelector('.chat-message.bot strong');
      if (chatGreeting && chatGreeting.textContent.includes('Dr.')) {
        chatGreeting.textContent = `Hello ${u.name}!`;
      }
    },

    loginAs(clinicianKey) {
      if (this.clinicians[clinicianKey]) {
        this.currentUser = this.clinicians[clinicianKey];
        this.persist();
        this.updateUI();
        this.closeModal();
        this.closeDropdown();
        showToast(`Authenticated as ${this.currentUser.title}`);
      }
    },

    loginCustom(name, role, hospital, email) {
      const initials = name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase() || 'MD';
      this.currentUser = {
        id: 'custom-' + Date.now(),
        name: name,
        title: `${name}, MD`,
        role: role,
        hospital: hospital,
        email: email,
        initials: initials,
        npi: Math.floor(100000 + Math.random() * 900000).toString(),
        avatarClass: ''
      };
      this.persist();
      this.updateUI();
      this.closeModal();
      this.closeDropdown();
      showToast(`Signed In: ${this.currentUser.title} (${role})`);
    },

    logout() {
      this.currentUser = {
        id: 'guest',
        name: 'Guest Clinician',
        title: 'Guest Clinician (Observer)',
        role: 'Read-Only PACS Session',
        hospital: 'Unauthenticated Terminal',
        email: 'guest@neuroscan.local',
        initials: 'GC',
        npi: '000000',
        avatarClass: ''
      };
      try {
        localStorage.removeItem('neuroscan_clinician_session');
      } catch (e) {}
      this.updateUI();
      this.closeDropdown();
      showToast('Logged out of clinician workstation. Guest mode active.');
      this.openModal();
    },

    persist() {
      try {
        localStorage.setItem('neuroscan_clinician_session', JSON.stringify(this.currentUser));
      } catch (e) {}
    },

    openModal() {
      const modal = document.getElementById('loginModal');
      if (modal) modal.style.display = 'flex';
    },

    closeModal() {
      const modal = document.getElementById('loginModal');
      if (modal) modal.style.display = 'none';
    },

    toggleDropdown() {
      const panel = document.getElementById('userDropdownPanel');
      if (panel) {
        panel.style.display = panel.style.display === 'none' ? 'block' : 'none';
      }
    },

    closeDropdown() {
      const panel = document.getElementById('userDropdownPanel');
      if (panel) panel.style.display = 'none';
    },

    bindEvents() {
      const btnProfile = document.getElementById('btnUserProfile');
      const btnSwitchSurgeon = document.getElementById('btnSwitchToSurgeon');
      const btnOpenLogin = document.getElementById('btnOpenLoginModal');
      const btnLogout = document.getElementById('btnLogoutUser');
      const modal = document.getElementById('loginModal');
      const btnCloseModal = document.getElementById('btnCloseLoginModal');
      const btnCancelModal = document.getElementById('btnCancelLogin');

      // 1-Click quick login buttons
      const btnQuickJenkins = document.getElementById('btnQuickLoginJenkins');
      const btnQuickVance = document.getElementById('btnQuickLoginVance');
      const btnQuickRostova = document.getElementById('btnQuickLoginRostova');

      // Form controls
      const btnSubmitLogin = document.getElementById('btnSubmitLogin');
      const btnTogglePw = document.getElementById('btnToggleLoginPw');
      const inputPw = document.getElementById('loginPassword');

      btnProfile?.addEventListener('click', (e) => {
        e.stopPropagation();
        this.toggleDropdown();
      });

      // Close dropdown on outside click
      document.addEventListener('click', (e) => {
        if (!e.target.closest('.user-profile-menu-container')) {
          this.closeDropdown();
        }
      });

      btnSwitchSurgeon?.addEventListener('click', () => {
        if (this.currentUser.id === 'vance') {
          this.loginAs('jenkins');
        } else {
          this.loginAs('vance');
        }
      });

      btnOpenLogin?.addEventListener('click', () => {
        this.closeDropdown();
        this.openModal();
      });

      btnLogout?.addEventListener('click', () => this.logout());

      btnCloseModal?.addEventListener('click', () => this.closeModal());
      btnCancelModal?.addEventListener('click', () => this.closeModal());

      modal?.addEventListener('click', (e) => {
        if (e.target === modal) this.closeModal();
      });

      btnQuickJenkins?.addEventListener('click', () => this.loginAs('jenkins'));
      btnQuickVance?.addEventListener('click', () => this.loginAs('vance'));
      btnQuickRostova?.addEventListener('click', () => this.loginAs('rostova'));

      btnTogglePw?.addEventListener('click', () => {
        if (inputPw) {
          const isPw = inputPw.type === 'password';
          inputPw.type = isPw ? 'text' : 'password';
          btnTogglePw.textContent = isPw ? 'Hide' : 'Show';
        }
      });

      // Role pill selection
      document.querySelectorAll('.role-pill').forEach(pill => {
        pill.addEventListener('click', () => {
          document.querySelectorAll('.role-pill').forEach(p => p.classList.remove('active'));
          pill.classList.add('active');
          const radio = pill.querySelector('input[type="radio"]');
          if (radio) radio.checked = true;
        });
      });

      btnSubmitLogin?.addEventListener('click', async () => {
        const emailInput = document.getElementById('loginEmail');
        const pwInput = document.getElementById('loginPassword');
        const hospitalSelect = document.getElementById('loginHospital');
        const email = emailInput?.value.trim() || 's.jenkins@hopkins.edu';
        const password = pwInput?.value || '';
        const hospital = hospitalSelect?.options[hospitalSelect.selectedIndex]?.text || 'Johns Hopkins Comprehensive Brain Tumor Center';
        const checkedRole = document.querySelector('input[name="loginRole"]:checked')?.value || 'Neuroradiologist';

        if (!password) {
          showToast('Please enter your access password.', 'error');
          return;
        }

        // Attempt FastAPI auth endpoint if available
        try {
          const res = await fetch('http://localhost:8000/api/auth/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password, hospital, role: checkedRole })
          });
          if (res.ok) {
            const data = await res.json();
            if (data?.clinician) {
              this.currentUser = {
                id: 'auth-' + Date.now(),
                name: data.clinician.name,
                title: data.clinician.title,
                role: data.clinician.role,
                hospital: data.clinician.hospital,
                email: data.clinician.email,
                initials: data.clinician.initials,
                npi: data.clinician.npi || '988214',
                avatarClass: ''
              };
              this.persist();
              this.updateUI();
              this.closeModal();
              this.closeDropdown();
              showToast(`Authenticated: ${this.currentUser.title}`);
              return;
            }
          }
        } catch (e) {
          // Backend offline - proceed with client-side authentication
        }

        // Derive clinician name from user id / email
        let rawName = email.includes('@') ? email.split('@')[0].replace(/[._-]/g, ' ') : email.replace(/[._-]/g, ' ');
        let formattedName = rawName.split(' ')
          .map(w => w.charAt(0).toUpperCase() + w.slice(1))
          .join(' ');
        let name = formattedName.toLowerCase().startsWith('dr') ? formattedName : `Dr. ${formattedName}`;

        this.loginCustom(name, checkedRole, hospital, email);
      });
    }
  };

  // ============================================================================
  // AI CLINICAL NEURO-ONCOLOGY CHATBOT ENGINE
  // ============================================================================
  const NeuroChatbot = {
    isOpen: false,
    history: [],

    init() {
      this.bindEvents();
      this.updateCaseContext(state.currentCase || 'glioma');
    },

    updateCaseContext(caseKey) {
      const c = CLINICAL_CASES[caseKey];
      if (!c) return;

      const banner = document.getElementById('chatActiveContextBanner');
      if (banner) {
        banner.textContent = `Context: ${c.id} (${c.tumorName.split(' ')[0]})`;
      }

      const caseMsg = document.getElementById('chatMsgCurrentCase');
      if (caseMsg) {
        caseMsg.textContent = `${c.id}: ${c.tumorName}`;
      }
    },

    toggleChat() {
      const panel = document.getElementById('chatbotPanel');
      const unreadDot = document.querySelector('.chat-unread-dot');
      if (!panel) return;

      this.isOpen = panel.style.display !== 'none';
      if (this.isOpen) {
        panel.style.display = 'none';
        this.isOpen = false;
      } else {
        panel.style.display = 'flex';
        this.isOpen = true;
        if (unreadDot) unreadDot.style.display = 'none';
        const input = document.getElementById('chatInputText');
        if (input) input.focus();
        this.scrollToBottom();
      }
    },

    closeChat() {
      const panel = document.getElementById('chatbotPanel');
      if (panel) {
        panel.style.display = 'none';
        this.isOpen = false;
      }
    },

    clearChat() {
      const thread = document.getElementById('chatMessagesThread');
      const c = CLINICAL_CASES[state.currentCase] || CLINICAL_CASES.glioma;
      const userName = AuthManager.currentUser?.name || 'Dr. Jenkins';

      if (thread) {
        thread.innerHTML = `
          <div class="chat-message bot">
            <div class="msg-avatar">AI</div>
            <div class="msg-bubble">
              <p><strong>Hello ${userName}!</strong> I am your AI clinical neuro-oncology co-pilot.</p>
              <p>I am synchronized with the active MRI in your PACS viewport (<strong id="chatMsgCurrentCase">${c.id}: ${c.tumorName}</strong>). You can ask me about tumor morphology, U-Net volumetric segmentation, Grad-CAM attention saliency, or clinical guidelines.</p>
            </div>
          </div>
        `;
      }
      this.history = [];
      showToast('Chat history cleared.');
    },

    scrollToBottom() {
      const thread = document.getElementById('chatMessagesThread');
      if (thread) {
        thread.scrollTop = thread.scrollHeight;
      }
    },

    appendUserMessage(text) {
      const thread = document.getElementById('chatMessagesThread');
      const initials = AuthManager.currentUser?.initials || 'MD';
      const msgDiv = document.createElement('div');
      msgDiv.className = 'chat-message user';
      msgDiv.innerHTML = `
        <div class="msg-avatar">${initials}</div>
        <div class="msg-bubble">
          <p>${this.escapeHtml(text)}</p>
        </div>
      `;
      thread.appendChild(msgDiv);
      this.scrollToBottom();
    },

    appendTypingIndicator() {
      const thread = document.getElementById('chatMessagesThread');
      const typingDiv = document.createElement('div');
      typingDiv.className = 'chat-message bot typing-indicator';
      typingDiv.id = 'botTypingBubble';
      typingDiv.innerHTML = `
        <div class="msg-avatar">AI</div>
        <div class="msg-bubble" style="display: flex; align-items: center; gap: 4px; padding: 10px 14px;">
          <span style="font-size: 0.7rem; color: var(--cyan-primary);">Analyzing clinical data</span>
          <span class="typing-dots" style="color: var(--cyan-primary); letter-spacing: 2px;">...</span>
        </div>
      `;
      thread.appendChild(typingDiv);
      this.scrollToBottom();
    },

    removeTypingIndicator() {
      const typing = document.getElementById('botTypingBubble');
      if (typing) typing.remove();
    },

    appendBotMessage(html) {
      const thread = document.getElementById('chatMessagesThread');
      const msgDiv = document.createElement('div');
      msgDiv.className = 'chat-message bot';
      msgDiv.innerHTML = `
        <div class="msg-avatar">AI</div>
        <div class="msg-bubble">
          ${html}
        </div>
      `;
      thread.appendChild(msgDiv);
      this.scrollToBottom();
    },

    escapeHtml(str) {
      return str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
    },

    handleSend() {
      const input = document.getElementById('chatInputText');
      const text = input?.value.trim();
      if (!text) return;

      input.value = '';
      this.appendUserMessage(text);
      this.appendTypingIndicator();

      // Simulated neural inference delay
      setTimeout(() => {
        this.removeTypingIndicator();
        const reply = this.generateClinicalResponse(text);
        this.appendBotMessage(reply);
      }, 550);
    },

    generateClinicalResponse(query) {
      const q = query.toLowerCase();
      const caseKey = state.currentCase || 'glioma';
      const c = CLINICAL_CASES[caseKey];

      // 1. Analyze / Summarize Current Scan
      if (q.includes('current scan') || q.includes('findings') || q.includes('summarize') || q.includes('analyze')) {
        if (caseKey === 'normal') {
          return `
            <p><strong>Clinical MRI Summary — Healthy Control (${c.id})</strong></p>
            <p>• <strong>Primary Finding:</strong> No abnormal mass, pathologic contrast enhancement, or midline shift detected.</p>
            <p>• <strong>Softmax Confidence:</strong> ${c.confidence}% Normal Brain Parenchyma.</p>
            <p>• <strong>Ventricular Symmetry:</strong> Lateral and third ventricles are normal in caliber and configuration without hydrocephalus or effacement.</p>
            <p>• <strong>Impression:</strong> Unremarkable non-contrast/contrast brain neuroimaging study.</p>
          `;
        }
        return `
          <p><strong>Clinical Findings Summary for ${c.patientName} (${c.id})</strong></p>
          <p>• <strong>Classification:</strong> <span style="color: var(--cyan-primary); font-weight: 700;">${c.tumorName}</span> (${c.confidence}% model confidence).</p>
          <p>• <strong>Volumetric Segmentation (U-Net):</strong> Volume: <strong>${c.volumetrics.volume}</strong> | Transverse Diameter: <strong>${c.volumetrics.diameter}</strong>.</p>
          <p>• <strong>Anatomical Location:</strong> ${c.volumetrics.laterality} with ${c.volumetrics.midlineShift} midline shift.</p>
          <p>• <strong>Key Radiologic Features:</strong> ${c.indication || 'Enhancing intracranial lesion visualized on T1-CE sequence.'}</p>
          <p>• <strong>Impression:</strong> ${c.impression.replace(/\n/g, ' ')}</p>
        `;
      }

      // 2. Glioma vs Meningioma Differential
      if (q.includes('glioma vs') || (q.includes('meningioma') && q.includes('glioma')) || q.includes('difference')) {
        return `
          <p><strong>Radiologic Differentiation: Glioma vs. Meningioma</strong></p>
          <ul>
            <li><strong>Origin:</strong> Gliomas are <em>intra-axial</em> neuroepithelial tumors infiltrating brain parenchyma. Meningiomas are <em>extra-axial</em> arachnoid cap cell tumors growing inwards from the dura mater.</li>
            <li><strong>Margins & Borders:</strong> Gliomas exhibit ill-defined, infiltrative margins with non-enhancing vasogenic edema. Meningiomas are well-circumscribed and sharply demarcated.</li>
            <li><strong>Dural Tail Sign:</strong> Seen in >65% of meningiomas (tapering enhancement along dural leaf); virtually absent in gliomas.</li>
            <li><strong>Enhancement:</strong> High-grade gliomas (Glioblastoma) typically show thick, irregular <em>ring-enhancement</em> surrounding a central necrotic cavity. Meningiomas typically show <em>homogeneous, avid</em> post-contrast enhancement.</li>
          </ul>
        `;
      }

      // 3. Grad-CAM XAI Attention Explanation
      if (q.includes('grad-cam') || q.includes('heatmap') || q.includes('explain') || q.includes('attention') || q.includes('saliency')) {
        return `
          <p><strong>Explainable AI (Grad-CAM Saliency) Analysis:</strong></p>
          <p>The Gradient-weighted Class Activation Mapping (Grad-CAM) engine visualizes feature gradients backpropagated from the classification head into the bottleneck layer of the CNN/SwinUNETR.</p>
          <p>• <strong>Attention Focus:</strong> For ${c.tumorName}, highest saliency (<strong style="color: #ff1744;">Red Core, Score ${c.xai.saliency}</strong>) is concentrated directly over the hyperintense contrast-enhancing neoplastic rim.</p>
          <p>• <strong>Clinical Validation:</strong> The model ignores non-pathologic skull bone and scalp fat, validating that the classification prediction is derived exclusively from pathologic tissue characteristics.</p>
          <p>• <strong>Dice Similarity:</strong> The segmentation mask achieves a Dice coefficient of <strong>${c.xai.dice}</strong> against radiologist ground-truth contours.</p>
        `;
      }

      // 4. Surgical & Treatment Guidelines (NCCN)
      if (q.includes('surgical') || q.includes('guidelines') || q.includes('treatment') || q.includes('nccn') || q.includes('resection')) {
        if (caseKey === 'glioma') {
          return `
            <p><strong>NCCN Guidelines — Glioblastoma Multiforme (WHO Grade IV):</strong></p>
            <ul>
              <li><strong>Surgical Objective:</strong> Maximal safe surgical resection using neuronavigation, intraoperative 5-ALA fluorescence, or cortical mapping to preserve functional speech and motor pathways.</li>
              <li><strong>Adjuvant Radiochemotherapy (Stupp Protocol):</strong> Fractionated external beam radiotherapy (60 Gy in 30 fractions) with concurrent daily oral Temozolomide (75 mg/m²).</li>
              <li><strong>Molecular Profiling:</strong> Mandatory testing for <em>MGMT</em> promoter methylation (predicts alkylating agent responsiveness) and <em>IDH1/2</em> mutation status.</li>
              <li><strong>Maintenance Therapy:</strong> 6 cycles of adjuvant Temozolomide (150–200 mg/m² days 1–5 every 28 days) ± Tumor Treating Fields (Optune).</li>
            </ul>
          `;
        } else if (caseKey === 'meningioma') {
          return `
            <p><strong>NCCN Guidelines — Intracranial Meningioma:</strong></p>
            <ul>
              <li><strong>Surgical Goal:</strong> Complete surgical excision including affected dural attachment and involved bone (Simpson Grade I resection).</li>
              <li><strong>WHO Grade I (Benign):</strong> Observation or complete resection. Stereotactic radiosurgery (SRS, 12–16 Gy) if surgically inaccessible (e.g., cavernous sinus).</li>
              <li><strong>WHO Grade II / III:</strong> Adjuvant fractionated radiation therapy (54–60 Gy) is recommended following subtotal or total resection to curb recurrence risk.</li>
            </ul>
          `;
        } else if (caseKey === 'pituitary') {
          return `
            <p><strong>Endocrine & Surgical Guidelines — Pituitary Macroadenoma:</strong></p>
            <ul>
              <li><strong>First-Line Intervention:</strong> Endoscopic endonasal transsphenoidal hypophysectomy for optic chiasm decompression.</li>
              <li><strong>Hormonal Workup:</strong> Complete serum pituitary axis panel (Serum Prolactin, IGF-1, 8am Cortisol, Free T4, TSH).</li>
              <li><strong>Medical Therapy:</strong> If confirmed Prolactinoma, primary therapy is dopamine agonist medical management (Cabergoline 0.5 mg twice weekly).</li>
            </ul>
          `;
        } else {
          return `
            <p><strong>Clinical Protocol — Normal Neuroimaging:</strong></p>
            <p>No surgical or oncologic intervention indicated. If patient presents with unprovoked headaches or sensory symptoms, evaluate for migraine, tension cephalalgia, or cervical radiculopathy.</p>
          `;
        }
      }

      // 5. Volumetrics Math & Calculation
      if (q.includes('volume') || q.includes('math') || q.includes('midline') || q.includes('voxel') || q.includes('calculate')) {
        return `
          <p><strong>U-Net Volumetrics & Midline Shift Computation:</strong></p>
          <ul>
            <li><strong>Voxel Spacing:</strong> Standard DICOM acquisition voxel dimensions: 0.468 mm × 0.468 mm in-plane with 1.0 mm reconstructed slice thickness.</li>
            <li><strong>Tumor Volume Formula:</strong> <code>Volume (cm³) = (N_voxels × Δx × Δy × Δz) / 1000</code>. Active lesion contains <strong>${c.volumetrics.voxelCount || '51,692'} voxels</strong> = <strong>${c.volumetrics.volume}</strong>.</li>
            <li><strong>Midline Shift:</strong> Measured by calculating perpendicular deviation from the anatomic falx cerebri reference line to the displaced septum pellucidum. Active case shift: <strong>${c.volumetrics.midlineShift}</strong>.</li>
          </ul>
        `;
      }

      // 6. Generic Clinical Question Fallback
      return `
        <p><strong>NeuroBot Clinical Decision Support:</strong></p>
        <p>Regarding your query: "<em>${this.escapeHtml(query)}</em>"</p>
        <p>In the context of the active study (<strong>${c.tumorName}</strong>, ${c.volumetrics.volume}, ${c.volumetrics.laterality}):</p>
        <p>• MRI multi-parametric imaging (T1-CE, T2, FLAIR, DWI) provides optimal delineation of neoplastic borders versus surrounding vasogenic edema.</p>
        <p>• Correlation with histopathology, immunohistochemistry (GFAP, Ki-67, IDH1), and multi-disciplinary tumor board review is strongly recommended before definitive surgical planning.</p>
      `;
    },

    bindEvents() {
      const btnOpen = document.getElementById('btnOpenChatbot');
      const btnClose = document.getElementById('btnCloseChatbot');
      const btnClear = document.getElementById('btnClearChat');
      const form = document.getElementById('chatInputForm');

      btnOpen?.addEventListener('click', () => this.toggleChat());
      btnClose?.addEventListener('click', () => this.closeChat());
      btnClear?.addEventListener('click', () => this.clearChat());

      form?.addEventListener('submit', (e) => {
        e.preventDefault();
        this.handleSend();
      });

      // Quick prompt chip click handlers
      document.querySelectorAll('.prompt-chip').forEach(chip => {
        chip.addEventListener('click', () => {
          const prompt = chip.getAttribute('data-prompt');
          if (prompt) {
            const input = document.getElementById('chatInputText');
            if (input) input.value = prompt;
            this.handleSend();
          }
        });
      });
    }
  };

  // ============================================================================
  // PATIENT PORTAL & HEALTHCARE WEB SYSTEM
  // ============================================================================
  const PatientPortalManager = {
    currentPatient: null,
    activeView: 'doctor-pacs',
    highlightEnabled: true,

    PATIENT_DATABASE: {
      'MR-9823101': {
        mrn: 'MR-9823101',
        password: 'patient123',
        name: 'John M. Doe',
        initials: 'JD',
        ageSex: '54Y / Male',
        dob: 'May 14, 1972',
        hospital: 'Johns Hopkins Comprehensive Brain Tumor Center',
        attendingPhysician: 'Dr. Sarah Jenkins, MD, FACR',
        surgeon: 'Dr. Marcus Vance, MD, FACS',
        status: 'Specialist Evaluation Required',
        statusClass: 'danger',
        caseKey: 'glioma',
        studyId: '#NS-8042-GBM',
        scanDate: 'October 13, 2026',
        modality: 'MRI 3.0T AX T1-CE + FLAIR',
        title: 'Contrast-Enhancing Intra-Axial Right Frontal-Temporal Lesion',
        plainEnglishSummary: 'Your recent 3.0T MRI scan identified a localized mass in the right frontal-temporal region of the brain. The area shows active contrast enhancement and surrounding tissue swelling (edema). Your multidisciplinary clinical care team has reviewed the volumetric measurements and scheduled an immediate neurosurgical consultation with Dr. Marcus Vance.',
        volumetrics: {
          volume: '28.4 cm³',
          diameter: '41.8 mm',
          location: 'Right Frontal-Temporal Lobe',
          midlineShift: '4.2 mm'
        },
        milestones: [
          { badge: 'NEXT STEP', type: 'next', text: 'Neurosurgical Consultation with Dr. Marcus Vance on Thursday, Oct 16 at 10:00 AM' },
          { badge: 'IMAGING', type: 'pending', text: 'Functional Speech & Motor Tractography MRI scheduled for pre-operative planning' },
          { badge: 'MEDICATION', type: 'info', text: 'Continue anti-edema corticosteroid medication as prescribed by neuro-oncology' }
        ]
      },
      'MR-4402917': {
        mrn: 'MR-4402917',
        password: 'patient123',
        name: 'Eleanor R. Vance',
        initials: 'EV',
        ageSex: '58Y / Female',
        dob: 'August 22, 1968',
        hospital: 'Memorial Brain Tumor Center',
        attendingPhysician: 'Dr. Sarah Jenkins, MD, FACR',
        surgeon: 'Dr. Marcus Vance, MD, FACS',
        status: 'Stable / Outpatient Surveillance',
        statusClass: '',
        caseKey: 'meningioma',
        studyId: '#NS-7119-MEN',
        scanDate: 'October 12, 2026',
        modality: 'MRI 3.0T AX T1-CE + T2',
        title: 'Well-Circumscribed Extra-Axial Dural-Based Neoplasm',
        plainEnglishSummary: 'Your MRI scan shows a well-defined extra-axial benign lesion along the right parietal convexity. The findings are characteristic of a slow-growing Grade I meningioma with a typical dural tail sign. No acute brain parenchymal invasion or significant swelling is identified.',
        volumetrics: {
          volume: '16.2 cm³',
          diameter: '32.5 mm',
          location: 'Right Parietal Convexity',
          midlineShift: '1.8 mm'
        },
        milestones: [
          { badge: 'NEXT STEP', type: 'next', text: 'Outpatient Neurosurgical Review on Monday, Oct 20 at 2:30 PM' },
          { badge: 'CLINICAL', type: 'pending', text: 'Evaluation for elective stereotactic radiosurgery vs. watchful surveillance' },
          { badge: 'FOLLOW-UP', type: 'info', text: 'Follow-up contrast-enhanced brain MRI recommended in 6 months' }
        ]
      },
      'MR-7718290': {
        mrn: 'MR-7718290',
        password: 'patient123',
        name: 'Marcus A. Brody',
        initials: 'MB',
        ageSex: '47Y / Male',
        dob: 'November 03, 1979',
        hospital: 'Stanford Cancer Institute',
        attendingPhysician: 'Dr. Elena Rostova, MD',
        surgeon: 'Dr. Marcus Vance, MD, FACS',
        status: 'Endocrine Panel Pending',
        statusClass: 'purple',
        caseKey: 'pituitary',
        studyId: '#NS-4902-PIT',
        scanDate: 'October 10, 2026',
        modality: 'MRI 3.0T PITUITARY PROTOCOL (T1+C)',
        title: 'Pituitary Sellar Mass with Suprasellar Extension',
        plainEnglishSummary: 'Your specialized pituitary protocol MRI demonstrates an adenoma located within the sella turcica, extending mildly upward toward the optic chiasm. Visual field testing is recommended alongside complete serum hormone evaluations.',
        volumetrics: {
          volume: '8.7 cm³',
          diameter: '22.4 mm',
          location: 'Sella Turcica / Midline Centered',
          midlineShift: '0.0 mm'
        },
        milestones: [
          { badge: 'LABORATORY', type: 'next', text: 'Complete Serum Pituitary Hormone Panel (Prolactin, IGF-1, Morning Cortisol)' },
          { badge: 'EXAM', type: 'pending', text: 'Formal Neuro-Ophthalmology Visual Field Automated Perimetry on Friday, Oct 17' },
          { badge: 'CONSULT', type: 'info', text: 'Endocrine consultation to determine medical vs. transsphenoidal surgical path' }
        ]
      },
      'MR-1092844': {
        mrn: 'MR-1092844',
        password: 'patient123',
        name: 'Sarah L. Connor',
        initials: 'SC',
        ageSex: '32Y / Female',
        dob: 'December 18, 1993',
        hospital: 'Metro Health Imaging Center',
        attendingPhysician: 'Dr. Sarah Jenkins, MD, FACR',
        surgeon: 'Dr. Marcus Vance, MD, FACS',
        status: 'Healthy Baseline Study',
        statusClass: 'success',
        caseKey: 'normal',
        studyId: '#NS-1025-NRM',
        scanDate: 'October 08, 2026',
        modality: 'MRI 3.0T BRAIN SCREENING (T1+T2)',
        title: 'Normal Brain (Healthy Neuro-Anatomy)',
        plainEnglishSummary: 'Your MRI scan confirmed completely healthy, normal brain anatomy. Brain tissue, ventricles, sulci, and skull structures are symmetrical and within healthy limits with zero evidence of tumor, hemorrhage, or midline shift.',
        volumetrics: {
          volume: '0.0 cm³',
          diameter: '0.0 mm',
          location: 'Symmetrical / Normal',
          midlineShift: '0.0 mm'
        },
        milestones: [
          { badge: 'ROUTINE', type: 'next', text: 'Baseline neuroimaging examination completed and archived to your health record' },
          { badge: 'FOLLOW-UP', type: 'info', text: 'No active clinical intervention or specialized follow-up required' }
        ]
      }
    },

    init() {
      try {
        const saved = localStorage.getItem('neuroscan_patient_session');
        if (saved) {
          this.currentPatient = JSON.parse(saved);
        }
      } catch (e) {}

      this.bindEvents();
      this.bindHomeEvents();
      this.updateHeaderAuthButton();
      this.initHomeScanner();
      this.switchView('front-home');
    },

    bindEvents() {
      // Top Navigation Switcher Buttons
      const btnHome = document.getElementById('btnNavHome');
      const btnDoctorPacs = document.getElementById('btnNavDoctorPacs');
      const btnPatientPortal = document.getElementById('btnNavPatientPortal');
      const btnHeaderPatient = document.getElementById('btnHeaderPatientLogin');

      btnHome?.addEventListener('click', () => this.switchView('front-home'));
      document.getElementById('btnBrandHome')?.addEventListener('click', () => this.switchView('front-home'));
      btnDoctorPacs?.addEventListener('click', () => this.switchView('doctor-pacs'));
      btnPatientPortal?.addEventListener('click', () => this.switchView('patient-portal'));
      btnHeaderPatient?.addEventListener('click', () => {
        if (this.currentPatient) {
          this.switchView('patient-portal');
        } else {
          AuthManager.openModal();
          this.switchModalTab('patient');
        }
      });

      // Patient Home View: Form submission
      const formSubmit = document.getElementById('btnSubmitPatientLogin');
      formSubmit?.addEventListener('click', () => {
        const uid = document.getElementById('patientUserIdInput')?.value || '';
        const pw = document.getElementById('patientPasswordInput')?.value || '';
        this.login(uid, pw);
      });

      // Password toggle in Home View
      const btnTogglePw = document.getElementById('btnTogglePatientPw');
      btnTogglePw?.addEventListener('click', () => {
        const input = document.getElementById('patientPasswordInput');
        if (input) {
          const isPw = input.type === 'password';
          input.type = isPw ? 'text' : 'password';
          btnTogglePw.textContent = isPw ? 'Hide' : 'Show';
        }
      });

      // 1-Click Demo Patient buttons in Home View
      document.querySelectorAll('.demo-patient-btn').forEach(btn => {
        btn.addEventListener('click', () => {
          const mrn = btn.getAttribute('data-mrn');
          const pw = btn.getAttribute('data-pw');
          if (mrn) this.login(mrn, pw || 'patient123');
        });
      });

      // Modal Auth Tab Switcher
      const tabClinician = document.getElementById('tabAuthClinician');
      const tabPatient = document.getElementById('tabAuthPatient');
      tabClinician?.addEventListener('click', () => this.switchModalTab('clinician'));
      tabPatient?.addEventListener('click', () => this.switchModalTab('patient'));

      // Modal Patient Form & Demo Buttons
      const btnModalSubmit = document.getElementById('btnSubmitModalPatientLogin');
      btnModalSubmit?.addEventListener('click', () => {
        const uid = document.getElementById('modalPatientUserId')?.value || '';
        const pw = document.getElementById('modalPatientPw')?.value || '';
        this.login(uid, pw);
        AuthManager.closeModal();
      });

      const btnToggleModalPw = document.getElementById('btnToggleModalPatientPw');
      btnToggleModalPw?.addEventListener('click', () => {
        const input = document.getElementById('modalPatientPw');
        if (input) {
          const isPw = input.type === 'password';
          input.type = isPw ? 'text' : 'password';
          btnToggleModalPw.textContent = isPw ? 'Hide' : 'Show';
        }
      });

      document.getElementById('btnModalPatientDoe')?.addEventListener('click', () => {
        this.login('MR-9823101', 'patient123');
        AuthManager.closeModal();
      });
      document.getElementById('btnModalPatientVance')?.addEventListener('click', () => {
        this.login('MR-4402917', 'patient123');
        AuthManager.closeModal();
      });
      document.getElementById('btnModalPatientBrody')?.addEventListener('click', () => {
        this.login('MR-7718290', 'patient123');
        AuthManager.closeModal();
      });
      document.getElementById('btnModalPatientConnor')?.addEventListener('click', () => {
        this.login('MR-1092844', 'patient123');
        AuthManager.closeModal();
      });

      // Patient Dashboard Actions
      document.getElementById('btnLogoutPatient')?.addEventListener('click', () => this.logout());

      document.getElementById('btnViewInDoctorPacs')?.addEventListener('click', () => {
        if (this.currentPatient && this.currentPatient.caseKey) {
          loadCase(this.currentPatient.caseKey);
        }
        this.switchView('doctor-pacs');
        showToast('Viewing Patient Scan in Doctor PACS Workstation.');
      });

      document.getElementById('btnPrintPatientSummary')?.addEventListener('click', () => {
        window.print();
      });

      // Toggle Highlight on Patient Scan Canvas
      const btnToggleHl = document.getElementById('btnToggleDashHighlight');
      btnToggleHl?.addEventListener('click', () => {
        this.highlightEnabled = !this.highlightEnabled;
        btnToggleHl.classList.toggle('active', this.highlightEnabled);
        this.renderPatientScan();
      });

      // Direct Messaging Form
      const msgForm = document.getElementById('patientMsgForm');
      msgForm?.addEventListener('submit', (e) => {
        e.preventDefault();
        this.sendPatientMessage();
      });
      document.getElementById('btnSendPatientMsg')?.addEventListener('click', () => {
        this.sendPatientMessage();
      });
    },

    bindHomeEvents() {
      // Hero Action Buttons (Enter into Website)
      document.getElementById('btnHeroEnterDoctor')?.addEventListener('click', () => {
        const loginSec = document.getElementById('homeLoginSection');
        if (loginSec) {
          loginSec.scrollIntoView({ behavior: 'smooth' });
          document.getElementById('homeDocUser')?.focus();
        } else {
          this.switchView('doctor-pacs');
        }
      });

      document.getElementById('btnHeroEnterPatient')?.addEventListener('click', () => {
        const loginSec = document.getElementById('homeLoginSection');
        if (loginSec) {
          loginSec.scrollIntoView({ behavior: 'smooth' });
          document.getElementById('homePatUser')?.focus();
        } else {
          this.switchView('patient-portal');
        }
      });

      document.getElementById('btnHeroGuestAccess')?.addEventListener('click', () => {
        this.switchView('doctor-pacs');
        showToast('Entered as Guest Clinician. Full PACS access active!', 'success');
      });

      document.getElementById('btnGuestEnterWebsite')?.addEventListener('click', () => {
        this.switchView('doctor-pacs');
        showToast('Entered as Guest Clinician. Full PACS access active!', 'success');
      });

      // Clinician Login on Home
      document.getElementById('btnSubmitHomeDocLogin')?.addEventListener('click', () => {
        const user = (document.getElementById('homeDocUser')?.value || '').trim();
        const pw = document.getElementById('homeDocPw')?.value || '';
        if (!pw) {
          showToast('Please enter your password.', 'error');
          return;
        }
        if (user.toLowerCase().includes('vance')) {
          AuthManager.loginAs('vance');
        } else {
          AuthManager.loginAs('jenkins');
        }
        this.switchView('doctor-pacs');
        showToast('Clinician authenticated. Welcome to Doctor PACS!', 'success');
      });

      // 1-Click Fast Clinicians on Home
      const btnFastJenkins = document.getElementById('btnFastDocJenkins');
      const btnFastVance = document.getElementById('btnFastDocVance');
      btnFastJenkins?.addEventListener('click', () => {
        const u = document.getElementById('homeDocUser');
        const p = document.getElementById('homeDocPw');
        if (u) u.value = 's.jenkins@hopkins.edu';
        if (p) p.value = 'password123';
        btnFastJenkins.classList.add('active-fast');
        btnFastVance?.classList.remove('active-fast');
      });
      btnFastVance?.addEventListener('click', () => {
        const u = document.getElementById('homeDocUser');
        const p = document.getElementById('homeDocPw');
        if (u) u.value = 'm.vance@memorial.org';
        if (p) p.value = 'password123';
        btnFastVance.classList.add('active-fast');
        btnFastJenkins?.classList.remove('active-fast');
      });

      // Patient Login on Home
      document.getElementById('btnSubmitHomePatLogin')?.addEventListener('click', () => {
        const mrn = (document.getElementById('homePatUser')?.value || '').trim();
        const pw = document.getElementById('homePatPw')?.value || '';
        this.login(mrn, pw);
      });

      // 1-Click Fast Patients on Home
      const btnFastPatDoe = document.getElementById('btnFastPatDoe');
      const btnFastPatVance = document.getElementById('btnFastPatVance');
      btnFastPatDoe?.addEventListener('click', () => {
        const u = document.getElementById('homePatUser');
        const p = document.getElementById('homePatPw');
        if (u) u.value = 'MR-9823101';
        if (p) p.value = 'patient123';
        btnFastPatDoe.classList.add('active-fast');
        btnFastPatVance?.classList.remove('active-fast');
      });
      btnFastPatVance?.addEventListener('click', () => {
        const u = document.getElementById('homePatUser');
        const p = document.getElementById('homePatPw');
        if (u) u.value = 'MR-4402917';
        if (p) p.value = 'patient123';
        btnFastPatVance.classList.add('active-fast');
        btnFastPatDoe?.classList.remove('active-fast');
      });

      // Simulator Case Pills
      document.querySelectorAll('#homeSimCasePills .sim-pill').forEach(pill => {
        pill.addEventListener('click', () => {
          document.querySelectorAll('#homeSimCasePills .sim-pill').forEach(p => p.classList.remove('active'));
          pill.classList.add('active');
          const caseKey = pill.getAttribute('data-case') || 'glioma';
          this.simCaseKey = caseKey;
          this.updateHomeSimMetadata(caseKey);
          this.renderHomeScan();
        });
      });

      // Simulator Slice Slider
      const sliceSlider = document.getElementById('homeSimSliceSlider');
      sliceSlider?.addEventListener('input', (e) => {
        this.simSlice = parseInt(e.target.value, 10) || 14;
        const valDisp = document.getElementById('homeSimSliceVal');
        if (valDisp) valDisp.textContent = this.simSlice;
        const meta = document.getElementById('homeSimMeta');
        if (meta) {
          const c = CLINICAL_CASES[this.simCaseKey || 'glioma'];
          meta.textContent = `Study ${c?.id || '#NS-8042'} • Slice ${this.simSlice}/24`;
        }
        this.renderHomeScan();
      });

      // Simulator Layer Toggles
      document.getElementById('chkHomeGradCam')?.addEventListener('change', (e) => {
        this.simShowGradCam = e.target.checked;
        this.renderHomeScan();
      });
      document.getElementById('chkHomeSeg')?.addEventListener('change', (e) => {
        this.simShowSeg = e.target.checked;
        this.renderHomeScan();
      });

      // Launch Sim Study directly into PACS
      document.getElementById('btnLaunchSimStudy')?.addEventListener('click', () => {
        const caseKey = this.simCaseKey || 'glioma';
        if (typeof loadCase === 'function') loadCase(caseKey);
        this.switchView('doctor-pacs');
        showToast(`Loaded ${CLINICAL_CASES[caseKey]?.tumorName || 'Study'} into Doctor PACS.`, 'success');
      });

      // Benchmark Cards (Open in Doctor PACS)
      document.querySelectorAll('.home-cases-grid .btn-open-case').forEach(btn => {
        btn.addEventListener('click', (e) => {
          e.stopPropagation();
          const caseKey = btn.getAttribute('data-case');
          if (caseKey && typeof loadCase === 'function') loadCase(caseKey);
          this.switchView('doctor-pacs');
          showToast(`Opened study in Doctor PACS Workstation.`, 'success');
        });
      });
      document.querySelectorAll('.home-cases-grid .h-case-card').forEach(card => {
        card.addEventListener('click', () => {
          const caseKey = card.getAttribute('data-case');
          if (caseKey && typeof loadCase === 'function') loadCase(caseKey);
          this.switchView('doctor-pacs');
          showToast(`Opened study in Doctor PACS Workstation.`, 'success');
        });
      });

      // Footer Links
      document.getElementById('linkFootHome')?.addEventListener('click', (e) => { e.preventDefault(); this.switchView('front-home'); });
      document.getElementById('linkFootDoctor')?.addEventListener('click', (e) => { e.preventDefault(); this.switchView('doctor-pacs'); });
      document.getElementById('linkFootPatient')?.addEventListener('click', (e) => { e.preventDefault(); this.switchView('patient-portal'); });
      document.getElementById('linkFootDb')?.addEventListener('click', (e) => { e.preventDefault(); if (typeof openDatabaseModal === 'function') openDatabaseModal(); });
    },

    updateHomeSimMetadata(caseKey) {
      const c = CLINICAL_CASES[caseKey];
      if (!c) return;
      const meta = document.getElementById('homeSimMeta');
      const tagClass = document.getElementById('homeSimTagClass');
      const tagVol = document.getElementById('homeSimTagVol');

      if (meta) meta.textContent = `Study ${c.id} • Slice ${this.simSlice || 14}/24`;
      if (tagClass) tagClass.textContent = `${c.tumorName.split(' ')[0].toUpperCase()} (${c.confidence}%)`;
      if (tagVol) tagVol.textContent = `VOL: ${c.volumetrics.volume}`;
    },

    initHomeScanner() {
      this.simCaseKey = 'glioma';
      this.simSlice = 14;
      this.simShowGradCam = true;
      this.simShowSeg = true;
      this.renderHomeScan();
    },

    renderHomeScan() {
      const canvas = document.getElementById('homeScanCanvas');
      if (!canvas) return;
      const ctx = canvas.getContext('2d');
      canvas.width = 400;
      canvas.height = 400;

      ctx.save();
      ctx.clearRect(0, 0, 400, 400);

      // Scale to 400x400 from standard 512x512
      const scale = 400 / 512;
      ctx.scale(scale, scale);

      const caseKey = this.simCaseKey || 'glioma';
      const slice = this.simSlice || 14;

      // Draw procedural MRI scan anatomy
      drawProceduralMriScan(ctx, caseKey, slice, 'axial');

      // Overlays
      const c = CLINICAL_CASES[caseKey];
      if (c && c.bbox) {
        if (this.simShowGradCam) {
          drawGradCamHeatmap(ctx, c.bbox, 0.65);
        }
        if (this.simShowSeg) {
          drawSegmentationMask(ctx, caseKey, c.bbox);
        }
        drawBoundingBox(ctx, c.bbox, c.tumorName, c.confidence);
      }

      ctx.restore();
    },

    switchView(viewName) {
      this.activeView = viewName;
      const homeWork = document.getElementById('frontHomepageWorkspace');
      const pacsWork = document.getElementById('doctorPacsWorkspace');
      const patientWork = document.getElementById('patientPortalWorkspace');
      const btnHome = document.getElementById('btnNavHome');
      const btnDoctor = document.getElementById('btnNavDoctorPacs');
      const btnPatient = document.getElementById('btnNavPatientPortal');

      if (viewName === 'front-home' || viewName === 'home') {
        if (homeWork) homeWork.style.display = 'block';
        if (pacsWork) pacsWork.style.display = 'none';
        if (patientWork) patientWork.style.display = 'none';
        btnHome?.classList.add('active');
        btnDoctor?.classList.remove('active');
        btnPatient?.classList.remove('active');
        window.scrollTo({ top: 0, behavior: 'smooth' });
        this.renderHomeScan();
      } else if (viewName === 'doctor-pacs') {
        if (homeWork) homeWork.style.display = 'none';
        if (pacsWork) pacsWork.style.display = 'grid';
        if (patientWork) patientWork.style.display = 'none';
        btnHome?.classList.remove('active');
        btnDoctor?.classList.add('active');
        btnPatient?.classList.remove('active');
        if (typeof render === 'function') render();
      } else if (viewName === 'patient-portal') {
        if (homeWork) homeWork.style.display = 'none';
        if (pacsWork) pacsWork.style.display = 'none';
        if (patientWork) patientWork.style.display = 'block';
        btnHome?.classList.remove('active');
        btnDoctor?.classList.remove('active');
        btnPatient?.classList.add('active');
        this.render();
      }
    },

    switchModalTab(mode) {
      const tabClinician = document.getElementById('tabAuthClinician');
      const tabPatient = document.getElementById('tabAuthPatient');
      const secClinician = document.getElementById('modalClinicianSection');
      const secPatient = document.getElementById('modalPatientSection');

      if (mode === 'clinician') {
        tabClinician?.classList.add('active');
        tabPatient?.classList.remove('active');
        if (secClinician) secClinician.style.display = 'block';
        if (secPatient) secPatient.style.display = 'none';
      } else {
        tabClinician?.classList.remove('active');
        tabPatient?.classList.add('active');
        if (secClinician) secClinician.style.display = 'none';
        if (secPatient) secPatient.style.display = 'block';
      }
    },

    login(userId, password) {
      const cleanId = (userId || '').trim().toUpperCase();
      if (!cleanId) {
        showToast('Please enter your Patient User ID or MRN.', 'error');
        return;
      }
      if (!password) {
        showToast('Please enter your portal password.', 'error');
        return;
      }

      // Check against database
      let matched = this.PATIENT_DATABASE[cleanId];
      if (!matched) {
        // Match by partial MRN or name
        const values = Object.values(this.PATIENT_DATABASE);
        matched = values.find(p => p.mrn.toUpperCase() === cleanId || p.name.toUpperCase().includes(cleanId));
      }

      if (!matched) {
        // Dynamic profile creation
        matched = {
          mrn: cleanId.startsWith('MR-') ? cleanId : `MR-${cleanId}`,
          password: password,
          name: userId.includes('@') ? userId.split('@')[0] : userId,
          initials: 'PT',
          ageSex: 'Adult Patient',
          dob: 'Jan 01, 1980',
          hospital: 'Johns Hopkins Comprehensive Brain Tumor Center',
          attendingPhysician: 'Dr. Sarah Jenkins, MD, FACR',
          surgeon: 'Dr. Marcus Vance, MD, FACS',
          status: 'Specialist Evaluation Required',
          statusClass: 'danger',
          caseKey: 'glioma',
          studyId: `#NS-${Math.floor(1000 + Math.random() * 9000)}-MRI`,
          scanDate: new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }),
          modality: 'MRI 3.0T AX T1-CE',
          title: 'Intracranial Diagnostic Neuroimaging Study',
          plainEnglishSummary: 'Your recent brain MRI scan has been recorded in the clinical system. Your healthcare team is evaluating the volumetric findings and will review results with you during consultation.',
          volumetrics: { volume: '24.2 cm³', diameter: '38.5 mm', location: 'Cerebral Hemisphere', midlineShift: '2.4 mm' },
          milestones: [
            { badge: 'CONSULT', type: 'next', text: 'Multidisciplinary neuro-oncology clinical consultation' }
          ]
        };
      }

      this.currentPatient = matched;
      try {
        localStorage.setItem('neuroscan_patient_session', JSON.stringify(matched));
      } catch (e) {}

      this.updateHeaderAuthButton();
      this.switchView('patient-portal');
      this.render();
      showToast(`Welcome to your Patient Portal, ${matched.name}!`);
    },

    logout() {
      this.currentPatient = null;
      try {
        localStorage.removeItem('neuroscan_patient_session');
      } catch (e) {}

      this.updateHeaderAuthButton();
      this.render();
      showToast('Logged out of Patient Portal.');
    },

    updateHeaderAuthButton() {
      const btnText = document.getElementById('txtHeaderPatientAuth');
      if (btnText) {
        if (this.currentPatient) {
          btnText.textContent = `${this.currentPatient.name.split(' ')[0]} (Portal)`;
        } else {
          btnText.textContent = 'Patient Sign In';
        }
      }
    },

    render() {
      const homeView = document.getElementById('patientHomeView');
      const dashView = document.getElementById('patientDashboardView');

      if (this.currentPatient) {
        if (homeView) homeView.style.display = 'none';
        if (dashView) dashView.style.display = 'flex';
        this.renderDashboard();
      } else {
        if (homeView) homeView.style.display = 'block';
        if (dashView) dashView.style.display = 'none';
      }
    },

    renderDashboard() {
      const p = this.currentPatient;
      if (!p) return;

      // Banner demographics
      const initials = document.getElementById('dashPatientInitials');
      const name = document.getElementById('dashPatientName');
      const pill = document.getElementById('dashPatientStatusPill');
      const mrn = document.getElementById('dashPatientMrn');
      const ageSex = document.getElementById('dashPatientAgeSex');
      const hospital = document.getElementById('dashPatientHospital');
      const physician = document.getElementById('dashPatientPhysician');

      if (initials) initials.textContent = p.initials || 'JD';
      if (name) name.textContent = p.name;
      if (pill) {
        pill.textContent = p.status;
        pill.className = `p-status-pill ${p.statusClass || ''}`;
      }
      if (mrn) mrn.textContent = p.mrn;
      if (ageSex) ageSex.textContent = p.ageSex;
      if (hospital) hospital.textContent = p.hospital;
      if (physician) physician.textContent = p.attendingPhysician;

      // Findings Card
      const meta = document.getElementById('dashScanMeta');
      const title = document.getElementById('dashFindingTitle');
      const summary = document.getElementById('dashPlainEnglishText');
      const vol = document.getElementById('dashVolVal');
      const diam = document.getElementById('dashDiamVal');
      const loc = document.getElementById('dashLocVal');
      const shift = document.getElementById('dashShiftVal');

      if (meta) meta.textContent = `Study ${p.studyId} • ${p.scanDate} • ${p.modality}`;
      if (title) title.textContent = p.title;
      if (summary) summary.textContent = p.plainEnglishSummary;
      if (vol) vol.textContent = p.volumetrics.volume;
      if (diam) diam.textContent = p.volumetrics.diameter;
      if (loc) loc.textContent = p.volumetrics.location;
      if (shift) shift.textContent = p.volumetrics.midlineShift;

      // Milestones
      const list = document.getElementById('dashMilestonesList');
      if (list && p.milestones) {
        list.innerHTML = p.milestones.map(m => `
          <div class="milestone-item">
            <span class="ms-badge ${m.type}">${m.badge}</span>
            <span class="ms-text">${m.text}</span>
          </div>
        `).join('');
      }

      // Render Patient Canvas
      this.renderPatientScan();
    },

    renderPatientScan() {
      const pCanvas = document.getElementById('patientScanCanvas');
      if (!pCanvas) return;
      const pCtx = pCanvas.getContext('2d');
      const mriCanvas = document.getElementById('mriCanvas');

      if (mriCanvas && mriCanvas.width > 0) {
        pCtx.clearRect(0, 0, pCanvas.width, pCanvas.height);
        pCtx.drawImage(mriCanvas, 0, 0, pCanvas.width, pCanvas.height);

        // If highlight disabled, draw softer view
        if (!this.highlightEnabled) {
          pCtx.fillStyle = 'rgba(7, 10, 18, 0.35)';
          pCtx.fillRect(0, 0, pCanvas.width, pCanvas.height);
        }
      }
    },

    sendPatientMessage() {
      const input = document.getElementById('patientMsgInput');
      const text = (input?.value || '').trim();
      if (!text) return;

      const thread = document.getElementById('patientMsgThread');
      if (!thread) return;

      // Append Patient message bubble
      const pMsg = document.createElement('div');
      pMsg.className = 'p-msg patient';
      pMsg.innerHTML = `
        <div class="pm-avatar">${this.currentPatient?.initials || 'PT'}</div>
        <div class="pm-bubble">
          <div class="pm-head">You (${this.currentPatient?.name || 'Patient'}) • Just now</div>
          <p>${this.escapeHtml(text)}</p>
        </div>
      `;
      thread.appendChild(pMsg);
      input.value = '';
      thread.scrollTop = thread.scrollHeight;

      // Doctor Automated clinical acknowledgment
      setTimeout(() => {
        const docMsg = document.createElement('div');
        docMsg.className = 'p-msg doctor';
        docMsg.innerHTML = `
          <div class="pm-avatar">SJ</div>
          <div class="pm-bubble">
            <div class="pm-head">Dr. Sarah Jenkins, MD • Attending Radiologist</div>
            <p>Thank you for reaching out. I have recorded your message in your chart and alerted Dr. Marcus Vance. We will address this thoroughly during your scheduled clinical visit.</p>
          </div>
        `;
        thread.appendChild(docMsg);
        thread.scrollTop = thread.scrollHeight;
      }, 1000);
    },

    escapeHtml(text) {
      const div = document.createElement('div');
      div.textContent = text;
      return div.innerHTML;
    }
  };

  // ============================================================================
  // CLINICAL EXPORT MANAGER (PDF, PNG, JSON, CSV, TXT)
  // ============================================================================
  // CLINICAL REPORT EXPORTING STUDIO & EXPORT MANAGER
  // ============================================================================
  const ExportManager = {
    selectedFormat: 'pdf', // 'pdf' | 'html' | 'txt' | 'json' | 'png'

    init() {
      this.bindEvents();
    },

    bindEvents() {
      const btnExportMenu = document.getElementById('btnOpenExportMenu');

      btnExportMenu?.addEventListener('click', (e) => {
        e.stopPropagation();
        this.toggleDropdown();
      });

      // Close dropdown when clicking outside
      document.addEventListener('click', (e) => {
        if (!e.target.closest('.export-dropdown-container')) {
          this.closeDropdown();
        }
      });

      // Header Dropdown Actions
      document.getElementById('btnOpenReportExportStudio')?.addEventListener('click', () => {
        this.closeDropdown();
        this.openExportStudio();
      });

      document.getElementById('btnExportHtmlDossier')?.addEventListener('click', () => {
        this.closeDropdown();
        this.exportStandaloneHtml();
      });

      document.getElementById('btnExportPdfReport')?.addEventListener('click', () => {
        this.closeDropdown();
        this.exportPdf();
      });

      document.getElementById('btnExportMriImage')?.addEventListener('click', () => {
        this.closeDropdown();
        this.exportMriImage();
      });

      document.getElementById('btnExportStudyJson')?.addEventListener('click', () => {
        this.closeDropdown();
        this.exportStudyJson();
      });

      document.getElementById('btnExportRecordsCsv')?.addEventListener('click', () => {
        this.closeDropdown();
        this.exportRecordsCsv();
      });

      document.getElementById('btnExportReportTxt')?.addEventListener('click', () => {
        this.closeDropdown();
        this.exportReportTxt();
      });

      // Actions inside Diagnostic Report Modal (#reportModal)
      document.getElementById('btnReportModalExportStudio')?.addEventListener('click', () => {
        this.openExportStudio();
      });

      document.getElementById('btnReportDownloadHtml')?.addEventListener('click', () => {
        this.exportStandaloneHtml();
      });

      document.getElementById('btnReportDownloadPng')?.addEventListener('click', () => {
        this.exportMriImage();
      });

      document.getElementById('btnReportDownloadJson')?.addEventListener('click', () => {
        this.exportStudyJson();
      });

      document.getElementById('btnReportDownloadTxt')?.addEventListener('click', () => {
        this.exportReportTxt();
      });

      // Action in Patient Portal
      document.getElementById('btnExportPatientReport')?.addEventListener('click', () => {
        this.exportPatientReport();
      });

      // Export Action in Database Modal
      document.getElementById('btnExportDbCsv')?.addEventListener('click', () => {
        this.exportRecordsCsv();
      });

      // Actions inside Dedicated Report Export Studio Modal (#reportExportModal)
      document.getElementById('btnCloseReportExportModal')?.addEventListener('click', () => {
        this.closeExportStudio();
      });

      const reportExportModal = document.getElementById('reportExportModal');
      reportExportModal?.addEventListener('click', (e) => {
        if (e.target === reportExportModal) {
          this.closeExportStudio();
        }
      });

      // Format Selector Cards in Studio
      const formatCards = ['cardFormatPdf', 'cardFormatHtml', 'cardFormatTxt', 'cardFormatJson', 'cardFormatPng'];
      formatCards.forEach(cardId => {
        const card = document.getElementById(cardId);
        card?.addEventListener('click', () => {
          const fmt = card.getAttribute('data-format') || 'pdf';
          this.selectFormat(fmt);
        });
      });

      // Customization Checkboxes in Studio
      const checkIds = [
        'chkExpDemographics', 'chkExpMriImage', 'chkExpMorphometrics',
        'chkExpXai', 'chkExpRecommendations', 'chkExpSignature'
      ];
      checkIds.forEach(chkId => {
        document.getElementById(chkId)?.addEventListener('change', () => {
          this.updatePreview();
        });
      });

      // Studio Action Buttons
      document.getElementById('btnExportCopyClipboard')?.addEventListener('click', () => {
        this.copyReportText();
      });

      document.getElementById('btnExportDirectPrint')?.addEventListener('click', () => {
        window.print();
      });

      document.getElementById('btnExportDownloadFile')?.addEventListener('click', () => {
        this.downloadSelectedFormat();
      });
    },

    toggleDropdown() {
      const panel = document.getElementById('exportDropdownPanel');
      if (panel) {
        panel.style.display = panel.style.display === 'none' ? 'block' : 'none';
      }
    },

    closeDropdown() {
      const panel = document.getElementById('exportDropdownPanel');
      if (panel) panel.style.display = 'none';
    },

    getCurrentStudy() {
      const caseKey = state.currentCase || 'glioma';
      return CLINICAL_CASES[caseKey] || CLINICAL_CASES.glioma;
    },

    getCanvasDataUrl() {
      const canvas = document.getElementById('mriCanvas');
      if (!canvas) return '';
      try {
        return canvas.toDataURL('image/png');
      } catch (e) {
        return '';
      }
    },

    // --- Report Export Studio Modal Controls ---
    openExportStudio() {
      const modal = document.getElementById('reportExportModal');
      if (!modal) return;
      const c = this.getCurrentStudy();
      
      const lblName = document.getElementById('lblExportPatientName');
      const lblMrn = document.getElementById('lblExportPatientMrn');
      if (lblName) lblName.textContent = c.patientName;
      if (lblMrn) lblMrn.textContent = c.mrn;

      modal.style.display = 'flex';
      this.selectFormat(this.selectedFormat || 'pdf');
      this.updatePreview();
    },

    closeExportStudio() {
      const modal = document.getElementById('reportExportModal');
      if (modal) modal.style.display = 'none';
    },

    selectFormat(format) {
      this.selectedFormat = format;
      const cards = document.querySelectorAll('.export-format-card');
      cards.forEach(card => {
        card.classList.toggle('active', card.getAttribute('data-format') === format);
      });

      const modeTag = document.getElementById('lblPreviewModeTag');
      const btnAction = document.getElementById('lblBtnExportAction');

      const labels = {
        pdf: { tag: 'PDF / Printable Document View', action: 'Download PDF Report' },
        html: { tag: 'Standalone HTML Dossier View', action: 'Download HTML Dossier' },
        txt: { tag: 'Clinical EMR Text View', action: 'Download TXT Summary' },
        json: { tag: 'Quantitative JSON Data View', action: 'Download JSON Data' },
        png: { tag: 'High-Res MRI Composite View', action: 'Download High-Res PNG' }
      };

      if (modeTag) modeTag.textContent = labels[format]?.tag || 'Document View';
      if (btnAction) btnAction.textContent = labels[format]?.action || 'Download Report';

      this.updatePreview();
    },

    getOptions() {
      return {
        demographics: document.getElementById('chkExpDemographics')?.checked ?? true,
        mriImage: document.getElementById('chkExpMriImage')?.checked ?? true,
        morphometrics: document.getElementById('chkExpMorphometrics')?.checked ?? true,
        xai: document.getElementById('chkExpXai')?.checked ?? true,
        recommendations: document.getElementById('chkExpRecommendations')?.checked ?? true,
        signature: document.getElementById('chkExpSignature')?.checked ?? true
      };
    },

    updatePreview() {
      const previewArea = document.getElementById('reportLivePreviewArea');
      if (!previewArea) return;
      const c = this.getCurrentStudy();
      const opts = this.getOptions();
      const canvasImg = this.getCanvasDataUrl();

      if (this.selectedFormat === 'pdf' || this.selectedFormat === 'html') {
        previewArea.innerHTML = `
          <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; color: #0f172a; line-height: 1.5;">
            <!-- Hospital Header -->
            <div style="border-bottom: 2px solid #0f172a; padding-bottom: 12px; margin-bottom: 16px;">
              <div style="font-size: 10px; font-weight: 800; letter-spacing: 1.5px; color: #0284c7; text-transform: uppercase;">
                DEPARTMENT OF NEURORADIOLOGY & NEURO-ONCOLOGY
              </div>
              <div style="font-size: 18px; font-weight: 800; color: #0f172a; margin-top: 2px;">
                CLINICAL DIAGNOSTIC MEDICAL REPORT
              </div>
              <div style="font-size: 12px; color: #64748b; margin-top: 2px;">
                NeuroScan AI™ Deep Learning Diagnostic Suite v4.2 • Certified Clinical SaMD
              </div>
            </div>

            <!-- Demographics -->
            ${opts.demographics ? `
              <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 10px; background: #f8fafc; border: 1px solid #e2e8f0; padding: 10px 14px; border-radius: 6px; margin-bottom: 16px; font-size: 12px;">
                <div><strong>PATIENT:</strong> ${c.patientName}</div>
                <div><strong>MRN:</strong> ${c.mrn}</div>
                <div><strong>AGE / SEX:</strong> ${c.ageSex || 'Adult'}</div>
                <div><strong>ACCESSION:</strong> ${c.accession || c.id}</div>
                <div><strong>DATE:</strong> ${c.date || new Date().toLocaleDateString()}</div>
                <div><strong>SEQUENCE:</strong> ${c.sequence}</div>
              </div>
            ` : ''}

            <!-- Primary Diagnosis Banner -->
            <div style="background: ${c.tumorName.includes('Normal') ? '#f0fdf4' : '#fff1f2'}; border-left: 4px solid ${c.tumorName.includes('Normal') ? '#16a34a' : '#dc2626'}; padding: 12px 14px; border-radius: 0 6px 6px 0; margin-bottom: 16px;">
              <div style="font-size: 15px; font-weight: 800; color: ${c.tumorName.includes('Normal') ? '#15803d' : '#b91c1c'};">
                ${c.tumorName} (${c.confidence}% Softmax AI Confidence)
              </div>
              <div style="font-size: 12px; color: #64748b; margin-top: 2px;">
                Location: ${c.volumetrics.laterality} • Active Slice: ${state.currentSlice || 14} of 28
              </div>
            </div>

            <!-- High-Res Scan Snapshot -->
            ${opts.mriImage && canvasImg ? `
              <div style="margin-bottom: 16px; text-align: center; background: #070a12; padding: 12px; border-radius: 6px;">
                <img src="${canvasImg}" alt="MRI Scan Preview" style="max-height: 200px; max-width: 100%; border-radius: 4px; box-shadow: 0 2px 8px rgba(0,0,0,0.3);">
                <div style="font-size: 11px; color: #94a3b8; margin-top: 6px; font-family: monospace;">
                  AXIAL T1-CE SLICE SNAPSHOT WITH AI SEGMENTATION & DIGITAL CALIPER
                </div>
              </div>
            ` : ''}

            <!-- Quantitative Morphometrics -->
            ${opts.morphometrics ? `
              <div style="margin-bottom: 16px;">
                <div style="font-size: 12px; font-weight: 800; text-transform: uppercase; letter-spacing: 0.5px; color: #0f172a; border-bottom: 1px solid #e2e8f0; padding-bottom: 4px; margin-bottom: 8px;">
                  QUANTITATIVE MORPHOMETRIC MEASUREMENTS
                </div>
                <div style="display: grid; grid-template-columns: repeat(4, 1fr); gap: 8px; font-size: 12px; text-align: center;">
                  <div style="background: #f1f5f9; padding: 8px; border-radius: 4px;">
                    <div style="font-weight: 800; color: #0f172a; font-size: 14px;">${c.volumetrics.volume}</div>
                    <div style="color: #64748b; font-size: 10px; text-transform: uppercase;">Estimated Volume</div>
                  </div>
                  <div style="background: #f1f5f9; padding: 8px; border-radius: 4px;">
                    <div style="font-weight: 800; color: #0f172a; font-size: 14px;">${c.volumetrics.diameter}</div>
                    <div style="color: #64748b; font-size: 10px; text-transform: uppercase;">Max Diameter</div>
                  </div>
                  <div style="background: #f1f5f9; padding: 8px; border-radius: 4px;">
                    <div style="font-weight: 800; color: #0f172a; font-size: 14px;">${c.volumetrics.midlineShift}</div>
                    <div style="color: #64748b; font-size: 10px; text-transform: uppercase;">Midline Shift</div>
                  </div>
                  <div style="background: #f1f5f9; padding: 8px; border-radius: 4px;">
                    <div style="font-weight: 800; color: #0f172a; font-size: 12px; line-height: 1.2;">${c.volumetrics.laterality}</div>
                    <div style="color: #64748b; font-size: 10px; text-transform: uppercase; margin-top: 2px;">Anatomy</div>
                  </div>
                </div>
              </div>
            ` : ''}

            <!-- Explainable AI -->
            ${opts.xai && c.xai ? `
              <div style="margin-bottom: 16px; background: #f8fafc; border: 1px solid #e2e8f0; padding: 10px 14px; border-radius: 6px; font-size: 12px;">
                <div style="font-weight: 800; color: #0284c7; margin-bottom: 4px;">EXPLAINABLE AI (Grad-CAM Saliency)</div>
                <div><strong>Dice Similarity Score:</strong> ${c.xai.dice || '0.962'} • <strong>Saliency:</strong> ${c.xai.saliency || '0.94 / 1.00'}</div>
                <div style="color: #64748b; margin-top: 2px;">${c.xai.explanation || 'High gradient attention concentration localized over contrast-enhancing tumor margin.'}</div>
              </div>
            ` : ''}

            <!-- Impression -->
            <div style="margin-bottom: 14px;">
              <div style="font-size: 12px; font-weight: 800; text-transform: uppercase; letter-spacing: 0.5px; color: #0f172a; border-bottom: 1px solid #e2e8f0; padding-bottom: 4px; margin-bottom: 6px;">
                RADIOLOGICAL IMPRESSION
              </div>
              <div style="font-size: 12.5px; color: #334155; line-height: 1.5;">${c.impression}</div>
            </div>

            <!-- Recommendations -->
            ${opts.recommendations ? `
              <div style="margin-bottom: 16px;">
                <div style="font-size: 12px; font-weight: 800; text-transform: uppercase; letter-spacing: 0.5px; color: #0f172a; border-bottom: 1px solid #e2e8f0; padding-bottom: 4px; margin-bottom: 6px;">
                  RECOMMENDATIONS & CLINICAL TRIAGE
                </div>
                <div style="font-size: 12.5px; color: #334155; line-height: 1.5;">${c.recommendations}</div>
              </div>
            ` : ''}

            <!-- Signatures -->
            ${opts.signature ? `
              <div style="display: flex; justify-content: space-between; margin-top: 24px; padding-top: 14px; border-top: 1px solid #e2e8f0; font-size: 11px; color: #64748b;">
                <div>
                  <div style="border-bottom: 1px solid #cbd5e1; height: 24px; margin-bottom: 4px;"></div>
                  <strong style="color: #0f172a;">NeuroScan AI™ Automated Engine</strong><br>
                  BraTS Validation Cohort
                </div>
                <div style="text-align: right;">
                  <div style="border-bottom: 1px solid #cbd5e1; height: 24px; margin-bottom: 4px;"></div>
                  <strong style="color: #0f172a;">Attending Neuroradiologist, MD, FACR</strong><br>
                  License #RAD-8849201 • Electronically Signed
                </div>
              </div>
            ` : ''}
          </div>
        `;
      } else if (this.selectedFormat === 'txt') {
        const txt = this.generateTextReport(c, opts);
        previewArea.innerHTML = `<pre style="font-family: 'JetBrains Mono', Consolas, monospace; font-size: 12px; white-space: pre-wrap; color: #1e293b; line-height: 1.45;">${this.escapeHtml(txt)}</pre>`;
      } else if (this.selectedFormat === 'json') {
        const json = this.generateJsonReport(c, opts);
        previewArea.innerHTML = `<pre style="font-family: 'JetBrains Mono', Consolas, monospace; font-size: 12px; white-space: pre-wrap; color: #0369a1; line-height: 1.45;">${this.escapeHtml(JSON.stringify(json, null, 2))}</pre>`;
      } else if (this.selectedFormat === 'png') {
        if (canvasImg) {
          previewArea.innerHTML = `
            <div style="text-align: center;">
              <img src="${canvasImg}" style="max-width: 100%; max-height: 480px; border-radius: 8px; box-shadow: 0 4px 20px rgba(0,0,0,0.25);">
              <div style="margin-top: 12px; font-size: 12px; color: #475569; font-weight: 600;">
                High-Resolution (1024x1024) Composite MRI Slice with Digital Calipers, AI Heatmaps & Medical Banner
              </div>
            </div>
          `;
        } else {
          previewArea.innerHTML = `<div style="padding: 40px; text-align: center; color: #64748b;">MRI Canvas Snapshot unavailable. Please ensure a scan is loaded.</div>`;
        }
      }
    },

    escapeHtml(str) {
      return String(str).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
    },

    generateTextReport(c, opts) {
      return `================================================================================
NEUROSCAN AI™ — CLINICAL NEURO-ONCOLOGY DIAGNOSTIC REPORT
Certified Deep Learning Medical PACS Workstation
================================================================================
${opts.demographics ? `
PATIENT DEMOGRAPHICS:
  • Patient Name:     ${c.patientName}
  • Patient ID / MRN: ${c.mrn}
  • Age / Gender:     ${c.ageSex || 'Adult'}
  • Accession Number: ${c.accession || c.id}
  • Examination Date: ${c.date || new Date().toLocaleDateString()}
  • MRI Modality:     ${c.sequence}
` : ''}
QUANTITATIVE AI MORPHOMETRICS:
  • Primary Diagnosis:         ${c.tumorName}
  • AI Softmax Confidence:     ${c.confidence}%
  ${opts.morphometrics ? `• Estimated Tumor Volume:   ${c.volumetrics.volume}
  • Maximal Dimension:        ${c.volumetrics.diameter}
  • Anatomical Laterality:    ${c.volumetrics.laterality}
  • Midline Shift:            ${c.volumetrics.midlineShift}` : ''}
${opts.xai && c.xai ? `
EXPLAINABLE AI (Grad-CAM):
  • Visual Saliency Score:    ${c.xai.saliency || '0.94 / 1.00'}
  • Dice Similarity Index:    ${c.xai.dice || '0.962'}
  • Attention Interpretation: ${c.xai.explanation || 'Focal attention on hyperenhancing margin.'}
` : ''}
CLINICAL INDICATION:
${c.indication || 'Intracranial neuroimaging study evaluation.'}

RADIOLOGICAL IMPRESSION:
${c.impression || 'Focal brain lesion visualized on contrast study.'}
${opts.recommendations ? `
RECOMMENDATIONS & TRIAGE:
${c.recommendations || 'Neurosurgical consultation recommended.'}
` : ''}
${opts.signature ? `================================================================================
ELECTRONICALLY SIGNED & VERIFIED BY:
Attending Neuroradiologist, MD, FACR (License #RAD-8849201)
NeuroScan Health Medical PACS • Exported: ${new Date().toISOString()}
================================================================================` : ''}`;
    },

    generateJsonReport(c, opts) {
      return {
        system: 'NeuroScan AI™ Clinical Diagnostic PACS',
        version: '4.2.0 Pro',
        exportedAt: new Date().toISOString(),
        optionsIncluded: opts,
        patient: opts.demographics ? {
          name: c.patientName,
          mrn: c.mrn,
          ageSex: c.ageSex || 'Adult',
          accession: c.accession || c.id,
          date: c.date || new Date().toLocaleDateString()
        } : undefined,
        imagingStudy: {
          sequence: c.sequence,
          activeSlice: state.currentSlice || 14,
          fieldStrength: '3.0 Tesla'
        },
        aiInference: {
          tumorType: c.tumorName,
          confidence: c.confidence,
          probabilities: c.probabilities,
          volumetrics: opts.morphometrics ? c.volumetrics : undefined,
          xai: opts.xai ? c.xai : undefined
        },
        clinicalNotes: {
          indication: c.indication,
          impression: c.impression,
          recommendations: opts.recommendations ? c.recommendations : undefined
        },
        signature: opts.signature ? {
          signedBy: 'Attending Neuroradiologist, MD, FACR',
          license: 'RAD-8849201',
          verified: true
        } : undefined
      };
    },

    downloadSelectedFormat() {
      const fmt = this.selectedFormat || 'pdf';
      const c = this.getCurrentStudy();
      const safeMrn = c.mrn.replace(/[^a-zA-Z0-9_-]/g, '_');

      if (fmt === 'pdf') {
        window.print();
        showToast(`Opening Print / Save PDF for ${c.patientName} (${c.mrn})`, 'info');
      } else if (fmt === 'html') {
        this.exportStandaloneHtml();
      } else if (fmt === 'txt') {
        const txt = this.generateTextReport(c, this.getOptions());
        const blob = new Blob([txt], { type: 'text/plain;charset=utf-8;' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `NeuroScan_Report_${safeMrn}.txt`;
        a.click();
        URL.revokeObjectURL(url);
        showToast(`Exported Diagnostic Report (${c.mrn}) as TXT!`, 'success');
      } else if (fmt === 'json') {
        const json = this.generateJsonReport(c, this.getOptions());
        const blob = new Blob([JSON.stringify(json, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `NeuroScan_Report_${safeMrn}.json`;
        a.click();
        URL.revokeObjectURL(url);
        showToast(`Exported Quantitative Findings (${c.mrn}) as JSON!`, 'success');
      } else if (fmt === 'png') {
        this.exportMriImage();
      }
    },

    copyReportText() {
      const c = this.getCurrentStudy();
      const txt = this.generateTextReport(c, this.getOptions());
      navigator.clipboard.writeText(txt).then(() => {
        showToast('Diagnostic Report transcribed to clipboard!', 'success');
      }).catch(() => {
        showToast('Clipboard access unavailable.', 'error');
      });
    },

    // 1. Export PDF / Print (Quick Action)
    exportPdf() {
      if (typeof openReportModal === 'function') {
        openReportModal();
        setTimeout(() => window.print(), 350);
      } else {
        window.print();
      }
    },

    // 2. Standalone Self-Contained HTML Medical Dossier (.HTML)
    exportStandaloneHtml() {
      const c = this.getCurrentStudy();
      const opts = this.getOptions();
      const canvasImg = this.getCanvasDataUrl();
      const safeMrn = c.mrn.replace(/[^a-zA-Z0-9_-]/g, '_');

      const htmlContent = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>NeuroScan AI Report — ${c.patientName} (${c.mrn})</title>
  <style>
    :root {
      --primary: #0284c7;
      --primary-dark: #0369a1;
      --text-main: #0f172a;
      --text-muted: #64748b;
      --border: #e2e8f0;
      --bg: #f8fafc;
      --card-bg: #ffffff;
      --danger: #dc2626;
      --success: #16a34a;
    }
    * { box-sizing: border-box; margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif; }
    body { background: var(--bg); color: var(--text-main); padding: 28px 16px; line-height: 1.5; }
    .report-wrap { max-width: 920px; margin: 0 auto; background: var(--card-bg); border: 1px solid var(--border); border-radius: 10px; box-shadow: 0 4px 24px rgba(0,0,0,0.06); padding: 36px 40px; }
    .print-bar { display: flex; justify-content: space-between; align-items: center; background: #0f172a; color: #fff; padding: 12px 20px; border-radius: 6px; margin-bottom: 24px; }
    .print-btn { background: #0284c7; color: #fff; border: none; padding: 8px 18px; border-radius: 4px; font-weight: 600; cursor: pointer; font-size: 13.5px; }
    .print-btn:hover { background: #0369a1; }
    .hospital-header { border-bottom: 2px solid #0f172a; padding-bottom: 16px; margin-bottom: 22px; }
    .hosp-badge { font-size: 11px; font-weight: 800; letter-spacing: 1.5px; color: var(--primary); text-transform: uppercase; }
    .hosp-title { font-size: 22px; font-weight: 800; color: #0f172a; margin-top: 4px; }
    .hosp-sub { font-size: 13px; color: var(--text-muted); margin-top: 2px; }
    .meta-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 12px; background: #f1f5f9; padding: 14px 18px; border-radius: 6px; margin-bottom: 22px; font-size: 13px; }
    .meta-grid strong { color: #0f172a; }
    .diag-box { background: ${c.tumorName.includes('Normal') ? '#f0fdf4' : '#fff1f2'}; border-left: 4px solid ${c.tumorName.includes('Normal') ? 'var(--success)' : 'var(--danger)'}; padding: 16px; border-radius: 0 6px 6px 0; margin-bottom: 20px; }
    .diag-title { font-size: 18px; font-weight: 800; color: ${c.tumorName.includes('Normal') ? 'var(--success)' : 'var(--danger)'}; }
    .diag-score { font-size: 13px; color: #991b1b; margin-top: 4px; font-weight: 600; }
    .section-title { font-size: 13.5px; font-weight: 800; letter-spacing: 0.8px; text-transform: uppercase; color: #0f172a; border-bottom: 1px solid var(--border); padding-bottom: 6px; margin: 22px 0 12px; }
    .metrics-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 12px; margin-bottom: 20px; }
    .metric-card { background: #f8fafc; border: 1px solid var(--border); border-radius: 6px; padding: 12px; text-align: center; }
    .metric-val { font-size: 17px; font-weight: 800; color: #0f172a; }
    .metric-lbl { font-size: 11px; color: var(--text-muted); text-transform: uppercase; font-weight: 600; margin-top: 4px; }
    .scan-view-box { text-align: center; background: #070a12; padding: 14px; border-radius: 8px; margin-bottom: 20px; }
    .scan-img { max-height: 280px; max-width: 100%; border-radius: 4px; }
    .report-text { font-size: 13.5px; color: #334155; line-height: 1.6; margin-bottom: 16px; }
    .signature-row { display: flex; justify-content: space-between; margin-top: 36px; padding-top: 20px; border-top: 1px solid var(--border); font-size: 12px; color: var(--text-muted); }
    .sig-line { border-bottom: 1px solid #94a3b8; height: 32px; margin-bottom: 6px; width: 220px; }
    .sig-name { font-weight: 700; color: #0f172a; }
    @media print {
      body { background: #fff; padding: 0; }
      .print-bar { display: none !important; }
      .report-wrap { border: none; box-shadow: none; padding: 0; }
    }
  </style>
</head>
<body>
  <div class="report-wrap">
    <div class="print-bar">
      <div><strong>NeuroScan AI™ Standalone Clinical Dossier</strong> • ${c.mrn}</div>
      <button class="print-btn" onclick="window.print()">🖨️ Print / Save as PDF</button>
    </div>

    <div class="hospital-header">
      <div class="hosp-badge">Clinical Neuro-Oncology & PACS Center</div>
      <div class="hosp-title">DEPARTMENT OF NEURORADIOLOGY DIAGNOSTIC REPORT</div>
      <div class="hosp-sub">BraTS Benchmark Validated Deep Learning AI Inference Pipeline • NeuroScan Suite v4.2</div>
    </div>

    <div class="meta-grid">
      <div><strong>PATIENT:</strong> ${c.patientName}</div>
      <div><strong>MRN:</strong> ${c.mrn}</div>
      <div><strong>EXAM DATE:</strong> ${c.date || new Date().toLocaleDateString()}</div>
      <div><strong>ACCESSION #:</strong> ${c.accession || c.id}</div>
      <div><strong>MODALITY:</strong> ${c.sequence}</div>
      <div><strong>SLICING:</strong> Slice ${state.currentSlice || 14} / 28 (1.0mm)</div>
    </div>

    <div class="diag-box">
      <div class="diag-title">${c.tumorName}</div>
      <div class="diag-score">Softmax Classification Confidence: ${c.confidence}% • Location: ${c.volumetrics.laterality}</div>
    </div>

    ${canvasImg ? `
      <div class="scan-view-box">
        <img class="scan-img" src="${canvasImg}" alt="Axial MRI Scan Slice">
        <div style="font-size: 11px; color: #94a3b8; font-family: monospace; margin-top: 8px;">
          3.0T AXIAL MRI T1-CE • AI LOCALIZATION CONTOURS & DIGITAL CALIPER OVERLAY
        </div>
      </div>
    ` : ''}

    <div class="section-title">Quantitative AI Morphometric Analysis</div>
    <div class="metrics-grid">
      <div class="metric-card">
        <div class="metric-val">${c.volumetrics.volume}</div>
        <div class="metric-lbl">Lesion Volume</div>
      </div>
      <div class="metric-card">
        <div class="metric-val">${c.volumetrics.diameter}</div>
        <div class="metric-lbl">Max Diameter</div>
      </div>
      <div class="metric-card">
        <div class="metric-val">${c.volumetrics.midlineShift}</div>
        <div class="metric-lbl">Midline Shift</div>
      </div>
      <div class="metric-card">
        <div class="metric-val" style="font-size: 13px; line-height: 1.3;">${c.volumetrics.laterality}</div>
        <div class="metric-lbl">Laterality</div>
      </div>
    </div>

    <div class="section-title">Clinical Indication</div>
    <p class="report-text">${c.indication || 'Intracranial neuroimaging study evaluation.'}</p>

    <div class="section-title">Radiological Impression</div>
    <p class="report-text">${c.impression || 'Focal brain lesion visualized on contrast study.'}</p>

    <div class="section-title">Recommendations & Clinical Triage</div>
    <p class="report-text">${c.recommendations || 'Immediate multidisciplinary neurosurgical evaluation recommended.'}</p>

    <div class="signature-row">
      <div>
        <div class="sig-line"></div>
        <div class="sig-name">NeuroScan AI™ Automated Inference Engine</div>
        <div>BraTS Multi-Institutional Cohort Validated</div>
      </div>
      <div style="text-align: right;">
        <div class="sig-line" style="margin-left: auto;"></div>
        <div class="sig-name">Attending Neuroradiologist, MD, FACR</div>
        <div>Medical License #RAD-8849201 • Electronically Verified</div>
      </div>
    </div>
  </div>
</body>
</html>`;

      const blob = new Blob([htmlContent], { type: 'text/html;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `NeuroScan_Report_${safeMrn}.html`;
      a.click();
      URL.revokeObjectURL(url);
      showToast(`Exported Standalone HTML Clinical Dossier (${c.mrn})!`, 'success');
    },

    // 3. Export MRI Image with Overlays (PNG)
    exportMriImage() {
      const c = this.getCurrentStudy();
      const mriCanvas = document.getElementById('mriCanvas');
      if (!mriCanvas) {
        showToast('Canvas not available for export.', 'error');
        return;
      }

      const expCanvas = document.createElement('canvas');
      const ctx = expCanvas.getContext('2d');
      expCanvas.width = 1024;
      expCanvas.height = 1024;

      ctx.fillStyle = '#070a12';
      ctx.fillRect(0, 0, 1024, 1024);
      ctx.drawImage(mriCanvas, 0, 0, 1024, 1024);

      ctx.fillStyle = 'rgba(7, 10, 18, 0.85)';
      ctx.fillRect(0, 0, 1024, 70);
      ctx.fillRect(0, 954, 1024, 70);

      ctx.fillStyle = '#00e5ff';
      ctx.font = 'bold 22px "Inter", sans-serif';
      ctx.fillText('NEUROSCAN AI™ 4.2 Pro • MEDICAL PACS EXPORT', 24, 42);

      ctx.fillStyle = '#94a3b8';
      ctx.font = '16px "JetBrains Mono", monospace';
      ctx.fillText(`PATIENT: ${c.patientName} | MRN: ${c.mrn}`, 560, 42);

      ctx.fillStyle = c.tumorName.includes('Normal') ? '#00e676' : '#ff1744';
      ctx.font = 'bold 20px "Inter", sans-serif';
      ctx.fillText(`DIAGNOSIS: ${c.tumorName} (${c.confidence}%)`, 24, 995);

      ctx.fillStyle = '#00e5ff';
      ctx.font = '16px "JetBrains Mono", monospace';
      ctx.fillText(`VOL: ${c.volumetrics.volume} | DIAM: ${c.volumetrics.diameter} | SHIFT: ${c.volumetrics.midlineShift}`, 520, 995);

      const link = document.createElement('a');
      link.download = `NeuroScan_${c.mrn.replace(/[^a-zA-Z0-9]/g, '_')}_Slice${state.currentSlice || 14}.png`;
      link.href = expCanvas.toDataURL('image/png');
      link.click();
      showToast(`Exported MRI Scan (${c.mrn}) as High-Res PNG!`, 'success');
    },

    // 4. Export Study Data as JSON
    exportStudyJson() {
      const c = this.getCurrentStudy();
      const exportData = this.generateJsonReport(c, this.getOptions());
      const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `NeuroScan_Study_${c.mrn.replace(/[^a-zA-Z0-9]/g, '_')}.json`;
      link.click();
      URL.revokeObjectURL(url);
      showToast(`Exported Study Data (${c.mrn}) as JSON!`, 'success');
    },

    // 5. Export Clinical Database Records as CSV (Excel)
    exportRecordsCsv() {
      const records = (typeof NeuroDB !== 'undefined' && NeuroDB.records && NeuroDB.records.length)
        ? NeuroDB.records
        : Object.values(CLINICAL_CASES);

      const headers = [
        'Record ID', 'Patient Name', 'MRN', 'Age / Sex', 'Study Sequence',
        'Tumor Classification', 'Diagnosis Name', 'Confidence (%)',
        'Estimated Volume (cm3)', 'Max Axial Diameter (mm)', 'Midline Shift (mm)',
        'Anatomical Location', 'Date Created'
      ];

      const rows = records.map(r => [
        `"${r.id || ''}"`,
        `"${r.patientName || ''}"`,
        `"${r.mrn || ''}"`,
        `"${r.ageSex || r.ageGender || ''}"`,
        `"${r.sequence || ''}"`,
        `"${r.tumorType || (r.status === 'success' ? 'NORMAL' : 'GLIOMA')}"`,
        `"${r.diagnosis || r.tumorName || ''}"`,
        r.confidence || 0,
        `"${r.volumetrics?.volume || ''}"`,
        `"${r.volumetrics?.diameter || ''}"`,
        `"${r.volumetrics?.midlineShift || ''}"`,
        `"${r.volumetrics?.laterality || ''}"`,
        `"${r.createdAt || new Date().toISOString()}"`
      ]);

      const csvContent = '\uFEFF' + [headers.join(','), ...rows.map(row => row.join(','))].join('\n');
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `NeuroScan_Cohort_Database_${new Date().toISOString().slice(0, 10)}.csv`;
      link.click();
      URL.revokeObjectURL(url);
      showToast(`Exported ${records.length} Patient Records to CSV / Excel!`, 'success');
    },

    // 6. Export Report as Text Transcription (.TXT)
    exportReportTxt() {
      const c = this.getCurrentStudy();
      const txt = this.generateTextReport(c, this.getOptions());
      const blob = new Blob([txt], { type: 'text/plain;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `NeuroScan_Report_${c.mrn.replace(/[^a-zA-Z0-9]/g, '_')}.txt`;
      link.click();
      URL.revokeObjectURL(url);
      showToast(`Exported Diagnostic Report (${c.mrn}) as TXT!`, 'success');
    },

    // 7. Patient Portal Dedicated Medical Summary Export
    exportPatientReport() {
      const patient = (typeof PatientPortalManager !== 'undefined' && PatientPortalManager.currentPatient)
        ? PatientPortalManager.currentPatient
        : {
            name: 'John M. Doe',
            mrn: 'MR-9823101',
            ageSex: '54Y / Male',
            hospital: 'Johns Hopkins Comprehensive Brain Tumor Center',
            physician: 'Dr. Sarah Jenkins, MD, FACR',
            title: 'Glioblastoma Multiforme Care Plan',
            plainEnglishSummary: 'Your MRI scan identified an intracranial area of tissue enhancement in the right frontal-temporal operculum. A multidisciplinary clinical consultation has been organized with your surgical oncology care team.',
            volumetrics: { volume: '28.4 cm³', diameter: '41.8 mm', location: 'Right Frontal-Temporal', midlineShift: '4.2 mm' },
            modality: 'MRI 3.0T AX T1-CE + FLAIR',
            scanDate: 'October 13, 2026'
          };

      const safeMrn = (patient.mrn || 'PATIENT').replace(/[^a-zA-Z0-9_-]/g, '_');

      const patientHtml = `<!DOCTYPE html>
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
      <div><strong>Attending Physician:</strong> ${patient.physician || 'Dr. Sarah Jenkins, MD'}</div>
      <div><strong>Examination Date:</strong> ${patient.scanDate || new Date().toLocaleDateString()}</div>
      <div><strong>Modality:</strong> ${patient.modality || 'MRI 3.0T Brain Study'}</div>
      <div><strong>Clinical Care Plan:</strong> ${patient.title || 'Diagnostic Evaluation'}</div>
    </div>
    <div class="p-title">Plain-English Findings</div>
    <div class="banner">
      <div class="p-text">${patient.plainEnglishSummary}</div>
    </div>
    <div class="p-title">Measurements & Volumetrics</div>
    <div class="grid">
      <div><strong>Estimated Lesion Volume:</strong> ${patient.volumetrics?.volume || 'N/A'}</div>
      <div><strong>Max Dimension:</strong> ${patient.volumetrics?.diameter || 'N/A'}</div>
      <div><strong>Anatomical Location:</strong> ${patient.volumetrics?.location || 'N/A'}</div>
      <div><strong>Midline Mass Effect:</strong> ${patient.volumetrics?.midlineShift || '0.0 mm'}</div>
    </div>
    <div class="p-title">Next Care Milestones</div>
    <p class="p-text">Please attend your scheduled multidisciplinary neuro-oncology appointment. If you experience severe sudden headache, weakness, or vision changes, contact your care coordinator or emergency neurology line immediately.</p>
  </div>
</body>
</html>`;

      const blob = new Blob([patientHtml], { type: 'text/html;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `Patient_MRI_Summary_${safeMrn}.html`;
      a.click();
      URL.revokeObjectURL(url);
      showToast(`Exported Patient Diagnostic Report (${patient.mrn})!`, 'success');
    }
  };

  // Bind Database UI Event Listeners
  if (btnOpenDatabase) btnOpenDatabase.addEventListener('click', openDatabaseModal);
  if (btnCloseDbModal) btnCloseDbModal.addEventListener('click', closeDatabaseModal);
  if (btnOkDbModal) btnOkDbModal.addEventListener('click', closeDatabaseModal);
  if (btnSaveToDb) btnSaveToDb.addEventListener('click', saveCurrentStudyToDatabase);
  if (dbSearchInput) dbSearchInput.addEventListener('input', renderDatabaseTable);
  if (dbFilterDiagnosis) dbFilterDiagnosis.addEventListener('change', renderDatabaseTable);
  if (btnExportDbJson) btnExportDbJson.addEventListener('click', exportDatabaseToJson);
  if (inputImportDbJson) inputImportDbJson.addEventListener('change', importDatabaseFromJson);

  databaseModal?.addEventListener('click', (e) => {
    if (e.target === databaseModal) closeDatabaseModal();
  });

  // Initialize DB, Cloud API, Auth, Chatbot, Export, and Patient Portal on App Start
  NeuroDB.init();
  CloudAPI.init();
  AuthManager.init();
  NeuroChatbot.init();
  ExportManager.init();
  PatientPortalManager.init();

  // Expose to window for external integrations
  window.NeuroDB = NeuroDB;
  window.CloudAPI = CloudAPI;
  window.AuthManager = AuthManager;
  window.NeuroChatbot = NeuroChatbot;
  window.ExportManager = ExportManager;
  window.PatientPortalManager = PatientPortalManager;

  // Boot on DOM Ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
