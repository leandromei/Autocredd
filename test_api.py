#!/usr/bin/env python3
"""
Script simples para testar o endpoint de criação de leads
"""

import requests
import json
import time

def test_api():
    base_url = "http://localhost:8080"
    headers = {
        "Content-Type": "application/json",
        "apikey": "B6D711FCDE4D4FD5936544120E713C37"
    }
    
    # Teste 1: Verificar se a API está online
    try:
        response = requests.get(base_url)
        print("\nAPI Status:", response.status_code)
        print(json.dumps(response.json(), indent=2))
    except Exception as e:
        print("Erro ao acessar API:", str(e))
        return

    # Teste 2: Criar instância
    try:
        data = {
            "instanceName": "autocredwhatsapp",
            "token": "B6D711FCDE4D4FD5936544120E713C37"
        }
        response = requests.post(
            f"{base_url}/instance/create",
            headers=headers,
            json=data
        )
        print("\nCriar instância:", response.status_code)
        print(json.dumps(response.json(), indent=2))
    except Exception as e:
        print("Erro ao criar instância:", str(e))
        return

    # Teste 3: Conectar e obter QR Code
    try:
        response = requests.get(
            f"{base_url}/instance/connect/autocredwhatsapp",
            headers=headers
        )
        print("\nConectar e obter QR:", response.status_code)
        print(json.dumps(response.json(), indent=2))
    except Exception as e:
        print("Erro ao conectar:", str(e))

if __name__ == "__main__":
    test_api() 