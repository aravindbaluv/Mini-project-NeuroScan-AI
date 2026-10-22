"""
=============================================================================
SQLAlchemy Relational ORM Models for Patients, MRI Studies & AI Predictions
Compatible with MySQL & SQLite
=============================================================================
"""

from datetime import datetime
from sqlalchemy import (
    Column,
    Integer,
    String,
    Float,
    Text,
    DateTime,
    ForeignKey
)
from sqlalchemy.orm import relationship
from .db import Base


class Patient(Base):
    __tablename__ = "patients"

    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    mrn = Column(String(50), unique=True, index=True, nullable=False)
    name = Column(String(100), nullable=False)
    age_gender = Column(String(30), nullable=True)
    clinical_history = Column(Text, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)

    studies = relationship("MriStudy", back_populates="patient", cascade="all, delete-orphan")


class MriStudy(Base):
    __tablename__ = "mri_studies"

    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    patient_id = Column(Integer, ForeignKey("patients.id"), nullable=False)
    accession_no = Column(String(50), unique=True, index=True, nullable=False)
    exam_date = Column(String(50), default=lambda: datetime.utcnow().strftime("%d-%b-%Y"))
    sequence = Column(String(100), default="AX T1-CE + FLAIR")
    image_data_url = Column(Text(length=4294967295), nullable=True)  # LongText for Base64 image
    created_at = Column(DateTime, default=datetime.utcnow)

    patient = relationship("Patient", back_populates="studies")
    prediction = relationship("PredictionRecord", back_populates="study", uselist=False, cascade="all, delete-orphan")
    report = relationship("DiagnosticReport", back_populates="study", uselist=False, cascade="all, delete-orphan")


class PredictionRecord(Base):
    __tablename__ = "predictions"

    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    study_id = Column(Integer, ForeignKey("mri_studies.id"), nullable=False, unique=True)
    model_version = Column(String(50), default="PyTorch-UNet-GradCAM-v4.2")
    predicted_class = Column(String(50), nullable=False)   # GLIOMA, MENINGIOMA, PITUITARY, NORMAL
    diagnosis_name = Column(String(100), nullable=False)
    confidence = Column(Float, nullable=False)
    glioma_prob = Column(Float, default=0.0)
    meningioma_prob = Column(Float, default=0.0)
    pituitary_prob = Column(Float, default=0.0)
    normal_prob = Column(Float, default=0.0)

    # Volumetrics & Bounding Box
    volume_cm3 = Column(Float, default=0.0)
    max_diameter_mm = Column(Float, default=0.0)
    laterality = Column(String(50), default="N/A")
    midline_shift_mm = Column(Float, default=0.0)
    bbox_x = Column(Integer, nullable=True)
    bbox_y = Column(Integer, nullable=True)
    bbox_w = Column(Integer, nullable=True)
    bbox_h = Column(Integer, nullable=True)

    # Explainable AI & Heatmap
    saliency_score = Column(Float, default=0.94)
    dice_score = Column(Float, default=0.962)
    gradcam_data_url = Column(Text(length=4294967295), nullable=True)

    created_at = Column(DateTime, default=datetime.utcnow)

    study = relationship("MriStudy", back_populates="prediction")


class DiagnosticReport(Base):
    __tablename__ = "diagnostic_reports"

    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    study_id = Column(Integer, ForeignKey("mri_studies.id"), nullable=False, unique=True)
    patient_id = Column(Integer, ForeignKey("patients.id"), nullable=False)
    indication = Column(Text, nullable=True)
    findings = Column(Text, nullable=True)
    impression = Column(Text, nullable=False)
    recommendations = Column(Text, nullable=False)
    radiologist_name = Column(String(100), default="Attending Neuroradiologist, MD, FACR")
    created_at = Column(DateTime, default=datetime.utcnow)

    study = relationship("MriStudy", back_populates="report")
