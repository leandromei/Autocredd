# Configurar ambiente frontend
Write-Host "🔧 Configurando ambiente frontend..."
Set-Location frontend_bolt
npm install --force
if ($LASTEXITCODE -eq 0) {
    Write-Host "✅ Dependências do frontend instaladas com sucesso!"
} else {
    Write-Host "❌ Erro ao instalar dependências do frontend"
    exit 1
}

# Configurar ambiente backend
Write-Host "`n🔧 Configurando ambiente backend..."
Set-Location ../backend_autocred
python -m venv .venv
.\.venv\Scripts\Activate.ps1
python -m pip install --upgrade pip
pip install -r requirements.txt
if ($LASTEXITCODE -eq 0) {
    Write-Host "✅ Dependências do backend instaladas com sucesso!"
} else {
    Write-Host "❌ Erro ao instalar dependências do backend"
    exit 1
}

# Inicializar banco de dados
Write-Host "`n🔧 Inicializando banco de dados..."
python init_db.py

# Iniciar serviços
Write-Host "`n🚀 Iniciando serviços..."
Set-Location ..

# Iniciar backend
Start-Process powershell -ArgumentList "-NoExit", "-Command", "Set-Location '$PWD\backend_autocred'; .\.venv\Scripts\activate; uvicorn main:app --reload --port 8000"

# Iniciar frontend
Start-Process powershell -ArgumentList "-NoExit", "-Command", "Set-Location '$PWD\frontend_bolt'; npm run dev"

Write-Host "`n💡 Ambiente local pronto para testes!"
Write-Host "📱 Frontend: http://localhost:5173"
Write-Host "🔧 Backend: http://localhost:8000"
Write-Host "📚 API Docs: http://localhost:8000/docs"

Write-Host "`n🔑 Credenciais de acesso:"
Write-Host "Email: admin@example.com"
Write-Host "Senha: admin123" 