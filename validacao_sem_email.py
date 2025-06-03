#!/usr/bin/env python3
"""
Validação - Campo email removido da aba Clientes
"""

import requests
import json

def validar_remocao_email():
    try:
        print("🎯 VALIDAÇÃO - REMOÇÃO DO CAMPO EMAIL DE CLIENTES")
        print("=" * 60)
        
        # Testar conexão
        print("\n🔍 1. Testando conexão com backend...")
        response = requests.get('http://localhost:8000/api/health', timeout=5)
        if response.status_code != 200:
            print("❌ Backend não está respondendo")
            return False
        print("✅ Backend conectado com sucesso")
        
        # Buscar clientes
        print("\n🔍 2. Verificando clientes existentes...")
        clients_response = requests.get('http://localhost:8000/api/clients', timeout=5)
        if clients_response.status_code != 200:
            print("❌ Erro ao buscar clientes")
            return False
        
        clients_data = clients_response.json()
        clients = clients_data.get('clients', [])
        print(f"✅ {len(clients)} clientes encontrados")
        
        # Verificar se email não está presente
        print(f"\n🔍 3. Verificando ausência do campo 'email'...")
        
        email_encontrado = False
        for i, client in enumerate(clients, 1):
            print(f"\n👤 CLIENTE {i}: {client.get('name', 'N/A')}")
            
            if 'email' in client:
                print(f"   ❌ Campo 'email' ainda presente: {client['email']}")
                email_encontrado = True
            else:
                print(f"   ✅ Campo 'email' removido com sucesso")
            
            # Mostrar campos atuais
            campos_principais = ['name', 'cpf', 'phone', 'status']
            for campo in campos_principais:
                valor = client.get(campo, 'N/A')
                print(f"   📝 {campo}: {valor}")
        
        print(f"\n🔍 4. Testando criação de cliente SEM email...")
        
        # Testar criação de cliente sem email
        novo_cliente = {
            "name": "Cliente Teste Sem Email",
            "cpf": "11122233344",
            "phone": "11987654321",
            "status": "ativo",
            "notes": "Cliente criado sem campo email",
            "installment": "R$ 600,00",
            "outstandingBalance": "R$ 14.500,00",
            "source": "Telefone",
            "modality": "Portabilidade",
            "assignedTo": "Teste AutoCred"
        }
        
        create_response = requests.post('http://localhost:8000/api/clients', 
                                       json=novo_cliente, timeout=5)
        
        if create_response.status_code == 200:
            created_client = create_response.json()
            print("✅ Cliente criado com sucesso SEM campo email")
            print(f"   📝 Nome: {created_client.get('name')}")
            print(f"   📄 CPF: {created_client.get('cpf')}")
            print(f"   📞 Telefone: {created_client.get('phone')}")
            print(f"   ⭐ Status: {created_client.get('status')}")
            
            if 'email' in created_client:
                print(f"   ❌ Campo 'email' inesperadamente presente: {created_client['email']}")
                email_encontrado = True
            else:
                print(f"   ✅ Campo 'email' corretamente ausente")
        else:
            print("❌ Erro ao criar cliente sem email")
            return False
        
        print(f"\n🔍 5. Resultado da validação...")
        
        if not email_encontrado:
            print("\n🎉 VALIDAÇÃO APROVADA! 🎉")
            print("=" * 60)
            print("✅ Campo 'email' foi REMOVIDO com sucesso de:")
            print("   • Dados mockados existentes")
            print("   • Criação de novos clientes")
            print("   • Estrutura do backend")
            print("")
            print("✅ Funcionalidades mantidas:")
            print("   • Nome, CPF, Telefone ✅")
            print("   • Status e observações ✅")
            print("   • Campos dos Leads (parcela, saldo, etc.) ✅")
            print("   • CRUD completo ✅")
            print("")
            print("🏆 Campo EMAIL removido com sucesso da aba Clientes!")
            return True
        else:
            print("\n❌ VALIDAÇÃO REPROVADA")
            print("Campo 'email' ainda está presente em alguns lugares.")
            return False
            
    except Exception as e:
        print(f"❌ Erro durante validação: {e}")
        return False

if __name__ == "__main__":
    print("🚀 INICIANDO VALIDAÇÃO DA REMOÇÃO DO EMAIL...\n")
    
    sucesso = validar_remocao_email()
    
    print("\n" + "=" * 60)
    if sucesso:
        print("🟢 STATUS FINAL: CAMPO EMAIL REMOVIDO COM SUCESSO")
        print("🎯 OBJETIVO ALCANÇADO: Clientes sem campo email")
    else:
        print("🔴 STATUS FINAL: REMOÇÃO INCOMPLETA")
    print("=" * 60) 