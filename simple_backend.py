#!/usr/bin/env python3
"""
Backend simples para testar criação de agentes
"""

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import uvicorn
from typing import List, Optional
import uuid
from datetime import datetime

app = FastAPI(title="AutoCred API Simples", version="1.0.0")

# Configurar CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Modelos
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

class CreateAgentRequest(BaseModel):
    name: str
    description: str
    personality_id: str
    custom_prompt: str
    configuration: Optional[dict] = {}

# Dados globais
created_agents = []

agent_personalities = [
    {
        "id": "friendly",
        "name": "Amigável",
        "description": "Personalidade acolhedora e simpática",
        "tone": "amigável",
        "expertise": ["atendimento", "vendas"],
        "use_cases": ["suporte", "vendas", "relacionamento"]
    },
    {
        "id": "professional",
        "name": "Profissional",
        "description": "Personalidade formal e técnica",
        "tone": "profissional",
        "expertise": ["consultoria", "suporte técnico"],
        "use_cases": ["consultoria", "suporte", "análises"]
    },
    {
        "id": "empathetic",
        "name": "Empático",
        "description": "Personalidade compreensiva e acolhedora",
        "tone": "empático",
        "expertise": ["relacionamento", "suporte"],
        "use_cases": ["atendimento humanizado", "resolução de conflitos"]
    }
]

# Endpoints
@app.get("/")
async def root():
    return {"message": "AutoCred API Simples funcionando!", "status": "online"}

@app.get("/api/health")
async def health_check():
    return {
        "status": "healthy",
        "message": "Backend AutoCred rodando na porta 8000"
    }

@app.get("/api/agents/")
async def list_custom_agents():
    """Lista todos os agentes personalizados criados"""
    try:
        print(f"📋 DEBUG - Listando {len(created_agents)} agentes criados")
        return {"agents": created_agents, "total": len(created_agents)}
    except Exception as e:
        print(f"❌ Error listing agents: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/api/agents/personalities")
async def get_agent_personalities():
    """Lista todas as personalidades disponíveis para agentes"""
    try:
        print(f"👥 DEBUG - Retornando {len(agent_personalities)} personalidades")
        return {"personalities": agent_personalities}
    except Exception as e:
        print(f"❌ Error getting personalities: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/api/agents/templates")
async def get_agent_templates():
    """Lista todos os templates de agentes disponíveis"""
    try:
        templates = [
            {
                "id": "vendedor_credito",
                "name": "Vendedor de Crédito",
                "category": "Vendas",
                "description": "Especialista em vendas de produtos de crédito",
                "personality_id": "friendly",
                "suggested_prompt": "Você é um especialista em vendas de produtos de crédito. Seja persuasivo mas respeitoso.",
                "configuration": {}
            },
            {
                "id": "suporte_cliente",
                "name": "Suporte ao Cliente",
                "category": "Atendimento",
                "description": "Especialista em atendimento e suporte",
                "personality_id": "empathetic",
                "suggested_prompt": "Você é um especialista em atendimento ao cliente. Seja sempre útil e compreensivo.",
                "configuration": {}
            }
        ]
        return {"templates": templates}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/api/agents/create")
async def create_custom_agent(agent_data: CreateAgentRequest):
    """Cria um novo agente personalizado"""
    try:
        print(f"🤖 DEBUG - Criando agente: {agent_data.name}")
        print(f"📝 DEBUG - Dados recebidos: {agent_data.dict()}")
        
        agent_id = str(uuid.uuid4())
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
            configuration=agent_data.configuration or {}
        )
        
        created_agents.append(new_agent.dict())
        print(f"✅ DEBUG - Agente criado com sucesso: {new_agent.name}")
        print(f"📊 DEBUG - Total de agentes: {len(created_agents)}")
        
        return {
            "success": True,
            "agent": new_agent.dict(),
            "message": f"Agente '{agent_data.name}' criado com sucesso"
        }
    except Exception as e:
        print(f"❌ Error creating agent: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@app.delete("/api/agents/{agent_id}")
async def delete_agent(agent_id: str):
    """Deleta um agente"""
    try:
        global created_agents
        agent_index = next((i for i, a in enumerate(created_agents) if a["id"] == agent_id), None)
        if agent_index is None:
            raise HTTPException(status_code=404, detail="Agente não encontrado")
        
        deleted_agent = created_agents.pop(agent_index)
        print(f"🗑️ DEBUG - Agente {deleted_agent['name']} deletado")
        
        return {
            "success": True,
            "message": f"Agente '{deleted_agent['name']}' deletado com sucesso"
        }
    except Exception as e:
        print(f"❌ Error deleting agent: {e}")
        raise HTTPException(status_code=500, detail=str(e))

if __name__ == "__main__":
    print("🚀 Iniciando AutoCred Backend Simples...")
    print(f"📧 URL: http://localhost:8000")
    print(f"📚 Docs: http://localhost:8000/docs")
    print("🔧 Funcionalidades:")
    print("   ✅ Criação de Agentes de IA")
    print("   ✅ Listagem de Personalidades")
    print("   ✅ Templates de Agentes")
    
    uvicorn.run(app, host="0.0.0.0", port=8000) 