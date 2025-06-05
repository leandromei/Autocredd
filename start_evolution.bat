@echo off
echo Iniciando Evolution API...

REM Remover container antigo
docker rm -f evolution-api

REM Criar volume para persistência
docker volume create evolution-data

REM Iniciar Evolution API versão 2.2.3
docker run -d --name evolution-api ^
-e AUTHENTICATION_API_KEY=429683C4C977415CAAFCCE10F7D57E11 ^
-e CORS_ORIGIN=* ^
-e STORE_PATH=/store ^
-e WEBSOCKET_ENABLED=true ^
-p 8080:8080 ^
-v evolution-data:/store ^
davidsongomes/evolution-api:2.2.3

echo.
echo Evolution API iniciada! Aguarde alguns segundos...
timeout /t 5

REM Mostrar logs
docker logs evolution-api 