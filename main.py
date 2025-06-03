#!/usr/bin/env python3
"""
AutoCred Backend - Railway Deploy
Versão simplificada para resolver problemas de importação
"""

from fastapi import FastAPI, HTTPException, Depends
from fastapi.middleware.cors import CORSMiddleware
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm
from pydantic import BaseModel
import uvicorn
import os
from typing import Dict, Any

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

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="token")

# Usuários simulados
USERS_DB = {
    "admin@autocred.com": {
        "email": "admin@autocred.com",
        "password": "admin123",
        "full_name": "Admin AutoCred",
        "is_active": True
    }
}

class LoginResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"

class User(BaseModel):
    email: str
    full_name: str
    is_active: bool

def authenticate_user(email: str, password: str) -> Dict[str, Any] | None:
    """Autentica um usuário"""
    user = USERS_DB.get(email)
    if not user:
        return None
    if password != user["password"]:
        return None
    return user

@app.get("/")
async def root():
    return {
        "message": "AutoCred API está funcionando!", 
        "status": "online",
        "version": "1.0.0",
        "docs": "/docs",
        "health": "/api/health"
    }

@app.get("/api/health")
async def health_check():
    return {
        "status": "healthy",
        "message": "Backend AutoCred rodando",
        "environment": os.getenv("RAILWAY_ENVIRONMENT", "development"),
        "port": os.getenv("PORT", "8080")
    }

@app.post("/api/token", response_model=LoginResponse)
async def login_for_access_token(form_data: OAuth2PasswordRequestForm = Depends()):
    """Endpoint de login"""
    user = authenticate_user(form_data.username, form_data.password)
    if not user:
        raise HTTPException(
            status_code=401,
            detail="Email ou senha incorretos",
            headers={"WWW-Authenticate": "Bearer"},
        )
    
    access_token = f"token_{user['email']}"
    return {"access_token": access_token, "token_type": "bearer"}

@app.get("/api/me", response_model=User)
async def read_users_me(token: str = Depends(oauth2_scheme)):
    """Retorna dados do usuário atual"""
    email = token.replace("token_", "")
    user = USERS_DB.get(email)
    if user is None:
        raise HTTPException(status_code=401, detail="Token inválido")
    
    return User(
        email=user["email"],
        full_name=user["full_name"],
        is_active=user["is_active"]
    )

@app.get("/api/leads")
async def get_leads():
    """Retorna lista de leads mockados"""
    return {
        "leads": [
            {
                "id": "1",
                "name": "Roberto Almeida",
                "cpf": "123.456.789-01",
                "phone": "(11) 98765-4321",
                "source": "Ura",
                "modality": "Portabilidade",
                "status": "Novo",
                "assignedTo": "Ana Rodrigues",
                "createdAt": "2025-05-09T14:30:00Z",
                "installment": "R$ 450,00",
                "outstandingBalance": "R$ 12.500,00"
            }
        ]
    }

@app.get("/api/clients")
async def get_clients():
    """Retorna lista de clientes mockados"""
    return {
        "clients": [
            {
                "id": "1",
                "name": "Roberto Carlos Silva",
                "cpf": "123.456.789-01",
                "phone": "(11) 99999-1234",
                "status": "ativo",
                "contractsCount": 3,
                "totalValue": 15500.00,
                "lastActivity": "2025-05-10T14:30:00Z",
                "notes": "Cliente VIP com excelente histórico de pagamento"
            }
        ]
    }

@app.get("/api/contracts")
async def get_contracts():
    """Retorna lista de contratos mockados"""
    return {
        "contracts": [
            {
                "id": "1001",
                "clientName": "Roberto Almeida",
                "clientId": "1",
                "planName": "Plano Básico",
                "value": 5400.0,
                "status": "active",
                "startDate": "2025-04-01T00:00:00Z"
            }
        ]
    }

@app.get("/api/environment")
async def get_environment_info():
    """Retorna informações do ambiente atual"""
    return {
        "environment": "railway",
        "port": os.getenv("PORT", "8080"),
        "railway_public_domain": os.getenv("RAILWAY_PUBLIC_DOMAIN"),
        "webhook_url": f"https://autocred.railway.app/webhook/evolution",
        "version": "1.0.0",
        "status": "online"
    }

if __name__ == "__main__":
    port = int(os.getenv("PORT", 8001))
    print(f"🚀 Iniciando AutoCred na porta {port}")
    uvicorn.run(app, host="0.0.0.0", port=port) 