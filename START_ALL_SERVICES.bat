@echo off
title NeuroScan AI - All Services Full-Stack Launcher
echo ============================================================================
echo   NEUROSCAN AI(TM) ALL-IN-ONE UNIFIED MEDICAL SYSTEM
echo   Launching All Services:
echo.
echo   - [1] Python FastAPI + PyTorch Server : http://localhost:8000
echo   - [2] Node.js PACS Gateway & Database : http://localhost:8080
echo   - [3] React + Tailwind Vite Frontend  : http://localhost:5173
echo ============================================================================
echo.

cd /d "%~dp0"

echo [*] Starting Python FastAPI Backend (Port 8000)...
start "NeuroScan AI - Python FastAPI (8000)" cmd /k "cd /d "%~dp0backend" && (where python >nul 2>nul && (python -m uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload || uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload) || (echo Python not found on PATH.))"

echo [*] Starting Unified PACS Gateway & Database (Port 8080)...
start "NeuroScan AI - Gateway Server (8080)" cmd /k "cd /d "%~dp0" && (where node >nul 2>nul && node server.js || echo Node.js not found on PATH.)"

echo [*] Starting React + Vite Frontend (Port 5173)...
start "NeuroScan AI - React Vite Frontend (5173)" cmd /k "cd /d "%~dp0frontend" && (if not exist node_modules (echo [*] Installing dependencies... && call npm install) && call npm run dev)"

echo.
echo [*] Waiting 3 seconds for services to initialize...
timeout /t 3 >nul

echo [*] Launching web browsers...
start "" http://localhost:5173
start "" http://localhost:8080

echo.
echo All services launched!
pause
