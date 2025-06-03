# 🤖 Sistema de Agentes IA Personalizados AutoCred

## Visão Geral

O Sistema de Agentes IA Personalizados permite criar, gerenciar e conversar com agentes especializados integrados com a API do SuperAgentes. Esta solução oferece total personalização de comportamento e permite criar agentes específicos para diferentes necessidades do negócio.

## ✨ Funcionalidades Implementadas

### 🎭 Personalidades Predefinidas
- **Vendedor Especialista**: Foco em conversão e fechamento de negócios
- **Consultor Educativo**: Especialista em educação financeira
- **Atendente de Suporte**: Resolução de problemas pós-venda
- **Especialista em Produtos**: Simulações e análises técnicas

### 📄 Templates de Agentes
- **Agente de Vendas WhatsApp**: Otimizado para conversas via WhatsApp
- **Agente de Suporte a Clientes**: Atendimento pós-venda
- **Agente Educador Financeiro**: Focado em educação financeira

### 🤖 Gestão Completa de Agentes
- ✅ Criação de agentes personalizados
- ✅ Configuração de prompts específicos
- ✅ Ativação/desativação de agentes
- ✅ Monitoramento de performance
- ✅ Chat em tempo real
- ✅ Estatísticas detalhadas

## 🏗️ Arquitetura

### Backend (FastAPI)
```
backend_autocred/
├── superagentes_manager.py     # Sistema principal de agentes
├── main_standalone.py          # Integração no backend principal
└── config_evolution.py         # Configurações (reutilizado)
```

### Frontend (React/TypeScript)
```
frontend_bolt/src/
├── pages/agents/
│   └── CustomAgents.tsx        # Interface principal
├── lib/api.ts                  # Hooks e tipos para API
└── App.tsx                     # Roteamento atualizado
```

## 🔧 Configuração

### Variáveis de Ambiente
```bash
# API SuperAgentes
SUPERAGENTES_API_KEY=10b12f32-ba48-4765-a27f-166d106c4761
SUPERAGENTES_BASE_URL=https://dash.superagentes.ai/api

# Configurações opcionais
OPENAI_API_KEY=sua_chave_openai  # Para recursos adicionais
```

### Instalação de Dependências
```bash
# Backend
pip install httpx pydantic fastapi

# Frontend (já instalado)
npm install lucide-react @tanstack/react-query
```

## 🚀 Como Usar

### 1. Acesso ao Sistema
- Navegue para `/agents-custom` no painel AutoCred
- Interface com 3 abas: Agentes, Templates, Personalidades

### 2. Criar Agente Personalizado
```typescript
// Exemplo de criação via interface
const agentData = {
  name: "Consultor Premium",
  description: "Especialista em clientes VIP",
  personality_id: "vendedor_especialista",
  custom_prompt: "Você atende apenas clientes premium...",
  configuration: {
    max_response_length: 300,
    use_emojis: true
  }
}
```

### 3. Chat com Agente
- Clique em "Chat" no card do agente
- Interface de conversa em tempo real
- Histórico de mensagens mantido durante a sessão

### 4. Monitoramento
- Estatísticas de conversas e performance
- Métricas de satisfação
- Tempo médio de resposta

## 📊 API Endpoints

### Gestão de Agentes
```bash
GET    /api/agents/                    # Listar agentes
POST   /api/agents/create              # Criar agente
GET    /api/agents/{id}                # Obter agente específico
PUT    /api/agents/{id}                # Atualizar agente
DELETE /api/agents/{id}                # Remover agente
```

### Chat e Interação
```bash
POST   /api/agents/{id}/chat           # Conversar com agente
GET    /api/agents/{id}/stats          # Estatísticas do agente
```

### Templates e Personalidades
```bash
GET    /api/agents/personalities       # Listar personalidades
GET    /api/agents/templates           # Listar templates
POST   /api/agents/template/{id}       # Criar do template
```

## 🔒 Integração com SuperAgentes

### Fluxo de Criação
1. **Validação**: Verifica personalidade e dados
2. **SuperAgentes**: Cria agente na plataforma externa
3. **Armazenamento**: Salva referência local
4. **Configuração**: Aplica configurações específicas

### Formato de Prompt
```python
prompt_template = """
Você é um {tipo} da AutoCred.
Sua missão é {missao}.

PERFIL: {profile}
CONTEXTO: {context}

DIRETRIZES:
- {diretriz1}
- {diretriz2}

MENSAGEM DO CLIENTE: {message}
"""
```

## 🧪 Testes

### Executar Suite de Testes
```bash
python test_custom_agents.py
```

### Testes Inclusos
- ✅ Listagem de personalidades
- ✅ Listagem de templates
- ✅ Criação de agentes
- ✅ Chat funcional
- ✅ Estatísticas
- ✅ Criação via template
- ✅ Atualização de agentes

## 📈 Métricas e Performance

### Estatísticas por Agente
- **Total de Conversas**: Número de interações
- **Taxa de Conversão**: Leads convertidos em clientes
- **Tempo de Resposta**: Média de velocidade
- **Satisfação**: Score baseado no feedback

### Monitoramento Global
- Agentes ativos vs inativos
- Volume de mensagens por período
- Performance comparativa entre agentes

## 🔄 Integração com CRM

### Contexto Automático
```python
context_data = {
    "lead_info": lead_data,
    "client_history": client_history,
    "product_catalog": products,
    "current_promotions": promotions
}
```

### Workflows Automatizados
- Lead scoring baseado em interações
- Escalação automática para humanos
- Integração com sistema de notificações

## 🛠️ Personalização Avançada

### Configurações por Agente
```python
configuration = {
    "max_response_length": 500,
    "use_emojis": True,
    "response_style": "conversacional",
    "follow_up_enabled": True,
    "escalation_keywords": ["gerente", "reclamação"],
    "knowledge_base_access": True
}
```

### Prompts Dinâmicos
- Variáveis contextuais
- Histórico de conversa
- Dados do lead/cliente
- Informações de produtos

## 🚨 Troubleshooting

### Problemas Comuns

**Agente não responde**
```bash
# Verificar conexão SuperAgentes
curl -H "Authorization: Bearer TOKEN" \
  https://dash.superagentes.ai/api/agents/test/query
```

**Interface não carrega**
```bash
# Verificar backend
curl http://localhost:8000/api/agents/personalities
```

**Erro de criação**
- Verificar se personalidade existe
- Validar formato do prompt
- Confirmar configurações da API

### Logs e Debug
```python
# Ativar logs detalhados
import logging
logging.basicConfig(level=logging.DEBUG)
```

## 🔮 Roadmap

### Próximas Funcionalidades
- [ ] Treinamento com dados históricos
- [ ] Integração com WhatsApp Business
- [ ] Analytics avançados
- [ ] A/B testing de prompts
- [ ] Múltiplos modelos de IA
- [ ] Backup/restauração de agentes

### Melhorias Planejadas
- [ ] Interface de design de prompts
- [ ] Templates personalizáveis
- [ ] Integração com calendário
- [ ] Webhooks para eventos
- [ ] API pública para integrações

## 📝 Exemplos de Uso

### Agente de Vendas Agressivo
```python
agent = await create_agent(
    name="Vendedor Top",
    personality="vendedor_especialista",
    prompt="Você tem meta de 50 vendas/mês. Seja persuasivo mas ético...",
    config={"follow_up_enabled": True}
)
```

### Agente Educacional
```python
agent = await create_agent(
    name="Professor Financeiro",
    personality="consultor_educativo", 
    prompt="Explique conceitos complexos de forma simples...",
    config={"use_examples": True, "max_length": 600}
)
```

## 🤝 Contribuição

### Como Contribuir
1. Fork do repositório
2. Criar branch para feature
3. Implementar testes
4. Documentar mudanças
5. Pull request

### Padrões de Código
- Type hints obrigatórios
- Documentação em português
- Testes para novas funcionalidades
- Logs estruturados

## 📞 Suporte

Para dúvidas ou problemas:
- 📧 Email: suporte@autocred.com.br
- 💬 Slack: #agentes-ia
- 📖 Wiki: Documentação interna

---

**Versão**: 1.0.0  
**Última atualização**: Dezembro 2024  
**Status**: ✅ Produção Ready 