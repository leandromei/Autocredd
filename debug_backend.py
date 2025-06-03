#!/usr/bin/env python3
"""
Debug script para testar backend diretamente
"""

import requests
import json

BASE_URL = "http://localhost:8000"

def test_backend():
    print("🔍 INICIANDO DEBUG DO BACKEND...")
    
    # 1. Verificar health
    try:
        response = requests.get(f"{BASE_URL}/api/health")
        print(f"✅ Health check: {response.status_code}")
    except Exception as e:
        print(f"❌ Backend não está rodando: {e}")
        return
    
    # 2. Verificar clientes ANTES
    response = requests.get(f"{BASE_URL}/api/clients")
    clients_before = response.json()
    print(f"📊 Clientes antes: {len(clients_before['clients'])}")
    
    # 3. Verificar contratos ANTES
    response = requests.get(f"{BASE_URL}/api/contracts")
    contracts_before = response.json()
    print(f"📊 Contratos antes: {len(contracts_before['contracts'])}")
    
    # 4. Finalizar venda
    finalize_data = {"leadId": "1"}
    response = requests.post(
        f"{BASE_URL}/api/leads/finalize-sale",
        json=finalize_data
    )
    
    if response.status_code == 200:
        result = response.json()
        print(f"✅ Finalização: {result['message']}")
    else:
        print(f"❌ Erro na finalização: {response.status_code} - {response.text}")
        return
    
    # 5. Verificar clientes DEPOIS
    response = requests.get(f"{BASE_URL}/api/clients")
    clients_after = response.json()
    print(f"📊 Clientes depois: {len(clients_after['clients'])}")
    
    # 6. Verificar contratos DEPOIS
    response = requests.get(f"{BASE_URL}/api/contracts")
    contracts_after = response.json()
    print(f"📊 Contratos depois: {len(contracts_after['contracts'])}")
    
    # 7. Mostrar diferença
    clients_diff = len(clients_after['clients']) - len(clients_before['clients'])
    contracts_diff = len(contracts_after['contracts']) - len(contracts_before['contracts'])
    
    print(f"\n🔍 RESULTADO:")
    print(f"📈 Clientes adicionados: {clients_diff}")
    print(f"📈 Contratos adicionados: {contracts_diff}")
    
    if clients_diff > 0 and contracts_diff > 0:
        print("✅ BACKEND FUNCIONANDO CORRETAMENTE!")
    else:
        print("❌ PROBLEMA NO BACKEND!")
        
        # Debug adicional - mostrar últimos clientes
        print("\n📋 Últimos 2 clientes:")
        for client in clients_after['clients'][-2:]:
            print(f"   - {client['name']} ({client['id']})")

if __name__ == "__main__":
    test_backend() 