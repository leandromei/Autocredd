#!/bin/bash

echo "🚀 Iniciando build para Railway..."

# Instalar dependências do Python
echo "📦 Instalando dependências Python..."
pip install -r requirements.txt

# Verificar se existe o diretório frontend_bolt
if [ -d "frontend_bolt" ]; then
    echo "🎨 Construindo frontend..."
    cd frontend_bolt
    
    # Instalar dependências do Node.js
    npm install
    
    # Build do frontend
    npm run build
    
    # Voltar para o diretório raiz
    cd ..
    
    # Criar diretório static se não existir
    mkdir -p static
    
    # Copiar arquivos do build para static
    cp -r frontend_bolt/dist/* static/
    
    echo "✅ Frontend construído e copiado para static/"
else
    echo "⚠️ Diretório frontend_bolt não encontrado, pulando build do frontend"
fi

echo "🎉 Build concluído!" 