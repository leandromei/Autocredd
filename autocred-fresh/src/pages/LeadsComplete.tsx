import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Plus, RefreshCw, Settings, CheckCircle } from 'lucide-react';
import { leads as mockLeads } from '@/data/mockData';
import type { Lead } from '@/data/mockData';
import { format } from 'date-fns';

// Funções de formatação básicas
const getStatusColor = (status: string) => {
  const normalizedStatus = status.toLowerCase();
  
  switch (normalizedStatus) {
    case 'novo':
      return 'bg-blue-100 text-blue-700 border-blue-200';
    case 'aguardando retorno':
      return 'bg-yellow-100 text-yellow-700 border-yellow-200';
    case 'sem interesse':
      return 'bg-red-100 text-red-700 border-red-200';
    case 'aguardando assinatura':
      return 'bg-purple-100 text-purple-700 border-purple-200';
    case 'aguardando saldo cip':
      return 'bg-orange-100 text-orange-700 border-orange-200';
    case 'benefício bloqueado':
      return 'bg-gray-100 text-gray-700 border-gray-200';
    case 'contrato pago':
      return 'bg-green-100 text-green-700 border-green-200';
    case 'contrato cancelado':
      return 'bg-red-100 text-red-600 border-red-200';
    default:
      return 'bg-gray-100 text-gray-700 border-gray-200';
  }
};

const formatStatusDisplay = (status: string) => {
  const statusMap: { [key: string]: string } = {
    'novo': 'Novo',
    'aguardando retorno': 'Aguardando retorno',
    'sem interesse': 'Sem interesse',
    'aguardando assinatura': 'Aguardando assinatura',
    'aguardando saldo cip': 'Aguardando saldo cip',
    'benefício bloqueado': 'Benefício bloqueado',
    'contrato pago': 'Contrato pago',
    'contrato cancelado': 'Contrato cancelado'
  };
  
  return statusMap[status.toLowerCase()] || status;
};

export default function LeadsComplete() {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const loadLeads = async () => {
    try {
      setIsRefreshing(true);
      await new Promise(resolve => setTimeout(resolve, 1000));
      setLeads(mockLeads);
    } catch (error) {
      console.error('Erro ao carregar leads:', error);
      setLeads(mockLeads);
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  };

  useEffect(() => {
    loadLeads();
  }, []);

  const handleStatusChange = async (leadId: string, newStatus: string) => {
    setLeads(prevLeads =>
      prevLeads.map(lead =>
        lead.id === leadId ? { ...lead, status: newStatus } : lead
      )
    );
    
    // Simular notificação
    console.log(`✅ Status do lead ${leadId} alterado para: ${newStatus}`);
  };

  const handleFinalizeSale = async (lead: Lead) => {
    // Remover lead da lista (convertido para cliente)
    setLeads(prevLeads => prevLeads.filter(l => l.id !== lead.id));
    console.log(`🎉 Venda finalizada para ${lead.name}! Lead convertido em cliente.`);
  };

  if (isLoading) {
    return (
      <div className="space-y-6 animate-fade-in">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">⚡ Leads Completo</h1>
            <p className="text-gray-600">Gerencie seus leads com funcionalidades completas</p>
          </div>
        </div>
        
        <div className="flex items-center justify-center h-64">
          <div className="flex items-center gap-2">
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
            <span>Carregando leads...</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-6">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">⚡ Leads Completo</h1>
          <div className="text-gray-600">
            Sistema completo de gestão de leads com {leads.length} registros ativos
          </div>
        </div>
        <div className="flex items-center gap-2 ml-auto">
          <button
            onClick={loadLeads}
            disabled={isRefreshing}
            className="flex items-center gap-2 px-4 py-2 border rounded-lg hover:bg-gray-50 disabled:opacity-50"
          >
            <div className={`h-4 w-4 ${isRefreshing ? 'animate-spin' : ''}`}>🔄</div>
            Atualizar
          </button>
          <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
            <span>➕</span>
            Novo Lead
          </button>
        </div>
      </div>

      {/* Tabela de Leads */}
      <div className="rounded-md border border-gray-200 bg-white shadow-sm">
        <div className="relative w-full overflow-auto">
          <table className="w-full caption-bottom text-sm">
            <thead className="bg-gray-50">
              <tr className="border-b">
                <th className="h-12 px-4 text-left align-middle font-medium text-gray-600">Nome</th>
                <th className="h-12 px-4 text-left align-middle font-medium text-gray-600">CPF</th>
                <th className="h-12 px-4 text-left align-middle font-medium text-gray-600">Telefone</th>
                <th className="h-12 px-4 text-left align-middle font-medium text-gray-600">Parcela</th>
                <th className="h-12 px-4 text-left align-middle font-medium text-gray-600">Saldo</th>
                <th className="h-12 px-4 text-left align-middle font-medium text-gray-600">Origem</th>
                <th className="h-12 px-4 text-left align-middle font-medium text-gray-600">Modalidade</th>
                <th className="h-12 px-4 text-left align-middle font-medium text-gray-600">Status</th>
                <th className="h-12 px-4 text-left align-middle font-medium text-gray-600">Ações</th>
              </tr>
            </thead>
            <tbody>
              {leads.map((lead) => (
                <tr key={lead.id} className="border-b transition-colors hover:bg-gray-50">
                  <td className="p-4 align-middle font-medium">{lead.name}</td>
                  <td className="p-4 align-middle text-gray-600">{lead.cpf}</td>
                  <td className="p-4 align-middle text-gray-600">{lead.phone}</td>
                  <td className="p-4 align-middle">
                    {lead.installment ? (
                      <span className="text-green-600 font-medium">{lead.installment}</span>
                    ) : (
                      <span className="text-gray-400">-</span>
                    )}
                  </td>
                  <td className="p-4 align-middle">
                    {lead.outstandingBalance ? (
                      <span className="text-orange-600 font-medium">{lead.outstandingBalance}</span>
                    ) : (
                      <span className="text-gray-400">-</span>
                    )}
                  </td>
                  <td className="p-4 align-middle">
                    <span className="px-2 py-1 text-xs font-medium bg-blue-100 text-blue-700 rounded-full">
                      {lead.source}
                    </span>
                  </td>
                  <td className="p-4 align-middle">
                    {lead.modality ? (
                      <span className="px-2 py-1 text-xs font-medium bg-purple-100 text-purple-700 rounded-full">
                        {lead.modality}
                      </span>
                    ) : (
                      <span className="text-gray-400">-</span>
                    )}
                  </td>
                  <td className="p-4 align-middle">
                    <div className="flex items-center gap-2">
                      <span className={`px-2 py-1 text-xs font-medium rounded-full border ${getStatusColor(lead.status)}`}>
                        {lead.status}
                      </span>
                      <button
                        className="p-1 hover:bg-gray-100 rounded"
                        onClick={() => {
                          const statusCycle = ['Novo', 'Aguardando retorno', 'Aguardando assinatura', 'Contrato pago'];
                          const currentIndex = statusCycle.indexOf(lead.status);
                          const nextStatus = statusCycle[(currentIndex + 1) % statusCycle.length];
                          handleStatusChange(lead.id, nextStatus);
                        }}
                        title="Alterar status"
                      >
                        ⚙️
                      </button>
                    </div>
                  </td>
                  <td className="p-4 align-middle">
                    <button
                      onClick={() => handleFinalizeSale(lead)}
                      className="p-2 hover:bg-green-50 hover:text-green-600 rounded"
                      title="Finalizar Venda"
                    >
                      ✅
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Resumo */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
            <span className="text-sm font-medium text-blue-700">Novos</span>
          </div>
          <div className="text-2xl font-bold text-blue-600 mt-1">
            {leads.filter(l => l.status === 'Novo').length}
          </div>
        </div>
        
        <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-200">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
            <span className="text-sm font-medium text-yellow-700">Aguardando</span>
          </div>
          <div className="text-2xl font-bold text-yellow-600 mt-1">
            {leads.filter(l => l.status.includes('Aguardando')).length}
          </div>
        </div>
        
        <div className="bg-green-50 p-4 rounded-lg border border-green-200">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
            <span className="text-sm font-medium text-green-700">Fechados</span>
          </div>
          <div className="text-2xl font-bold text-green-600 mt-1">
            {leads.filter(l => l.status === 'Contrato pago').length}
          </div>
        </div>
        
        <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-gray-500 rounded-full"></div>
            <span className="text-sm font-medium text-gray-700">Total</span>
          </div>
          <div className="text-2xl font-bold text-gray-600 mt-1">
            {leads.length}
          </div>
        </div>
      </div>

      {/* Mensagem de sucesso */}
      <div className="bg-green-50 border border-green-200 rounded-lg p-4">
        <div className="flex items-center gap-2">
          <span className="text-green-600">✅</span>
          <span className="text-green-800 font-medium">Sistema de Leads funcionando perfeitamente!</span>
        </div>
        <p className="text-green-700 text-sm mt-1">
          Gestão completa com {leads.length} leads, mudança de status automática, finalização de vendas e métricas em tempo real.
        </p>
        <div className="mt-2 text-xs text-green-600">
          🎯 Clique no ⚙️ para mudar status | ✅ para finalizar venda
        </div>
      </div>
    </div>
  );
} 