import React, { useState, useEffect } from 'react';
import { 
  MessageCircle, 
  Send, 
  QrCode, 
  Plus, 
  Activity,
  Users,
  MessageSquare,
  Clock,
  CheckCircle,
  AlertCircle
} from 'lucide-react';

interface WhatsAppMessage {
  id: string;
  number: string;
  text: string;
  status: 'sent' | 'received' | 'pending';
  timestamp: string;
}

interface WhatsAppInstance {
  instanceName: string;
  status: string;
  connectionStatus: string;
  created_at: string;
}

interface DashboardData {
  status: string;
  total_instances: number;
  active_instances: number;
  messages_today: number;
  messages_total: number;
  evolution_api: {
    status: string;
    url: string;
  };
}

const WhatsApp: React.FC = () => {
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(null);
  const [instances, setInstances] = useState<WhatsAppInstance[]>([]);
  const [messages, setMessages] = useState<WhatsAppMessage[]>([]);
  const [loading, setLoading] = useState(true);
  const [sendingMessage, setSendingMessage] = useState(false);
  
  // Formulário de envio
  const [phoneNumber, setPhoneNumber] = useState('');
  const [messageText, setMessageText] = useState('');
  const [instanceName, setInstanceName] = useState('autocred-main');
  
  // QR Code
  const [qrCode, setQrCode] = useState('');
  const [showQrCode, setShowQrCode] = useState(false);

  // Carregar dados do dashboard
  useEffect(() => {
    loadDashboard();
    loadInstances();
    const interval = setInterval(() => {
      loadDashboard();
    }, 30000); // Atualizar a cada 30 segundos
    
    return () => clearInterval(interval as NodeJS.Timeout);
  }, []);

  const loadDashboard = async () => {
    try {
      const response = await fetch('/api/whatsapp/dashboard');
      const data = await response.json();
      setDashboardData(data);
      setLoading(false);
    } catch (error) {
      console.error('Erro ao carregar dashboard:', error);
      setLoading(false);
    }
  };

  const loadInstances = async () => {
    try {
      const response = await fetch('https://autocred-evolution-api-production.up.railway.app/manager/fetchInstances');
      const data = await response.json();
      setInstances(data);
    } catch (error) {
      console.error('Erro ao carregar instâncias:', error);
    }
  };

  const createInstance = async () => {
    try {
      const newInstanceName = `autocred-${Date.now()}`;
      const response = await fetch('https://autocred-evolution-api-production.up.railway.app/instance/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ instanceName: newInstanceName, token: "autocred-token-2024" })
      });
      
      if (response.ok) {
        loadInstances();
        setInstanceName(newInstanceName);
      }
    } catch (error) {
      console.error('Erro ao criar instância:', error);
    }
  };

  const generateQrCode = async () => {
    try {
      setShowQrCode(true);
      const response = await fetch(`https://autocred-evolution-api-production.up.railway.app/instance/qrcode/${instanceName}`);
      const data = await response.json();
      setQrCode(data.qrcode || '');
    } catch (error) {
      console.error('Erro ao gerar QR Code:', error);
    }
  };

  const sendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!phoneNumber || !messageText) return;
    
    setSendingMessage(true);
    
    try {
      const response = await fetch('/api/whatsapp/send', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          phone: phoneNumber,
          message: messageText,
          instance: instanceName
        })
      });
      
      const result = await response.json();
      
      if (result.success) {
        // Adicionar mensagem à lista local
        const newMessage: WhatsAppMessage = {
          id: `msg_${Date.now()}`,
          number: phoneNumber,
          text: messageText,
          status: 'sent',
          timestamp: new Date().toISOString()
        };
        
        setMessages(prev => [newMessage, ...prev]);
        setMessageText('');
        
        // Atualizar dashboard
        loadDashboard();
      } else {
        alert('Erro ao enviar mensagem: ' + result.error);
      }
    } catch (error) {
      console.error('Erro ao enviar mensagem:', error);
      alert('Erro ao enviar mensagem');
    } finally {
      setSendingMessage(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <MessageCircle className="h-8 w-8 text-green-600" />
          <div>
            <h1 className="text-2xl font-bold text-gray-900">WhatsApp Business</h1>
            <p className="text-gray-600">Gerencie suas conversas e envie mensagens</p>
          </div>
        </div>
        <div className="flex space-x-3">
          <button
            onClick={generateQrCode}
            className="flex items-center space-x-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
          >
            <QrCode className="h-4 w-4" />
            <span>QR Code</span>
          </button>
          <button
            onClick={createInstance}
            className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            <Plus className="h-4 w-4" />
            <span>Nova Instância</span>
          </button>
        </div>
      </div>

      {/* Dashboard Cards */}
      {dashboardData && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="bg-white p-6 rounded-lg shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Status</p>
                <p className="text-2xl font-bold text-green-600">
                  {dashboardData.status === 'online' ? 'Online' : 'Offline'}
                </p>
              </div>
              <Activity className="h-8 w-8 text-green-600" />
            </div>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Instâncias</p>
                <p className="text-2xl font-bold text-blue-600">
                  {dashboardData.active_instances}/{dashboardData.total_instances}
                </p>
              </div>
              <Users className="h-8 w-8 text-blue-600" />
            </div>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Mensagens Hoje</p>
                <p className="text-2xl font-bold text-purple-600">
                  {dashboardData.messages_today}
                </p>
              </div>
              <MessageSquare className="h-8 w-8 text-purple-600" />
            </div>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Evolution API</p>
                <p className="text-sm font-bold text-green-600">
                  {dashboardData.evolution_api.status}
                </p>
              </div>
              <CheckCircle className="h-8 w-8 text-green-600" />
            </div>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Enviar Mensagem */}
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-lg font-semibold mb-4">📤 Enviar Mensagem</h2>
          
          <form onSubmit={sendMessage} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Número do WhatsApp
              </label>
              <input
                type="text"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                placeholder="5511999999999"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Mensagem
              </label>
              <textarea
                value={messageText}
                onChange={(e) => setMessageText(e.target.value)}
                placeholder="Digite sua mensagem..."
                rows={4}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Instância
              </label>
              <select
                value={instanceName}
                onChange={(e) => setInstanceName(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="autocred-main">autocred-main</option>
                {instances.map((instance) => (
                  <option key={instance.instanceName} value={instance.instanceName}>
                    {instance.instanceName}
                  </option>
                ))}
              </select>
            </div>
            
            <button
              type="submit"
              disabled={sendingMessage}
              className="w-full flex items-center justify-center space-x-2 px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 disabled:opacity-50"
            >
              {sendingMessage ? (
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
              ) : (
                <Send className="h-4 w-4" />
              )}
              <span>{sendingMessage ? 'Enviando...' : 'Enviar Mensagem'}</span>
            </button>
          </form>
        </div>

        {/* QR Code */}
        {showQrCode && (
          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-lg font-semibold mb-4">📱 QR Code WhatsApp</h2>
            
            <div className="text-center">
              {qrCode ? (
                <div>
                  <img src={qrCode} alt="QR Code" className="mx-auto mb-4 border rounded-lg" />
                  <p className="text-sm text-gray-600">
                    Escaneie este QR Code com o WhatsApp para conectar
                  </p>
                </div>
              ) : (
                <div className="flex items-center justify-center h-32">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600"></div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Mensagens Recentes */}
      <div className="bg-white p-6 rounded-lg shadow">
        <h2 className="text-lg font-semibold mb-4">💬 Mensagens Recentes</h2>
        
        {messages.length > 0 ? (
          <div className="space-y-3">
            {messages.slice(0, 10).map((message) => (
              <div key={message.id} className="flex items-start space-x-3 p-3 bg-gray-50 rounded-lg">
                <div className="flex-shrink-0">
                  {message.status === 'sent' ? (
                    <Send className="h-5 w-5 text-green-600" />
                  ) : (
                    <MessageCircle className="h-5 w-5 text-blue-600" />
                  )}
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-medium text-gray-900">
                      {message.number}
                    </p>
                    <div className="flex items-center space-x-2 text-xs text-gray-500">
                      <Clock className="h-3 w-3" />
                      <span>{new Date(message.timestamp).toLocaleString()}</span>
                    </div>
                  </div>
                  <p className="text-sm text-gray-600 mt-1">{message.text}</p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8">
            <MessageCircle className="h-12 w-12 text-gray-400 mx-auto mb-3" />
            <p className="text-gray-500">Nenhuma mensagem ainda</p>
          </div>
        )}
      </div>

      {/* Instâncias */}
      <div className="bg-white p-6 rounded-lg shadow">
        <h2 className="text-lg font-semibold mb-4">🔗 Instâncias WhatsApp</h2>
        
        {instances.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {instances.map((instance) => (
              <div key={instance.instanceName} className="border border-gray-200 rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-medium text-gray-900">{instance.instanceName}</h3>
                  <span className={`px-2 py-1 text-xs rounded-full ${
                    instance.status === 'connected' 
                      ? 'bg-green-100 text-green-800' 
                      : 'bg-gray-100 text-gray-800'
                  }`}>
                    {instance.status}
                  </span>
                </div>
                <div className="text-sm text-gray-600">
                  <p>Conexão: {instance.connectionStatus}</p>
                  <p>Criado: {new Date(instance.created_at).toLocaleDateString()}</p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8">
            <AlertCircle className="h-12 w-12 text-gray-400 mx-auto mb-3" />
            <p className="text-gray-500">Nenhuma instância encontrada</p>
            <button
              onClick={createInstance}
              className="mt-3 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              Criar Primeira Instância
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default WhatsApp; 