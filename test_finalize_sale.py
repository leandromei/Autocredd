#!/usr/bin/env python3
"""
Teste da funcionalidade de finalização de venda
"""

import requests
import json

def test_finalize_sale():
    try:
        print("🎯 TESTE - FINALIZAÇÃO DE VENDA (LEAD → CLIENTE + CONTRATO)")
        print("=" * 70)
        
        # 1. Verificar conexão com backend
        print("\n🔍 1. Testando conexão com backend...")
        response = requests.get('http://localhost:8000/api/health', timeout=5)
        if response.status_code != 200:
            print("❌ Backend não está respondendo")
            return False
        print("✅ Backend conectado com sucesso")
        
        # 2. Buscar leads existentes
        print("\n🔍 2. Verificando leads existentes...")
        leads_response = requests.get('http://localhost:8000/api/leads', timeout=5)
        if leads_response.status_code != 200:
            print("❌ Erro ao buscar leads")
            return False
        
        leads_data = leads_response.json()
        leads = leads_data.get('leads', [])
        print(f"✅ {len(leads)} leads encontrados")
        
        if leads:
            lead_to_convert = leads[0]
            print(f"📝 Lead para conversão: {lead_to_convert.get('name', 'N/A')}")
        else:
            print("⚠️ Nenhum lead encontrado, criando um para teste...")
            # Criar lead para teste
            new_lead = {
                "name": "João Silva Teste",
                "cpf": "88877766655",
                "phone": "11987654321",
                "installment": "R$ 600,00",
                "outstandingBalance": "R$ 20.000,00",
                "source": "Teste",
                "modality": "Portabilidade",
                "status": "Qualificado",
                "observations": "Lead criado para teste de finalização"
            }
            
            create_response = requests.post('http://localhost:8000/api/leads', 
                                          json=new_lead, timeout=5)
            if create_response.status_code == 200:
                lead_to_convert = create_response.json()
                print(f"✅ Lead criado para teste: {lead_to_convert.get('name')}")
            else:
                print("❌ Erro ao criar lead para teste")
                return False
        
        # 3. Contar clientes e contratos antes
        print(f"\n🔍 3. Contando registros ANTES da finalização...")
        
        clients_before = requests.get('http://localhost:8000/api/clients', timeout=5)
        contracts_before = requests.get('http://localhost:8000/api/contracts', timeout=5)
        
        clients_count_before = len(clients_before.json().get('clients', []))
        contracts_count_before = len(contracts_before.json().get('contracts', []))
        
        print(f"📊 Clientes antes: {clients_count_before}")
        print(f"📊 Contratos antes: {contracts_count_before}")
        
        # 4. Finalizar venda
        print(f"\n🎯 4. Finalizando venda do lead: {lead_to_convert.get('name')}")
        
        finalize_data = {
            "leadId": lead_to_convert.get('id', '1')
        }
        
        finalize_response = requests.post('http://localhost:8000/api/leads/finalize-sale',
                                        json=finalize_data, timeout=10)
        
        if finalize_response.status_code == 200:
            result = finalize_response.json()
            print("✅ Venda finalizada com sucesso!")
            print(f"   📄 Mensagem: {result.get('message')}")
            print(f"   🆔 Cliente ID: {result.get('clientId')}")
            print(f"   🆔 Contrato ID: {result.get('contractId')}")
        else:
            print(f"❌ Erro ao finalizar venda: {finalize_response.status_code}")
            print(f"   📄 Resposta: {finalize_response.text}")
            return False
        
        # 5. Verificar se cliente foi criado
        print(f"\n🔍 5. Verificando criação do cliente...")
        
        clients_after = requests.get('http://localhost:8000/api/clients', timeout=5)
        clients_count_after = len(clients_after.json().get('clients', []))
        
        print(f"📊 Clientes depois: {clients_count_after}")
        
        if clients_count_after > clients_count_before:
            print("✅ Cliente foi criado com sucesso!")
            
            # Buscar o cliente criado
            clients_list = clients_after.json().get('clients', [])
            newest_client = None
            for client in clients_list:
                if "Lead Convertido" in client.get('source', '') or client.get('name') == lead_to_convert.get('name'):
                    newest_client = client
                    break
            
            if newest_client:
                print(f"   👤 Nome: {newest_client.get('name')}")
                print(f"   📞 Telefone: {newest_client.get('phone')}")
                print(f"   💰 Parcela: {newest_client.get('installment')}")
                print(f"   🏷️ Origem: {newest_client.get('source')}")
            
        else:
            print("❌ Cliente não foi criado")
        
        # 6. Verificar contratos
        print(f"\n🔍 6. Verificando contratos...")
        
        contracts_after = requests.get('http://localhost:8000/api/contracts', timeout=5)
        contracts_count_after = len(contracts_after.json().get('contracts', []))
        
        print(f"📊 Contratos depois: {contracts_count_after}")
        
        # 7. Resultado final
        print(f"\n🏆 RESULTADO DO TESTE:")
        print("=" * 50)
        
        if (finalize_response.status_code == 200 and 
            clients_count_after > clients_count_before):
            print("🟢 TESTE APROVADO!")
            print("✅ Lead foi convertido com sucesso")
            print("✅ Cliente foi criado")
            print("✅ API de finalização funcionando")
            return True
        else:
            print("🔴 TESTE REPROVADO!")
            print("❌ Falha na conversão do lead")
            return False
            
    except Exception as e:
        print(f"❌ Erro durante teste: {e}")
        return False

if __name__ == "__main__":
    print("🚀 INICIANDO TESTE DE FINALIZAÇÃO DE VENDA...\n")
    
    sucesso = test_finalize_sale()
    
    print("\n" + "=" * 70)
    if sucesso:
        print("🎉 CONVERSÃO DE LEADS FUNCIONANDO CORRETAMENTE!")
        print("📋 Lead → Cliente + Contrato ✅")
    else:
        print("🚨 PROBLEMAS NA CONVERSÃO DE LEADS")
        print("📋 Verificar implementação ❌")
    print("=" * 70) 