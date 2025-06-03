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
import { Plus, RefreshCw, Settings } from 'lucide-react';
import { clients as mockClients } from '@/data/mockData';
import type { Client } from '@/data/mockData';
import { format } from 'date-fns';
import { useToast } from '@/hooks/use-toast';

// Funções de formatação (iguais aos Leads)
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
  const numericValue = value.replace(/\D/g, '');
  if (numericValue === '') return '';
  
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
  const cleanValue = value.replace(/[R$\s.]/g, '').replace(',', '.');
  return cleanValue;
};

const unformatCPF = (value: string) => {
  return value.replace(/\D/g, '');
};

const unformatPhone = (value: string) => {
  return value.replace(/\D/g, '');
};

const getStatusColor = (status: string) => {
  switch (status) {
    case 'ativo':
      return 'bg-green-100 text-green-700 border-green-200';
    case 'inativo':
      return 'bg-gray-100 text-gray-700 border-gray-200';
    case 'potencial':
      return 'bg-yellow-100 text-yellow-700 border-yellow-200';
    case 'vip':
      return 'bg-purple-100 text-purple-700 border-purple-200';
    default:
      return 'bg-gray-100 text-gray-700 border-gray-200';
  }
};

// Formatação para origem (igual aos Leads)
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
  
  return sourceMap[source?.toLowerCase()] || source || 'N/A';
};

const statusOptions = [
  'ativo',
  'inativo', 
  'potencial',
  'vip'
];

const sourceOptions = [
  'Ura',
  'Sms',
  'Outros',
  'Telefone',
  'Email',
  'WhatsApp',
  'Site',
  'Indicação'
];

const modalityOptions = [
  'Portabilidade',
  'Port + Refin',
  'Contrato Novo'
];

// Estender a interface Client para incluir todos os campos dos Leads
interface ExtendedClient extends Omit<Client, 'email'> {
  installment?: string;
  outstandingBalance?: string;
  source?: string;
  modality?: string;
  assignedTo?: string;
}

const fetchClients = async (): Promise<ExtendedClient[]> => {
  try {
    console.log('🔄 Buscando clientes...');
    const response = await fetch('http://localhost:8000/api/clients');
    if (!response.ok) {
      throw new Error('Erro ao buscar clientes');
    }
    const data = await response.json();
    console.log('✅ Clientes carregados:', data);
    
    // Mapear dados para incluir campos dos Leads
    const extendedClients = (data.clients || []).map((client: any) => ({
      ...client,
      installment: client.installment || 'R$ 450,00',
      outstandingBalance: client.outstandingBalance || 'R$ 12.500,00',
      source: client.source || 'Ura',
      modality: client.modality || 'Portabilidade',
      assignedTo: client.assignedTo || 'Admin AutoCred'
    }));
    
    return extendedClients;
  } catch (error) {
    console.error('❌ Erro ao buscar clientes:', error);
    // Retorna dados mockados estendidos em caso de erro
    return mockClients.map(client => ({
      ...client,
      installment: 'R$ 450,00',
      outstandingBalance: 'R$ 12.500,00',
      source: 'Ura',
      modality: 'Portabilidade',
      assignedTo: 'Admin AutoCred'
    }));
  }
};

const createClient = async (clientData: any) => {
  try {
    console.log('🚀 Tentando criar cliente:', clientData);
    
    const simplifiedData = {
      name: clientData.name,
      cpf: clientData.cpf,
      phone: clientData.phone,
      status: clientData.status || "ativo",
      notes: clientData.notes || null,
      installment: clientData.installment || null,
      outstandingBalance: clientData.outstandingBalance || null,
      source: clientData.source || "Ura",
      modality: clientData.modality || "Portabilidade",
      assignedTo: clientData.assignedTo || "Admin AutoCred"
    };
    
    console.log('📝 Dados simplificados:', simplifiedData);
    
    const response = await fetch('http://localhost:8000/api/clients', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
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
    console.log('✅ Cliente criado com sucesso:', result);
    return result;
  } catch (error) {
    console.error('❌ Erro ao criar cliente:', error);
    throw error;
  }
};

const updateClient = async (clientId: string, clientData: any) => {
  try {
    const response = await fetch(`http://localhost:8000/api/clients/${clientId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(clientData),
    });

    if (!response.ok) {
      throw new Error('Erro ao atualizar cliente');
    }

    const result = await response.json();
    return result;
  } catch (error) {
    console.error('Erro ao atualizar cliente:', error);
    throw error;
  }
};

const deleteClient = async (clientId: string) => {
  try {
    const numericId = parseInt(clientId, 10);
    if (isNaN(numericId)) {
      throw new Error('ID do cliente inválido');
    }

    const response = await fetch(`http://localhost:8000/api/clients/${numericId}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Erro ao deletar cliente: ${response.status} - ${errorText}`);
    }

    const result = await response.json();
    return result;
  } catch (error) {
    console.error('Erro ao deletar cliente:', error);
    throw error;
  }
};

export default function Clients() {
  const [clients, setClients] = useState<ExtendedClient[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isNewClientModalOpen, setIsNewClientModalOpen] = useState(false);
  const [isCreatingClient, setIsCreatingClient] = useState(false);
  const [isViewClientModalOpen, setIsViewClientModalOpen] = useState(false);
  const [isEditClientModalOpen, setIsEditClientModalOpen] = useState(false);
  const [deletingClientIds, setDeletingClientIds] = useState<Set<string>>(new Set());
  const [selectedClient, setSelectedClient] = useState<ExtendedClient | null>(null);
  const [editClientForm, setEditClientForm] = useState({
    name: '',
    cpf: '',
    phone: '',
    status: 'ativo',
    notes: '',
    installment: '',
    outstandingBalance: '',
    source: 'Ura',
    modality: 'Portabilidade',
    assignedTo: 'Admin AutoCred'
  });
  const [newClientForm, setNewClientForm] = useState({
    name: '',
    cpf: '',
    phone: '',
    status: 'ativo',
    notes: '',
    installment: '',
    outstandingBalance: '',
    source: 'Ura',
    modality: 'Portabilidade',
    assignedTo: 'Admin AutoCred'
  });
  const { toast } = useToast();

  const loadClients = async () => {
    try {
      setIsRefreshing(true);
      const fetchedClients = await fetchClients();
      
      // Converter dados da API para formato do frontend se necessário
      const formattedClients = fetchedClients.map((client: any) => {
        // Garantir que a data seja válida
        let createdAt = client.created_at || client.createdAt;
        let lastActivity = client.last_activity || client.lastActivity;
        
        if (!createdAt) {
          createdAt = new Date().toISOString();
        }
        
        // Validar se a data é válida
        const testDate = new Date(createdAt);
        if (isNaN(testDate.getTime())) {
          createdAt = new Date().toISOString();
        }

        // Validar lastActivity se existir
        if (lastActivity) {
          const testActivityDate = new Date(lastActivity);
          if (isNaN(testActivityDate.getTime())) {
            lastActivity = null;
          }
        }

        return {
          ...client,
          id: String(client.id),
          createdAt: createdAt,
          lastActivity: lastActivity,
          contractsCount: client.contracts_count || client.contractsCount || 0,
          totalValue: client.total_value || client.totalValue || 0,
        };
      });
      
      setClients(formattedClients);
    } catch (error) {
      console.error('Erro ao carregar clientes:', error);
      setClients(mockClients.map(client => ({
        ...client,
        installment: 'R$ 450,00',
        outstandingBalance: 'R$ 12.500,00',
        source: 'Ura',
        modality: 'Portabilidade',
        assignedTo: 'Admin AutoCred'
      })));
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  };

  useEffect(() => {
    loadClients();
  }, []);

  const handleStatusChange = async (clientId: string, newStatus: string) => {
    try {
      await updateClient(clientId, { status: newStatus });
      
      setClients(prevClients => 
        prevClients.map(client => 
          client.id === clientId 
            ? { ...client, status: newStatus as ExtendedClient['status'] }
            : client
        )
      );

      toast({
        title: "Status atualizado",
        description: `Status do cliente alterado para "${newStatus}" com sucesso.`,
      });

    } catch (error) {
      toast({
        title: "Erro ao alterar status",
        description: "Não foi possível alterar o status. Tente novamente.",
        variant: "destructive",
      });
    }
  };

  const handleCreateClient = async () => {
    try {
      setIsCreatingClient(true);
      
      // Validação básica
      if (!newClientForm.name || !newClientForm.cpf || !newClientForm.phone) {
        toast({
          title: "Campos obrigatórios",
          description: "Nome, CPF e telefone são obrigatórios.",
          variant: "destructive",
        });
        return;
      }

      const clientData = {
        name: newClientForm.name,
        cpf: newClientForm.cpf,
        phone: newClientForm.phone,
        status: newClientForm.status || "ativo",
        notes: newClientForm.notes,
        installment: newClientForm.installment || null,
        outstandingBalance: newClientForm.outstandingBalance || null,
        source: newClientForm.source || "Ura",
        modality: newClientForm.modality || "Portabilidade",
        assignedTo: newClientForm.assignedTo || "Admin AutoCred"
      };

      console.log('🔄 Criando cliente com dados:', clientData);

      const createdClient = await createClient(clientData);
      
      // Adicionar o novo cliente à lista
      const formattedClient: ExtendedClient = {
        id: createdClient.id.toString(),
        name: createdClient.name,
        cpf: createdClient.cpf,
        phone: createdClient.phone,
        status: createdClient.status as ExtendedClient['status'],
        contractsCount: createdClient.contractsCount || 0,
        totalValue: createdClient.totalValue || 0,
        lastActivity: createdClient.lastActivity,
        notes: createdClient.notes || '',
        createdAt: createdClient.createdAt || new Date().toISOString(),
        installment: createdClient.installment || 'R$ 450,00',
        outstandingBalance: createdClient.outstandingBalance || 'R$ 12.500,00',
        source: createdClient.source || 'Ura',
        modality: createdClient.modality || 'Portabilidade',
        assignedTo: createdClient.assignedTo || 'Admin AutoCred'
      };
      
      setClients(prevClients => [formattedClient, ...prevClients]);
      
      // Resetar formulário e fechar modal
      setNewClientForm({
        name: '',
        cpf: '',
        phone: '',
        status: 'ativo',
        notes: '',
        installment: '',
        outstandingBalance: '',
        source: 'Ura',
        modality: 'Portabilidade',
        assignedTo: 'Admin AutoCred'
      });
      setIsNewClientModalOpen(false);
      
      toast({
        title: "Cliente criado",
        description: `Cliente "${createdClient.name}" criado com sucesso.`,
      });

    } catch (error) {
      console.error('💥 Erro detalhado:', error);
      toast({
        title: "Erro ao criar cliente",
        description: error instanceof Error ? error.message : "Não foi possível criar o cliente. Tente novamente.",
        variant: "destructive",
      });
    } finally {
      setIsCreatingClient(false);
    }
  };

  const handleNewClientCPFChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatCPF(e.target.value);
    setNewClientForm(prev => ({ ...prev, cpf: formatted }));
  };

  const handleNewClientPhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatPhone(e.target.value);
    setNewClientForm(prev => ({ ...prev, phone: formatted }));
  };

  const handleViewClient = (client: ExtendedClient) => {
    setSelectedClient(client);
    setIsViewClientModalOpen(true);
  };

  const handleEditClient = (client: ExtendedClient) => {
    setSelectedClient(client);
    setEditClientForm({
      name: client.name,
      cpf: formatCPF(client.cpf),
      phone: formatPhone(client.phone),
      status: client.status,
      notes: client.notes || '',
      installment: client.installment || '',
      outstandingBalance: client.outstandingBalance || '',
      source: client.source || 'Ura',
      modality: client.modality || 'Portabilidade',
      assignedTo: client.assignedTo || 'Admin AutoCred'
    });
    setIsEditClientModalOpen(true);
  };

  const handleDeleteClient = async (client: ExtendedClient) => {
    if (!confirm(`Tem certeza que deseja excluir o cliente "${client.name}"?`)) {
      return;
    }

    try {
      setDeletingClientIds(prev => new Set(prev).add(client.id));
      
      await deleteClient(client.id);
      await loadClients();
      
      toast({
        title: "Cliente excluído",
        description: `Cliente "${client.name}" excluído com sucesso.`,
      });

    } catch (error) {
      console.error('Erro ao excluir cliente:', error);
      
      if (error instanceof Error && error.message.includes('Failed to fetch')) {
        setClients(prevClients => prevClients.filter(c => c.id !== client.id));
        toast({
          title: "Cliente removido",
          description: `Cliente "${client.name}" removido da lista (verificar conectividade).`,
          variant: "destructive",
        });
      } else {
        toast({
          title: "Erro ao excluir cliente",
          description: error instanceof Error ? error.message : "Não foi possível excluir o cliente. Tente novamente.",
          variant: "destructive",
        });
      }
    } finally {
      setDeletingClientIds(prev => {
        const newSet = new Set(prev);
        newSet.delete(client.id);
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
          <span className="font-medium text-green-600">{installment}</span>
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
          <span className="font-medium text-orange-600">{balance}</span>
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
            {formatSourceDisplay(source || '')}
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
        const client = row.original as ExtendedClient;
        
        return (
          <div className="flex items-center gap-2">
            <Badge className={`font-medium border ${getStatusColor(status)}`}>
              {status}
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
                    onClick={() => handleStatusChange(client.id, statusOption)}
                    className={status === statusOption ? 'bg-gray-100' : ''}
                  >
                    <div className="flex items-center gap-2 w-full">
                      <Badge className={`font-medium border ${getStatusColor(statusOption)} text-xs`}>
                        {statusOption}
                      </Badge>
                      {status === statusOption && (
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
      accessorKey: 'assignedTo',
      header: 'Responsável',
      cell: ({ row }: { row: any }) => {
        const assignedTo = row.getValue('assignedTo') as string;
        return (
          <span className="text-sm text-gray-600">{assignedTo || 'Admin AutoCred'}</span>
        );
      },
    },
    {
      accessorKey: 'contractsCount',
      header: 'Contratos',
      cell: ({ row }: { row: any }) => {
        const count = row.getValue('contractsCount') as number;
        return (
          <span className="font-medium text-blue-600">
            {count}
          </span>
        );
      },
    },
    {
      accessorKey: 'totalValue',
      header: 'Valor Total',
      cell: ({ row }: { row: any }) => {
        const value = row.getValue('totalValue') as number;
        return (
          <span className="font-medium text-green-600">
            R$ {value.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
          </span>
        );
      },
    },
    {
      accessorKey: 'lastActivity',
      header: 'Última Atividade',
      cell: ({ row }: { row: any }) => {
        const dateValue = row.getValue('lastActivity');
        if (!dateValue) {
          return <span className="text-gray-400">-</span>;
        }
        
        try {
          const date = new Date(dateValue);
          if (isNaN(date.getTime())) {
            return <span className="text-gray-400">Data inválida</span>;
          }
          return format(date, 'dd/MM/yyyy');
        } catch (error) {
          return <span className="text-gray-400">-</span>;
        }
      },
    },
    {
      accessorKey: 'createdAt',
      header: 'Data de Cadastro',
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
        const client = row.original as ExtendedClient;
        const isClientDeleting = deletingClientIds.has(client.id);
        return (
          <TableActionMenu
            onView={() => handleViewClient(client)}
            onEdit={() => handleEditClient(client)}
            onDelete={() => handleDeleteClient(client)}
            isDeleting={isClientDeleting}
          />
        );
      },
    },
  ];

  return (
    <div className="space-y-6 animate-fade-in">
      <PageHeader
        title="Clientes"
        description="Gerencie seus clientes ativos e potenciais"
      >
        <div className="flex gap-2">
          <Button
            variant="outline"
            onClick={loadClients}
            disabled={isRefreshing}
            className="flex items-center gap-2"
          >
            <RefreshCw className={`h-4 w-4 ${isRefreshing ? 'animate-spin' : ''}`} />
            Atualizar
          </Button>
          <Button 
            onClick={() => setIsNewClientModalOpen(true)}
            disabled={isLoading}
          >
            <Plus className="h-4 w-4 mr-2" />
            Novo Cliente
          </Button>
        </div>
      </PageHeader>

      {isLoading ? (
        <div className="flex items-center justify-center h-64">
          <div className="flex items-center gap-2">
            <RefreshCw className="h-4 w-4 animate-spin" />
            <span>Carregando clientes...</span>
          </div>
        </div>
      ) : (
        <DataTable
          columns={columns}
          data={clients}
          searchColumn="name"
          searchPlaceholder="Buscar por nome..."
        />
      )}

      {/* Modal de Criação de Cliente */}
      <Dialog open={isNewClientModalOpen} onOpenChange={setIsNewClientModalOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Criar Novo Cliente</DialogTitle>
            <DialogDescription>
              Preencha as informações para criar um novo cliente no sistema.
            </DialogDescription>
          </DialogHeader>
          
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">Nome *</Label>
                <Input
                  id="name"
                  value={newClientForm.name}
                  onChange={(e) => setNewClientForm(prev => ({ ...prev, name: e.target.value }))}
                  placeholder="Nome completo"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="cpf">CPF *</Label>
                <Input
                  id="cpf"
                  value={newClientForm.cpf}
                  onChange={handleNewClientCPFChange}
                  placeholder="000.000.000-00"
                />
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="phone">Telefone *</Label>
                <Input
                  id="phone"
                  value={newClientForm.phone}
                  onChange={handleNewClientPhoneChange}
                  placeholder="(11) 99999-9999"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="installment">Parcela</Label>
                <Input
                  id="installment"
                  value={newClientForm.installment}
                  onChange={(e) => setNewClientForm(prev => ({ ...prev, installment: formatCurrency(e.target.value) }))}
                  placeholder="R$ 450,00"
                />
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="outstandingBalance">Saldo Devedor</Label>
                <Input
                  id="outstandingBalance"
                  value={newClientForm.outstandingBalance}
                  onChange={(e) => setNewClientForm(prev => ({ ...prev, outstandingBalance: formatCurrency(e.target.value) }))}
                  placeholder="R$ 12.500,00"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="source">Origem</Label>
                <Select
                  value={newClientForm.source}
                  onValueChange={(value: string) => setNewClientForm(prev => ({ ...prev, source: value }))}
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
                  value={newClientForm.modality}
                  onValueChange={(value: string) => setNewClientForm(prev => ({ ...prev, modality: value }))}
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
                <Label htmlFor="assignedTo">Responsável</Label>
                <Input
                  id="assignedTo"
                  value={newClientForm.assignedTo}
                  onChange={(e) => setNewClientForm(prev => ({ ...prev, assignedTo: e.target.value }))}
                  placeholder="Admin AutoCred"
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="status">Status</Label>
              <Select
                value={newClientForm.status}
                onValueChange={(value: string) => setNewClientForm(prev => ({ ...prev, status: value }))}
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
            
            <div className="space-y-2">
              <Label htmlFor="notes">Observações</Label>
              <Textarea
                id="notes"
                value={newClientForm.notes}
                onChange={(e) => setNewClientForm(prev => ({ ...prev, notes: e.target.value }))}
                placeholder="Informações adicionais sobre o cliente..."
                rows={3}
              />
            </div>
          </div>
          
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setIsNewClientModalOpen(false);
                setNewClientForm({
                  name: '',
                  cpf: '',
                  phone: '',
                  status: 'ativo',
                  notes: '',
                  installment: '',
                  outstandingBalance: '',
                  source: 'Ura',
                  modality: 'Portabilidade',
                  assignedTo: 'Admin AutoCred'
                });
              }}
            >
              Cancelar
            </Button>
            <Button 
              onClick={handleCreateClient}
              disabled={isCreatingClient}
            >
              {isCreatingClient ? (
                <>
                  <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                  Criando...
                </>
              ) : (
                <>
                  <Plus className="h-4 w-4 mr-2" />
                  Criar Cliente
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Modal de Visualização de Cliente */}
      <Dialog open={isViewClientModalOpen} onOpenChange={setIsViewClientModalOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Detalhes do Cliente</DialogTitle>
            <DialogDescription>
              Informações completas do cliente selecionado.
            </DialogDescription>
          </DialogHeader>
          
          {selectedClient && (
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="text-sm font-medium text-gray-600">Nome</Label>
                  <p className="text-sm bg-gray-50 p-2 rounded border">{selectedClient.name}</p>
                </div>
                <div className="space-y-2">
                  <Label className="text-sm font-medium text-gray-600">CPF</Label>
                  <p className="text-sm bg-gray-50 p-2 rounded border">{selectedClient.cpf}</p>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="text-sm font-medium text-gray-600">Telefone</Label>
                  <p className="text-sm bg-gray-50 p-2 rounded border">{selectedClient.phone}</p>
                </div>
                <div className="space-y-2">
                  <Label className="text-sm font-medium text-gray-600">Parcela</Label>
                  <p className="text-sm bg-gray-50 p-2 rounded border">{selectedClient.installment || '-'}</p>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="text-sm font-medium text-gray-600">Saldo Devedor</Label>
                  <p className="text-sm bg-gray-50 p-2 rounded border">{selectedClient.outstandingBalance || '-'}</p>
                </div>
                <div className="space-y-2">
                  <Label className="text-sm font-medium text-gray-600">Origem</Label>
                  <p className="text-sm bg-gray-50 p-2 rounded border">{formatSourceDisplay(selectedClient.source || '')}</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="text-sm font-medium text-gray-600">Modalidade</Label>
                  <p className="text-sm bg-gray-50 p-2 rounded border">{selectedClient.modality || '-'}</p>
                </div>
                <div className="space-y-2">
                  <Label className="text-sm font-medium text-gray-600">Responsável</Label>
                  <p className="text-sm bg-gray-50 p-2 rounded border">{selectedClient.assignedTo || 'Admin AutoCred'}</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="text-sm font-medium text-gray-600">Status</Label>
                  <Badge className={`font-medium border ${getStatusColor(selectedClient.status)} w-fit`}>
                    {selectedClient.status}
                  </Badge>
                </div>
                <div className="space-y-2">
                  <Label className="text-sm font-medium text-gray-600">Contratos</Label>
                  <p className="text-sm bg-gray-50 p-2 rounded border">{selectedClient.contractsCount}</p>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="text-sm font-medium text-gray-600">Valor Total</Label>
                  <p className="text-sm bg-gray-50 p-2 rounded border">
                    R$ {selectedClient.totalValue.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                  </p>
                </div>
                <div className="space-y-2">
                  <Label className="text-sm font-medium text-gray-600">Data de Cadastro</Label>
                  <p className="text-sm bg-gray-50 p-2 rounded border">
                    {(() => {
                      try {
                        const date = new Date(selectedClient.createdAt);
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
              
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="text-sm font-medium text-gray-600">Última Atividade</Label>
                  <p className="text-sm bg-gray-50 p-2 rounded border">
                    {(() => {
                      try {
                        if (!selectedClient.lastActivity) {
                          return 'Data não disponível';
                        }
                        const date = new Date(selectedClient.lastActivity);
                        if (isNaN(date.getTime())) {
                          return 'Data inválida';
                        }
                        return format(date, 'dd/MM/yyyy');
                      } catch (error) {
                        return 'Data não disponível';
                      }
                    })()}
                  </p>
                </div>
              </div>
              
              {selectedClient.notes && (
                <div className="space-y-2">
                  <Label className="text-sm font-medium text-gray-600">Observações</Label>
                  <p className="text-sm bg-gray-50 p-2 rounded border">{selectedClient.notes}</p>
                </div>
              )}
            </div>
          )}
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsViewClientModalOpen(false)}>
              Fechar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
} 