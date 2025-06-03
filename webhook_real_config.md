# 🚀 CONFIGURAÇÃO PARA QR CODES REAIS - WhatsApp

## 🎯 O QUE FALTA PARA CONEXÕES REAIS

### **1. WEBHOOK EVOLUTION API - CONFIGURAÇÃO REAL**

#### **Problema Atual:**
- QR Code vem via webhook da Evolution API
- Nosso webhook está configurado mas não está capturando corretamente
- Evolution API gera QR Code real mas não chegando ao nosso sistema

#### **Solução - Configurar Webhook Corretamente:**

**a) Endpoint Evolution API:**
```bash
POST http://localhost:8081/webhook/set/INSTANCE_NAME
```

**b) Payload Correto:**
```json
{
  "url": "http://localhost:8001/webhook/evolution",
  "webhook_by_events": false,
  "webhook_base64": true,  // IMPORTANTE: QR Code em base64
  "events": [
    "QRCODE_UPDATED",
    "CONNECTION_UPDATE",
    "APPLICATION_STARTUP"
  ]
}
```

**c) Backend - Webhook Aprimorado:**
```python
@app.post("/webhook/evolution")
async def evolution_webhook(payload: dict):
    """Captura QR Code REAL da Evolution API"""
    event = payload.get("event", "")
    
    if event == "QRCODE_UPDATED":
        qr_base64 = payload.get("data", {}).get("qrcode", "")
        instance_name = payload.get("instance", "")
        
        # Encontrar agente pela instância
        agent_id = find_agent_by_instance(instance_name)
        
        if agent_id and qr_base64:
            # Armazenar QR Code REAL
            qr_codes_cache[agent_id] = {
                "qrcode": f"data:image/png;base64,{qr_base64}",
                "timestamp": datetime.now().isoformat(),
                "real": True  # Marca como QR Code real
            }
            print(f"🎉 QR CODE REAL recebido para agente {agent_id}")
```

### **2. TESTE COM NGROK (Para Webhook Externo)**

Se o webhook local não funcionar, usar ngrok:

```bash
# Instalar ngrok
npm install -g ngrok

# Expor porta 8001
ngrok http 8001

# Usar URL gerada no webhook:
# https://abc123.ngrok.io/webhook/evolution
```

### **3. CONFIGURAÇÃO CORRETA DA EVOLUTION API**

**Arquivo docker-compose.yml da Evolution API:**
```yaml
services:
  evolution-api:
    environment:
      - WEBHOOK_GLOBAL_URL=http://localhost:8001/webhook/evolution
      - WEBHOOK_GLOBAL_ENABLED=true
      - WEBHOOK_EVENTS_QRCODE_UPDATED=true
      - WEBHOOK_EVENTS_CONNECTION_UPDATE=true
```

---

## 🚀 **PARA WHATSAPP BUSINESS API (Mais Robusto)**

### **1. Meta Business Manager**
```bash
✅ Criar conta no Meta Business Manager
✅ Verificar empresa (documentos, etc)
✅ Aguardar aprovação (pode levar dias/semanas)
```

### **2. Facebook Developers**
```bash
✅ Criar app no Facebook Developers
✅ Adicionar WhatsApp Business API
✅ Configurar número WhatsApp Business
✅ Obter Number ID
```

### **3. Token Permanente**
```bash
✅ Gerar token de acesso permanente
✅ Configurar permissões necessárias
✅ Testar autenticação
```

### **4. Configuração no AutoCred**
```python
# Criar instância WhatsApp Business
{
    "instanceName": "business_agent_123",
    "token": "EAAGm0PX4ZCpsBA...",  // Token do Meta
    "number": "1234567890",         // Number ID
    "businessId": "9876543210",     // Business ID
    "qrcode": false,               // Não usa QR Code
    "integration": "WHATSAPP-BUSINESS"
}
```

---

## ⚡ **SOLUÇÃO RÁPIDA - WEBHOOK REAL**

### **Teste Imediato:**

1. **Verificar se webhook está sendo chamado:**
```python
@app.post("/webhook/evolution")
async def evolution_webhook(payload: dict):
    print(f"🔔 WEBHOOK RECEBIDO: {payload}")  # Debug
    # ... resto do código
```

2. **Forçar configuração de webhook:**
```bash
curl -X POST http://localhost:8081/webhook/set/agent_test \
-H "apikey: 429683C4C977415CAAFCCE10F7D57E11" \
-H "Content-Type: application/json" \
-d '{
  "url": "http://localhost:8001/webhook/evolution",
  "webhook_by_events": false,
  "webhook_base64": true,
  "events": ["QRCODE_UPDATED", "CONNECTION_UPDATE"]
}'
```

3. **Verificar logs da Evolution API:**
```bash
docker logs evolution-api-container
```

---

## 🎯 **RESUMO - O QUE FALTA**

| Componente | Status Atual | Para QR Real |
|------------|-------------|--------------|
| **Evolution API** | ✅ Funcionando | ✅ OK |
| **Instância** | ✅ Criada | ✅ OK |
| **Webhook Endpoint** | ✅ Existe | ❌ Não recebe dados |
| **Webhook Config** | ❌ Incompleta | ❌ Precisa configurar |
| **QR Capture** | ❌ Simulado | ❌ Precisa implementar |

### **PRÓXIMO PASSO:**
1. **Configurar webhook corretamente** (30 min)
2. **Testar captura de QR Code real** (15 min)
3. **Ajustar frontend se necessário** (15 min)

**TOTAL: 1 hora para QR Codes 100% reais!** ⚡ 