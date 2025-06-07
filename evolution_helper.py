#!/usr/bin/env python3
"""
🤖 Evolution API Helper - Módulo separado para WhatsApp
Gerencia toda a comunicação com Evolution API de forma isolada
"""

import os
import httpx
import asyncio
from typing import Dict, Any, Optional
import logging

# Configuração - Evolution API SaaS
EVOLUTION_API_URL = os.getenv("EVOLUTION_API_URL", "https://api.evolutionapi.com")
EVOLUTION_API_KEY = os.getenv("EVOLUTION_API_KEY", "SUA_API_KEY_AQUI")
RAILWAY_PUBLIC_DOMAIN = os.getenv("RAILWAY_PUBLIC_DOMAIN", "autocredd-production.up.railway.app")

# URLs de provedores Evolution API SaaS conhecidos
EVOLUTION_SAAS_PROVIDERS = {
    "evolutionapi_com": "https://api.evolutionapi.com",
    "whatsapp_evolution": "https://evolution-api.whatsapp.com", 
    "custom": os.getenv("EVOLUTION_API_URL", "https://api.evolutionapi.com")
}

# Setup logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

class EvolutionAPIHelper:
    def __init__(self):
        self.api_url = EVOLUTION_API_URL
        self.api_key = EVOLUTION_API_KEY
        self.webhook_url = f"https://{RAILWAY_PUBLIC_DOMAIN}/webhook/whatsapp"
        self.is_saas = not ("localhost" in self.api_url or "127.0.0.1" in self.api_url)
        
    def configure_saas_provider(self, provider_name: str, api_key: str, custom_url: str = None):
        """Configura provedor SaaS específico"""
        if provider_name in EVOLUTION_SAAS_PROVIDERS:
            self.api_url = EVOLUTION_SAAS_PROVIDERS[provider_name]
        elif custom_url:
            self.api_url = custom_url
        else:
            self.api_url = EVOLUTION_SAAS_PROVIDERS["evolutionapi_com"]
            
        self.api_key = api_key
        self.is_saas = True
        logger.info(f"✅ Configurado Evolution API SaaS: {self.api_url}")
        return {
            "success": True,
            "provider": provider_name,
            "api_url": self.api_url,
            "configured": True
        }
        
    async def test_connection(self) -> Dict[str, Any]:
        """Testa se a Evolution API está funcionando"""
        try:
            async with httpx.AsyncClient(timeout=10.0) as client:
                response = await client.get(
                    f"{self.api_url}/instance/fetchInstances",
                    headers={"apikey": self.api_key}
                )
                
                if response.status_code == 200:
                    data = response.json()
                    return {
                        "success": True,
                        "status": "online",
                        "instances": len(data) if isinstance(data, list) else 0,
                        "message": "Evolution API está funcionando",
                        "url": self.api_url
                    }
                else:
                    return {
                        "success": False,
                        "status": "error",
                        "message": f"HTTP {response.status_code}: {response.text}",
                        "url": self.api_url
                    }
                    
        except Exception as e:
            return {
                "success": False,
                "status": "offline",
                "message": f"Erro de conexão: {str(e)}",
                "url": self.api_url
            }
    
    async def create_instance(self, instance_name: str) -> Dict[str, Any]:
        """Cria uma instância WhatsApp"""
        try:
            async with httpx.AsyncClient(timeout=30.0) as client:
                payload = {
                    "instanceName": instance_name,
                    "qrcode": True,
                    "integration": "WHATSAPP-BAILEYS",
                    "webhookUrl": self.webhook_url,
                    "webhookByEvents": True,
                    "webhookBase64": False,
                    "chatwootAccountId": None,
                    "chatwootToken": None,
                    "chatwootUrl": None,
                    "chatwootSignMsg": False,
                    "chatwootReopenConversation": False,
                    "chatwootConversationPending": False
                }
                
                response = await client.post(
                    f"{self.api_url}/instance/create",
                    json=payload,
                    headers={"apikey": self.api_key}
                )
                
                if response.status_code in [200, 201]:
                    result = response.json()
                    logger.info(f"✅ Instância {instance_name} criada com sucesso")
                    return {"success": True, "data": result}
                else:
                    logger.error(f"❌ Erro ao criar instância: {response.status_code} - {response.text}")
                    return {"success": False, "error": f"HTTP {response.status_code}: {response.text}"}
                    
        except Exception as e:
            logger.error(f"❌ Exceção ao criar instância: {e}")
            return {"success": False, "error": str(e)}
    
    async def get_qr_code(self, instance_name: str) -> Dict[str, Any]:
        """Obtém QR Code da instância"""
        try:
            async with httpx.AsyncClient(timeout=30.0) as client:
                response = await client.get(
                    f"{self.api_url}/instance/connect/{instance_name}",
                    headers={"apikey": self.api_key}
                )
                
                if response.status_code == 200:
                    result = response.json()
                    return {"success": True, "data": result}
                else:
                    return {"success": False, "error": f"HTTP {response.status_code}: {response.text}"}
                    
        except Exception as e:
            return {"success": False, "error": str(e)}
    
    async def get_instance_status(self, instance_name: str) -> Dict[str, Any]:
        """Verifica status de uma instância"""
        try:
            async with httpx.AsyncClient(timeout=15.0) as client:
                response = await client.get(
                    f"{self.api_url}/instance/fetchInstances",
                    headers={"apikey": self.api_key}
                )
                
                if response.status_code == 200:
                    instances = response.json()
                    for instance in instances:
                        if instance.get("name") == instance_name:
                            return {
                                "success": True,
                                "instance_name": instance_name,
                                "status": instance.get("connectionStatus", "unknown"),
                                "state": instance.get("state", "unknown"),
                                "data": instance
                            }
                    
                    return {
                        "success": False,
                        "error": f"Instância {instance_name} não encontrada"
                    }
                else:
                    return {"success": False, "error": f"HTTP {response.status_code}: {response.text}"}
                    
        except Exception as e:
            return {"success": False, "error": str(e)}
    
    async def list_instances(self) -> Dict[str, Any]:
        """Lista todas as instâncias"""
        try:
            async with httpx.AsyncClient(timeout=15.0) as client:
                response = await client.get(
                    f"{self.api_url}/instance/fetchInstances",
                    headers={"apikey": self.api_key}
                )
                
                if response.status_code == 200:
                    instances = response.json()
                    return {"success": True, "instances": instances, "count": len(instances)}
                else:
                    return {"success": False, "error": f"HTTP {response.status_code}: {response.text}"}
                    
        except Exception as e:
            return {"success": False, "error": str(e)}

    def get_debug_info(self) -> Dict[str, Any]:
        """Retorna informações de debug da configuração"""
        return {
            "api_url": self.api_url,
            "webhook_url": self.webhook_url,
            "api_key_set": bool(self.api_key),
            "api_key_preview": f"{self.api_key[:8]}..." if self.api_key else "Não configurada"
        }

# Instância global
evolution_helper = EvolutionAPIHelper() 