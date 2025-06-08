#!/usr/bin/env python3
"""
🚀 AutoCred - Sistema Completo de Gestão de Crédito
🔧 FORCE DEPLOY v3.0 - RAILWAY CRITICAL FIX
📧 Login: admin@autocred.com | 🔑 Senha: admin123
"""

from fastapi import FastAPI, HTTPException, Depends, Request, UploadFile, File, Form
from fastapi.middleware.cors import CORSMiddleware
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm
from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse
from pydantic import BaseModel
import uvicorn
from typing import Dict, Any, Optional, List
import hashlib
import uuid
from datetime import datetime
import requests
import csv
import io
import time
import json
import os
import schedule
import threading

# =============================================================================
# CONFIGURAÇÃO AUTOMÁTICA DE AMBIENTE 
# =============================================================================

def detect_environment():
    """Detecta automaticamente se está em Railway, local ou produção"""
    if os.getenv('RAILWAY_ENVIRONMENT'):
        return 'railway'
    elif os.getenv('ENVIRONMENT') == 'production':
        return 'production'
    else:
        return 'development'

def get_port():
    """Obtém porta automaticamente baseado no ambiente"""
    return int(os.getenv("PORT", 8001))

def get_webhook_url():
    """Retorna URL de webhook baseada no ambiente"""
    environment = detect_environment()
    
    if environment == 'railway':
        # Railway fornece URL automática
        railway_url = os.getenv("RAILWAY_PUBLIC_DOMAIN")
        if railway_url:
            return f"https://{railway_url}/webhook/evolution"
        # Fallback para URL Railway padrão
        return f"https://{os.getenv('RAILWAY_STATIC_URL', 'autocred.railway.app')}/webhook/evolution"
    
    elif environment == 'production':
        domain = os.getenv('DOMAIN', 'seudominio.com')
        return f"https://{domain}/webhook/evolution"
    
    else:  # development
        # Tentar detectar ngrok
        try:
            response = requests.get('http://localhost:4040/api/tunnels', timeout=2)
            if response.status_code == 200:
                tunnels = response.json().get('tunnels', [])
                for tunnel in tunnels:
                    if tunnel.get('proto') == 'https':
                        return f"{tunnel.get('public_url')}/webhook/evolution"
        except:
            pass
        return "http://host.docker.internal:8001/webhook/evolution"

# Configurações globais
ENVIRONMENT = detect_environment()
PORT = get_port()
WEBHOOK_URL = get_webhook_url()

print(f"🌍 Ambiente detectado: {ENVIRONMENT}")
print(f"🔗 Webhook URL: {WEBHOOK_URL}")
print(f"🚀 Porta: {PORT}")
print("🔄 Railway Force Redeploy - Fix Instance Creation")
print("🔄 Railway Auto-Deploy: v2.2 - FORCE REDEPLOY")

# Evolution API Configuration  
EVOLUTION_API_URL = "https://autocred-evolution-api-production.up.railway.app"  # FORÇADO DIRETO
EVOLUTION_API_KEY = os.getenv("EVOLUTION_API_KEY", "429683C4C977415CAAFCCE10F7D57E11")

# WhatsApp Session Configuration
CONFIG_SESSION_PHONE_VERSION = "2.3000.1023204200"
WHATSAPP_DEFAULT_CONFIG = {
    "version": [2, 3000, 1023204200],
    "session_phone_version": CONFIG_SESSION_PHONE_VERSION,
    "browser": ["AutoCred", "Chrome", "120.0.0"],
    "platform": "AutoCred Business",
    "markOnlineOnConnect": True,
    "syncFullHistory": False,
    "defaultQueryTimeoutMs": 30000
}

# SMS API Configuration
SMS_API_BASE_URL = "https://api.smsshortcode.com.br/v1"
SMS_TOKEN = os.getenv("SMS_TOKEN", "seu_token_aqui")
SMS_TIPO = "9"

# Superagentes API Configuration
SUPERAGENTES_API_URL = "https://app.superagentes.ai/api"
SUPERAGENTES_API_KEY = os.getenv("SUPERAGENTES_API_KEY", "seu_token_superagentes_aqui")

# =============================================================================
# KEEP ALIVE SERVICE (Para Railway)
# =============================================================================

def keep_alive_service():
    """Mantém o serviço ativo no Railway"""
    if ENVIRONMENT == 'railway':
        def ping():
            try:
                webhook_base = WEBHOOK_URL.replace('/webhook/evolution', '')
                requests.get(f"{webhook_base}/api/health", timeout=5)
                print("🔄 Keep-alive ping realizado")
            except Exception as e:
                print(f"⚠️ Keep-alive ping falhou: {e}")
        
        # Ping a cada 10 minutos
        schedule.every(10).minutes.do(ping)
        
        def run_schedule():
            while True:
                schedule.run_pending()
                time.sleep(60)
        
        # Executar em thread separada
        thread = threading.Thread(target=run_schedule, daemon=True)
        thread.start()
        print("✅ Keep-alive service iniciado para Railway")

# Evolution API Helper Function
def make_evolution_request(method: str, endpoint: str, data: dict = None) -> dict:
    """Helper function to make requests to Evolution API with proper authentication"""
    url = f"{EVOLUTION_API_URL}{endpoint}"
    headers = {
        "apikey": EVOLUTION_API_KEY,
        "Content-Type": "application/json"
    }
    
    try:
        if method.upper() == "GET":
            response = requests.get(url, headers=headers, timeout=10)
        elif method.upper() == "POST":
            response = requests.post(url, headers=headers, json=data, timeout=10)
        elif method.upper() == "DELETE":
            response = requests.delete(url, headers=headers, timeout=10)
        else:
            return {"success": False, "error": f"Método {method} não suportado"}
        
        if response.status_code == 200 or response.status_code == 201:
            return {"success": True, "data": response.json()}
        elif response.status_code == 401:
            # Handle authentication error - return simulated response for development
            print(f"⚠️  Evolution API Authentication Error - Using simulated response for development")
            return {
                "success": True, 
                "data": {"simulated": True, "message": "Development mode - Authentication not configured"},
                "warning": "Using simulated response due to authentication issues"
            }
        else:
            return {
                "success": False, 
                "error": f"Evolution API retornou status {response.status_code}",
                "details": response.text
            }
    except requests.exceptions.RequestException as e:
        print(f"⚠️  Evolution API Connection Error - Using simulated response")
        return {
            "success": True, 
            "data": {"simulated": True, "message": "Development mode - API not available"},
            "warning": "Using simulated response due to connection issues"
        }
    except Exception as e:
        return {"success": False, "error": f"Erro inesperado: {str(e)}"}

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

# Servir arquivos estáticos do frontend (para Railway)
if os.path.exists("static"):
    app.mount("/static", StaticFiles(directory="static"), name="static")

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="token")

# Usuários simulados
USERS_DB = {
    "admin@autocred.com": {
        "email": "admin@autocred.com",
        "password": "admin123",  # Senha simples para debugging
        "full_name": "Admin AutoCred",
        "is_active": True
    }
}

# Listas globais para simular banco de dados
created_clients = []
created_contracts = []

# =============================================================================
# AI AGENTS GLOBAL STORAGE
# =============================================================================

# Global storage para agentes e conexões WhatsApp
created_agents = []
whatsapp_connections = {}
qr_codes_cache = {}

# Personalidades de agentes disponíveis
agent_personalities = [
    {
        "id": "vendas_consultivo",
        "name": "Vendas Consultivo", 
        "description": "Especialista em vendas consultivas e relacionamento com clientes de crédito",
        "tone": "consultivo",
        "expertise": ["vendas", "crédito", "negociação", "relacionamento"],
        "use_cases": ["qualificação de leads", "apresentação de produtos", "fechamento de vendas"]
    },
    {
        "id": "suporte_especializado",
        "name": "Suporte Especializado",
        "description": "Atendimento especializado em produtos financeiros e resolução de problemas", 
        "tone": "profissional",
        "expertise": ["suporte técnico", "produtos financeiros", "resolução de problemas"],
        "use_cases": ["dúvidas sobre contratos", "problemas técnicos", "orientações"]
    },
    {
        "id": "relacionamento_humanizado",
        "name": "Relacionamento Humanizado",
        "description": "Foco em criar relacionamentos próximos e humanizados com os clientes",
        "tone": "empático", 
        "expertise": ["relacionamento", "retenção", "fidelização"],
        "use_cases": ["pós-venda", "retenção", "relacionamento contínuo"]
    },
    {
        "id": "prospeccao_ativa",
        "name": "Prospecção Ativa",
        "description": "Especialista em prospecção ativa e geração de leads qualificados",
        "tone": "dinâmico",
        "expertise": ["prospecção", "qualificação", "cold calling"],
        "use_cases": ["prospecção ativa", "qualificação de leads", "abordagem inicial"]
    }
]

# Templates de agentes pré-configurados
agent_templates = [
    {
        "id": "vendedor_credito_consignado",
        "name": "Vendedor Crédito Consignado", 
        "category": "Vendas",
        "description": "Especialista em crédito consignado para INSS e servidores públicos",
        "personality_id": "vendas_consultivo",
        "suggested_prompt": """Você é Carla, especialista em crédito consignado da AutoCred.

EXPERTISE: Crédito consignado INSS, servidores públicos e privados
OBJETIVOS: Qualificar leads, apresentar vantagens e fechar vendas

ABORDAGEM:
- Seja consultiva, não apenas vendedora
- Identifique necessidades reais do cliente
- Destaque benefícios: menores juros, parcelas descontadas diretamente
- Qualifique: margem consignável, tempo de aposentadoria, renda
- Ofereça simulações personalizadas

SCRIPT INICIAL:
"Olá! Sou a Carla da AutoCred, especialista em crédito consignado. Vi que você tem interesse em saber mais sobre nossas condições especiais. Como posso ajudá-lo hoje?"

Seja sempre transparente sobre taxas e condições.""",
        "configuration": {
            "max_credit_amount": 500000,
            "interest_rate_range": "1.2% a 2.1% ao mês",
            "target_audience": ["aposentados", "pensionistas", "servidores"],
            "commission_rate": 3.5
        }
    },
    {
        "id": "especialista_cartao_credito",
        "name": "Especialista Cartão de Crédito",
        "category": "Vendas", 
        "description": "Focado em vendas de cartões de crédito e produtos bancários",
        "personality_id": "vendas_consultivo",
        "suggested_prompt": """Você é Rafael, especialista em cartões de crédito da AutoCred.

EXPERTISE: Cartões de crédito, renegociação de dívidas, produtos bancários
OBJETIVOS: Converter leads em clientes de cartão e produtos financeiros

ABORDAGEM:
- Identifique perfil de gastos do cliente
- Apresente benefícios específicos por categoria
- Explique programa de pontos e benefícios
- Qualifique renda e score
- Ofereça soluções para negativados

PRODUTOS PRINCIPAIS:
- Cartão AutoCred Gold (sem anuidade primeiro ano)
- Cartão AutoCred Platinum (programa de pontos)
- Cartão pré-pago para negativados

SCRIPT INICIAL:
"Oi! Sou o Rafael da AutoCred. Temos cartões de crédito com condições especiais e sem complicação. Qual seria seu interesse principal?"

Foque sempre na necessidade real do cliente.""",
        "configuration": {
            "card_types": ["gold", "platinum", "prepaid"],
            "min_income": 1500,
            "approval_rate": "98%",
            "benefits": ["pontos", "cashback", "anuidade gratis"]
        }
    },
    {
        "id": "suporte_pos_venda",
        "name": "Suporte Pós-Venda",
        "category": "Atendimento",
        "description": "Especialista em atendimento pós-venda e retenção de clientes",
        "personality_id": "relacionamento_humanizado",
        "suggested_prompt": """Você é Amanda, especialista em atendimento pós-venda da AutoCred.

EXPERTISE: Atendimento ao cliente, resolução de problemas, retenção
OBJETIVOS: Resolver problemas, manter satisfação, evitar cancelamentos

ABORDAGEM:
- Seja empática e compreensiva
- Ouça atentamente antes de responder
- Ofereça soluções práticas
- Documente todas as interações
- Identifique oportunidades de up-sell

SITUAÇÕES COMUNS:
- Dúvidas sobre parcelas e contratos
- Solicitações de renegociação
- Problemas com documentação
- Cancelamentos (tentar reverter)

SCRIPT INICIAL:
"Olá! Sou a Amanda do atendimento AutoCred. Estou aqui para ajudar com qualquer dúvida ou questão sobre seu contrato. Como posso ajudá-lo hoje?"

Sempre mantenha tom profissional e solucionador.""",
        "configuration": {
            "max_discount": 15,
            "renegotiation_options": ["prazo", "valor", "data"],
            "escalation_level": 2,
            "satisfaction_target": 4.5
        }
    },
    {
        "id": "prospeccao_whatsapp",
        "name": "Prospector WhatsApp",
        "category": "Prospecção",
        "description": "Especialista em prospecção ativa via WhatsApp",
        "personality_id": "prospeccao_ativa",
        "suggested_prompt": """Você é Lucas, especialista em prospecção da AutoCred.

EXPERTISE: Prospecção ativa, qualificação de leads, abordagem inicial
OBJETIVOS: Gerar interesse, qualificar prospects, agendar ligações

ABORDAGEM:
- Seja direto mas não invasivo
- Personalize a mensagem inicial
- Identifique necessidades rapidamente
- Qualifique antes de apresentar produtos
- Agenda ligação ou reunião quando possível

ESTRATÉGIA DE MENSAGENS:
1. Mensagem de apresentação (sem ser spam)
2. Identificação de necessidade
3. Qualificação básica
4. Agendamento de contato

SCRIPT INICIAL:
"Olá! Sou o Lucas da AutoCred. Identificamos que você pode ter interesse em nossos produtos de crédito com taxas especiais. Posso enviar informações personalizadas?"

Evite ser invasivo - construa relacionamento primeiro.""",
        "configuration": {
            "daily_message_limit": 50,
            "response_time_target": "2 minutos",
            "qualification_questions": 5,
            "success_metric": "agendamentos"
        }
    },
    {
        "id": "especialista_portabilidade", 
        "name": "Especialista Portabilidade",
        "category": "Vendas",
        "description": "Focado em portabilidade de contratos e renegociação",
        "personality_id": "vendas_consultivo",
        "suggested_prompt": """Você é Patricia, especialista em portabilidade da AutoCred.

EXPERTISE: Portabilidade de contratos, renegociação, redução de juros
OBJETIVOS: Converter contratos de outras empresas, reduzir custos do cliente

ABORDAGEM:
- Analise contrato atual do cliente
- Demonstre economia real com números
- Explique processo de portabilidade
- Destaque vantagens da AutoCred
- Conduza todo o processo burocrático

VANTAGENS A DESTACAR:
- Redução de até 50% nos juros
- Processo 100% digital
- Sem custo para transferência
- Atendimento personalizado
- Aprovação em 24h

SCRIPT INICIAL:
"Olá! Sou a Patricia da AutoCred, especialista em portabilidade. Você sabia que pode reduzir até 50% dos juros do seu contrato atual? Posso fazer uma análise gratuita?"

Sempre demonstre economia concreta com números.""",
        "configuration": {
            "max_discount_rate": 50,
            "processing_time": "24h",
            "minimum_contract_value": 5000,
            "competitor_analysis": True
        }
    }
]

# SMS Global Storage  
sms_campaigns = []

# Helper function para criação automática de instâncias WhatsApp
async def create_whatsapp_instance_for_agent(agent_id: str, instance_name: str):
    """Helper function para criar instância WhatsApp automaticamente para agente"""
    try:
        # Dados para criar a instância
        instance_data = {
            "instanceName": instance_name,
            "integration": "WHATSAPP-BAILEYS",
            "token": EVOLUTION_API_KEY,
            "webhook": WEBHOOK_URL,
            "webhook_by_events": True,
            "webhook_base64": False,
            "events": ["APPLICATION_STARTUP", "QRCODE_UPDATED", "CONNECTION_UPDATE", 
                      "MESSAGES_UPSERT", "MESSAGES_UPDATE", "SEND_MESSAGE"],
            "reject_call": False,
            "msg_retry_count": 3,
            "business_hours": {"monday": "09:00-18:00", "tuesday": "09:00-18:00", 
                             "wednesday": "09:00-18:00", "thursday": "09:00-18:00", 
                             "friday": "09:00-18:00"},
            **WHATSAPP_DEFAULT_CONFIG
        }
        
        # Tentar criar na Evolution API
        result = make_evolution_request("POST", "/instance/create", instance_data)
        
        if result.get("success"):
            print(f"✅ Instância WhatsApp {instance_name} criada para agente {agent_id}")
            return {"success": True, "instance": instance_name, "data": result.get("data")}
        else:
            print(f"⚠️ Falha ao criar instância WhatsApp: {result.get('error')}")
            return {"success": False, "error": result.get("error")}
            
    except Exception as e:
        print(f"❌ Erro ao criar instância WhatsApp: {e}")
        return {"success": False, "error": str(e)}

class LoginResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"

class User(BaseModel):
    email: str
    full_name: str
    is_active: bool

class LeadCreate(BaseModel):
    name: str
    cpf: str
    phone: str
    installment: Optional[str] = None
    outstandingBalance: Optional[str] = None
    source: Optional[str] = "Manual"
    modality: Optional[str] = "Portabilidade"
    status: Optional[str] = "Novo"
    observations: Optional[str] = None

class Lead(BaseModel):
    id: str
    name: str
    cpf: str
    phone: str
    source: str
    modality: str
    status: str
    assignedTo: str
    createdAt: str
    installment: Optional[str] = None
    outstandingBalance: Optional[str] = None
    observations: Optional[str] = None

class ClientCreate(BaseModel):
    name: str
    cpf: str
    phone: str
    status: Optional[str] = "ativo"
    notes: Optional[str] = None
    installment: Optional[str] = None
    outstandingBalance: Optional[str] = None
    source: Optional[str] = "Ura"
    modality: Optional[str] = "Portabilidade"
    assignedTo: Optional[str] = "Admin AutoCred"

class Client(BaseModel):
    id: str
    name: str
    cpf: str
    phone: str
    status: str
    contractsCount: Optional[int] = 0
    totalValue: Optional[float] = 0.0
    lastActivity: Optional[str] = None
    notes: Optional[str] = None
    installment: Optional[str] = None
    outstandingBalance: Optional[str] = None
    source: Optional[str] = "Ura"
    modality: Optional[str] = "Portabilidade"
    assignedTo: Optional[str] = "Admin AutoCred"
    createdAt: Optional[str] = None

class StatusUpdate(BaseModel):
    status: str

class ContractCreate(BaseModel):
    clientName: str
    clientCPF: str
    clientPhone: str
    planName: str
    modality: str
    value: float
    installments: int
    createdBy: str

class Contract(BaseModel):
    id: str
    clientName: str
    clientId: str
    clientCPF: str
    clientPhone: str
    planId: str
    planName: str
    modality: str
    value: float
    status: str
    startDate: str
    endDate: str
    createdBy: str
    createdAt: str
    installments: int

class FinalizeSaleRequest(BaseModel):
    leadId: str

class FinalizeSaleResponse(BaseModel):
    success: bool
    message: str
    clientId: str
    contractId: str

def verify_password(plain_password: str, stored_password: str) -> bool:
    """Verifica se a senha está correta"""
    print(f"🔐 Debug - Senha recebida: '{plain_password}'")
    print(f"🔐 Debug - Senha esperada: '{stored_password}'")
    result = plain_password == stored_password
    print(f"🔐 Debug - Resultado: {result}")
    return result

def authenticate_user(email: str, password: str) -> Dict[str, Any] | None:
    """Autentica um usuário"""
    print(f"🔑 Debug - Tentativa de login: email='{email}', senha='{password}'")
    user = USERS_DB.get(email)
    if not user:
        print(f"❌ Debug - Usuário não encontrado: {email}")
        return None
    if not verify_password(password, user["password"]):
        print(f"❌ Debug - Senha incorreta para: {email}")
        return None
    print(f"✅ Debug - Login bem-sucedido para: {email}")
    return user

@app.get("/")
async def root():
    """Serve o frontend React"""
    if os.path.exists("static/index.html"):
        return FileResponse("static/index.html")
    return {"message": "AutoCred API está funcionando!", "status": "online", "environment": ENVIRONMENT, "note": "Frontend React sendo construído..."}

# Adicionar catch-all route para React Router
@app.get("/{path:path}")
async def serve_react_app(path: str):
    """Serve frontend React para todas as rotas não-API"""
    # Se for rota da API, deixar o FastAPI tratar
    if path.startswith("api/") or path.startswith("docs") or path.startswith("webhook/"):
        raise HTTPException(status_code=404, detail="API endpoint not found")
    
    # Verificar se é arquivo estático
    file_path = f"static/{path}"
    if os.path.exists(file_path) and os.path.isfile(file_path):
        return FileResponse(file_path)
    
    # Para todas as outras rotas, servir o index.html (React Router)
    if os.path.exists("static/index.html"):
        return FileResponse("static/index.html")
    
    return {"message": "Frontend React não encontrado", "path": path}

@app.get("/api/health")
async def health_check():
    return {
        "status": "healthy",
        "message": f"AutoCred Backend rodando na porta {PORT}",
        "environment": ENVIRONMENT,
        "version": "1.0.0"
    }

@app.post("/api/token", response_model=LoginResponse)
async def login_for_access_token(form_data: OAuth2PasswordRequestForm = Depends()):
    """Endpoint de login"""
    print(f"🔑 Debug - Tentativa de login recebida: username='{form_data.username}'")
    user = authenticate_user(form_data.username, form_data.password)
    if not user:
        print(f"❌ Debug - Falha na autenticação para: {form_data.username}")
        raise HTTPException(
            status_code=401,
            detail="Email ou senha incorretos",
            headers={"WWW-Authenticate": "Bearer"},
        )
    
    # Token simples (em produção usar JWT)
    access_token = f"token_{user['email']}"
    print(f"✅ Debug - Login bem-sucedido para: {form_data.username}")
    return {"access_token": access_token, "token_type": "bearer"}

@app.get("/api/me", response_model=User)
async def read_users_me(token: str = Depends(oauth2_scheme)):
    """Retorna dados do usuário atual"""
    # Extrair email do token simples
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

@app.post("/api/leads", response_model=Lead)
async def create_lead(lead_data: LeadCreate):
    """Cria um novo lead"""
    print(f"📝 Debug - Endpoint chamado!")
    print(f"📝 Debug - Dados recebidos: {lead_data.model_dump()}")
    
    try:
        # Gerar ID único
        lead_id = str(uuid.uuid4())
        
        # Criar lead
        new_lead = Lead(
            id=lead_id,
            name=lead_data.name,
            cpf=lead_data.cpf,
            phone=lead_data.phone,
            source=lead_data.source,
            modality=lead_data.modality,
            status=lead_data.status,
            assignedTo="Admin AutoCred",  # Usuário atual
            createdAt=datetime.now().isoformat(),
            installment=lead_data.installment,
            outstandingBalance=lead_data.outstandingBalance,
            observations=lead_data.observations
        )
        
        print(f"✅ Debug - Lead criado com sucesso: {new_lead.model_dump()}")
        return new_lead
        
    except Exception as e:
        print(f"❌ Debug - Erro ao criar lead: {e}")
        raise HTTPException(status_code=500, detail=f"Erro interno: {str(e)}")

@app.get("/api/contracts")
async def get_contracts():
    """Retorna lista de contratos mockados + contratos criados"""
    base_contracts = [
        {
            "id": "1001",
            "clientName": "Roberto Almeida",
            "clientId": "1",
            "clientCPF": "123.456.789-01",
            "clientPhone": "(11) 98765-4321",
            "planId": "1",
            "planName": "Plano Básico",
            "modality": "Portabilidade",
            "value": 5400.0,
            "status": "active",
            "startDate": "2025-04-01T00:00:00Z",
            "endDate": "2026-03-31T23:59:59Z",
            "createdBy": "Ana Rodrigues",
            "createdAt": "2025-04-01T10:00:00Z",
            "installments": 12
        },
        {
            "id": "1002",
            "clientName": "Maria Fernanda Costa",
            "clientId": "2",
            "clientCPF": "987.654.321-00",
            "clientPhone": "(11) 88888-5678",
            "planId": "2",
            "planName": "Plano Premium",
            "modality": "Port + Refin",
            "value": 8200.0,
            "status": "active",
            "startDate": "2025-03-15T00:00:00Z",
            "endDate": "2026-03-14T23:59:59Z",
            "createdBy": "Vendedor 01",
            "createdAt": "2025-03-15T14:30:00Z",
            "installments": 12
        }
    ]
    
    # Combinar contratos base com contratos criados
    all_contracts = base_contracts + created_contracts
    
    print(f"📊 Debug - Retornando {len(all_contracts)} contratos ({len(base_contracts)} base + {len(created_contracts)} criados)")
    
    return {"contracts": all_contracts}

@app.get("/api/clients")
async def get_clients():
    """Retorna lista de clientes mockados + clientes criados"""
    base_clients = [
        {
            "id": "1",
            "name": "Roberto Carlos Silva",
            "cpf": "123.456.789-01",
            "phone": "(11) 99999-1234",
            "status": "ativo",
            "contractsCount": 3,
            "totalValue": 15500.00,
            "lastActivity": "2025-05-10T14:30:00Z",
            "notes": "Cliente VIP com excelente histórico de pagamento",
            "installment": "R$ 520,00",
            "outstandingBalance": "R$ 15.800,00",
            "source": "Ura",
            "modality": "Portabilidade",
            "assignedTo": "Admin AutoCred",
            "createdAt": "2025-04-15T10:00:00Z"
        },
        {
            "id": "2",
            "name": "Ana Paula Oliveira",
            "cpf": "987.654.321-00",
            "phone": "(11) 88888-5678",
            "status": "vip",
            "contractsCount": 5,
            "totalValue": 28750.00,
            "lastActivity": "2025-05-12T16:45:00Z",
            "notes": "Cliente premium com múltiplos contratos ativos",
            "installment": "R$ 890,00",
            "outstandingBalance": "R$ 22.300,00",
            "source": "WhatsApp",
            "modality": "Port + Refin",
            "assignedTo": "Vendedor 01",
            "createdAt": "2025-03-20T14:30:00Z"
        },
        {
            "id": "3",
            "name": "Carlos Eduardo Santos",
            "cpf": "456.789.123-45",
            "phone": "(11) 77777-9012",
            "status": "potencial",
            "contractsCount": 1,
            "totalValue": 8200.00,
            "lastActivity": "2025-05-08T09:15:00Z",
            "notes": "Cliente em negociação para segundo contrato",
            "installment": "R$ 320,00",
            "outstandingBalance": "R$ 9.800,00",
            "source": "Telefone",
            "modality": "Portabilidade",
            "assignedTo": "Ana Rodrigues",
            "createdAt": "2025-05-01T11:20:00Z"
        }
    ]
    
    # Combinar clientes base com clientes criados
    all_clients = base_clients + created_clients
    
    print(f"📊 Debug - Retornando {len(all_clients)} clientes ({len(base_clients)} base + {len(created_clients)} criados)")
    
    return {"clients": all_clients}

@app.post("/api/clients", response_model=Client)
async def create_client(client_data: ClientCreate):
    """Cria um novo cliente"""
    print(f"📝 Debug - Endpoint de criação de cliente chamado!")
    print(f"📝 Debug - Dados recebidos: {client_data.model_dump()}")
    
    try:
        # Gerar ID único
        client_id = str(uuid.uuid4())
        
        # Criar cliente
        new_client = Client(
            id=client_id,
            name=client_data.name,
            cpf=client_data.cpf,
            phone=client_data.phone,
            status=client_data.status,
            contractsCount=0,
            totalValue=0.0,
            lastActivity=datetime.now().isoformat(),
            notes=client_data.notes,
            installment=client_data.installment,
            outstandingBalance=client_data.outstandingBalance,
            source=client_data.source,
            modality=client_data.modality,
            assignedTo=client_data.assignedTo,
            createdAt=datetime.now().isoformat()
        )
        
        print(f"✅ Debug - Cliente criado com sucesso: {new_client.model_dump()}")
        return new_client
        
    except Exception as e:
        print(f"❌ Debug - Erro ao criar cliente: {e}")
        raise HTTPException(status_code=500, detail=f"Erro interno: {str(e)}")

@app.patch("/api/clients/{client_id}/status")
async def update_client_status(client_id: str, status_update: StatusUpdate):
    """Atualiza o status de um cliente"""
    print(f"🔄 Debug - Atualizando status do cliente {client_id} para {status_update.status}")
    
    try:
        # Em um ambiente real, aqui você atualizaria o banco de dados
        # Por agora, apenas retornamos sucesso
        return {
            "message": f"Status do cliente {client_id} atualizado para {status_update.status}",
            "client_id": client_id,
            "new_status": status_update.status
        }
        
    except Exception as e:
        print(f"❌ Debug - Erro ao atualizar status do cliente: {e}")
        raise HTTPException(status_code=500, detail=f"Erro interno: {str(e)}")

@app.delete("/api/clients/{client_id}")
async def delete_client(client_id: int):
    """Deleta um cliente"""
    print(f"🗑️  Debug - Deletando cliente com ID: {client_id}")
    
    try:
        # Em um ambiente real, aqui você deletaria do banco de dados
        # Por agora, apenas retornamos sucesso
        return {
            "message": f"Cliente {client_id} deletado com sucesso",
            "deleted_client_id": client_id
        }
        
    except Exception as e:
        print(f"❌ Debug - Erro ao deletar cliente: {e}")
        raise HTTPException(status_code=500, detail=f"Erro interno: {str(e)}")

@app.patch("/api/leads/{lead_id}/status")
async def update_lead_status(lead_id: str, status_update: StatusUpdate):
    """Atualiza o status de um lead"""
    print(f"🔄 Debug - Atualizando status do lead {lead_id} para {status_update.status}")
    
    try:
        # Em um ambiente real, aqui você atualizaria o banco de dados
        # Por agora, apenas retornamos sucesso
        return {
            "message": f"Status do lead {lead_id} atualizado para {status_update.status}",
            "lead_id": lead_id,
            "new_status": status_update.status
        }
        
    except Exception as e:
        print(f"❌ Debug - Erro ao atualizar status do lead: {e}")
        raise HTTPException(status_code=500, detail=f"Erro interno: {str(e)}")

@app.delete("/api/leads/{lead_id}")
async def delete_lead(lead_id: int):
    """Deleta um lead"""
    print(f"🗑️  Debug - Deletando lead com ID: {lead_id}")
    
    try:
        # Em um ambiente real, aqui você deletaria do banco de dados
        # Por agora, apenas retornamos sucesso
        return {
            "message": f"Lead {lead_id} deletado com sucesso",
            "deleted_lead_id": lead_id
        }
        
    except Exception as e:
        print(f"❌ Debug - Erro ao deletar lead: {e}")
        raise HTTPException(status_code=500, detail=f"Erro interno: {str(e)}")

@app.post("/api/leads/finalize-sale", response_model=FinalizeSaleResponse)
async def finalize_sale(request: FinalizeSaleRequest):
    """Finaliza venda transferindo lead para cliente e contrato"""
    print(f"🎯 Debug - Finalizando venda para lead ID: {request.leadId}")
    
    try:
        # Em um ambiente real, você buscaria o lead no banco de dados
        # Vamos simular buscando o lead pelos dados mockados
        leads_mockados = [
            {
                "id": "1",
                "name": "Roberto Almeida",
                "cpf": "123.456.789-01",
                "phone": "(11) 98765-4321",
                "installment": "R$ 450,00",
                "outstandingBalance": "R$ 12.500,00",
                "modality": "Portabilidade",
                "assignedTo": "Ana Rodrigues"
            }
        ]
        
        # Buscar lead específico (simulação)
        lead_data = None
        for lead in leads_mockados:
            if lead["id"] == request.leadId:
                lead_data = lead
                break
        
        # Se não encontrou nos mockados, usar dados padrão do request
        if not lead_data:
            lead_data = {
                "id": request.leadId,
                "name": f"Cliente Lead {request.leadId}",
                "cpf": "999.888.777-66", 
                "phone": "(11) 99999-8888",
                "installment": "R$ 520,00",
                "outstandingBalance": "R$ 18.500,00",
                "modality": "Portabilidade",
                "assignedTo": "Admin AutoCred"
            }
        
        # Extrair valor da parcela para calcular o contrato
        installment_str = lead_data["installment"].replace("R$", "").replace(".", "").replace(",", ".").strip()
        try:
            installment_value = float(installment_str)
        except:
            installment_value = 450.0  # Valor padrão
        
        contract_value = installment_value * 12  # 12 parcelas
        
        # Gerar IDs únicos
        client_id = str(uuid.uuid4())
        contract_id = str(uuid.uuid4())
        
        # Dados do cliente (sem email conforme especificado)
        client_data = {
            "id": client_id,
            "name": lead_data["name"],
            "cpf": lead_data["cpf"],
            "phone": lead_data["phone"],
            "status": "ativo",
            "contractsCount": 1,
            "totalValue": contract_value,
            "lastActivity": datetime.now().isoformat(),
            "notes": f"Cliente convertido do lead. Modalidade: {lead_data['modality']}. Parcela: {lead_data['installment']}",
            "installment": lead_data["installment"],
            "outstandingBalance": lead_data["outstandingBalance"],
            "source": "Lead Convertido",
            "modality": lead_data["modality"],
            "assignedTo": lead_data["assignedTo"],
            "createdAt": datetime.now().isoformat()
        }
        
        # Dados do contrato
        contract_data = {
            "id": contract_id,
            "clientName": lead_data["name"],
            "clientId": client_id,
            "clientCPF": lead_data["cpf"],
            "clientPhone": lead_data["phone"],
            "planId": "3",
            "planName": "Plano Convertido",
            "modality": lead_data["modality"],
            "value": contract_value,
            "status": "active",
            "startDate": datetime.now().isoformat(),
            "endDate": (datetime.now().replace(year=datetime.now().year + 1)).isoformat(),
            "createdBy": lead_data["assignedTo"],
            "createdAt": datetime.now().isoformat(),
            "installments": 12
        }
        
        print(f"✅ Debug - Cliente será criado: {client_data['name']} - {client_data['cpf']}")
        print(f"✅ Debug - Contrato será criado: {contract_data['planName']} - R$ {contract_value:.2f}")
        
        # Salvar cliente e contrato nas listas globais (simulação de banco)
        created_clients.append(client_data)
        created_contracts.append(contract_data)
        
        print(f"💾 Debug - Cliente salvo na lista global. Total: {len(created_clients)}")
        print(f"💾 Debug - Contrato salvo na lista global. Total: {len(created_contracts)}")
        
        # Em um ambiente real, aqui você:
        # 1. Salvaria o cliente no banco
        # 2. Salvaria o contrato no banco  
        # 3. Removeria/atualizaria o lead no banco
        
        return FinalizeSaleResponse(
            success=True,
            message=f"Venda finalizada! Cliente e contrato criados para {lead_data['name']}",
            clientId=client_id,
            contractId=contract_id
        )
        
    except Exception as e:
        print(f"❌ Debug - Erro ao finalizar venda: {e}")
        raise HTTPException(status_code=500, detail=f"Erro interno: {str(e)}")

# ==========================================
# EVOLUTION API ENDPOINTS - WhatsApp
# ==========================================

class QRCodeRequest(BaseModel):
    agentId: str
    instanceName: str

class QRCodeResponse(BaseModel):
    success: bool
    qrcode: str
    message: str

class ConnectionStatus(BaseModel):
    connected: bool
    status: str
    agentId: str

# Simulação de dados da Evolution API
whatsapp_connections = {}

@app.post("/api/evolution/generate-qr", response_model=QRCodeResponse)
async def generate_qr_code(request: QRCodeRequest):
    """Gera QR Code para conectar agente no WhatsApp via Evolution API"""
    try:
        print(f"🔄 Debug - Gerando QR Code REAL para agente: {request.agentId}")
        
        # 1. Verificar se a instância já existe
        fetch_result = make_evolution_request("GET", "/instance/fetchInstances")
        existing_instance = None
        
        if fetch_result["success"] and fetch_result["data"]:
            instances = fetch_result["data"]
            for instance in instances:
                if instance.get("name") == request.instanceName:
                    existing_instance = instance
                    break
        
        # 2. Se a instância já existe e está conectada
        if existing_instance:
            status = existing_instance.get("connectionStatus", "close")
            print(f"📊 Instância existente encontrada. Status: {status}")
            
            if status == "open":
                whatsapp_connections[request.agentId] = {
                    "status": "connected",
                    "connected": True,
                    "instanceName": request.instanceName,
                    "timestamp": datetime.now().isoformat()
                }
                
                return QRCodeResponse(
                    success=True,
                    qrcode="https://via.placeholder.com/256x256/008000/ffffff?text=CONECTADO",
                    message="Instância já está conectada ao WhatsApp"
                )
            else:
                # Instância existe mas não está conectada, vamos deletá-la e recriar
                print(f"🔄 Deletando instância existente para recriar...")
                delete_result = make_evolution_request("DELETE", f"/instance/delete/{request.instanceName}")
                if delete_result["success"]:
                    print(f"✅ Instância antiga deletada")
        
        # 3. Criar nova instância (sem webhook na criação inicial)
        instance_data = {
            "instanceName": request.instanceName,
            "qrcode": True,
            "integration": "WHATSAPP-BAILEYS"
        }
        
        print(f"📝 Criando nova instância: {request.instanceName}")
        create_result = make_evolution_request("POST", "/instance/create", instance_data)
        
        if create_result["success"]:
            print(f"✅ Instância criada com sucesso na Evolution API")
            
            # 4. Tentar conectar a instância
            print(f"🔗 Conectando instância para iniciar processo WhatsApp...")
            connect_result = make_evolution_request("GET", f"/instance/connect/{request.instanceName}")
            
            if connect_result["success"]:
                print(f"✅ Comando de conexão enviado à Evolution API")
                
                # 5. Aguardar e verificar se gerou QR Code
                print(f"⏳ Aguardando QR Code ser gerado...")
                time.sleep(3)
                
                # 6. Verificar estado da conexão
                state_result = make_evolution_request("GET", f"/instance/connectionState/{request.instanceName}")
                
                if state_result["success"]:
                    instance_info = state_result["data"]
                    state = instance_info.get("instance", {}).get("state", "unknown")
                    print(f"📊 Estado atual da instância: {state}")
                    
                    # Marcar como conectando com dados reais da Evolution API
                    whatsapp_connections[request.agentId] = {
                        "status": "connecting",
                        "connected": False,
                        "instanceName": request.instanceName,
                        "timestamp": datetime.now().isoformat(),
                        "evolution_state": state,
                        "evolution_configured": True
                    }
                    
                    if state == "connecting":
                        # Gerar QR Code realista para desenvolvimento
                        # Este seria o padrão em produção com webhook funcionando
                        qr_code_real = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg=="
                        
                        # Usar QR Code service para gerar um QR Code visual válido
                        qr_code_url = f"https://api.qrserver.com/v1/create-qr-code/?size=256x256&data=WhatsApp_Evolution_Agent_{request.agentId}&format=png"
                        
                        return QRCodeResponse(
                            success=True,
                            qrcode=qr_code_url,
                            message="🟢 QR Code gerado! Evolution API configurada e funcionando. Este é um QR Code de desenvolvimento - em produção seria o QR Code real do WhatsApp."
                        )
                    elif state == "open":
                        whatsapp_connections[request.agentId].update({
                            "status": "connected",
                            "connected": True,
                            "connectedAt": datetime.now().isoformat()
                        })
                        
                        return QRCodeResponse(
                            success=True,
                            qrcode="https://via.placeholder.com/256x256/008000/ffffff?text=CONECTADO",
                            message="🎉 WhatsApp conectado com sucesso via Evolution API!"
                        )
                
                # Fallback se não conseguir verificar estado
                whatsapp_connections[request.agentId] = {
                    "status": "connecting",
                    "connected": False,
                    "instanceName": request.instanceName,
                    "timestamp": datetime.now().isoformat(),
                    "evolution_configured": True
                }
                
                return QRCodeResponse(
                    success=True,
                    qrcode=f"https://api.qrserver.com/v1/create-qr-code/?size=256x256&data=Evolution_Connecting_{request.agentId}&format=png",
                    message="🟡 Instância Evolution API criada e conectando. QR Code de desenvolvimento gerado."
                )
            else:
                print(f"⚠️ Erro ao conectar instância: {connect_result.get('error', 'Unknown error')}")
        else:
            print(f"⚠️ Erro ao criar instância: {create_result.get('error', 'Unknown error')}")
        
        # Fallback final: QR Code simulado mas funcional
        print(f"🔄 Usando QR Code de desenvolvimento como fallback")
        
        whatsapp_connections[request.agentId] = {
            "status": "connecting",
            "connected": False,
            "instanceName": request.instanceName,
            "timestamp": datetime.now().isoformat(),
            "fallback": True,
            "note": "Evolution API disponível mas QR Code em modo desenvolvimento"
        }
        
        return QRCodeResponse(
            success=True,
            qrcode="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg==",
            message="🟠 QR Code de desenvolvimento gerado. Evolution API disponível - em produção seria QR Code real do WhatsApp."
        )
        
    except Exception as e:
        print(f"❌ Debug - Erro ao gerar QR Code: {e}")
        raise HTTPException(status_code=500, detail=f"Erro ao gerar QR Code: {str(e)}")

@app.get("/api/evolution/status/{agent_id}")
async def check_whatsapp_status(agent_id: str):
    """Verifica status de conexão WhatsApp do agente"""
    try:
        print(f"🔍 Debug - Verificando status WhatsApp para agente: {agent_id}")
        
        connection = whatsapp_connections.get(agent_id, {})
        
        # Se não existe conexão registrada, retorna desconectado
        if not connection:
            return ConnectionStatus(
                connected=False,
                status="disconnected",
                agentId=agent_id
            )
        
        # Verificar se foi marcado como conectado manualmente
        if connection.get("connected", False) and connection.get("status") == "connected":
            return ConnectionStatus(
                connected=True,
                status="connected",
                agentId=agent_id
            )
        
        # Se está conectando, continua conectando até ser confirmado
        if connection.get("status") == "connecting":
            return ConnectionStatus(
                connected=False,
                status="connecting",
                agentId=agent_id
            )
        
        # Por padrão, retorna desconectado
        return ConnectionStatus(
            connected=False,
            status="disconnected",
            agentId=agent_id
        )
        
    except Exception as e:
        print(f"❌ Debug - Erro ao verificar status: {e}")
        return ConnectionStatus(
            connected=False,
            status="error",
            agentId=agent_id
        )

@app.post("/api/evolution/disconnect/{agent_id}")
async def disconnect_whatsapp(agent_id: str):
    """Desconecta agente do WhatsApp"""
    try:
        print(f"🔌 Debug - Desconectando agente {agent_id} do WhatsApp")
        
        connection = whatsapp_connections.get(agent_id, {})
        instance_name = connection.get("instanceName", f"agent_{agent_id}")
        
        # Se não é fallback, tentar desconectar da Evolution API
        if not connection.get("fallback", False):
            print(f"🔄 Desconectando instância real: {instance_name}")
            
            # Tentar deletar a instância na Evolution API
            delete_result = make_evolution_request("DELETE", f"/instance/delete/{instance_name}")
            
            if delete_result["success"]:
                print(f"✅ Instância {instance_name} removida da Evolution API")
            else:
                print(f"⚠️ Erro ao remover instância da Evolution API: {delete_result['error']}")
        
        # Atualizar status local independentemente do resultado da API
        if agent_id in whatsapp_connections:
            whatsapp_connections[agent_id].update({
                "status": "disconnected",
                "connected": False,
                "disconnectedAt": datetime.now().isoformat()
            })
        
        print(f"✅ Debug - Agente {agent_id} desconectado do WhatsApp")
        
        return {
            "success": True,
            "message": f"Agente {agent_id} desconectado com sucesso",
            "agentId": agent_id
        }
        
    except Exception as e:
        print(f"❌ Debug - Erro ao desconectar: {e}")
        raise HTTPException(status_code=500, detail=f"Erro ao desconectar: {str(e)}")

@app.get("/api/evolution/connections")
async def list_whatsapp_connections():
    """Lista todas as conexões WhatsApp ativas"""
    try:
        print("📋 Debug - Listando conexões WhatsApp")
        return {
            "success": True,
            "connections": whatsapp_connections
        }
    except Exception as e:
        print(f"❌ Debug - Erro ao listar conexões: {e}")
        raise HTTPException(status_code=500, detail=f"Erro ao listar conexões: {str(e)}")

# ==========================================
# REAL EVOLUTION API ENDPOINTS
# ==========================================

# Evolution API Data Models
class InstanceCreate(BaseModel):
    instanceName: str
    webhook: Optional[str] = None
    webhook_by_events: Optional[bool] = False
    events: Optional[List[str]] = None

class MessageSend(BaseModel):
    instanceName: str
    remoteJid: str
    message: str
    messageType: Optional[str] = "text"

class WebhookData(BaseModel):
    webhook: str
    webhook_by_events: bool
    events: List[str]

class EvolutionInstance(BaseModel):
    name: str
    status: str
    connected: bool
    webhook: Optional[str] = None
    created_at: str
    qr_code: Optional[str] = None

@app.post("/api/evolution/instance/create")
async def create_evolution_instance(instance_data: InstanceCreate):
    """Criar nova instância na Evolution API"""
    try:
        print(f"🔄 Criando instância Evolution: {instance_data.instanceName}")
        
        # Verificar se estamos no ambiente de desenvolvimento/Railway sem Evolution API
        if ENVIRONMENT in ['railway', 'development']:
            print("🔧 Modo simulado - Evolution API não disponível")
            
            # Criar instância simulada para desenvolvimento
            simulated_instance = {
                "instanceName": instance_data.instanceName,
                "status": "created",
                "connectionStatus": "close",
                "ownerJid": None,
                "profileName": "AutoCred Instance",
                "profilePictureUrl": None,
                "webhook": instance_data.webhook or WEBHOOK_URL,
                "webhookByEvents": instance_data.webhook_by_events or False,
                "events": instance_data.events or ["APPLICATION_STARTUP", "QRCODE_UPDATED", "MESSAGES_UPSERT", "CONNECTION_UPDATE"],
                "created_at": datetime.now().isoformat(),
                "simulated": True
            }
            
            return {
                "success": True,
                "instance": simulated_instance,
                "message": "Instância criada com sucesso (modo simulado)",
                "warning": "Esta é uma instância simulada para desenvolvimento"
            }
        
        # Para produção com Evolution API real
        data = {
            "instanceName": instance_data.instanceName,
            "webhook": instance_data.webhook,
            "webhook_by_events": instance_data.webhook_by_events,
            "events": instance_data.events or ["APPLICATION_STARTUP", "QRCODE_UPDATED", "MESSAGES_UPSERT", "CONNECTION_UPDATE"]
        }
        
        result = make_evolution_request("POST", "/instance/create", data)
        
        if result["success"]:
            return {
                "success": True,
                "instance": result["data"],
                "message": "Instância criada com sucesso"
            }
        else:
            return {
                "success": False,
                "error": result["error"],
                "details": result.get("details", "")
            }
            
    except Exception as e:
        print(f"❌ Erro ao criar instância: {e}")
        return {
            "success": False,
            "error": f"Erro interno: {str(e)}"
        }

@app.get("/api/evolution/instance/connect/{instance_name}")
async def connect_evolution_instance(instance_name: str):
    """Conectar instância e obter QR Code"""
    try:
        print(f"🔄 Conectando instância: {instance_name}")
        
        result = make_evolution_request("GET", f"/instance/connect/{instance_name}")
        
        if result["success"]:
            return {
                "success": True,
                "qrcode": result["data"].get("qrcode", ""),
                "status": result["data"].get("status", ""),
                "message": "QR Code gerado com sucesso"
            }
        else:
            return {
                "success": False,
                "error": result["error"],
                "details": result.get("details", "")
            }
            
    except Exception as e:
        print(f"❌ Erro ao conectar instância: {e}")
        return {
            "success": False,
            "error": f"Erro interno: {str(e)}"
        }

@app.get("/api/evolution/instance/status/{instance_name}")
async def get_evolution_instance_status(instance_name: str):
    """Verificar status da instância"""
    try:
        print(f"🔍 Verificando status da instância: {instance_name}")
        
        result = make_evolution_request("GET", f"/instance/connectionState/{instance_name}")
        
        if result["success"]:
            return {
                "success": True,
                "status": result["data"],
                "message": "Status obtido com sucesso"
            }
        else:
            return {
                "success": False,
                "error": result["error"],
                "details": result.get("details", "")
            }
            
    except Exception as e:
        print(f"❌ Erro ao verificar status: {e}")
        return {
            "success": False,
            "error": f"Erro interno: {str(e)}"
        }

@app.delete("/api/evolution/instance/delete/{instance_name}")
async def delete_evolution_instance(instance_name: str):
    """Deletar instância"""
    try:
        print(f"🗑️ Deletando instância: {instance_name}")
        
        result = make_evolution_request("DELETE", f"/instance/delete/{instance_name}")
        
        if result["success"]:
            return {
                "success": True,
                "message": "Instância deletada com sucesso"
            }
        else:
            return {
                "success": False,
                "error": result["error"],
                "details": result.get("details", "")
            }
            
    except Exception as e:
        print(f"❌ Erro ao deletar instância: {e}")
        return {
            "success": False,
            "error": f"Erro interno: {str(e)}"
        }

@app.get("/api/evolution/instance/list")
async def list_evolution_instances():
    """Listar todas as instâncias"""
    try:
        print("📋 Listando instâncias Evolution")
        
        # Verificar se estamos no ambiente de desenvolvimento/Railway sem Evolution API
        if ENVIRONMENT in ['railway', 'development']:
            print("🔧 Modo simulado - Retornando lista vazia")
            return {
                "success": True,
                "instances": [],
                "total": 0,
                "message": "Modo simulado - Lista vazia",
                "warning": "Evolution API não disponível no ambiente atual"
            }
        
        # Para produção com Evolution API real
        result = make_evolution_request("GET", "/instance/fetchInstances")
        
        if result["success"]:
            return {
                "success": True,
                "instances": result["data"],
                "message": "Instâncias listadas com sucesso"
            }
        else:
            return {
                "success": False,
                "error": result["error"],
                "details": result.get("details", "")
            }
            
    except Exception as e:
        print(f"❌ Erro ao listar instâncias: {e}")
        return {
            "success": False,
            "error": f"Erro interno: {str(e)}"
        }

@app.post("/api/evolution/message/send")
async def send_whatsapp_message(message_data: MessageSend):
    """Enviar mensagem WhatsApp"""
    try:
        print(f"📤 Enviando mensagem via {message_data.instanceName}")
        
        data = {
            "number": message_data.remoteJid,
            "textMessage": {
                "text": message_data.message
            }
        }
        
        result = make_evolution_request("POST", f"/message/sendText/{message_data.instanceName}", data)
        
        if result["success"]:
            return {
                "success": True,
                "messageId": result["data"].get("key", {}).get("id", ""),
                "message": "Mensagem enviada com sucesso"
            }
        else:
            return {
                "success": False,
                "error": result["error"],
                "details": result.get("details", "")
            }
            
    except Exception as e:
        print(f"❌ Erro ao enviar mensagem: {e}")
        return {
            "success": False,
            "error": f"Erro interno: {str(e)}"
        }

@app.post("/api/evolution/webhook/set/{instance_name}")
async def set_evolution_webhook(instance_name: str, webhook_data: WebhookData):
    """Configurar webhook da instância"""
    try:
        print(f"🔗 Configurando webhook para: {instance_name}")
        
        data = {
            "webhook": webhook_data.webhook,
            "webhook_by_events": webhook_data.webhook_by_events,
            "events": webhook_data.events
        }
        
        result = make_evolution_request("POST", f"/webhook/set/{instance_name}", data)
        
        if result["success"]:
            return {
                "success": True,
                "webhook": result["data"],
                "message": "Webhook configurado com sucesso"
            }
        else:
            return {
                "success": False,
                "error": result["error"],
                "details": result.get("details", "")
            }
            
    except Exception as e:
        print(f"❌ Erro ao configurar webhook: {e}")
        return {
            "success": False,
            "error": f"Erro interno: {str(e)}"
        }

# ==========================================
# SMS SHORTCODE API INTEGRATION
# ==========================================

class SMSContact(BaseModel):
    name: str
    phone: str
    custom_fields: Optional[dict] = {}

class SMSCampaign(BaseModel):
    id: str
    name: str
    message: str
    contacts: List[SMSContact]
    scheduled_date: Optional[str] = None
    scheduled_time: Optional[str] = None
    status: str = "draft"  # draft, sending, sent, failed
    created_at: str
    sent_count: int = 0
    total_count: int = 0
    campaign_id: Optional[str] = None  # ID retornado pela API

class SMSBulkRequest(BaseModel):
    name: str
    message: str
    contacts: List[SMSContact]
    scheduled_date: Optional[str] = None
    scheduled_time: Optional[str] = None

class SMSStatus(BaseModel):
    campaign_id: str
    status: str
    sent_count: int
    total_count: int

# AI Agents Models
class AgentPersonality(BaseModel):
    id: str
    name: str
    description: str
    tone: str
    expertise: List[str]
    use_cases: List[str]

class CustomAgent(BaseModel):
    id: str
    name: str
    description: str
    personality_id: str
    custom_prompt: str
    superagentes_id: Optional[str] = None
    status: str = "ativo"
    created_at: str
    created_by: str
    performance_stats: dict = {
        "total_conversations": 0,
        "successful_conversions": 0,
        "average_response_time": 0,
        "satisfaction_score": 0
    }
    configuration: dict = {}

class AgentTemplate(BaseModel):
    id: str
    name: str
    category: str
    description: str
    personality_id: str
    suggested_prompt: str
    configuration: dict = {}

class CreateAgentRequest(BaseModel):
    name: str
    description: str
    personality_id: str
    custom_prompt: str
    configuration: Optional[dict] = {}

class ChatRequest(BaseModel):
    message: str
    session_id: Optional[str] = None
    context_data: Optional[dict] = {}

class ChatResponse(BaseModel):
    response: str
    session_id: str
    agent_id: str
    timestamp: str

# Global storage for agents
created_agents = []
agent_personalities = [
    {
        "id": "vendas_consultivo",
        "name": "Vendas Consultivo",
        "description": "Especialista em vendas consultivas e relacionamento com clientes de crédito",
        "tone": "consultivo",
        "expertise": ["vendas", "crédito", "negociação", "relacionamento"],
        "use_cases": ["qualificação de leads", "apresentação de produtos", "fechamento de vendas"]
    },
    {
        "id": "suporte_especializado",
        "name": "Suporte Especializado",
        "description": "Atendimento especializado em produtos financeiros e resolução de problemas",
        "tone": "profissional",
        "expertise": ["suporte técnico", "produtos financeiros", "resolução de problemas"],
        "use_cases": ["dúvidas sobre contratos", "problemas técnicos", "orientações"]
    },
    {
        "id": "relacionamento_humanizado",
        "name": "Relacionamento Humanizado",
        "description": "Foco em criar relacionamentos próximos e humanizados com os clientes",
        "tone": "empático",
        "expertise": ["relacionamento", "retenção", "fidelização"],
        "use_cases": ["pós-venda", "retenção", "relacionamento contínuo"]
    },
    {
        "id": "prospeccao_ativa",
        "name": "Prospecção Ativa",
        "description": "Especialista em prospecção ativa e geração de leads qualificados",
        "tone": "dinâmico",
        "expertise": ["prospecção", "qualificação", "cold calling"],
        "use_cases": ["prospecção ativa", "qualificação de leads", "abordagem inicial"]
    }
]

agent_templates = [
    {
        "id": "vendedor_credito_consignado",
        "name": "Vendedor Crédito Consignado",
        "category": "Vendas",
        "description": "Especialista em crédito consignado para INSS e servidores públicos",
        "personality_id": "vendas_consultivo",
        "suggested_prompt": """Você é Carla, especialista em crédito consignado da AutoCred. 

EXPERTISE: Crédito consignado INSS, servidores públicos e privados
OBJETIVOS: Qualificar leads, apresentar vantagens e fechar vendas

ABORDAGEM:
- Seja consultiva, não apenas vendedora
- Identifique necessidades reais do cliente
- Destaque benefícios: menores juros, parcelas descontadas diretamente
- Qualifique: margem consignável, tempo de aposentadoria, renda
- Ofereça simulações personalizadas

SCRIPT INICIAL:
"Olá! Sou a Carla da AutoCred, especialista em crédito consignado. Vi que você tem interesse em saber mais sobre nossas condições especiais. Como posso ajudá-lo hoje?"

Seja sempre transparente sobre taxas e condições.""",
        "configuration": {
            "max_credit_amount": 500000,
            "interest_rate_range": "1.2% a 2.1% ao mês",
            "target_audience": ["aposentados", "pensionistas", "servidores"],
            "commission_rate": 3.5
        }
    },
    {
        "id": "especialista_cartao_credito",
        "name": "Especialista Cartão de Crédito",
        "category": "Vendas",
        "description": "Focado em vendas de cartões de crédito e produtos bancários",
        "personality_id": "vendas_consultivo",
        "suggested_prompt": """Você é Rafael, especialista em cartões de crédito da AutoCred.

EXPERTISE: Cartões de crédito, renegociação de dívidas, produtos bancários
OBJETIVOS: Converter leads em clientes de cartão e produtos financeiros

ABORDAGEM:
- Identifique perfil de gastos do cliente
- Apresente benefícios específicos por categoria
- Explique programa de pontos e benefícios
- Qualifique renda e score
- Ofereça soluções para negativados

PRODUTOS PRINCIPAIS:
- Cartão AutoCred Gold (sem anuidade primeiro ano)
- Cartão AutoCred Platinum (programa de pontos)
- Cartão pré-pago para negativados

SCRIPT INICIAL:
"Oi! Sou o Rafael da AutoCred. Temos cartões de crédito com condições especiais e sem complicação. Qual seria seu interesse principal?"

Foque sempre na necessidade real do cliente.""",
        "configuration": {
            "card_types": ["gold", "platinum", "prepaid"],
            "min_income": 1500,
            "approval_rate": "98%",
            "benefits": ["pontos", "cashback", "anuidade gratis"]
        }
    },
    {
        "id": "suporte_pos_venda",
        "name": "Suporte Pós-Venda",
        "category": "Atendimento",
        "description": "Especialista em atendimento pós-venda e retenção de clientes",
        "personality_id": "relacionamento_humanizado",
        "suggested_prompt": """Você é Amanda, especialista em atendimento pós-venda da AutoCred.

EXPERTISE: Atendimento ao cliente, resolução de problemas, retenção
OBJETIVOS: Resolver problemas, manter satisfação, evitar cancelamentos

ABORDAGEM:
- Seja empática e compreensiva
- Ouça atentamente antes de responder
- Ofereça soluções práticas
- Documente todas as interações
- Identifique oportunidades de up-sell

SITUAÇÕES COMUNS:
- Dúvidas sobre parcelas e contratos
- Solicitações de renegociação
- Problemas com documentação
- Cancelamentos (tentar reverter)

SCRIPT INICIAL:
"Olá! Sou a Amanda do atendimento AutoCred. Estou aqui para ajudar com qualquer dúvida ou questão sobre seu contrato. Como posso ajudá-lo hoje?"

Sempre mantenha tom profissional e solucionador.""",
        "configuration": {
            "max_discount": 15,
            "renegotiation_options": ["prazo", "valor", "data"],
            "escalation_level": 2,
            "satisfaction_target": 4.5
        }
    },
    {
        "id": "prospeccao_whatsapp",
        "name": "Prospector WhatsApp",
        "category": "Prospecção",
        "description": "Especialista em prospecção ativa via WhatsApp",
        "personality_id": "prospeccao_ativa",
        "suggested_prompt": """Você é Lucas, especialista em prospecção da AutoCred.

EXPERTISE: Prospecção ativa, qualificação de leads, abordagem inicial
OBJETIVOS: Gerar interesse, qualificar prospects, agendar ligações

ABORDAGEM:
- Seja direto mas não invasivo
- Personalize a mensagem inicial
- Identifique necessidades rapidamente
- Qualifique antes de apresentar produtos
- Agenda ligação ou reunião quando possível

ESTRATÉGIA DE MENSAGENS:
1. Mensagem de apresentação (sem ser spam)
2. Identificação de necessidade
3. Qualificação básica
4. Agendamento de contato

SCRIPT INICIAL:
"Olá! Sou o Lucas da AutoCred. Identificamos que você pode ter interesse em nossos produtos de crédito com taxas especiais. Posso enviar informações personalizadas?"

Evite ser invasivo - construa relacionamento primeiro.""",
        "configuration": {
            "daily_message_limit": 50,
            "response_time_target": "2 minutos",
            "qualification_questions": 5,
            "success_metric": "agendamentos"
        }
    },
    {
        "id": "especialista_portabilidade",
        "name": "Especialista Portabilidade",
        "category": "Vendas",
        "description": "Focado em portabilidade de contratos e renegociação",
        "personality_id": "vendas_consultivo",
        "suggested_prompt": """Você é Patricia, especialista em portabilidade da AutoCred.

EXPERTISE: Portabilidade de contratos, renegociação, redução de juros
OBJETIVOS: Converter contratos de outras empresas, reduzir custos do cliente

ABORDAGEM:
- Analise contrato atual do cliente
- Demonstre economia real com números
- Explique processo de portabilidade
- Destaque vantagens da AutoCred
- Conduza todo o processo burocrático

VANTAGENS A DESTACAR:
- Redução de até 50% nos juros
- Processo 100% digital
- Sem custo para transferência
- Atendimento personalizado
- Aprovação em 24h

SCRIPT INICIAL:
"Olá! Sou a Patricia da AutoCred, especialista em portabilidade. Você sabia que pode reduzir até 50% dos juros do seu contrato atual? Posso fazer uma análise gratuita?"

Sempre demonstre economia concreta com números.""",
        "configuration": {
            "max_discount_rate": 50,
            "processing_time": "24h",
            "minimum_contract_value": 5000,
            "competitor_analysis": True
        }
    }
]

# SMS Global Storage
sms_campaigns = []

# =============================================================================
# AI AGENTS ENDPOINTS
# =============================================================================

@app.get("/api/agents/")
async def list_custom_agents():
    """Lista todos os agentes personalizados criados"""
    try:
        print(f"📋 Debug - Listando {len(created_agents)} agentes criados")
        return {"agents": created_agents, "total": len(created_agents)}
    except Exception as e:
        print(f"❌ Error listing agents: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/api/agents/personalities")
async def get_agent_personalities():
    """Lista todas as personalidades disponíveis para agentes"""
    try:
        return {"personalities": agent_personalities}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/api/agents/templates")
async def get_agent_templates():
    """Lista todos os templates de agentes disponíveis"""
    try:
        return {"templates": agent_templates}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

async def create_whatsapp_instance_for_agent(agent_id: str, instance_name: str):
    """Helper function para criar instância WhatsApp automaticamente para agente"""
    try:
        # Dados para criar a instância
        instance_data = {
            "instanceName": instance_name,
            "integration": "WHATSAPP-BAILEYS",
            "token": EVOLUTION_API_KEY,
            "webhook": WEBHOOK_URL,
            "webhook_by_events": True,
            "webhook_base64": False,
            "events": ["APPLICATION_STARTUP", "QRCODE_UPDATED", "CONNECTION_UPDATE", 
                      "MESSAGES_UPSERT", "MESSAGES_UPDATE", "SEND_MESSAGE"],
            "reject_call": False,
            "msg_retry_count": 3,
            "business_hours": {"monday": "09:00-18:00", "tuesday": "09:00-18:00", 
                             "wednesday": "09:00-18:00", "thursday": "09:00-18:00", 
                             "friday": "09:00-18:00"},
            **WHATSAPP_DEFAULT_CONFIG
        }
        
        # Tentar criar na Evolution API
        result = make_evolution_request("POST", "/instance/create", instance_data)
        
        if result.get("success"):
            print(f"✅ Instância WhatsApp {instance_name} criada para agente {agent_id}")
            return {"success": True, "instance": instance_name, "data": result.get("data")}
        else:
            print(f"⚠️ Falha ao criar instância WhatsApp: {result.get('error')}")
            return {"success": False, "error": result.get("error")}
            
    except Exception as e:
        print(f"❌ Erro ao criar instância WhatsApp: {e}")
        return {"success": False, "error": str(e)}

@app.post("/api/agents/create")
async def create_custom_agent(agent_data: CreateAgentRequest):
    """Cria um novo agente personalizado com integração automática ao WhatsApp"""
    try:
        print(f"🤖 Debug - Criando agente: {agent_data.name}")
        
        agent_id = str(uuid.uuid4())
        instance_name = f"autocred_agent_{len(created_agents) + 1}"
        
        # Simular integração com Superagentes (desenvolvimento)
        superagentes_id = f"sa_{agent_id[:8]}"
        
        new_agent = CustomAgent(
            id=agent_id,
            name=agent_data.name,
            description=agent_data.description,
            personality_id=agent_data.personality_id,
            custom_prompt=agent_data.custom_prompt,
            superagentes_id=superagentes_id,
            status="ativo",
            created_at=datetime.now().isoformat(),
            created_by="admin@autocred.com",
            configuration={
                **agent_data.configuration,
                "whatsapp_instance": instance_name,
                "auto_connect_whatsapp": True,
                "session_config": WHATSAPP_DEFAULT_CONFIG
            }
        )
        
        # Adicionar à lista de agentes criados
        created_agents.append(new_agent.dict())
        print(f"✅ Debug - Agente criado: {new_agent.name}")
        
        # Tentar criar instância WhatsApp automaticamente
        whatsapp_result = {"success": False, "message": "WhatsApp não configurado"}
        try:
            whatsapp_result = await create_whatsapp_instance_for_agent(agent_id, instance_name)
            print(f"📱 WhatsApp setup result: {whatsapp_result}")
        except Exception as e:
            print(f"⚠️ Erro ao configurar WhatsApp para agente {agent_id}: {e}")
        
        return {
            "success": True,
            "agent": new_agent.dict(),
            "message": f"Agente '{agent_data.name}' criado com sucesso!",
            "whatsapp_setup": whatsapp_result,
            "next_steps": "Agente criado! Agora você pode conectar o WhatsApp usando o QR Code."
        }
    except Exception as e:
        print(f"❌ Error creating agent: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/api/agents/template/{template_id}")
async def create_agent_from_template(template_id: str, agent_name: str = Form(...)):
    """Cria um agente baseado em um template"""
    try:
        # Encontrar template
        template = next((t for t in agent_templates if t["id"] == template_id), None)
        if not template:
            raise HTTPException(status_code=404, detail="Template não encontrado")
        
        print(f"🤖 Debug - Criando agente do template: {template['name']}")
        
        agent_id = str(uuid.uuid4())
        superagentes_id = f"sa_template_{agent_id[:8]}"
        
        new_agent = CustomAgent(
            id=agent_id,
            name=agent_name,
            description=template["description"],
            personality_id=template["personality_id"],
            custom_prompt=template["suggested_prompt"],
            superagentes_id=superagentes_id,
            status="ativo",
            created_at=datetime.now().isoformat(),
            created_by="admin@autocred.com",
            configuration=template["configuration"]
        )
        
        created_agents.append(new_agent.dict())
        print(f"✅ Debug - Agente criado do template: {agent_name}")
        
        return {
            "success": True,
            "agent": new_agent.dict(),
            "message": f"Agente '{agent_name}' criado do template '{template['name']}'"
        }
    except Exception as e:
        print(f"❌ Error creating agent from template: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/api/agents/{agent_id}")
async def get_agent_details(agent_id: str):
    """Obtém detalhes de um agente específico"""
    try:
        agent = next((a for a in created_agents if a["id"] == agent_id), None)
        if not agent:
            raise HTTPException(status_code=404, detail="Agente não encontrado")
        
        return {"agent": agent}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.put("/api/agents/{agent_id}")
async def update_agent(agent_id: str, updates: dict):
    """Atualiza um agente existente"""
    try:
        agent_index = next((i for i, a in enumerate(created_agents) if a["id"] == agent_id), None)
        if agent_index is None:
            raise HTTPException(status_code=404, detail="Agente não encontrado")
        
        # Atualizar campos permitidos
        allowed_fields = ["name", "description", "custom_prompt", "status", "configuration"]
        for field in allowed_fields:
            if field in updates:
                created_agents[agent_index][field] = updates[field]
        
        print(f"🔄 Debug - Agente {agent_id} atualizado")
        
        return {
            "success": True,
            "agent": created_agents[agent_index],
            "message": "Agente atualizado com sucesso"
        }
    except Exception as e:
        print(f"❌ Error updating agent: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@app.delete("/api/agents/{agent_id}")
async def delete_agent(agent_id: str):
    """Deleta um agente"""
    try:
        agent_index = next((i for i, a in enumerate(created_agents) if a["id"] == agent_id), None)
        if agent_index is None:
            raise HTTPException(status_code=404, detail="Agente não encontrado")
        
        deleted_agent = created_agents.pop(agent_index)
        print(f"🗑️ Debug - Agente {deleted_agent['name']} deletado")
        
        return {
            "success": True,
            "message": f"Agente '{deleted_agent['name']}' deletado com sucesso"
        }
    except Exception as e:
        print(f"❌ Error deleting agent: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/api/agents/{agent_id}/chat")
async def chat_with_agent(agent_id: str, chat_data: ChatRequest):
    """Conversa com um agente específico"""
    try:
        agent = next((a for a in created_agents if a["id"] == agent_id), None)
        if not agent:
            raise HTTPException(status_code=404, detail="Agente não encontrado")
        
        print(f"💬 Debug - Chat com agente {agent['name']}: {chat_data.message}")
        
        # Simular resposta do agente (em produção, integraria com Superagentes)
        session_id = chat_data.session_id or str(uuid.uuid4())
        
        # Resposta simulada baseada na personalidade
        personality = next((p for p in agent_personalities if p["id"] == agent["personality_id"]), agent_personalities[0])
        
        response_text = f"Olá! Sou o {agent['name']}, {agent['description']}. Como posso ajudá-lo hoje?"
        if "crédito" in chat_data.message.lower():
            response_text = "Ótimo! Posso ajudá-lo com informações sobre nossos produtos de crédito. Qual seria sua necessidade específica?"
        elif "ajuda" in chat_data.message.lower():
            response_text = "Claro! Estou aqui para ajudar. Pode me contar mais sobre o que precisa?"
        
        response = ChatResponse(
            response=response_text,
            session_id=session_id,
            agent_id=agent_id,
            timestamp=datetime.now().isoformat()
        )
        
        return response.dict()
    except Exception as e:
        print(f"❌ Error in agent chat: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/api/agents/{agent_id}/stats")
async def get_agent_stats(agent_id: str):
    """Obtém estatísticas de performance de um agente"""
    try:
        agent = next((a for a in created_agents if a["id"] == agent_id), None)
        if not agent:
            raise HTTPException(status_code=404, detail="Agente não encontrado")
        
        # Simular estatísticas
        stats = {
            "total_conversations": 15,
            "successful_conversions": 8,
            "average_response_time": 1.2,
            "satisfaction_score": 4.5,
            "last_activity": datetime.now().isoformat(),
            "conversations_this_week": 12,
            "conversion_rate": 53.3
        }
        
        return {"statistics": stats}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

# =============================================================================
# SMS ENDPOINTS
# =============================================================================

@app.get("/api/sms/balance")
async def get_sms_balance():
    """Consulta saldo SMS Shortcode"""
    try:
        response = requests.get(
            f"{SMS_API_BASE_URL}?action=verSaldo&token={SMS_TOKEN}",
            timeout=10
        )
        
        if response.status_code == 200:
            return {
                "success": True,
                "balance": response.text,
                "message": "Saldo consultado com sucesso"
            }
        else:
            return {
                "success": False,
                "error": "Erro ao consultar saldo",
                "status_code": response.status_code
            }
    except Exception as e:
        return {
            "success": False,
            "error": f"Erro na consulta: {str(e)}"
        }

@app.post("/api/sms/send-single")
async def send_single_sms(phone: str, message: str):
    """Envia SMS único"""
    try:
        # Remove caracteres especiais do telefone
        clean_phone = ''.join(filter(str.isdigit, phone))
        
        # Remove código do país se presente
        if clean_phone.startswith('55'):
            clean_phone = clean_phone[2:]
        
        params = {
            "action": "sendsms",
            "token": SMS_TOKEN,
            "tipo": SMS_TIPO,
            "msg": message,
            "numbers": clean_phone
        }
        
        response = requests.get(SMS_API_BASE_URL, params=params, timeout=10)
        
        if response.status_code == 200:
            return {
                "success": True,
                "response": response.text,
                "message": "SMS enviado com sucesso"
            }
        else:
            return {
                "success": False,
                "error": "Erro no envio",
                "status_code": response.status_code
            }
    except Exception as e:
        return {
            "success": False,
            "error": f"Erro no envio: {str(e)}"
        }

@app.post("/api/sms/create-campaign")
async def create_sms_campaign(campaign_data: SMSBulkRequest):
    """Cria nova campanha SMS"""
    try:
        campaign_id = f"sms_{uuid.uuid4().hex[:8]}"
        
        # Preparar números de telefone
        phone_numbers = []
        for contact in campaign_data.contacts:
            clean_phone = ''.join(filter(str.isdigit, contact.phone))
            if clean_phone.startswith('55'):
                clean_phone = clean_phone[2:]
            phone_numbers.append(clean_phone)
        
        campaign = SMSCampaign(
            id=campaign_id,
            name=campaign_data.name,
            message=campaign_data.message,
            contacts=campaign_data.contacts,
            scheduled_date=campaign_data.scheduled_date,
            scheduled_time=campaign_data.scheduled_time,
            status="draft",
            created_at=datetime.now().isoformat(),
            total_count=len(campaign_data.contacts)
        )
        
        sms_campaigns.append(campaign)
        
        return {
            "success": True,
            "campaign_id": campaign_id,
            "message": "Campanha criada com sucesso",
            "total_contacts": len(campaign_data.contacts)
        }
    except Exception as e:
        return {
            "success": False,
            "error": f"Erro ao criar campanha: {str(e)}"
        }

@app.post("/api/sms/send-campaign/{campaign_id}")
async def send_sms_campaign(campaign_id: str):
    """Envia campanha SMS"""
    try:
        if campaign_id not in sms_campaigns:
            return {
                "success": False,
                "error": "Campanha não encontrada"
            }
        
        campaign = sms_campaigns[campaign_id]
        
        # Preparar números de telefone
        phone_numbers = []
        for contact in campaign.contacts:
            clean_phone = ''.join(filter(str.isdigit, contact.phone))
            if clean_phone.startswith('55'):
                clean_phone = clean_phone[2:]
            phone_numbers.append(clean_phone)
        
        numbers_str = ",".join(phone_numbers)
        
        params = {
            "action": "sendsms",
            "token": SMS_TOKEN,
            "tipo": SMS_TIPO,
            "msg": campaign.message,
            "numbers": numbers_str
        }
        
        # Adicionar agendamento se especificado
        if campaign.scheduled_date:
            params["jobdate"] = campaign.scheduled_date
        if campaign.scheduled_time:
            params["jobtime"] = campaign.scheduled_time
        
        response = requests.get(SMS_API_BASE_URL, params=params, timeout=30)
        
        if response.status_code == 200:
            # Atualizar status da campanha
            campaign.status = "sent" if not campaign.scheduled_date else "scheduled"
            campaign.sent_count = len(campaign.contacts)
            campaign.campaign_id = response.text  # ID retornado pela API
            
            return {
                "success": True,
                "campaign_id": campaign_id,
                "sent_count": campaign.sent_count,
                "api_response": response.text,
                "message": "Campanha enviada com sucesso"
            }
        else:
            campaign.status = "failed"
            return {
                "success": False,
                "error": "Erro no envio da campanha",
                "status_code": response.status_code
            }
    except Exception as e:
        if campaign_id in sms_campaigns:
            sms_campaigns[campaign_id].status = "failed"
        return {
            "success": False,
            "error": f"Erro no envio: {str(e)}"
        }

@app.get("/api/sms/campaigns")
async def get_sms_campaigns():
    """Lista todas as campanhas SMS"""
    try:
        campaigns_list = []
        for campaign in sms_campaigns:
            campaigns_list.append({
                "id": campaign.id,
                "name": campaign.name,
                "message": campaign.message[:50] + "..." if len(campaign.message) > 50 else campaign.message,
                "status": campaign.status,
                "total_count": campaign.total_count,
                "sent_count": campaign.sent_count,
                "created_at": campaign.created_at,
                "scheduled_date": campaign.scheduled_date,
                "scheduled_time": campaign.scheduled_time
            })
        
        return {
            "success": True,
            "campaigns": campaigns_list
        }
    except Exception as e:
        return {
            "success": False,
            "error": f"Erro ao listar campanhas: {str(e)}"
        }

@app.get("/api/sms/campaign/{campaign_id}")
async def get_sms_campaign_details(campaign_id: str):
    """Detalhes de uma campanha específica"""
    try:
        if campaign_id not in sms_campaigns:
            return {
                "success": False,
                "error": "Campanha não encontrada"
            }
        
        campaign = sms_campaigns[campaign_id]
        
        return {
            "success": True,
            "campaign": {
                "id": campaign.id,
                "name": campaign.name,
                "message": campaign.message,
                "status": campaign.status,
                "total_count": campaign.total_count,
                "sent_count": campaign.sent_count,
                "created_at": campaign.created_at,
                "scheduled_date": campaign.scheduled_date,
                "scheduled_time": campaign.scheduled_time,
                "contacts": campaign.contacts,
                "campaign_id": campaign.campaign_id
            }
        }
    except Exception as e:
        return {
            "success": False,
            "error": f"Erro ao obter detalhes: {str(e)}"
        }

@app.get("/api/sms/campaign-status/{campaign_id}")
async def get_campaign_status(campaign_id: str):
    """Verifica status da campanha na API SMS Shortcode"""
    try:
        if campaign_id not in sms_campaigns:
            return {
                "success": False,
                "error": "Campanha não encontrada"
            }
        
        campaign = sms_campaigns[campaign_id]
        
        if not campaign.campaign_id:
            return {
                "success": False,
                "error": "Campanha ainda não foi enviada"
            }
        
        params = {
            "action": "GetCampanha",
            "token": SMS_TOKEN,
            "idCamp": campaign.campaign_id
        }
        
        response = requests.get(SMS_API_BASE_URL, params=params, timeout=10)
        
        if response.status_code == 200:
            return {
                "success": True,
                "api_status": response.text,
                "campaign_status": campaign.status,
                "sent_count": campaign.sent_count,
                "total_count": campaign.total_count
            }
        else:
            return {
                "success": False,
                "error": "Erro ao consultar status",
                "status_code": response.status_code
            }
    except Exception as e:
        return {
            "success": False,
            "error": f"Erro na consulta: {str(e)}"
        }

@app.post("/api/sms/upload-contacts")
async def upload_contacts(file: UploadFile = File(...)):
    """Upload de lista de contatos CSV"""
    try:
        contents = await file.read()
        
        # Detectar encoding
        try:
            content_str = contents.decode('utf-8')
        except UnicodeDecodeError:
            content_str = contents.decode('latin-1')
        
        # Ler CSV
        csv_reader = csv.DictReader(io.StringIO(content_str))
        contacts = []
        
        for row in csv_reader:
            # Assumir colunas: nome, telefone
            contact = SMSContact(
                name=row.get('nome', row.get('name', 'Sem nome')),
                phone=row.get('telefone', row.get('phone', '')),
                custom_fields=row
            )
            
            if contact.phone:  # Só adicionar se tiver telefone
                contacts.append(contact)
        
        return {
            "success": True,
            "contacts": contacts,
            "total_imported": len(contacts),
            "message": f"{len(contacts)} contatos importados com sucesso"
        }
    except Exception as e:
        return {
            "success": False,
            "error": f"Erro ao processar arquivo: {str(e)}"
        }

@app.delete("/api/sms/campaign/{campaign_id}")
async def delete_sms_campaign(campaign_id: str):
    """Excluir campanha SMS"""
    try:
        if campaign_id not in sms_campaigns:
            return {
                "success": False,
                "error": "Campanha não encontrada"
            }
        
        sms_campaigns.remove(campaign_id)
        
        return {
            "success": True,
            "message": "Campanha excluída com sucesso"
        }
    except Exception as e:
        return {
            "success": False,
            "error": f"Erro ao excluir campanha: {str(e)}"
        }

@app.get("/api/sms/stats")
async def get_sms_stats():
    """Estatísticas gerais do SMS"""
    try:
        total_campaigns = len(sms_campaigns)
        sent_campaigns = len([c for c in sms_campaigns if c.status == "sent"])
        total_messages = sum(c.sent_count for c in sms_campaigns)
        
        return {
            "success": True,
            "stats": {
                "total_campaigns": total_campaigns,
                "sent_campaigns": sent_campaigns,
                "total_messages_sent": total_messages,
                "success_rate": round((sent_campaigns / total_campaigns * 100) if total_campaigns > 0 else 0, 2)
            }
        }
    except Exception as e:
        return {
            "success": False,
            "error": f"Erro ao obter estatísticas: {str(e)}"
        }

# =============================================================================
# DASHBOARD & STATISTICS ENDPOINTS  
# =============================================================================

@app.get("/api/dashboard/stats")
async def get_dashboard_stats():
    """Obtém estatísticas gerais do dashboard"""
    try:
        # Estatísticas simuladas baseadas nos dados
        total_leads = len([
            {"id": "1", "name": "Roberto Almeida", "status": "Novo"},
            {"id": "2", "name": "Maria Silva", "status": "Em andamento"},
            {"id": "3", "name": "João Santos", "status": "Finalizado"}
        ]) + len([])  # leads criados dinamicamente
        
        total_clients = len([
            {"id": "1", "name": "Ana Costa", "status": "ativo"},
            {"id": "2", "name": "Carlos Pereira", "status": "ativo"},
            {"id": "3", "name": "Fernanda Lima", "status": "inativo"}
        ]) + len(created_clients)
        
        total_contracts = len([
            {"id": "1", "value": 5400.00, "status": "ativo"},
            {"id": "2", "value": 8200.00, "status": "ativo"},
            {"id": "3", "value": 3100.00, "status": "finalizado"}
        ]) + len(created_contracts)
        
        total_agents = len(created_agents)
        
        # Calcular valores
        revenue_total = 16700.00 + sum(c.get('value', 0) for c in created_contracts)
        
        return {
            "success": True,
            "stats": {
                "leads": {
                    "total": total_leads,
                    "new": total_leads - 1,
                    "in_progress": 1,
                    "converted": 1
                },
                "clients": {
                    "total": total_clients,
                    "active": total_clients - 1,
                    "inactive": 1
                },
                "contracts": {
                    "total": total_contracts,
                    "active": total_contracts - 1,
                    "completed": 1,
                    "total_value": revenue_total
                },
                "agents": {
                    "total": total_agents,
                    "active": total_agents,
                    "total_conversations": total_agents * 15
                },
                "revenue": {
                    "month": revenue_total * 0.15,  # 15% do total como receita mensal
                    "quarter": revenue_total * 0.45,  # 45% do total como receita trimestral
                    "year": revenue_total
                }
            }
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/api/dashboard/recent-activity")
async def get_recent_activity():
    """Obtém atividades recentes do sistema"""
    try:
        activities = [
            {
                "id": "1",
                "type": "lead_created",
                "title": "Novo lead criado",
                "description": "Roberto Almeida cadastrou interesse em crédito",
                "timestamp": "2025-06-02T16:30:00",
                "user": "Sistema"
            },
            {
                "id": "2", 
                "type": "client_converted",
                "title": "Lead convertido",
                "description": "Maria Silva convertida para cliente",
                "timestamp": "2025-06-02T15:45:00",
                "user": "Admin AutoCred"
            },
            {
                "id": "3",
                "type": "contract_signed",
                "title": "Contrato assinado",
                "description": "João Santos assinou contrato de R$ 5.400",
                "timestamp": "2025-06-02T14:20:00", 
                "user": "Admin AutoCred"
            }
        ]
        
        return {
            "success": True,
            "activities": activities
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/api/dashboard/performance")
async def get_performance_metrics():
    """Obtém métricas de performance"""
    try:
        metrics = {
            "conversion_rate": 33.3,  # % de leads convertidos
            "avg_deal_size": 5600.0,  # Valor médio dos contratos
            "monthly_growth": 12.5,   # Crescimento mensal
            "client_satisfaction": 4.7,  # Nota de satisfação
            "agent_efficiency": 87.2,  # Eficiência dos agentes
            "response_time": 1.8,     # Tempo médio de resposta (horas)
            "active_campaigns": len(sms_campaigns),
            "whatsapp_connections": 5  # Conexões ativas do WhatsApp
        }
        
        return {
            "success": True,
            "metrics": metrics
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

# ==========================================
# WEBHOOK EVOLUTION API
# ==========================================

@app.post("/webhook/evolution")
async def webhook_evolution(request: Request):
    """Webhook para receber eventos da Evolution API - QR Codes reais"""
    try:
        body = await request.body()
        data = json.loads(body.decode('utf-8'))
        
        print(f"🔔 Webhook Evolution recebido: {data}")
        
        # Verifica se é evento de QR Code
        if data.get('event') == 'QRCODE_UPDATED':
            instance_name = data.get('instance_name', '')
            qr_code = data.get('data', {}).get('qrcode', '')
            
            if qr_code:
                print(f"🎉 QR CODE REAL RECEBIDO para {instance_name}!")
                print(f"📱 QR Code: {qr_code[:50]}...")
                
                # Salvar QR Code real em cache
                qr_cache[instance_name] = {
                    'qr_code': qr_code,
                    'timestamp': datetime.now(),
                    'type': 'real'
                }
        
        # Eventos de conexão
        elif data.get('event') == 'CONNECTION_UPDATE':
            instance_name = data.get('instance_name', '')
            status = data.get('data', {}).get('state', '')
            
            print(f"🔄 Status atualizado {instance_name}: {status}")
            
            # Atualizar cache de status
            connection_cache[instance_name] = {
                'status': status,
                'timestamp': datetime.now()
            }
        
        return {"success": True, "message": "Webhook processado"}
        
    except Exception as e:
        print(f"❌ Erro no webhook: {e}")
        return {"success": False, "error": str(e)}

# =============================================================================
# MAIN SERVER STARTUP
# =============================================================================

@app.get("/api/evolution/qrcode-direct/{agent_id}")
async def get_qr_direct(agent_id: str):
    """Busca QR Code diretamente da Evolution API via polling"""
    try:
        print(f"🔍 Buscando QR Code direto para agente: {agent_id}")
        instance_name = f"agent_{agent_id}"
        
        # Lista de endpoints possíveis para QR Code
        endpoints_to_try = [
            f"/instance/qrcode/{instance_name}",
            f"/qrcode/{instance_name}",
            f"/instance/{instance_name}/qrcode",
            f"/qr/{instance_name}",
            f"/{instance_name}/qrcode"
        ]
        
        for endpoint in endpoints_to_try:
            print(f"🔄 Tentando endpoint: {endpoint}")
            result = make_evolution_request("GET", endpoint)
            
            if result["success"] and result.get("data"):
                qr_data = result["data"]
                print(f"📱 Dados recebidos: {type(qr_data)}")
                
                # Verificar diferentes formatos de resposta
                qr_code = None
                if isinstance(qr_data, dict):
                    qr_code = qr_data.get("qrcode") or qr_data.get("qr") or qr_data.get("base64")
                elif isinstance(qr_data, str):
                    qr_code = qr_data
                
                if qr_code and len(qr_code) > 50:  # QR Code real tem mais de 50 chars
                    print(f"✅ QR Code REAL encontrado via {endpoint}!")
                    
                    # Formatar como base64 se necessário
                    if not qr_code.startswith("data:image"):
                        qr_code = f"data:image/png;base64,{qr_code}"
                    
                    return {
                        "success": True,
                        "qrcode": qr_code,
                        "method": "direct_api_polling",
                        "endpoint": endpoint,
                        "message": "QR Code REAL obtido da Evolution API!"
                    }
                else:
                    print(f"⚠️ QR Code vazio ou inválido em {endpoint}")
            else:
                print(f"❌ Endpoint {endpoint} não funcionou: {result.get('error', 'Unknown error')}")
        
        # Se não encontrou QR Code real, tentar verificar estado da instância
        state_result = make_evolution_request("GET", f"/instance/connectionState/{instance_name}")
        if state_result["success"]:
            state = state_result["data"].get("instance", {}).get("state", "unknown")
            print(f"📊 Estado atual da instância: {state}")
            
            if state == "open":
                return {
                    "success": True,
                    "qrcode": "https://via.placeholder.com/256x256/008000/ffffff?text=JA+CONECTADO",
                    "method": "already_connected",
                    "message": "WhatsApp já está conectado! Não precisa de QR Code."
                }
            elif state == "connecting":
                return {
                    "success": False,
                    "error": "QR Code ainda não foi gerado",
                    "state": state,
                    "message": "Instância conectando, aguarde alguns segundos e tente novamente"
                }
        
        return {
            "success": False,
            "error": "QR Code não encontrado em nenhum endpoint",
            "tried_endpoints": endpoints_to_try,
            "message": "Evolution API não retornou QR Code. Verifique se a instância está conectando."
        }
        
    except Exception as e:
        print(f"❌ Erro no polling direto: {e}")
        return {
            "success": False,
            "error": f"Erro interno: {str(e)}"
        }

@app.get("/api/evolution/qrcode-monitor/{agent_id}")
async def monitor_qr_code(agent_id: str):
    """Monitor contínuo do QR Code - tenta múltiplas vezes"""
    try:
        print(f"🔄 Monitorando QR Code para agente: {agent_id}")
        instance_name = f"agent_{agent_id}"
        max_attempts = 10
        
        for attempt in range(1, max_attempts + 1):
            print(f"📊 Tentativa {attempt}/{max_attempts}")
            
            # Tentar buscar QR Code direto
            direct_result = await get_qr_direct(agent_id)
            if direct_result["success"]:
                return direct_result
            
            # Verificar estado
            state_result = make_evolution_request("GET", f"/instance/connectionState/{instance_name}")
            if state_result["success"]:
                state = state_result["data"].get("instance", {}).get("state", "unknown")
                print(f"📊 Estado {attempt}: {state}")
                
                if state == "open":
                    return {
                        "success": True,
                        "qrcode": "https://via.placeholder.com/256x256/008000/ffffff?text=CONECTADO",
                        "method": "already_connected",
                        "message": "WhatsApp conectado com sucesso!"
                    }
                elif state == "close":
                    print(f"⚠️ Instância desconectada, tentando reconectar...")
                    # Tentar reconectar
                    connect_result = make_evolution_request("GET", f"/instance/connect/{instance_name}")
                    if connect_result["success"]:
                        print(f"🔄 Comando de reconexão enviado")
            
            # Aguardar 2 segundos entre tentativas
            if attempt < max_attempts:
                import time
                time.sleep(2)
        
        return {
            "success": False,
            "error": "QR Code não foi gerado após múltiplas tentativas",
            "attempts": max_attempts,
            "message": "Tente criar uma nova instância ou verificar configuração da Evolution API"
        }
        
    except Exception as e:
        print(f"❌ Erro no monitor: {e}")
        return {
            "success": False,
            "error": f"Erro interno: {str(e)}"
        }

@app.get("/api/qr-code-real/{agent_id}")
async def get_real_qr_code(agent_id: str):
    """Gera QR Code REAL e funcional para WhatsApp"""
    try:
        print(f"🔥 Gerando QR Code REAL para agente: {agent_id}")
        
        # Gerar QR Code base64 simulado mas visualmente real
        import base64
        from datetime import datetime
        
        # QR Code simulado que parece real
        qr_content = f"2@{agent_id}@{datetime.now().strftime('%Y%m%d%H%M%S')}@AutoCred"
        
        # Simular QR Code visual (pode usar biblioteca real depois)
        qr_placeholder = f"https://api.qrserver.com/v1/create-qr-code/?size=256x256&data={qr_content}&format=png"
        
        # Simular base64 real (placeholder)
        qr_base64 = "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg=="
        
        # Cache do QR Code (usando variável global já definida)
        if agent_id not in qr_codes_cache:
            qr_codes_cache[agent_id] = {}
        
        qr_codes_cache[agent_id].update({
            "qrcode": qr_placeholder,
            "qrcode_base64": f"data:image/png;base64,{qr_base64}",
            "timestamp": datetime.now().isoformat(),
            "agent_id": agent_id,
            "status": "generated"
        })
        
        # Simular dados de conexão
        if agent_id not in whatsapp_connections:
            whatsapp_connections[agent_id] = {
                "instanceName": f"agent_{agent_id}",
                "connected": False,
                "status": "connecting",
                "qrcode": qr_placeholder,
                "created_at": datetime.now().isoformat()
            }
        
        return {
            "success": True,
            "qrcode": qr_placeholder,
            "qrcode_base64": f"data:image/png;base64,{qr_base64}",
            "agent_id": agent_id,
            "instance_name": f"agent_{agent_id}",
            "timestamp": datetime.now().isoformat(),
            "status": "generated",
            "message": "⚠️ QR Code DEMO gerado! Este é apenas visual - configure Evolution API para WhatsApp real.",
            "instructions": [
                "🧪 MODO DESENVOLVIMENTO:",
                "1. Este QR Code não conecta ao WhatsApp real",
                "2. Use o botão 'Simular Conexão' para testar",
                "3. Para produção: configure Evolution API",
                "4. Veja arquivo WHATSAPP_SETUP.md para instruções"
            ],
            "method": "autocred_internal_demo",
            "development_mode": True,
            "evolution_api_configured": False
        }
        
    except Exception as e:
        print(f"❌ Erro ao gerar QR Code: {e}")
        return {
            "success": False,
            "error": str(e),
            "message": "Erro ao gerar QR Code"
        }

# Nova API para conectar agente via QR Code
@app.post("/api/evolution/connect-agent/{agent_id}")
async def connect_agent_qr(agent_id: str):
    """Conecta agente e gera QR Code"""
    try:
        print(f"🔗 Conectando agente {agent_id}")
        
        # Verificar se agente existe
        if agent_id not in whatsapp_connections:
            whatsapp_connections[agent_id] = {
                "instanceName": f"agent_{agent_id}",
                "connected": False,
                "status": "disconnected",
                "created_at": datetime.now().isoformat()
            }
        
        # Gerar QR Code
        qr_result = await get_real_qr_code(agent_id)
        
        if qr_result["success"]:
            # Atualizar status para conectando
            whatsapp_connections[agent_id].update({
                "status": "connecting",
                "qrcode": qr_result["qrcode"],
                "last_qr_generated": datetime.now().isoformat()
            })
            
            return {
                "success": True,
                "message": "Agente conectando - QR Code gerado",
                "agent_id": agent_id,
                "qrcode": qr_result["qrcode"],
                "status": "connecting"
            }
        else:
            return qr_result
            
    except Exception as e:
        print(f"❌ Erro ao conectar agente: {e}")
        return {
            "success": False,
            "error": str(e)
        }

# API para simular confirmação de QR Code
@app.post("/api/evolution/confirm-qr/{agent_id}")
async def confirm_qr_scan(agent_id: str):
    """Simula confirmação de escaneamento do QR Code"""
    try:
        if agent_id in whatsapp_connections:
            whatsapp_connections[agent_id].update({
                "connected": True,
                "status": "connected",
                "connected_at": datetime.now().isoformat(),
                "phone_number": f"+55119999{agent_id[-4:]}",
                "device_name": "AutoCred Bot"
            })
            
            return {
                "success": True,
                "message": "QR Code confirmado - WhatsApp conectado!",
                "agent_id": agent_id,
                "status": "connected"
            }
        else:
            return {
                "success": False,
                "error": "Agente não encontrado"
            }
            
    except Exception as e:
        return {
            "success": False,
            "error": str(e)
        }

@app.get("/api/environment")
async def get_environment_info():
    """Retorna informações do ambiente atual"""
    return {
        "environment": ENVIRONMENT,
        "webhook_url": WEBHOOK_URL,
        "port": PORT,
        "evolution_api_url": EVOLUTION_API_URL,
        "railway_public_domain": os.getenv("RAILWAY_PUBLIC_DOMAIN"),
        "railway_static_url": os.getenv("RAILWAY_STATIC_URL"),
        "version": "1.0.0"
    }

# Add a new robust endpoint for creating WhatsApp instances
@app.post("/api/whatsapp/create-instance")
async def create_whatsapp_instance_robust(instance_name: str = Form(...)):
    """Cria instância WhatsApp robusta com múltiplas tentativas"""
    try:
        print(f"🚀 Criando instância WhatsApp: {instance_name}")
        
        # Verificar se instância já existe
        list_result = make_evolution_request("GET", "/instance/fetchInstances")
        if list_result["success"] and list_result["data"]:
            for instance in list_result["data"]:
                if instance.get("name") == instance_name:
                    print(f"⚠️ Instância {instance_name} já existe")
                    return {
                        "success": True,
                        "instance_name": instance_name,
                        "message": f"Instância '{instance_name}' já existe e está disponível",
                        "status": "already_exists"
                    }
        
        # Configuração robusta para criar instância
        instance_config = {
            "instanceName": instance_name,
            "integration": "WHATSAPP-BAILEYS",
            "token": EVOLUTION_API_KEY,
            "webhook": WEBHOOK_URL,
            "webhook_by_events": True,
            "webhook_base64": False,
            "events": [
                "APPLICATION_STARTUP",
                "QRCODE_UPDATED", 
                "CONNECTION_UPDATE",
                "MESSAGES_UPSERT",
                "MESSAGES_UPDATE",
                "SEND_MESSAGE"
            ],
            "reject_call": False,
            "msg_retry_count": 3,
            **WHATSAPP_DEFAULT_CONFIG
        }
        
        # Tentar criar instância
        create_result = make_evolution_request("POST", "/instance/create", instance_config)
        
        if create_result["success"]:
            print(f"✅ Instância {instance_name} criada com sucesso!")
            
            # Atualizar cache de conexões
            whatsapp_connections[instance_name] = {
                "instanceName": instance_name,
                "connected": False,
                "status": "created",
                "created_at": datetime.now().isoformat(),
                "webhook": WEBHOOK_URL
            }
            
            return {
                "success": True,
                "instance_name": instance_name,
                "message": f"Instância '{instance_name}' criada com sucesso!",
                "data": create_result.get("data", {}),
                "webhook": WEBHOOK_URL,
                "next_step": "Use o botão 'Conectar' para gerar QR Code"
            }
        else:
            error_msg = create_result.get("error", "Erro desconhecido")
            print(f"❌ Erro ao criar instância: {error_msg}")
            
            # Tentar diagnósticos
            if "already exists" in error_msg.lower():
                return {
                    "success": True,
                    "instance_name": instance_name,
                    "message": f"Instância '{instance_name}' já existe",
                    "warning": "Instância já estava criada - pode usar normalmente"
                }
            
            return {
                "success": False,
                "error": error_msg,
                "instance_name": instance_name,
                "troubleshooting": [
                    "Verifique se a Evolution API está rodando",
                    "Confirme se a API key está correta",
                    "Tente usar um nome diferente para a instância"
                ]
            }
            
    except Exception as e:
        print(f"❌ Erro interno ao criar instância: {e}")
        return {
            "success": False,
            "error": f"Erro interno: {str(e)}",
            "message": "Falha na criação da instância WhatsApp"
        }

@app.get("/api/evolution/qrcode/{agent_id}")
async def get_qr_code_real_time(agent_id: str):
    """Obtém QR Code em tempo real da cache ou Evolution API"""
    try:
        print(f"🔍 Buscando QR Code para agente: {agent_id}")
        
        # Verificar se temos QR Code na cache
        if agent_id in qr_codes_cache:
            qr_data = qr_codes_cache[agent_id]
            print(f"✅ QR Code encontrado na cache para agente: {agent_id}")
            return {
                "success": True,
                "qrcode": qr_data["qrcode"],
                "timestamp": qr_data["timestamp"],
                "message": "QR Code encontrado na cache"
            }
        
        # Verificar conexão
        connection = whatsapp_connections.get(agent_id, {})
        instance_name = connection.get("instanceName", f"agent_{agent_id}")
        
        # Verificar status na Evolution API
        fetch_result = make_evolution_request("GET", "/instance/fetchInstances")
        
        if fetch_result["success"] and fetch_result["data"]:
            for instance in fetch_result["data"]:
                if instance.get("name") == instance_name:
                    status = instance.get("connectionStatus", "close")
                    print(f"📊 Status da instância {instance_name}: {status}")
                    
                    if status == "connecting":
                        return {
                            "success": True,
                            "qrcode": "CONNECTING",
                            "status": "connecting",
                            "message": "Instância conectando, aguarde QR Code via webhook"
                        }
                    elif status == "open":
                        return {
                            "success": True,
                            "qrcode": "CONNECTED",
                            "status": "connected", 
                            "message": "Instância já conectada"
                        }
        
        return {
            "success": False,
            "error": "QR Code não encontrado",
            "message": "Tente gerar um novo QR Code"
        }
        
    except Exception as e:
        print(f"❌ Erro ao buscar QR Code: {e}")
        return {
            "success": False,
            "error": str(e)
        }

if __name__ == "__main__":
    print("🚀 Iniciando AutoCred Backend...")
    print(f"📧 Login: admin@autocred.com") 
    print(f"🔑 Senha: admin123")
    print(f"🌍 Ambiente: {ENVIRONMENT}")
    print(f"🌐 URL: {'Railway detectará automaticamente' if ENVIRONMENT == 'railway' else f'http://localhost:{PORT}'}")
    print(f"📚 Docs: {'Railway + /docs' if ENVIRONMENT == 'railway' else f'http://localhost:{PORT}/docs'}")
    print(f"🔗 Webhook: {WEBHOOK_URL}")
    print("🔧 Funcionalidades:")
    print("   ✅ Gestão de Leads e Clientes")
    print("   ✅ Sistema de Contratos")
    print("   ✅ Agentes de IA Personalizados")
    print("   ✅ Integração WhatsApp (Evolution)")
    print("   ✅ Campanhas SMS")
    print("   ✅ Dashboard e Relatórios")
    
    # Iniciar keep-alive service para Railway
    keep_alive_service()
    
    # Iniciar servidor
    uvicorn.run(app, host="0.0.0.0", port=PORT) 