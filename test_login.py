#!/usr/bin/env python3
"""
Script de teste para validar o sistema de login do AutoCred
"""

import requests
import json

BASE_URL = "http://localhost:8000"

def test_login():
    """Testa o endpoint de login"""
    print("🔍 Testando login...")
    
    # Dados de login
    data = {
        'username': 'admin@autocred.com',
        'password': 'admin123'
    }
    
    # URL do endpoint
    url = f"{BASE_URL}/api/token"
    print(f"URL: {url}")
    print(f"Dados: {data}")
    
    try:
        # Fazer requisição POST
        response = requests.post(url, data=data)
        
        print(f"Status: {response.status_code}")
        print(f"Resposta: {response.text}")
        
        if response.status_code == 200:
            print("✅ Login realizado com sucesso!")
            result = response.json()
            print(f"Token: {result.get('access_token', 'N/A')}")
            return True
        else:
            print("❌ Falha no login!")
            return False
            
    except Exception as e:
        print(f"❌ Erro na requisição: {e}")
        return False

if __name__ == "__main__":
    test_login() 