import { useState, useEffect } from 'react';
import { PageHeader } from '@/components/common/PageHeader';
import { DataTable } from '@/components/tables/DataTable';
import { TableActionMenu } from '@/components/tables/TableActionMenu';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Plus, Settings, RefreshCw, CheckCircle } from 'lucide-react';
import { leads as mockLeads } from '@/data/mockData';
import type { Lead } from '@/data/mockData';
import { format } from 'date-fns';
import { useToast } from '@/hooks/use-toast';

// Funções de formatação
const formatCPF = (value: string) => {
  const numericValue = value.replace(/\D/g, '');
  if (numericValue.length <= 11) {
    return numericValue.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
  }
  return value;
};

const formatPhone = (value: string) => {
  const numericValue = value.replace(/\D/g, '');
  if (numericValue.length <= 11) {
    if (numericValue.length <= 10) {
      return numericValue.replace(/(\d{2})(\d{4})(\d{4})/, '($1) $2-$3');
    } else {
      return numericValue.replace(/(\d{2})(\d{5})(\d{4})/, '($1) $2-$3');
    }
  }
  return value;
};

const formatCurrency = (value: string) => {
  // Remove todos os caracteres não numéricos
  const numericValue = value.replace(/\D/g, '');
  if (numericValue === '') return '';
  
  // Converte para centavos (últimos 2 dígitos são os centavos)
  const numericFloat = parseFloat(numericValue) / 100;
  
  return numericFloat.toLocaleString('pt-BR', {
    style: 'currency',
    currency: 'BRL',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  });
};

const unformatCurrency = (value: string) => {
  if (!value) return '';
  // Remove símbolos de moeda e pontos de milhares, mantém apenas números e vírgula decimal
  const cleanValue = value.replace(/[R$\s.]/g, '').replace(',', '.');
  return cleanValue;
};

const unformatCPF = (value: string) => {
  return value.replace(/\D/g, '');
};

const unformatPhone = (value: string) => {
  return value.replace(/\D/g, '');
};

const statusOptions = [
  'Novo',
  'Aguardando retorno',
  'Sem interesse',
  'Aguardando assinatura',
  'Aguardando saldo cip',
  'Benefício bloqueado',
  'Contrato pago',
  'Contrato cancelado'
];

const sourceOptions = [
  'Ura',
  'Sms',
  'Outros'
];

const modalityOptions = [
  'Portabilidade',
  'Port + Refin',
  'Contrato Novo'
];

const getStatusColor = (status: string) => {
  // Normalize status to handle both old and new formats
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
    case 'beneficio bloqueado':
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

// Function to format status display text
const formatStatusDisplay = (status: string) => {
  const statusMap: { [key: string]: string } = {
    'novo': 'Novo',
    'aguardando retorno': 'Aguardando retorno',
    'sem interesse': 'Sem interesse',
    'aguardando assinatura': 'Aguardando assinatura',
    'aguardando saldo cip': 'Aguardando saldo cip',
    'beneficio bloqueado': 'Benefício bloqueado',
    'benefício bloqueado': 'Benefício bloqueado',
    'contrato pago': 'Contrato pago',
    'contrato cancelado': 'Contrato cancelado'
  };
  
  return statusMap[status.toLowerCase()] || status;
};

// Function to format source display text
const formatSourceDisplay = (source: string) => {
  const sourceMap: { [key: string]: string } = {
    'ura': 'Ura',
    'sms': 'Sms', 
    'outros': 'Outros',
    'other': 'Outros',
    'telefone': 'Telefone',
    'email': 'Email',
    'whatsapp': 'WhatsApp',
    'site': 'Site',
    'indicacao': 'Indicação',
    'indicação': 'Indicação'
  };
  
  return sourceMap[source.toLowerCase()] || source;
};

const fetchLeads = async () => {
  try {
    const response = await fetch('http://localhost:8000/api/leads');
    if (!response.ok) {
      throw new Error('Erro ao buscar leads');
    }
    const data = await response.json();
    return data.leads || [];
  } catch (error) {
    console.error('Erro ao buscar leads:', error);
    throw error;
  }
};

const updateLeadStatus = async (leadId: string, status: string) => {
  try {
    const response = await fetch(`http://localhost:8000/api/leads/${leadId}/status`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ status }),
    });

    if (!response.ok) {
      throw new Error('Erro ao atualizar status do lead');
    }

    const result = await response.json();
    return result;
  } catch (error) {
    console.error('Erro ao atualizar status:', error);
    throw error;
  }
};

const createLead = async (leadData: any) => {
  try {
    console.log('🚀 Tentando criar lead:', leadData);
    
    // Simplificar os dados para enviar apenas o que o backend espera
    const simplifiedData = {
      name: leadData.name,
      cpf: leadData.cpf,
      phone: leadData.phone,
      modality: leadData.modality || "Portabilidade",
      source: leadData.source || "Manual",
      status: leadData.status || "Novo",
      installment: leadData.installment || null,
      outstandingBalance: leadData.outstandingBalance || null,
      observations: leadData.notes || null
    };
    
    console.log('📝 Dados simplificados:', simplifiedData);
    
    const response = await fetch('http://localhost:8000/api/leads', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        // Remover headers de autenticação para debugging
      },
      body: JSON.stringify(simplifiedData),
    });

    console.log('📡 Resposta recebida:', response.status, response.statusText);

    if (!response.ok) {
      const errorText = await response.text();
      console.error('❌ Erro na resposta:', errorText);
      throw new Error(`Erro ${response.status}: ${errorText}`);
    }

    const result = await response.json();
    console.log('✅ Lead criado com sucesso:', result);
    return result;
  } catch (error) {
    console.error('❌ Erro ao criar lead:', error);
    throw error;
  }
};

const updateLead = async (leadId: string, leadData: any) => {
  try {
    // Converter string para número para compatibilidade com backend
    const numericId = parseInt(leadId, 10);
    if (isNaN(numericId)) {
      throw new Error('ID do lead inválido');
    }

    const response = await fetch(`http://localhost:8000/api/leads/${numericId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(leadData),
    });

    if (!response.ok) {
      throw new Error('Erro ao atualizar lead');
    }

    const result = await response.json();
    return result;
  } catch (error) {
    console.error('Erro ao atualizar lead:', error);
    throw error;
  }
};

const deleteLead = async (leadId: string) => {
  try {
    // Converter string para número para compatibilidade com backend
    const numericId = parseInt(leadId, 10);
    if (isNaN(numericId)) {
      throw new Error('ID do lead inválido');
    }

    console.log('Enviando requisição DELETE para:', `http://localhost:8000/api/leads/${numericId}`);
    
    const response = await fetch(`http://localhost:8000/api/leads/${numericId}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
    });

    console.log('Resposta recebida:', response.status, response.statusText);

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Erro na resposta:', errorText);
      throw new Error(`Erro ao deletar lead: ${response.status} - ${errorText}`);
    }

    const result = await response.json();
    console.log('Lead deletado com sucesso:', result);
    return result;
  } catch (error) {
    console.error('Erro ao deletar lead:', error);
    throw error;
  }
};

export default function Leads() {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isNewLeadModalOpen, setIsNewLeadModalOpen] = useState(false);
  const [isCreatingLead, setIsCreatingLead] = useState(false);
  const [isViewLeadModalOpen, setIsViewLeadModalOpen] = useState(false);
  const [isEditLeadModalOpen, setIsEditLeadModalOpen] = useState(false);
  const [deletingLeadIds, setDeletingLeadIds] = useState<Set<string>>(new Set());
  const [finalizingSaleIds, setFinalizingSaleIds] = useState<Set<string>>(new Set());
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);
  const [editLeadForm, setEditLeadForm] = useState({
    name: '',
    cpf: '',
    phone: '',
    status: 'Novo',
    source: 'Ura',
    modality: '',
    notes: '',
    installment: '',
    outstandingBalance: ''
  });
  const [newLeadForm, setNewLeadForm] = useState({
    name: '',
    cpf: '',
    phone: '',
    status: 'Novo',
    source: 'Ura',
    modality: '',
    notes: '',
    installment: '',
    outstandingBalance: ''
  });
  const { toast } = useToast();

  const loadLeads = async () => {
    try {
      setIsRefreshing(true);
      const fetchedLeads = await fetchLeads();
      
      // Converter dados da API para formato do frontend se necessário
      const formattedLeads = fetchedLeads.map((lead: any) => {
        // Garantir que a data seja válida
        let createdAt = lead.created_at || lead.createdAt;
        if (!createdAt) {
          createdAt = new Date().toISOString(); // Usar data atual como fallback
        }
        
        // Validar se a data é válida
        const testDate = new Date(createdAt);
        if (isNaN(testDate.getTime())) {
          createdAt = new Date().toISOString(); // Usar data atual se inválida
        }

        return {
          ...lead,
          id: String(lead.id), // Converter ID de number para string
          createdAt: createdAt,
          assignedTo: lead.assigned_to_id ? `Usuário ${lead.assigned_to_id}` : 'Não atribuído',
          installment: lead.installment || '',
          outstandingBalance: lead.outstanding_balance || '',
          modality: lead.modality || '' // Preservar modalidade
        };
      });
      
      setLeads(formattedLeads);
    } catch (error) {
      console.error('Erro ao carregar leads:', error);
      // Usar dados mockados em caso de erro
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
    try {
      await updateLeadStatus(leadId, newStatus);
      
      // Atualizar estado local imediatamente
      setLeads(prevLeads => 
        prevLeads.map(lead => 
          lead.id === leadId 
            ? { ...lead, status: newStatus as Lead['status'] }
            : lead
        )
      );

      toast({
        title: "Status atualizado",
        description: `Status do lead alterado para "${formatStatusDisplay(newStatus)}" com sucesso.`,
      });

    } catch (error) {
      toast({
        title: "Erro ao alterar status",
        description: "Não foi possível alterar o status. Tente novamente.",
        variant: "destructive",
      });
    }
  };

  const handleCreateLead = async () => {
    try {
      setIsCreatingLead(true);
      
      // Validação básica
      if (!newLeadForm.name || !newLeadForm.cpf || !newLeadForm.phone) {
        toast({
          title: "Campos obrigatórios",
          description: "Nome, CPF e telefone são obrigatórios.",
          variant: "destructive",
        });
        return;
      }

      // Enviar dados sem formatação complexa primeiro para teste
      const leadData = {
        name: newLeadForm.name,
        cpf: newLeadForm.cpf, // Manter formatação visual
        phone: newLeadForm.phone, // Manter formatação visual
        modality: newLeadForm.modality || "Portabilidade",
        source: newLeadForm.source || "Manual",
        status: newLeadForm.status || "Novo",
        installment: newLeadForm.installment,
        outstandingBalance: newLeadForm.outstandingBalance,
        notes: newLeadForm.notes
      };

      console.log('🔄 Criando lead com dados:', leadData);

      const createdLead = await createLead(leadData); // Backend retorna o lead diretamente
      
      // Adicionar o novo lead à lista
      const formattedLead: Lead = {
        id: createdLead.id.toString(),
        name: createdLead.name,
        cpf: createdLead.cpf,
        phone: createdLead.phone,
        source: createdLead.source,
        modality: createdLead.modality || '',
        status: createdLead.status as Lead['status'],
        assignedTo: createdLead.assignedTo || 'Não atribuído',
        createdAt: createdLead.createdAt,
        installment: createdLead.installment,
        outstandingBalance: createdLead.outstandingBalance
      };
      
      setLeads(prevLeads => [formattedLead, ...prevLeads]);
      
      // Resetar formulário e fechar modal
      setNewLeadForm({
        name: '',
        cpf: '',
        phone: '',
        status: 'Novo',
        source: 'Ura',
        modality: '',
        notes: '',
        installment: '',
        outstandingBalance: ''
      });
      setIsNewLeadModalOpen(false);
      
      toast({
        title: "Lead criado",
        description: `Lead "${createdLead.name}" criado com sucesso.`,
      });

    } catch (error) {
      console.error('💥 Erro detalhado:', error);
      toast({
        title: "Erro ao criar lead",
        description: error instanceof Error ? error.message : "Não foi possível criar o lead. Tente novamente.",
        variant: "destructive",
      });
    } finally {
      setIsCreatingLead(false);
    }
  };

  // Handlers específicos para formatação automática - NOVO LEAD
  const handleNewLeadCPFChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatCPF(e.target.value);
    setNewLeadForm(prev => ({ ...prev, cpf: formatted }));
  };

  const handleNewLeadPhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatPhone(e.target.value);
    setNewLeadForm(prev => ({ ...prev, phone: formatted }));
  };

  const handleNewLeadInstallmentChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatCurrency(e.target.value);
    setNewLeadForm(prev => ({ ...prev, installment: formatted }));
  };

  const handleNewLeadOutstandingBalanceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatCurrency(e.target.value);
    setNewLeadForm(prev => ({ ...prev, outstandingBalance: formatted }));
  };

  const handleViewLead = (lead: Lead) => {
    setSelectedLead(lead);
    setIsViewLeadModalOpen(true);
  };

  const handleEditLead = (lead: Lead) => {
    setSelectedLead(lead);
    
    // Função auxiliar para formatar valores monetários existentes
    const formatExistingCurrency = (value: string) => {
      if (!value) return '';
      // Se já está formatado como moeda, retorna como está
      if (value.includes('R$')) return value;
      // Se é um número, formata como moeda
      const numericValue = value.replace(/[^\d,]/g, '');
      if (numericValue) {
        const cents = parseFloat(numericValue.replace(',', '.')) * 100;
        return formatCurrency(cents.toString());
      }
      return '';
    };

    setEditLeadForm({
      name: lead.name,
      cpf: formatCPF(lead.cpf),
      phone: formatPhone(lead.phone),
      status: lead.status,
      source: lead.source,
      modality: lead.modality || '',
      notes: '', // Assumindo que não temos notes no Lead atual
      installment: formatExistingCurrency(lead.installment || ''),
      outstandingBalance: formatExistingCurrency(lead.outstandingBalance || '')
    });
    setIsEditLeadModalOpen(true);
  };

  const handleUpdateLead = async () => {
    if (!selectedLead) return;

    try {
      setIsCreatingLead(true);
      
      // Validação básica
      if (!editLeadForm.name || !editLeadForm.cpf || !editLeadForm.phone) {
        toast({
          title: "Campos obrigatórios",
          description: "Nome, CPF e telefone são obrigatórios.",
          variant: "destructive",
        });
        return;
      }

      // Remover formatação antes de enviar para API
      const leadData = {
        ...editLeadForm,
        cpf: unformatCPF(editLeadForm.cpf),
        phone: unformatPhone(editLeadForm.phone),
        installment: unformatCurrency(editLeadForm.installment),
        outstandingBalance: unformatCurrency(editLeadForm.outstandingBalance)
      };

      await updateLead(selectedLead.id, leadData);
      
      // Atualizar lead na lista
      setLeads(prevLeads => 
        prevLeads.map(lead => 
          lead.id === selectedLead.id 
            ? { 
                ...lead, 
                name: editLeadForm.name,
                cpf: editLeadForm.cpf,
                phone: editLeadForm.phone,
                status: editLeadForm.status as Lead['status'],
                source: editLeadForm.source,
                modality: editLeadForm.modality,
                installment: editLeadForm.installment,
                outstandingBalance: editLeadForm.outstandingBalance
              }
            : lead
        )
      );
      
      setIsEditLeadModalOpen(false);
      setSelectedLead(null);
      
      toast({
        title: "Lead atualizado",
        description: `Lead "${editLeadForm.name}" atualizado com sucesso.`,
      });

    } catch (error) {
      toast({
        title: "Erro ao atualizar lead",
        description: "Não foi possível atualizar o lead. Tente novamente.",
        variant: "destructive",
      });
    } finally {
      setIsCreatingLead(false);
    }
  };

  // Handlers específicos para formatação automática - EDIT LEAD
  const handleEditLeadCPFChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatCPF(e.target.value);
    setEditLeadForm(prev => ({ ...prev, cpf: formatted }));
  };

  const handleEditLeadPhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatPhone(e.target.value);
    setEditLeadForm(prev => ({ ...prev, phone: formatted }));
  };

  const handleEditLeadInstallmentChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatCurrency(e.target.value);
    setEditLeadForm(prev => ({ ...prev, installment: formatted }));
  };

  const handleEditLeadOutstandingBalanceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatCurrency(e.target.value);
    setEditLeadForm(prev => ({ ...prev, outstandingBalance: formatted }));
  };

  const handleDeleteLead = async (lead: Lead) => {
    if (!confirm(`Tem certeza que deseja excluir o lead "${lead.name}"?`)) {
      return;
    }

    try {
      setDeletingLeadIds(prev => new Set(prev).add(lead.id));
      
      console.log('Iniciando exclusão do lead:', lead.id, lead.name);
      const result = await deleteLead(lead.id);
      console.log('Lead excluído com sucesso:', result);
      
      // Recarregar a lista de leads para ter certeza que está atualizada
      await loadLeads();
      
      toast({
        title: "Lead excluído",
        description: `Lead "${lead.name}" excluído com sucesso.`,
      });

    } catch (error) {
      console.error('Erro ao excluir lead:', error);
      
      // Tentar remover da lista local como fallback
      if (error instanceof Error && error.message.includes('Failed to fetch')) {
        console.log('Problema de conectividade detectado, removendo da lista local...');
        setLeads(prevLeads => prevLeads.filter(l => l.id !== lead.id));
        toast({
          title: "Lead removido",
          description: `Lead "${lead.name}" removido da lista (verificar conectividade).`,
          variant: "destructive",
        });
      } else {
        toast({
          title: "Erro ao excluir lead",
          description: error instanceof Error ? error.message : "Não foi possível excluir o lead. Tente novamente.",
          variant: "destructive",
        });
      }
    } finally {
      setDeletingLeadIds(prev => {
        const newSet = new Set(prev);
        newSet.delete(lead.id);
        return newSet;
      });
    }
  };

  const handleFinalizeSale = async (lead: Lead) => {
    setFinalizingSaleIds(prev => new Set(prev).add(lead.id));
    
    try {
      console.log('🎯 Iniciando finalização da venda para:', lead.name);
      
      // Chamar API real de finalização de venda
      const response = await fetch('http://localhost:8000/api/leads/finalize-sale', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          leadId: lead.id
        }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Erro ${response.status}: ${errorText}`);
      }

      const result = await response.json();
      console.log('✅ Resposta da API:', result);

      if (result.success) {
        // Criar cliente na API de clientes (sem email)
        const clientData = {
          name: lead.name,
          cpf: lead.cpf,
          phone: lead.phone,
          status: "ativo",
          notes: `Cliente convertido do lead. Modalidade: ${lead.modality || 'N/A'}. Parcela: ${lead.installment || 'N/A'}`,
          installment: lead.installment || 'R$ 450,00',
          outstandingBalance: lead.outstandingBalance || 'R$ 15.000,00',
          source: "Lead Convertido",
          modality: lead.modality || "Portabilidade",
          assignedTo: lead.assignedTo || "Admin AutoCred"
        };

        console.log('📝 Criando cliente:', clientData);
        
        const clientResponse = await fetch('http://localhost:8000/api/clients', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(clientData),
        });

        if (clientResponse.ok) {
          const clientResult = await clientResponse.json();
          console.log('✅ Cliente criado:', clientResult);
        } else {
          console.warn('⚠️ Erro ao criar cliente, mas venda foi finalizada');
        }

        // Remover lead da lista (foi convertido)
        setLeads(prevLeads => prevLeads.filter(l => l.id !== lead.id));

        toast({
          title: "🎉 Venda finalizada com sucesso!",
          description: `${lead.name} foi transferido para Clientes e Contratos`,
        });
      } else {
        throw new Error(result.message || 'Erro desconhecido');
      }

    } catch (error) {
      console.error('💥 Erro ao finalizar venda:', error);
      toast({
        title: "Erro ao finalizar venda",
        description: error instanceof Error ? error.message : "Não foi possível finalizar a venda. Tente novamente.",
        variant: "destructive",
      });
    } finally {
      setFinalizingSaleIds(prev => {
        const newSet = new Set(prev);
        newSet.delete(lead.id);
        return newSet;
      });
    }
  };

  const columns = [
    {
      accessorKey: 'name',
      header: 'Nome',
    },
    {
      accessorKey: 'cpf',
      header: 'CPF',
    },
    {
      accessorKey: 'phone',
      header: 'Telefone',
    },
    {
      accessorKey: 'installment',
      header: 'Parcela',
      cell: ({ row }: { row: any }) => {
        const installment = row.getValue('installment') as string;
        return installment ? (
          <span>{installment}</span>
        ) : (
          <span className="text-gray-400">-</span>
        );
      },
    },
    {
      accessorKey: 'outstandingBalance',
      header: 'Saldo Devedor',
      cell: ({ row }: { row: any }) => {
        const balance = row.getValue('outstandingBalance') as string;
        return balance ? (
          <span>{balance}</span>
        ) : (
          <span className="text-gray-400">-</span>
        );
      },
    },
    {
      accessorKey: 'source',
      header: 'Origem',
      cell: ({ row }: { row: any }) => {
        const source = row.getValue('source') as string;
        return (
          <Badge variant="outline" className="font-medium">
            {formatSourceDisplay(source)}
          </Badge>
        );
      },
    },
    {
      accessorKey: 'modality',
      header: 'Modalidade',
      cell: ({ row }: { row: any }) => {
        const modality = row.getValue('modality') as string;
        return modality ? (
          <Badge variant="outline" className="font-medium bg-blue-50 text-blue-700 border-blue-200 w-28 text-center text-xs">
            {modality}
          </Badge>
        ) : (
          <span className="text-gray-400">-</span>
        );
      },
    },
    {
      accessorKey: 'status',
      header: 'Status',
      cell: ({ row }: { row: any }) => {
        const status = row.getValue('status') as string;
        const lead = row.original as Lead;
        
        return (
          <div className="flex items-center gap-2">
            <Badge className={`font-medium border ${getStatusColor(status)}`}>
              {formatStatusDisplay(status)}
            </Badge>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-6 w-6 p-0 hover:bg-gray-100"
                  title="Alterar status"
                >
                  <Settings className="h-3 w-3" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                {statusOptions.map((statusOption) => (
                  <DropdownMenuItem
                    key={statusOption}
                    onClick={() => handleStatusChange(lead.id, statusOption)}
                    className={status.toLowerCase() === statusOption.toLowerCase() ? 'bg-gray-100' : ''}
                  >
                    <div className="flex items-center gap-2 w-full">
                      <Badge className={`font-medium border ${getStatusColor(statusOption)} text-xs`}>
                        {statusOption}
                      </Badge>
                      {status.toLowerCase() === statusOption.toLowerCase() && (
                        <span className="text-xs text-muted-foreground ml-auto">Atual</span>
                      )}
                    </div>
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        );
      },
    },
    {
      accessorKey: 'createdAt',
      header: 'Data de Criação',
      cell: ({ row }: { row: any }) => {
        const dateValue = row.getValue('createdAt');
        if (!dateValue) {
          return <span className="text-gray-400">-</span>;
        }
        
        try {
          const date = new Date(dateValue);
          if (isNaN(date.getTime())) {
            return <span className="text-gray-400">Data inválida</span>;
          }
          return format(date, 'dd/MM/yyyy HH:mm');
        } catch (error) {
          return <span className="text-gray-400">-</span>;
        }
      },
    },
    {
      id: 'actions',
      cell: ({ row }: { row: any }) => {
        const lead = row.original as Lead;
        const isLeadDeleting = deletingLeadIds.has(lead.id);
        const isFinalizingSale = finalizingSaleIds.has(lead.id);
        return (
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => handleFinalizeSale(lead)}
              disabled={isFinalizingSale || isLeadDeleting}
              className="h-8 w-8 p-0 hover:bg-green-50 hover:text-green-600 disabled:opacity-50"
              title="Finalizar Venda"
            >
              {isFinalizingSale ? (
                <RefreshCw className="h-4 w-4 animate-spin" />
              ) : (
                <CheckCircle className="h-4 w-4" />
              )}
            </Button>
            <TableActionMenu
              onView={() => handleViewLead(lead)}
              onEdit={() => handleEditLead(lead)}
              onDelete={() => handleDeleteLead(lead)}
              isDeleting={isLeadDeleting}
            />
          </div>
        );
      },
    },
  ];

  return (
    <div className="space-y-6 animate-fade-in">
      <PageHeader
        title="Leads"
        description="Gerencie seus leads e oportunidades com os novos status e origens"
      >
        <div className="flex gap-2">
          <Button
            variant="outline"
            onClick={loadLeads}
            disabled={isRefreshing}
            className="flex items-center gap-2"
          >
            <RefreshCw className={`h-4 w-4 ${isRefreshing ? 'animate-spin' : ''}`} />
            Atualizar
          </Button>
          <Button 
            onClick={() => setIsNewLeadModalOpen(true)}
            disabled={isLoading}
          >
            <Plus className="h-4 w-4 mr-2" />
            Novo Lead
          </Button>
        </div>
      </PageHeader>

      {isLoading ? (
        <div className="flex items-center justify-center h-64">
          <div className="flex items-center gap-2">
            <RefreshCw className="h-4 w-4 animate-spin" />
            <span>Carregando leads...</span>
          </div>
        </div>
      ) : (
        <DataTable
          columns={columns}
          data={leads}
          searchColumn="name"
          searchPlaceholder="Buscar por nome..."
        />
      )}

      {/* Modal de Criação de Lead */}
      <Dialog open={isNewLeadModalOpen} onOpenChange={setIsNewLeadModalOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Criar Novo Lead</DialogTitle>
            <DialogDescription>
              Preencha as informações para criar um novo lead no sistema.
            </DialogDescription>
          </DialogHeader>
          
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">Nome *</Label>
                <Input
                  id="name"
                  value={newLeadForm.name}
                  onChange={(e) => setNewLeadForm(prev => ({ ...prev, name: e.target.value }))}
                  placeholder="Nome completo"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="cpf">CPF *</Label>
                <Input
                  id="cpf"
                  value={newLeadForm.cpf}
                  onChange={handleNewLeadCPFChange}
                  placeholder="000.000.000-00"
                />
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="phone">Telefone *</Label>
                <Input
                  id="phone"
                  value={newLeadForm.phone}
                  onChange={handleNewLeadPhoneChange}
                  placeholder="(11) 99999-9999"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="installment">Parcela</Label>
                <Input
                  id="installment"
                  value={newLeadForm.installment}
                  onChange={handleNewLeadInstallmentChange}
                  placeholder="R$ 450,00"
                />
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="outstandingBalance">Saldo Devedor</Label>
                <Input
                  id="outstandingBalance"
                  value={newLeadForm.outstandingBalance}
                  onChange={handleNewLeadOutstandingBalanceChange}
                  placeholder="R$ 12.500,00"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="source">Origem</Label>
                <Select
                  value={newLeadForm.source}
                  onValueChange={(value: string) => setNewLeadForm(prev => ({ ...prev, source: value }))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione a origem" />
                  </SelectTrigger>
                  <SelectContent>
                    {sourceOptions.map((source) => (
                      <SelectItem key={source} value={source}>
                        {source}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="modality">Modalidade</Label>
                <Select
                  value={newLeadForm.modality}
                  onValueChange={(value: string) => setNewLeadForm(prev => ({ ...prev, modality: value }))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione a modalidade" />
                  </SelectTrigger>
                  <SelectContent>
                    {modalityOptions.map((modality) => (
                      <SelectItem key={modality} value={modality}>
                        {modality}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="status">Status</Label>
                <Select
                  value={newLeadForm.status}
                  onValueChange={(value: string) => setNewLeadForm(prev => ({ ...prev, status: value }))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione o status" />
                  </SelectTrigger>
                  <SelectContent>
                    {statusOptions.map((status) => (
                      <SelectItem key={status} value={status}>
                        {status}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="notes">Observações</Label>
              <Textarea
                id="notes"
                value={newLeadForm.notes}
                onChange={(e) => setNewLeadForm(prev => ({ ...prev, notes: e.target.value }))}
                placeholder="Informações adicionais sobre o lead..."
                rows={3}
              />
            </div>
          </div>
          
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setIsNewLeadModalOpen(false);
                setNewLeadForm({
                  name: '',
                  cpf: '',
                  phone: '',
                  status: 'Novo',
                  source: 'Ura',
                  modality: '',
                  notes: '',
                  installment: '',
                  outstandingBalance: ''
                });
              }}
            >
              Cancelar
            </Button>
            <Button 
              onClick={handleCreateLead}
              disabled={isCreatingLead}
            >
              {isCreatingLead ? (
                <>
                  <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                  Criando...
                </>
              ) : (
                <>
                  <Plus className="h-4 w-4 mr-2" />
                  Criar Lead
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Modal de Visualização de Lead */}
      <Dialog open={isViewLeadModalOpen} onOpenChange={setIsViewLeadModalOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Detalhes do Lead</DialogTitle>
            <DialogDescription>
              Informações completas do lead selecionado.
            </DialogDescription>
          </DialogHeader>
          
          {selectedLead && (
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="text-sm font-medium text-gray-600">Nome</Label>
                  <p className="text-sm bg-gray-50 p-2 rounded border">{selectedLead.name}</p>
                </div>
                <div className="space-y-2">
                  <Label className="text-sm font-medium text-gray-600">CPF</Label>
                  <p className="text-sm bg-gray-50 p-2 rounded border">{selectedLead.cpf}</p>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="text-sm font-medium text-gray-600">Telefone</Label>
                  <p className="text-sm bg-gray-50 p-2 rounded border">{selectedLead.phone}</p>
                </div>
                <div className="space-y-2">
                  <Label className="text-sm font-medium text-gray-600">Parcela</Label>
                  <p className="text-sm bg-gray-50 p-2 rounded border">{selectedLead.installment || '-'}</p>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="text-sm font-medium text-gray-600">Saldo Devedor</Label>
                  <p className="text-sm bg-gray-50 p-2 rounded border">{selectedLead.outstandingBalance || '-'}</p>
                </div>
                <div className="space-y-2">
                  <Label className="text-sm font-medium text-gray-600">Origem</Label>
                  <p className="text-sm bg-gray-50 p-2 rounded border">{formatSourceDisplay(selectedLead.source)}</p>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="text-sm font-medium text-gray-600">Modalidade</Label>
                  <p className="text-sm bg-gray-50 p-2 rounded border">{selectedLead.modality || '-'}</p>
                </div>
                <div className="space-y-2">
                  <Label className="text-sm font-medium text-gray-600">Status</Label>
                  <Badge className={`font-medium border ${getStatusColor(selectedLead.status)} w-fit`}>
                    {formatStatusDisplay(selectedLead.status)}
                  </Badge>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="text-sm font-medium text-gray-600">Data de Criação</Label>
                  <p className="text-sm bg-gray-50 p-2 rounded border">
                    {(() => {
                      try {
                        const date = new Date(selectedLead.createdAt);
                        if (isNaN(date.getTime())) {
                          return 'Data inválida';
                        }
                        return format(date, 'dd/MM/yyyy HH:mm');
                      } catch (error) {
                        return 'Data não disponível';
                      }
                    })()}
                  </p>
                </div>
              </div>
            </div>
          )}
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsViewLeadModalOpen(false)}>
              Fechar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Modal de Edição de Lead */}
      <Dialog open={isEditLeadModalOpen} onOpenChange={setIsEditLeadModalOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Editar Lead</DialogTitle>
            <DialogDescription>
              Atualize as informações do lead selecionado.
            </DialogDescription>
          </DialogHeader>
          
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="edit-name">Nome *</Label>
                <Input
                  id="edit-name"
                  value={editLeadForm.name}
                  onChange={(e) => setEditLeadForm(prev => ({ ...prev, name: e.target.value }))}
                  placeholder="Nome completo"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-cpf">CPF *</Label>
                <Input
                  id="edit-cpf"
                  value={editLeadForm.cpf}
                  onChange={handleEditLeadCPFChange}
                  placeholder="000.000.000-00"
                />
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="edit-phone">Telefone *</Label>
                <Input
                  id="edit-phone"
                  value={editLeadForm.phone}
                  onChange={handleEditLeadPhoneChange}
                  placeholder="(11) 99999-9999"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-installment">Parcela</Label>
                <Input
                  id="edit-installment"
                  value={editLeadForm.installment}
                  onChange={handleEditLeadInstallmentChange}
                  placeholder="R$ 450,00"
                />
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="edit-outstandingBalance">Saldo Devedor</Label>
                <Input
                  id="edit-outstandingBalance"
                  value={editLeadForm.outstandingBalance}
                  onChange={handleEditLeadOutstandingBalanceChange}
                  placeholder="R$ 12.500,00"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-source">Origem</Label>
                <Select
                  value={editLeadForm.source}
                  onValueChange={(value: string) => setEditLeadForm(prev => ({ ...prev, source: value }))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione a origem" />
                  </SelectTrigger>
                  <SelectContent>
                    {sourceOptions.map((source) => (
                      <SelectItem key={source} value={source}>
                        {source}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="edit-modality">Modalidade</Label>
                <Select
                  value={editLeadForm.modality}
                  onValueChange={(value: string) => setEditLeadForm(prev => ({ ...prev, modality: value }))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione a modalidade" />
                  </SelectTrigger>
                  <SelectContent>
                    {modalityOptions.map((modality) => (
                      <SelectItem key={modality} value={modality}>
                        {modality}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-status">Status</Label>
                <Select
                  value={editLeadForm.status}
                  onValueChange={(value: string) => setEditLeadForm(prev => ({ ...prev, status: value }))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione o status" />
                  </SelectTrigger>
                  <SelectContent>
                    {statusOptions.map((status) => (
                      <SelectItem key={status} value={status}>
                        {status}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="edit-notes">Observações</Label>
              <Textarea
                id="edit-notes"
                value={editLeadForm.notes}
                onChange={(e) => setEditLeadForm(prev => ({ ...prev, notes: e.target.value }))}
                placeholder="Informações adicionais sobre o lead..."
                rows={3}
              />
            </div>
          </div>
          
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setIsEditLeadModalOpen(false);
                setSelectedLead(null);
              }}
            >
              Cancelar
            </Button>
            <Button 
              onClick={handleUpdateLead}
              disabled={isCreatingLead}
            >
              {isCreatingLead ? (
                <>
                  <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                  Atualizando...
                </>
              ) : (
                <>
                  <Plus className="h-4 w-4 mr-2" />
                  Atualizar Lead
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}