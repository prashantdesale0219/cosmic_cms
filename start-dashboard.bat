@echo off
echo Starting Dashboard server...

cd "%~dp0dashboard"
start cmd /k "npm run dev"

echo Dashboard server is starting on http://localhost:5175
echo.
echo Note: Make sure the backend server is already running on port 5000.
echo If the backend is not running, please run start-backend.bat first.