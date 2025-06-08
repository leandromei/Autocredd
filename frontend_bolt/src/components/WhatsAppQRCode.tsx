import React, { useEffect, useState } from 'react';
import { Button } from './ui/button';
import { WhatsAppService } from '../services/whatsapp.service';
import { RefreshCw, ExternalLink, Smartphone, Wifi, AlertCircle } from 'lucide-react';

interface WhatsAppQRCodeProps {
  instanceName?: string;
  agentId?: string;
  agentName?: string;
  onConnected?: () => void;
  onError?: (error: string) => void;
}

export const WhatsAppQRCode: React.FC<WhatsAppQRCodeProps> = ({ 
  instanceName, 
  agentId, 
  agentName, 
  onConnected, 
  onError 
}) => {
  const [qrCode, setQRCode] = useState<string>('');
  const [status, setStatus] = useState<string>('');
  const [error, setError] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [connectedInstance, setConnectedInstance] = useState<string>('');
  const [retryCount, setRetryCount] = useState<number>(0);
  const whatsappService = WhatsAppService.getInstance();

  const initializeInstance = async () => {
    try {
      setIsLoading(true);
      setError('');
      setStatus('Conectando WhatsApp para agente...');
      
      console.log('🚀 Iniciando conexão WhatsApp para agente:', agentId || instanceName);
      
      if (agentId) {
        // Usar endpoint específico para agentes
        const response = await fetch(`https://autocred-evolution-api-production.up.railway.app/instance/create`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ instanceName: agentId })
        });
        
        if (!response.ok) {
          throw new Error(`Erro ao conectar agente: ${response.status}`);
        }
        
        const createResult = await response.json();
        console.log('📱 Create Result para agente:', createResult);
        
        // Obter QR Code
        const qrResponse = await fetch(`https://autocred-evolution-api-production.up.railway.app/instance/qrcode/${agentId}`);
        const qrResult = await qrResponse.json();
        
        if (qrResult.qrcode) {
          console.log('✅ QR Code obtido para agente!');
          setQRCode(qrResult.qrcode);
          setStatus(`QR Code gerado para ${agentName || 'agente'}! Escaneie com seu WhatsApp.`);
          setConnectedInstance(agentId);
          
          // Iniciar verificação de status
          startStatusPolling(agentId);
        } else if (qrResult.message) {
          setError(qrResult.message);
        }
      } else {
        // Usar instanceName se não tiver agentId
        const instanceToUse = instanceName || 'autocred-default';
        
        // Criar instância
        const response = await fetch(`https://autocred-evolution-api-production.up.railway.app/instance/create`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ instanceName: instanceToUse })
        });
        
        // Obter QR Code
        const qrResponse = await fetch(`https://autocred-evolution-api-production.up.railway.app/instance/qrcode/${instanceToUse}`);
        const qrResult = await qrResponse.json();
        
        if (qrResult.qrcode) {
          console.log('✅ QR Code obtido!');
          setQRCode(qrResult.qrcode);
          setStatus('QR Code gerado! Escaneie com seu WhatsApp.');
          setConnectedInstance(instanceToUse);
          
          // Iniciar verificação de status
          startStatusPolling(instanceToUse);
        }
      }
      
    } catch (err: any) {
      console.error('❌ Erro ao inicializar:', err);
      const errorMessage = err.message || 'Erro ao conectar WhatsApp';
      setError(errorMessage);
      if (onError) {
        onError(errorMessage);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const startStatusPolling = (instance: string) => {
    const statusCheck = setInterval(async () => {
      try {
        // Verificar status na API Railway
        const response = await fetch(`https://autocred-evolution-api-production.up.railway.app/instance/status/${instance}`);
        const statusResult = await response.json();
        
        console.log('📊 Status check:', statusResult);
        
        if (statusResult.connected || statusResult.status === 'open') {
          console.log('🎉 WhatsApp conectado!');
          setStatus('✅ WhatsApp conectado com sucesso!');
          clearInterval(statusCheck);
          if (onConnected) {
            onConnected();
          }
        }
      } catch (error) {
        console.error('Erro verificando status:', error);
      }
    }, 3000);
    
    // Limpar após 2 minutos
    setTimeout(() => {
      clearInterval(statusCheck);
    }, 120000);
  };

  const openEvolutionManager = () => {
    const managerUrl = 'https://autocred-evolution-api-production.up.railway.app/manager';
    window.open(managerUrl, '_blank', 'width=1200,height=800');
  };

  const retryConnection = () => {
    setRetryCount(0);
    setQRCode('');
    setError('');
    initializeInstance();
  };

  useEffect(() => {
    initializeInstance();
  }, []);

  return (
    <div className="space-y-4">
      {/* Status Header */}
      <div className="text-center">
        <div className="flex items-center justify-center gap-2 mb-2">
          <Smartphone className="w-5 h-5 text-green-600" />
          <h3 className="text-lg font-semibold text-gray-900">
            {agentName ? `Conectar WhatsApp - ${agentName}` : 'Conectar WhatsApp'}
          </h3>
        </div>
        
        {agentId && (
          <p className="text-sm text-blue-600 font-medium">
            🤖 Agente ID: {agentId}
          </p>
        )}
        
        {connectedInstance && (
          <p className="text-sm text-green-600 font-medium">
            ✅ Instância: {connectedInstance}
          </p>
        )}
      </div>

      {/* QR Code Display - APENAS REAL */}
      {qrCode && !error && (
        <div className="text-center">
          <div className="bg-white p-4 rounded-lg border border-gray-200 inline-block">
            <img 
              src={qrCode.startsWith('data:') ? qrCode : `data:image/png;base64,${qrCode}`}
              alt="QR Code WhatsApp"
              className="w-64 h-64 mx-auto"
            />
          </div>
          
          <div className="mt-4 space-y-2 text-sm text-gray-600">
            <p className="font-medium text-gray-800">📱 Como conectar:</p>
            <ol className="text-left space-y-1 bg-gray-50 p-3 rounded-lg max-w-md mx-auto">
              <li>1. Abra o <strong>WhatsApp</strong> no seu celular</li>
              <li>2. Toque nos <strong>3 pontos</strong> → <strong>Aparelhos conectados</strong></li>
              <li>3. Toque em <strong>"Conectar um aparelho"</strong></li>
              <li>4. Escaneie o QR Code acima</li>
            </ol>
          </div>
        </div>
      )}

      {/* Loading State */}
      {isLoading && !qrCode && !error && (
        <div className="text-center py-8">
          <RefreshCw className="w-8 h-8 text-blue-600 animate-spin mx-auto mb-3" />
          <p className="text-gray-600">{status || 'Gerando QR Code...'}</p>
        </div>
      )}

      {/* Error State */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <div className="flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-red-600 mt-0.5 flex-shrink-0" />
            <div className="flex-1">
              <h4 className="text-red-800 font-medium mb-2">Erro ao conectar</h4>
              <div className="text-red-700 text-sm whitespace-pre-line mb-3">
                {error}
              </div>
              <div className="flex gap-2">
                <Button
                  onClick={retryConnection}
                  variant="outline"
                  size="sm"
                  className="border-red-300 text-red-700 hover:bg-red-50"
                >
                  <RefreshCw className="w-4 h-4 mr-1" />
                  Tentar Novamente
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Manager Web Button */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <div className="flex items-start gap-3">
          <ExternalLink className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
          <div className="flex-1">
            <h4 className="text-blue-800 font-medium mb-2">Manager Web da Evolution API</h4>
            <p className="text-blue-700 text-sm mb-3">
              Se não conseguir gerar QR Code automaticamente, use o Manager Web oficial
            </p>
            <Button
              onClick={openEvolutionManager}
              className="bg-blue-600 hover:bg-blue-700 text-white"
              size="sm"
            >
              <ExternalLink className="w-4 h-4 mr-2" />
              🚀 Abrir Manager Web
            </Button>
          </div>
        </div>
      </div>

      {/* Status Display */}
      {status && !error && (
        <div className="text-center">
          <div className="inline-flex items-center gap-2 px-3 py-2 bg-green-50 text-green-700 rounded-lg text-sm">
            <Wifi className="w-4 h-4" />
            <span>{status}</span>
          </div>
        </div>
      )}
    </div>
  );
}; 