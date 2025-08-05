@echo off
echo Starting all development servers...

echo Starting Backend server...
start cmd /k "cd %~dp0backend && npm run dev"

timeout /t 5 /nobreak

echo Starting Dashboard server...
start cmd /k "cd %~dp0dashboard && npm run dev"

timeout /t 5 /nobreak

echo Starting Frontend server...
start cmd /k "cd %~dp0cosmic-main && npm run dev"

echo All servers are now running!
echo Backend: http://localhost:5000
echo Dashboard: http://localhost:5175
echo Frontend: http://localhost:5174
echo.
echo Note: Dashboard and Frontend now use different ports.