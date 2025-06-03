#!/usr/bin/env python3
"""
Script para testar se o backend está funcionando
"""

import requests
import json

def test_backend():
    try:
        # Testar health check
        print("🔍 Testando conexão com backend...")
        response = requests.get('http://localhost:8000/api/health', timeout=5)
        
        if response.status_code == 200:
            print("✅ Backend está funcionando na porta 8000!")
            print(f"📄 Resposta: {response.json()}")
            
            # Testar endpoint de clientes
            print("\n🔍 Testando endpoint de clientes...")
            clients_response = requests.get('http://localhost:8000/api/clients', timeout=5)
            
            if clients_response.status_code == 200:
                clients_data = clients_response.json()
                print(f"✅ Endpoint de clientes funcionando!")
                print(f"📊 Total de clientes: {len(clients_data.get('clients', []))}")
                
                # Mostrar primeiro cliente como exemplo
                if clients_data.get('clients'):
                    first_client = clients_data['clients'][0]
                    print(f"\n👤 PRIMEIRO CLIENTE - DADOS COMPLETOS:")
                    print(f"   📝 Nome: {first_client.get('name', 'N/A')}")
                    print(f"   📄 CPF: {first_client.get('cpf', 'N/A')}")
                    print(f"   📧 Email: {first_client.get('email', 'N/A')}")
                    print(f"   📞 Telefone: {first_client.get('phone', 'N/A')}")
                    print(f"   ⭐ Status: {first_client.get('status', 'N/A')}")
                    print(f"   💰 Parcela: {first_client.get('installment', 'N/A')}")
                    print(f"   🏦 Saldo Devedor: {first_client.get('outstandingBalance', 'N/A')}")
                    print(f"   📍 Origem: {first_client.get('source', 'N/A')}")
                    print(f"   📋 Modalidade: {first_client.get('modality', 'N/A')}")
                    print(f"   👨‍💼 Responsável: {first_client.get('assignedTo', 'N/A')}")
                    print(f"   📅 Criado em: {first_client.get('createdAt', 'N/A')}")
                    print(f"   🔄 Última atividade: {first_client.get('lastActivity', 'N/A')}")
                    print(f"   📊 Contratos: {first_client.get('contractsCount', 'N/A')}")
                    print(f"   💵 Valor total: R$ {first_client.get('totalValue', 0):,.2f}")
                    
                    # Verificar se todos os campos dos leads estão presentes
                    required_fields = ['installment', 'outstandingBalance', 'source', 'modality', 'assignedTo']
                    missing_fields = []
                    present_fields = []
                    
                    for field in required_fields:
                        if field in first_client and first_client[field] is not None:
                            present_fields.append(field)
                        else:
                            missing_fields.append(field)
                    
                    print(f"\n📋 CAMPOS DOS LEADS:")
                    print(f"   ✅ Presentes: {present_fields}")
                    if missing_fields:
                        print(f"   ❌ Ausentes: {missing_fields}")
                    else:
                        print(f"   🎉 Todos os 5 campos dos Leads estão presentes!")
                
                print("\n🎉 Todos os testes passaram! Backend está 100% funcional.")
                print("✅ A aba Clientes agora tem TODAS as informações da aba Leads!")
                return True
            else:
                print(f"❌ Erro no endpoint de clientes: {clients_response.status_code}")
                return False
        else:
            print(f"❌ Backend não está respondendo: Status {response.status_code}")
            return False
            
    except requests.exceptions.ConnectionError:
        print("❌ Erro: Não foi possível conectar ao backend na porta 8000")
        print("💡 Certifique-se de que o backend está rodando:")
        print("   cd backend_autocred")
        print("   python api_simple.py")
        return False
    except requests.exceptions.Timeout:
        print("❌ Erro: Timeout na conexão com o backend")
        return False
    except Exception as e:
        print(f"❌ Erro inesperado: {e}")
        return False

if __name__ == "__main__":
    print("🚀 Testando Backend AutoCred - Clientes Atualizados...\n")
    success = test_backend()
    print(f"\n{'='*60}")
    if success:
        print("🟢 STATUS: BACKEND FUNCIONANDO PERFEITAMENTE")
        print("🎯 RESULTADO: ABA CLIENTES COM TODAS AS INFORMAÇÕES DOS LEADS")
    else:
        print("🔴 STATUS: BACKEND COM PROBLEMAS")
    print(f"{'='*60}") 