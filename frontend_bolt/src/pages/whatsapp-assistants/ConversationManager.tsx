import React, { useState } from 'react';
import { 
  MessageCircle, 
  Bot, 
  Phone, 
  Clock, 
  User, 
  Search, 
  Filter, 
  MoreVertical,
  Circle,
  Pause,
  Play,
  Settings,
  Eye,
  Archive,
  Star,
  AlertCircle,
  Activity
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

// Mock data para demonstração
const mockAgents = [
  {
    id: 1,
    name: 'Vendedora Sofia',
    status: 'online',
    whatsapp: '+55 11 99999-1234',
    activeConversations: 12,
    totalMessages: 247,
    successRate: 89,
  },
  {
    id: 2,
    name: 'Assistente Lucas',
    status: 'busy',
    whatsapp: '+55 11 99999-5678',
    activeConversations: 8,
    totalMessages: 156,
    successRate: 76,
  },
  {
    id: 3,
    name: 'Consultora Ana',
    status: 'offline',
    whatsapp: '+55 11 99999-9012',
    activeConversations: 0,
    totalMessages: 89,
    successRate: 92,
  },
];

const mockConversations = [
  {
    id: 1,
    agentId: 1,
    agentName: 'Vendedora Sofia',
    clientName: 'João Silva',
    clientPhone: '+55 11 98765-4321',
    lastMessage: 'Perfeito! Quando podemos agendar uma reunião?',
    timestamp: '2 min atrás',
    status: 'active',
    priority: 'high',
    messageCount: 15,
  },
  {
    id: 2,
    agentId: 1,
    agentName: 'Vendedora Sofia',
    clientName: 'Maria Santos',
    clientPhone: '+55 11 98765-1234',
    lastMessage: 'Obrigada pelas informações. Vou analisar.',
    timestamp: '5 min atrás',
    status: 'waiting',
    priority: 'medium',
    messageCount: 8,
  },
  {
    id: 3,
    agentId: 2,
    agentName: 'Assistente Lucas',
    clientName: 'Pedro Costa',
    clientPhone: '+55 11 98765-5678',
    lastMessage: 'Qual a documentação necessária?',
    timestamp: '12 min atrás',
    status: 'active',
    priority: 'low',
    messageCount: 3,
  },
];

const ConversationManager = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedAgent, setSelectedAgent] = useState<number | null>(null);
  const [selectedConversation, setSelectedConversation] = useState<number | null>(null);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'online': return 'bg-green-500';
      case 'busy': return 'bg-yellow-500';
      case 'offline': return 'bg-gray-500';
      default: return 'bg-gray-500';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-red-500';
      case 'medium': return 'bg-yellow-500';
      case 'low': return 'bg-green-500';
      default: return 'bg-gray-500';
    }
  };

  const getConversationStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'text-green-600 bg-green-100';
      case 'waiting': return 'text-yellow-600 bg-yellow-100';
      case 'archived': return 'text-gray-600 bg-gray-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Gerenciador de Conversas</h1>
          <p className="text-muted-foreground">
            Controle todas as conversas WhatsApp dos seus agentes IA
          </p>
        </div>
        <div className="flex space-x-2">
          <Button variant="outline" size="sm">
            <Filter className="w-4 h-4 mr-2" />
            Filtros
          </Button>
          <Button size="sm">
            <Bot className="w-4 h-4 mr-2" />
            Novo Agente
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-2">
              <Bot className="w-5 h-5 text-blue-600" />
              <div>
                <p className="text-sm font-medium text-muted-foreground">Agentes Ativos</p>
                <p className="text-2xl font-bold">2</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-2">
              <MessageCircle className="w-5 h-5 text-green-600" />
              <div>
                <p className="text-sm font-medium text-muted-foreground">Conversas Ativas</p>
                <p className="text-2xl font-bold">20</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-2">
              <Clock className="w-5 h-5 text-yellow-600" />
              <div>
                <p className="text-sm font-medium text-muted-foreground">Aguardando</p>
                <p className="text-2xl font-bold">5</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-2">
              <Star className="w-5 h-5 text-purple-600" />
              <div>
                <p className="text-sm font-medium text-muted-foreground">Taxa de Sucesso</p>
                <p className="text-2xl font-bold">85%</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Agents Panel */}
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Bot className="w-5 h-5" />
              <span>Agentes IA</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {mockAgents.map((agent) => (
              <div 
                key={agent.id}
                className={`p-4 rounded-lg border cursor-pointer transition-colors ${
                  selectedAgent === agent.id ? 'bg-blue-50 border-blue-200' : 'hover:bg-gray-50'
                }`}
                onClick={() => setSelectedAgent(agent.id)}
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center space-x-3">
                    <div className="relative">
                      <Avatar className="w-10 h-10">
                        <AvatarFallback>{agent.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                      </Avatar>
                      <div className={`absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-2 border-white ${getStatusColor(agent.status)}`} />
                    </div>
                    <div>
                      <p className="font-medium">{agent.name}</p>
                      <p className="text-sm text-muted-foreground">{agent.whatsapp}</p>
                    </div>
                  </div>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="sm">
                        <MoreVertical className="w-4 h-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem>
                        <Settings className="w-4 h-4 mr-2" />
                        Configurar
                      </DropdownMenuItem>
                      <DropdownMenuItem>
                        {agent.status === 'online' ? <Pause className="w-4 h-4 mr-2" /> : <Play className="w-4 h-4 mr-2" />}
                        {agent.status === 'online' ? 'Pausar' : 'Ativar'}
                      </DropdownMenuItem>
                      <DropdownMenuItem>
                        <Eye className="w-4 h-4 mr-2" />
                        Ver Detalhes
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
                
                <div className="grid grid-cols-3 gap-2 text-center text-sm">
                  <div>
                    <p className="font-medium text-blue-600">{agent.activeConversations}</p>
                    <p className="text-muted-foreground">Ativas</p>
                  </div>
                  <div>
                    <p className="font-medium text-green-600">{agent.totalMessages}</p>
                    <p className="text-muted-foreground">Mensagens</p>
                  </div>
                  <div>
                    <p className="font-medium text-purple-600">{agent.successRate}%</p>
                    <p className="text-muted-foreground">Sucesso</p>
                  </div>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Conversations Panel */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <div className="flex justify-between items-center">
              <CardTitle className="flex items-center space-x-2">
                <MessageCircle className="w-5 h-5" />
                <span>Conversas em Andamento</span>
              </CardTitle>
              <div className="flex items-center space-x-2">
                <Input
                  placeholder="Buscar conversas..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-64"
                />
                <Button variant="outline" size="sm">
                  <Search className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="all" className="w-full">
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="all">Todas</TabsTrigger>
                <TabsTrigger value="active">Ativas</TabsTrigger>
                <TabsTrigger value="waiting">Aguardando</TabsTrigger>
                <TabsTrigger value="archived">Arquivadas</TabsTrigger>
              </TabsList>
              
              <TabsContent value="all" className="space-y-4 mt-4">
                {mockConversations.map((conversation) => (
                  <div 
                    key={conversation.id}
                    className={`p-4 rounded-lg border cursor-pointer transition-colors ${
                      selectedConversation === conversation.id ? 'bg-blue-50 border-blue-200' : 'hover:bg-gray-50'
                    }`}
                    onClick={() => setSelectedConversation(conversation.id)}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex items-start space-x-3 flex-1">
                        <Avatar className="w-10 h-10">
                          <AvatarFallback>{conversation.clientName.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                        </Avatar>
                        <div className="flex-1">
                          <div className="flex items-center space-x-2 mb-1">
                            <p className="font-medium">{conversation.clientName}</p>
                            <Badge className={`text-xs ${getConversationStatusColor(conversation.status)}`}>
                              {conversation.status}
                            </Badge>
                            <div className={`w-2 h-2 rounded-full ${getPriorityColor(conversation.priority)}`} />
                          </div>
                          <p className="text-sm text-muted-foreground mb-1">{conversation.clientPhone}</p>
                          <p className="text-sm">{conversation.lastMessage}</p>
                          <div className="flex items-center space-x-4 mt-2 text-xs text-muted-foreground">
                            <span>Agente: {conversation.agentName}</span>
                            <span>{conversation.messageCount} mensagens</span>
                            <span>{conversation.timestamp}</span>
                          </div>
                        </div>
                      </div>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="sm">
                            <MoreVertical className="w-4 h-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem>
                            <Eye className="w-4 h-4 mr-2" />
                            Ver Conversa
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <User className="w-4 h-4 mr-2" />
                            Assumir Controle
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <Archive className="w-4 h-4 mr-2" />
                            Arquivar
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </div>
                ))}
              </TabsContent>
              
              <TabsContent value="active" className="mt-4">
                <div className="text-center py-8 text-muted-foreground">
                  <MessageCircle className="w-12 h-12 mx-auto mb-4 opacity-50" />
                  <p>Nenhuma conversa ativa encontrada</p>
                </div>
              </TabsContent>
              
              <TabsContent value="waiting" className="mt-4">
                <div className="text-center py-8 text-muted-foreground">
                  <Clock className="w-12 h-12 mx-auto mb-4 opacity-50" />
                  <p>Nenhuma conversa aguardando resposta</p>
                </div>
              </TabsContent>
              
              <TabsContent value="archived" className="mt-4">
                <div className="text-center py-8 text-muted-foreground">
                  <Archive className="w-12 h-12 mx-auto mb-4 opacity-50" />
                  <p>Nenhuma conversa arquivada</p>
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>

      {/* Real-time Activity Feed */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Activity className="w-5 h-5" />
            <span>Atividade em Tempo Real</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex items-center space-x-3 p-3 bg-green-50 rounded-lg">
              <Circle className="w-3 h-3 fill-green-500 text-green-500" />
              <div className="flex-1">
                <p className="text-sm"><strong>Vendedora Sofia</strong> iniciou conversa com <strong>Carlos Lima</strong></p>
                <p className="text-xs text-muted-foreground">há 30 segundos</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-3 p-3 bg-blue-50 rounded-lg">
              <Circle className="w-3 h-3 fill-blue-500 text-blue-500" />
              <div className="flex-1">
                <p className="text-sm"><strong>Assistente Lucas</strong> respondeu para <strong>Ana Costa</strong></p>
                <p className="text-xs text-muted-foreground">há 1 minuto</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-3 p-3 bg-yellow-50 rounded-lg">
              <AlertCircle className="w-3 h-3 text-yellow-500" />
              <div className="flex-1">
                <p className="text-sm"><strong>Vendedora Sofia</strong> precisa de atenção na conversa com <strong>João Silva</strong></p>
                <p className="text-xs text-muted-foreground">há 2 minutos</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ConversationManager; 