#!/usr/bin/env python3
"""
Script para testar API de Agentes IA
"""
import requests
import json

def test_agents_api():
    """Testa todos os endpoints da API de agentes"""
    
    print("🤖 TESTE DA API DE AGENTES IA")
    print("="*50)
    
    base_url = "http://localhost:8001"
    
    # 1. Testar health check
    print("\n1. 🔍 Testando health check...")
    try:
        response = requests.get(f"{base_url}/api/health", timeout=5)
        if response.status_code == 200:
            print("   ✅ Backend rodando")
        else:
            print(f"   ❌ Backend retornou {response.status_code}")
            return False
    except Exception as e:
        print(f"   ❌ Erro de conexão: {e}")
        return False
    
    # 2. Testar personalidades
    print("\n2. 👤 Testando personalidades...")
    try:
        response = requests.get(f"{base_url}/api/agents/personalities", timeout=5)
        print(f"   Status: {response.status_code}")
        
        if response.status_code == 200:
            data = response.json()
            personalities = data.get("personalities", [])
            print(f"   ✅ {len(personalities)} personalidades encontradas")
            
            for p in personalities:
                print(f"      - {p['name']} ({p['id']})")
            
            if len(personalities) == 0:
                print("   ⚠️ Nenhuma personalidade retornada!")
        else:
            print(f"   ❌ Erro {response.status_code}: {response.text}")
    except Exception as e:
        print(f"   ❌ Erro: {e}")
    
    # 3. Testar templates
    print("\n3. 📋 Testando templates...")
    try:
        response = requests.get(f"{base_url}/api/agents/templates", timeout=5)
        print(f"   Status: {response.status_code}")
        
        if response.status_code == 200:
            data = response.json()
            templates = data.get("templates", [])
            print(f"   ✅ {len(templates)} templates encontrados")
            
            for t in templates:
                print(f"      - {t['name']} ({t['category']})")
        else:
            print(f"   ❌ Erro {response.status_code}: {response.text}")
    except Exception as e:
        print(f"   ❌ Erro: {e}")
    
    # 4. Testar listagem de agentes
    print("\n4. 🤖 Testando listagem de agentes...")
    try:
        response = requests.get(f"{base_url}/api/agents/", timeout=5)
        print(f"   Status: {response.status_code}")
        
        if response.status_code == 200:
            data = response.json()
            agents = data.get("agents", [])
            print(f"   ✅ {len(agents)} agentes encontrados")
            
            for a in agents:
                print(f"      - {a['name']} ({a['status']})")
        else:
            print(f"   ❌ Erro {response.status_code}: {response.text}")
    except Exception as e:
        print(f"   ❌ Erro: {e}")
    
    # 5. Testar criação de agente
    print("\n5. ➕ Testando criação de agente...")
    try:
        agent_data = {
            "name": "Agente Teste",
            "description": "Agente criado para teste da API",
            "personality_id": "friendly",
            "custom_prompt": "Você é um agente de teste amigável.",
            "configuration": {}
        }
        
        response = requests.post(
            f"{base_url}/api/agents/create",
            json=agent_data,
            timeout=10
        )
        
        print(f"   Status: {response.status_code}")
        
        if response.status_code == 200:
            result = response.json()
            if result.get("success"):
                agent = result.get("agent", {})
                print(f"   ✅ Agente criado: {agent.get('name')} ({agent.get('id')})")
                return agent.get('id')  # Retornar ID para testes subsequentes
            else:
                print(f"   ❌ Erro na criação: {result}")
        else:
            print(f"   ❌ Erro {response.status_code}: {response.text}")
    except Exception as e:
        print(f"   ❌ Erro: {e}")
    
    return None

def test_frontend_requests():
    """Testa se o frontend consegue acessar os endpoints"""
    
    print("\n\n🌐 TESTE VIA FRONTEND (PROXY)")
    print("="*50)
    
    frontend_url = "http://localhost:5174"
    
    endpoints = [
        "/api/agents/personalities",
        "/api/agents/templates", 
        "/api/agents/"
    ]
    
    for endpoint in endpoints:
        print(f"\n📡 Testando {endpoint}...")
        try:
            response = requests.get(f"{frontend_url}{endpoint}", timeout=5)
            print(f"   Status: {response.status_code}")
            
            if response.status_code == 200:
                try:
                    data = response.json()
                    print(f"   ✅ JSON válido retornado")
                    
                    # Específico para cada endpoint
                    if "personalities" in endpoint:
                        personalities = data.get("personalities", [])
                        print(f"   📊 {len(personalities)} personalidades")
                    elif "templates" in endpoint:
                        templates = data.get("templates", [])
                        print(f"   📊 {len(templates)} templates")
                    elif endpoint.endswith("/api/agents/"):
                        agents = data.get("agents", [])
                        print(f"   📊 {len(agents)} agentes")
                        
                except:
                    print(f"   ⚠️ Resposta não é JSON válido")
            else:
                print(f"   ❌ Erro: {response.text[:100]}")
                
        except Exception as e:
            print(f"   ❌ Erro de conexão: {e}")

if __name__ == "__main__":
    # Testar API diretamente
    agent_id = test_agents_api()
    
    # Testar via frontend
    test_frontend_requests()
    
    print("\n🎯 RESUMO:")
    print("1. Verifique se o backend está rodando na porta 8001")
    print("2. Verifique se o frontend está rodando na porta 5174")
    print("3. Verifique os logs do console do navegador")
    print("4. Se as personalidades estão carregando, o formulário deve funcionar") 