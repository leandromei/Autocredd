#!/usr/bin/env python3
"""
Teste simples de login para verificar se a correção funcionou
"""

import requests

def test_login():
    """Testa o login com as credenciais corretas"""
    print("🔑 Testando login com admin@autocred.com...")
    
    # Dados do formulário para OAuth2PasswordRequestForm
    form_data = {
        'username': 'admin@autocred.com',
        'password': 'admin123'
    }
    
    try:
        # Fazer requisição de login
        response = requests.post(
            'http://localhost:8001/api/token',
            data=form_data,  # Usar data para form data
            headers={'Content-Type': 'application/x-www-form-urlencoded'}
        )
        
        print(f"📊 Status Code: {response.status_code}")
        print(f"📊 Response: {response.text}")
        
        if response.status_code == 200:
            result = response.json()
            print("✅ Login bem-sucedido!")
            print(f"🎫 Token: {result.get('access_token', 'N/A')}")
            print(f"🔑 Type: {result.get('token_type', 'N/A')}")
            return True
        else:
            print("❌ Falha no login")
            return False
            
    except Exception as e:
        print(f"❌ Erro na requisição: {e}")
        return False

if __name__ == "__main__":
    print("🧪 TESTE DE LOGIN CORRIGIDO")
    print("=" * 50)
    
    success = test_login()
    
    print("=" * 50)
    if success:
        print("🎉 ✅ LOGIN FUNCIONANDO! O problema foi corrigido.")
        print("")
        print("📍 Credenciais para usar no frontend:")
        print("   Email: admin@autocred.com")
        print("   Senha: admin123")
    else:
        print("❌ Login ainda com problemas") 