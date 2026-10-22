@echo off
title NeuroScan AI - Medical PACS Server (Port 8080)
echo ====================================================================
echo   NEUROSCAN AI(TM) MEDICAL PACS SYSTEM
echo   Running on: http://localhost:8080
echo ====================================================================
echo.
cd /d "%~dp0"

echo [*] Opening browser to http://localhost:8080 ...
start "" http://localhost:8080

echo [*] Starting NeuroScan Server...
node server.js
if %ERRORLEVEL% NEQ 0 (
    echo.
    echo [*] Node.js not detected. Opening index.html directly...
    start "" "%~dp0index.html"
)
pause
