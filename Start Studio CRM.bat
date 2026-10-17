@echo off
rem Starts Studio CRM and opens it in your browser.
rem Keep this window open while you use the CRM. Close it to stop the CRM.
title Studio CRM - keep this window open
cd /d "%~dp0"

set "NODE=%~dp0runtime\node.exe"
if not exist "%NODE%" set "NODE=node"

"%NODE%" --version >nul 2>&1
if errorlevel 1 (
  echo Node.js was not found.
  echo Download the ready-to-run Studio CRM for Windows, or install Node.js 22 or newer from https://nodejs.org/
  pause
  exit /b 1
)

if not exist "node_modules\better-sqlite3\build\Release\better_sqlite3.node" (
  echo First start: installing. This takes a minute and needs the internet once.
  call npm install --no-audit --no-fund
  if errorlevel 1 (
    echo The install failed. See the messages above.
    pause
    exit /b 1
  )
)

set STUDIO_CRM_OPEN=1
:run
rem An update from Settings stops the CRM with code 75: put the new version in place, then start again.
if exist ".update\ready" (
  echo Installing the update...
  copy /y ".update\new\runtime\node.exe" ".update\node.exe" >nul
  ".update\node.exe" ".update\new\scripts\apply-update.cjs"
)
"%NODE%" server.js
if "%errorlevel%"=="75" (
  set STUDIO_CRM_OPEN=
  goto run
)
echo.
echo Studio CRM has stopped.
pause
