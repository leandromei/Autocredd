import { useState, useRef, useEffect } from 'react';
import { PageHeader } from '@/components/common/PageHeader';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { 
  Phone, 
  Play, 
  Pause, 
  Square, 
  Users, 
  Clock, 
  TrendingUp,
  Settings,
  Upload,
  Download,
  PhoneCall
} from 'lucide-react';

export default function UraReversa() {
  const [isActive, setIsActive] = useState(false);
  const [contacts, setContacts] = useState([
    { id: 1, phone: '(11) 99999-1111', status: 'pendente', attempts: 0 },
    { id: 2, phone: '(11) 98888-2222', status: 'chamando', attempts: 1 },
    { id: 3, phone: '(21) 97777-3333', status: 'sucesso', attempts: 2 },
    { id: 4, phone: '(31) 96666-4444', status: 'ocupado', attempts: 3 },
    { id: 5, phone: '(11) 95555-5555', status: 'não atende', attempts: 2 },
  ]);
  const [stats, setStats] = useState({
    totalContacts: 150,
    called: 75,
    answered: 25,
    interested: 8,
    successRate: '10.7%'
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'sucesso':
        return 'bg-green-100 text-green-700 border-green-200';
      case 'chamando':
        return 'bg-blue-100 text-blue-700 border-blue-200';
      case 'pendente':
        return 'bg-gray-100 text-gray-700 border-gray-200';
      case 'ocupado':
        return 'bg-yellow-100 text-yellow-700 border-yellow-200';
      case 'não atende':
        return 'bg-red-100 text-red-700 border-red-200';
      default:
        return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  const handleToggleCampaign = () => {
    setIsActive(!isActive);
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <PageHeader
        title="Ura Reversa"
        description="Sistema de discagem automática para prospecção de clientes"
      >
        <div className="flex items-center gap-2 text-blue-600">
          <Phone className="h-5 w-5" />
          <span className="text-sm font-medium">Discagem Automática</span>
        </div>
      </PageHeader>

      {/* Estatísticas */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
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
                <p className="text-sm font-medium text-muted-foreground">Chamadas Feitas</p>
                <p className="text-2xl font-bold text-blue-600">{stats.called}</p>
              </div>
              <PhoneCall className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Atendidas</p>
                <p className="text-2xl font-bold text-green-600">{stats.answered}</p>
              </div>
              <Phone className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Interessados</p>
                <p className="text-2xl font-bold text-purple-600">{stats.interested}</p>
              </div>
              <TrendingUp className="h-8 w-8 text-purple-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Taxa de Sucesso</p>
                <p className="text-2xl font-bold text-orange-600">{stats.successRate}</p>
              </div>
              <Clock className="h-8 w-8 text-orange-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Controles da Campanha */}
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Settings className="h-5 w-5" />
              Controles da Campanha
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="campaign-name">Nome da Campanha</Label>
              <Input 
                id="campaign-name" 
                placeholder="Digite o nome da campanha"
                defaultValue="Campanha Crédito Consignado"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="script">Script da Chamada</Label>
              <Textarea 
                id="script" 
                placeholder="Digite o script que será usado nas chamadas..."
                rows={4}
                defaultValue="Olá! Aqui é da AutoCred. Você tem interesse em crédito consignado com as melhores taxas do mercado?"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="max-attempts">Máx. Tentativas por Contato</Label>
              <Input 
                id="max-attempts" 
                type="number"
                min="1"
                max="5"
                defaultValue="3"
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
                    <Play className="h-4 w-4 mr-2" />
                    Iniciar
                  </>
                )}
              </Button>
              <Button variant="outline">
                <Square className="h-4 w-4 mr-2" />
                Parar
              </Button>
            </div>

            <div className="flex gap-2">
              <Button variant="outline" className="flex-1">
                <Upload className="h-4 w-4 mr-2" />
                Importar Lista
              </Button>
              <Button variant="outline" className="flex-1">
                <Download className="h-4 w-4 mr-2" />
                Exportar
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Lista de Contatos */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5" />
              Fila de Contatos
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {contacts.map((contact) => (
                <div key={contact.id} className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center gap-3">
                    <Phone className="h-4 w-4 text-muted-foreground" />
                    <span className="font-medium">{contact.phone}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-sm text-muted-foreground">
                      {contact.attempts} tentativa{contact.attempts !== 1 ? 's' : ''}
                    </span>
                    <Badge className={`font-medium border ${getStatusColor(contact.status)}`}>
                      {contact.status}
                    </Badge>
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
                {isActive ? 'Campanha Ativa - Discando automaticamente' : 'Campanha Pausada'}
              </span>
            </div>
            <div className="text-sm text-muted-foreground">
              {isActive ? 'Próxima chamada em 15 segundos' : 'Aguardando início'}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
} 