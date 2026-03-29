@echo off
cd /d "%~dp0"
where npm >nul 2>nul || (
  echo Node.js is not installed or not in PATH. Install from https://nodejs.org
  pause
  exit /b 1
)
if not exist node_modules (
  echo Installing dependencies...
  call npm install
)
echo Starting dev server — your browser should open. Press Ctrl+C to stop.
call npm run dev
pause
