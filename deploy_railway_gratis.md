# 🚀 DEPLOY GRATUITO NO RAILWAY

## 🎯 **PLANO GRATUITO RAILWAY**

```bash
💰 Custo: R$ 0,00/mês  
📊 Recursos: 512MB RAM, 1GB storage
⏰ Limite: 500h/mês (≈ 16h/dia)
🌐 Domínio: seuapp.railway.app
🔧 SSL: Automático
📱 Deploy: GitHub automático
```

## 🛠️ **PASSO A PASSO - DEPLOY GRÁTIS**

### **1. Preparar Projeto para Railway**

```python
# requirements.txt
fastapi==0.104.1
uvicorn==0.24.0
python-multipart==0.0.6
requests==2.31.0
pydantic==2.5.0
python-jose==3.3.0
passlib==1.7.4
```

```python
# Procfile (Railway)
web: uvicorn api_simple:app --host 0.0.0.0 --port $PORT
```

```json
# railway.json
{
  "build": {
    "builder": "NIXPACKS"
  },
  "deploy": {
    "startCommand": "uvicorn api_simple:app --host 0.0.0.0 --port $PORT",
    "restartPolicyType": "ON_FAILURE"
  }
}
```

### **2. Modificar Backend para Railway**

```python
# backend_autocred/api_simple.py
import os

# Configuração Railway
PORT = int(os.getenv("PORT", 8001))
ENVIRONMENT = os.getenv("RAILWAY_ENVIRONMENT", "development")

# Configuração automática de webhook
def get_railway_url():
    """Detecta URL do Railway automaticamente"""
    if ENVIRONMENT == "production":
        # Railway fornece URL automática
        railway_url = os.getenv("RAILWAY_PUBLIC_DOMAIN")
        if railway_url:
            return f"https://{railway_url}"
    return "http://localhost:8001"

# Usar no uvicorn
if __name__ == "__main__":
    print(f"🚀 Iniciando AutoCred no Railway...")
    print(f"🌐 Porta: {PORT}")
    print(f"🔗 Webhook: {get_railway_url()}/webhook/evolution")
    uvicorn.run(app, host="0.0.0.0", port=PORT)
```

### **3. Deploy no Railway**

```bash
# 1. Criar conta Railway (grátis)
https://railway.app

# 2. Conectar GitHub
• Fork seu projeto no GitHub
• Conectar Railway ao repositório

# 3. Deploy automático
• Railway detecta Python automaticamente
• Deploy em ~3 minutos
• URL automática: https://seu-projeto.railway.app
```

### **4. Configurar Variáveis de Ambiente**

```bash
# No painel Railway:
ENVIRONMENT=production
EVOLUTION_API_KEY=429683C4C977415CAAFCCE10F7D57E11
EVOLUTION_API_URL=http://localhost:8081
```

## 🔧 **LIMITAÇÕES E SOLUÇÕES**

### **❌ PROBLEMA: Evolution API**
```bash
Railway grátis não suporta Docker bem
Evolution API precisa de Docker
```

### **✅ SOLUÇÃO: API Externa**
```bash
# Opção 1: Evolution API como serviço separado
• Usar Oracle Cloud Free (VM completa)
• Rodar só Evolution API lá
• Backend Railway conecta via HTTP

# Opção 2: Simulação para MVP
• Sistema funciona sem WhatsApp real
• QR Codes visuais funcionando
• Upgrade depois para real
```

### **❌ PROBLEMA: Webhook Dormindo**
```bash
Railway dorme após 15min inativo
Webhooks podem falhar
```

### **✅ SOLUÇÃO: Ping Service**
```bash
# Adicionar no backend
import schedule
import time
import requests

def keep_alive():
    """Mantém serviço ativo"""
    try:
        requests.get("https://seu-app.railway.app/api/health")
        print("🔄 Keep-alive ping")
    except:
        pass

schedule.every(10).minutes.do(keep_alive)
```

## 💰 **COMPARAÇÃO DE CUSTOS**

| Opção | Mês 1 | Mês 2-12 | Ano 1 | Limitações |
|-------|-------|----------|-------|------------|
| **Railway Free** | R$ 0 | R$ 0 | R$ 0 | 500h/mês, dorme |
| **Railway Pro** | R$ 25 | R$ 25 | R$ 300 | Sem limites |
| **VPS** | R$ 35 | R$ 35 | R$ 420 | Controle total |

## 🎯 **ESTRATÉGIA RECOMENDADA**

### **FASE 1: MVP Grátis (0-30 dias)**
```bash
✅ Backend: Railway grátis
✅ Frontend: Vercel grátis  
✅ QR Codes: Simulados/visuais
✅ Validar conceito
✅ Primeiros clientes
💰 Custo: R$ 0,00
```

### **FASE 2: Upgrade (30+ dias)**
```bash
✅ Backend: Railway Pro ou VPS
✅ Evolution API: VPS dedicado
✅ QR Codes: 100% reais
✅ WhatsApp funcionando
✅ Sistema profissional
💰 Custo: R$ 35-50/mês
```

## 🚀 **IMPLEMENTAÇÃO AGORA**

**Quer que eu:**

1. **Configure o projeto para Railway?**
2. **Faça o deploy gratuito agora?**
3. **Configure o webhook adaptativo?**
4. **Teste tudo funcionando?**

### **⏰ Timeline:**
```bash
Agora: Preparar código (30 min)
Agora: Deploy Railway (15 min)
Agora: Sistema online grátis! 🎉
```

**Resultado: Sistema rodando em https://autocred.railway.app em 1 hora!**

## ✅ **VANTAGENS DO RAILWAY**

```bash
✅ Deploy em minutos
✅ SSL automático
✅ GitHub integration
✅ Logs em tempo real
✅ Fácil de escalar
✅ Comunidade ativa
✅ Suporte Python nativo
```

**Quer começar com Railway grátis agora?** 🚀 