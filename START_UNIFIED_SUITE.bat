@echo off
title NeuroScan AI - Unified Suite Launcher (Port 8080 + Port 5173)
echo ============================================================================
echo   NEUROSCAN AI(TM) UNIFIED PACS SUITE LAUNCHER
echo   Connecting Standalone PACS (Port 8080) + React Pro Suite (Port 5173)
echo ============================================================================
echo.

cd /d "%~dp0"

echo [1/3] Starting Python FastAPI + PyTorch Backend on port 8000...
start "NeuroScan AI - Python FastAPI (8000)" cmd /k "cd /d "%~dp0backend" && (where python >nul 2>nul && (python -m uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload || uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload) || (echo Python not found on PATH.))"

echo [2/3] Starting Standalone PACS Studio & Database Server on port 8080...
start "NeuroScan PACS Server (8080)" cmd /k "cd /d "%~dp0" && (where node >nul 2>nul && node server.js || echo Node.js not found on PATH.)"

echo [3/3] Checking React frontend dependencies...
cd /d "%~dp0frontend"
if not exist node_modules (
    echo [*] Installing dependencies for first-time setup...
    call npm install
)

echo.
echo [*] Starting React + Vite application on port 5173...
echo [*] Opening Unified PACS Portal in your default browser...
timeout /t 3 >nul
start "" http://localhost:5173

call npm run dev
pause
