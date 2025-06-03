# 🚀 AutoCred CRM - Sistema de Gestão Completo

## 📋 Visão Geral

O **AutoCred** é um sistema CRM completo com integração WhatsApp, SMS e IA Agents, desenvolvido para empresas de crédito e financiamento. O sistema oferece uma solução completa para gestão de leads, clientes, contratos e comunicação multicanal.

### 🌟 Funcionalidades Principais

- **💼 CRM Completo**: Gestão de leads, clientes e contratos
- **📱 WhatsApp Integration**: Via Evolution API para comunicação automatizada
- **📧 SMS Marketing**: Envio de campanhas de SMS em massa
- **🤖 IA Agents**: Agentes inteligentes para atendimento automatizado
- **📊 Dashboard Analytics**: Métricas e relatórios em tempo real
- **🔐 Sistema de Autenticação**: Login seguro com tokens JWT
- **🌐 Interface Moderna**: Frontend React com TypeScript

## 🛠️ Tecnologias Utilizadas

### Backend
- **FastAPI** - Framework Python para APIs
- **SQLite** - Banco de dados
- **Pydantic** - Validação de dados
- **JWT** - Autenticação
- **Uvicorn** - Servidor ASGI

### Frontend
- **React** - Framework JavaScript
- **TypeScript** - Tipagem estática
- **Vite** - Build tool
- **Tailwind CSS** - Framework CSS
- **React Query** - Estado e cache

### Integrações
- **Evolution API** - WhatsApp Business
- **Docker** - Containerização
- **Redis** - Cache e sessões
- **PostgreSQL** - Banco para Evolution API

## 📦 Instalação

### Pré-requisitos

- Python 3.8+ 
- Node.js 16+
- Docker e Docker Compose
- Git

### 1. Clone o Repositório

```bash
git clone https://github.com/seu-usuario/autocred-system.git
cd autocred-system
```

### 2. Configuração do Backend

```bash
# Criar ambiente virtual
python -m venv .venv

# Ativar ambiente virtual
# Windows
.venv\Scripts\activate
# Linux/Mac
source .venv/bin/activate

# Instalar dependências
pip install -r requirements.txt

# Configurar banco de dados
python backend_autocred/fix_database_schema.py
```

### 3. Configuração do Frontend

```bash
cd frontend_bolt
npm install
cd ..
```

### 4. Configuração da Evolution API (WhatsApp)

```bash
# Baixar Evolution API
git clone https://github.com/EvolutionAPI/evolution-api.git evolution
cd evolution

# Configurar e iniciar
docker-compose up -d
cd ..
```

## 🚀 Uso do Sistema

### Método Rápido - Script Automatizado

```bash
# Iniciar todo o sistema com um comando
python start_system.py
```

### Método Manual

#### 1. Iniciar Backend
```bash
cd backend_autocred
python api_simple.py
```

#### 2. Iniciar Frontend
```bash
cd frontend_bolt
npm run dev
```

#### 3. Verificar Evolution API
```bash
docker ps
```

### 📱 Acesso ao Sistema

- **Frontend**: http://localhost:5180
- **Backend API**: http://localhost:8001
- **Evolution API**: http://localhost:8081

### 🔐 Credenciais de Acesso

- **Email**: admin@autocred.com
- **Senha**: admin123

## 📊 Monitoramento

### Verificar Status do Sistema

```bash
# Monitor completo do sistema
python system_monitor.py
```

### Endpoints da API

```bash
# Health check
curl http://localhost:8001/api/health

# Listar clientes
curl -H "Authorization: Bearer <token>" http://localhost:8001/api/clients

# Listar leads
curl -H "Authorization: Bearer <token>" http://localhost:8001/api/leads
```

## 🔧 Configuração

### Variáveis de Ambiente

```bash
# Porta do backend
BACKEND_PORT=8001

# Porta do frontend  
FRONTEND_PORT=5180

# Chave da Evolution API
EVOLUTION_API_KEY=429683C4C977415CAAFCCE10F7D57E11
```

### Configuração de SMS

Edite `backend_autocred/api_simple.py` para configurar seu provedor de SMS:

```python
SMS_API_KEY = "sua_chave_aqui"
SMS_API_URL = "https://api.seuprovedorsms.com"
```

## 📱 Funcionalidades por Módulo

### 1. Gestão de Leads
- ✅ Criação de leads
- ✅ Conversão para clientes
- ✅ Acompanhamento de status
- ✅ Histórico de atividades

### 2. Gestão de Clientes
- ✅ Cadastro completo
- ✅ Histórico de contratos
- ✅ Comunicação integrada
- ✅ Análise de performance

### 3. WhatsApp Integration
- ✅ Múltiplas instâncias
- ✅ QR Code para conexão
- ✅ Envio de mensagens
- ✅ Webhooks para recebimento

### 4. SMS Marketing
- ✅ Campanhas em massa
- ✅ Upload de contatos via CSV
- ✅ Relatórios de entrega
- ✅ Agendamento de envios

### 5. IA Agents
- ✅ Agentes personalizáveis
- ✅ Templates pré-configurados
- ✅ Chat interativo
- ✅ Métricas de performance

## 🔍 Troubleshooting

### Problemas Comuns

#### 1. Erro de Porta em Uso
```bash
# Verificar processos na porta
netstat -ano | findstr :8001

# Parar processo
taskkill /PID <PID> /F
```

#### 2. Evolution API Não Conecta
```bash
# Verificar containers Docker
docker ps

# Reiniciar containers
docker-compose restart
```

#### 3. Banco de Dados Corrupto
```bash
# Recriar banco
python backend_autocred/fix_database_schema.py
```

#### 4. Frontend Não Carrega
```bash
# Limpar cache e reinstalar
cd frontend_bolt
rm -rf node_modules package-lock.json
npm install
```

## 📈 Performance

### Otimizações Implementadas

- ✅ Cache Redis para sessões
- ✅ Paginação automática
- ✅ Lazy loading no frontend
- ✅ Compressão de respostas
- ✅ Connection pooling

### Monitoramento de Performance

```bash
# Verificar uso de memória
python -c "import psutil; print(f'RAM: {psutil.virtual_memory().percent}%')"

# Verificar logs do sistema
tail -f logs/autocred.log
```

## 🛡️ Segurança

### Medidas Implementadas

- ✅ Autenticação JWT
- ✅ Validação de dados com Pydantic
- ✅ CORS configurado
- ✅ Rate limiting
- ✅ Sanitização de inputs

### Boas Práticas

```bash
# Atualizar dependências regularmente
pip install --upgrade -r requirements.txt

# Verificar vulnerabilidades
safety check

# Backup do banco
cp autocred.db backup_$(date +%Y%m%d).db
```

## 📚 API Documentation

### Autenticação

```bash
POST /api/token
Content-Type: application/x-www-form-urlencoded

username=admin@autocred.com&password=admin123
```

### Endpoints Principais

```bash
# Clientes
GET    /api/clients
POST   /api/clients
PATCH  /api/clients/{id}/status
DELETE /api/clients/{id}

# Leads
GET    /api/leads
POST   /api/leads
POST   /api/leads/finalize-sale

# WhatsApp
POST   /api/evolution/instance/create
GET    /api/evolution/instance/{name}/status
POST   /api/evolution/message/send

# SMS
GET    /api/sms/balance
POST   /api/sms/create-campaign
POST   /api/sms/send-campaign/{id}
```

## 🤝 Contribuição

### Como Contribuir

1. Fork o projeto
2. Crie uma branch para sua feature (`git checkout -b feature/AmazingFeature`)
3. Commit suas mudanças (`git commit -m 'Add some AmazingFeature'`)
4. Push para a branch (`git push origin feature/AmazingFeature`)
5. Abra um Pull Request

### Guidelines

- Siga os padrões de código existentes
- Adicione testes para novas funcionalidades
- Atualize a documentação
- Teste em diferentes ambientes

## 📄 Licença

Este projeto está licenciado sob a Licença MIT - veja o arquivo [LICENSE](LICENSE) para detalhes.

## 📞 Suporte

### Canais de Suporte

- **Email**: suporte@autocred.com
- **WhatsApp**: +55 11 99999-9999
- **Discord**: https://discord.gg/autocred
- **GitHub Issues**: https://github.com/seu-usuario/autocred-system/issues

### Status dos Serviços

Verifique o status em tempo real: http://status.autocred.com

---

## 🌟 Próximas Funcionalidades

- [ ] App Mobile React Native
- [ ] Integração com mais provedores SMS
- [ ] Dashboard com BI avançado
- [ ] Sistema de notificações push
- [ ] Integração com CRM externos
- [ ] Módulo financeiro completo

---

**Desenvolvido com ❤️ pela equipe AutoCred**

*Para mais informações, visite nossa [documentação completa](https://docs.autocred.com)* 