@echo off
title NeuroScan AI - Full-Stack Complete System Launcher
echo ============================================================================
echo   NEUROSCAN AI(TM) COMPLETE FULL-STACK MEDICAL SYSTEM LAUNCHER
echo ============================================================================
echo.
echo   [1/3] Python FastAPI + PyTorch Server : http://localhost:8000
echo   [2/3] Unified PACS Gateway & Database : http://localhost:8080
echo   [3/3] React + Tailwind Vite Frontend  : http://localhost:5173
echo.
echo ============================================================================
echo.

cd /d "%~dp0"

:: 1. Start Python FastAPI Backend Server
echo [*] [1/3] Starting Python FastAPI + PyTorch Backend on Port 8000...
start "NeuroScan AI - Python FastAPI Backend (Port 8000)" cmd /k "cd /d "%~dp0backend" && (where python >nul 2>nul && (python -m uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload || uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload) || (echo Python was not found on PATH. Please verify Python is installed.))"

:: 2. Start Node.js Unified PACS Gateway Server
echo [*] [2/3] Starting Unified PACS Gateway & Database Server on Port 8080...
start "NeuroScan AI - PACS Gateway Server (Port 8080)" cmd /k "cd /d "%~dp0" && (where node >nul 2>nul && node server.js || echo Node.js was not found on PATH.)"

:: 3. Start React + Vite Frontend
echo [*] [3/3] Starting React Pro Suite on Port 5173...
start "NeuroScan AI - React Vite Frontend (Port 5173)" cmd /k "cd /d "%~dp0frontend" && (if not exist node_modules (echo [*] Installing dependencies... && call npm install) && call npm run dev)"

:: 4. Launch Browser
echo.
echo [*] Waiting 3 seconds for servers to initialize...
timeout /t 3 >nul

echo [*] Opening NeuroScan AI in your default web browser...
start "" http://localhost:5173
start "" http://localhost:8080

echo.
echo ============================================================================
echo   NEUROSCAN AI SERVICES ARE NOW RUNNING!
echo.
echo   - React Clinical Workstation & Patient Portal : http://localhost:5173
echo   - Standalone PACS Gateway & Database API      : http://localhost:8080
echo   - FastAPI Backend Swagger API Docs            : http://localhost:8000/docs
echo ============================================================================
echo.
pause
