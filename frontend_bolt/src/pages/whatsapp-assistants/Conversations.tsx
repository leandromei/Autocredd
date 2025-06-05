import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { MessageCircle, Phone, Search, Filter, MoreVertical, Eye, MessageSquare, Clock, CheckCircle } from 'lucide-react';

export default function WhatsAppConversations() {
  const [searchTerm, setSearchTerm] = useState('');

  // Mock data for conversations
  const conversations = [
    {
      id: 1,
      contact: 'João Silva',
      phone: '(11) 99999-1234',
      agent: 'Emilia',
      status: 'ativo',
      lastMessage: 'Tenho interesse no empréstimo consignado.',
      timestamp: '10:30',
      unreadCount: 2,
      stage: 'qualificacao'
    },
    {
      id: 2,
      contact: 'Maria Santos',
      phone: '(11) 88888-5678',
      agent: 'Elias',
      status: 'aguardando',
      lastMessage: 'Qual seria a melhor taxa para meu perfil?',
      timestamp: '09:15',
      unreadCount: 0,
      stage: 'proposta'
    },
    {
      id: 3,
      contact: 'Pedro Costa',
      phone: '(11) 77777-9012',
      agent: 'Emilia',
      status: 'concluido',
      lastMessage: 'Obrigado! Vou assinar o contrato.',
      timestamp: 'Ontem',
      unreadCount: 0,
      stage: 'fechamento'
    },
    {
      id: 4,
      contact: 'Ana Paula',
      phone: '(11) 66666-3456',
      agent: 'Elias',
      status: 'ativo',
      lastMessage: 'Preciso de mais informações sobre os documentos.',
      timestamp: '14:22',
      unreadCount: 1,
      stage: 'documentacao'
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'ativo': return 'bg-green-100 text-green-800';
      case 'aguardando': return 'bg-yellow-100 text-yellow-800';
      case 'concluido': return 'bg-blue-100 text-blue-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStageIcon = (stage: string) => {
    switch (stage) {
      case 'qualificacao': return <MessageCircle className="h-4 w-4" />;
      case 'proposta': return <Eye className="h-4 w-4" />;
      case 'documentacao': return <MessageSquare className="h-4 w-4" />;
      case 'fechamento': return <CheckCircle className="h-4 w-4" />;
      default: return <Clock className="h-4 w-4" />;
    }
  };

  const filteredConversations = conversations.filter(conv =>
    conv.contact.toLowerCase().includes(searchTerm.toLowerCase()) ||
    conv.phone.includes(searchTerm)
  );

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Conversas WhatsApp</h1>
          <p className="text-gray-600 mt-1">Gerencie todas as conversas dos agentes IA</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm">
            <Filter className="h-4 w-4 mr-2" />
            Filtros
          </Button>
          <Button size="sm">
            <MessageCircle className="h-4 w-4 mr-2" />
            Nova Conversa
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Conversas Ativas</p>
                <p className="text-2xl font-bold text-green-600">12</p>
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
                <p className="text-sm text-gray-600">Aguardando Resposta</p>
                <p className="text-2xl font-bold text-yellow-600">5</p>
              </div>
              <div className="p-2 bg-yellow-100 rounded-lg">
                <Clock className="h-6 w-6 text-yellow-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Concluídas Hoje</p>
                <p className="text-2xl font-bold text-blue-600">8</p>
              </div>
              <div className="p-2 bg-blue-100 rounded-lg">
                <CheckCircle className="h-6 w-6 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Taxa Conversão</p>
                <p className="text-2xl font-bold text-purple-600">68%</p>
              </div>
              <div className="p-2 bg-purple-100 rounded-lg">
                <MessageSquare className="h-6 w-6 text-purple-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Search */}
      <div className="flex gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <Input
            placeholder="Buscar por nome ou telefone..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      {/* Conversations List */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MessageCircle className="h-5 w-5" />
            Lista de Conversas
          </CardTitle>
          <CardDescription>
            {filteredConversations.length} conversas encontradas
          </CardDescription>
        </CardHeader>
        <CardContent className="p-0">
          <div className="divide-y">
            {filteredConversations.map((conversation) => (
              <div key={conversation.id} className="p-4 hover:bg-gray-50 transition-colors">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4 flex-1">
                    <div className="relative">
                      <div className="w-12 h-12 bg-gradient-to-br from-green-400 to-green-600 rounded-full flex items-center justify-center text-white font-semibold">
                        {conversation.contact.charAt(0)}
                      </div>
                      {conversation.unreadCount > 0 && (
                        <div className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                          {conversation.unreadCount}
                        </div>
                      )}
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-medium text-gray-900">{conversation.contact}</h3>
                        <Badge variant="outline" className="text-xs">
                          {conversation.agent}
                        </Badge>
                        <Badge className={`text-xs ${getStatusColor(conversation.status)}`}>
                          {conversation.status}
                        </Badge>
                      </div>
                      
                      <div className="flex items-center gap-2 text-sm text-gray-600 mb-1">
                        <Phone className="h-3 w-3" />
                        {conversation.phone}
                        <span className="mx-2">•</span>
                        {getStageIcon(conversation.stage)}
                        <span className="capitalize">{conversation.stage}</span>
                      </div>
                      
                      <p className="text-sm text-gray-600 truncate">{conversation.lastMessage}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-3">
                    <span className="text-xs text-gray-500">{conversation.timestamp}</span>
                    <Button variant="ghost" size="sm">
                      <MoreVertical className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
} 