import requests
import json
import time

def test_evolution_api():
    base_url = "http://localhost:8080"
    headers = {
        "Content-Type": "application/json",
        "apikey": "B6D711FCDE4D4FD5936544120E713C37"
    }
    
    print("Aguardando a API inicializar...")
    time.sleep(10)  # Aguarda 10 segundos para a API inicializar completamente
    
    # Testar se a API está online
    try:
        response = requests.get(f"{base_url}/", headers=headers)
        print("\nStatus da API:", response.status_code)
        print(json.dumps(response.json(), indent=2))
    except Exception as e:
        print("Erro ao acessar a API:", str(e))
    
    # Criar instância
    create_data = {
        "instanceName": "autocredwhatsapp",
        "token": "B6D711FCDE4D4FD5936544120E713C37"
    }
    try:
        response = requests.post(
            f"{base_url}/instance/create",
            headers=headers,
            json=create_data
        )
        print("\nCriar instância:", response.status_code)
        print(json.dumps(response.json(), indent=2))
        
        if response.status_code in [200, 201]:
            # Verificar status e obter QR Code
            time.sleep(2)  # Aguarda um pouco para a instância ser criada
            response = requests.get(
                f"{base_url}/instance/connect/autocredwhatsapp",
                headers=headers
            )
            print("\nConectar instância:", response.status_code)
            print(json.dumps(response.json(), indent=2))
    except Exception as e:
        print("Erro ao criar/conectar instância:", str(e))

if __name__ == "__main__":
    test_evolution_api() 