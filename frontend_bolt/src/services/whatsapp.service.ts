import axios from 'axios';

const API_KEY = 'B6D711FCDE4D4FD5936544120E713C37';
const REAL_INSTANCE_NAME = 'whatsapptestev4'; // Nova instância funcionando com WhatsApp Web atualizado

// URL do backend Railway
const BACKEND_URL = 'https://autocredd-production.up.railway.app';

export interface WhatsAppInstance {
  instance: {
    instanceName: string;
    status: string;
    owner: string;
    profileName?: string;
  };
}

export interface QRCodeEvent {
  event: string;
  instance: string;
  data: {
    qrcode?: string;
    base64?: string;
  };
}

export class WhatsAppService {
  private static instance: WhatsAppService;
  private qrCodeCallbacks: Map<string, (qrCode: string) => void> = new Map();
  private websocket: WebSocket | null = null;
  
  private constructor() {}

  static getInstance(): WhatsAppService {
    if (!WhatsAppService.instance) {
      WhatsAppService.instance = new WhatsAppService();
    }
    return WhatsAppService.instance;
  }

  private setupWebSocket(instanceName: string, onQRCode: (qrCode: string) => void) {
    try {
      // WebSocket não disponível no Railway simples - usar polling
      console.log('📡 WebSocket not available in Railway simple mode - using polling');
    } catch (error) {
      console.error('❌ Failed to setup WebSocket:', error);
    }
  }

  private async request(method: string, endpoint: string, data?: any) {
    try {
      console.log(`🔗 Making ${method} request to: ${BACKEND_URL}/api/evolution${endpoint}`);
      
      const config = {
        method,
        url: `${BACKEND_URL}/api/evolution${endpoint}`,
        headers: {
          'Content-Type': 'application/json'
        },
        timeout: 15000,
        ...(data && { data })
      };

      const response = await axios(config);
      console.log(`✅ Response received:`, response.data);
      return response.data;
    } catch (error: any) {
      console.error(`❌ Request failed:`, error.response?.data || error.message);
      throw error;
    }
  }

  async getInstanceStatus(instanceName?: string) {
    try {
      const targetInstance = instanceName || REAL_INSTANCE_NAME;
      const response = await this.request('GET', `/instance/status/${targetInstance}`);
      return {
        status: response.state || response.status || 'disconnected',
        instance: targetInstance
      };
    } catch (error) {
      return { status: 'disconnected', instance: instanceName || REAL_INSTANCE_NAME };
    }
  }

  async getAllInstances() {
    try {
      const response = await this.request('GET', '/instance/list');
      return response || [];
    } catch (error) {
      return [];
    }
  }

  async listInstances() {
    return this.getAllInstances();
  }

  async createInstance(instanceName: string) {
    try {
      const data = {
        instanceName,
        qrcode: true,
        webhook_by_events: false,
        integration: 'WHATSAPP-BAILEYS'
      };
      
      return await this.request('POST', '/instance/create', data);
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Erro ao criar instância');
    }
  }

  async getQRCode(instanceName: string) {
    try {
      const response = await this.request('GET', `/qrcode/${instanceName}`);
      return {
        qrcode: response.qrcode || response.base64,
        status: response.status || 'qr_ready'
      };
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Erro ao obter QR Code');
    }
  }

  async deleteInstance(instanceName: string) {
    try {
      return await this.request('DELETE', `/instance/delete/${instanceName}`);
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Erro ao deletar instância');
    }
  }

  async sendMessage(instanceName: string, phone: string, message: string) {
    try {
      const data = {
        number: phone,
        textMessage: {
          text: message
        }
      };
      
      return await this.request('POST', `/message/sendText/${instanceName}`, data);
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Erro ao enviar mensagem');
    }
  }
} 