#!/usr/bin/env python3
"""
Script de teste para integração WhatsApp com agentes IA
"""

import requests
import json
import time

BASE_URL = "http://localhost:8000"

def test_whatsapp_integration():
    """Testa a integração WhatsApp com agentes"""
    
    print("🧪 Testando integração WhatsApp com Agentes IA...")
    
    # 1. Testar health check
    try:
        response = requests.get(f"{BASE_URL}/api/health")
        if response.status_code == 200:
            print("✅ Backend está rodando")
        else:
            print("❌ Backend não está respondendo")
            return
    except Exception as e:
        print(f"❌ Erro ao conectar com backend: {e}")
        return
    
    # 2. Simular geração de QR Code
    print("\n📱 Testando geração de QR Code...")
    
    agent_id = "test_agent_123"
    qr_payload = {
        "agentId": agent_id,
        "instanceName": f"agent_{agent_id}"
    }
    
    try:
        response = requests.post(f"{BASE_URL}/api/evolution/generate-qr", json=qr_payload)
        if response.status_code == 200:
            data = response.json()
            print(f"✅ QR Code gerado: {data['qrcode']}")
            print(f"📝 Mensagem: {data['message']}")
        else:
            print(f"❌ Erro ao gerar QR Code: {response.text}")
            return
    except Exception as e:
        print(f"❌ Erro na requisição QR Code: {e}")
        return
    
    # 3. Verificar status inicial
    print(f"\n🔍 Verificando status inicial do agente {agent_id}...")
    
    try:
        response = requests.get(f"{BASE_URL}/api/evolution/status/{agent_id}")
        if response.status_code == 200:
            data = response.json()
            print(f"📊 Status: {data['status']}")
            print(f"🔗 Conectado: {data['connected']}")
        else:
            print(f"❌ Erro ao verificar status: {response.text}")
    except Exception as e:
        print(f"❌ Erro na verificação de status: {e}")
    
    # 4. Simular múltiplas verificações para testar conexão
    print(f"\n⏳ Simulando processo de conexão (5 tentativas)...")
    
    for i in range(5):
        time.sleep(2)  # Aguardar 2 segundos
        
        try:
            response = requests.get(f"{BASE_URL}/api/evolution/status/{agent_id}")
            if response.status_code == 200:
                data = response.json()
                print(f"🔄 Tentativa {i+1}: Status={data['status']}, Conectado={data['connected']}")
                
                if data['connected']:
                    print("🎉 Agente conectado com sucesso!")
                    break
            else:
                print(f"❌ Erro na tentativa {i+1}: {response.text}")
        except Exception as e:
            print(f"❌ Erro na tentativa {i+1}: {e}")
    
    # 5. Listar todas as conexões
    print(f"\n📋 Listando todas as conexões WhatsApp...")
    
    try:
        response = requests.get(f"{BASE_URL}/api/evolution/connections")
        if response.status_code == 200:
            data = response.json()
            print(f"✅ Conexões encontradas: {len(data['connections'])}")
            for agent_id, connection in data['connections'].items():
                print(f"  🤖 Agente {agent_id}: {connection['status']}")
        else:
            print(f"❌ Erro ao listar conexões: {response.text}")
    except Exception as e:
        print(f"❌ Erro ao listar conexões: {e}")
    
    # 6. Testar desconexão
    print(f"\n🔌 Testando desconexão do agente...")
    
    try:
        response = requests.post(f"{BASE_URL}/api/evolution/disconnect/{agent_id}")
        if response.status_code == 200:
            data = response.json()
            print(f"✅ Desconectado: {data['message']}")
        else:
            print(f"❌ Erro ao desconectar: {response.text}")
    except Exception as e:
        print(f"❌ Erro na desconexão: {e}")
    
    # 7. Verificar status final
    print(f"\n🏁 Verificando status final...")
    
    try:
        response = requests.get(f"{BASE_URL}/api/evolution/status/{agent_id}")
        if response.status_code == 200:
            data = response.json()
            print(f"📊 Status final: {data['status']}")
            print(f"🔗 Conectado: {data['connected']}")
        else:
            print(f"❌ Erro ao verificar status final: {response.text}")
    except Exception as e:
        print(f"❌ Erro na verificação final: {e}")
    
    print("\n🎯 Teste de integração WhatsApp concluído!")

if __name__ == "__main__":
    test_whatsapp_integration() 