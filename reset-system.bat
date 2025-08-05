@echo off
echo This script will reset the system by reinstalling all node modules.
echo This may take several minutes to complete.
echo.

set /p confirm=Are you sure you want to continue? (Y/N): 
if /i "%confirm%" NEQ "Y" goto :end

echo.
echo Stopping all Node.js processes...
taskkill /F /IM node.exe 2>nul

echo.
echo Deleting node_modules folders...

echo Cleaning backend...
if exist "%~dp0backend\node_modules" (
    rmdir /S /Q "%~dp0backend\node_modules"
    echo Backend node_modules deleted.
)

echo Cleaning dashboard...
if exist "%~dp0dashboard\node_modules" (
    rmdir /S /Q "%~dp0dashboard\node_modules"
    echo Dashboard node_modules deleted.
)

echo Cleaning cosmic-main...
if exist "%~dp0cosmic-main\node_modules" (
    rmdir /S /Q "%~dp0cosmic-main\node_modules"
    echo Cosmic-main node_modules deleted.
)

echo.
echo Reinstalling node modules...

echo Installing backend dependencies...
cd "%~dp0backend"
call npm install
if %ERRORLEVEL% NEQ 0 (
    echo [ERROR] Failed to install backend dependencies.
    goto :error
)

echo Installing dashboard dependencies...
cd "%~dp0dashboard"
call npm install
if %ERRORLEVEL% NEQ 0 (
    echo [ERROR] Failed to install dashboard dependencies.
    goto :error
)

echo Installing cosmic-main dependencies...
cd "%~dp0cosmic-main"
call npm install
if %ERRORLEVEL% NEQ 0 (
    echo [ERROR] Failed to install cosmic-main dependencies.
    goto :error
)

echo.
echo System reset completed successfully!
echo You can now run start-all-servers.bat to start the system.
cd "%~dp0"
goto :end

:error
echo.
echo An error occurred during the reset process.
echo Please check the error messages above and try again.

:end
pause