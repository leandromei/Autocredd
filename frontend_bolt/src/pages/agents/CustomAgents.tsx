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
  Target,
  Smartphone,
  Wifi,
  WifiOff,
  QrCode,
  X
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

const CustomAgents: React.FC = () => {
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
  const [showWhatsAppModal, setShowWhatsAppModal] = useState(false);
  const [selectedAgent, setSelectedAgent] = useState<CustomAgent | null>(null);
  const [activeTab, setActiveTab] = useState<'agents' | 'templates' | 'personalities'>('agents');
  const [qrCodeUrl, setQrCodeUrl] = useState<string>('');
  const [whatsappStatus, setWhatsappStatus] = useState<{[key: string]: 'connected' | 'disconnected' | 'connecting'}>({});

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
      const response = await fetch('/api/agents/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      if (response.ok) {
        const result = await response.json();
        setAgents(prev => [...prev, result.agent]);
        setShowCreateModal(false);
        setFormData({ name: '', description: '', personality_id: '', custom_prompt: '', configuration: {} });
      }
    } catch (error) {
      console.error('Erro ao criar agente:', error);
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

  const handleConnectWhatsApp = async (agent: CustomAgent) => {
    try {
      console.log(`🔗 Conectando WhatsApp para agente: ${agent.name} (${agent.id})`);
      setSelectedAgent(agent);
      setWhatsappStatus(prev => ({ ...prev, [agent.id]: 'connecting' }));
      setShowWhatsAppModal(true);
      
      // Usar nova API que funciona 100%
      const response = await fetch(`/api/qr-code-real/${agent.id}`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' }
      });

      const result = await response.json();
      
      if (result.success) {
        console.log('✅ QR Code gerado com sucesso!', result);
        setQrCodeUrl(result.qrcode);
        
        // Iniciar verificação real do status (polling)
        const checkConnection = setInterval(async () => {
          try {
            const statusResponse = await fetch(`/api/evolution/status/${agent.id}`);
            const statusResult = await statusResponse.json();
            
            if (statusResult.connected) {
              setWhatsappStatus(prev => ({ ...prev, [agent.id]: 'connected' }));
              alert('🎉 WhatsApp conectado com sucesso!');
              setShowWhatsAppModal(false);
              clearInterval(checkConnection);
            }
          } catch (error) {
            console.error('Erro verificando status:', error);
          }
        }, 3000); // Verificar a cada 3 segundos
        
        // Limpar verificação após 2 minutos
        setTimeout(() => {
          clearInterval(checkConnection);
        }, 120000);
        
      } else {
        console.error('❌ Erro ao gerar QR Code:', result.error);
        alert(`Erro ao gerar QR Code: ${result.error || 'Erro desconhecido'}`);
        setWhatsappStatus(prev => ({ ...prev, [agent.id]: 'disconnected' }));
        setShowWhatsAppModal(false);
      }
    } catch (error) {
      console.error('❌ Erro ao conectar WhatsApp:', error);
      alert('Erro ao conectar WhatsApp. Verifique sua conexão.');
      setWhatsappStatus(prev => ({ ...prev, [agent.id]: 'disconnected' }));
      setShowWhatsAppModal(false);
    }
  };

  const handleDisconnectWhatsApp = async (agent: CustomAgent) => {
    if (!confirm('Deseja desconectar este agente do WhatsApp?')) return;
    
    try {
      const response = await fetch(`/api/evolution/disconnect/${agent.id}`, {
        method: 'POST'
      });

      if (response.ok) {
        setWhatsappStatus(prev => ({ ...prev, [agent.id]: 'disconnected' }));
      }
    } catch (error) {
      console.error('Erro ao desconectar WhatsApp:', error);
    }
  };

  const getWhatsAppStatusIcon = (agentId: string) => {
    const status = whatsappStatus[agentId] || 'disconnected';
    
    switch (status) {
      case 'connected':
        return <Wifi className="w-4 h-4 text-green-600" />;
      case 'connecting':
        return <div className="w-4 h-4 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />;
      default:
        return <WifiOff className="w-4 h-4 text-gray-400" />;
    }
  };

  const getWhatsAppStatusText = (agentId: string) => {
    const status = whatsappStatus[agentId] || 'disconnected';
    
    switch (status) {
      case 'connected':
        return 'Conectado';
      case 'connecting':
        return 'Conectando...';
      default:
        return 'Desconectado';
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
    <div className="space-y-6">
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
      <div className="border-b border-gray-200">
        <nav className="-mb-px flex space-x-8">
          {[
            { id: 'agents', label: 'Meus Agentes', icon: Bot },
            { id: 'templates', label: 'Templates', icon: Star },
            { id: 'personalities', label: 'Personalidades', icon: Users }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center gap-2 py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === tab.id
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              <tab.icon className="w-4 h-4" />
              {tab.label}
            </button>
          ))}
        </nav>
      </div>

      {/* Content */}
      {activeTab === 'agents' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {agents.map(agent => (
            <div key={agent.id} className="bg-white rounded-lg shadow-md border border-gray-200 overflow-hidden">
              <div className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">{agent.name}</h3>
                    <p className="text-gray-600 text-sm mt-1">{agent.description}</p>
                  </div>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(agent.status)}`}>
                    {agent.status}
                  </span>
                </div>

                {/* WhatsApp Status */}
                <div className="mb-4 p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Smartphone className="w-4 h-4 text-gray-600" />
                      <span className="text-sm font-medium text-gray-700">WhatsApp</span>
                    </div>
                    <div className="flex items-center gap-2">
                      {getWhatsAppStatusIcon(agent.id)}
                      <span className="text-xs text-gray-600">{getWhatsAppStatusText(agent.id)}</span>
                    </div>
                  </div>
                  
                  {whatsappStatus[agent.id] === 'connected' ? (
                    <button
                      onClick={() => handleDisconnectWhatsApp(agent)}
                      className="mt-2 w-full text-xs bg-red-50 text-red-600 px-2 py-1 rounded hover:bg-red-100"
                    >
                      Desconectar
                    </button>
                  ) : (
                    <button
                      onClick={() => handleConnectWhatsApp(agent)}
                      disabled={whatsappStatus[agent.id] === 'connecting'}
                      className="mt-2 w-full text-xs bg-green-50 text-green-600 px-2 py-1 rounded hover:bg-green-100 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {whatsappStatus[agent.id] === 'connecting' ? 'Conectando...' : 'Conectar'}
                    </button>
                  )}
                </div>

                {/* Stats */}
                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-blue-600">{agent.performance_stats.total_conversations}</div>
                    <div className="text-xs text-gray-500">Conversas</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-green-600">
                      {(agent.performance_stats.satisfaction_score * 100).toFixed(0)}%
                    </div>
                    <div className="text-xs text-gray-500">Satisfação</div>
                  </div>
                </div>

                <div className="text-xs text-gray-500 mb-4">
                  Criado em {new Date(agent.created_at).toLocaleDateString('pt-BR')}
                </div>

                {/* Actions */}
                <div className="flex gap-2">
                  <button
                    onClick={() => {
                      setSelectedAgent(agent);
                      setChatMessages([]);
                      setShowChatModal(true);
                    }}
                    className="flex-1 bg-blue-50 text-blue-600 px-3 py-2 rounded text-sm hover:bg-blue-100 flex items-center justify-center gap-1"
                  >
                    <MessageSquare className="w-4 h-4" />
                    Chat
                  </button>
                  <button
                    onClick={() => handleToggleAgentStatus(agent)}
                    className={`px-3 py-2 rounded text-sm flex items-center gap-1 ${
                      agent.status === 'active'
                        ? 'bg-orange-50 text-orange-600 hover:bg-orange-100'
                        : 'bg-green-50 text-green-600 hover:bg-green-100'
                    }`}
                  >
                    {agent.status === 'active' ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                  </button>
                  <button
                    onClick={() => handleDeleteAgent(agent.id)}
                    className="px-3 py-2 rounded text-sm bg-red-50 text-red-600 hover:bg-red-100 flex items-center gap-1"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}

          {agents.length === 0 && (
            <div className="col-span-full text-center py-12">
              <Bot className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">Nenhum agente criado ainda</h3>
              <p className="text-gray-600 mb-4">Crie seu primeiro agente IA personalizado</p>
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
            <div key={template.id} className="bg-white rounded-lg shadow-md border border-gray-200 p-6">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">{template.name}</h3>
                  <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium mt-2 ${getCategoryColor(template.category)}`}>
                    {template.category}
                  </span>
                </div>
              </div>
              
              <p className="text-gray-600 text-sm mb-4">{template.description}</p>
              
              <button
                onClick={() => handleCreateFromTemplate(template)}
                className="w-full bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center justify-center gap-2"
              >
                <Plus className="w-4 h-4" />
                Usar Template
              </button>
            </div>
          ))}
        </div>
      )}

      {activeTab === 'personalities' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {personalities.map(personality => (
            <div key={personality.id} className="bg-white rounded-lg shadow-md border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">{personality.name}</h3>
              <p className="text-gray-600 text-sm mb-4">{personality.description}</p>
              
              <div className="mb-4">
                <div className="text-sm font-medium text-gray-700 mb-2">Tom: {personality.tone}</div>
                <div className="text-sm text-gray-600 mb-2">
                  <strong>Expertise:</strong> {personality.expertise.join(', ')}
                </div>
                <div className="text-sm text-gray-600">
                  <strong>Casos de uso:</strong> {personality.use_cases.join(', ')}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal de Criação */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-md w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Criar Novo Agente</h2>
              
              <form onSubmit={handleCreateAgent} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Nome do Agente</label>
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
                      fontFamily: 'system-ui, -apple-system, sans-serif',
                      height: '80px'
                    }}
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
                      fontFamily: 'system-ui, -apple-system, sans-serif',
                      height: '96px'
                    }}
                    placeholder="Instruções específicas para este agente..."
                    required
                  />
                </div>

                <div className="flex gap-3 pt-4">
                  <button
                    type="submit"
                    className="flex-1 bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700"
                  >
                    Criar Agente
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowCreateModal(false)}
                    className="flex-1 bg-gray-300 text-gray-700 py-2 rounded-lg hover:bg-gray-400"
                  >
                    Cancelar
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Modal de Conexão WhatsApp */}
      {showWhatsAppModal && selectedAgent && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-md w-full">
            <div className="p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                  <QrCode className="w-6 h-6 text-green-600" />
                  Conectar WhatsApp
                </h2>
                <button
                  onClick={() => {
                    setShowWhatsAppModal(false);
                    setQrCodeUrl('');
                    setWhatsappStatus(prev => ({ ...prev, [selectedAgent.id]: 'disconnected' }));
                  }}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              <div className="text-center">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  {selectedAgent.name}
                </h3>
                <p className="text-sm text-gray-600 mb-6">
                  Escaneie o QR Code com o WhatsApp do seu celular
                </p>

                {qrCodeUrl ? (
                  <div className="bg-white p-4 rounded-lg border border-gray-200 mb-4">
                    <img 
                      src={qrCodeUrl} 
                      alt="QR Code WhatsApp"
                      className="w-64 h-64 mx-auto border rounded-lg"
                    />
                    <p className="text-xs text-gray-500 mt-2">
                      QR Code gerado - pronto para escaneamento
                    </p>
                  </div>
                ) : (
                  <div className="w-64 h-64 mx-auto bg-gray-100 rounded-lg flex items-center justify-center mb-4">
                    <div className="text-center">
                      <div className="w-8 h-8 border-2 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-2"></div>
                      <p className="text-sm text-gray-600">Gerando QR Code...</p>
                    </div>
                  </div>
                )}

                <div className="space-y-2 text-sm text-gray-600 mb-4">
                  <p className="font-medium text-gray-800">📱 Como conectar:</p>
                  <ol className="text-left space-y-1 bg-gray-50 p-3 rounded-lg">
                    <li>1. Abra o <strong>WhatsApp</strong> no seu celular</li>
                    <li>2. Toque nos <strong>3 pontos</strong> → <strong>Aparelhos conectados</strong></li>
                    <li>3. Toque em <strong>"Conectar um aparelho"</strong></li>
                    <li>4. Escaneie o QR Code acima</li>
                    <li>5. Aguarde a confirmação automática</li>
                  </ol>
                </div>

                <div className="space-y-3">
                  <div className="p-3 bg-blue-50 rounded-lg">
                    <div className="flex items-center justify-center gap-2 text-blue-600">
                      <div className="w-4 h-4 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                      <span className="text-sm font-medium">Aguardando escaneamento...</span>
                    </div>
                  </div>

                  {/* Botão para testar conexão (desenvolvimento) */}
                  <button
                    onClick={async () => {
                      try {
                        const response = await fetch(`/api/evolution/confirm-qr/${selectedAgent.id}`, {
                          method: 'POST',
                          headers: { 'Content-Type': 'application/json' }
                        });
                        const result = await response.json();
                        if (result.success) {
                          setWhatsappStatus(prev => ({ ...prev, [selectedAgent.id]: 'connected' }));
                          alert('🎉 WhatsApp conectado com sucesso! (Simulação de teste)');
                          setShowWhatsAppModal(false);
                        }
                      } catch (error) {
                        console.error('Erro na simulação:', error);
                      }
                    }}
                    className="w-full px-4 py-2 text-sm bg-green-50 text-green-600 rounded-lg hover:bg-green-100 border border-green-200"
                  >
                    🧪 Simular Conexão (Teste)
                  </button>

                  <p className="text-xs text-gray-500">
                    Use o botão de teste acima se estiver testando o sistema
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal de Chat */}
      {showChatModal && selectedAgent && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-2xl w-full h-[600px] flex flex-col">
            <div className="p-4 border-b border-gray-200 flex justify-between items-center">
              <div>
                <h2 className="text-lg font-bold text-gray-900">Chat com {selectedAgent.name}</h2>
                <p className="text-sm text-gray-600">{selectedAgent.description}</p>
              </div>
              <button
                onClick={() => setShowChatModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                ×
              </button>
            </div>

            <div className="flex-1 p-4 overflow-y-auto space-y-4">
              {chatMessages.map((message, index) => (
                <div
                  key={index}
                  className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                      message.role === 'user'
                        ? 'bg-blue-600 text-white'
                        : 'bg-gray-200 text-gray-900'
                    }`}
                  >
                    {message.content}
                  </div>
                </div>
              ))}
              {chatLoading && (
                <div className="flex justify-start">
                  <div className="bg-gray-200 text-gray-900 px-4 py-2 rounded-lg">
                    <div className="animate-pulse">Digitando...</div>
                  </div>
                </div>
              )}
            </div>

            <div className="p-4 border-t border-gray-200">
              <div className="flex gap-2">
                <input
                  type="text"
                  value={currentMessage}
                  onChange={(e) => setCurrentMessage(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                  placeholder="Digite sua mensagem..."
                  className="flex-1 rounded-lg px-3 py-2"
                  style={{ 
                    color: '#000000',
                    backgroundColor: '#ffffff',
                    border: '1px solid #d1d5db',
                    outline: 'none',
                    fontFamily: 'system-ui, -apple-system, sans-serif'
                  }}
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

export default CustomAgents; 