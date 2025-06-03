# 📱 Integração WhatsApp - AutoCred + Evolution API

Este documento explica como configurar e usar a integração completa do WhatsApp no sistema AutoCred usando a Evolution API.

## 🎯 Visão Geral

A integração permite:
- ✅ Conectar múltiplas instâncias WhatsApp
- ✅ Enviar e receber mensagens
- ✅ Gerenciar conexões em tempo real
- ✅ Interface web completa
- ✅ Webhooks para eventos
- ✅ API REST completa

## 📋 Pré-requisitos

### 1. Docker Desktop
- Baixe e instale: https://www.docker.com/products/docker-desktop
- Certifique-se que está rodando

### 2. Evolution API
- Já incluída na pasta `C:\Users\jovem\Downloads\evolution`
- Configuração automática via script

### 3. AutoCred Backend
- Backend rodando na porta 8001
- Frontend rodando na porta 5179

## 🚀 Configuração Rápida

### Passo 1: Iniciar Evolution API
```bash
# Execute o script de inicialização
start_evolution.bat
```

### Passo 2: Iniciar Backend AutoCred
```bash
cd backend_autocred
python api_simple.py
```

### Passo 3: Iniciar Frontend
```bash
cd frontend_bolt
npm run dev
```

### Passo 4: Testar Integração
```bash
python test_evolution_integration.py
```

## 🔧 Configuração Detalhada

### Evolution API - Configurações

A Evolution API roda nos seguintes serviços:

| Serviço | Porta | Descrição |
|---------|-------|-----------|
| API | 8081 | API principal |
| PostgreSQL | 5432 | Banco de dados |
| Redis | 6380 | Cache |

**Credenciais padrão:**
- API Key: `B6D711FCDE4D4FD5936544120E713C37`
- DB User: `postgres`
- DB Password: `typebot`
- DB Name: `evolution_db`

### AutoCred Backend - Endpoints

#### Instâncias WhatsApp
```
POST   /api/evolution/instance/create          # Criar instância
GET    /api/evolution/instance/{name}/connect  # Conectar e obter QR
GET    /api/evolution/instance/{name}/status   # Status da conexão
DELETE /api/evolution/instance/{name}          # Deletar instância
GET    /api/evolution/instances                # Listar todas
```

#### Mensagens
```
POST   /api/evolution/send-message             # Enviar mensagem
POST   /api/evolution/webhook                  # Receber webhooks
```

#### Endpoints Legados (compatibilidade)
```
POST   /api/evolution/generate-qr              # Gerar QR Code
GET    /api/evolution/status/{agent_id}        # Status do agente
POST   /api/evolution/disconnect/{agent_id}    # Desconectar
GET    /api/evolution/connections              # Listar conexões
```

## 📱 Como Usar

### 1. Acessar Interface Web
1. Abra: http://localhost:5179
2. Faça login no sistema
3. Vá para "Agentes WhatsApp"

### 2. Criar Nova Instância
1. Clique em "Nova Instância"
2. Digite um nome (ex: "atendimento", "vendas")
3. Clique em "Criar"

### 3. Conectar WhatsApp
1. A instância será criada automaticamente
2. Um QR Code aparecerá na tela
3. Abra o WhatsApp no seu celular
4. Vá em "Dispositivos Conectados"
5. Escaneie o QR Code
6. Aguarde a conexão

### 4. Enviar Mensagens
1. Selecione uma instância conectada
2. Clique em "Nova Mensagem"
3. Digite o número (ex: 5511999999999)
4. Digite a mensagem
5. Clique em "Enviar"

## 🔍 Monitoramento

### Status das Instâncias
- **Conectado** (verde): WhatsApp ativo
- **Conectando** (amarelo): Aguardando QR Code
- **Desconectado** (vermelho): Sem conexão

### Logs do Backend
O backend mostra logs detalhados:
```
🔄 Debug - Criando instância Evolution: atendimento
✅ Debug - Instância criada com sucesso
📱 QR Code gerado
🔗 Instância conectada
💬 Mensagem enviada
```

### Logs da Evolution API
```bash
# Ver logs dos containers
cd C:\Users\jovem\Downloads\evolution
docker-compose logs -f
```

## 🛠️ Solução de Problemas

### Problema: Evolution API não inicia
**Solução:**
```bash
# Verificar se Docker está rodando
docker --version

# Parar containers existentes
cd C:\Users\jovem\Downloads\evolution
docker-compose down

# Iniciar novamente
docker-compose up -d

# Verificar status
docker-compose ps
```

### Problema: Backend não conecta na Evolution
**Verificações:**
1. Evolution API rodando na porta 8081
2. API Key correta: `B6D711FCDE4D4FD5936544120E713C37`
3. Firewall não bloqueando

### Problema: QR Code não aparece
**Soluções:**
1. Aguardar alguns segundos
2. Atualizar a página
3. Verificar logs do backend
4. Recriar a instância

### Problema: WhatsApp desconecta
**Causas comuns:**
1. Celular sem internet
2. WhatsApp fechado por muito tempo
3. Múltiplas conexões simultâneas

**Solução:**
1. Reconectar via QR Code
2. Verificar conexão do celular
3. Manter WhatsApp ativo

## 📊 Teste Automatizado

Execute o script de teste para validar tudo:

```bash
python test_evolution_integration.py
```

**Saída esperada:**
```
🧪 TESTE DE INTEGRAÇÃO EVOLUTION API + AUTOCRED
============================================================

✅ PASSOU - Backend AutoCred
✅ PASSOU - Evolution API  
✅ PASSOU - Criar Instância
✅ PASSOU - Conectar Instância
✅ PASSOU - Status Instância
✅ PASSOU - Enviar Mensagem
✅ PASSOU - Deletar Instância
✅ PASSOU - Listar Instâncias
✅ PASSOU - Endpoints Legados

📊 Resultado: 9/9 testes passaram
🎉 Todos os testes passaram! Integração funcionando perfeitamente.
```

## 🔐 Segurança

### API Key
- Mantenha a API Key segura
- Não compartilhe em repositórios públicos
- Considere usar variáveis de ambiente

### Webhooks
- URLs de webhook configuradas automaticamente
- Validação de origem implementada
- Logs de segurança ativos

### Dados
- Mensagens não são armazenadas por padrão
- Configuração de retenção disponível
- Backup automático do PostgreSQL

## 📈 Monitoramento Avançado

### Métricas Disponíveis
- Total de instâncias
- Instâncias conectadas/desconectadas
- Mensagens enviadas/recebidas
- Taxa de sucesso de conexão

### Logs Estruturados
```json
{
  "timestamp": "2025-06-02T17:34:42.885231",
  "level": "INFO", 
  "message": "Instância criada com sucesso",
  "instance": "atendimento",
  "status": "created"
}
```

## 🚀 Próximos Passos

### Funcionalidades Futuras
- [ ] Chatbots com IA
- [ ] Templates de mensagem
- [ ] Agendamento de mensagens
- [ ] Relatórios avançados
- [ ] Integração com CRM
- [ ] Múltiplos usuários

### Melhorias Planejadas
- [ ] Interface mobile
- [ ] Notificações push
- [ ] Backup automático
- [ ] Monitoramento 24/7
- [ ] API rate limiting

## 📞 Suporte

### Documentação
- Evolution API: https://doc.evolution-api.com/
- AutoCred: Documentação interna

### Logs Importantes
```bash
# Backend AutoCred
cd backend_autocred
python api_simple.py

# Evolution API
cd C:\Users\jovem\Downloads\evolution
docker-compose logs -f api

# Frontend
cd frontend_bolt
npm run dev
```

### Contatos
- Suporte técnico: [Interno]
- Documentação: Este arquivo
- Issues: Reportar problemas internamente

---

## ✅ Checklist de Configuração

- [ ] Docker Desktop instalado e rodando
- [ ] Evolution API iniciada (`start_evolution.bat`)
- [ ] Backend AutoCred rodando (porta 8001)
- [ ] Frontend rodando (porta 5179)
- [ ] Teste de integração passou
- [ ] Primeira instância criada
- [ ] QR Code escaneado
- [ ] WhatsApp conectado
- [ ] Mensagem de teste enviada

**🎉 Parabéns! Sua integração WhatsApp está funcionando!** 