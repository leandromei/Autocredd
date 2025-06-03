import { useState, useRef, useEffect } from 'react';
import { PageHeader } from '@/components/common/PageHeader';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { 
  MessageSquare, 
  Send, 
  Pause, 
  Play,
  Users, 
  Clock, 
  TrendingUp,
  CheckCircle,
  XCircle,
  Upload,
  Download,
  Smartphone,
  Target,
  FileText,
  Calendar,
  Eye,
  Trash2,
  DollarSign,
  Activity,
  RefreshCw,
  Plus
} from 'lucide-react';

// Interfaces
interface SMSContact {
  name: string;
  phone: string;
  custom_fields?: Record<string, any>;
}

interface SMSCampaign {
  id: string;
  name: string;
  message: string;
  status: string;
  total_count: number;
  sent_count: number;
  created_at: string;
  scheduled_date?: string;
  scheduled_time?: string;
}

interface SMSStats {
  total_campaigns: number;
  sent_campaigns: number;
  total_messages_sent: number;
  success_rate: number;
}

export default function SMS() {
  // Estados
  const [activeTab, setActiveTab] = useState<'campaigns' | 'create' | 'stats'>('campaigns');
  const [campaigns, setCampaigns] = useState<SMSCampaign[]>([]);
  const [stats, setStats] = useState<SMSStats | null>(null);
  const [balance, setBalance] = useState<string>('');
  const [loading, setLoading] = useState(false);
  
  // Estados para criação de campanha
  const [campaignName, setCampaignName] = useState('');
  const [message, setMessage] = useState('Olá! Você tem interesse em crédito consignado com as melhores taxas? Responda SIM para mais informações.');
  const [contacts, setContacts] = useState<SMSContact[]>([]);
  const [scheduledDate, setScheduledDate] = useState('');
  const [scheduledTime, setScheduledTime] = useState('');
  
  // Estados para upload
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);

  // Carregar dados iniciais
  useEffect(() => {
    loadCampaigns();
    loadStats();
    loadBalance();
  }, []);

  // Funções de API
  const loadCampaigns = async () => {
    try {
      const response = await fetch('/api/sms/campaigns');
      const data = await response.json();
      if (data.success) {
        setCampaigns(data.campaigns);
      }
    } catch (error) {
      console.error('Erro ao carregar campanhas:', error);
    }
  };

  const loadStats = async () => {
    try {
      const response = await fetch('/api/sms/stats');
      const data = await response.json();
      if (data.success) {
        setStats(data.stats);
      }
    } catch (error) {
      console.error('Erro ao carregar estatísticas:', error);
    }
  };

  const loadBalance = async () => {
    try {
      const response = await fetch('/api/sms/balance');
      const data = await response.json();
      if (data.success) {
        setBalance(data.balance);
      }
    } catch (error) {
      console.error('Erro ao consultar saldo:', error);
    }
  };

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setUploading(true);
    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await fetch('/api/sms/upload-contacts', {
        method: 'POST',
        body: formData,
      });
      const data = await response.json();
      
      if (data.success) {
        setContacts(data.contacts);
        alert(`${data.total_imported} contatos importados com sucesso!`);
      } else {
        alert(`Erro: ${data.error}`);
      }
    } catch (error) {
      alert('Erro ao importar contatos');
    } finally {
      setUploading(false);
    }
  };

  const createCampaign = async () => {
    if (!campaignName || !message || contacts.length === 0) {
      alert('Preencha todos os campos obrigatórios');
      return;
    }

    setLoading(true);
    try {
      const response = await fetch('/api/sms/create-campaign', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: campaignName,
          message: message,
          contacts: contacts,
          scheduled_date: scheduledDate || null,
          scheduled_time: scheduledTime || null,
        }),
      });

      const data = await response.json();
      if (data.success) {
        alert('Campanha criada com sucesso!');
        setCampaignName('');
        setContacts([]);
        setScheduledDate('');
        setScheduledTime('');
        loadCampaigns();
        setActiveTab('campaigns');
      } else {
        alert(`Erro: ${data.error}`);
      }
    } catch (error) {
      alert('Erro ao criar campanha');
    } finally {
      setLoading(false);
    }
  };

  const sendCampaign = async (campaignId: string) => {
    if (!confirm('Tem certeza que deseja enviar esta campanha?')) return;

    setLoading(true);
    try {
      const response = await fetch(`/api/sms/send-campaign/${campaignId}`, {
        method: 'POST',
      });

      const data = await response.json();
      if (data.success) {
        alert(`Campanha enviada! ${data.sent_count} SMS enviados.`);
        loadCampaigns();
        loadStats();
      } else {
        alert(`Erro: ${data.error}`);
      }
    } catch (error) {
      alert('Erro ao enviar campanha');
    } finally {
      setLoading(false);
    }
  };

  const deleteCampaign = async (campaignId: string) => {
    if (!confirm('Tem certeza que deseja excluir esta campanha?')) return;

    try {
      const response = await fetch(`/api/sms/campaign/${campaignId}`, {
        method: 'DELETE',
      });

      const data = await response.json();
      if (data.success) {
        alert('Campanha excluída com sucesso!');
        loadCampaigns();
        loadStats();
      } else {
        alert(`Erro: ${data.error}`);
      }
    } catch (error) {
      alert('Erro ao excluir campanha');
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'sent':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'scheduled':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'failed':
        return 'bg-red-100 text-red-800 border-red-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'sent':
        return <CheckCircle className="h-4 w-4" />;
      case 'scheduled':
        return <Clock className="h-4 w-4" />;
      case 'failed':
        return <XCircle className="h-4 w-4" />;
      default:
        return <FileText className="h-4 w-4" />;
    }
  };

  const addManualContact = () => {
    const phone = prompt('Digite o telefone (com DDD):');
    const name = prompt('Digite o nome:');
    
    if (phone && name) {
      setContacts([...contacts, { name, phone }]);
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <PageHeader
        title="SMS Marketing"
        description="Sistema completo de disparo em massa de SMS para prospecção"
      >
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 text-green-600 bg-green-50 px-3 py-1 rounded-full">
            <DollarSign className="h-4 w-4" />
            <span className="text-sm font-medium">Saldo: {balance}</span>
          </div>
          <Button onClick={loadBalance} variant="outline" size="sm">
            <RefreshCw className="h-4 w-4" />
          </Button>
        </div>
      </PageHeader>

      {/* Estatísticas */}
      {stats && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Total Campanhas</p>
                  <p className="text-2xl font-bold">{stats.total_campaigns}</p>
                </div>
                <Target className="h-8 w-8 text-blue-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Campanhas Enviadas</p>
                  <p className="text-2xl font-bold text-green-600">{stats.sent_campaigns}</p>
                </div>
                <Send className="h-8 w-8 text-green-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Total SMS</p>
                  <p className="text-2xl font-bold text-purple-600">{stats.total_messages_sent}</p>
                </div>
                <MessageSquare className="h-8 w-8 text-purple-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Taxa Sucesso</p>
                  <p className="text-2xl font-bold text-orange-600">{stats.success_rate}%</p>
                </div>
                <TrendingUp className="h-8 w-8 text-orange-600" />
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Navegação por Tabs */}
      <div className="flex border-b">
        <Button
          variant={activeTab === 'campaigns' ? 'default' : 'ghost'}
          onClick={() => setActiveTab('campaigns')}
          className="rounded-none"
        >
          <FileText className="h-4 w-4 mr-2" />
          Campanhas
        </Button>
        <Button
          variant={activeTab === 'create' ? 'default' : 'ghost'}
          onClick={() => setActiveTab('create')}
          className="rounded-none"
        >
          <Plus className="h-4 w-4 mr-2" />
          Nova Campanha
        </Button>
      </div>

      {/* Conteúdo das Tabs */}
      {activeTab === 'campaigns' && (
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-semibold">Minhas Campanhas</h3>
            <Button onClick={loadCampaigns} variant="outline" size="sm">
              <RefreshCw className="h-4 w-4 mr-2" />
              Atualizar
            </Button>
          </div>

          <div className="grid gap-4">
            {campaigns.length === 0 ? (
              <Card>
                <CardContent className="p-8 text-center">
                  <MessageSquare className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-semibold mb-2">Nenhuma campanha encontrada</h3>
                  <p className="text-muted-foreground mb-4">Crie sua primeira campanha SMS para começar</p>
                  <Button onClick={() => setActiveTab('create')}>
                    <Plus className="h-4 w-4 mr-2" />
                    Nova Campanha
                  </Button>
                </CardContent>
              </Card>
            ) : (
              campaigns.map((campaign) => (
                <Card key={campaign.id}>
                  <CardContent className="p-6">
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <h4 className="text-lg font-semibold">{campaign.name}</h4>
                        <p className="text-muted-foreground">{campaign.message}</p>
                      </div>
                      <Badge className={`${getStatusColor(campaign.status)} flex items-center gap-1`}>
                        {getStatusIcon(campaign.status)}
                        {campaign.status}
                      </Badge>
                    </div>
                    
                    <div className="grid grid-cols-3 gap-4 mb-4">
                      <div>
                        <p className="text-sm text-muted-foreground">Total Contatos</p>
                        <p className="text-xl font-bold">{campaign.total_count}</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Enviados</p>
                        <p className="text-xl font-bold text-green-600">{campaign.sent_count}</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Criado em</p>
                        <p className="text-sm">{new Date(campaign.created_at).toLocaleString()}</p>
                      </div>
                    </div>

                    {campaign.scheduled_date && (
                      <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                        <div className="flex items-center gap-2 text-blue-700">
                          <Calendar className="h-4 w-4" />
                          <span className="text-sm font-medium">
                            Agendado para: {campaign.scheduled_date} às {campaign.scheduled_time}
                          </span>
                        </div>
                      </div>
                    )}

                    <div className="flex gap-2">
                      {campaign.status === 'draft' && (
                        <Button
                          onClick={() => sendCampaign(campaign.id)}
                          disabled={loading}
                          size="sm"
                        >
                          <Send className="h-4 w-4 mr-2" />
                          Enviar
                        </Button>
                      )}
                      
                      <Button
                        onClick={() => deleteCampaign(campaign.id)}
                        variant="destructive"
                        size="sm"
                      >
                        <Trash2 className="h-4 w-4 mr-2" />
                        Excluir
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        </div>
      )}

      {activeTab === 'create' && (
        <div className="grid lg:grid-cols-2 gap-6">
          {/* Formulário de Criação */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MessageSquare className="h-5 w-5" />
                Nova Campanha SMS
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="campaign-name">Nome da Campanha</Label>
                <Input 
                  id="campaign-name" 
                  placeholder="Digite o nome da campanha"
                  value={campaignName}
                  onChange={(e) => setCampaignName(e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="message">Mensagem SMS</Label>
                <Textarea 
                  id="message" 
                  placeholder="Digite sua mensagem..."
                  rows={4}
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  maxLength={160}
                />
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>Caracteres: {message.length}/160</span>
                  <span>SMS: {Math.ceil(message.length / 160)}</span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="schedule-date">Data de Agendamento</Label>
                  <Input 
                    id="schedule-date" 
                    type="date"
                    value={scheduledDate}
                    onChange={(e) => setScheduledDate(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="schedule-time">Horário</Label>
                  <Input 
                    id="schedule-time" 
                    type="time"
                    value={scheduledTime}
                    onChange={(e) => setScheduledTime(e.target.value)}
                  />
                </div>
              </div>

              <div className="pt-4 border-t">
                <Button
                  onClick={createCampaign}
                  disabled={loading || !campaignName || !message || contacts.length === 0}
                  className="w-full"
                >
                  {loading ? (
                    <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                  ) : (
                    <Send className="h-4 w-4 mr-2" />
                  )}
                  Criar Campanha
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Gerenciamento de Contatos */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5" />
                Contatos ({contacts.length})
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex gap-2">
                <Button
                  onClick={() => fileInputRef.current?.click()}
                  disabled={uploading}
                  variant="outline"
                  className="flex-1"
                >
                  {uploading ? (
                    <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                  ) : (
                    <Upload className="h-4 w-4 mr-2" />
                  )}
                  Importar CSV
                </Button>
                <Button
                  onClick={addManualContact}
                  variant="outline"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Adicionar
                </Button>
              </div>

              <input
                ref={fileInputRef}
                type="file"
                accept=".csv"
                onChange={handleFileUpload}
                className="hidden"
              />

              <div className="text-xs text-muted-foreground p-3 bg-gray-50 rounded-lg">
                <p className="font-medium mb-2">Formato CSV esperado:</p>
                <code>nome,telefone</code><br />
                <code>João Silva,11999999999</code><br />
                <code>Maria Santos,11888888888</code>
              </div>

              {contacts.length > 0 && (
                <div className="max-h-60 overflow-y-auto space-y-2">
                  {contacts.slice(0, 10).map((contact, index) => (
                    <div key={index} className="flex justify-between items-center p-2 border rounded">
                      <div>
                        <p className="font-medium text-sm">{contact.name}</p>
                        <p className="text-xs text-muted-foreground">{contact.phone}</p>
                      </div>
                      <Button
                        onClick={() => setContacts(contacts.filter((_, i) => i !== index))}
                        variant="ghost"
                        size="sm"
                      >
                        <Trash2 className="h-3 w-3" />
                      </Button>
                    </div>
                  ))}
                  {contacts.length > 10 && (
                    <p className="text-center text-sm text-muted-foreground">
                      ... e mais {contacts.length - 10} contatos
                    </p>
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
} 