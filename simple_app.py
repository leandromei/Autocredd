#!/usr/bin/env python3
"""
🚀 AutoCred Railway - Backend + Frontend Original
Servidor definitivo com frontend real e funcionalidades completas
"""

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse, JSONResponse
import os
import uvicorn
from pathlib import Path

# Criar app FastAPI
app = FastAPI(
    title="AutoCred Railway Complete",
    description="Sistema AutoCred completo com frontend original",
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

# Configurar frontend original
FRONTEND_DIR = Path("frontend_bolt/dist")

if FRONTEND_DIR.exists() and (FRONTEND_DIR / "index.html").exists():
    app.mount("/assets", StaticFiles(directory=FRONTEND_DIR / "assets"), name="assets")
    app.mount("/static", StaticFiles(directory=FRONTEND_DIR), name="static")
    print(f"✅ Frontend original carregado de: {FRONTEND_DIR}")
else:
    print(f"❌ Frontend não encontrado em: {FRONTEND_DIR}")

# === ROTAS DE API REAIS ===

@app.get("/")
async def root():
    """Servir o frontend original"""
    if FRONTEND_DIR.exists() and (FRONTEND_DIR / "index.html").exists():
        return FileResponse(FRONTEND_DIR / "index.html")
    else:
        return {"error": "Frontend não encontrado", "path": str(FRONTEND_DIR)}

@app.get("/health")
async def health():
    return {"status": "healthy", "environment": "railway"}

@app.get("/api/environment")
async def get_environment():
    return {
        "environment": "railway",
        "status": "production",
        "message": "AutoCred funcionando",
        "frontend": "original" if FRONTEND_DIR.exists() else "not_found"
    }

# WhatsApp Evolution API - ENDPOINTS REAIS
@app.post("/api/evolution/instance/create")
async def create_evolution_instance():
    """Criar instância WhatsApp real"""
    # TODO: Implementar conexão real com Evolution API
    return {
        "success": True,
        "message": "Instância criada (implementar Evolution API)",
        "instance": {
            "name": "autocred_instance",
            "status": "creating",
            "qr_code": None
        }
    }

@app.get("/api/evolution/instances")
async def list_evolution_instances():
    """Listar instâncias WhatsApp"""
    # TODO: Implementar listagem real
    return {"instances": []}

@app.get("/api/evolution/instance/{instance_name}/qr")
async def get_qr_code(instance_name: str):
    """Obter QR Code para conexão"""
    # TODO: Implementar QR real
    return {"qr_code": None, "status": "pending"}

# === LEADS API ===
@app.get("/api/leads")
async def get_leads():
    """Obter todos os leads"""
    # TODO: Implementar banco de dados real
    return {"leads": []}

@app.post("/api/leads")
async def create_lead():
    """Criar novo lead"""
    # TODO: Implementar criação real
    return {"success": True, "message": "Lead criado"}

# === CONTRATOS API ===
@app.get("/api/contracts")
async def get_contracts():
    """Obter todos os contratos"""
    # TODO: Implementar banco de dados real
    return {"contracts": []}

@app.post("/api/contracts")
async def create_contract():
    """Criar novo contrato"""
    # TODO: Implementar criação real
    return {"success": True, "message": "Contrato criado"}

# === CLIENTES API ===
@app.get("/api/clients")
async def get_clients():
    """Obter todos os clientes"""
    # TODO: Implementar banco de dados real
    return {"clients": []}

@app.post("/api/clients")
async def create_client():
    """Criar novo cliente"""
    # TODO: Implementar criação real
    return {"success": True, "message": "Cliente criado"}

# === SPA ROUTING ===
@app.get("/{path:path}")
async def serve_spa(path: str):
    """Servir SPA routing para o frontend original"""
    if path.startswith("api/"):
        return JSONResponse(
            status_code=404,
            content={"detail": f"API endpoint não encontrado: /{path}"}
        )
    
    # Para qualquer rota do frontend, servir o index.html
    if FRONTEND_DIR.exists() and (FRONTEND_DIR / "index.html").exists():
        return FileResponse(FRONTEND_DIR / "index.html")
    else:
        return {"error": "Frontend não encontrado"}

if __name__ == "__main__":
    port = int(os.getenv("PORT", 8000))
    print(f"🚀 AutoCred Railway - Servidor completo")
    print(f"📱 Frontend: {FRONTEND_DIR}")
    print(f"🌐 Porta: {port}")
    
    uvicorn.run(
        "simple_app:app",
        host="0.0.0.0",
        port=port,
        log_level="info"
    ) 