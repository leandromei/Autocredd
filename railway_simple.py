#!/usr/bin/env python3
"""
🚀 AutoCred Railway - Versão Simplificada para Teste
"""

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
import os
import uvicorn

# Criar app FastAPI
app = FastAPI(
    title="AutoCred Railway Test",
    description="Versão simplificada para teste Railway",
    version="1.0.0"
)

# CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
async def root():
    return {"message": "AutoCred Railway funcionando!", "status": "success"}

@app.get("/health")
async def health():
    return {"status": "healthy", "environment": "railway"}

@app.get("/api/environment")
async def get_environment():
    return {
        "environment": "railway",
        "status": "active",
        "message": "Backend funcionando perfeitamente!"
    }

@app.post("/api/evolution/instance/create")
async def create_instance():
    return {
        "success": True,
        "message": "Instância WhatsApp criada com sucesso (modo simulado)",
        "instance": {
            "name": "test_instance",
            "status": "connected",
            "qr_code": "simulado"
        }
    }

@app.get("/api/evolution/instances")
async def list_instances():
    return {
        "instances": [
            {
                "name": "test_instance",
                "status": "connected"
            }
        ]
    }

if __name__ == "__main__":
    port = int(os.getenv("PORT", 8000))
    uvicorn.run(
        "railway_simple:app",
        host="0.0.0.0",
        port=port,
        log_level="info"
    ) 