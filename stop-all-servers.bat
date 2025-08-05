@echo off
echo Stopping all development servers...

echo Stopping Node.js servers (backend, dashboard, frontend)...
taskkill /F /IM node.exe

echo All servers have been stopped.