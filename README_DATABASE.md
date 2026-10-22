# NeuroScan AI™ — Clinical Database Integration Guide

The **NeuroScan AI™** Brain Tumor Detection, Classification & Localization system implements a **dual-tier clinical database architecture** providing both zero-setup browser persistence and a full-stack REST API backend.

---

## 1. Dual-Tier Database Architecture

| Feature | Tier 1: Browser-Native (IndexedDB) | Tier 2: Backend REST API (Node.js & SQLite) |
| :--- | :--- | :--- |
| **Storage Engine** | Native W3C IndexedDB (`NeuroScanDB_v1`) | Node.js Server + SQLite File (`neuroscan_db.json`) |
| **Setup Required** | **Zero Setup** (Double-click `index.html`) | Run `node server.js` |
| **Network Needed** | Fully Offline | Localhost (`http://localhost:3000`) |
| **Data Managed** | Patients, Scans, Detections, Volumetrics, Reports | Full Relational REST API Sync |
| **Backup / Restore** | JSON Export & Import via UI | SQL Dump / Automated JSON Persistence |

---

## 2. Using the In-App Database Manager

Click the **"Records DB"** button in the top navigation header:
1. **Search & Filter**: Search across records by patient name, MRN, diagnosis, or accession number. Filter by tumor classification (All, Glioma, Meningioma, Pituitary, Normal).
2. **Instant PACS Loading**: Click **"Load Scan"** next to any record to immediately load the patient's MRI cross-section, bounding box, and segmentation mask into the DICOM viewer.
3. **Clinical Reports**: Click **"Report"** to view and print the patient's complete radiological diagnostic summary.
4. **Save Studies**: Click **"Save Study to Database"** in the right-hand panel at any time to archive a new scan and AI classification.
5. **Backup & Restore**: Use **"Export JSON"** to download database backups and **"Import JSON"** to restore records.

---

## 3. Relational SQL Schema ([`schema.sql`](file:///c:/Users/HEMANTH/OneDrive/Desktop/Aravind/schema.sql))

The database schema is structured around 5 interconnected clinical entities:

1. **`patients`**: Demographics (MRN, Name, Age, Sex, Referring Clinician, History).
2. **`mri_studies`**: Imaging parameters (Accession #, Exam Date, Scanner Model, Field Strength, Sequence, Slice Thickness, Pixel Spacing).
3. **`ai_predictions`**: Deep learning outputs (Model Version, Detection Status, Primary Diagnosis, WHO Grade, Softmax Probabilities, Inference Latency).
4. **`tumor_localizations`**: 3D Morphometrics (Volume in $cm^3$, Longest Diameter in $mm$, Lateralization, Midline Shift, Bounding Box coordinates, Grad-CAM Saliency, Dice Score).
5. **`diagnostic_reports`**: Radiologist documentation (Indication, Findings, Impression, Surgical/Oncological Recommendations, Digital Sign-off).

---

## 4. Running the Backend Server ([`server.js`](file:///c:/Users/HEMANTH/OneDrive/Desktop/Aravind/server.js))

To start the backend REST API:

```powershell
# Open terminal in project directory
cd "c:\Users\HEMANTH\OneDrive\Desktop\Aravind"

# Start the server (runs on Node.js built-in modules)
node server.js
```

### Server Endpoints:
- `GET  /api/health` — Checks database status and active storage engine.
- `GET  /api/records` — Returns all saved patient studies and predictions.
- `POST /api/records` — Archives a new patient study, scan, and diagnostic report.
- `GET  /api/stats` — Returns aggregate counts by tumor classification.
- `DELETE /api/records/:id` — Deletes a patient study by ID.

When `server.js` is running, the frontend **automatically detects the backend** and displays:
`DATABASE: SQLite API (Synced)` in the header. If the server is stopped, it gracefully falls back to **IndexedDB** with zero disruption.
