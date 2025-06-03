#!/usr/bin/env python3
"""
Script para testar o login diretamente e diagnosticar problemas
"""

import requests
import json

def test_login():
    """Testa o login com as credenciais padrão"""
    
    print("🔐 Testando Login AutoCred...")
    print("=" * 50)
    
    # Configuração da API
    base_url = "http://localhost:8001"
    
    # Credenciais
    credentials = {
        "username": "admin@autocred.com",
        "password": "admin123"
    }
    
    try:
        # Teste 1: Verificar se o backend está online
        print("📡 1. Verificando backend...")
        health_response = requests.get(f"{base_url}/api/health", timeout=5)
        print(f"   Status: {health_response.status_code}")
        print(f"   Resposta: {health_response.json()}")
        
        # Teste 2: Tentar login
        print("\n🔑 2. Testando login...")
        
        # Preparar dados para form data (OAuth2PasswordRequestForm)
        form_data = {
            'username': credentials['username'],
            'password': credentials['password']
        }
        
        headers = {
            'Content-Type': 'application/x-www-form-urlencoded',
        }
        
        # Fazer requisição de login
        login_response = requests.post(
            f"{base_url}/api/token",
            data=form_data,
            headers=headers,
            timeout=10
        )
        
        print(f"   Status: {login_response.status_code}")
        
        if login_response.status_code == 200:
            response_data = login_response.json()
            print(f"   ✅ Login bem-sucedido!")
            print(f"   Token: {response_data.get('access_token', 'N/A')[:50]}...")
            print(f"   Tipo: {response_data.get('token_type', 'N/A')}")
            
            # Teste 3: Verificar token
            print("\n🎫 3. Testando token...")
            token = response_data.get('access_token')
            auth_headers = {
                'Authorization': f'Bearer {token}',
                'Content-Type': 'application/json'
            }
            
            me_response = requests.get(f"{base_url}/api/me", headers=auth_headers, timeout=5)
            print(f"   Status: {me_response.status_code}")
            
            if me_response.status_code == 200:
                user_data = me_response.json()
                print(f"   ✅ Token válido!")
                print(f"   Usuário: {user_data.get('email', 'N/A')}")
                print(f"   Admin: {user_data.get('is_admin', False)}")
            else:
                print(f"   ❌ Token inválido: {me_response.text}")
                
        else:
            print(f"   ❌ Falha no login!")
            print(f"   Resposta: {login_response.text}")
            
    except requests.exceptions.ConnectionError:
        print("❌ Erro: Não foi possível conectar ao backend!")
        print("   Verifique se o backend está rodando na porta 8001")
        
    except requests.exceptions.Timeout:
        print("❌ Erro: Timeout na conexão!")
        
    except Exception as e:
        print(f"❌ Erro inesperado: {e}")
    
    print("\n" + "=" * 50)

if __name__ == "__main__":
    test_login() 