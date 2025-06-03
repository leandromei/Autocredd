import React, { useState, useEffect } from 'react';
import {
  Bot,
  Plus,
  MessageSquare,
  Settings,
  Trash2,
  Play,
  Pause,
  TrendingUp,
  Users,
  Eye,
  Edit3,
  Star,
  Zap,
  Activity,
  Clock,
  Target
} from 'lucide-react';

interface AgentPersonality {
  id: string;
  name: string;
  description: string;
  tone: string;
  expertise: string[];
  use_cases: string[];
}

interface CustomAgent {
  id: string;
  name: string;
  description: string;
  personality_id: string;
  custom_prompt: string;
  superagentes_id?: string;
  status: string;
  created_at: string;
  created_by: string;
  performance_stats: {
    total_conversations: number;
    successful_conversions: number;
    average_response_time: number;
    satisfaction_score: number;
  };
  configuration: Record<string, any>;
}

interface AgentTemplate {
  id: string;
  name: string;
  category: string;
  description: string;
  personality_id: string;
  suggested_prompt: string;
  configuration: Record<string, any>;
}

const CreateAgent: React.FC = () => {
  const [agents, setAgents] = useState<CustomAgent[]>([]);
  const [personalities, setPersonalities] = useState<AgentPersonality[]>([
    // Personalidades padrão como fallback
    {
      id: "friendly",
      name: "Amigável",
      description: "Personalidade acolhedora e simpática",
      tone: "amigável",
      expertise: ["atendimento", "vendas"],
      use_cases: ["suporte", "vendas", "relacionamento"]
    },
    {
      id: "professional",
      name: "Profissional",
      description: "Personalidade formal e técnica",
      tone: "profissional",
      expertise: ["consultoria", "suporte técnico"],
      use_cases: ["consultoria", "suporte", "análises"]
    },
    {
      id: "empathetic",
      name: "Empático",
      description: "Personalidade compreensiva e acolhedora",
      tone: "empático",
      expertise: ["relacionamento", "suporte"],
      use_cases: ["atendimento humanizado", "resolução de conflitos"]
    }
  ]);
  const [templates, setTemplates] = useState<AgentTemplate[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showChatModal, setShowChatModal] = useState(false);
  const [selectedAgent, setSelectedAgent] = useState<CustomAgent | null>(null);
  const [activeTab, setActiveTab] = useState<'agents' | 'templates' | 'personalities'>('agents');

  // Estados do formulário de criação
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    personality_id: '',
    custom_prompt: '',
    configuration: {}
  });

  // Estados do chat
  const [chatMessages, setChatMessages] = useState<Array<{role: string, content: string, timestamp: string}>>([]);
  const [currentMessage, setCurrentMessage] = useState('');
  const [chatLoading, setChatLoading] = useState(false);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      console.log("🔄 Carregando dados dos agentes...");
      
      const [agentsRes, personalitiesRes, templatesRes] = await Promise.all([
        fetch('/api/agents/'),
        fetch('/api/agents/personalities'),
        fetch('/api/agents/templates')
      ]);

      console.log("📊 Status das requisições:", {
        agents: agentsRes.status,
        personalities: personalitiesRes.status,
        templates: templatesRes.status
      });

      if (agentsRes.ok) {
        const agentsData = await agentsRes.json();
        console.log("✅ Agentes carregados:", agentsData);
        setAgents(agentsData.agents || []);
      }

      if (personalitiesRes.ok) {
        const personalitiesData = await personalitiesRes.json();
        console.log("✅ Personalidades carregadas:", personalitiesData);
        // Manter personalidades padrão se a API retornar vazio, senão usar as da API
        if (personalitiesData.personalities && personalitiesData.personalities.length > 0) {
          setPersonalities(personalitiesData.personalities);
        }
      } else {
        console.error("❌ Erro ao carregar personalidades:", personalitiesRes.status);
        console.log("ℹ️ Usando personalidades padrão");
      }

      if (templatesRes.ok) {
        const templatesData = await templatesRes.json();
        console.log("✅ Templates carregados:", templatesData);
        setTemplates(templatesData.templates || []);
      }
    } catch (error) {
      console.error('❌ Erro ao carregar dados:', error);
    } finally {
      setLoading(false);
      console.log("✅ Carregamento concluído");
    }
  };

  const handleCreateAgent = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      console.log("🚀 Criando agente com dados:", formData);
      
      const response = await fetch('/api/agents/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      console.log("📡 Resposta da API:", response.status);

      if (response.ok) {
        const result = await response.json();
        console.log("✅ Agente criado com sucesso:", result);
        setAgents(prev => [...prev, result.agent]);
        setShowCreateModal(false);
        setFormData({ name: '', description: '', personality_id: '', custom_prompt: '', configuration: {} });
        alert(`Agente "${result.agent.name}" criado com sucesso!`);
      } else {
        const errorData = await response.text();
        console.error("❌ Erro na resposta:", response.status, errorData);
        alert(`Erro ao criar agente: ${response.status} - ${errorData}`);
      }
    } catch (error) {
      console.error('❌ Erro ao criar agente:', error);
      alert(`Erro de conexão: ${error.message}`);
    }
  };

  const handleCreateFromTemplate = async (template: AgentTemplate) => {
    const agentName = prompt(`Nome para o agente baseado em "${template.name}":`);
    if (!agentName) return;

    try {
      const response = await fetch(`/api/agents/template/${template.id}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ agent_name: agentName })
      });

      if (response.ok) {
        const result = await response.json();
        setAgents(prev => [...prev, result.agent]);
      }
    } catch (error) {
      console.error('Erro ao criar agente do template:', error);
    }
  };

  const handleDeleteAgent = async (agentId: string) => {
    if (!confirm('Tem certeza que deseja remover este agente?')) return;

    try {
      const response = await fetch(`/api/agents/${agentId}`, {
        method: 'DELETE'
      });

      if (response.ok) {
        setAgents(prev => prev.filter(agent => agent.id !== agentId));
      }
    } catch (error) {
      console.error('Erro ao remover agente:', error);
    }
  };

  const handleToggleAgentStatus = async (agent: CustomAgent) => {
    const newStatus = agent.status === 'active' ? 'inactive' : 'active';
    
    try {
      const response = await fetch(`/api/agents/${agent.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus })
      });

      if (response.ok) {
        setAgents(prev => prev.map(a => 
          a.id === agent.id ? { ...a, status: newStatus } : a
        ));
      }
    } catch (error) {
      console.error('Erro ao alterar status:', error);
    }
  };

  const handleSendMessage = async () => {
    if (!currentMessage.trim() || !selectedAgent) return;

    setChatLoading(true);
    const userMessage = { role: 'user', content: currentMessage, timestamp: new Date().toISOString() };
    setChatMessages(prev => [...prev, userMessage]);
    setCurrentMessage('');

    try {
      const response = await fetch(`/api/agents/${selectedAgent.id}/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          message: currentMessage,
          context_data: { source: 'dashboard' }
        })
      });

      if (response.ok) {
        const result = await response.json();
        const agentMessage = {
          role: 'assistant',
          content: result.response,
          timestamp: result.timestamp
        };
        setChatMessages(prev => [...prev, agentMessage]);
      }
    } catch (error) {
      console.error('Erro no chat:', error);
    } finally {
      setChatLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'text-green-600 bg-green-100';
      case 'inactive': return 'text-gray-600 bg-gray-100';
      case 'training': return 'text-blue-600 bg-blue-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'Vendas': return 'bg-purple-100 text-purple-800';
      case 'Suporte': return 'bg-blue-100 text-blue-800';
      case 'Educação': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-8">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <Bot className="w-8 h-8 text-blue-600" />
            Criar Agente
          </h1>
          <p className="text-gray-600 mt-1">
            Crie e gerencie agentes IA especializados com SuperAgentes
          </p>
        </div>
        <button
          onClick={() => setShowCreateModal(true)}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center gap-2"
        >
          <Plus className="w-4 h-4" />
          Criar Agente
        </button>
      </div>

      {/* Tabs */}
      <div className="flex space-x-1 bg-gray-100 p-1 rounded-lg">
        {[
          { id: 'agents', label: 'Meus Agentes', icon: Bot },
          { id: 'templates', label: 'Templates', icon: Star },
          { id: 'personalities', label: 'Personalidades', icon: Users }
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`flex items-center gap-2 px-4 py-2 rounded-md font-medium transition-colors ${
              activeTab === tab.id
                ? 'bg-white text-blue-600 shadow-sm'
                : 'text-gray-600 hover:text-blue-600'
            }`}
          >
            <tab.icon className="w-4 h-4" />
            {tab.label}
          </button>
        ))}
      </div>

      {/* Content */}
      {activeTab === 'agents' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {agents.map(agent => (
            <div key={agent.id} className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
              <div className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="font-semibold text-gray-900">{agent.name}</h3>
                    <p className="text-sm text-gray-600 mt-1">{agent.description}</p>
                  </div>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(agent.status)}`}>
                    {agent.status}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-4 mb-4 text-sm">
                  <div>
                    <span className="text-gray-500">Conversas</span>
                    <p className="font-semibold">{agent.performance_stats.total_conversations}</p>
                  </div>
                  <div>
                    <span className="text-gray-500">Conversões</span>
                    <p className="font-semibold">{agent.performance_stats.successful_conversions}</p>
                  </div>
                  <div>
                    <span className="text-gray-500">Satisfação</span>
                    <p className="font-semibold">{agent.performance_stats.satisfaction_score}%</p>
                  </div>
                  <div>
                    <span className="text-gray-500">Resp. Média</span>
                    <p className="font-semibold">{agent.performance_stats.average_response_time}s</p>
                  </div>
                </div>

                <div className="flex gap-2">
                  <button
                    onClick={() => {
                      setSelectedAgent(agent);
                      setShowChatModal(true);
                      setChatMessages([]);
                    }}
                    className="flex-1 bg-blue-50 text-blue-600 px-3 py-2 rounded-lg hover:bg-blue-100 flex items-center justify-center gap-2 text-sm font-medium"
                  >
                    <MessageSquare className="w-4 h-4" />
                    Chat
                  </button>
                  <button
                    onClick={() => handleToggleAgentStatus(agent)}
                    className="px-3 py-2 rounded-lg border border-gray-200 hover:bg-gray-50"
                  >
                    {agent.status === 'active' ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                  </button>
                  <button
                    onClick={() => handleDeleteAgent(agent.id)}
                    className="px-3 py-2 rounded-lg border border-red-200 text-red-600 hover:bg-red-50"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}

          {agents.length === 0 && (
            <div className="col-span-full text-center py-12">
              <Bot className="w-16 h-16 mx-auto text-gray-400 mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">Nenhum agente criado</h3>
              <p className="text-gray-600 mb-4">Crie seu primeiro agente IA para começar</p>
              <button
                onClick={() => setShowCreateModal(true)}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
              >
                Criar Primeiro Agente
              </button>
            </div>
          )}
        </div>
      )}

      {activeTab === 'templates' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {templates.map(template => (
            <div key={template.id} className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="font-semibold text-gray-900">{template.name}</h3>
                  <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium mt-2 ${getCategoryColor(template.category)}`}>
                    {template.category}
                  </span>
                </div>
                <Zap className="w-6 h-6 text-yellow-500" />
              </div>
              
              <p className="text-sm text-gray-600 mb-4">{template.description}</p>
              
              <button
                onClick={() => handleCreateFromTemplate(template)}
                className="w-full bg-gradient-to-r from-purple-500 to-blue-600 text-white py-2 rounded-lg hover:from-purple-600 hover:to-blue-700 font-medium"
              >
                Usar Template
              </button>
            </div>
          ))}
        </div>
      )}

      {activeTab === 'personalities' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {personalities.map(personality => (
            <div key={personality.id} className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center">
                  <Users className="w-6 h-6 text-white" />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-900 mb-2">{personality.name}</h3>
                  <p className="text-sm text-gray-600 mb-3">{personality.description}</p>
                  
                  <div className="mb-3">
                    <span className="text-xs font-medium text-gray-500 uppercase tracking-wider">Tom:</span>
                    <p className="text-sm text-gray-700">{personality.tone}</p>
                  </div>

                  <div className="mb-3">
                    <span className="text-xs font-medium text-gray-500 uppercase tracking-wider">Especialidades:</span>
                    <div className="flex flex-wrap gap-1 mt-1">
                      {personality.expertise.map((skill, index) => (
                        <span key={index} className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div>
                    <span className="text-xs font-medium text-gray-500 uppercase tracking-wider">Casos de Uso:</span>
                    <div className="flex flex-wrap gap-1 mt-1">
                      {personality.use_cases.map((useCase, index) => (
                        <span key={index} className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">
                          {useCase}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal de Criação */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-md mx-4">
            <h2 className="text-xl font-bold mb-4">Criar Novo Agente</h2>
            
            <form onSubmit={handleCreateAgent} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Nome</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                  className="w-full rounded-lg px-3 py-2 text-base"
                  style={{ 
                    color: '#000000',
                    backgroundColor: '#ffffff',
                    border: '1px solid #d1d5db',
                    outline: 'none',
                    fontFamily: 'system-ui, -apple-system, sans-serif'
                  }}
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Descrição</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                  className="w-full rounded-lg px-3 py-2 text-base resize-none"
                  style={{ 
                    color: '#000000',
                    backgroundColor: '#ffffff',
                    border: '1px solid #d1d5db',
                    outline: 'none',
                    fontFamily: 'system-ui, -apple-system, sans-serif'
                  }}
                  rows={3}
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Personalidade ({personalities.length} disponíveis)
                </label>
                <select
                  value={formData.personality_id}
                  onChange={(e) => setFormData(prev => ({ ...prev, personality_id: e.target.value }))}
                  className="w-full rounded-lg px-3 py-2 text-base"
                  style={{ 
                    color: '#000000',
                    backgroundColor: '#ffffff',
                    border: '1px solid #d1d5db',
                    outline: 'none',
                    fontFamily: 'system-ui, -apple-system, sans-serif'
                  }}
                  required
                >
                  <option value="" style={{ color: '#000000', backgroundColor: '#ffffff' }}>
                    Selecione uma personalidade
                  </option>
                  {personalities.map(p => (
                    <option 
                      key={p.id} 
                      value={p.id} 
                      style={{ color: '#000000', backgroundColor: '#ffffff' }}
                    >
                      {p.name}
                    </option>
                  ))}
                </select>
                {personalities.length === 0 && (
                  <p className="text-sm text-red-600 mt-1">
                    ⚠️ Nenhuma personalidade carregada. Recarregue a página.
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Prompt Personalizado</label>
                <textarea
                  value={formData.custom_prompt}
                  onChange={(e) => setFormData(prev => ({ ...prev, custom_prompt: e.target.value }))}
                  className="w-full rounded-lg px-3 py-2 text-base resize-none"
                  style={{ 
                    color: '#000000',
                    backgroundColor: '#ffffff',
                    border: '1px solid #d1d5db',
                    outline: 'none',
                    fontFamily: 'system-ui, -apple-system, sans-serif'
                  }}
                  rows={4}
                  placeholder="Instruções específicas para o agente..."
                  required
                />
              </div>

              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="flex-1 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
                >
                  Criar Agente
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal de Chat */}
      {showChatModal && selectedAgent && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl w-full max-w-2xl mx-4 max-h-[80vh] flex flex-col">
            <div className="p-4 border-b border-gray-200 flex justify-between items-center">
              <div>
                <h2 className="text-lg font-semibold">Chat com {selectedAgent.name}</h2>
                <p className="text-sm text-gray-600">{selectedAgent.description}</p>
              </div>
              <button
                onClick={() => setShowChatModal(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                ✕
              </button>
            </div>

            <div className="flex-1 p-4 overflow-y-auto">
              <div className="space-y-4">
                {chatMessages.map((message, index) => (
                  <div key={index} className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                    <div className={`max-w-[80%] p-3 rounded-lg ${
                      message.role === 'user' 
                        ? 'bg-blue-600 text-white' 
                        : 'bg-gray-100 text-gray-900'
                    }`}>
                      <p className="text-sm">{message.content}</p>
                      <p className={`text-xs mt-1 ${
                        message.role === 'user' ? 'text-blue-100' : 'text-gray-500'
                      }`}>
                        {new Date(message.timestamp).toLocaleTimeString()}
                      </p>
                    </div>
                  </div>
                ))}
                
                {chatLoading && (
                  <div className="flex justify-start">
                    <div className="bg-gray-100 p-3 rounded-lg">
                      <div className="flex space-x-1">
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>

            <div className="p-4 border-t border-gray-200">
              <div className="flex gap-2">
                <input
                  type="text"
                  value={currentMessage}
                  onChange={(e) => setCurrentMessage(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                  placeholder="Digite sua mensagem..."
                  className="flex-1 border border-gray-300 rounded-lg px-3 py-2"
                  disabled={chatLoading}
                />
                <button
                  onClick={handleSendMessage}
                  disabled={chatLoading || !currentMessage.trim()}
                  className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50"
                >
                  Enviar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CreateAgent; 