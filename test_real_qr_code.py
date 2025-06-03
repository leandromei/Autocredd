#!/usr/bin/env python3
"""
Teste de geração de QR Code real via Evolution API
"""

import requests
import json
import time

def test_qr_generation():
    print("🧪 TESTE DE QR CODE REAL VIA EVOLUTION API")
    print("==========================================")
    
    backend_url = "http://localhost:8001"
    
    # 1. Testar conexão com backend
    try:
        response = requests.get(f"{backend_url}/api/health")
        if response.status_code == 200:
            print("✅ Backend conectado")
        else:
            print(f"❌ Backend não respondeu: {response.status_code}")
            return
    except Exception as e:
        print(f"❌ Erro ao conectar com backend: {e}")
        return
    
    # 2. Criar agente de teste
    print("\n2. 🤖 Criando agente de teste...")
    
    agent_data = {
        "name": "Agente WhatsApp Teste",
        "description": "Agente para testar QR Code real",
        "personality_id": "friendly",
        "custom_prompt": "Seja útil e responda rapidamente!"
    }
    
    try:
        response = requests.post(
            f"{backend_url}/api/agents/create",
            headers={"Content-Type": "application/json"},
            json=agent_data
        )
        
        if response.status_code == 200:
            agent = response.json()["agent"]
            agent_id = agent["id"]
            print(f"✅ Agente criado: {agent['name']} (ID: {agent_id})")
        else:
            print(f"❌ Erro ao criar agente: {response.status_code}")
            print(response.text)
            return
    except Exception as e:
        print(f"❌ Erro ao criar agente: {e}")
        return
    
    # 3. Gerar QR Code
    print(f"\n3. 📱 Gerando QR Code para agente {agent_id}...")
    
    qr_data = {
        "agentId": agent_id,
        "instanceName": f"agent_{agent_id}"
    }
    
    try:
        response = requests.post(
            f"{backend_url}/api/evolution/generate-qr",
            headers={"Content-Type": "application/json"},
            json=qr_data
        )
        
        if response.status_code == 200:
            result = response.json()
            print(f"✅ QR Code gerado com sucesso!")
            print(f"📄 Mensagem: {result['message']}")
            print(f"🔗 QR Code URL: {result['qrcode']}")
            
            # Verificar se é QR Code real (da Evolution API) ou simulado
            if "qrserver.com" in result['qrcode']:
                print("⚠️ QR Code SIMULADO detectado")
                print("ℹ️ Isso significa que a Evolution API não retornou QR Code real")
                print("ℹ️ Possíveis causas:")
                print("   - Evolution API key incorreta")
                print("   - Evolution API não está funcionando")
                print("   - Problemas de rede")
            else:
                print("🎉 QR Code REAL da Evolution API detectado!")
                print("✅ Você pode escanear este QR Code com o WhatsApp")
            
        else:
            print(f"❌ Erro ao gerar QR Code: {response.status_code}")
            print(response.text)
            return
    except Exception as e:
        print(f"❌ Erro ao gerar QR Code: {e}")
        return
    
    # 4. Verificar status
    print(f"\n4. 🔍 Verificando status da conexão...")
    
    for i in range(3):
        try:
            response = requests.get(f"{backend_url}/api/evolution/status/{agent_id}")
            
            if response.status_code == 200:
                status = response.json()
                print(f"📊 Status {i+1}: {status['status']} | Conectado: {status['connected']}")
                
                if status['connected']:
                    print("🎉 AGENTE CONECTADO AO WHATSAPP!")
                    break
            else:
                print(f"❌ Erro ao verificar status: {response.status_code}")
                
        except Exception as e:
            print(f"❌ Erro ao verificar status: {e}")
        
        if i < 2:
            print("⏳ Aguardando 5 segundos...")
            time.sleep(5)
    
    print(f"\n✅ Teste concluído!")
    print(f"🔗 Para testar manualmente, acesse: http://localhost:5174/agents-whatsapp")
    print(f"🤖 Procure pelo agente: {agent['name']}")

if __name__ == "__main__":
    test_qr_generation() 