#!/usr/bin/env python3
"""
Teste de QR Code com Polling Direto - Busca QR Code REAL
"""

import requests
import json
import time

# Configurações
BACKEND_URL = "http://localhost:8001"
EVOLUTION_URL = "http://localhost:8081"
EVOLUTION_API_KEY = "429683C4C977415CAAFCCE10F7D57E11"

def test_qr_polling():
    """Teste completo do sistema de polling de QR Code"""
    print("🧪 TESTE DE QR CODE COM POLLING DIRETO")
    print("=" * 50)
    
    try:
        # 1. Criar agente
        print("1. 🤖 Criando agente de teste...")
        agent_data = {
            "name": "Agente Polling Teste",
            "description": "Teste de QR Code via polling direto",
            "personality_id": "friendly",
            "custom_prompt": "Você é um agente de teste"
        }
        
        response = requests.post(f"{BACKEND_URL}/api/agents/create", json=agent_data)
        if response.status_code == 200:
            agent = response.json()["agent"]
            agent_id = agent["id"]
            print(f"✅ Agente criado: {agent['name']} (ID: {agent_id})")
        else:
            print(f"❌ Erro ao criar agente: {response.status_code} - {response.text}")
            return

        # 2. Gerar QR Code tradicional primeiro
        print(f"\n2. 📱 Gerando QR Code tradicional para agente {agent_id}...")
        qr_data = {
            "agentId": agent_id,
            "instanceName": f"agent_{agent_id}"
        }
        
        response = requests.post(f"{BACKEND_URL}/api/evolution/generate-qr", json=qr_data)
        if response.status_code == 200:
            result = response.json()
            print(f"✅ Resposta: {result['message']}")
        else:
            print(f"⚠️ QR Code tradicional falhou: {response.status_code}")

        # 3. Aguardar alguns segundos para instância inicializar
        print("\n3. ⏳ Aguardando instância inicializar...")
        time.sleep(5)

        # 4. Teste de Polling Direto
        print(f"\n4. 🔍 Testando polling direto para agente {agent_id}...")
        response = requests.get(f"{BACKEND_URL}/api/evolution/qrcode-direct/{agent_id}")
        
        if response.status_code == 200:
            result = response.json()
            print(f"📊 Resultado do polling direto:")
            print(f"   ✅ Sucesso: {result['success']}")
            print(f"   📄 Mensagem: {result.get('message', 'N/A')}")
            print(f"   🔧 Método: {result.get('method', 'N/A')}")
            
            if result["success"] and "qrcode" in result:
                qr_code = result["qrcode"]
                if qr_code.startswith("data:image"):
                    print(f"   🎉 QR CODE REAL ENCONTRADO!")
                    print(f"   📱 Tamanho: {len(qr_code)} caracteres")
                    print(f"   🔗 Formato: Base64 válido")
                    print(f"   🌐 Endpoint usado: {result.get('endpoint', 'N/A')}")
                else:
                    print(f"   🔗 QR Code: {qr_code[:50]}...")
            else:
                print(f"   ❌ Erro: {result.get('error', 'N/A')}")
                if "tried_endpoints" in result:
                    print(f"   📋 Endpoints testados: {result['tried_endpoints']}")
        else:
            print(f"❌ Erro na requisição: {response.status_code} - {response.text}")

        # 5. Teste de Monitor Contínuo
        print(f"\n5. 🔄 Testando monitor contínuo...")
        response = requests.get(f"{BACKEND_URL}/api/evolution/qrcode-monitor/{agent_id}")
        
        if response.status_code == 200:
            result = response.json()
            print(f"📊 Resultado do monitor:")
            print(f"   ✅ Sucesso: {result['success']}")
            print(f"   📄 Mensagem: {result.get('message', 'N/A')}")
            print(f"   🔧 Método: {result.get('method', 'N/A')}")
            
            if result["success"]:
                print(f"   🎉 MONITOR ENCONTROU QR CODE!")
            else:
                print(f"   ❌ Monitor falhou: {result.get('error', 'N/A')}")
                print(f"   🔄 Tentativas: {result.get('attempts', 'N/A')}")
        else:
            print(f"❌ Erro no monitor: {response.status_code}")

        # 6. Verificar estado na Evolution API diretamente
        print(f"\n6. 🔍 Verificando estado diretamente na Evolution API...")
        headers = {"apikey": EVOLUTION_API_KEY}
        
        # Listar instâncias
        response = requests.get(f"{EVOLUTION_URL}/instance/fetchInstances", headers=headers)
        if response.status_code == 200:
            instances = response.json()
            our_instance = None
            
            for instance in instances:
                if instance.get("name") == f"agent_{agent_id}":
                    our_instance = instance
                    break
            
            if our_instance:
                print(f"   ✅ Instância encontrada: {our_instance['name']}")
                print(f"   📊 Status: {our_instance.get('connectionStatus', 'N/A')}")
                print(f"   🆔 ID: {our_instance.get('id', 'N/A')}")
                print(f"   📅 Criada em: {our_instance.get('createdAt', 'N/A')}")
                
                # Tentar endpoints diretos da Evolution API
                instance_name = our_instance['name']
                endpoints = [
                    f"/instance/qrcode/{instance_name}",
                    f"/qrcode/{instance_name}",
                    f"/qr/{instance_name}"
                ]
                
                print(f"\n   🔍 Testando endpoints diretos da Evolution API:")
                for endpoint in endpoints:
                    try:
                        response = requests.get(f"{EVOLUTION_URL}{endpoint}", headers=headers)
                        print(f"   📍 {endpoint}: Status {response.status_code}")
                        if response.status_code == 200:
                            data = response.json()
                            if data and "qrcode" in str(data):
                                print(f"      🎉 QR CODE ENCONTRADO neste endpoint!")
                                print(f"      📱 Dados: {str(data)[:100]}...")
                    except Exception as e:
                        print(f"   ❌ {endpoint}: Erro - {e}")
            else:
                print(f"   ❌ Instância não encontrada para agente {agent_id}")
        else:
            print(f"   ❌ Erro ao listar instâncias: {response.status_code}")

        print(f"\n✅ Teste concluído!")
        print(f"🔗 Para testar manualmente: http://localhost:5174/agents-whatsapp")
        print(f"🤖 Procure pelo agente: Agente Polling Teste")

    except Exception as e:
        print(f"❌ Erro geral no teste: {e}")

if __name__ == "__main__":
    test_qr_polling() 