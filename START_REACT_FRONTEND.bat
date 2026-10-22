@echo off
title NeuroScan AI - React Frontend Launcher
echo ====================================================================
echo   NEUROSCAN AI(TM) REACT + VITE FRONTEND LAUNCHER
echo ====================================================================
echo.
cd /d "%~dp0frontend"

if not exist node_modules (
    echo [*] Installing dependencies for first-time setup...
    call npm install
)

echo [*] Starting Vite server on http://localhost:5173...
start "" http://localhost:5173
call npm run dev
pause
