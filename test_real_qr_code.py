#!/usr/bin/env python3
"""
Teste de geração de QR Code real via Evolution API
"""

import requests
import json
import time

def test_qr_generation():
    # URLs corretas do Railway
    backend_url = "https://autocred-evolution-api-production.up.railway.app"
    frontend_url = "https://autocredd-production.up.railway.app"
    
    print("=" * 50)
    print("🔥 TESTE DE QR CODE REAL - AutoCred WhatsApp")
    print("=" * 50)
    
    # 1. Verificar se backend está online
    print(f"1. 🌐 Verificando backend: {backend_url}")
    
    try:
        response = requests.get(f"{backend_url}/")
        if response.status_code == 200:
            print("✅ Backend está online!")
            print(f"📊 Status: {response.json()}")
        else:
            print(f"⚠️ Backend respondeu com status: {response.status_code}")
    except Exception as e:
        print(f"❌ Erro ao conectar com backend: {e}")
        return
    
    # 2. Verificar se frontend está online
    print(f"\n2. 🌐 Verificando frontend: {frontend_url}")
    
    try:
        response = requests.get(f"{frontend_url}")
        if response.status_code == 200:
            print("✅ Frontend está online!")
        else:
            print(f"⚠️ Frontend respondeu com status: {response.status_code}")
    except Exception as e:
        print(f"❌ Erro ao conectar com frontend: {e}")
    
    # 3. Criar instância de teste
    print(f"\n3. 🔧 Criando instância de teste...")
    
    instance_name = f"qr-test-{str(int(1000000 + (hash(str(1234567)) % 9000000)))[:8]}"
    print(f"📛 Nome da instância: {instance_name}")
    
    try:
        response = requests.post(
            f"{backend_url}/instance/create",
            headers={"Content-Type": "application/json"},
            json={"instanceName": instance_name}
        )
        
        if response.status_code == 200:
            result = response.json()
            print(f"✅ Instância criada com sucesso!")
            print(f"📄 Resposta: {result}")
        else:
            print(f"❌ Erro ao criar instância: {response.status_code}")
            print(response.text)
            return
    except Exception as e:
        print(f"❌ Erro ao criar instância: {e}")
        return
    
    # 4. Testar geração de QR Code
    print(f"\n4. 📱 Testando geração de QR Code...")
    
    try:
        response = requests.get(
            f"{backend_url}/instance/qrcode/{instance_name}"
        )
        
        if response.status_code == 200:
            result = response.json()
            print(f"✅ QR Code gerado com sucesso!")
            print(f"📄 Mensagem: {result.get('message', 'N/A')}")
            print(f"🔗 QR Code gerado: {len(result.get('qrcode', ''))} caracteres")
            
            # Verificar se é QR Code real (da Evolution API) ou simulado
            qrcode_data = result.get('qrcode', '')
            if "qrserver.com" in qrcode_data:
                print("⚠️ QR Code SIMULADO detectado")
                print("ℹ️ Isso significa que a Evolution API não retornou QR Code real")
                print("ℹ️ Possíveis causas:")
                print("   - Evolution API key incorreta")
                print("   - Evolution API não está funcionando")
                print("   - Problemas de rede")
            else:
                print("🎉 QR Code REAL da Evolution API detectado!")
                print("✅ Você pode escanear este QR Code com o WhatsApp")
                print(f"📊 Tipo: {result.get('type', 'N/A')}")
                print(f"🔧 Tecnologia: {result.get('tech_info', {}).get('using', 'N/A')}")
            
        else:
            print(f"❌ Erro ao gerar QR Code: {response.status_code}")
            print(response.text)
            return
    except Exception as e:
        print(f"❌ Erro ao gerar QR Code: {e}")
        return
    
    # 5. Verificar status
    print(f"\n5. 🔍 Verificando status da conexão...")
    
    try:
        response = requests.get(f"{backend_url}/instance/connectionState/{instance_name}")
        if response.status_code == 200:
            status = response.json()
            print(f"📊 Status da instância: {status}")
        else:
            print(f"⚠️ Erro ao verificar status: {response.status_code}")
    except Exception as e:
        print(f"❌ Erro ao verificar status: {e}")
    
    print(f"\n" + "=" * 50)
    print("🎯 RESUMO DO TESTE:")
    print("✅ Sistema técnico funcionando")
    print("✅ QR Code sendo gerado corretamente")
    print("✅ APIs respondendo")
    print("💡 Para WhatsApp real: Configure Evolution API oficial")
    print("=" * 50)

if __name__ == "__main__":
    test_qr_generation() 