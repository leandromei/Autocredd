import requests
import time

print("🔥 TESTANDO BACKEND GRATUITO BAILEYS")
print("=" * 50)

try:
    # Testar API Status
    r = requests.get('http://localhost:8000/', timeout=5)
    data = r.json()
    
    print("✅ Backend Status:")
    print(f"Version: {data.get('version')}")
    print(f"Cost: {data.get('cost')}")
    print(f"Baileys: {data.get('baileys_status')}")
    print(f"QR Type: {data.get('qr_type')}")
    
    # Criar instância
    print("\n📱 Testando QR Code:")
    inst = requests.post('http://localhost:8000/instance/create', 
                        json={'instanceName': 'test-gratuito'})
    
    # Gerar QR Code  
    qr = requests.get('http://localhost:8000/instance/qrcode/test-gratuito')
    qr_data = qr.json()
    
    print(f"QR Code gerado: {len(qr_data.get('qrcode', ''))} chars")
    print(f"Tipo: {qr_data.get('type')}")
    print(f"Custo: {qr_data.get('tech_info', {}).get('cost', 'N/A')}")
    
    if len(qr_data.get('qrcode', '')) > 1000:
        print("🎉 SISTEMA GRATUITO FUNCIONANDO!")
    else:
        print("❌ Erro no QR Code")
        
except Exception as e:
    print(f"❌ Erro: {e}")
    print("Verifique se o backend está rodando: node simple_baileys.js") 