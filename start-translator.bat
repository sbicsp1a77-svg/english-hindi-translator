@echo off
setlocal

title English-Hindi Book Translator

echo ==========================================
echo   English-Hindi Book Translator
echo ==========================================
echo.

set "PROJECT=C:\Users\lukes\english-hindi-translator"
set "BACKEND=%PROJECT%\backend"
set "FRONTEND=%PROJECT%\frontend"

echo Starting backend...
start "Translator Backend" cmd /k "cd /d "%BACKEND%" && call venv\Scripts\activate.bat && uvicorn main:app --host 127.0.0.1 --port 8000"

echo Waiting for backend...
timeout /t 5 /nobreak >nul

echo Starting frontend...
start "Translator Frontend" cmd /k "cd /d "%FRONTEND%" && npm run dev"

echo Waiting for website...
timeout /t 5 /nobreak >nul

echo Opening website...
start "" "http://localhost:5173/"

echo.
echo ==========================================
echo   Translator started successfully!
echo ==========================================
echo.
echo You can close this window.
echo Keep the Backend and Frontend windows open.
echo.

endlocal
