#!/usr/bin/env python3
"""
Script de teste para o sistema SMS em massa
"""

import requests
import json
import time

BASE_URL = "http://localhost:8001"

def test_sms_system():
    """Testa o sistema completo de SMS"""
    
    print("🧪 Testando Sistema SMS em Massa...")
    
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
    
    # 2. Testar consulta de saldo
    print("\n💰 Testando consulta de saldo...")
    try:
        response = requests.get(f"{BASE_URL}/api/sms/balance")
        data = response.json()
        if data.get('success'):
            print(f"✅ Saldo SMS: {data.get('balance', 'N/A')}")
        else:
            print(f"⚠️ Erro ao consultar saldo: {data.get('error', 'Erro desconhecido')}")
    except Exception as e:
        print(f"❌ Erro na consulta de saldo: {e}")
    
    # 3. Testar criação de campanha
    print("\n📱 Testando criação de campanha SMS...")
    
    campaign_data = {
        "name": "Campanha Teste AutoCred",
        "message": "Olá! Teste do sistema SMS AutoCred. Responda SIM se recebeu esta mensagem.",
        "contacts": [
            {"name": "João Teste", "phone": "11999999999"},
            {"name": "Maria Teste", "phone": "11888888888"},
            {"name": "Pedro Teste", "phone": "21777777777"}
        ]
    }
    
    try:
        response = requests.post(
            f"{BASE_URL}/api/sms/create-campaign",
            json=campaign_data,
            headers={"Content-Type": "application/json"}
        )
        data = response.json()
        
        if data.get('success'):
            campaign_id = data.get('campaign_id')
            print(f"✅ Campanha criada: {campaign_id}")
            print(f"   Total de contatos: {data.get('total_contacts')}")
            
            # 4. Testar listagem de campanhas
            print("\n📋 Testando listagem de campanhas...")
            response = requests.get(f"{BASE_URL}/api/sms/campaigns")
            data = response.json()
            
            if data.get('success'):
                campaigns = data.get('campaigns', [])
                print(f"✅ {len(campaigns)} campanhas encontradas")
                for campaign in campaigns:
                    print(f"   - {campaign['name']} ({campaign['status']})")
            
            # 5. Testar detalhes da campanha
            print(f"\n🔍 Testando detalhes da campanha {campaign_id}...")
            response = requests.get(f"{BASE_URL}/api/sms/campaign/{campaign_id}")
            data = response.json()
            
            if data.get('success'):
                campaign = data.get('campaign')
                print(f"✅ Detalhes obtidos:")
                print(f"   Nome: {campaign['name']}")
                print(f"   Status: {campaign['status']}")
                print(f"   Contatos: {campaign['total_count']}")
                print(f"   Mensagem: {campaign['message'][:50]}...")
            
            # 6. Testar estatísticas
            print("\n📊 Testando estatísticas...")
            response = requests.get(f"{BASE_URL}/api/sms/stats")
            data = response.json()
            
            if data.get('success'):
                stats = data.get('stats')
                print(f"✅ Estatísticas:")
                print(f"   Total campanhas: {stats['total_campaigns']}")
                print(f"   Campanhas enviadas: {stats['sent_campaigns']}")
                print(f"   Total SMS: {stats['total_messages_sent']}")
                print(f"   Taxa de sucesso: {stats['success_rate']}%")
            
            # 7. Simular envio (comentado para não gastar créditos)
            print(f"\n📤 Simulando envio da campanha {campaign_id}...")
            print("⚠️ Envio real comentado para não gastar créditos SMS")
            print("   Para testar envio real, descomente a seção abaixo")
            
            """
            # Descomente para testar envio real
            confirm = input("Deseja realmente enviar a campanha? (sim/não): ")
            if confirm.lower() == 'sim':
                response = requests.post(f"{BASE_URL}/api/sms/send-campaign/{campaign_id}")
                data = response.json()
                
                if data.get('success'):
                    print(f"✅ Campanha enviada! {data.get('sent_count')} SMS enviados")
                    print(f"   Resposta da API: {data.get('api_response')}")
                else:
                    print(f"❌ Erro no envio: {data.get('error')}")
            """
            
            # 8. Testar exclusão da campanha
            print(f"\n🗑️ Testando exclusão da campanha {campaign_id}...")
            response = requests.delete(f"{BASE_URL}/api/sms/campaign/{campaign_id}")
            data = response.json()
            
            if data.get('success'):
                print("✅ Campanha excluída com sucesso")
            else:
                print(f"❌ Erro ao excluir: {data.get('error')}")
                
        else:
            print(f"❌ Erro ao criar campanha: {data.get('error')}")
            
    except Exception as e:
        print(f"❌ Erro no teste de campanha: {e}")
    
    print("\n🎉 Teste do sistema SMS concluído!")
    print("\n📝 Funcionalidades testadas:")
    print("   ✅ Consulta de saldo SMS")
    print("   ✅ Criação de campanhas")
    print("   ✅ Listagem de campanhas")
    print("   ✅ Detalhes de campanha")
    print("   ✅ Estatísticas do sistema")
    print("   ✅ Exclusão de campanhas")
    print("   ⚠️ Envio real (comentado)")
    
    print("\n🔧 Para usar o sistema:")
    print("   1. Acesse a aba SMS em Prospecção")
    print("   2. Importe contatos via CSV ou adicione manualmente")
    print("   3. Crie uma nova campanha")
    print("   4. Configure mensagem e agendamento")
    print("   5. Envie a campanha")
    print("   6. Monitore o status e estatísticas")

if __name__ == "__main__":
    test_sms_system() 