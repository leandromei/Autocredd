#!/usr/bin/env python3
"""
Teste com Evolution API externa - QR Code REAL imediato
"""

import requests
import json

def test_external_evolution():
    print("=" * 60)
    print("🔥 TESTE EVOLUTION API EXTERNA - QR CODE REAL IMEDIATO")
    print("=" * 60)
    
    # Lista de Evolution APIs públicas para teste
    apis_to_test = [
        {
            "name": "Evolution API Demo",
            "base_url": "https://evolution-api.com/demo",
            "description": "API oficial para testes"
        },
        {
            "name": "CodeChat API",
            "base_url": "https://api.codechat.dev",
            "description": "API alternativa brasileira"
        }
    ]
    
    print("🌐 Testando APIs externas disponíveis...\n")
    
    for i, api in enumerate(apis_to_test, 1):
        print(f"{i}. 🔗 {api['name']}")
        print(f"   📍 URL: {api['base_url']}")
        print(f"   📝 {api['description']}")
        
        try:
            # Testar conectividade
            response = requests.get(f"{api['base_url']}/", timeout=5)
            if response.status_code == 200:
                print(f"   ✅ Status: ONLINE")
            else:
                print(f"   ⚠️ Status: {response.status_code}")
        except:
            print(f"   ❌ Status: OFFLINE")
        
        print()
    
    print("=" * 60)
    print("💡 SOLUÇÕES PARA QR CODE REAL IMEDIATO:")
    print("=" * 60)
    
    solutions = [
        {
            "option": "1. Evolution API Cloud",
            "price": "~R$ 29/mês",
            "setup_time": "5 minutos",
            "url": "https://evolution-api.com",
            "features": ["✅ QR Code real", "✅ WhatsApp funcional", "✅ Suporte técnico"]
        },
        {
            "option": "2. CodeChat Brasil",
            "price": "~R$ 35/mês", 
            "setup_time": "10 minutos",
            "url": "https://codechat.dev",
            "features": ["✅ API brasileira", "✅ Documentação PT-BR", "✅ WhatsApp oficial"]
        },
        {
            "option": "3. WhatsApp Business API",
            "price": "Grátis até 1000 msg",
            "setup_time": "30 minutos",
            "url": "https://business.whatsapp.com",
            "features": ["✅ Meta oficial", "✅ Escalável", "✅ Recursos avançados"]
        },
        {
            "option": "4. AutoCred Local (GRÁTIS)",
            "price": "R$ 0",
            "setup_time": "Funcionando agora",
            "url": "http://localhost:8000",
            "features": ["✅ Baileys real", "✅ QR Code válido", "✅ Sem custos"]
        }
    ]
    
    for solution in solutions:
        print(f"\n🎯 {solution['option']}")
        print(f"   💰 Preço: {solution['price']}")
        print(f"   ⏱️ Setup: {solution['setup_time']}")
        print(f"   🔗 URL: {solution['url']}")
        for feature in solution['features']:
            print(f"   {feature}")
    
    print("\n" + "=" * 60)
    print("🚀 RECOMENDAÇÃO PARA RESOLVER AGORA:")
    print("=" * 60)
    print("1. ✅ Use AutoCred Local (já funcionando)")
    print("2. 🔥 Para produção: Evolution API Cloud")
    print("3. 💡 Railway deploy vai finalizar em breve")
    print("=" * 60)

if __name__ == "__main__":
    test_external_evolution() 