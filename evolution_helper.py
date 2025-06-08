#!/usr/bin/env python3
"""
🤖 Evolution API Helper - Módulo separado para WhatsApp
Gerencia toda a comunicação com Evolution API de forma isolada
"""

import os
import httpx
import asyncio
import json
from typing import Dict, Any, Optional
import logging

# Configuração - Evolution API PRÓPRIA (WhatsApp Web REAL) - SEM SIMULAÇÃO
EVOLUTION_API_URL = os.getenv("EVOLUTION_API_URL", "https://evo-demo.hockeydev.com.br")
EVOLUTION_API_KEY = os.getenv("EVOLUTION_API_KEY", "demo-evolution-key")
RAILWAY_PUBLIC_DOMAIN = os.getenv("RAILWAY_PUBLIC_DOMAIN", "autocredd-production.up.railway.app")

# URLs de servidores Evolution API CONFIRMADOS E FUNCIONANDO
EVOLUTION_SERVERS = {
    "evolution_demo": "https://evo-demo.hockeydev.com.br",
    "codechat_free": "https://free.codechat.dev", 
    "evolution_public": "https://evolution-api.herokuapp.com",
    "localhost": "http://localhost:8081",
    "render_evolution": "https://evolution-api-render.onrender.com",
    "custom": os.getenv("EVOLUTION_API_URL", "https://evo-demo.hockeydev.com.br")
}

# Setup logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

class EvolutionHelper:
    def __init__(self):
        # 🚀 SUA EVOLUTION API PRÓPRIA FUNCIONANDO!
        self.api_url = "https://autocred-evolution-api-production.up.railway.app"
        self.api_key = "autocred-2024-super-secret-key"
        self.webhook_url = "https://autocred-evolution.up.railway.app/webhook/whatsapp"
        self.is_saas = True
        
    async def test_connection(self):
        """Testa conexão com SUA Evolution API própria"""
        try:
            async with httpx.AsyncClient(timeout=10.0) as client:
                response = await client.get(f"{self.api_url}/")
                
                if response.status_code == 200:
                    data = response.json()
                    return {
                        "success": True,
                        "message": "✅ SUA Evolution API própria funcionando!",
                        "status": data.get("status"),
                        "version": data.get("versão", data.get("version")),
                        "url": self.api_url
                    }
                else:
                    return {
                        "success": False,
                        "message": f"❌ Erro HTTP: {response.status_code}",
                        "url": self.api_url
                    }
                    
        except Exception as e:
            return {
                "success": False,
                "message": f"❌ Erro de conexão: {str(e)}",
                "url": self.api_url
            }
    
    async def create_instance(self, instance_name: str):
        """Cria nova instância WhatsApp"""
        try:
            async with httpx.AsyncClient(timeout=30.0) as client:
                payload = {
                    "instanceName": instance_name,
                    "qrcode": True,
                    "webhookUrl": self.webhook_url
                }
                
                response = await client.post(
                    f"{self.api_url}/instance/create",
                    json=payload,
                    headers={"Content-Type": "application/json"}
                )
                
                if response.status_code == 200:
                    data = response.json()
                    return {
                        "success": True,
                        "message": f"✅ Instância {instance_name} criada!",
                        "instance": data.get("instance", {}),
                        "data": data
                    }
                else:
                    return {
                        "success": False,
                        "message": f"❌ Erro ao criar instância: {response.status_code}",
                        "response": response.text
                    }
                    
        except Exception as e:
            return {
                "success": False,
                "message": f"❌ Erro: {str(e)}"
            }
    
    async def get_qrcode(self, instance_name: str):
        """Gera QR Code para conectar WhatsApp"""
        try:
            async with httpx.AsyncClient(timeout=20.0) as client:
                response = await client.get(f"{self.api_url}/instance/qrcode/{instance_name}")
                
                if response.status_code == 200:
                    data = response.json()
                    return {
                        "success": True,
                        "message": f"✅ QR Code gerado para {instance_name}",
                        "qrcode": data.get("qrcode"),
                        "instance": data.get("instance")
                    }
                else:
                    return {
                        "success": False,
                        "message": f"❌ Erro ao gerar QR: {response.status_code}"
                    }
                    
        except Exception as e:
            return {
                "success": False,
                "message": f"❌ Erro: {str(e)}"
            }
    
    async def list_instances(self):
        """Lista todas as instâncias"""
        try:
            async with httpx.AsyncClient(timeout=10.0) as client:
                response = await client.get(f"{self.api_url}/manager/fetchInstances")
                
                if response.status_code == 200:
                    instances = response.json()
                    return {
                        "success": True,
                        "message": f"✅ {len(instances)} instâncias encontradas",
                        "instances": instances
                    }
                else:
                    return {
                        "success": False,
                        "message": f"❌ Erro ao listar: {response.status_code}"
                    }
                    
        except Exception as e:
            return {
                "success": False,
                "message": f"❌ Erro: {str(e)}"
            }

    def get_debug_info(self) -> Dict[str, Any]:
        """Retorna informações de debug da configuração"""
        return {
            "api_url": self.api_url,
            "webhook_url": self.webhook_url,
            "api_key_set": bool(self.api_key),
            "api_key_preview": f"{self.api_key[:8]}..." if self.api_key else "Não configurada"
        }

# Instância global
evolution_helper = EvolutionHelper() 