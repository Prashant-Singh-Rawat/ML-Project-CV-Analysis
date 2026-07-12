@echo off
title TonyCV Development Server
echo =======================================
echo     Starting TonyCV Servers...
echo =======================================
echo.
echo Please leave this window open while you are working.
echo To STOP the servers, simply close this window!
echo.
powershell -ExecutionPolicy Bypass -File "%~dp0start_local.ps1"
