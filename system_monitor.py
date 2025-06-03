#!/usr/bin/env python3
"""
Sistema de Monitoramento AutoCred
Monitora todos os serviços e APIs do sistema
"""

import requests
import json
import time
from datetime import datetime
import subprocess
import sys

def check_service(name, url, timeout=5):
    """Verifica se um serviço está ativo"""
    try:
        response = requests.get(url, timeout=timeout)
        if response.status_code == 200:
            return {"status": "✅ ONLINE", "response_time": response.elapsed.total_seconds(), "details": response.json() if response.headers.get('content-type', '').startswith('application/json') else response.text[:100]}
        else:
            return {"status": f"❌ ERROR ({response.status_code})", "response_time": response.elapsed.total_seconds(), "details": response.text[:100]}
    except requests.exceptions.ConnectRefused:
        return {"status": "🔴 OFFLINE", "response_time": None, "details": "Connection refused"}
    except requests.exceptions.Timeout:
        return {"status": "⏰ TIMEOUT", "response_time": timeout, "details": "Request timed out"}
    except Exception as e:
        return {"status": f"❌ ERROR", "response_time": None, "details": str(e)[:100]}

def check_evolution_api():
    """Verifica a Evolution API"""
    try:
        response = requests.get("http://localhost:8081/manager/instances", 
                              headers={"apikey": "429683C4C977415CAAFCCE10F7D57E11"}, 
                              timeout=5)
        if response.status_code == 200:
            instances = response.json()
            return {"status": "✅ ONLINE", "instances": len(instances), "details": f"{len(instances)} instâncias ativas"}
        else:
            return {"status": f"❌ ERROR ({response.status_code})", "instances": 0, "details": response.text[:100]}
    except Exception as e:
        return {"status": "🔴 OFFLINE", "instances": 0, "details": str(e)[:100]}

def check_database():
    """Verifica a conectividade com o banco de dados"""
    try:
        import sqlite3
        conn = sqlite3.connect('autocred.db')
        cursor = conn.cursor()
        cursor.execute("SELECT COUNT(*) FROM users")
        user_count = cursor.fetchone()[0]
        cursor.execute("SELECT COUNT(*) FROM sqlite_master WHERE type='table'")
        table_count = cursor.fetchone()[0]
        conn.close()
        return {"status": "✅ ONLINE", "users": user_count, "tables": table_count, "details": f"{user_count} usuários, {table_count} tabelas"}
    except Exception as e:
        return {"status": "❌ ERROR", "users": 0, "tables": 0, "details": str(e)[:100]}

def check_docker_containers():
    """Verifica containers Docker"""
    try:
        result = subprocess.run(['docker', 'ps', '--format', '{{.Names}}\t{{.Status}}'], 
                              capture_output=True, text=True, timeout=10)
        if result.returncode == 0:
            containers = []
            for line in result.stdout.strip().split('\n'):
                if line:
                    name, status = line.split('\t', 1)
                    containers.append({"name": name, "status": status})
            return {"status": "✅ ONLINE", "containers": containers, "count": len(containers)}
        else:
            return {"status": "❌ ERROR", "containers": [], "count": 0, "details": result.stderr}
    except subprocess.TimeoutExpired:
        return {"status": "⏰ TIMEOUT", "containers": [], "count": 0, "details": "Docker command timed out"}
    except FileNotFoundError:
        return {"status": "🔴 NOT_INSTALLED", "containers": [], "count": 0, "details": "Docker not installed"}
    except Exception as e:
        return {"status": "❌ ERROR", "containers": [], "count": 0, "details": str(e)}

def get_system_info():
    """Coleta informações do sistema"""
    timestamp = datetime.now().strftime("%Y-%m-%d %H:%M:%S")
    
    print("🚀 AutoCred Sistema - Monitor de Status")
    print("=" * 50)
    print(f"📅 Timestamp: {timestamp}")
    print()
    
    # Backend AutoCred
    print("🖥️  BACKEND AUTOCRED")
    backend_status = check_service("Backend AutoCred", "http://localhost:8001/api/health")
    print(f"   Status: {backend_status['status']}")
    if backend_status['response_time']:
        print(f"   Tempo de resposta: {backend_status['response_time']:.3f}s")
    print(f"   Detalhes: {backend_status['details']}")
    print()
    
    # Frontend
    print("🌐 FRONTEND")
    try:
        response = requests.get("http://localhost:5180", timeout=5)
        if response.status_code == 200:
            print("   Status: ✅ ONLINE")
            print(f"   Tempo de resposta: {response.elapsed.total_seconds():.3f}s")
        else:
            print(f"   Status: ❌ ERROR ({response.status_code})")
    except:
        print("   Status: 🔴 OFFLINE")
    print()
    
    # Evolution API
    print("📱 EVOLUTION API")
    evolution_status = check_evolution_api()
    print(f"   Status: {evolution_status['status']}")
    print(f"   Instâncias: {evolution_status['instances']}")
    print(f"   Detalhes: {evolution_status['details']}")
    print()
    
    # Banco de Dados
    print("🗄️  BANCO DE DADOS")
    db_status = check_database()
    print(f"   Status: {db_status['status']}")
    print(f"   Detalhes: {db_status['details']}")
    print()
    
    # Docker Containers
    print("🐳 DOCKER CONTAINERS")
    docker_status = check_docker_containers()
    print(f"   Status: {docker_status['status']}")
    print(f"   Containers ativos: {docker_status['count']}")
    if docker_status['containers']:
        for container in docker_status['containers']:
            status_icon = "✅" if "Up" in container['status'] else "❌"
            print(f"     {status_icon} {container['name']}: {container['status']}")
    print()

def test_authentication():
    """Testa a autenticação do sistema"""
    print("🔐 TESTE DE AUTENTICAÇÃO")
    try:
        # Teste de login
        login_data = {
            'username': 'admin@autocred.com',
            'password': 'admin123'
        }
        
        response = requests.post(
            "http://localhost:8001/api/token",
            data=login_data,
            headers={'Content-Type': 'application/x-www-form-urlencoded'},
            timeout=10
        )
        
        if response.status_code == 200:
            data = response.json()
            print("   Login: ✅ SUCESSO")
            print(f"   Token: {data.get('access_token', 'N/A')[:20]}...")
            return data.get('access_token')
        else:
            print(f"   Login: ❌ FALHOU ({response.status_code})")
            print(f"   Erro: {response.text}")
            return None
            
    except Exception as e:
        print(f"   Login: ❌ ERRO - {str(e)}")
        return None

def test_integration():
    """Testa as integrações principais"""
    print("\n🔗 TESTE DE INTEGRAÇÕES")
    
    # Obter token de autenticação
    token = test_authentication()
    if not token:
        print("   ❌ Não foi possível obter token de autenticação")
        return
    
    headers = {'Authorization': f'Bearer {token}'}
    
    # Teste API de clientes
    try:
        response = requests.get("http://localhost:8001/api/clients", headers=headers, timeout=10)
        if response.status_code == 200:
            clients = response.json()
            print(f"   API Clientes: ✅ OK ({len(clients)} clientes)")
        else:
            print(f"   API Clientes: ❌ ERRO ({response.status_code})")
    except Exception as e:
        print(f"   API Clientes: ❌ ERRO - {str(e)}")
    
    # Teste API de leads
    try:
        response = requests.get("http://localhost:8001/api/leads", headers=headers, timeout=10)
        if response.status_code == 200:
            leads = response.json()
            print(f"   API Leads: ✅ OK ({len(leads)} leads)")
        else:
            print(f"   API Leads: ❌ ERRO ({response.status_code})")
    except Exception as e:
        print(f"   API Leads: ❌ ERRO - {str(e)}")
    
    # Teste Evolution API
    try:
        response = requests.get("http://localhost:8001/api/evolution/instance/list", headers=headers, timeout=10)
        if response.status_code == 200:
            print("   Evolution Integration: ✅ OK")
        else:
            print(f"   Evolution Integration: ❌ ERRO ({response.status_code})")
    except Exception as e:
        print(f"   Evolution Integration: ❌ ERRO - {str(e)}")

if __name__ == "__main__":
    try:
        # Informações do sistema
        get_system_info()
        
        # Testes de integração
        test_integration()
        
        print("\n" + "=" * 50)
        print("✅ Monitor de sistema executado com sucesso!")
        print("💡 Para monitoramento contínuo, execute: python system_monitor.py")
        
    except KeyboardInterrupt:
        print("\n❌ Monitor interrompido pelo usuário")
    except Exception as e:
        print(f"\n❌ Erro no monitor: {str(e)}")
        sys.exit(1) 