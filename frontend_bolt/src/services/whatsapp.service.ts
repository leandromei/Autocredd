import axios from 'axios';

const API_KEY = 'B6D711FCDE4D4FD5936544120E713C37';
const REAL_INSTANCE_NAME = 'whatsapptestev4'; // Nova instância funcionando com WhatsApp Web atualizado

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
      // Tentar conectar via WebSocket para eventos em tempo real
      const wsUrl = `ws://localhost:8081/websocket?apikey=${API_KEY}`;
      console.log('🔌 Connecting to WebSocket:', wsUrl);
      
      this.websocket = new WebSocket(wsUrl);
      
      this.websocket.onopen = () => {
        console.log('✅ WebSocket connected for QR code events');
      };
      
      this.websocket.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          console.log('📨 WebSocket message received:', data);
          
          // Procurar por eventos de QR code
          if (data.instance === instanceName && data.data?.qrcode) {
            console.log('🎯 QR Code event received!');
            onQRCode(data.data.qrcode);
          }
        } catch (error) {
          console.error('❌ Error parsing WebSocket message:', error);
        }
      };
      
      this.websocket.onerror = (error) => {
        console.error('❌ WebSocket error:', error);
      };
      
      this.websocket.onclose = () => {
        console.log('📴 WebSocket connection closed');
      };
      
    } catch (error) {
      console.error('❌ Failed to setup WebSocket:', error);
    }
  }

  private async request(method: string, endpoint: string, data?: any) {
    try {
      console.log(`🔗 Making ${method} request to: /evolution${endpoint}`);
      
      const config = {
        method,
        url: `/evolution${endpoint}`,
        headers: {
          'apikey': API_KEY,
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

  async getQRCode(instanceName?: string) {
    try {
      const targetInstance = instanceName || REAL_INSTANCE_NAME;
      console.log(`🔍 Getting QR Code for instance: ${targetInstance}`);
      
      // Verificar se a instância existe
      const instances = await this.getAllInstances();
      const instanceExists = instances.find((inst: any) => inst.name === targetInstance);
      
      if (!instanceExists) {
        console.log(`⚠️ Instance ${targetInstance} not found, creating new one...`);
        
        // Criar nova instância com QR code
        const createData = {
          instanceName: targetInstance,
          qrcode: true,
          integration: 'WHATSAPP-BAILEYS',
          webhook_by_events: false
        };
        
        const createResponse = await this.request('POST', '/instance/create', createData);
        console.log('✅ Instance created with QR code:', createResponse);
        
        if (createResponse.qrcode?.code) {
          return {
            qrCode: createResponse.qrcode.code,
            status: 'qr_ready',
            instance: targetInstance
          };
        }
      }
      
      console.log('📊 Instance found:', instanceExists);
      
      // Se a instância já está conectada, não precisa de QR code
      if (instanceExists.connectionStatus === 'open') {
        throw new Error(`Instância ${targetInstance} já está conectada ao WhatsApp.`);
      }
      
      // Tentar conectar para gerar QR code
      console.log('📱 Connecting to generate QR Code...');
      const connectResponse = await this.request('GET', `/instance/connect/${targetInstance}`);
      console.log('📱 Connect response:', connectResponse);
      
      // Verificar se retornou QR code
      if (connectResponse.qrcode?.code) {
        console.log('✅ QR Code found in connect response!');
        return {
          qrCode: connectResponse.qrcode.code,
          status: 'qr_ready',
          instance: targetInstance
        };
      }
      
      if (connectResponse.code) {
        console.log('✅ QR Code found in code field!');
        return {
          qrCode: connectResponse.code,
          status: 'qr_ready',
          instance: targetInstance
        };
      }
      
      // Se não conseguiu obter QR code
      throw new Error(`Não foi possível obter QR Code da instância ${targetInstance}.`);
      
    } catch (error: any) {
      console.error('❌ Error getting QR Code:', error);
      throw error;
    }
  }

  async getInstanceStatus(instanceName?: string) {
    try {
      const targetInstance = instanceName || REAL_INSTANCE_NAME;
      const response = await this.request('GET', `/instance/connectionState/${targetInstance}`);
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
      const response = await this.request('GET', '/instance/fetchInstances');
      return response || [];
    } catch (error) {
      return [];
    }
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