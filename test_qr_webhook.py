#!/usr/bin/env python3
"""
Teste específico para QR Code com webhook Evolution API
"""

import requests
import json
import time

def test_qr_with_webhook():
    print("🧪 TESTE DE QR CODE COM WEBHOOK EVOLUTION API")
    print("==========================================")
    
    backend_url = "http://localhost:8001"
    
    # 1. Criar agente
    print("1. 🤖 Criando agente de teste...")
    agent_data = {
        "name": "Agente Webhook Teste",
        "description": "Teste de webhook Evolution API",
        "personality_id": "friendly",
        "custom_prompt": "Você é um assistente de teste para webhook."
    }
    
    response = requests.post(f"{backend_url}/api/agents/create", json=agent_data)
    if response.status_code == 200:
        agent = response.json()["agent"]
        agent_id = agent["id"]
        print(f"✅ Agente criado: {agent['name']} (ID: {agent_id})")
    else:
        print(f"❌ Erro ao criar agente: {response.status_code}")
        return
    
    # 2. Gerar QR Code
    print(f"\n2. 📱 Gerando QR Code para agente {agent_id}...")
    qr_data = {
        "agentId": agent_id,
        "instanceName": f"agent_{agent_id}"
    }
    
    response = requests.post(f"{backend_url}/api/evolution/generate-qr", json=qr_data)
    if response.status_code == 200:
        result = response.json()
        print(f"✅ Resposta: {result['message']}")
        print(f"🔗 QR Code: {result['qrcode'][:100]}...")
    else:
        print(f"❌ Erro ao gerar QR Code: {response.status_code}")
        print(f"📄 Resposta: {response.text}")
        return
    
    # 3. Monitorar QR Code em tempo real
    print(f"\n3. 🔍 Monitorando QR Code em tempo real...")
    
    for i in range(10):  # Tentar por 10 vezes
        print(f"\n📊 Tentativa {i+1}/10:")
        
        # Verificar QR Code real time
        response = requests.get(f"{backend_url}/api/evolution/qrcode/{agent_id}")
        if response.status_code == 200:
            qr_result = response.json()
            print(f"   📱 QR Status: {qr_result.get('message', 'N/A')}")
            
            if qr_result.get("success") and qr_result.get("qrcode") not in ["CONNECTING", "CONNECTED"]:
                print(f"   🎉 QR Code REAL encontrado!")
                print(f"   🔗 QR Code: {qr_result['qrcode'][:100]}...")
                break
        
        # Verificar status da conexão
        response = requests.get(f"{backend_url}/api/evolution/status/{agent_id}")
        if response.status_code == 200:
            status = response.json()
            print(f"   🔗 Status: {status['status']} | Conectado: {status['connected']}")
        
        if i < 9:  # Não aguardar na última tentativa
            print("   ⏳ Aguardando 3 segundos...")
            time.sleep(3)
    
    print(f"\n✅ Teste concluído!")
    print(f"📝 Verifique os logs do backend para eventos de webhook")
    print(f"🔗 Para testar manualmente: http://localhost:5174/agents-whatsapp")

if __name__ == "__main__":
    test_qr_with_webhook() 