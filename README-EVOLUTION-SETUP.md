# 🚀 EVOLUTION API PRÓPRIA - RAILWAY SETUP

## 📋 PASSO A PASSO COMPLETO

### 1️⃣ **CRIAR NOVO REPOSITÓRIO NO GITHUB**
```bash
# Criar repositório: autocred-evolution-api
# Fazer upload dos arquivos:
- Dockerfile.evolution
- evolution-config.yml  
- railway-evolution.toml
```

### 2️⃣ **CRIAR NOVO PROJETO NO RAILWAY**
1. Acesse https://railway.app
2. Clique em "New Project"
3. Selecione "Deploy from GitHub repo"
4. Escolha `autocred-evolution-api`
5. Railway vai detectar o Dockerfile automaticamente

### 3️⃣ **CONFIGURAR VARIÁVEIS DE AMBIENTE**
```bash
EVOLUTION_API_KEY=autocred-2024-super-secret-key
JWT_SECRET=autocred-jwt-ultra-secret-2024  
INSTANCE_TOKEN=autocred-instance-token-2024
WEBHOOK_URL=https://autocred-evolution.up.railway.app/webhook/whatsapp
NODE_ENV=production
PORT=8080
```

### 4️⃣ **OPCIONAL: ADICIONAR BANCO DE DADOS**
- PostgreSQL (para persistir sessões)
- Redis (para performance)

### 5️⃣ **TESTAR A API**
```bash
# URL da sua Evolution API:
https://[SEU-DOMINIO-RAILWAY].up.railway.app

# Teste de saúde:
GET https://[SEU-DOMINIO-RAILWAY].up.railway.app/manager/health

# Criar instância WhatsApp:
POST https://[SEU-DOMINIO-RAILWAY].up.railway.app/instance/create
{
  "instanceName": "autocred-client-1",
  "token": "autocred-instance-token-2024"
}
```

## 🎯 **INTEGRAÇÃO COM AUTOCRED**

Depois de deployed, vou atualizar o AutoCred para usar sua Evolution API própria:

```python
# No app_real.py
EVOLUTION_API_URL = "https://[SEU-DOMINIO-RAILWAY].up.railway.app"
EVOLUTION_API_KEY = "autocred-2024-super-secret-key"
```

## 💰 **CUSTOS ESTIMADOS**

**Railway Pro:** $20/mês (que você já tem)
**Evolution API:** $0 adicional (dentro do seu plano)
**Total:** $0 adicional! 🎉

## ✅ **VANTAGENS**

✅ Evolution API 100% sua
✅ Clientes WhatsApp ilimitados  
✅ Sem custo por conexão
✅ Controle total
✅ Integração perfeita com AutoCred

## 🚀 **PRÓXIMOS PASSOS**

1. Você cria o repositório no GitHub
2. Eu ajudo com o deploy no Railway
3. Configuramos as variáveis
4. Testamos a API funcionando
5. Integramos com o AutoCred
6. **WHATSAPP PRÓPRIO FUNCIONANDO!** 🎯 