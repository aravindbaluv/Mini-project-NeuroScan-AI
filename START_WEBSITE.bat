@echo off
title NeuroScan AI - Unified Medical PACS Workstation Launcher
echo ====================================================================
echo   NEUROSCAN AI(TM) UNIFIED CLINICAL PACS WORKSTATION
echo   Connecting Port 8080 (PACS Server) and Port 5173 (React Pro Suite)
echo ====================================================================
echo.

where node >nul 2>nul
if %ERRORLEVEL% EQU 0 (
    echo [1/2] Starting Standalone PACS Studio & Database on port 8080...
    start "NeuroScan PACS Server (8080)" cmd /c "node server.js"

    echo [2/2] Launching React Pro Suite on port 5173...
    cd /d "%~dp0frontend"
    if not exist node_modules (
        echo [*] Installing frontend dependencies (first time only)...
        call npm install
    )
    timeout /t 2 >nul
    start "" http://localhost:5173
    call npm run dev
) else (
    echo [INFO] Opening index.html directly in default browser...
    start "" "%~dp0index.html"
)
pause
