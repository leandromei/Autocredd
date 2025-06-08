#!/usr/bin/env python3
"""
🚀 AutoCred Railway - Backend FIXED para WhatsApp
Sistema com roteamento correto para APIs de WhatsApp
"""

import os
import time
import logging
import httpx
from fastapi import FastAPI, HTTPException, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse, JSONResponse
from pydantic import BaseModel
from pathlib import Path
import uvicorn
from typing import Optional

# Configurar logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

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

print("🚀🔥 AutoCred Evolution API - RAILWAY SUCCESS! - v2.0 FINAL")
print("🔧 URLs CORRIGIDAS PARA RAILWAY - SEM MAIS RENDER!")
print("⚡ FORCE RESTART - CACHE CLEARED")

# FastAPI App
app = FastAPI(
    title="AutoCred Railway System - v2.0",
    description="Sistema AutoCred com roteamento corrigido",
    version="2.1.0"
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

# === WHATSAPP API ENDPOINTS (FIRST PRIORITY) ===

# Enviar mensagem WhatsApp
async def send_whatsapp_message(phone: str, message: str, instance_name: str = "autocred-main"):
    """📤 Enviar mensagem via Evolution API"""
    try:
        # Preparar dados para envio
        payload = {
            "number": phone,
            "text": message
        }
        
        async with httpx.AsyncClient(timeout=30.0) as client:
            response = await client.post(
                f"https://autocred-evolution-api-production.up.railway.app/message/sendText/{instance_name}",
                json=payload,
                headers={"Content-Type": "application/json"}
            )
            
            if response.status_code == 200:
                logger.info(f"✅ Mensagem enviada para {phone}: {message}")
                return {"success": True, "message": "Mensagem enviada"}
            else:
                logger.error(f"❌ Erro ao enviar mensagem: {response.status_code}")
                return {"success": False, "error": f"HTTP {response.status_code}"}
        
    except Exception as e:
        logger.error(f"❌ Erro ao enviar mensagem: {e}")
        return {"success": False, "error": str(e)}

@app.post("/api/whatsapp/send")
async def api_send_whatsapp(request: Request):
    """📤 API: Enviar mensagem WhatsApp"""
    try:
        data = await request.json()
        phone = data.get("phone", "").replace("+", "").replace("-", "").replace("(", "").replace(")", "").replace(" ", "")
        message = data.get("message", "")
        instance_name = data.get("instance", "autocred-main")
        
        if not phone or not message:
            return {"success": False, "error": "Phone e message são obrigatórios"}
        
        # Garantir formato correto do telefone
        if not phone.endswith("@s.whatsapp.net"):
            phone = f"{phone}@s.whatsapp.net"
        
        result = await send_whatsapp_message(phone, message, instance_name)
        return result
        
    except Exception as e:
        return {"success": False, "error": str(e)}

@app.post("/api/whatsapp/create-instance")
async def create_whatsapp_instance(request: Request):
    """🆕 Criar nova instância WhatsApp"""
    try:
        data = await request.json()
        instance_name = data.get("instance_name", f"autocred-{int(time.time())}")
        
        # Chamar diretamente nossa Evolution API no Render
        async with httpx.AsyncClient(timeout=30.0) as client:
            payload = {
                "instanceName": instance_name,
                "integration": "WHATSAPP-BAILEYS"
            }
            
            response = await client.post(
                "https://autocred-evolution-api-production.up.railway.app/instance/create",
                json=payload,
                headers={"Content-Type": "application/json"}
            )
            
            if response.status_code == 200:
                data_response = response.json()
                logger.info(f"✅ Instância criada: {instance_name}")
                return {
                    "success": True,
                    "instance": data_response.get("instance"),
                    "message": f"Instância {instance_name} criada com sucesso"
                }
            else:
                logger.error(f"❌ Erro ao criar instância: {response.status_code}")
                return {"success": False, "error": f"HTTP {response.status_code}"}
            
    except Exception as e:
        logger.error(f"❌ Erro ao criar instância: {e}")
        return {"success": False, "error": str(e)}

@app.get("/api/whatsapp/qrcode/{instance_name}")
async def get_whatsapp_qrcode(instance_name: str):
    """📱 Gerar QR Code para conectar WhatsApp - ENDPOINT PRIORITÁRIO"""
    try:
        logger.info(f"🔍 Requisição QR Code para instância: {instance_name}")
        
        # Chamar diretamente nossa Evolution API no Render
        async with httpx.AsyncClient(timeout=30.0) as client:
            url = f"https://autocred-evolution-api-production.up.railway.app/instance/qrcode/{instance_name}"
            logger.info(f"🌐 Chamando URL: {url}")
            
            response = await client.get(
                url,
                headers={"Content-Type": "application/json"}
            )
            
            logger.info(f"📡 Resposta da Evolution API: {response.status_code}")
            
            if response.status_code == 200:
                data = response.json()
                logger.info(f"✅ QR Code gerado para {instance_name}")
                
                result = {
                    "success": True,
                    "qrcode": data.get("qrcode"),
                    "instance": instance_name,
                    "message": data.get("message", "QR Code gerado com sucesso"),
                    "instructions": data.get("instructions", [])
                }
                
                logger.info(f"📦 Retornando resultado: {result['success']}")
                return result
            else:
                logger.error(f"❌ Erro ao gerar QR Code: {response.status_code}")
                return {"success": False, "error": f"HTTP {response.status_code}"}
                
    except Exception as e:
        logger.error(f"❌ Erro ao gerar QR Code: {e}")
        return {"success": False, "error": str(e)}

@app.get("/api/whatsapp/dashboard")
async def whatsapp_dashboard():
    """📊 Dashboard WhatsApp - estatísticas básicas"""
    try:
        dashboard_data = {
            "status": "online",
            "total_instances": 1,
            "active_instances": 1,
            "messages_today": 0,
            "messages_total": 0,
            "last_activity": time.time(),
            "evolution_api": {
                "status": "connected",
                "url": "https://autocred-evolution-api-production.up.railway.app"
            }
        }
        
        # Testar conexão com nossa Evolution API
        try:
            async with httpx.AsyncClient(timeout=10.0) as client:
                response = await client.get("https://autocred-evolution-api-production.up.railway.app/health")
                if response.status_code == 200:
                    dashboard_data["evolution_api"]["connection_test"] = {"success": True, "status": "connected"}
                    
                    # Tentar listar instâncias
                    instances_response = await client.get("https://autocred-evolution-api-production.up.railway.app/manager/fetchInstances")
                    if instances_response.status_code == 200:
                        instances_data = instances_response.json()
                        dashboard_data["total_instances"] = len(instances_data.get("instances", []))
                else:
                    dashboard_data["evolution_api"]["connection_test"] = {"success": False, "error": f"HTTP {response.status_code}"}
        except:
            dashboard_data["evolution_api"]["connection_test"] = {"success": False, "error": "Connection failed"}
        
        return dashboard_data
        
    except Exception as e:
        return {"success": False, "error": str(e)}

# === OUTRAS APIs ===

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

@app.get("/health")
async def health():
    """Health check"""
    return {"status": "healthy", "timestamp": time.time()}

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

# === SPA ROUTING (DEVE SER A ÚLTIMA ROTA!) ===
@app.get("/{path:path}")
async def serve_spa(path: str):
    """Servir frontend original para SPA routing - ÚLTIMA ROTA"""
    # Excluir arquivos estáticos que já são servidos por outras rotas
    if path.startswith("assets/") or path.startswith("static/") or path in ["vite.svg"]:
        raise HTTPException(status_code=404, detail="Arquivo não encontrado")
    
    # Excluir rotas da API
    if path.startswith("api/"):
        raise HTTPException(status_code=404, detail="API endpoint não encontrado")
    
    # Para todas as outras rotas (NÃO da API), servir o index.html (SPA routing)
    if FRONTEND_DIR.exists() and (FRONTEND_DIR / "index.html").exists():
        return FileResponse(FRONTEND_DIR / "index.html")
    return {"error": "Frontend não encontrado"}

if __name__ == "__main__":
    port = int(os.getenv("PORT", 8000))
    print(f"🚀 AutoCred FIXED System")
    print(f"📱 Frontend: ORIGINAL ({FRONTEND_DIR})")
    print(f"🌐 Porta: {port}")
    
    uvicorn.run(
        "app_fixed:app",
        host="0.0.0.0",
        port=port,
        log_level="info"
    ) 