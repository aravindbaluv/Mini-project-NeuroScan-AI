# NeuroScan AI™ — Full-Stack Deep Learning Medical PACS Suite

### Complete Requested Tech Stack:
- **Frontend**: **React.js (v18)** + **Tailwind CSS (v3)** + **Vite**
- **Backend**: **Python (3.10+)** + **FastAPI** + **Uvicorn**
- **Database**: **MySQL** (via **SQLAlchemy ORM** & PyMySQL with automatic local fallback)
- **Deep Learning**: **PyTorch (v2.x)** + **U-Net** (Multi-compartment segmentation) + **Grad-CAM** (Explainable AI)

---

## 1. Project Architecture

```
c:\Users\HEMANTH\OneDrive\Desktop\Aravind\
├── backend/
│   ├── app/
│   │   ├── main.py              # FastAPI Application & REST Endpoints (/api/predict, /api/patients)
│   │   ├── models/
│   │   │   ├── unet.py          # PyTorch Dual-Task U-Net (Segmentation + Classification)
│   │   │   └── gradcam.py       # PyTorch Grad-CAM Hook Engine & OpenCV Colormap Blending
│   │   └── database/
│   │       ├── db.py            # MySQL Connection Engine with SQLAlchemy
│   │       └── models.py        # ORM Models (Patient, MriStudy, PredictionRecord, Report)
│   └── requirements.txt         # FastAPI, PyTorch, SQLAlchemy, PyMySQL, OpenCV
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── HomePage.jsx     # Public Hospital Web Homepage with Hero & Patient Login
│   │   │   ├── PatientPortal.jsx # Dedicated Patient Medical Dashboard & MRI Findings
│   │   │   └── LoginPage.jsx    # Dual-Portal Authentication (Doctor PACS & Patient Portal)
│   │   ├── App.jsx              # React Main Application & View Router
│   │   ├── main.jsx             # React DOM Root
│   │   └── index.css            # Tailwind CSS Directives & Custom Medical Styling
│   ├── index.html               # Vite Entry Point
│   ├── tailwind.config.js       # Tailwind CSS Configuration & Medical Dark Palette
│   ├── vite.config.js           # Vite Server & Backend Proxy Setup
│   └── package.json             # React, Vite, and Tailwind Dependencies
│
└── README_FULLSTACK.md          # Comprehensive Setup and Execution Guide
```

---

## 2. Multi-Portal Authentication & Access Control

The web suite features a complete **Public Homepage**, **Patient Health Portal**, and **Doctor PACS Workstation**:

### A. Patient Medical Portal (Patients & Families)
- **Login Credentials**: Enter **Patient User ID / MRN** (Medical Record Number) and **Password**.
- **Quick 1-Click Patient Accounts**:
  1. **John M. Doe** (`MR-9823101` / `patient123`) — *High-Grade Glioblastoma Care Plan*
  2. **Eleanor R. Vance** (`MR-4402917` / `patient123`) — *Meningioma Outpatient Surveillance*
  3. **Marcus A. Brody** (`MR-7718290` / `patient123`) — *Pituitary Adenoma Center*
  4. **Sarah L. Connor** (`MR-1092844` / `patient123`) — *Healthy Brain Screening Baseline*
- **Patient Features**:
  - Plain-English explanation of MRI scan findings
  - Volumetric measurements (Volume in $cm^3$, maximal diameter, midline shift)
  - Interactive simplified cross-sectional scan preview
  - Recommended clinical milestones & next surgical appointments
  - Direct secure messaging with attending physician (Dr. Sarah Jenkins)
  - Printable diagnostic health summary

### B. Clinician & Diagnostic PACS Portal (Doctors & Medical Physicists)
- **Login Credentials**: Enter **Clinician User ID / Email** and **Password**.
- **Quick 1-Click Clinician Profiles**:
  1. **Dr. Sarah Jenkins, MD, FACR** (`s.jenkins@hopkins.edu` / `password123`) — *Attending Neuroradiologist*
  2. **Dr. Marcus Vance, MD, FACS** (`m.vance@memorial.org` / `password123`) — *Chief of Neurosurgery*
  3. **Dr. Elena Rostova, MD, PhD** (`e.rostova@stanford.edu` / `password123`) — *Neuro-Oncology Fellow*
- **Clinician Features**:
  - Real-time PyTorch U-Net dual-task multi-compartment segmentation
  - Explainable AI Grad-CAM attention heatmaps with opacity slider
  - Electronic digital caliper measuring tool in real millimeters ($mm$)
  - MySQL clinical database manager with instant scan loading
  - One-click view switcher to the Standalone PACS Studio (Port 8080)

---

## 3. Running the Python FastAPI + PyTorch Backend

### Step 1: Open Terminal & Navigate to `backend`
```powershell
cd "c:\Users\HEMANTH\OneDrive\Desktop\Aravind\backend"
```

### Step 2: Install Python Dependencies
```powershell
pip install -r requirements.txt
```

### Step 3: Configure MySQL (Optional)
By default, the server connects to MySQL at `mysql+pymysql://root:root@localhost:3306/neuroscan_db`. If MySQL is not running, it **automatically falls back to a local SQLite database** so you can develop immediately without setup.

To specify custom MySQL credentials, set environment variables:
```powershell
$env:MYSQL_USER="root"
$env:MYSQL_PASSWORD="your_password"
$env:MYSQL_HOST="localhost"
$env:MYSQL_DB="neuroscan_db"
```

### Step 4: Start the FastAPI Server
```powershell
uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload
```
- API Docs (Swagger): `http://localhost:8000/docs`
- Health Endpoint: `http://localhost:8000/api/health`

---

## 4. Running the React.js + Tailwind CSS Frontend

### Step 1: Open a Second Terminal & Navigate to `frontend`
```powershell
cd "c:\Users\HEMANTH\OneDrive\Desktop\Aravind\frontend"
```

### Step 2: Install Node Dependencies
```powershell
npm install
```

### Step 3: Start the Vite Dev Server
```powershell
npm run dev
```

### Step 4: Open in Browser
Visit `http://localhost:5173`. The React frontend connects directly to the FastAPI backend at `http://localhost:8000` via the configured Vite proxy!

---

## 5. Deep Learning & Model Specifications

### PyTorch U-Net (`backend/app/models/unet.py`)
- **Backbone**: Encoder-Decoder network with skip connections and bottleneck feature pooling.
- **Dual-Task Heads**:
  1. **Segmentation Head**: Identifies BraTS sub-compartments (Necrotic Core, Enhancing Rim, Peritumoral Edema).
  2. **Classification Head**: Dense layers predicting Softmax probabilities across 4 classes: **Glioma**, **Meningioma**, **Pituitary**, and **Normal**.

### PyTorch Grad-CAM (`backend/app/models/gradcam.py`)
- **Target Layer**: `unet.down4` (Bottleneck DoubleConv layer).
- **Mathematical Pipeline**:
  1. Captures forward activation maps $A^k$.
  2. Backpropagates gradients $\frac{\partial Y^c}{\partial A^k}$ with respect to the predicted tumor class.
  3. Computes global average pooled weights $\alpha_k^c$.
  4. Generates rectified heatmap $L_{\text{Grad-CAM}}^c = \text{ReLU}\left(\sum_k \alpha_k^c A^k\right)$.
  5. Blends onto the MRI slice via OpenCV Jet colormap with customizable alpha opacity.

---

## 6. Clinical Report Exporting Suite & Export Studio

The suite includes an enterprise-grade **Clinical Report Exporting Studio** and **Multi-Format Export Hub** accessible directly from the top navigation bar, diagnostic report dialog, and patient medical portal:

| Format | File Type | Description |
|---|---|---|
| **PDF / Print** | `.pdf` | Formatted clinical letterhead report with hospital branding, scan mask & physician sign-off. |
| **Standalone HTML Dossier** | `.html` | Self-contained single-file medical dossier with embedded base64 MRI slice, interactive findings, and 1-click print button. Opens in any browser offline. |
| **PNG (1024x1024)** | `.png` | High-resolution canvas capture with Grad-CAM heatmap, segmentation, caliper measurements, and medical HUD metadata. |
| **JSON Morphometrics** | `.json` | Full quantitative findings, class probabilities, 3D volumetrics, spatial coordinates, and DICOM metadata. |
| **CSV / Excel** | `.csv` | Tabular cohort database of all patient records with UTF-8 BOM encoding for direct Microsoft Excel compatibility. |
| **EMR / EHR Transcription** | `.txt` / `.md` | Lightweight plain-text clinical notes suitable for Cerner, Epic, or Meditech clipboard import. |

### Report Export Endpoints & Single Localhost URLs:
- **Unified Web Suite**: `http://localhost:8080`
- **Clinical Report Export API**: `http://localhost:8080/api/report/export?id=#NS-8042-GBM&format=html`
- **Report Text Summary API**: `http://localhost:8080/api/report/export?id=#NS-8042-GBM&format=txt`
- **Report JSON Findings API**: `http://localhost:8080/api/report/export?id=#NS-8042-GBM&format=json`
- **Database Cohort CSV API**: `http://localhost:8080/api/records/csv`
- **Records REST API**: `http://localhost:8080/api/records`


