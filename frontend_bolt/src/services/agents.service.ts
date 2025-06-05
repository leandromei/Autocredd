export interface AgentPersonality {
  id: string;
  name: string;
  description: string;
  tone: string;
  expertise: string[];
  use_cases: string[];
}

export interface CustomAgent {
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
  whatsapp_status?: 'connected' | 'disconnected' | 'connecting';
  whatsapp_instance?: string;
}

export interface AgentTemplate {
  id: string;
  name: string;
  category: string;
  description: string;
  personality_id: string;
  suggested_prompt: string;
  configuration: Record<string, any>;
}

export interface CreateAgentRequest {
  name: string;
  description: string;
  personality_id: string;
  custom_prompt: string;
  configuration?: Record<string, any>;
}

export interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
}

export interface ChatRequest {
  message: string;
  session_id?: string;
  context_data?: Record<string, any>;
}

export interface ChatResponse {
  response: string;
  session_id: string;
  agent_id: string;
  timestamp: string;
}

class AgentsService {
  private baseUrl = '/api';

  // ======================================
  // GESTÃO DE AGENTES
  // ======================================

  async getAllAgents(): Promise<CustomAgent[]> {
    try {
      const response = await fetch(`${this.baseUrl}/agents/`);
      
      if (!response.ok) {
        throw new Error(`Erro ao buscar agentes: ${response.status}`);
      }
      
      const data = await response.json();
      return data.agents || [];
    } catch (error) {
      console.error('❌ Erro ao buscar agentes:', error);
      return [];
    }
  }

  async createAgent(agentData: CreateAgentRequest): Promise<CustomAgent> {
    try {
      console.log('🚀 Criando agente:', agentData);
      
      const response = await fetch(`${this.baseUrl}/agents/create`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(agentData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || `Erro ao criar agente: ${response.status}`);
      }

      const data = await response.json();
      console.log('✅ Agente criado com sucesso:', data);
      return data;
    } catch (error) {
      console.error('❌ Erro ao criar agente:', error);
      throw error;
    }
  }

  async updateAgent(agentId: string, updates: Partial<CustomAgent>): Promise<CustomAgent> {
    try {
      const response = await fetch(`${this.baseUrl}/agents/${agentId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updates),
      });

      if (!response.ok) {
        throw new Error(`Erro ao atualizar agente: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('❌ Erro ao atualizar agente:', error);
      throw error;
    }
  }

  async deleteAgent(agentId: string): Promise<void> {
    try {
      const response = await fetch(`${this.baseUrl}/agents/${agentId}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error(`Erro ao deletar agente: ${response.status}`);
      }
    } catch (error) {
      console.error('❌ Erro ao deletar agente:', error);
      throw error;
    }
  }

  async getAgentDetails(agentId: string): Promise<CustomAgent> {
    try {
      const response = await fetch(`${this.baseUrl}/agents/${agentId}`);
      
      if (!response.ok) {
        throw new Error(`Erro ao buscar detalhes do agente: ${response.status}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error('❌ Erro ao buscar detalhes do agente:', error);
      throw error;
    }
  }

  // ======================================
  // PERSONALIDADES E TEMPLATES
  // ======================================

  async getPersonalities(): Promise<AgentPersonality[]> {
    try {
      const response = await fetch(`${this.baseUrl}/agents/personalities`);
      
      if (!response.ok) {
        console.warn('⚠️ Erro ao buscar personalidades da API, usando padrão');
        return this.getDefaultPersonalities();
      }
      
      const data = await response.json();
      return data.personalities || this.getDefaultPersonalities();
    } catch (error) {
      console.error('❌ Erro ao buscar personalidades:', error);
      return this.getDefaultPersonalities();
    }
  }

  async getTemplates(): Promise<AgentTemplate[]> {
    try {
      const response = await fetch(`${this.baseUrl}/agents/templates`);
      
      if (!response.ok) {
        throw new Error(`Erro ao buscar templates: ${response.status}`);
      }
      
      const data = await response.json();
      return data.templates || [];
    } catch (error) {
      console.error('❌ Erro ao buscar templates:', error);
      return [];
    }
  }

  async createAgentFromTemplate(templateId: string, agentName: string): Promise<CustomAgent> {
    try {
      const formData = new FormData();
      formData.append('agent_name', agentName);
      
      const response = await fetch(`${this.baseUrl}/agents/template/${templateId}`, {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error(`Erro ao criar agente do template: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('❌ Erro ao criar agente do template:', error);
      throw error;
    }
  }

  private getDefaultPersonalities(): AgentPersonality[] {
    return [
      {
        id: "vendas_consultivo",
        name: "Vendas Consultivo",
        description: "Especialista em vendas consultivas e relacionamento com clientes de crédito",
        tone: "consultivo",
        expertise: ["vendas", "crédito", "negociação", "relacionamento"],
        use_cases: ["qualificação de leads", "apresentação de produtos", "fechamento de vendas"]
      },
      {
        id: "suporte_especializado",
        name: "Suporte Especializado",
        description: "Atendimento especializado em produtos financeiros e resolução de problemas",
        tone: "profissional",
        expertise: ["suporte técnico", "produtos financeiros", "resolução de problemas"],
        use_cases: ["dúvidas sobre contratos", "problemas técnicos", "orientações"]
      },
      {
        id: "relacionamento_humanizado",
        name: "Relacionamento Humanizado",
        description: "Foco em criar relacionamentos próximos e humanizados com os clientes",
        tone: "empático",
        expertise: ["relacionamento", "retenção", "fidelização"],
        use_cases: ["pós-venda", "retenção", "relacionamento contínuo"]
      },
      {
        id: "prospeccao_ativa",
        name: "Prospecção Ativa",
        description: "Especialista em prospecção ativa e geração de leads qualificados",
        tone: "dinâmico",
        expertise: ["prospecção", "qualificação", "cold calling"],
        use_cases: ["prospecção ativa", "qualificação de leads", "abordagem inicial"]
      }
    ];
  }

  // ======================================
  // WHATSAPP INTEGRATION
  // ======================================

  async connectWhatsApp(agentId: string): Promise<{success: boolean, qrcode?: string, message: string}> {
    try {
      console.log(`🔗 Conectando WhatsApp para agente: ${agentId}`);
      
      const response = await fetch(`${this.baseUrl}/evolution/connect-agent/${agentId}`, {
        method: 'POST',
      });

      if (!response.ok) {
        throw new Error(`Erro ao conectar WhatsApp: ${response.status}`);
      }

      const data = await response.json();
      console.log('✅ WhatsApp conectado:', data);
      return data;
    } catch (error) {
      console.error('❌ Erro ao conectar WhatsApp:', error);
      throw error;
    }
  }

  async disconnectWhatsApp(agentId: string): Promise<{success: boolean, message: string}> {
    try {
      const response = await fetch(`${this.baseUrl}/evolution/disconnect/${agentId}`, {
        method: 'POST',
      });

      if (!response.ok) {
        throw new Error(`Erro ao desconectar WhatsApp: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('❌ Erro ao desconectar WhatsApp:', error);
      throw error;
    }
  }

  async getWhatsAppStatus(agentId: string): Promise<{connected: boolean, status: string}> {
    try {
      const response = await fetch(`${this.baseUrl}/evolution/status/${agentId}`);
      
      if (!response.ok) {
        return { connected: false, status: 'disconnected' };
      }
      
      return await response.json();
    } catch (error) {
      console.error('❌ Erro ao verificar status WhatsApp:', error);
      return { connected: false, status: 'disconnected' };
    }
  }

  async generateQRCode(agentId: string): Promise<{success: boolean, qrcode: string, message: string}> {
    try {
      const response = await fetch(`${this.baseUrl}/qr-code-real/${agentId}`);
      
      if (!response.ok) {
        throw new Error(`Erro ao gerar QR Code: ${response.status}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error('❌ Erro ao gerar QR Code:', error);
      throw error;
    }
  }

  // ======================================
  // CHAT COM AGENTES
  // ======================================

  async sendMessage(agentId: string, message: string, sessionId?: string): Promise<ChatResponse> {
    try {
      const response = await fetch(`${this.baseUrl}/agents/${agentId}/chat`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message,
          session_id: sessionId,
          context_data: {
            timestamp: new Date().toISOString(),
            user_type: 'admin'
          }
        }),
      });

      if (!response.ok) {
        throw new Error(`Erro ao enviar mensagem: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('❌ Erro ao enviar mensagem:', error);
      throw error;
    }
  }

  async getAgentStats(agentId: string): Promise<any> {
    try {
      const response = await fetch(`${this.baseUrl}/agents/${agentId}/stats`);
      
      if (!response.ok) {
        throw new Error(`Erro ao buscar estatísticas: ${response.status}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error('❌ Erro ao buscar estatísticas:', error);
      throw error;
    }
  }
}

export const agentsService = new AgentsService(); 