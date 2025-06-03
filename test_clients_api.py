#!/usr/bin/env python3
"""
Script simples para testar os endpoints de clientes
"""

import requests
import json

def test_clients_backend():
    print("🧪 Testando endpoints de clientes...")
    
    # Testar health check
    try:
        response = requests.get("http://localhost:8000/api/health")
        print(f"✅ Health check: {response.status_code} - {response.text}")
    except Exception as e:
        print(f"❌ Erro no health check: {e}")
        return
    
    # Testar GET clients
    try:
        response = requests.get("http://localhost:8000/api/clients")
        print(f"✅ GET clients: {response.status_code}")
        if response.status_code == 200:
            data = response.json()
            print(f"   Clientes encontrados: {len(data.get('clients', []))}")
            for client in data.get('clients', [])[:2]:  # Mostrar apenas 2 primeiros
                print(f"   - {client.get('name')} ({client.get('email')})")
    except Exception as e:
        print(f"❌ Erro no GET clients: {e}")
    
    # Testar POST client
    client_data = {
        "name": "Teste Cliente Python",
        "cpf": "12345678901", 
        "email": "teste@cliente.com",
        "phone": "11999999999",
        "status": "ativo",
        "notes": "Cliente criado via script de teste"
    }
    
    try:
        response = requests.post(
            "http://localhost:8000/api/clients",
            json=client_data,
            headers={"Content-Type": "application/json"}
        )
        print(f"✅ POST client: {response.status_code}")
        if response.status_code == 200:
            result = response.json()
            print(f"   Cliente criado: {result.get('name')} (ID: {result.get('id')})")
            
            # Testar atualização de status
            client_id = result.get('id')
            if client_id:
                try:
                    status_response = requests.patch(
                        f"http://localhost:8000/api/clients/{client_id}/status",
                        json={"status": "vip"},
                        headers={"Content-Type": "application/json"}
                    )
                    print(f"✅ PATCH status: {status_response.status_code}")
                    if status_response.status_code == 200:
                        print(f"   Status atualizado para VIP")
                except Exception as e:
                    print(f"❌ Erro no PATCH status: {e}")
                    
        else:
            print(f"   Erro: {response.text}")
    except Exception as e:
        print(f"❌ Erro no POST client: {e}")

if __name__ == "__main__":
    test_clients_backend() 