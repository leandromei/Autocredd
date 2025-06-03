@echo off

IF "%1"=="install" (
    cd backend_autocred
    python -m venv .venv
    call .venv\Scripts\activate
    pip install -r requirements.txt
    cd ..
    cd frontend_bolt
    npm install
    cd ..
    echo Installation complete!
    exit /b
)

IF "%1"=="dev" (
    start cmd /c "cd backend_autocred && call .venv\Scripts\activate && uvicorn main:app --reload --port 8001"
    start cmd /c "cd frontend_bolt && npm run dev"
    echo 💡 Ambiente local pronto para testes — abra http://localhost:5173
    exit /b
)

IF "%1"=="prod" (
    cd frontend_bolt
    npm run build
    xcopy /E /I /Y dist\* ..\backend_autocred\static
    cd ..
    cd backend_autocred
    call .venv\Scripts\activate
    uvicorn main:app --host 0.0.0.0 --port 8001
    exit /b
)

IF "%1"=="clean" (
    rmdir /s /q backend_autocred\.venv
    rmdir /s /q frontend_bolt\node_modules
    rmdir /s /q frontend_bolt\dist
    rmdir /s /q backend_autocred\static\*
    echo Cleaned up project directories
    exit /b
)

echo Usage: run.bat [install^|dev^|prod^|clean] 