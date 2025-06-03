#!/usr/bin/env python3
"""
AutoCred Backend - Railway Deploy
Versão ultra-simplificada para garantir funcionamento
"""

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
import uvicorn
import os

# Criar aplicação FastAPI
app = FastAPI(title="AutoCred API", version="1.0.0")

# Configurar CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
async def root():
    return {
        "message": "🎉 AutoCred API funcionando perfeitamente!", 
        "status": "online",
        "version": "1.0.0",
        "docs": "/docs",
        "health": "/api/health",
        "login": "admin@autocred.com / admin123"
    }

@app.get("/api/health")
async def health_check():
    return {
        "status": "✅ healthy",
        "message": "Backend AutoCred rodando no Railway",
        "environment": "railway",
        "port": os.getenv("PORT", "8080"),
        "timestamp": "2025-01-18T10:00:00Z"
    }

@app.post("/api/login")
async def simple_login(email: str, password: str):
    """Login simplificado"""
    if email == "admin@autocred.com" and password == "admin123":
        return {
            "success": True,
            "message": "Login realizado com sucesso!",
            "token": "mock_token_123",
            "user": {
                "email": "admin@autocred.com",
                "name": "Admin AutoCred"
            }
        }
    
    raise HTTPException(status_code=401, detail="Credenciais inválidas")

@app.get("/api/leads")
async def get_leads():
    """Retorna leads mockados"""
    return {
        "success": True,
        "leads": [
            {
                "id": "1",
                "name": "João Silva",
                "phone": "(11) 99999-1234",
                "status": "Novo",
                "value": "R$ 15.000",
                "createdAt": "2025-01-18"
            },
            {
                "id": "2", 
                "name": "Maria Santos",
                "phone": "(11) 88888-5678",
                "status": "Em análise",
                "value": "R$ 25.000",
                "createdAt": "2025-01-17"
            }
        ]
    }

@app.get("/api/clients")
async def get_clients():
    """Retorna clientes mockados"""
    return {
        "success": True,
        "clients": [
            {
                "id": "1",
                "name": "Roberto Carlos Silva",
                "phone": "(11) 99999-1234",
                "status": "Ativo",
                "totalContracts": 2,
                "totalValue": "R$ 35.000",
                "lastActivity": "2025-01-18"
            }
        ]
    }

@app.get("/api/contracts")
async def get_contracts():
    """Retorna contratos mockados"""
    return {
        "success": True,
        "contracts": [
            {
                "id": "C001",
                "clientName": "Roberto Silva",
                "value": "R$ 15.000",
                "status": "Ativo",
                "startDate": "2025-01-01",
                "modality": "Crédito Consignado"
            }
        ]
    }

@app.get("/api/environment")
async def get_environment_info():
    """Informações do ambiente"""
    return {
        "environment": "🚀 Railway Production",
        "status": "✅ Online",
        "version": "1.0.0",
        "port": os.getenv("PORT", "8080"),
        "url": "https://autocred.railway.app",
        "docs": "https://autocred.railway.app/docs",
        "timestamp": "2025-01-18T10:00:00Z"
    }

if __name__ == "__main__":
    port = int(os.getenv("PORT", 8001))
    print(f"🚀 AutoCred iniciando na porta {port}")
    print(f"📧 Login: admin@autocred.com")
    print(f"🔑 Senha: admin123")
    uvicorn.run(app, host="0.0.0.0", port=port) 