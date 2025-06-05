import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { MessageCircle, Send, Upload, Users, TrendingUp, Clock, Settings, Image, FileText } from 'lucide-react';

export default function WhatsAppProspecting() {
  const [message, setMessage] = useState('');
  const [sending, setSending] = useState(false);

  const campaigns = [
    {
      id: 1,
      name: 'Consignado Especial',
      status: 'ativo',
      recipients: 1500,
      sent: 890,
      delivered: 845,
      opened: 678,
      responses: 134,
      conversions: 23
    },
    {
      id: 2,
      name: 'Black Friday Cartão',
      status: 'agendado',
      recipients: 2000,
      sent: 0,
      delivered: 0,
      opened: 0,
      responses: 0,
      conversions: 0
    },
    {
      id: 3,
      name: 'Refinanciamento Q4',
      status: 'concluido',
      recipients: 800,
      sent: 800,
      delivered: 776,
      opened: 612,
      responses: 89,
      conversions: 17
    }
  ];

  const templates = [
    {
      id: 1,
      name: 'Crédito Consignado',
      message: '🏦 *Crédito Consignado AutoCred*\n\nOlá! Você tem interesse em crédito consignado com as melhores taxas do mercado?\n\n✅ Taxa a partir de 1,2% ao mês\n✅ Aprovação em 24h\n✅ Sem consulta ao SPC/Serasa\n\nResponda *SIM* para simular sem compromisso!',
      type: 'text',
      category: 'credito'
    },
    {
      id: 2,
      name: 'Cartão Premium',
      message: '💳 *Cartão de Crédito Premium*\n\nCartão sem anuidade com limite pré-aprovado!\n\n🎁 Benefícios exclusivos:\n• Cashback em todas as compras\n• Acesso a salas VIP\n• Programa de pontos\n\nClique no link para solicitar: [LINK]',
      type: 'text',
      category: 'cartao'
    },
    {
      id: 3,
      name: 'Refinanciamento',
      message: '🏠 *Refinancie suas dívidas*\n\nQuite todas as suas dívidas com uma única parcela!\n\n📊 Simule agora:\n• Taxa reduzida\n• Prazo estendido\n• Redução até 70% das parcelas\n\nFale com nossos especialistas: [LINK]',
      type: 'text',
      category: 'refinanciamento'
    }
  ];

  const connections = [
    {
      id: 1,
      name: 'Instância Principal',
      phone: '11999999999',
      status: 'conectado',
      qrCode: false,
      lastActivity: '2 min atrás'
    },
    {
      id: 2,
      name: 'Instância Backup',
      phone: '11888888888',
      status: 'desconectado',
      qrCode: true,
      lastActivity: '1 hora atrás'
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'ativo': return 'bg-green-100 text-green-800';
      case 'agendado': return 'bg-yellow-100 text-yellow-800';
      case 'concluido': return 'bg-blue-100 text-blue-800';
      case 'pausado': return 'bg-gray-100 text-gray-800';
      case 'conectado': return 'bg-green-100 text-green-800';
      case 'desconectado': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const handleSendMessage = async () => {
    setSending(true);
    setTimeout(() => {
      setSending(false);
      setMessage('');
    }, 2000);
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">WhatsApp Business</h1>
          <p className="text-gray-600 mt-1">Marketing via WhatsApp para prospecção</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm">
            <Settings className="h-4 w-4 mr-2" />
            Configurar API
          </Button>
          <Button size="sm">
            <MessageCircle className="h-4 w-4 mr-2" />
            Nova Campanha
          </Button>
        </div>
      </div>

      {/* Metrics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Mensagens Hoje</p>
                <p className="text-2xl font-bold text-green-600">1,567</p>
                <p className="text-sm text-green-600">+22% vs ontem</p>
              </div>
              <div className="p-2 bg-green-100 rounded-lg">
                <MessageCircle className="h-6 w-6 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Taxa de Entrega</p>
                <p className="text-2xl font-bold text-blue-600">97%</p>
                <p className="text-sm text-green-600">+1% vs ontem</p>
              </div>
              <div className="p-2 bg-blue-100 rounded-lg">
                <TrendingUp className="h-6 w-6 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Taxa de Abertura</p>
                <p className="text-2xl font-bold text-purple-600">85%</p>
                <p className="text-sm text-green-600">+3% vs ontem</p>
              </div>
              <div className="p-2 bg-purple-100 rounded-lg">
                <Clock className="h-6 w-6 text-purple-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Conversões</p>
                <p className="text-2xl font-bold text-orange-600">234</p>
                <p className="text-sm text-green-600">+15% vs ontem</p>
              </div>
              <div className="p-2 bg-orange-100 rounded-lg">
                <Users className="h-6 w-6 text-orange-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* WhatsApp Connections */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MessageCircle className="h-5 w-5" />
            Conexões WhatsApp
          </CardTitle>
          <CardDescription>
            Gerencie suas instâncias do WhatsApp Business
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {connections.map((connection) => (
              <div key={connection.id} className="border rounded-lg p-4">
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <h3 className="font-medium text-gray-900">{connection.name}</h3>
                    <p className="text-sm text-gray-600">{connection.phone}</p>
                  </div>
                  <Badge className={getStatusColor(connection.status)}>
                    {connection.status}
                  </Badge>
                </div>
                
                <p className="text-sm text-gray-600 mb-3">
                  Última atividade: {connection.lastActivity}
                </p>
                
                <div className="flex gap-2">
                  {connection.qrCode && (
                    <Button variant="outline" size="sm">
                      Ver QR Code
                    </Button>
                  )}
                  <Button variant="outline" size="sm">
                    Reconectar
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Message Composer */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Send className="h-5 w-5" />
              Criar Mensagem
            </CardTitle>
            <CardDescription>
              Envie mensagens personalizadas para seus contatos
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="text-sm font-medium text-gray-700 mb-2 block">
                Lista de contatos (separados por vírgula)
              </label>
              <Textarea 
                placeholder="5511999999999, 5511888888888..."
                rows={2}
              />
            </div>

            <div>
              <label className="text-sm font-medium text-gray-700 mb-2 block">
                Mensagem ({message.length}/4096 caracteres)
              </label>
              <Textarea 
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Digite sua mensagem aqui...\n\nUse *negrito*, _itálico_ e emojis 😊"
                rows={6}
                maxLength={4096}
              />
            </div>

            <div className="flex gap-2">
              <Button variant="outline" size="sm">
                <Image className="h-4 w-4 mr-2" />
                Imagem
              </Button>
              <Button variant="outline" size="sm">
                <FileText className="h-4 w-4 mr-2" />
                Documento
              </Button>
            </div>

            <div className="flex gap-2">
              <Button 
                onClick={handleSendMessage}
                disabled={sending || !message.trim()}
                className="flex-1"
              >
                {sending ? (
                  <>
                    <Clock className="h-4 w-4 mr-2 animate-spin" />
                    Enviando...
                  </>
                ) : (
                  <>
                    <Send className="h-4 w-4 mr-2" />
                    Enviar Mensagem
                  </>
                )}
              </Button>
              <Button variant="outline">
                <Upload className="h-4 w-4 mr-2" />
                Lista
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Templates */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MessageCircle className="h-5 w-5" />
              Templates WhatsApp
            </CardTitle>
            <CardDescription>
              Modelos pré-aprovados para suas campanhas
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {templates.map((template) => (
                <div key={template.id} className="border rounded-lg p-3">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-medium text-gray-900">{template.name}</h3>
                    <Badge variant="outline" className="text-xs">
                      {template.category}
                    </Badge>
                  </div>
                  <div className="bg-gray-50 rounded-lg p-3 mb-3">
                    <p className="text-sm text-gray-700 whitespace-pre-line">
                      {template.message}
                    </p>
                  </div>
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => setMessage(template.message)}
                  >
                    Usar Template
                  </Button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Campaigns List */}
      <Card>
        <CardHeader>
          <CardTitle>Campanhas WhatsApp</CardTitle>
          <CardDescription>
            {campaigns.length} campanhas criadas
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {campaigns.map((campaign) => (
              <div key={campaign.id} className="border rounded-lg p-4">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <h3 className="font-medium text-gray-900">{campaign.name}</h3>
                    <Badge className={getStatusColor(campaign.status)}>
                      {campaign.status}
                    </Badge>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm">
                      Ver Relatório
                    </Button>
                    <Button variant="outline" size="sm">
                      Editar
                    </Button>
                  </div>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-6 gap-4 mb-3">
                  <div>
                    <p className="text-sm text-gray-600">Destinatários</p>
                    <p className="font-semibold">{campaign.recipients.toLocaleString()}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Enviadas</p>
                    <p className="font-semibold text-blue-600">{campaign.sent.toLocaleString()}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Entregues</p>
                    <p className="font-semibold text-green-600">{campaign.delivered.toLocaleString()}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Abertas</p>
                    <p className="font-semibold text-purple-600">{campaign.opened.toLocaleString()}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Respostas</p>
                    <p className="font-semibold text-orange-600">{campaign.responses}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Conversões</p>
                    <p className="font-semibold text-pink-600">{campaign.conversions}</p>
                  </div>
                </div>

                {campaign.recipients > 0 && (
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-green-600 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${(campaign.sent / campaign.recipients) * 100}%` }}
                    ></div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
} 