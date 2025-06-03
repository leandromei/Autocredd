@echo off
echo 🔧 Configurando ambiente...

REM Configurar frontend
echo.
echo 🔧 Instalando dependências do frontend...
cd frontend_bolt
call npm install

REM Configurar backend
echo.
echo 🔧 Configurando ambiente Python...
cd ..\backend_autocred
python -m venv .venv
call .venv\Scripts\activate
python -m pip install --upgrade pip
pip install -r requirements.txt

REM Inicializar banco de dados
echo.
echo 🔧 Inicializando banco de dados...
python init_db.py

REM Iniciar serviços
echo.
echo 🚀 Iniciando serviços...
start cmd /c "cd ..\backend_autocred && call .venv\Scripts\activate && python -m uvicorn main:app --reload --port 8001"
start cmd /c "cd ..\frontend_bolt && npm run dev"

echo.
echo 💡 Ambiente local pronto para testes!
echo 📱 Frontend: http://localhost:5173
echo 🔧 Backend: http://localhost:8001
echo 📚 API Docs: http://localhost:8001/docs
echo.
echo 🔑 Credenciais de acesso:
echo Email: admin@example.com
echo Senha: admin123

pause 