@echo off
echo Starting development servers...

start cmd /k "cd %~dp0backend && npm run dev"
echo Backend server starting...

timeout /t 5 /nobreak

start cmd /k "cd %~dp0cosmic-main && npm run dev"
echo Frontend server starting...

echo Both servers are now running!
echo Backend: http://localhost:5000
echo Frontend: http://localhost:5174