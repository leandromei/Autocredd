#!/bin/bash

echo "🚀 CONFIGURANDO EVOLUTION API REAL - SEM SIMULAÇÃO"
echo "=================================================="

# Parar e remover containers antigos se existirem
echo "🧹 Limpando containers antigos..."
docker-compose -f docker-compose.evolution.yml down -v 2>/dev/null || true

# Criar diretórios necessários
echo "📁 Criando diretórios..."
mkdir -p evolution_data/{instances,store,db}

# Configurar permissões
echo "🔐 Configurando permissões..."
chmod -R 755 evolution_data/

# Subir Evolution API
echo "🐳 Iniciando Evolution API REAL..."
docker-compose -f docker-compose.evolution.yml up -d

# Aguardar inicialização
echo "⏳ Aguardando inicialização (30 segundos)..."
sleep 30

# Verificar se está funcionando
echo "🔍 Verificando status..."
if curl -s http://localhost:8081 > /dev/null; then
    echo "✅ Evolution API REAL está funcionando!"
    echo "🔗 URL: http://localhost:8081"
    echo "🔑 API Key: YOUR_SECURE_API_KEY_2024"
    echo ""
    echo "🎯 PRÓXIMOS PASSOS:"
    echo "1. Configure EVOLUTION_API_URL=http://localhost:8081 no Railway"
    echo "2. Configure EVOLUTION_API_KEY=YOUR_SECURE_API_KEY_2024 no Railway"
    echo "3. Teste: POST /api/evolution/auto-configure-free"
    echo "4. Crie instância: POST /api/evolution/test-create/meu_agente"
    echo "5. Obtenha QR: GET /api/evolution/test-qr/meu_agente"
    echo ""
    echo "📱 WhatsApp será REAL - sem simulação!"
else
    echo "❌ Erro ao iniciar Evolution API"
    echo "📋 Verificar logs:"
    docker-compose -f docker-compose.evolution.yml logs
fi 