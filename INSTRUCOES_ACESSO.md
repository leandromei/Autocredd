# 🚀 AutoCred - Instruções de Acesso e Teste

## ✅ Status dos Serviços

O sistema está configurado e rodando localmente com os seguintes serviços:

### 🔧 Backend (FastAPI)
- **URL**: http://localhost:8000
- **Documentação da API**: http://localhost:8000/docs
- **Status**: ✅ Online

### 🎨 Frontend (React + Vite)  
- **URL**: http://localhost:5173
- **Status**: ✅ Online

## 🔑 Credenciais de Acesso

Para acessar o sistema, use as seguintes credenciais:

```
📧 Email: admin@autocred.com
🔑 Senha: admin123
```

## 🌐 Como Acessar e Testar

### 1. Acesso ao Frontend
1. Abra seu navegador
2. Acesse: **http://localhost:5173**
3. Faça login com as credenciais acima
4. Explore as funcionalidades disponíveis

### 2. Páginas e Funcionalidades Disponíveis

#### 📊 Dashboard
- Visão geral do sistema
- Métricas e estatísticas
- Acesso rápido às principais funcionalidades

#### 👥 Clientes
- Cadastro de novos clientes
- Listagem e pesquisa
- Edição e gerenciamento

#### 📋 Propostas
- Criação de propostas
- Acompanhamento de status
- Gestão do pipeline de vendas

#### 💬 Conversar com IA ⭐ **FUNCIONALIDADE DESTAQUE**
A seção "Conversar com IA" está localizada no menu lateral, logo abaixo do Dashboard, com um ícone de robô 🤖.

**Assistentes disponíveis:**
1. **Emilia - Vendas e Financeiro** 🤖 **CHAT REAL INTEGRADO**
   - **URL Direta**: http://localhost:5173/ai-chat/emilia
   - ✅ **Chat real com IA funcional** - Powered by SuperAgentes
   - Especialista em vendas e questões financeiras
   - Interface de chat totalmente funcional
   - Respostas inteligentes em tempo real

2. **Elias - Operacional e Gestão** 
   - **URL Direta**: http://localhost:5173/ai-chat/elias
   - Especialista em operações e gestão empresarial
   - Comandos especializados para otimização de processos
   - Interface de demonstração (chat simulado)

#### 🔧 Funcionalidades Administrativas
- Gestão de usuários
- Configurações do sistema
- Relatórios e analytics

### 3. Testando a API Diretamente

Para desenvolvedores que queiram testar as APIs:

#### 📖 Documentação Interativa
- Acesse: **http://localhost:8000/docs**
- Interface Swagger para testar endpoints
- Documentação completa da API

#### 🔐 Autenticação na API
1. Use o endpoint `/api/token` para obter um token
2. Credenciais: 
   - `username`: admin@autocred.com
   - `password`: admin123

## 🛠️ Comandos Úteis

### Para Iniciar os Serviços
```bash
# Na raiz do projeto
.\run.bat dev
```

### Para Parar os Serviços
- Use `Ctrl+C` nos terminais onde os serviços estão rodando
- Ou feche as janelas do terminal

### Para Reinstalar Dependências
```bash
.\run.bat install
```

## 📝 Funcionalidades para Testar

### ✅ Básicas
- [ ] Login e logout
- [ ] Navegação entre páginas
- [ ] Responsividade do layout

### 👥 Gestão de Clientes
- [ ] Criar novo cliente
- [ ] Listar clientes
- [ ] Editar informações
- [ ] Pesquisar clientes

### 📋 Gestão de Propostas
- [ ] Criar proposta
- [ ] Visualizar propostas
- [ ] Atualizar status
- [ ] Filtros e pesquisa

### 🤖 IA Chat (Conversar com IA) ⭐
- [ ] Acessar menu "Conversar com IA" 
- [ ] **Testar chat REAL com Emilia** 🔥 **(Vendas/Financeiro)**
  - [ ] Fazer perguntas sobre vendas
  - [ ] Solicitar análises financeiras
  - [ ] Testar estratégias de conversão
  - [ ] Pedir cálculos de comissão
- [ ] Testar chat com Elias (Operacional/Gestão) - Demonstração
- [ ] Verificar responsividade dos chats

### 🔧 Administrativas
- [ ] Painel de controle
- [ ] Relatórios
- [ ] Configurações

## 🔍 Solução de Problemas

### ❌ Se a aba "Conversar com IA" não aparecer:
**✅ PROBLEMA CORRIGIDO!** O layout foi atualizado para usar o componente correto que inclui a funcionalidade de IA.

**Se ainda não aparecer:**
1. Atualize a página (F5)
2. Limpe o cache do navegador (Ctrl+Shift+R)
3. Verifique se está logado corretamente

### 🤖 Se o chat da Emilia não carregar:
1. Verifique sua conexão com a internet
2. Aguarde alguns segundos para o iframe carregar
3. Se necessário, recarregue a página

### Se os serviços não iniciarem:
1. Verifique se as portas 8000 e 5173 estão livres
2. Execute: `.\run.bat install` para reinstalar dependências
3. Tente novamente: `.\run.bat dev`

### Se o login não funcionar:
1. Verifique as credenciais: admin@autocred.com / admin123
2. Execute o script de configuração do banco:
   ```bash
   cd backend_autocred
   .\.venv\Scripts\Activate.ps1
   python fix_database_schema.py
   ```

### Para logs detalhados:
- Backend: Verifique o terminal onde o uvicorn está rodando
- Frontend: Abra o DevTools do navegador (F12)

## 🎯 Próximos Passos

1. **✅ Acesse a funcionalidade de IA**: Agora disponível no menu lateral!
2. **🔥 Teste o chat REAL da Emilia**: Chat com IA funcional integrado!
3. **Explore o sistema**: Navegue por todas as seções
4. **Teste funcionalidades**: Crie clientes e propostas
5. **Interaja com a IA**: Use os chats do Emilia (real) e Elias (demo)
6. **Teste a API**: Use a documentação em /docs
7. **Personalize**: Adapte conforme suas necessidades

---

**Desenvolvido com FastAPI + React + TypeScript + Tailwind CSS**  
**IA Chat powered by SuperAgentes**

Para suporte ou dúvidas, verifique os logs nos terminais ou consulte a documentação da API. 