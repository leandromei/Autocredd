import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Phone, Play, Pause, Upload, Download, Settings, Users, Clock, TrendingUp } from 'lucide-react';

export default function UraReversa() {
  const [isPlaying, setIsPlaying] = useState(false);

  const campaigns = [
    {
      id: 1,
      name: 'Campanha Consignado Q4',
      status: 'ativo',
      contacts: 1250,
      called: 340,
      connected: 89,
      converted: 12,
      progress: 27
    },
    {
      id: 2,
      name: 'Refinanciamento Imóvel',
      status: 'pausado',
      contacts: 800,
      called: 156,
      connected: 34,
      converted: 5,
      progress: 19
    },
    {
      id: 3,
      name: 'Cartão de Crédito Gold',
      status: 'concluido',
      contacts: 500,
      called: 500,
      connected: 145,
      converted: 23,
      progress: 100
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'ativo': return 'bg-green-100 text-green-800';
      case 'pausado': return 'bg-yellow-100 text-yellow-800';
      case 'concluido': return 'bg-blue-100 text-blue-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">URA Reversa</h1>
          <p className="text-gray-600 mt-1">Sistema de discagem automática para prospecção</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm">
            <Upload className="h-4 w-4 mr-2" />
            Importar Lista
          </Button>
          <Button size="sm">
            <Phone className="h-4 w-4 mr-2" />
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
                <p className="text-sm text-gray-600">Ligações Hoje</p>
                <p className="text-2xl font-bold text-blue-600">487</p>
                <p className="text-sm text-green-600">+15% vs ontem</p>
              </div>
              <div className="p-2 bg-blue-100 rounded-lg">
                <Phone className="h-6 w-6 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Taxa Conexão</p>
                <p className="text-2xl font-bold text-green-600">26%</p>
                <p className="text-sm text-green-600">+3% vs ontem</p>
              </div>
              <div className="p-2 bg-green-100 rounded-lg">
                <Users className="h-6 w-6 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Tempo Médio</p>
                <p className="text-2xl font-bold text-purple-600">3.2min</p>
                <p className="text-sm text-red-600">+5% vs ontem</p>
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
                <p className="text-2xl font-bold text-orange-600">23</p>
                <p className="text-sm text-green-600">+8% vs ontem</p>
              </div>
              <div className="p-2 bg-orange-100 rounded-lg">
                <TrendingUp className="h-6 w-6 text-orange-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Campaign Control */}
      <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
            <Phone className="h-5 w-5" />
            Controle de Campanha
            </CardTitle>
          <CardDescription>
            Gerencie suas campanhas de discagem automática
          </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
          <div className="flex items-center gap-4">
              <Button 
              size="lg" 
              onClick={() => setIsPlaying(!isPlaying)}
              className={isPlaying ? 'bg-red-600 hover:bg-red-700' : 'bg-green-600 hover:bg-green-700'}
              >
              {isPlaying ? (
                  <>
                  <Pause className="h-5 w-5 mr-2" />
                  Pausar Discagem
                  </>
                ) : (
                  <>
                  <Play className="h-5 w-5 mr-2" />
                  Iniciar Discagem
                  </>
                )}
              </Button>
            
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-600">Status:</span>
              <Badge className={isPlaying ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}>
                {isPlaying ? 'Discando' : 'Parado'}
              </Badge>
            </div>

            <Button variant="outline" size="sm">
              <Settings className="h-4 w-4 mr-2" />
              Configurações
              </Button>
          </div>

          {isPlaying && (
            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <div className="flex items-center gap-3">
                <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                <div>
                  <p className="font-medium text-green-800">Discagem Ativa</p>
                  <p className="text-sm text-green-600">Chamando: (11) 99999-1234 - João Silva</p>
                </div>
              </div>
            </div>
          )}
          </CardContent>
        </Card>

      {/* Campaigns List */}
      <Card>
          <CardHeader>
          <CardTitle>Campanhas Ativas</CardTitle>
          <CardDescription>
            {campaigns.length} campanhas configuradas
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
                      <Settings className="h-4 w-4" />
                    </Button>
                  </div>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-3">
                  <div>
                    <p className="text-sm text-gray-600">Contatos</p>
                    <p className="font-semibold">{campaign.contacts.toLocaleString()}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Chamadas</p>
                    <p className="font-semibold">{campaign.called}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Conectadas</p>
                    <p className="font-semibold text-green-600">{campaign.connected}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Conversões</p>
                    <p className="font-semibold text-blue-600">{campaign.converted}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Progresso</p>
                    <p className="font-semibold">{campaign.progress}%</p>
                  </div>
            </div>

                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${campaign.progress}%` }}
                  ></div>
                </div>
              </div>
            ))}
            </div>
          </CardContent>
        </Card>

      {/* Configuration Panel */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Settings className="h-5 w-5" />
            Configurações da URA
          </CardTitle>
          <CardDescription>
            Configure parâmetros do sistema de discagem
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium text-gray-700 mb-2 block">
                Intervalo entre chamadas (segundos)
              </label>
              <Input type="number" defaultValue="10" />
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700 mb-2 block">
                Máximo de tentativas por contato
              </label>
              <Input type="number" defaultValue="3" />
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700 mb-2 block">
                Horário de funcionamento (início)
              </label>
              <Input type="time" defaultValue="09:00" />
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700 mb-2 block">
                Horário de funcionamento (fim)
              </label>
              <Input type="time" defaultValue="18:00" />
            </div>
          </div>
          
          <div className="flex gap-2">
            <Button>Salvar Configurações</Button>
            <Button variant="outline">Restaurar Padrão</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
} 