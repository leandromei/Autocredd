import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Activity, MessageCircle, Users, TrendingUp, Clock, CheckCircle, AlertTriangle, Download } from 'lucide-react';

export default function WhatsAppMonitoring() {
  const metrics = [
    {
      title: 'Mensagens Hoje',
      value: '1,247',
      change: '+12%',
      icon: MessageCircle,
      color: 'blue'
    },
    {
      title: 'Conversas Ativas',
      value: '89',
      change: '+5%',
      icon: Users,
      color: 'green'
    },
    {
      title: 'Taxa de Resposta',
      value: '94%',
      change: '+3%',
      icon: TrendingUp,
      color: 'purple'
    },
    {
      title: 'Tempo Médio',
      value: '2.3min',
      change: '-8%',
      icon: Clock,
      color: 'orange'
    }
  ];

  const agentPerformance = [
    {
      name: 'Emilia',
      specialty: 'Vendas e Financeiro',
      status: 'online',
      conversations: 45,
      responseTime: '1.8min',
      satisfaction: '96%',
      conversions: 12
    },
    {
      name: 'Elias',
      specialty: 'Operacional e Gestão',
      status: 'online',
      conversations: 38,
      responseTime: '2.1min',
      satisfaction: '94%',
      conversions: 8
    }
  ];

  const recentActivity = [
    {
      time: '10:30',
      event: 'Nova conversa iniciada',
      agent: 'Emilia',
      contact: 'João Silva',
      type: 'info'
    },
    {
      time: '10:25',
      event: 'Conversão realizada',
      agent: 'Elias',
      contact: 'Maria Santos',
      type: 'success'
    },
    {
      time: '10:20',
      event: 'Tempo de resposta alto',
      agent: 'Emilia',
      contact: 'Pedro Costa',
      type: 'warning'
    },
    {
      time: '10:15',
      event: 'Cliente satisfeito (5 estrelas)',
      agent: 'Elias',
      contact: 'Ana Paula',
      type: 'success'
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'online': return 'bg-green-100 text-green-800';
      case 'busy': return 'bg-yellow-100 text-yellow-800';
      case 'offline': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'success': return <CheckCircle className="h-4 w-4 text-green-600" />;
      case 'warning': return <AlertTriangle className="h-4 w-4 text-yellow-600" />;
      case 'info': return <MessageCircle className="h-4 w-4 text-blue-600" />;
      default: return <Activity className="h-4 w-4 text-gray-600" />;
    }
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Monitoramento</h1>
          <p className="text-gray-600 mt-1">Acompanhe performance e métricas dos agentes IA</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm">
            <Download className="h-4 w-4 mr-2" />
            Exportar
          </Button>
          <Button size="sm">
            <Activity className="h-4 w-4 mr-2" />
            Relatório
          </Button>
        </div>
      </div>

      {/* Metrics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {metrics.map((metric, index) => {
          const Icon = metric.icon;
          return (
            <Card key={index}>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">{metric.title}</p>
                    <p className="text-2xl font-bold text-gray-900">{metric.value}</p>
                    <p className={`text-sm ${metric.change.startsWith('+') ? 'text-green-600' : 'text-red-600'}`}>
                      {metric.change} vs ontem
                    </p>
                  </div>
                  <div className={`p-2 rounded-lg ${
                    metric.color === 'blue' ? 'bg-blue-100' :
                    metric.color === 'green' ? 'bg-green-100' :
                    metric.color === 'purple' ? 'bg-purple-100' :
                    'bg-orange-100'
                  }`}>
                    <Icon className={`h-6 w-6 ${
                      metric.color === 'blue' ? 'text-blue-600' :
                      metric.color === 'green' ? 'text-green-600' :
                      metric.color === 'purple' ? 'text-purple-600' :
                      'text-orange-600'
                    }`} />
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Agent Performance */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5" />
              Performance dos Agentes
            </CardTitle>
            <CardDescription>
              Métricas individuais de cada agente IA
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {agentPerformance.map((agent, index) => (
              <div key={index} className="p-4 border rounded-lg space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gradient-to-br from-blue-400 to-purple-600 rounded-full flex items-center justify-center text-white font-semibold">
                      {agent.name.charAt(0)}
                    </div>
                    <div>
                      <h3 className="font-medium text-gray-900">{agent.name}</h3>
                      <p className="text-sm text-gray-600">{agent.specialty}</p>
                    </div>
                  </div>
                  <Badge className={getStatusColor(agent.status)}>
                    {agent.status}
                  </Badge>
                </div>
                
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="text-gray-600">Conversas</p>
                    <p className="font-semibold">{agent.conversations}</p>
                  </div>
                  <div>
                    <p className="text-gray-600">Tempo Resposta</p>
                    <p className="font-semibold">{agent.responseTime}</p>
                  </div>
                  <div>
                    <p className="text-gray-600">Satisfação</p>
                    <p className="font-semibold text-green-600">{agent.satisfaction}</p>
                  </div>
                  <div>
                    <p className="text-gray-600">Conversões</p>
                    <p className="font-semibold text-blue-600">{agent.conversions}</p>
                  </div>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Recent Activity */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Activity className="h-5 w-5" />
              Atividade Recente
            </CardTitle>
            <CardDescription>
              Últimas ações e eventos do sistema
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentActivity.map((activity, index) => (
                <div key={index} className="flex items-start gap-3">
                  <div className="mt-0.5">
                    {getActivityIcon(activity.type)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-gray-900">{activity.event}</p>
                    <div className="flex items-center gap-2 text-xs text-gray-600 mt-1">
                      <span>{activity.agent}</span>
                      <span>•</span>
                      <span>{activity.contact}</span>
                      <span>•</span>
                      <span>{activity.time}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Real-time Chart Placeholder */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5" />
            Gráfico de Performance em Tempo Real
          </CardTitle>
          <CardDescription>
            Acompanhe as métricas ao vivo (última atualização: agora)
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-64 bg-gradient-to-br from-blue-50 to-purple-50 rounded-lg flex items-center justify-center">
            <div className="text-center">
              <TrendingUp className="h-12 w-12 text-blue-400 mx-auto mb-4" />
              <p className="text-gray-600">Gráfico de performance em tempo real</p>
              <p className="text-sm text-gray-500 mt-1">Integração com dashboard de métricas</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
} 