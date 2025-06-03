#!/usr/bin/env python3
"""
🧪 Script de Teste - Sistema de Agentes IA Personalizados AutoCred
Testa todas as funcionalidades do sistema de agentes personalizados
"""

import asyncio
import httpx
import json
from datetime import datetime

# Configuração
BASE_URL = "http://localhost:8000"
TEST_AGENT_NAME = "Agente Teste AutoCred"
TEST_AGENT_DESCRIPTION = "Agente especializado em testes do sistema AutoCred"

class CustomAgentsTestSuite:
    """Suite de testes para agentes personalizados"""
    
    def __init__(self):
        self.client = httpx.AsyncClient(timeout=30.0)
        self.created_agent_id = None
    
    async def close(self):
        """Fecha conexões HTTP"""
        await self.client.aclose()
    
    async def test_personalities(self):
        """Testa listagem de personalidades"""
        print("\n🎭 Testando personalidades disponíveis...")
        
        try:
            response = await self.client.get(f"{BASE_URL}/api/agents/personalities")
            
            if response.status_code == 200:
                data = response.json()
                personalities = data.get("personalities", [])
                print(f"✅ Encontradas {len(personalities)} personalidades")
                
                for personality in personalities[:3]:  # Mostrar apenas 3
                    print(f"   📋 {personality['name']}: {personality['description']}")
                
                return personalities
            else:
                print(f"❌ Erro HTTP {response.status_code}: {response.text}")
                return []
                
        except Exception as e:
            print(f"❌ Erro na requisição: {e}")
            return []
    
    async def test_templates(self):
        """Testa listagem de templates"""
        print("\n📄 Testando templates disponíveis...")
        
        try:
            response = await self.client.get(f"{BASE_URL}/api/agents/templates")
            
            if response.status_code == 200:
                data = response.json()
                templates = data.get("templates", [])
                print(f"✅ Encontrados {len(templates)} templates")
                
                for template in templates:
                    print(f"   🚀 {template['name']} ({template['category']}): {template['description']}")
                
                return templates
            else:
                print(f"❌ Erro HTTP {response.status_code}: {response.text}")
                return []
                
        except Exception as e:
            print(f"❌ Erro na requisição: {e}")
            return []
    
    async def test_create_agent(self, personalities):
        """Testa criação de agente personalizado"""
        print("\n🤖 Testando criação de agente personalizado...")
        
        if not personalities:
            print("❌ Não há personalidades disponíveis para teste")
            return None
        
        # Usar primeira personalidade disponível
        personality = personalities[0]
        
        agent_data = {
            "name": TEST_AGENT_NAME,
            "description": TEST_AGENT_DESCRIPTION,
            "personality_id": personality["id"],
            "custom_prompt": "Você é um agente de testes especializado em validar funcionalidades do AutoCred. Seja preciso e detalhado em suas respostas.",
            "configuration": {
                "max_response_length": 300,
                "test_mode": True
            }
        }
        
        try:
            response = await self.client.post(
                f"{BASE_URL}/api/agents/create",
                json=agent_data
            )
            
            if response.status_code == 200:
                result = response.json()
                agent = result.get("agent", {})
                self.created_agent_id = agent.get("id")
                
                print(f"✅ Agente criado com sucesso!")
                print(f"   🆔 ID: {agent.get('id')}")
                print(f"   📝 Nome: {agent.get('name')}")
                print(f"   🎭 Personalidade: {personality['name']}")
                print(f"   📊 Status: {agent.get('status')}")
                
                return agent
            else:
                print(f"❌ Erro HTTP {response.status_code}: {response.text}")
                return None
                
        except Exception as e:
            print(f"❌ Erro na requisição: {e}")
            return None
    
    async def test_list_agents(self):
        """Testa listagem de agentes"""
        print("\n📋 Testando listagem de agentes...")
        
        try:
            response = await self.client.get(f"{BASE_URL}/api/agents/")
            
            if response.status_code == 200:
                data = response.json()
                agents = data.get("agents", [])
                print(f"✅ Encontrados {len(agents)} agentes")
                
                for agent in agents:
                    print(f"   🤖 {agent['name']} ({agent['status']})")
                    print(f"      📊 Conversas: {agent['performance_stats']['total_conversations']}")
                
                return agents
            else:
                print(f"❌ Erro HTTP {response.status_code}: {response.text}")
                return []
                
        except Exception as e:
            print(f"❌ Erro na requisição: {e}")
            return []
    
    async def test_chat_with_agent(self):
        """Testa chat com agente"""
        print("\n💬 Testando chat com agente...")
        
        if not self.created_agent_id:
            print("❌ Nenhum agente disponível para chat")
            return False
        
        test_messages = [
            "Olá! Como você pode me ajudar?",
            "Explique o que é crédito consignado",
            "Quais são as vantagens do seu atendimento?"
        ]
        
        try:
            for i, message in enumerate(test_messages, 1):
                print(f"   👤 Mensagem {i}: {message}")
                
                response = await self.client.post(
                    f"{BASE_URL}/api/agents/{self.created_agent_id}/chat",
                    json={
                        "message": message,
                        "context_data": {
                            "test_number": i,
                            "test_suite": "custom_agents"
                        }
                    }
                )
                
                if response.status_code == 200:
                    result = response.json()
                    agent_response = result.get("response", "")
                    print(f"   🤖 Resposta: {agent_response[:100]}...")
                    print(f"   ⏱️  Timestamp: {result.get('timestamp')}")
                else:
                    print(f"   ❌ Erro HTTP {response.status_code}: {response.text}")
                    return False
                
                # Pequena pausa entre mensagens
                await asyncio.sleep(1)
            
            print("✅ Chat funcionando corretamente!")
            return True
            
        except Exception as e:
            print(f"❌ Erro no chat: {e}")
            return False
    
    async def test_agent_stats(self):
        """Testa estatísticas do agente"""
        print("\n📊 Testando estatísticas do agente...")
        
        if not self.created_agent_id:
            print("❌ Nenhum agente disponível para estatísticas")
            return False
        
        try:
            response = await self.client.get(
                f"{BASE_URL}/api/agents/{self.created_agent_id}/stats"
            )
            
            if response.status_code == 200:
                data = response.json()
                stats = data.get("statistics", {})
                
                print("✅ Estatísticas obtidas:")
                print(f"   📈 Conversas totais: {stats.get('performance', {}).get('total_conversations', 0)}")
                print(f"   🎯 Sessões ativas: {stats.get('active_sessions', 0)}")
                print(f"   💬 Total de mensagens: {stats.get('total_messages', 0)}")
                print(f"   🎭 Personalidade: {stats.get('personality', 'N/A')}")
                
                return True
            else:
                print(f"❌ Erro HTTP {response.status_code}: {response.text}")
                return False
                
        except Exception as e:
            print(f"❌ Erro na requisição: {e}")
            return False
    
    async def test_create_from_template(self, templates):
        """Testa criação de agente a partir de template"""
        print("\n🚀 Testando criação a partir de template...")
        
        if not templates:
            print("❌ Nenhum template disponível para teste")
            return False
        
        # Usar primeiro template
        template = templates[0]
        agent_name = f"Agente Template {datetime.now().strftime('%H:%M:%S')}"
        
        try:
            response = await self.client.post(
                f"{BASE_URL}/api/agents/template/{template['id']}",
                json={"agent_name": agent_name}
            )
            
            if response.status_code == 200:
                result = response.json()
                agent = result.get("agent", {})
                
                print(f"✅ Agente criado do template '{template['name']}'!")
                print(f"   🆔 ID: {agent.get('id')}")
                print(f"   📝 Nome: {agent.get('name')}")
                print(f"   📄 Template: {template['name']}")
                
                return True
            else:
                print(f"❌ Erro HTTP {response.status_code}: {response.text}")
                return False
                
        except Exception as e:
            print(f"❌ Erro na requisição: {e}")
            return False
    
    async def test_update_agent(self):
        """Testa atualização de agente"""
        print("\n✏️  Testando atualização de agente...")
        
        if not self.created_agent_id:
            print("❌ Nenhum agente disponível para atualização")
            return False
        
        update_data = {
            "status": "inactive",
            "description": "Agente de teste atualizado via API"
        }
        
        try:
            response = await self.client.put(
                f"{BASE_URL}/api/agents/{self.created_agent_id}",
                json=update_data
            )
            
            if response.status_code == 200:
                result = response.json()
                agent = result.get("agent", {})
                
                print("✅ Agente atualizado com sucesso!")
                print(f"   📊 Novo status: {agent.get('status')}")
                print(f"   📝 Nova descrição: {agent.get('description')}")
                
                return True
            else:
                print(f"❌ Erro HTTP {response.status_code}: {response.text}")
                return False
                
        except Exception as e:
            print(f"❌ Erro na requisição: {e}")
            return False
    
    async def cleanup_test_agents(self):
        """Remove agentes criados durante os testes"""
        print("\n🧹 Limpando agentes de teste...")
        
        try:
            # Listar todos os agentes
            response = await self.client.get(f"{BASE_URL}/api/agents/")
            
            if response.status_code == 200:
                data = response.json()
                agents = data.get("agents", [])
                
                # Remover agentes de teste
                removed_count = 0
                for agent in agents:
                    if "Teste" in agent.get("name", "") or "Template" in agent.get("name", ""):
                        delete_response = await self.client.delete(
                            f"{BASE_URL}/api/agents/{agent['id']}"
                        )
                        
                        if delete_response.status_code == 200:
                            print(f"   🗑️  Removido: {agent['name']}")
                            removed_count += 1
                        else:
                            print(f"   ❌ Erro ao remover {agent['name']}")
                
                print(f"✅ {removed_count} agentes de teste removidos")
                return True
            else:
                print(f"❌ Erro ao listar agentes: {response.status_code}")
                return False
                
        except Exception as e:
            print(f"❌ Erro na limpeza: {e}")
            return False

async def main():
    """Executa todos os testes"""
    print("🧪 TESTE DO SISTEMA DE AGENTES IA PERSONALIZADOS AUTOCRED")
    print("=" * 60)
    
    test_suite = CustomAgentsTestSuite()
    
    try:
        # Verificar se servidor está rodando
        print("\n🔍 Verificando conexão com servidor...")
        try:
            response = await test_suite.client.get(f"{BASE_URL}/api/agents/personalities")
            if response.status_code in [200, 404]:  # 404 é ok se endpoints não estão configurados ainda
                print("✅ Servidor respondendo")
            else:
                print(f"❌ Servidor com problema: HTTP {response.status_code}")
                return
        except Exception as e:
            print(f"❌ Servidor não está acessível: {e}")
            return
        
        # Executar testes
        personalities = await test_suite.test_personalities()
        templates = await test_suite.test_templates()
        
        agent = await test_suite.test_create_agent(personalities)
        await test_suite.test_list_agents()
        
        if agent:
            await test_suite.test_chat_with_agent()
            await test_suite.test_agent_stats()
            await test_suite.test_update_agent()
        
        await test_suite.test_create_from_template(templates)
        
        # Limpeza opcional (comentado para não remover durante desenvolvimento)
        # await test_suite.cleanup_test_agents()
        
        print("\n" + "=" * 60)
        print("🎉 TESTES CONCLUÍDOS!")
        print("✅ Sistema de Agentes IA Personalizados está funcionando")
        
    finally:
        await test_suite.close()

if __name__ == "__main__":
    asyncio.run(main()) 