#!/usr/bin/env python3
"""
🚀 AutoCred Railway - Backend Real + Frontend Original
Sistema completo com funcionalidades reais - SEM simulações
"""

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse, JSONResponse
from pydantic import BaseModel
import os
import uvicorn
from pathlib import Path
import httpx
from typing import Optional

# Modelos de dados reais
class Lead(BaseModel):
    id: Optional[int] = None
    name: str
    email: str
    phone: str
    status: str = "new"

class Client(BaseModel):
    id: Optional[int] = None
    name: str
    email: str
    phone: str
    document: str

class Contract(BaseModel):
    id: Optional[int] = None
    client_id: int
    value: float
    status: str = "pending"

# Criar app FastAPI
app = FastAPI(
    title="AutoCred Real System",
    description="Sistema AutoCred completo e funcional",
    version="2.0.0"
)

# CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Configurar frontend ORIGINAL
FRONTEND_DIR = Path("dist_frontend")

if FRONTEND_DIR.exists() and (FRONTEND_DIR / "index.html").exists():
    # Montar assets (CSS e JS)
    app.mount("/assets", StaticFiles(directory=FRONTEND_DIR / "assets"), name="assets")
    # Montar outros arquivos estáticos (vite.svg, etc.)
    app.mount("/static", StaticFiles(directory=FRONTEND_DIR), name="static")
    print(f"✅ Frontend ORIGINAL carregado: {FRONTEND_DIR}")
else:
    print(f"❌ Frontend original não encontrado: {FRONTEND_DIR}")

# Banco de dados em memória (temporário)
leads_db = []
clients_db = []
contracts_db = []

# === FRONTEND ORIGINAL ===
@app.get("/")
async def root():
    """Servir o frontend ORIGINAL do usuário"""
    if FRONTEND_DIR.exists() and (FRONTEND_DIR / "index.html").exists():
        return FileResponse(FRONTEND_DIR / "index.html")
    return {"error": "Frontend original não encontrado"}

@app.get("/vite.svg")
async def vite_svg():
    """Servir o vite.svg"""
    vite_svg_path = FRONTEND_DIR / "vite.svg"
    if vite_svg_path.exists():
        return FileResponse(vite_svg_path)
    raise HTTPException(status_code=404, detail="vite.svg não encontrado")

# === API LEADS REAL ===
@app.get("/api/leads")
async def get_leads():
    """Obter todos os leads"""
    return {"leads": leads_db, "total": len(leads_db)}

@app.post("/api/leads") 
async def create_lead(lead: Lead):
    """Criar novo lead"""
    lead.id = len(leads_db) + 1
    leads_db.append(lead.dict())
    return {"success": True, "lead": lead}

@app.put("/api/leads/{lead_id}")
async def update_lead(lead_id: int, lead: Lead):
    """Atualizar lead"""
    for i, existing_lead in enumerate(leads_db):
        if existing_lead["id"] == lead_id:
            lead.id = lead_id
            leads_db[i] = lead.dict()
            return {"success": True, "lead": lead}
    raise HTTPException(status_code=404, detail="Lead não encontrado")

@app.delete("/api/leads/{lead_id}")
async def delete_lead(lead_id: int):
    """Deletar lead"""
    global leads_db
    leads_db = [lead for lead in leads_db if lead["id"] != lead_id]
    return {"success": True}

# === API CLIENTES REAL ===
@app.get("/api/clients")
async def get_clients():
    """Obter todos os clientes"""
    return {"clients": clients_db, "total": len(clients_db)}

@app.post("/api/clients")
async def create_client(client: Client):
    """Criar novo cliente"""
    client.id = len(clients_db) + 1
    clients_db.append(client.dict())
    return {"success": True, "client": client}

# === API CONTRATOS REAL ===
@app.get("/api/contracts")
async def get_contracts():
    """Obter todos os contratos"""
    return {"contracts": contracts_db, "total": len(contracts_db)}

@app.post("/api/contracts")
async def create_contract(contract: Contract):
    """Criar novo contrato"""
    contract.id = len(contracts_db) + 1
    contracts_db.append(contract.dict())
    return {"success": True, "contract": contract}

# === WHATSAPP EVOLUTION API REAL ===
EVOLUTION_API_URL = os.getenv("EVOLUTION_API_URL", "http://localhost:8081") 
EVOLUTION_API_KEY = os.getenv("EVOLUTION_API_KEY", "B6BAFC56-8173-4618-9B2D-FF3F4068DDCF")

@app.post("/api/evolution/instance/create")
async def create_whatsapp_instance(data: dict):
    """Criar instância WhatsApp REAL via Evolution API"""
    try:
        instance_name = data.get("instanceName", "autocred")
        
        async with httpx.AsyncClient(timeout=30.0) as client:
            response = await client.post(
                f"{EVOLUTION_API_URL}/instance/create",
                json={
                    "instanceName": instance_name,
                    "qrcode": True,
                    "integration": "WHATSAPP-BAILEYS",
                    "webhookUrl": f"https://{os.getenv('RAILWAY_PUBLIC_DOMAIN', 'autocredd-production.up.railway.app')}/webhook/whatsapp",
                    "webhookByEvents": True,
                    "webhookBase64": False,
                    "chatwootAccountId": None,
                    "chatwootToken": None,
                    "chatwootUrl": None,
                    "chatwootSignMsg": False,
                    "chatwootReopenConversation": False,
                    "chatwootConversationPending": False
                },
                headers={"apikey": EVOLUTION_API_KEY}
            )
            
            if response.status_code == 200 or response.status_code == 201:
                result = response.json()
                return {"success": True, "instance": result}
            else:
                return {"success": False, "error": f"HTTP {response.status_code}: {response.text}"}
                
    except Exception as e:
        return {"success": False, "error": str(e)}

@app.get("/api/evolution/instances")
async def list_whatsapp_instances():
    """Listar instâncias WhatsApp"""
    try:
        async with httpx.AsyncClient(timeout=30.0) as client:
            response = await client.get(
                f"{EVOLUTION_API_URL}/instance/fetchInstances",
                headers={"apikey": EVOLUTION_API_KEY}
            )
            return response.json()
    except Exception as e:
        return {"instances": [], "error": str(e)}

@app.get("/api/evolution/instance/{instance_name}/qr")
async def get_qr_code(instance_name: str):
    """Obter QR Code da instância"""
    try:
        async with httpx.AsyncClient(timeout=30.0) as client:
            response = await client.get(
                f"{EVOLUTION_API_URL}/instance/connect/{instance_name}",
                headers={"apikey": EVOLUTION_API_KEY}
            )
            return response.json()
    except Exception as e:
        return {"error": str(e)}

# === WEBHOOK WHATSAPP ===
@app.post("/webhook/whatsapp")
async def whatsapp_webhook(data: dict):
    """Receber webhooks do WhatsApp"""
    print(f"📱 Webhook WhatsApp: {data}")
    # TODO: Processar mensagens e conectar com IA
    return {"status": "received"}

# === STATUS ===
@app.get("/health")
async def health():
    return {"status": "healthy", "version": "2.0.0"}

@app.get("/api/frontend-status")
async def frontend_status():
    """Verificar status do frontend"""
    frontend_exists = FRONTEND_DIR.exists()
    index_exists = (FRONTEND_DIR / "index.html").exists()
    assets_exists = (FRONTEND_DIR / "assets").exists()
    vite_svg_exists = (FRONTEND_DIR / "vite.svg").exists()
    
    return {
        "frontend_directory": str(FRONTEND_DIR),
        "frontend_exists": frontend_exists,
        "index_html_exists": index_exists,
        "assets_directory_exists": assets_exists,
        "vite_svg_exists": vite_svg_exists,
        "status": "ready" if all([frontend_exists, index_exists, assets_exists]) else "not_ready"
    }

@app.get("/api/environment")
async def get_environment():
    return {
        "environment": "railway",
        "frontend": "original",
        "whatsapp": "evolution_api_real",
        "evolution_url": EVOLUTION_API_URL
    }

# === SPA ROUTING PARA FRONTEND ORIGINAL ===
@app.get("/{path:path}")
async def serve_spa(path: str):
    """Servir frontend original para SPA routing"""
    # Excluir rotas da API
    if path.startswith("api/"):
        return JSONResponse(status_code=404, content={"detail": f"API não encontrada: /{path}"})
    
    # Excluir arquivos estáticos que já são servidos por outras rotas
    if path.startswith("assets/") or path.startswith("static/") or path in ["vite.svg"]:
        raise HTTPException(status_code=404, detail="Arquivo não encontrado")
    
    # Para todas as outras rotas, servir o index.html (SPA routing)
    if FRONTEND_DIR.exists() and (FRONTEND_DIR / "index.html").exists():
        return FileResponse(FRONTEND_DIR / "index.html")
    return {"error": "Frontend não encontrado"}

if __name__ == "__main__":
    port = int(os.getenv("PORT", 8000))
    print(f"🚀 AutoCred REAL System - SEM simulações")
    print(f"📱 Frontend: ORIGINAL ({FRONTEND_DIR})")
    print(f"🔌 Evolution API: {EVOLUTION_API_URL}")
    print(f"🌐 Porta: {port}")
    
    uvicorn.run(
        "app_real:app",
        host="0.0.0.0",
        port=port,
        log_level="info"
    ) 