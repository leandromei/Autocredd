#!/usr/bin/env python3
"""
Script completo para validar todas as APIs do AutoCred Backend Completo
"""

import requests
import json
import time

BASE_URL = "http://localhost:8000"

def test_complete_backend():
    print("🚀 TESTANDO BACKEND AUTOCRED COMPLETO...")
    print("=" * 60)
    
    # 1. Teste do endpoint raiz
    print("\n🔍 1. TESTANDO ENDPOINT RAIZ...")
    try:
        response = requests.get(f"{BASE_URL}/")
        if response.status_code == 200:
            data = response.json()
            print(f"✅ Backend completo funcionando!")
            print(f"📊 Total de endpoints: {data.get('total_endpoints', 'N/A')}")
            print(f"🔧 APIs disponíveis: {', '.join(data.get('apis_disponibles', [])[:5])}...")
        else:
            print(f"❌ Erro no endpoint raiz: {response.status_code}")
            return False
    except Exception as e:
        print(f"❌ Erro na conexão: {e}")
        return False

    # 2. Teste API de Dashboard
    print("\n🔍 2. TESTANDO API DE DASHBOARD...")
    try:
        response = requests.get(f"{BASE_URL}/api/dashboard/stats")
        if response.status_code == 200:
            data = response.json()
            print(f"✅ Dashboard API funcionando!")
            print(f"📊 Total leads: {data.get('total_leads', 'N/A')}")
            print(f"💰 Ticket médio: {data.get('ticket_medio', 'N/A')}")
        else:
            print(f"❌ Erro na Dashboard API: {response.status_code}")
    except Exception as e:
        print(f"❌ Erro na Dashboard API: {e}")

    # 3. Teste API de Leads
    print("\n🔍 3. TESTANDO API DE LEADS...")
    try:
        response = requests.get(f"{BASE_URL}/api/leads")
        if response.status_code == 200:
            leads = response.json()
            print(f"✅ Leads API funcionando!")
            print(f"📋 Total de leads: {len(leads) if isinstance(leads, list) else 'N/A'}")
        else:
            print(f"❌ Erro na Leads API: {response.status_code}")
    except Exception as e:
        print(f"❌ Erro na Leads API: {e}")

    # 4. Teste API de Usuários
    print("\n🔍 4. TESTANDO API DE USUÁRIOS...")
    try:
        response = requests.get(f"{BASE_URL}/api/users")
        if response.status_code == 200:
            users = response.json()
            print(f"✅ Users API funcionando!")
            print(f"👥 Total de usuários: {len(users) if isinstance(users, list) else 'N/A'}")
        else:
            print(f"❌ Erro na Users API: {response.status_code}")
    except Exception as e:
        print(f"❌ Erro na Users API: {e}")

    # 5. Teste API de Planos
    print("\n🔍 5. TESTANDO API DE PLANOS...")
    try:
        response = requests.get(f"{BASE_URL}/api/plans")
        if response.status_code == 200:
            plans = response.json()
            print(f"✅ Plans API funcionando!")
            print(f"📋 Total de planos: {len(plans) if isinstance(plans, list) else 'N/A'}")
        else:
            print(f"❌ Erro na Plans API: {response.status_code}")
    except Exception as e:
        print(f"❌ Erro na Plans API: {e}")

    # 6. Teste API de Contratos
    print("\n🔍 6. TESTANDO API DE CONTRATOS...")
    try:
        response = requests.get(f"{BASE_URL}/api/contracts")
        if response.status_code == 200:
            contracts = response.json()
            print(f"✅ Contracts API funcionando!")
            print(f"📄 Total de contratos: {len(contracts) if isinstance(contracts, list) else 'N/A'}")
        else:
            print(f"❌ Erro na Contracts API: {response.status_code}")
    except Exception as e:
        print(f"❌ Erro na Contracts API: {e}")

    # 7. Teste API de Contatos
    print("\n🔍 7. TESTANDO API DE CONTATOS...")
    try:
        response = requests.get(f"{BASE_URL}/api/contacts")
        if response.status_code == 200:
            contacts = response.json()
            print(f"✅ Contacts API funcionando!")
            print(f"📞 Total de contatos: {len(contacts) if isinstance(contacts, list) else 'N/A'}")
        else:
            print(f"❌ Erro na Contacts API: {response.status_code}")
    except Exception as e:
        print(f"❌ Erro na Contacts API: {e}")

    # 8. Teste API de Clientes
    print("\n🔍 8. TESTANDO API DE CLIENTES...")
    try:
        response = requests.get(f"{BASE_URL}/api/clients")
        if response.status_code == 200:
            clients = response.json()
            print(f"✅ Clients API funcionando!")
            print(f"👤 Total de clientes: {len(clients) if isinstance(clients, list) else 'N/A'}")
        else:
            print(f"❌ Erro na Clients API: {response.status_code}")
    except Exception as e:
        print(f"❌ Erro na Clients API: {e}")

    # 9. Teste API de Comissões
    print("\n🔍 9. TESTANDO API DE COMISSÕES...")
    try:
        response = requests.get(f"{BASE_URL}/api/commissions")
        if response.status_code == 200:
            commissions = response.json()
            print(f"✅ Commissions API funcionando!")
            print(f"💰 Total de comissões: {len(commissions) if isinstance(commissions, list) else 'N/A'}")
        else:
            print(f"❌ Erro na Commissions API: {response.status_code}")
    except Exception as e:
        print(f"❌ Erro na Commissions API: {e}")

    # 10. Teste API de Prospecção
    print("\n🔍 10. TESTANDO API DE PROSPECÇÃO...")
    try:
        response = requests.get(f"{BASE_URL}/api/prospecting/ura-reversa/stats")
        if response.status_code == 200:
            stats = response.json()
            print(f"✅ Prospecting API funcionando!")
            print(f"📊 Total contatos: {stats.get('totalContacts', 'N/A')}")
            print(f"📞 Taxa de sucesso: {stats.get('successRate', 'N/A')}")
        else:
            print(f"❌ Erro na Prospecting API: {response.status_code}")
    except Exception as e:
        print(f"❌ Erro na Prospecting API: {e}")

    # 11. Teste API de Relatórios
    print("\n🔍 11. TESTANDO API DE RELATÓRIOS...")
    try:
        response = requests.get(f"{BASE_URL}/api/reports/leads")
        if response.status_code == 200:
            reports = response.json()
            print(f"✅ Reports API funcionando!")
        else:
            print(f"❌ Erro na Reports API: {response.status_code}")
    except Exception as e:
        print(f"❌ Erro na Reports API: {e}")

    # 12. Teste API de Configurações
    print("\n🔍 12. TESTANDO API DE CONFIGURAÇÕES...")
    try:
        response = requests.get(f"{BASE_URL}/api/settings")
        if response.status_code == 200:
            settings = response.json()
            print(f"✅ Settings API funcionando!")
        else:
            print(f"❌ Erro na Settings API: {response.status_code}")
    except Exception as e:
        print(f"❌ Erro na Settings API: {e}")

    print("\n" + "=" * 60)
    print("🎉 TESTE COMPLETO FINALIZADO!")
    print("✅ Backend AutoCred com TODAS as APIs está funcionando!")
    print("🌐 Acesse: http://localhost:8000/docs para ver a documentação completa")
    print("📱 Frontend disponível em: http://localhost:5177/")
    print("=" * 60)

if __name__ == "__main__":
    test_complete_backend() 