#!/usr/bin/env python3
"""
Script simples para testar o endpoint de criação de leads
"""

import requests
import json

def test_backend():
    print("🧪 Testando o backend AutoCred...")
    
    # Testar health check
    try:
        response = requests.get("http://localhost:8000/api/health")
        print(f"✅ Health check: {response.status_code} - {response.text}")
    except Exception as e:
        print(f"❌ Erro no health check: {e}")
        return
    
    # Testar GET leads
    try:
        response = requests.get("http://localhost:8000/api/leads")
        print(f"✅ GET leads: {response.status_code}")
        if response.status_code == 200:
            data = response.json()
            print(f"   Leads encontrados: {len(data.get('leads', []))}")
    except Exception as e:
        print(f"❌ Erro no GET leads: {e}")
    
    # Testar POST lead
    lead_data = {
        "name": "Teste Python",
        "cpf": "12345678901", 
        "phone": "11999999999",
        "modality": "Portabilidade",
        "source": "Manual",
        "status": "Novo",
        "installment": "R$ 500,00",
        "outstandingBalance": "R$ 15000,00",
        "observations": "Lead criado via script de teste"
    }
    
    try:
        response = requests.post(
            "http://localhost:8000/api/leads",
            json=lead_data,
            headers={"Content-Type": "application/json"}
        )
        print(f"✅ POST lead: {response.status_code}")
        if response.status_code == 200:
            result = response.json()
            print(f"   Lead criado: {result.get('name')} (ID: {result.get('id')})")
        else:
            print(f"   Erro: {response.text}")
    except Exception as e:
        print(f"❌ Erro no POST lead: {e}")

if __name__ == "__main__":
    test_backend() 