import { useState, useRef, useEffect } from 'react';
import { PageHeader } from '@/components/common/PageHeader';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { 
  MessageCircle, 
  Send, 
  Pause, 
  Play,
  Users, 
  Clock, 
  TrendingUp,
  CheckCircle,
  Eye,
  Reply,
  Upload,
  Download,
  Image,
  FileText,
  Video
} from 'lucide-react';

export default function WhatsApp() {
  const [isActive, setIsActive] = useState(false);
  const [messageText, setMessageText] = useState('Olá! 👋\n\nVocê tem interesse em crédito consignado com as *melhores taxas* do mercado?\n\nTemos condições especiais para você! 💰\n\nResponda com *SIM* para mais informações.');
  const [contacts, setContacts] = useState([
    { id: 1, name: 'João Silva', phone: '(11) 99999-1111', status: 'enviado', sentAt: '14:30', viewed: true, response: 'SIM' },
    { id: 2, name: 'Maria Santos', phone: '(11) 98888-2222', status: 'pendente', sentAt: '', viewed: false, response: '' },
    { id: 3, name: 'Pedro Costa', phone: '(21) 97777-3333', status: 'entregue', sentAt: '14:25', viewed: true, response: '' },
    { id: 4, name: 'Ana Oliveira', phone: '(31) 96666-4444', status: 'falhou', sentAt: '14:20', viewed: false, response: '' },
    { id: 5, name: 'Carlos Lima', phone: '(11) 95555-5555', status: 'visualizado', sentAt: '14:15', viewed: true, response: 'NÃO' },
  ]);
  const [stats, setStats] = useState({
    totalContacts: 180,
    sent: 95,
    delivered: 88,
    viewed: 76,
    responded: 32,
    interested: 15,
    responseRate: '36.8%'
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'enviado':
        return 'bg-blue-100 text-blue-700 border-blue-200';
      case 'entregue':
        return 'bg-green-100 text-green-700 border-green-200';
      case 'visualizado':
        return 'bg-purple-100 text-purple-700 border-purple-200';
      case 'pendente':
        return 'bg-gray-100 text-gray-700 border-gray-200';
      case 'falhou':
        return 'bg-red-100 text-red-700 border-red-200';
      default:
        return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  const getResponseColor = (response: string) => {
    if (response === 'SIM') return 'text-green-600 font-medium';
    if (response === 'NÃO') return 'text-red-600 font-medium';
    return 'text-gray-400';
  };

  const handleToggleCampaign = () => {
    setIsActive(!isActive);
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <PageHeader
        title="WhatsApp Business"
        description="Campanhas de marketing via WhatsApp para maior engajamento"
      >
        <div className="flex items-center gap-2 text-green-600">
          <MessageCircle className="h-5 w-5" />
          <span className="text-sm font-medium">Marketing Digital</span>
        </div>
      </PageHeader>

      {/* Estatísticas */}
      <div className="grid grid-cols-1 md:grid-cols-7 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total de Contatos</p>
                <p className="text-2xl font-bold">{stats.totalContacts}</p>
              </div>
              <Users className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Enviadas</p>
                <p className="text-2xl font-bold text-blue-600">{stats.sent}</p>
              </div>
              <Send className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Entregues</p>
                <p className="text-2xl font-bold text-green-600">{stats.delivered}</p>
              </div>
              <CheckCircle className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Visualizadas</p>
                <p className="text-2xl font-bold text-purple-600">{stats.viewed}</p>
              </div>
              <Eye className="h-8 w-8 text-purple-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Respostas</p>
                <p className="text-2xl font-bold text-orange-600">{stats.responded}</p>
              </div>
              <Reply className="h-8 w-8 text-orange-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Interessados</p>
                <p className="text-2xl font-bold text-pink-600">{stats.interested}</p>
              </div>
              <TrendingUp className="h-8 w-8 text-pink-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Taxa de Resposta</p>
                <p className="text-2xl font-bold text-indigo-600">{stats.responseRate}</p>
              </div>
              <MessageCircle className="h-8 w-8 text-indigo-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Editor de Mensagem */}
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MessageCircle className="h-5 w-5" />
              Editor de Mensagem
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="campaign-name">Nome da Campanha</Label>
              <Input 
                id="campaign-name" 
                placeholder="Digite o nome da campanha"
                defaultValue="Campanha WhatsApp - Crédito Consignado"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="message">Mensagem WhatsApp</Label>
              <Textarea 
                id="message" 
                placeholder="Digite sua mensagem... Use *texto* para negrito e _texto_ para itálico"
                rows={6}
                value={messageText}
                onChange={(e) => setMessageText(e.target.value)}
              />
              <div className="text-xs text-muted-foreground">
                Caracteres: {messageText.length} • Suporte a emojis, negrito (*texto*) e itálico (_texto_)
              </div>
            </div>

            <div className="space-y-2">
              <Label>Anexos (Opcional)</Label>
              <div className="grid grid-cols-3 gap-2">
                <Button variant="outline" size="sm">
                  <Image className="h-4 w-4 mr-1" />
                  Imagem
                </Button>
                <Button variant="outline" size="sm">
                  <Video className="h-4 w-4 mr-1" />
                  Vídeo
                </Button>
                <Button variant="outline" size="sm">
                  <FileText className="h-4 w-4 mr-1" />
                  Arquivo
                </Button>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="schedule">Agendar Envio</Label>
              <Input 
                id="schedule" 
                type="datetime-local"
              />
            </div>

            <div className="flex gap-2">
              <Button 
                onClick={handleToggleCampaign}
                className={`flex-1 ${isActive ? 'bg-red-600 hover:bg-red-700' : 'bg-green-600 hover:bg-green-700'}`}
              >
                {isActive ? (
                  <>
                    <Pause className="h-4 w-4 mr-2" />
                    Pausar
                  </>
                ) : (
                  <>
                    <Send className="h-4 w-4 mr-2" />
                    Enviar
                  </>
                )}
              </Button>
            </div>

            <div className="flex gap-2">
              <Button variant="outline" className="flex-1">
                <Upload className="h-4 w-4 mr-2" />
                Importar Lista
              </Button>
              <Button variant="outline" className="flex-1">
                <Download className="h-4 w-4 mr-2" />
                Relatório
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Lista de Contatos e Respostas */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5" />
              Status dos Envios
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {contacts.map((contact) => (
                <div key={contact.id} className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center gap-3">
                    <MessageCircle className="h-4 w-4 text-green-600" />
                    <div>
                      <div className="font-medium">{contact.name}</div>
                      <div className="text-sm text-muted-foreground">{contact.phone}</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    {contact.viewed && (
                      <Eye className="h-4 w-4 text-blue-500" />
                    )}
                    {contact.sentAt && (
                      <span className="text-sm text-muted-foreground">
                        {contact.sentAt}
                      </span>
                    )}
                    <Badge className={`font-medium border ${getStatusColor(contact.status)}`}>
                      {contact.status}
                    </Badge>
                    <span className={`text-sm ${getResponseColor(contact.response)}`}>
                      {contact.response || '--'}
                    </span>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-4 pt-4 border-t">
              <p className="text-sm text-muted-foreground text-center">
                Mostrando 5 de {stats.totalContacts} contatos
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Preview da Mensagem WhatsApp */}
      <Card>
        <CardHeader>
          <CardTitle>Preview da Mensagem WhatsApp</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="max-w-sm mx-auto">
            <div className="bg-green-500 text-white text-center py-2 rounded-t-lg font-medium">
              <div className="flex items-center justify-center gap-2">
                <MessageCircle className="h-4 w-4" />
                AutoCred Business
              </div>
            </div>
            <div className="bg-[#e5ddd5] p-4 min-h-[200px] rounded-b-lg">
              <div className="bg-white rounded-lg p-3 shadow-sm max-w-[80%] ml-auto">
                <div className="whitespace-pre-wrap text-sm">
                  {messageText.split('*').map((part, index) => 
                    index % 2 === 1 ? <strong key={index}>{part}</strong> : part
                  )}
                </div>
                <div className="flex items-center justify-end gap-1 mt-2">
                  <span className="text-xs text-gray-500">14:30</span>
                  <CheckCircle className="h-3 w-3 text-blue-500" />
                  <CheckCircle className="h-3 w-3 text-blue-500 -ml-1" />
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Status da Campanha */}
      <Card>
        <CardHeader>
          <CardTitle>Status da Campanha</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between p-4 bg-muted rounded-lg">
            <div className="flex items-center gap-3">
              <div className={`w-3 h-3 rounded-full ${isActive ? 'bg-green-500 animate-pulse' : 'bg-gray-400'}`}></div>
              <span className="font-medium">
                {isActive ? 'Campanha Ativa - Enviando mensagens WhatsApp' : 'Campanha Pausada'}
              </span>
            </div>
            <div className="text-sm text-muted-foreground">
              {isActive ? 'Próximo envio em 10 segundos (respeitando limites da API)' : 'Aguardando início'}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
} 