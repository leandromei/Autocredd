@echo off
echo Iniciando Evolution API para AutoCred...
echo.

REM Verificar se Docker está instalado
docker --version >nul 2>&1
if errorlevel 1 (
    echo ❌ Docker não encontrado! Instale o Docker Desktop primeiro.
    echo Baixe em: https://www.docker.com/products/docker-desktop
    pause
    exit /b 1
)

echo ✅ Docker encontrado!

REM Ir para pasta da Evolution API
cd /d "C:\Users\jovem\Downloads\evolution"

REM Verificar se existe docker-compose.yml
if not exist docker-compose.yml (
    echo ❌ Arquivo docker-compose.yml não encontrado!
    echo Certifique-se de que a Evolution API está na pasta correta.
    pause
    exit /b 1
)

echo 🔄 Iniciando containers da Evolution API...

REM Parar containers existentes se estiverem rodando
docker-compose down

REM Iniciar containers
docker-compose up -d

echo.
echo 🎯 Evolution API iniciada com sucesso!
echo.
echo 📋 Informações importantes:
echo    🌐 URL da API: http://localhost:8081
echo    🔑 API Key: B6D711FCDE4D4FD5936544120E713C37
echo    📊 Postgres: localhost:5432
echo    🗄️  Redis: localhost:6380
echo.
echo 📱 Para usar no AutoCred:
echo    1. Acesse a aba "Agentes WhatsApp" no sistema
echo    2. Crie uma nova instância
echo    3. Escaneie o QR Code com o WhatsApp
echo.

REM Aguardar alguns segundos para verificar se os containers subiram
timeout /t 10 /nobreak >nul

echo 🔍 Verificando status dos containers...
docker-compose ps

echo.
echo ✨ Tudo pronto! A Evolution API está rodando.
echo    Você pode agora voltar ao AutoCred e conectar o WhatsApp.
echo.
pause 