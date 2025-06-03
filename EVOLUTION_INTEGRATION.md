# 🤖 AutoCred + Evolution API - Agentes IA Vendedores

## 📋 **Visão Geral**

Esta integração permite criar **agentes IA vendedores automáticos** no WhatsApp usando a **Evolution API**. O sistema oferece:

- ✅ **Conexão via QR Code** - Conecte números WhatsApp facilmente
- ✅ **Agentes IA Inteligentes** - GPT-4 personalizado para vendas
- ✅ **Multi-Instâncias** - Vários agentes simultâneos
- ✅ **Dashboard Completo** - Controle total das conversas
- ✅ **Lead Scoring** - Qualificação automática de prospects
- ✅ **Integração Nativa** - Sincronizado com seu CRM AutoCred

---

## 🚀 **Como Implementar**

### **1. Pré-requisitos**

Você já deve ter:
- ✅ **Evolution API** rodando (sua instalação atual)
- ✅ **AutoCred** funcionando
- ✅ **Chave OpenAI** (para os agentes IA)

### **2. Configuração**

#### **A) Configure as Credenciais**

Crie um arquivo `.env` na raiz do projeto:

```bash
# Evolution API Configuration
EVOLUTION_URL=http://localhost:8080
EVOLUTION_TOKEN=seu_token_global_da_evolution

# OpenAI Configuration  
OPENAI_API_KEY=sk-sua_chave_openai_aqui

# Webhook Configuration (opcional)
WEBHOOK_BASE_URL=http://localhost:8000
```

#### **B) Verifique a Configuração**

```bash
cd backend_autocred
python config_evolution.py
```

Deve mostrar:
```
🔧 Configuração Evolution API + AutoCred
==================================================
Evolution URL: http://localhost:8080
Token configurado: ✅ Sim
OpenAI configurada: ✅ Sim
Sistema configurado: ✅ Sim
```

### **3. Inicie o Sistema**

#### **Backend (Terminal 1):**
```bash
cd backend_autocred
python main_standalone.py
```

#### **Frontend (Terminal 2):**
```bash
cd frontend_bolt
npm run dev
```

### **4. Teste a Integração**

```bash
python test_evolution_integration.py
```

---

## 🎯 **Como Usar**

### **1. Acesse o Dashboard**
- Abra: `http://localhost:5177/agents-whatsapp`
- Login: `admin@autocred.com` / `admin123`

### **2. Crie um Agente**
1. Clique em **"Nova Instância"**
2. Digite o nome: `agente-vendas-1`
3. Escolha o agente: **"Agente Consultivo"**
4. Clique em **"Criar"**

### **3. Conecte o WhatsApp**
1. Clique em **"QR Code"** na instância criada
2. Escaneie com seu WhatsApp Business
3. Aguarde o status mudar para **"Conectado"**

### **4. Teste o Agente**
1. Envie uma mensagem para o número conectado
2. O agente IA responderá automaticamente
3. Acompanhe as conversas no dashboard

---

## 🤖 **Personalidades dos Agentes**

### **Agente Consultivo**
- 🎯 Foco em entender necessidades
- 📊 Faz perguntas qualificadoras
- 💼 Estilo profissional e educativo

### **Agente Vendedor**
- 🚀 Direto e persuasivo
- ⏰ Cria senso de urgência
- 💰 Foca nos benefícios financeiros

### **Agente Educativo**
- 📚 Explica conceitos financeiros
- 🧠 Didático e paciente
- ✨ Educa sobre crédito consignado

---

## 📊 **Funcionalidades do Dashboard**

### **Monitoramento em Tempo Real**
- 📱 Status das instâncias WhatsApp
- 💬 Conversas ativas
- 📈 Métricas de conversão
- 🎯 Lead scoring automático

### **Controle Total**
- ⏸️ Pausar/ativar agentes
- 🔄 Reconectar instâncias
- ⚙️ Configurar personalidades
- 📊 Ver histórico completo

### **Integração CRM**
- 🔄 Leads qualificados vão para o CRM
- 📋 Conversão automática para clientes
- 💰 Tracking de comissões
- 📈 Relatórios de performance

---

## 🔧 **API Endpoints**

### **Instâncias**
```http
GET    /api/evolution/instances          # Listar instâncias
POST   /api/evolution/instances          # Criar instância
GET    /api/evolution/instances/{id}/qrcode  # Obter QR Code
```

### **Agentes**
```http
GET    /api/evolution/agents             # Listar agentes IA
PUT    /api/evolution/agents/{id}        # Atualizar agente
```

### **Conversas**
```http
GET    /api/evolution/conversations      # Listar conversas
GET    /api/evolution/conversations/{id} # Ver conversa específica
```

### **Webhooks**
```http
POST   /api/evolution/webhook/{instance} # Receber eventos Evolution
```

---

## 🛠️ **Personalização Avançada**

### **Criar Novos Agentes**

```python
# Em evolution_integration.py
new_agent = AIAgent(
    id="agent_custom",
    name="Seu Agente Personalizado",
    personality="custom",
    prompt="Você é um especialista em..."
)

agents["agent_custom"] = new_agent
```

### **Configurar Triggers**

```python
# Triggers personalizados para ações
if "interessado" in message.lower():
    # Marcar como lead qualificado
    conversation.leadScore += 10
    
if "não tenho interesse" in message.lower():
    # Arquivar conversa
    conversation.status = "archived"
```

### **Integrar com CRM**

```python
# Auto-criar leads no AutoCred
if conversation.leadScore >= 70:
    create_lead_in_autocred(conversation.phone, conversation.messages)
```

---

## 📋 **Troubleshooting**

### **Problema: QR Code não aparece**
- ✅ Verifique se Evolution API está rodando
- ✅ Confirme o token no arquivo `.env`
- ✅ Veja logs do backend para erros

### **Problema: Agente não responde**
- ✅ Verifique chave OpenAI
- ✅ Confirme que instância está "conectada"
- ✅ Veja se webhook está configurado

### **Problema: Webhook não funciona**
- ✅ Confirme URL do webhook na Evolution
- ✅ Verifique se AutoCred está acessível
- ✅ Use ngrok se necessário para testes locais

### **Logs de Debug**
```bash
# Backend
cd backend_autocred
python main_standalone.py

# Veja logs em tempo real
tail -f logs/evolution.log
```

---

## 🚀 **Próximos Passos**

1. **Configure suas credenciais** (Evolution + OpenAI)
2. **Execute o teste** `python test_evolution_integration.py`
3. **Inicie o sistema** (backend + frontend)
4. **Crie seu primeiro agente** no dashboard
5. **Conecte via QR Code** e teste!

---

## 💡 **Dicas de Uso**

### **Para Máxima Eficiência**
- 🎯 Use personalidades diferentes para públicos distintos
- 📊 Monitore métricas de conversão regularmente
- 🔄 Ajuste prompts baseado no feedback
- 📱 Mantenha múltiplas instâncias ativas
- 💬 Revise conversas qualificadas manualmente

### **Boas Práticas**
- ✅ Sempre teste agentes antes de ativar
- ✅ Configure horários de funcionamento
- ✅ Use lead scoring para priorizar
- ✅ Mantenha prompts atualizados
- ✅ Faça backup das configurações

---

**🎉 Agora você tem agentes IA vendedores automáticos funcionando 24/7 no WhatsApp!**

Para suporte: [Documentação Evolution API](https://doc.evolution-api.com/) | [OpenAI API Docs](https://platform.openai.com/docs) 