@echo off
echo =======================================
echo     Stopping TonyCV Servers...
echo =======================================
echo.

echo Stopping Frontend (Port 5173)...
FOR /F "tokens=5" %%T IN ('netstat -a -n -o ^| findstr :5173') DO (
  taskkill /F /PID %%T 2>NUL
)

echo Stopping Backend (Port 8000)...
FOR /F "tokens=5" %%T IN ('netstat -a -n -o ^| findstr :8000') DO (
  taskkill /F /PID %%T 2>NUL
)

echo.
echo Servers have been successfully stopped!
pause
