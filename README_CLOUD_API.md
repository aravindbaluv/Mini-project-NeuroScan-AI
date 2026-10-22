# NeuroScan AI™ — Cloud & API Integration Guide

This guide details how to connect the **NeuroScan AI™** frontend PACS system to remote **Cloud AI Inference Endpoints**, **Google Gemini Vision API**, and **Cloud Storage Providers**.

---

## 1. Supported Cloud Providers & Integrations

The web application includes an interactive **Cloud & API Connection Hub** accessible via the **"Cloud & API"** button in the top navigation bar.

| Provider | Purpose | Default / Target Endpoint |
| :--- | :--- | :--- |
| **Custom PyTorch / FastAPI** | Self-hosted ML server on Docker, AWS EC2, or GCP Cloud Run | `http://localhost:3000/api/cloud/predict` or `https://api.your-domain.com/v1/predict` |
| **Google Gemini Vision API** | Multimodal clinical second opinions & lesion characterization | `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent` |
| **GCP Vertex AI / SageMaker** | Enterprise managed healthcare AI pipeline | `https://us-central1-aiplatform.googleapis.com/.../endpoints/brain-tumor:predict` |
| **Firebase / Cloud PACS** | Cloud Firestore patient records & Cloud Storage DICOM sync | `https://firestore.googleapis.com/v1/projects/.../databases/(default)/documents` |

---

## 2. Connecting to a Cloud API via the Web UI

1. Open the website: [`index.html`](file:///c:/Users/HEMANTH/OneDrive/Desktop/Aravind/index.html).
2. Click **"Cloud & API"** in the top navigation bar.
3. Select your Cloud Provider card (*Custom PyTorch*, *Google Gemini*, *Vertex AI*, or *Firebase*).
4. Enter your **Cloud Endpoint URL** and **API Key / Bearer Token** (tokens are stored securely in local browser storage).
5. Click **"Ping & Test API"**:
   - The system performs a live latency test (e.g. `38ms Latency [200 OK]`).
   - Displays GPU hardware metadata and model tensor verification.
6. Click **"Save & Apply Cloud Configuration"**:
   - The top header badge updates to reflect your active cloud provider (`CLOUD: Gemini Vision AI` or `CLOUD: Custom API`).

---

## 3. Serving a Real PyTorch Model with FastAPI ([`cloud_model_server.py`](file:///c:/Users/HEMANTH/OneDrive/Desktop/Aravind/cloud_model_server.py))

A production-ready Python FastAPI microservice is included in the project:

### Requirements:
```bash
pip install fastapi uvicorn pydantic
```

### Run the Server:
```bash
uvicorn cloud_model_server:app --host 0.0.0.0 --port 8000 --reload
```

- **Swagger Documentation**: Available at `http://localhost:8000/docs`
- **Inference Endpoint**: `POST http://localhost:8000/api/cloud/predict`

### JSON Request Payload:
```json
{
  "image_data": "data:image/jpeg;base64,...",
  "model": "neuro-swin-v4",
  "region": "us-central1"
}
```

### JSON Response Payload:
```json
{
  "status": "SUCCESS",
  "inference_engine": "Cloud-PyTorch-v4.2-TensorRT",
  "latency_ms": 38,
  "model_version": "neuro-swin-v4",
  "detection_status": "TUMOR DETECTED",
  "primary_diagnosis": "Glioblastoma Multiforme (GBM)",
  "confidence": 98.7,
  "probabilities": {
    "glioma": 98.7,
    "meningioma": 0.8,
    "pituitary": 0.3,
    "normal": 0.2
  },
  "localization": {
    "volume_cm3": 28.4,
    "max_diameter_mm": 41.8,
    "laterality": "Right Frontal-Temporal",
    "midline_shift_mm": 4.2,
    "bbox": { "x": 145, "y": 155, "w": 125, "h": 130 }
  },
  "radiological_impression": "Cloud neural ensemble isolated solitary ring-enhancing intra-axial lesion centered within the right frontal-temporal operculum with central necrosis."
}
```

---

## 4. Google Cloud Run Docker Deployment (Production)

To deploy the cloud API to **Google Cloud Run**:

```dockerfile
FROM python:3.11-slim
WORKDIR /app
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt
COPY cloud_model_server.py .
EXPOSE 8080
CMD ["uvicorn", "cloud_model_server:app", "--host", "0.0.0.0", "--port", "8080"]
```

Deploy command:
```bash
gcloud run deploy neuroscan-cloud-ai \
  --source . \
  --region us-central1 \
  --allow-unauthenticated
```
Then copy the generated HTTPS URL into the web app's **Cloud Endpoint URL** field!
