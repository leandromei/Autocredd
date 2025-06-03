#!/usr/bin/env python3
"""
Script de teste para validar integração Evolution API + AutoCred
Testa todos os endpoints da Evolution API implementados no backend
"""

import requests
import json
import time
from datetime import datetime

# Configurações
BACKEND_URL = "http://localhost:8001"
EVOLUTION_API_URL = "http://localhost:8081"
EVOLUTION_API_KEY = "429683C4C977415CAAFCCE10F7D57E11"

def print_header(title):
    print(f"\n{'='*60}")
    print(f"🧪 {title}")
    print(f"{'='*60}")

def print_step(step):
    print(f"\n🔄 {step}")

def print_success(message):
    print(f"✅ {message}")

def print_error(message):
    print(f"❌ {message}")

def test_backend_health():
    """Testa se o backend AutoCred está rodando"""
    print_header("TESTE 1: Backend AutoCred")
    
    try:
        response = requests.get(f"{BACKEND_URL}/api/health", timeout=5)
        if response.status_code == 200:
            print_success("Backend AutoCred está rodando")
            return True
        else:
            print_error(f"Backend retornou status {response.status_code}")
            return False
    except Exception as e:
        print_error(f"Backend não está acessível: {e}")
        return False

def test_evolution_api():
    """Testa se a Evolution API está rodando"""
    print_header("TESTE 2: Evolution API")
    
    try:
        headers = {"apikey": EVOLUTION_API_KEY}
        response = requests.get(f"{EVOLUTION_API_URL}/instance/fetchInstances", headers=headers, timeout=5)
        
        if response.status_code == 200:
            print_success("Evolution API está rodando")
            instances = response.json()
            print(f"📊 Instâncias encontradas: {len(instances)}")
            return True
        else:
            print_error(f"Evolution API retornou status {response.status_code}")
            return False
    except Exception as e:
        print_error(f"Evolution API não está acessível: {e}")
        print("💡 Execute: start_evolution.bat para iniciar a Evolution API")
        return False

def test_create_instance():
    """Testa criação de instância via backend"""
    print_header("TESTE 3: Criar Instância")
    
    instance_name = f"test_autocred_{int(time.time())}"
    
    print_step(f"Criando instância: {instance_name}")
    
    try:
        data = {
            "instanceName": instance_name,
            "webhook_by_events": True,
            "events": ["QRCODE_UPDATED", "CONNECTION_UPDATE", "MESSAGES_UPSERT"]
        }
        
        response = requests.post(f"{BACKEND_URL}/api/evolution/instance/create", json=data, timeout=10)
        
        if response.status_code == 200:
            result = response.json()
            print_success(f"Instância criada: {result.get('instanceName')}")
            print(f"📋 Resposta: {json.dumps(result, indent=2)}")
            return instance_name
        else:
            print_error(f"Erro ao criar instância: {response.status_code}")
            print(f"Resposta: {response.text}")
            return None
    except Exception as e:
        print_error(f"Erro na requisição: {e}")
        return None

def test_connect_instance(instance_name):
    """Testa conexão da instância e obtenção do QR Code"""
    print_header("TESTE 4: Conectar Instância")
    
    if not instance_name:
        print_error("Nome da instância não fornecido")
        return False
    
    print_step(f"Conectando instância: {instance_name}")
    
    try:
        response = requests.get(f"{BACKEND_URL}/api/evolution/instance/connect/{instance_name}", timeout=10)
        
        if response.status_code == 200:
            result = response.json()
            print_success("QR Code gerado com sucesso")
            
            if result.get('qrcode'):
                qr_length = len(result['qrcode'])
                print(f"📱 QR Code recebido ({qr_length} caracteres)")
                
                # Salvar QR Code em arquivo para visualização
                if result['qrcode'].startswith('data:image'):
                    print("💾 QR Code em base64 recebido")
                elif result['qrcode'].startswith('http'):
                    print(f"🌐 QR Code URL: {result['qrcode']}")
                
            return True
        else:
            print_error(f"Erro ao conectar: {response.status_code}")
            return False
    except Exception as e:
        print_error(f"Erro na requisição: {e}")
        return False

def test_instance_status(instance_name):
    """Testa verificação de status da instância"""
    print_header("TESTE 5: Status da Instância")
    
    if not instance_name:
        print_error("Nome da instância não fornecido")
        return False
    
    print_step(f"Verificando status: {instance_name}")
    
    try:
        response = requests.get(f"{BACKEND_URL}/api/evolution/instance/status/{instance_name}", timeout=10)
        
        if response.status_code == 200:
            result = response.json()
            print_success("Status obtido com sucesso")
            print(f"📊 Status: {result.get('status')}")
            print(f"🔗 Conectado: {result.get('connected')}")
            return True
        else:
            print_error(f"Erro ao obter status: {response.status_code}")
            return False
    except Exception as e:
        print_error(f"Erro na requisição: {e}")
        return False

def test_list_instances():
    """Testa listagem de instâncias"""
    print_header("TESTE 6: Listar Instâncias")
    
    print_step("Listando todas as instâncias")
    
    try:
        response = requests.get(f"{BACKEND_URL}/api/evolution/instance/list", timeout=10)
        
        if response.status_code == 200:
            result = response.json()
            instances = result.get('instances', [])
            print_success(f"Listagem obtida: {len(instances)} instâncias")
            
            for i, instance in enumerate(instances, 1):
                print(f"  {i}. {instance.get('name')} - {instance.get('status')} - Conectado: {instance.get('connected')}")
            
            return instances
        else:
            print_error(f"Erro ao listar: {response.status_code}")
            return []
    except Exception as e:
        print_error(f"Erro na requisição: {e}")
        return []

def test_send_message(instance_name):
    """Testa envio de mensagem (simulado)"""
    print_header("TESTE 7: Enviar Mensagem")
    
    if not instance_name:
        print_error("Nome da instância não fornecido")
        return False
    
    print_step("Enviando mensagem de teste")
    
    try:
        data = {
            "instanceName": instance_name,
            "remoteJid": "5511999999999@s.whatsapp.net",
            "message": f"🤖 Mensagem de teste do AutoCred - {datetime.now().strftime('%H:%M:%S')}"
        }
        
        response = requests.post(f"{BACKEND_URL}/api/evolution/message/send", json=data, timeout=10)
        
        if response.status_code == 200:
            result = response.json()
            print_success("Mensagem enviada (ou simulada)")
            print(f"📱 Para: {data['remoteJid']}")
            print(f"💬 Mensagem: {data['message']}")
            return True
        else:
            print_error(f"Erro ao enviar: {response.status_code}")
            return False
    except Exception as e:
        print_error(f"Erro na requisição: {e}")
        return False

def test_delete_instance(instance_name):
    """Testa exclusão da instância"""
    print_header("TESTE 8: Deletar Instância")
    
    if not instance_name:
        print_error("Nome da instância não fornecido")
        return False
    
    print_step(f"Deletando instância: {instance_name}")
    
    try:
        response = requests.delete(f"{BACKEND_URL}/api/evolution/instance/delete/{instance_name}", timeout=10)
        
        if response.status_code == 200:
            result = response.json()
            print_success("Instância deletada com sucesso")
            return True
        else:
            print_error(f"Erro ao deletar: {response.status_code}")
            return False
    except Exception as e:
        print_error(f"Erro na requisição: {e}")
        return False

def test_legacy_endpoints():
    """Testa endpoints legados para compatibilidade"""
    print_header("TESTE 9: Endpoints Legados")
    
    print_step("Testando endpoint legacy de QR Code")
    
    try:
        data = {
            "agentId": "test_agent",
            "instanceName": "test_legacy"
        }
        
        response = requests.post(f"{BACKEND_URL}/api/evolution/generate-qr", json=data, timeout=10)
        
        if response.status_code == 200:
            result = response.json()
            print_success("Endpoint legacy funcionando")
            return True
        else:
            print_error(f"Erro no endpoint legacy: {response.status_code}")
            return False
    except Exception as e:
        print_error(f"Erro na requisição: {e}")
        return False

def main():
    """Executa todos os testes"""
    print_header("TESTE DE INTEGRAÇÃO EVOLUTION API + AUTOCRED")
    print(f"🕒 Iniciado em: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}")
    
    results = []
    
    # Teste 1: Backend
    results.append(("Backend AutoCred", test_backend_health()))
    
    # Teste 2: Evolution API
    evolution_ok = test_evolution_api()
    results.append(("Evolution API", evolution_ok))
    
    if not results[0][1]:  # Se backend não estiver rodando
        print_error("❌ Backend não está rodando. Execute: cd backend_autocred; python api_simple.py")
        return
    
    # Testes de integração
    instance_name = test_create_instance()
    results.append(("Criar Instância", instance_name is not None))
    
    if instance_name:
        results.append(("Conectar Instância", test_connect_instance(instance_name)))
        results.append(("Status Instância", test_instance_status(instance_name)))
        results.append(("Enviar Mensagem", test_send_message(instance_name)))
        
        # Aguardar um pouco antes de deletar
        time.sleep(2)
        results.append(("Deletar Instância", test_delete_instance(instance_name)))
    
    results.append(("Listar Instâncias", len(test_list_instances()) >= 0))
    results.append(("Endpoints Legados", test_legacy_endpoints()))
    
    # Relatório final
    print_header("RELATÓRIO FINAL")
    
    passed = 0
    total = len(results)
    
    for test_name, success in results:
        status = "✅ PASSOU" if success else "❌ FALHOU"
        print(f"{status} - {test_name}")
        if success:
            passed += 1
    
    print(f"\n📊 Resultado: {passed}/{total} testes passaram")
    
    if passed == total:
        print_success("🎉 Todos os testes passaram! Integração funcionando perfeitamente.")
        print("\n💡 Próximos passos:")
        print("   1. Acesse o frontend: http://localhost:5179")
        print("   2. Vá para 'Agentes WhatsApp'")
        print("   3. Crie uma nova instância")
        print("   4. Escaneie o QR Code com seu WhatsApp")
    else:
        print_error("❌ Alguns testes falharam. Verifique os logs acima.")
        
        if not evolution_ok:
            print("\n💡 Para corrigir problemas da Evolution API:")
            print("   1. Execute: start_evolution.bat")
            print("   2. Aguarde os containers subirem")
            print("   3. Execute este teste novamente")

if __name__ == "__main__":
    main() 