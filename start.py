#!/usr/bin/env python3
"""
AutoCred Backend - Railway Deployment
"""
import os
import sys
import uvicorn

# Configurar paths
current_dir = os.path.dirname(os.path.abspath(__file__))
backend_dir = os.path.join(current_dir, 'backend_autocred')
sys.path.insert(0, backend_dir)

# Importar app
try:
    from api_simple import app
    print("✅ App importada com sucesso!")
except ImportError as e:
    print(f"❌ Erro ao importar app: {e}")
    sys.exit(1)

if __name__ == "__main__":
    port = int(os.environ.get("PORT", 8001))
    print(f"🚀 Iniciando servidor na porta {port}")
    uvicorn.run(
        app, 
        host="0.0.0.0", 
        port=port,
        access_log=True
    ) 