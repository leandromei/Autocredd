import React, { useState, useEffect } from 'react';
import { MessageSquare, Plus, Smartphone, Wifi, WifiOff, QrCode, Trash2, Send, RefreshCw, Settings, Users, Phone, X } from 'lucide-react';
import { WhatsAppService, WhatsAppInstance } from '../../services/whatsapp.service';

export default function AgentsWhatsApp() {
  const [selectedInstance, setSelectedInstance] = useState<string>('');
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [showQRCode, setShowQRCode] = useState(false);
  const [qrCodeData, setQRCodeData] = useState('');
  const [newInstanceName, setNewInstanceName] = useState('');
  const [messageData, setMessageData] = useState({ phone: '', message: '' });
  const [showMessageForm, setShowMessageForm] = useState(false);
  const [instances, setInstances] = useState<WhatsAppInstance[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const whatsappService = WhatsAppService.getInstance();

  const fetchInstances = async () => {
    try {
      setIsLoading(true);
      const instances = await whatsappService.listInstances();
      setInstances(instances);
    } catch (error) {
      console.error('Error fetching instances:', error);
      setError('Erro ao carregar instâncias');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchInstances();
  }, []);

  const handleCreateInstance = async () => {
    if (!newInstanceName.trim()) return;

    try {
      setIsLoading(true);
      await whatsappService.createInstance(newInstanceName);
      setNewInstanceName('');
      setShowCreateForm(false);
      await fetchInstances();
      
      // Conectar automaticamente após criar
      setTimeout(() => {
        handleConnectInstance(newInstanceName);
      }, 2000);
    } catch (error: any) {
      console.error('Erro ao criar instância:', error);
      setError('Erro ao criar instância: ' + (error.message || 'Erro desconhecido'));
    } finally {
      setIsLoading(false);
    }
  };

  const handleConnectInstance = async (instanceName: string) => {
    try {
      setIsLoading(true);
      setError(null);

      // Verificar status atual
      const status = await whatsappService.getInstanceStatus(instanceName);
      if (status.status === 'connected') {
        await fetchInstances();
        return;
      }

      // Obter QR Code
      const qrResponse = await whatsappService.getQRCode(instanceName);
      if (qrResponse.qrcode) {
        setQRCodeData(`data:image/png;base64,${qrResponse.qrcode}`);
        setSelectedInstance(instanceName);
        setShowQRCode(true);

        // Iniciar polling de status
        const checkConnection = setInterval(async () => {
          try {
            const currentStatus = await whatsappService.getInstanceStatus(instanceName);
            if (currentStatus.status === 'connected') {
              clearInterval(checkConnection);
              setShowQRCode(false);
              await fetchInstances();
            }
          } catch (error) {
            console.error('Erro verificando status:', error);
          }
        }, 3000);

        // Limpar polling após 2 minutos
        setTimeout(() => {
          clearInterval(checkConnection);
        }, 120000);
      }
    } catch (error: any) {
      console.error('Erro ao conectar:', error);
      setError('Erro ao conectar WhatsApp. Por favor, tente novamente.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteInstance = async (instanceName: string) => {
    if (!confirm(`Tem certeza que deseja deletar a instância "${instanceName}"?`)) return;

    try {
      setIsLoading(true);
      await whatsappService.deleteInstance(instanceName);
      await fetchInstances();
      
      if (selectedInstance === instanceName) {
        setSelectedInstance('');
        setShowQRCode(false);
      }
    } catch (error: any) {
      console.error('Erro ao deletar instância:', error);
      setError('Erro ao deletar instância: ' + (error.message || 'Erro desconhecido'));
    } finally {
      setIsLoading(false);
    }
  };

  const handleSendMessage = async () => {
    if (!selectedInstance || !messageData.phone || !messageData.message) return;

    try {
      setIsLoading(true);
      await whatsappService.sendMessage(
        selectedInstance,
        messageData.phone,
        messageData.message
      );
      setMessageData({ phone: '', message: '' });
      setShowMessageForm(false);
    } catch (error: any) {
      console.error('Erro ao enviar mensagem:', error);
      setError('Erro ao enviar mensagem: ' + (error.message || 'Erro desconhecido'));
    } finally {
      setIsLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'open': return 'text-green-600 bg-green-100';
      case 'connecting': case 'qr_updated': return 'text-yellow-600 bg-yellow-100';
      case 'close': case 'disconnected': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getStatusIcon = (status: string) => {
    if (status === 'open') return <Wifi className="w-4 h-4 text-green-600" />;
    if (status === 'connecting' || status === 'qr_updated') return <RefreshCw className="w-4 h-4 text-yellow-600 animate-spin" />;
    return <WifiOff className="w-4 h-4 text-red-600" />;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Agentes WhatsApp</h1>
          <p className="text-gray-600 mt-2">Gerencie conexões WhatsApp via Evolution API</p>
        </div>
        
        <div className="flex gap-3">
          <button
            onClick={() => fetchInstances()}
            className="flex items-center gap-2 px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
          >
            <RefreshCw className="w-4 h-4" />
            Atualizar
          </button>
          
          <button
            onClick={() => setShowCreateForm(true)}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Plus className="w-4 h-4" />
            Nova Instância
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Instâncias</p>
              <p className="text-2xl font-bold text-gray-900">{instances.length}</p>
            </div>
            <Phone className="w-8 h-8 text-blue-600" />
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Conectadas</p>
              <p className="text-2xl font-bold text-green-600">
                {instances.filter(i => i.instance.status === 'open').length}
              </p>
            </div>
            <Wifi className="w-8 h-8 text-green-600" />
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Desconectadas</p>
              <p className="text-2xl font-bold text-red-600">
                {instances.filter(i => i.instance.status !== 'open').length}
              </p>
            </div>
            <WifiOff className="w-8 h-8 text-red-600" />
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Conectando</p>
              <p className="text-2xl font-bold text-yellow-600">
                {instances.filter(i => i.instance.status === 'connecting' || i.instance.status === 'qr_updated').length}
              </p>
            </div>
            <RefreshCw className="w-8 h-8 text-yellow-600" />
          </div>
        </div>
      </div>

      {/* Instances Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {instances.map((instance) => (
          <div
            key={instance.instance.instanceName}
            className={`bg-white rounded-lg shadow p-6 ${
              selectedInstance === instance.instance.instanceName ? 'ring-2 ring-blue-500' : ''
            }`}
          >
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Smartphone className="w-5 h-5 text-gray-600" />
                <h3 className="font-medium">{instance.instance.instanceName}</h3>
              </div>
              <div className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(instance.instance.status)}`}>
                {instance.instance.status}
              </div>
            </div>

            <div className="flex items-center justify-between mt-4">
              <button
                onClick={() => handleConnectInstance(instance.instance.instanceName)}
                className="flex items-center gap-2 px-3 py-1.5 text-sm bg-green-600 text-white rounded hover:bg-green-700 transition-colors"
                disabled={isLoading}
              >
                {getStatusIcon(instance.instance.status)}
                {instance.instance.status === 'open' ? 'Conectado' : 'Conectar'}
              </button>

              <button
                onClick={() => handleDeleteInstance(instance.instance.instanceName)}
                className="flex items-center gap-2 px-3 py-1.5 text-sm bg-red-100 text-red-600 rounded hover:bg-red-200 transition-colors"
                disabled={isLoading}
              >
                <Trash2 className="w-4 h-4" />
                Remover
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Sidebar */}
      <div className="space-y-6">
        {/* QR Code */}
        {showQRCode && qrCodeData && (
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">QR Code</h3>
            <div className="text-center">
              <img 
                src={qrCodeData} 
                alt="QR Code WhatsApp" 
                className="mx-auto mb-4 border rounded-lg"
                style={{ maxWidth: '200px' }}
              />
              <p className="text-sm text-gray-600">
                Escaneie com o WhatsApp do dispositivo que deseja conectar
              </p>
            </div>
          </div>
        )}

        {/* Send Message */}
        {selectedInstance && instances.find(i => i.instance.instanceName === selectedInstance && i.instance.status === 'open') && (
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Enviar Mensagem</h3>
            
            <button
              onClick={() => setShowMessageForm(!showMessageForm)}
              className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
            >
              <Send className="w-4 h-4" />
              {showMessageForm ? 'Cancelar' : 'Nova Mensagem'}
            </button>

            {showMessageForm && (
              <div className="mt-4 space-y-3">
                <input
                  type="text"
                  placeholder="Número do WhatsApp (ex: 5511999999999)"
                  value={messageData.phone}
                  onChange={(e) => setMessageData(prev => ({ ...prev, phone: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                
                <textarea
                  placeholder="Digite sua mensagem..."
                  value={messageData.message}
                  onChange={(e) => setMessageData(prev => ({ ...prev, message: e.target.value }))}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                
                <button
                  onClick={handleSendMessage}
                  disabled={!messageData.phone || !messageData.message || isLoading}
                  className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  {isLoading ? (
                    <RefreshCw className="w-4 h-4 animate-spin" />
                  ) : (
                    <Send className="w-4 h-4" />
                  )}
                  Enviar
                </button>
              </div>
            )}
          </div>
        )}

        {/* Evolution API Status */}
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Status da Evolution API</h3>
          
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">URL:</span>
              <span className="text-sm font-mono text-gray-900">localhost:8080</span>
            </div>
            
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Status:</span>
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                Ativo
              </span>
            </div>
            
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Versão:</span>
              <span className="text-sm text-gray-900">v2.1.1</span>
            </div>
          </div>
        </div>
      </div>

      {/* Create Instance Modal */}
      {showCreateForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Nova Instância WhatsApp</h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Nome da Instância
                </label>
                <input
                  type="text"
                  value={newInstanceName}
                  onChange={(e) => setNewInstanceName(e.target.value)}
                  placeholder="Ex: atendimento, vendas, suporte..."
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              
              <div className="flex gap-3">
                <button
                  onClick={() => {
                    setShowCreateForm(false);
                    setNewInstanceName('');
                  }}
                  className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors"
                >
                  Cancelar
                </button>
                
                <button
                  onClick={handleCreateInstance}
                  disabled={!newInstanceName.trim() || isLoading}
                  className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  {isLoading ? 'Criando...' : 'Criar'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Error Message */}
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative">
          <span className="block sm:inline">{error}</span>
          <button
            onClick={() => setError(null)}
            className="absolute top-0 bottom-0 right-0 px-4 py-3"
          >
            <span className="sr-only">Fechar</span>
            <X className="h-5 w-5" />
          </button>
        </div>
      )}

      {/* Loading Indicator */}
      {isLoading && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 flex items-center gap-4">
            <RefreshCw className="w-6 h-6 text-blue-600 animate-spin" />
            <span className="text-gray-900">Carregando...</span>
          </div>
        </div>
      )}
    </div>
  );
}

// Instance Card Component
interface InstanceCardProps {
  instance: WhatsAppInstance;
  isSelected: boolean;
  onSelect: () => void;
  onConnect: () => void;
  onDelete: () => void;
  getStatusColor: (status: string) => string;
  getStatusIcon: (status: string) => React.ReactNode;
}

function InstanceCard({ 
  instance, 
  isSelected, 
  onSelect, 
  onConnect, 
  onDelete, 
  getStatusColor, 
  getStatusIcon 
}: InstanceCardProps) {
  // Usar dados da instância
  const currentStatus = instance.instance.status;
  const isConnected = currentStatus === 'open';
  
  return (
    <div 
      className={`border rounded-lg p-4 cursor-pointer transition-all ${
        isSelected ? 'border-blue-500 bg-blue-50' : 'border-gray-200 hover:border-gray-300'
      }`}
      onClick={onSelect}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="flex-shrink-0">
            {getStatusIcon(currentStatus)}
          </div>
          
          <div>
            <h3 className="text-sm font-medium text-gray-900">{instance.instance.instanceName}</h3>
            <div className="flex items-center space-x-2 mt-1">
              <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${getStatusColor(currentStatus)}`}>
                {currentStatus === 'open' ? 'Conectado' : 
                 currentStatus === 'connecting' ? 'Conectando' :
                 currentStatus === 'qr_updated' ? 'QR Atualizado' : 'Desconectado'}
              </span>
              <span className="text-xs text-gray-500">
                {new Date().toLocaleDateString()}
              </span>
            </div>
          </div>
        </div>
        
        <div className="flex items-center space-x-2">
          {!isConnected && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                onConnect();
              }}
              className="inline-flex items-center px-2 py-1 text-xs bg-green-600 text-white rounded hover:bg-green-700 transition-colors"
            >
              <QrCode className="w-3 h-3 mr-1" />
              Conectar
            </button>
          )}
          
          <button
            onClick={(e) => {
              e.stopPropagation();
              onDelete();
            }}
            className="inline-flex items-center px-2 py-1 text-xs bg-red-600 text-white rounded hover:bg-red-700 transition-colors"
          >
            <Trash2 className="w-3 h-3" />
          </button>
        </div>
      </div>
    </div>
  );
}