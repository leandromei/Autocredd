#!/usr/bin/env python3
"""
AutoCred Sistema - Script de Inicialização Completo
Gerencia todos os serviços do sistema AutoCred
"""

import subprocess
import time
import sys
import os
import signal
import requests
from datetime import datetime

class AutoCredSystemManager:
    def __init__(self):
        self.processes = []
        self.services = {
            'backend': {'port': 8001, 'process': None, 'status': 'stopped'},
            'frontend': {'port': 5180, 'process': None, 'status': 'stopped'},
            'evolution': {'port': 8081, 'process': None, 'status': 'unknown'}
        }
    
    def print_banner(self):
        """Exibe o banner do sistema"""
        print("🚀" + "="*60 + "🚀")
        print("   ___         __        ______              __")
        print("  / _ |__ __  / /____   / ___/ _______ ___  / /")
        print(" / __ / // / / __/ _ \\ / /__/ /_/ (_ // _ \\/ / ")
        print("/_/ |_\\_,_/  \\__/\\___/ \\___/ __/_/__/___/_/  ")
        print("                           /___/              ")
        print("")
        print("🔥 AutoCred CRM - Sistema de Gestão Completo 🔥")
        print("💼 CRM | 📱 WhatsApp | 📧 SMS | 🤖 IA Agents")
        print("="*64)
        print(f"📅 {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}")
        print("="*64)
    
    def check_dependencies(self):
        """Verifica dependências do sistema"""
        print("🔍 Verificando dependências...")
        
        # Verificar Python
        python_version = sys.version.split()[0]
        print(f"   ✅ Python: {python_version}")
        
        # Verificar se os arquivos existem
        files_to_check = [
            'backend_autocred/api_simple.py',
            'frontend_bolt/package.json',
            'autocred.db'
        ]
        
        for file_path in files_to_check:
            if os.path.exists(file_path):
                print(f"   ✅ {file_path}")
            else:
                print(f"   ❌ {file_path} - ARQUIVO NÃO ENCONTRADO")
                return False
        
        # Verificar Docker
        try:
            result = subprocess.run(['docker', '--version'], 
                                  capture_output=True, text=True, timeout=5)
            if result.returncode == 0:
                docker_version = result.stdout.strip()
                print(f"   ✅ {docker_version}")
            else:
                print("   ⚠️  Docker não encontrado")
        except:
            print("   ⚠️  Docker não encontrado")
        
        print("   ✅ Todas as dependências verificadas!")
        return True
    
    def start_backend(self):
        """Inicia o backend"""
        print("🖥️  Iniciando Backend AutoCred...")
        try:
            # Mudar para o diretório do backend
            backend_dir = os.path.join(os.getcwd(), 'backend_autocred')
            
            # Iniciar o processo do backend
            process = subprocess.Popen(
                [sys.executable, 'api_simple.py'],
                cwd=backend_dir,
                stdout=subprocess.PIPE,
                stderr=subprocess.STDOUT,
                text=True
            )
            
            self.services['backend']['process'] = process
            self.processes.append(process)
            
            # Aguardar inicialização
            print("   ⏳ Aguardando inicialização...")
            time.sleep(3)
            
            # Verificar se está funcionando
            if self.check_backend_health():
                self.services['backend']['status'] = 'running'
                print("   ✅ Backend iniciado com sucesso!")
                print("   🌐 URL: http://localhost:8001")
                print("   📧 Login: admin@autocred.com")
                print("   🔑 Senha: admin123")
                return True
            else:
                print("   ❌ Falha ao iniciar backend")
                return False
                
        except Exception as e:
            print(f"   ❌ Erro ao iniciar backend: {e}")
            return False
    
    def start_frontend(self):
        """Inicia o frontend"""
        print("\n🌐 Iniciando Frontend AutoCred...")
        try:
            # Mudar para o diretório do frontend
            frontend_dir = os.path.join(os.getcwd(), 'frontend_bolt')
            
            # Iniciar o processo do frontend
            process = subprocess.Popen(
                ['npm', 'run', 'dev'],
                cwd=frontend_dir,
                stdout=subprocess.PIPE,
                stderr=subprocess.STDOUT,
                text=True
            )
            
            self.services['frontend']['process'] = process
            self.processes.append(process)
            
            # Aguardar inicialização
            print("   ⏳ Aguardando inicialização...")
            time.sleep(5)
            
            # Verificar se está funcionando
            if self.check_frontend_health():
                self.services['frontend']['status'] = 'running'
                print("   ✅ Frontend iniciado com sucesso!")
                print("   🌐 URL: http://localhost:5180")
                return True
            else:
                print("   ❌ Falha ao iniciar frontend")
                return False
                
        except Exception as e:
            print(f"   ❌ Erro ao iniciar frontend: {e}")
            return False
    
    def check_evolution_api(self):
        """Verifica se a Evolution API está rodando"""
        print("\n📱 Verificando Evolution API...")
        try:
            response = requests.get("http://localhost:8081/manager/instances", 
                                  headers={"apikey": "429683C4C977415CAAFCCE10F7D57E11"}, 
                                  timeout=5)
            if response.status_code == 200:
                self.services['evolution']['status'] = 'running'
                print("   ✅ Evolution API está rodando!")
                print("   🌐 URL: http://localhost:8081")
                return True
            else:
                print(f"   ❌ Evolution API retornou erro: {response.status_code}")
                return False
        except Exception as e:
            print("   ⚠️  Evolution API não está rodando")
            print("   💡 Execute: docker-compose up -d na pasta evolution")
            return False
    
    def check_backend_health(self):
        """Verifica se o backend está saudável"""
        try:
            response = requests.get("http://localhost:8001/api/health", timeout=5)
            return response.status_code == 200
        except:
            return False
    
    def check_frontend_health(self):
        """Verifica se o frontend está saudável"""
        try:
            response = requests.get("http://localhost:5180", timeout=5)
            return response.status_code == 200
        except:
            return False
    
    def show_status(self):
        """Mostra o status de todos os serviços"""
        print("\n📊 STATUS DOS SERVIÇOS")
        print("="*40)
        
        for service_name, service_info in self.services.items():
            status_icon = "✅" if service_info['status'] == 'running' else "❌"
            port = service_info['port']
            status = service_info['status'].upper()
            print(f"   {status_icon} {service_name.upper():12} | Port: {port} | Status: {status}")
        
        print("="*40)
    
    def start_all_services(self):
        """Inicia todos os serviços"""
        print("\n🚀 INICIANDO TODOS OS SERVIÇOS...\n")
        
        success_count = 0
        
        # Iniciar backend
        if self.start_backend():
            success_count += 1
        
        # Iniciar frontend
        if self.start_frontend():
            success_count += 1
        
        # Verificar Evolution API
        if self.check_evolution_api():
            success_count += 1
        
        # Mostrar status final
        self.show_status()
        
        if success_count >= 2:  # Backend + Frontend pelo menos
            print("\n🎉 SISTEMA INICIADO COM SUCESSO!")
            print("\n📋 INFORMAÇÕES DE ACESSO:")
            print("   🌐 Frontend: http://localhost:5180")
            print("   🖥️  Backend:  http://localhost:8001")
            print("   📧 Login:    admin@autocred.com")
            print("   🔑 Senha:    admin123")
            
            if self.services['evolution']['status'] == 'running':
                print("   📱 WhatsApp: http://localhost:8081")
            
            print("\n💡 Para monitorar o sistema: python system_monitor.py")
            return True
        else:
            print("\n❌ FALHA AO INICIAR O SISTEMA")
            return False
    
    def stop_all_services(self):
        """Para todos os serviços"""
        print("\n🛑 Parando todos os serviços...")
        
        for process in self.processes:
            try:
                if process.poll() is None:  # Processo ainda está rodando
                    process.terminate()
                    process.wait(timeout=5)
                    print("   ✅ Serviço parado")
            except:
                try:
                    process.kill()
                    print("   ⚠️  Serviço forçado a parar")
                except:
                    print("   ❌ Erro ao parar serviço")
        
        print("   ✅ Todos os serviços foram parados")
    
    def signal_handler(self, signum, frame):
        """Manipulador de sinal para parada graceful"""
        print("\n🛑 Sinal de interrupção recebido...")
        self.stop_all_services()
        sys.exit(0)
    
    def run(self):
        """Executa o gerenciador do sistema"""
        # Configurar manipulador de sinal
        signal.signal(signal.SIGINT, self.signal_handler)
        
        # Exibir banner
        self.print_banner()
        
        # Verificar dependências
        if not self.check_dependencies():
            print("❌ Falha na verificação de dependências")
            sys.exit(1)
        
        # Iniciar serviços
        if self.start_all_services():
            print("\n⚡ Sistema rodando...")
            print("   Pressione Ctrl+C para parar o sistema")
            
            try:
                # Loop infinito para manter o script rodando
                while True:
                    time.sleep(1)
            except KeyboardInterrupt:
                pass
        else:
            print("❌ Falha ao iniciar o sistema")
            sys.exit(1)

if __name__ == "__main__":
    manager = AutoCredSystemManager()
    manager.run() 