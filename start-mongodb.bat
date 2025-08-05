@echo off
echo Starting MongoDB...

REM Check if MongoDB is installed
where mongod >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo MongoDB is not installed or not in PATH.
    echo Please install MongoDB from https://www.mongodb.com/try/download/community
    pause
    exit /b
)

REM Create data directory if it doesn't exist
if not exist "%~dp0data\db" (
    echo Creating MongoDB data directory...
    mkdir "%~dp0data\db"
)

REM Start MongoDB
echo Starting MongoDB server...
start cmd /k "mongod --dbpath "%~dp0data\db""

echo MongoDB is now running.
echo Data is stored in: %~dp0data\db