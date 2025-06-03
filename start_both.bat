@echo off
echo ==============================================
echo  AutoCred - Iniciando Backend e Frontend
echo ==============================================

echo.
echo 🚀 Iniciando Backend na porta 8000...
start "AutoCred Backend" cmd /k "cd backend_autocred && python api_simple.py"

echo.
echo ⏳ Aguardando backend inicializar...
timeout 3

echo.
echo 🌐 Iniciando Frontend na porta 5173...
start "AutoCred Frontend" cmd /k "cd frontend_bolt && npm run dev"

echo.
echo ✅ Serviços iniciados!
echo.
echo 📧 Login: admin@autocred.com
echo 🔑 Senha: admin123
echo.
echo 🌐 Frontend: http://localhost:5173
echo 🔌 Backend: http://localhost:8000
echo 📋 API Health: http://localhost:8000/api/health
echo.
echo Pressione qualquer tecla para fechar este script...
pause 