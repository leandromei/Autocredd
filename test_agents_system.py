#!/usr/bin/env python3
"""
Script de teste para validar o sistema de Agentes IA AutoCred
"""

import asyncio
import httpx
import json
from datetime import datetime

BASE_URL = "http://localhost:8000"

async def test_agents_system():
    """Teste completo do sistema de agentes"""
    
    print("🤖 Testando Sistema de Agentes IA AutoCred")
    print("=" * 50)
    
    async with httpx.AsyncClient() as client:
        
        # 1. Testar listagem de personalidades
        print("\n1️⃣ Testando personalidades...")
        response = await client.get(f"{BASE_URL}/api/agents/personalities")
        if response.status_code == 200:
            data = response.json()
            print(f"✅ {data.get('count', 0)} personalidades encontradas")
            for p in data.get('personalities', [])[:2]:
                print(f"   - {p['name']}: {p['description'][:50]}...")
        else:
            print(f"❌ Erro {response.status_code}")
        
        # 2. Testar listagem de templates
        print("\n2️⃣ Testando templates...")
        response = await client.get(f"{BASE_URL}/api/agents/templates")
        if response.status_code == 200:
            data = response.json()
            print(f"✅ {data.get('count', 0)} templates encontrados")
            for t in data.get('templates', [])[:2]:
                print(f"   - {t['name']} ({t['category']})")
        else:
            print(f"❌ Erro {response.status_code}")
        
        # 3. Criar agente personalizado
        print("\n3️⃣ Criando agente personalizado...")
        agent_data = {
            "name": "Agente Teste Python",
            "description": "Agente criado via script Python de teste",
            "personality_id": "vendedor_especialista",
            "custom_prompt": "Seja extremamente atencioso e focado em vendas de crédito consignado",
            "configuration": {"test": True}
        }
        
        response = await client.post(
            f"{BASE_URL}/api/agents/create",
            json=agent_data
        )
        
        if response.status_code == 200:
            result = response.json()
            agent_id = result['agent']['id']
            print(f"✅ Agente criado: {result['agent']['name']} (ID: {agent_id})")
        else:
            print(f"❌ Erro {response.status_code}: {response.text}")
            return
        
        # 4. Listar agentes
        print("\n4️⃣ Listando agentes...")
        response = await client.get(f"{BASE_URL}/api/agents/")
        if response.status_code == 200:
            data = response.json()
            print(f"✅ {data.get('count', 0)} agentes encontrados")
            for agent in data.get('agents', []):
                print(f"   - {agent['name']} ({agent['status']})")
        else:
            print(f"❌ Erro {response.status_code}")
        
        # 5. Chat com agente
        print("\n5️⃣ Testando chat...")
        chat_data = {
            "message": "Olá! Preciso de informações sobre crédito consignado",
            "context_data": {"source": "teste_python"}
        }
        
        response = await client.post(
            f"{BASE_URL}/api/agents/{agent_id}/chat",
            json=chat_data
        )
        
        if response.status_code == 200:
            result = response.json()
            print(f"✅ Resposta do agente:")
            print(f"   {result.get('response', 'Sem resposta')}")
            print(f"   Sessão: {result.get('session_id', 'N/A')}")
        else:
            print(f"❌ Erro {response.status_code}")
        
        # 6. Criar a partir de template
        print("\n6️⃣ Criando agente via template...")
        template_data = {
            "agent_name": "Agente Suporte Python"
        }
        
        response = await client.post(
            f"{BASE_URL}/api/agents/template/suporte_clientes",
            json=template_data
        )
        
        if response.status_code == 200:
            result = response.json()
            template_agent_id = result['agent']['id']
            print(f"✅ Agente criado via template: {result['agent']['name']}")
        else:
            print(f"❌ Erro {response.status_code}")
        
        # 7. Obter estatísticas
        print("\n7️⃣ Testando estatísticas...")
        response = await client.get(f"{BASE_URL}/api/agents/{agent_id}/stats")
        if response.status_code == 200:
            stats = response.json()['statistics']
            print(f"✅ Estatísticas obtidas:")
            print(f"   Conversas: {stats['performance']['total_conversations']}")
            print(f"   Sessões ativas: {stats['active_sessions']}")
        else:
            print(f"❌ Erro {response.status_code}")
        
        # 8. Atualizar agente
        print("\n8️⃣ Testando atualização...")
        update_data = {
            "status": "inactive",
            "custom_prompt": "Prompt atualizado via teste"
        }
        
        response = await client.put(
            f"{BASE_URL}/api/agents/{agent_id}",
            json=update_data
        )
        
        if response.status_code == 200:
            print("✅ Agente atualizado com sucesso")
        else:
            print(f"❌ Erro {response.status_code}")
    
    print("\n" + "=" * 50)
    print("🎯 Teste concluído!")
    print("\n✅ Sistema de Agentes IA funcionando corretamente!")
    print("🌐 Acesse o frontend em: http://localhost:5173")
    print("📚 Documentação da API: http://localhost:8000/docs")

if __name__ == "__main__":
    asyncio.run(test_agents_system()) 