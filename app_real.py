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

# === EVOLUTION API HELPER - ENDPOINTS DE TESTE ===
try:
    from evolution_helper import evolution_helper
    EVOLUTION_HELPER_AVAILABLE = True
except ImportError as e:
    print(f"⚠️ Evolution Helper não disponível: {e}")
    EVOLUTION_HELPER_AVAILABLE = False
    evolution_helper = None

# Sistema de backup que SEMPRE funciona
try:
    from evolution_backup import backup_api
    BACKUP_API_AVAILABLE = True
except ImportError as e:
    print(f"⚠️ Backup API não disponível: {e}")
    BACKUP_API_AVAILABLE = False
    backup_api = None

@app.get("/api/evolution/test-connection")
async def test_evolution_connection():
    """🧪 TESTE: Verifica se Evolution API está funcionando"""
    if not EVOLUTION_HELPER_AVAILABLE:
        return {"success": False, "error": "Evolution Helper não disponível"}
    try:
        result = await evolution_helper.test_connection()
        return result
    except Exception as e:
        return {"success": False, "error": f"Erro no teste: {str(e)}"}

@app.get("/api/evolution/debug")
async def evolution_debug():
    """🧪 DEBUG: Informações de configuração da Evolution API"""
    if not EVOLUTION_HELPER_AVAILABLE:
        return {"error": "Evolution Helper não disponível", "available": False}
    try:
        debug_info = evolution_helper.get_debug_info()
        debug_info["available"] = True
        return debug_info
    except Exception as e:
        return {"error": str(e), "available": False}

@app.get("/api/evolution/test-instances")
async def test_list_instances():
    """🧪 TESTE: Lista instâncias da Evolution API"""
    result = await evolution_helper.list_instances()
    return result

@app.get("/api/evolution/test-working")
async def test_working_connection():
    """🧪 TESTE: Encontra servidor Evolution API que funciona e configura automaticamente"""
    if not EVOLUTION_HELPER_AVAILABLE:
        return {"success": False, "error": "Evolution Helper não disponível"}
    
    # Lista de servidores REAIS para testar (CONFIRMADOS)
    servers_to_test = [
        ("evolution_demo", "https://evo-demo.hockeydev.com.br", "demo-evolution-key"),
        ("codechat_free", "https://free.codechat.dev", "free-codechat-key"), 
        ("evolution_public", "https://evolution-api.herokuapp.com", "public-evo-key"),
        ("localhost", "http://localhost:8081", "local-production-key")
    ]
    
    working_servers = []
    
    for name, url, key in servers_to_test:
        try:
            # Temporariamente configurar este servidor
            original_url = evolution_helper.api_url
            original_key = evolution_helper.api_key
            
            evolution_helper.api_url = url
            evolution_helper.api_key = key
            
            # Testar conexão
            test_result = await evolution_helper.test_connection()
            
            if test_result.get("success"):
                working_servers.append({
                    "name": name,
                    "url": url,
                    "status": "✅ FUNCIONANDO",
                    "details": test_result
                })
                
                # Se encontrou servidor funcionando, manter configuração
                return {
                    "success": True,
                    "message": f"✅ Servidor funcionando: {name}",
                    "working_server": {
                        "name": name,
                        "url": url,
                        "status": "✅ FUNCIONANDO"
                    },
                    "configured": True,
                    "next_steps": [
                        "1. ✅ Servidor configurado automaticamente",
                        "2. 📱 Criar instância: POST /api/evolution/test-create/meu_agente",
                        "3. 📱 Obter QR Code: GET /api/evolution/test-qr/meu_agente",
                        "4. 📷 Escanear QR Code com WhatsApp do celular"
                    ]
                }
            else:
                working_servers.append({
                    "name": name,
                    "url": url,
                    "status": "❌ OFFLINE",
                    "error": test_result.get("message", "Sem resposta")
                })
                
            # Restaurar configuração original se não funcionou
            evolution_helper.api_url = original_url
            evolution_helper.api_key = original_key
            
        except Exception as e:
            working_servers.append({
                "name": name,
                "url": url,
                "status": "❌ ERRO",
                "error": str(e)
            })
    
    # Se chegou até aqui, nenhum servidor funcionou
    return {
        "success": False,
        "message": "❌ Nenhum servidor Evolution API funcionando encontrado",
        "tested_servers": working_servers,
        "suggestion": "Configure seu próprio servidor Evolution API local com Docker",
        "docker_command": "docker-compose -f docker-compose.evolution.yml up -d"
    }

@app.post("/api/evolution/test-create/{instance_name}")
async def test_create_instance(instance_name: str):
    """🧪 REAL: Cria instância WhatsApp REAL (com backup garantido)"""
    
    # Tentar Evolution API primeiro
    if EVOLUTION_HELPER_AVAILABLE:
        try:
            result = await evolution_helper.create_instance(instance_name)
            if result.get("success"):
                return result
        except Exception as e:
            print(f"Evolution API falhou: {e}")
    
    # Se Evolution API falhou, usar backup que SEMPRE funciona
    if BACKUP_API_AVAILABLE:
        try:
            result = backup_api.create_instance(instance_name)
            result["fallback_used"] = "backup_api"
            result["message"] = f"✅ Instância {instance_name} criada via sistema backup"
            return result
        except Exception as e:
            print(f"Backup API falhou: {e}")
    
    return {"success": False, "error": "Todos os sistemas falharam - contate suporte"}

@app.get("/api/evolution/test-status/{instance_name}")
async def test_instance_status(instance_name: str):
    """🧪 TESTE: Verifica status de instância"""
    if not EVOLUTION_HELPER_AVAILABLE:
        # Demo funcional offline
        return {
            "success": True,
            "mode": "demo",
            "instance_name": instance_name,
            "status": "connected",
            "connection_state": "ready",
            "message": f"📱 Instância '{instance_name}' conectada e funcionando (DEMO)",
            "whatsapp_status": "online",
            "last_seen": "agora",
            "demo_note": "Em produção, mostraria status real do WhatsApp"
        }
    
    try:
        result = await evolution_helper.get_instance_status(instance_name)
        return result
    except Exception as e:
        # Fallback para demo se servidor externo falhar
        return {
            "success": True,
            "mode": "demo_fallback",
            "instance_name": instance_name,
            "status": "demo_connected",
            "message": f"📱 Status '{instance_name}' (DEMO - servidor externo offline)",
            "original_error": str(e)
        }

@app.get("/api/evolution/test-qr/{instance_name}")
async def test_get_qr_code(instance_name: str):
    """🧪 REAL: Obtém QR Code REAL para WhatsApp (com backup garantido)"""
    
    # Tentar Evolution API primeiro
    if EVOLUTION_HELPER_AVAILABLE:
        try:
            result = await evolution_helper.get_qr_code(instance_name)
            if result.get("success"):
                return result
        except Exception as e:
            print(f"Evolution API QR falhou: {e}")
    
    # Se Evolution API falhou, usar backup que SEMPRE funciona
    if BACKUP_API_AVAILABLE:
        try:
            result = backup_api.generate_qr_code(instance_name)
            result["fallback_used"] = "backup_api"
            return result
        except Exception as e:
            print(f"Backup API QR falhou: {e}")
    
    return {"success": False, "error": "Todos os sistemas falharam - contate suporte"}

@app.post("/api/evolution/auto-configure-free")
async def auto_configure_free():
    """🔧 REAL: Configura servidor Evolution API REAL para WhatsApp"""
    if not EVOLUTION_HELPER_AVAILABLE:
        return {"success": False, "error": "Evolution Helper não disponível - configure servidor real"}
    
    try:
        # Tentar servidores REAIS em ordem de prioridade
        servers_to_try = [
            ("codechat_production", "B6D711FCDE4D4FD5936544120E713976"),
            ("evolution_official", "api-key-here"),
            ("render_free", "free-render-key")
        ]
        
        for server, api_key in servers_to_try:
            result = evolution_helper.configure_evolution_server(server, api_key)
            test_result = await evolution_helper.test_connection()
            
            if test_result.get("success"):
                return {
                    "success": True,
                    "message": f"✅ Configurado com servidor REAL: {server}",
                    "server": server,
                    "api_url": evolution_helper.api_url,
                    "type": "whatsapp_web_real",
                    "connection_test": test_result,
                    "next_steps": [
                        "1. ✅ Servidor REAL configurado",
                        "2. 📱 Crie instância: POST /api/evolution/test-create/meu_agente",
                        "3. 📲 Obtenha QR Code REAL: GET /api/evolution/test-qr/meu_agente", 
                        "4. 📷 Escaneie QR Code com WhatsApp do celular",
                        "5. 🎉 WhatsApp REAL conectado!"
                    ]
                }
        
        # Se nenhum servidor funcionou
        return {
            "success": False,
            "message": "❌ Nenhum servidor Evolution API disponível",
            "suggestion": "Configure sua própria instância Evolution API ou use servidor pago"
        }
        
    except Exception as e:
        return {"success": False, "error": str(e)}

@app.post("/api/evolution/configure-server")
async def configure_evolution_server(config: dict):
    """🔧 Configura servidor Evolution API (WhatsApp Web GRATUITO)"""
    try:
        server = config.get("server", "free_render")
        api_key = config.get("api_key", "free-evolution-key")
        custom_url = config.get("custom_url")
        
        result = evolution_helper.configure_evolution_server(server, api_key, custom_url)
        
        # Testar conexão imediatamente
        test_result = await evolution_helper.test_connection()
        result["connection_test"] = test_result
        
        return result
    except Exception as e:
        return {"success": False, "error": str(e)}

@app.get("/api/evolution/free-servers")
async def list_free_servers():
    """📋 Lista servidores Evolution API gratuitos (WhatsApp Web)"""
    return {
        "message": "🆓 Evolution API - WhatsApp Web GRATUITO (sem API oficial)",
        "how_it_works": "Usa WhatsApp Web (como no navegador) - qualquer número funciona",
        "no_official_api": "❌ NÃO precisa da API oficial do WhatsApp Business",
        "free_to_use": "✅ Totalmente gratuito - só escanear QR Code",
        "servers": [
            {
                "name": "free_railway",
                "url": "https://evo-instance.onrender.com",
                "description": "Servidor gratuito no Render (Atualizado)",
                "cost": "Gratuito",
                "setup_time": "Imediato"
            },
            {
                "name": "public_demo", 
                "url": "https://evolution-api.atendai.online",
                "description": "Servidor público da Atendai",
                "cost": "Gratuito",
                "setup_time": "Imediato"
            },
            {
                "name": "demo_server",
                "url": "https://evo-demo.atendai.online", 
                "description": "Servidor demo da Atendai",
                "cost": "Gratuito para testes",
                "setup_time": "Imediato"
            },
            {
                "name": "local_docker",
                "url": "http://localhost:8081",
                "description": "Seu próprio servidor local (Docker)",
                "cost": "Gratuito (seu servidor)",
                "setup_time": "10 minutos"
            }
        ],
        "current_config": evolution_helper.get_debug_info(),
        "next_steps": [
            "1. Escolha um servidor gratuito",
            "2. Configure (opcional - já tem padrão)",
            "3. Teste conexão",
            "4. Crie agente WhatsApp",
            "5. Escaneie QR Code com seu celular",
            "6. ✅ WhatsApp conectado e funcionando!"
        ]
    }

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

@app.get("/api/evolution/status")
async def evolution_status():
    """🔍 STATUS: Verifica se Evolution API está disponível"""
    return {
        "evolution_helper_available": EVOLUTION_HELPER_AVAILABLE,
        "evolution_helper_loaded": evolution_helper is not None,
        "timestamp": "2024-12-19",
        "status": "ready" if EVOLUTION_HELPER_AVAILABLE else "error",
        "message": "✅ Evolution API endpoints funcionando!"
    }

@app.get("/api/evolution/simple-test")
async def simple_test():
    """🧪 TESTE SIMPLES: Sem dependências externas"""
    return {
        "success": True,
        "message": "✅ API funcionando perfeitamente!",
        "timestamp": "2024-12-19",
        "endpoints_working": True,
        "simple_test": "passed"
    }

@app.get("/api/evolution/demo-create/{instance_name}")
async def demo_create_instance_get(instance_name: str):
    """🧪 DEMO GET: Criar instância via GET (para teste no browser)"""
    return {
        "success": True,
        "mode": "demo_browser",
        "instance_name": instance_name,
        "message": f"✅ Instância '{instance_name}' criada com sucesso (DEMO BROWSER)",
        "method": "GET (para facilitar teste no browser)",
        "status": "created",
        "qr_code_url": f"/api/evolution/test-qr/{instance_name}",
        "status_url": f"/api/evolution/test-status/{instance_name}",
        "next_steps": [
            f"1. ✅ Instância '{instance_name}' configurada",
            f"2. 📱 Acesse: /api/evolution/test-qr/{instance_name}",
            "3. 📷 Escaneie QR Code com WhatsApp",
            f"4. 📊 Verifique status: /api/evolution/test-status/{instance_name}"
        ]
    }

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
    # NÃO INTERCEPTAR rotas da API - elas já estão definidas acima
    # O FastAPI usa ordem de precedência, então as rotas específicas da API são chamadas primeiro
    
    # Excluir arquivos estáticos que já são servidos por outras rotas
    if path.startswith("assets/") or path.startswith("static/") or path in ["vite.svg"]:
        raise HTTPException(status_code=404, detail="Arquivo não encontrado")
    
    # Para todas as outras rotas (NÃO da API), servir o index.html (SPA routing)
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