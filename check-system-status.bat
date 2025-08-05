@echo off
echo Checking system status...
echo.

echo ===== Checking MongoDB Status =====
where mongod >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo [ERROR] MongoDB is not installed or not in PATH.
    echo Please install MongoDB from https://www.mongodb.com/try/download/community
) else (
    echo [OK] MongoDB is installed.
    echo Checking if MongoDB is running...
    netstat -ano | findstr "27017" >nul
    if %ERRORLEVEL% NEQ 0 (
        echo [WARNING] MongoDB does not appear to be running on port 27017.
        echo Run start-mongodb.bat to start MongoDB.
    ) else (
        echo [OK] MongoDB is running on port 27017.
    )
)
echo.

echo ===== Checking Node.js Status =====
where node >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo [ERROR] Node.js is not installed or not in PATH.
    echo Please install Node.js from https://nodejs.org/
) else (
    echo [OK] Node.js is installed.
    node --version
)
echo.

echo ===== Checking Server Status =====
echo Checking if backend server is running...
netstat -ano | findstr "5000" >nul
if %ERRORLEVEL% NEQ 0 (
    echo [WARNING] Backend server does not appear to be running on port 5000.
    echo Run start-all-servers.bat to start all servers.
) else (
    echo [OK] Backend server is running on port 5000.
)

echo Checking if dashboard server is running...
netstat -ano | findstr "5175" >nul
if %ERRORLEVEL% NEQ 0 (
    echo [WARNING] Dashboard server does not appear to be running on port 5175.
    echo Run start-all-servers.bat to start all servers.
) else (
    echo [OK] Dashboard server is running on port 5175.
)

echo Checking if frontend server is running...
netstat -ano | findstr "5174" >nul
if %ERRORLEVEL% NEQ 0 (
    echo [WARNING] Frontend server does not appear to be running on port 5174.
    echo Run start-all-servers.bat to start all servers.
) else (
    echo [OK] Frontend server is running on port 5174.
)
echo.

echo ===== Checking Configuration Files =====
echo Checking backend .env file...
if not exist "%~dp0backend\.env" (
    echo [ERROR] Backend .env file is missing.
) else (
    echo [OK] Backend .env file exists.
)

echo Checking dashboard .env file...
if not exist "%~dp0dashboard\.env" (
    echo [ERROR] Dashboard .env file is missing.
) else (
    echo [OK] Dashboard .env file exists.
)

echo Checking cosmic-main .env file...
if not exist "%~dp0cosmic-main\.env" (
    echo [ERROR] Cosmic-main .env file is missing.
) else (
    echo [OK] Cosmic-main .env file exists.
)
echo.

echo ===== System Status Check Complete =====
echo.
echo If you're experiencing issues, try the following:
echo 1. Run restart-all-servers.bat to restart all servers
echo 2. Check that MongoDB is running (start-mongodb.bat)
echo 3. Verify that all .env files have correct configuration
echo 4. Check that ports 5000, 5174, and 5175 are not being used by other applications
echo.

pause