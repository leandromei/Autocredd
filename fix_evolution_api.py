#!/usr/bin/env python3
"""
Script para corrigir configuração da Evolution API
"""
import requests
import json

def test_evolution_api():
    """Testa diferentes configurações da Evolution API"""
    
    print("🔍 DIAGNÓSTICO DA EVOLUTION API")
    print("="*50)
    
    # Testar diferentes API keys
    possible_keys = [
        "B6D711FCDE4D4FD5936544120E713C37",  # Nossa key configurada
        "429683C4C977415CAAFCCE10F7D57E11",  # Key antiga
        "YOUR_API_KEY_HERE",                 # Key padrão
        "evolution-api-key",                 # Key genérica
        ""                                   # Sem key
    ]
    
    base_url = "http://localhost:8081"
    
    for i, api_key in enumerate(possible_keys, 1):
        print(f"\n{i}. Testando API Key: {api_key or '(vazia)'}")
        
        headers = {}
        if api_key:
            headers["apikey"] = api_key
        
        try:
            response = requests.get(f"{base_url}/manager/instances", 
                                  headers=headers, timeout=5)
            
            print(f"   Status: {response.status_code}")
            
            if response.status_code == 200:
                try:
                    data = response.json()
                    print(f"   ✅ SUCESSO! Esta é a key correta: {api_key}")
                    print(f"   📊 Instâncias encontradas: {len(data)}")
                    return api_key
                except:
                    print(f"   ⚠️  Resposta não é JSON válido")
            elif response.status_code == 401:
                print(f"   ❌ Não autorizado")
            elif response.status_code == 403:
                print(f"   ❌ Acesso negado")
            else:
                print(f"   ⚠️  Status inesperado")
                
        except requests.exceptions.ConnectionError:
            print(f"   ❌ Conexão falhou")
            break
        except Exception as e:
            print(f"   ❌ Erro: {e}")
    
    print(f"\n❌ Nenhuma API key funcionou!")
    return None

def test_create_instance(api_key):
    """Testa criação de instância real"""
    
    print(f"\n🧪 TESTANDO CRIAÇÃO DE INSTÂNCIA REAL")
    print("="*50)
    
    if not api_key:
        print("❌ Sem API key válida")
        return False
    
    headers = {
        "apikey": api_key,
        "Content-Type": "application/json"
    }
    
    data = {
        "instanceName": "test_real_instance",
        "webhook": "http://localhost:8001/api/evolution/webhook/test_real_instance",
        "webhook_by_events": True,
        "events": ["QRCODE_UPDATED", "CONNECTION_UPDATE", "MESSAGES_UPSERT"]
    }
    
    try:
        response = requests.post("http://localhost:8081/instance/create", 
                               headers=headers, json=data, timeout=10)
        
        print(f"Status: {response.status_code}")
        print(f"Response: {response.text}")
        
        if response.status_code in [200, 201]:
            print("✅ Instância criada com sucesso!")
            
            # Tentar obter QR Code
            print("\n📱 Tentando obter QR Code...")
            qr_response = requests.get(f"http://localhost:8081/instance/connect/test_real_instance",
                                     headers=headers, timeout=10)
            
            print(f"QR Status: {qr_response.status_code}")
            if qr_response.status_code == 200:
                qr_data = qr_response.json()
                if "qrcode" in qr_data:
                    print("✅ QR Code real gerado!")
                    print("🎉 SUCESSO! A integração está funcionando!")
                    return True
                else:
                    print("⚠️  QR Code não encontrado na resposta")
            else:
                print(f"❌ Erro ao obter QR Code: {qr_response.text}")
                
        else:
            print(f"❌ Erro ao criar instância: {response.text}")
            
    except Exception as e:
        print(f"❌ Erro: {e}")
    
    return False

def main():
    print("🚀 SCRIPT DE CORREÇÃO DA EVOLUTION API")
    print("="*60)
    
    # Testar conexão básica
    try:
        response = requests.get("http://localhost:8081", timeout=5)
        print("✅ Evolution API está rodando")
    except:
        print("❌ Evolution API não está acessível")
        return
    
    # Descobrir API key correta
    correct_key = test_evolution_api()
    
    if correct_key:
        print(f"\n🎯 API KEY CORRETA ENCONTRADA: {correct_key}")
        
        # Testar criação de instância real
        if test_create_instance(correct_key):
            print(f"\n🎉 SOLUÇÃO:")
            print(f"   1. Use esta API key no backend: {correct_key}")
            print(f"   2. Reinicie o backend AutoCred")
            print(f"   3. Teste novamente no frontend")
        else:
            print(f"\n⚠️  API key funciona, mas há outros problemas")
    else:
        print(f"\n🛠️  POSSÍVEIS SOLUÇÕES:")
        print(f"   1. Verificar logs da Evolution API")
        print(f"   2. Reconfigurar Evolution API")
        print(f"   3. Usar modo de demonstração")

if __name__ == "__main__":
    main() 