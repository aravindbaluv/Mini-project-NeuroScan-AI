-- ============================================================================
-- NEUROSCAN AI™ CLINICAL DATABASE RELATIONAL SCHEMA (SQLite / PostgreSQL)
-- Multi-Class Brain Tumor Detection, Classification & Localization System
-- ============================================================================

PRAGMA foreign_keys = ON;

-- 1. Patients Table
CREATE TABLE IF NOT EXISTS patients (
    patient_id VARCHAR(50) PRIMARY KEY,       -- e.g. '#NS-8042-GBM'
    mrn VARCHAR(50) NOT NULL UNIQUE,          -- Medical Record Number e.g. 'MR-9823101'
    patient_name VARCHAR(100) NOT NULL,       -- e.g. 'Doe, John M.'
    age_sex VARCHAR(30),                      -- e.g. '54Y / Male'
    dob DATE,
    referring_physician VARCHAR(100),
    clinical_history TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 2. MRI Scans & Studies Table
CREATE TABLE IF NOT EXISTS mri_studies (
    study_id VARCHAR(50) PRIMARY KEY,         -- Accession # e.g. 'AC-2026-90412'
    patient_id VARCHAR(50) NOT NULL,
    exam_date DATE NOT NULL,
    scanner_model VARCHAR(100) DEFAULT 'SIEMENS MAGNETOM 3.0T',
    magnetic_field_strength VARCHAR(20) DEFAULT '3.0 Tesla',
    sequence VARCHAR(100) NOT NULL,           -- e.g. 'AX T1-CE + FLAIR'
    slice_thickness_mm DECIMAL(4, 2) DEFAULT 1.50,
    pixel_spacing_mm DECIMAL(6, 4) DEFAULT 0.4680,
    total_slices INTEGER DEFAULT 24,
    thumbnail_data TEXT,                      -- Base64 Data URL
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (patient_id) REFERENCES patients(patient_id) ON DELETE CASCADE
);

-- 3. AI Detections & Classifications Table
CREATE TABLE IF NOT EXISTS ai_predictions (
    prediction_id VARCHAR(50) PRIMARY KEY,
    study_id VARCHAR(50) NOT NULL,
    model_version VARCHAR(50) DEFAULT 'NeuroNet-SwinUNETR v4.2',
    detection_status VARCHAR(30) NOT NULL,    -- 'TUMOR DETECTED' or 'NO LESION DETECTED'
    primary_diagnosis VARCHAR(100) NOT NULL,  -- 'Glioblastoma Multiforme', 'Meningioma', 'Pituitary', 'Normal'
    who_grade VARCHAR(20),                    -- 'Grade IV', 'Grade I', 'Non-Neoplastic'
    confidence_score DECIMAL(5, 2) NOT NULL,  -- e.g. 98.40
    glioma_prob DECIMAL(5, 2) DEFAULT 0.00,
    meningioma_prob DECIMAL(5, 2) DEFAULT 0.00,
    pituitary_prob DECIMAL(5, 2) DEFAULT 0.00,
    normal_prob DECIMAL(5, 2) DEFAULT 0.00,
    inference_latency_ms INTEGER DEFAULT 34,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (study_id) REFERENCES mri_studies(study_id) ON DELETE CASCADE
);

-- 4. Tumor Volumetrics & Spatial Localization Table
CREATE TABLE IF NOT EXISTS tumor_localizations (
    localization_id VARCHAR(50) PRIMARY KEY,
    prediction_id VARCHAR(50) NOT NULL,
    volume_cm3 DECIMAL(6, 2) DEFAULT 0.00,    -- e.g. 28.40 cm³
    max_diameter_mm DECIMAL(6, 2) DEFAULT 0.00, -- e.g. 41.80 mm
    laterality VARCHAR(50),                   -- 'Right Frontal-Temporal', 'Left Parietal', 'Sellar'
    midline_shift_mm DECIMAL(4, 2) DEFAULT 0.00, -- e.g. 4.20 mm
    voxel_count INTEGER DEFAULT 0,
    bbox_x INTEGER,
    bbox_y INTEGER,
    bbox_w INTEGER,
    bbox_h INTEGER,
    bbox_slices_range VARCHAR(50),            -- e.g. '10 - 18'
    saliency_score DECIMAL(4, 2) DEFAULT 0.94, -- Grad-CAM attention saliency
    dice_similarity_score DECIMAL(4, 3) DEFAULT 0.962,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (prediction_id) REFERENCES ai_predictions(prediction_id) ON DELETE CASCADE
);

-- 5. Radiological Diagnostic Reports Table
CREATE TABLE IF NOT EXISTS diagnostic_reports (
    report_id VARCHAR(50) PRIMARY KEY,
    study_id VARCHAR(50) NOT NULL,
    patient_id VARCHAR(50) NOT NULL,
    report_status VARCHAR(30) DEFAULT 'CONFIRMED ABNORMAL',
    clinical_indication TEXT,
    technique_summary TEXT,
    quantitative_findings TEXT,
    radiological_impression TEXT,
    clinical_recommendations TEXT,
    attending_radiologist VARCHAR(100) DEFAULT 'Attending Neuroradiologist, MD, FACR',
    license_number VARCHAR(50) DEFAULT 'RAD-8849201',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (study_id) REFERENCES mri_studies(study_id) ON DELETE CASCADE,
    FOREIGN KEY (patient_id) REFERENCES patients(patient_id) ON DELETE CASCADE
);

-- ============================================================================
-- INDEXES FOR FAST QUERYING & PACS LOOKUP
-- ============================================================================
CREATE INDEX IF NOT EXISTS idx_patients_mrn ON patients(mrn);
CREATE INDEX IF NOT EXISTS idx_studies_patient ON mri_studies(patient_id);
CREATE INDEX IF NOT EXISTS idx_predictions_study ON ai_predictions(study_id);
CREATE INDEX IF NOT EXISTS idx_predictions_diag ON ai_predictions(primary_diagnosis);
CREATE INDEX IF NOT EXISTS idx_reports_patient ON diagnostic_reports(patient_id);
