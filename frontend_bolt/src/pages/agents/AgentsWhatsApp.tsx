import React, { useState, useEffect } from 'react';
import { MessageSquare, Plus, Smartphone, Wifi, WifiOff, QrCode, Trash2, Send, RefreshCw, Settings, Users, Phone } from 'lucide-react';
import { 
  useListEvolutionInstances, 
  useCreateEvolutionInstance, 
  useConnectEvolutionInstance,
  useDeleteEvolutionInstance,
  useSendWhatsAppMessage,
  useEvolutionInstanceStatus,
  EvolutionInstance,
  InstanceCreate,
  MessageSend
} from '../../lib/api';

export default function AgentsWhatsApp() {
  const [selectedInstance, setSelectedInstance] = useState<string>('');
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [showQRCode, setShowQRCode] = useState(false);
  const [qrCodeData, setQRCodeData] = useState('');
  const [newInstanceName, setNewInstanceName] = useState('');
  const [messageData, setMessageData] = useState({ phone: '', message: '' });
  const [showMessageForm, setShowMessageForm] = useState(false);

  // API hooks
  const { data: instancesData, refetch: refetchInstances, isLoading } = useListEvolutionInstances();
  const createInstanceMutation = useCreateEvolutionInstance();
  const connectInstanceMutation = useConnectEvolutionInstance();
  const deleteInstanceMutation = useDeleteEvolutionInstance();
  const sendMessageMutation = useSendWhatsAppMessage();

  const instances: EvolutionInstance[] = instancesData?.instances || [];

  const handleCreateInstance = async () => {
    if (!newInstanceName.trim()) return;

    try {
      const instanceData: InstanceCreate = {
        instanceName: newInstanceName,
        webhook_by_events: true,
        events: ['QRCODE_UPDATED', 'CONNECTION_UPDATE', 'MESSAGES_UPSERT']
      };

      await createInstanceMutation.mutateAsync(instanceData);
      setNewInstanceName('');
      setShowCreateForm(false);
      refetchInstances();
      
      // Conectar automaticamente após criar
      setTimeout(() => {
        handleConnectInstance(newInstanceName);
      }, 1000);
    } catch (error) {
      console.error('Erro ao criar instância:', error);
    }
  };

  const handleConnectInstance = async (instanceName: string) => {
    try {
      const result = await connectInstanceMutation.mutateAsync(instanceName);
      
      if (result.success && result.qrcode) {
        setQRCodeData(result.qrcode);
        setSelectedInstance(instanceName);
        setShowQRCode(true);
      }
    } catch (error) {
      console.error('Erro ao conectar instância:', error);
    }
  };

  const handleDeleteInstance = async (instanceName: string) => {
    if (!confirm(`Tem certeza que deseja deletar a instância "${instanceName}"?`)) return;

    try {
      await deleteInstanceMutation.mutateAsync(instanceName);
      refetchInstances();
      
      if (selectedInstance === instanceName) {
        setSelectedInstance('');
        setShowQRCode(false);
      }
    } catch (error) {
      console.error('Erro ao deletar instância:', error);
    }
  };

  const handleSendMessage = async () => {
    if (!selectedInstance || !messageData.phone || !messageData.message) return;

    try {
      const data: MessageSend = {
        instanceName: selectedInstance,
        remoteJid: messageData.phone.includes('@') ? messageData.phone : `${messageData.phone}@s.whatsapp.net`,
        message: messageData.message
      };

      await sendMessageMutation.mutateAsync(data);
      setMessageData({ phone: '', message: '' });
      setShowMessageForm(false);
    } catch (error) {
      console.error('Erro ao enviar mensagem:', error);
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

  const getStatusIcon = (status: string, connected: boolean) => {
    if (connected) return <Wifi className="w-4 h-4 text-green-600" />;
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
            onClick={() => refetchInstances()}
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
                {instances.filter(i => i.connected).length}
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
                {instances.filter(i => !i.connected).length}
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
                {instances.filter(i => i.status === 'connecting' || i.status === 'qr_updated').length}
              </p>
            </div>
            <RefreshCw className="w-8 h-8 text-yellow-600" />
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Instances List */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-lg shadow">
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900">Instâncias WhatsApp</h2>
            </div>
            
            <div className="p-6">
              {isLoading ? (
                <div className="text-center py-8">
                  <RefreshCw className="w-8 h-8 animate-spin mx-auto text-gray-400" />
                  <p className="text-gray-500 mt-2">Carregando instâncias...</p>
                </div>
              ) : instances.length === 0 ? (
                <div className="text-center py-8">
                  <MessageSquare className="w-12 h-12 mx-auto text-gray-400" />
                  <h3 className="text-lg font-medium text-gray-900 mt-2">Nenhuma instância encontrada</h3>
                  <p className="text-gray-500 mt-1">Crie sua primeira instância WhatsApp</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {instances.map((instance) => (
                    <InstanceCard 
                      key={instance.name}
                      instance={instance}
                      isSelected={selectedInstance === instance.name}
                      onSelect={() => setSelectedInstance(instance.name)}
                      onConnect={() => handleConnectInstance(instance.name)}
                      onDelete={() => handleDeleteInstance(instance.name)}
                      getStatusColor={getStatusColor}
                      getStatusIcon={getStatusIcon}
                    />
                  ))}
                </div>
              )}
            </div>
          </div>
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
          {selectedInstance && instances.find(i => i.name === selectedInstance)?.connected && (
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
                    disabled={!messageData.phone || !messageData.message || sendMessageMutation.isPending}
                    className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    {sendMessageMutation.isPending ? (
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
                <span className="text-sm font-mono text-gray-900">localhost:8081</span>
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
                  disabled={!newInstanceName.trim() || createInstanceMutation.isPending}
                  className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  {createInstanceMutation.isPending ? 'Criando...' : 'Criar'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// Instance Card Component
interface InstanceCardProps {
  instance: EvolutionInstance;
  isSelected: boolean;
  onSelect: () => void;
  onConnect: () => void;
  onDelete: () => void;
  getStatusColor: (status: string) => string;
  getStatusIcon: (status: string, connected: boolean) => React.ReactNode;
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
  const { data: statusData } = useEvolutionInstanceStatus(instance.name);
  
  // Usar dados em tempo real se disponíveis
  const currentStatus = statusData?.status || instance.status;
  const isConnected = statusData?.connected ?? instance.connected;
  
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
            {getStatusIcon(currentStatus, isConnected)}
          </div>
          
          <div>
            <h3 className="text-sm font-medium text-gray-900">{instance.name}</h3>
            <div className="flex items-center space-x-2 mt-1">
              <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${getStatusColor(currentStatus)}`}>
                {currentStatus === 'open' ? 'Conectado' : 
                 currentStatus === 'connecting' ? 'Conectando' :
                 currentStatus === 'qr_updated' ? 'QR Atualizado' : 'Desconectado'}
              </span>
              <span className="text-xs text-gray-500">
                {new Date(instance.created_at).toLocaleDateString()}
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