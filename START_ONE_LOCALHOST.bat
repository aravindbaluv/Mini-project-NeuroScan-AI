@echo off
title NeuroScan AI - Single Localhost Server (Port 8080)
echo ============================================================================
echo   NEUROSCAN AI(TM) - ALL-IN-ONE SINGLE LOCALHOST (PORT 8080)
echo ============================================================================
echo.
echo   ✦ Front Landing Homepage  : http://localhost:8080
echo   ✦ Doctor PACS Workstation : http://localhost:8080 (via Login or Nav)
echo   ✦ Patient Medical Portal  : http://localhost:8080 (via Login or Nav)
echo   ✦ Clinical Records API    : http://localhost:8080/api/records
echo   ✦ AI Deep Learning API    : http://localhost:8080/api/predict
echo.
echo ============================================================================
echo.

cd /d "%~dp0"

echo [*] Opening default web browser to http://localhost:8080 ...
start "" http://localhost:8080

echo [*] Starting NeuroScan Unified Medical Server on port 8080...
where node >nul 2>nul
if %ERRORLEVEL% EQU 0 (
    node server.js
) else (
    echo [!] Node.js not detected on PATH. Opening index.html directly...
    start "" "%~dp0index.html"
)
pause
