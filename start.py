#!/usr/bin/env python3
import os
import sys

# Adicionar o diretório do backend ao path
sys.path.append('backend_autocred')

# Importar e executar a aplicação
from api_simple import app
import uvicorn

if __name__ == "__main__":
    port = int(os.environ.get("PORT", 8001))
    uvicorn.run(app, host="0.0.0.0", port=port) 