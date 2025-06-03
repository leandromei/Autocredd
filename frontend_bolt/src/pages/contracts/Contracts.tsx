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
import { Plus, Settings, RefreshCw } from 'lucide-react';
import { contracts as mockContracts } from '@/data/mockData';
import type { Contract } from '@/data/mockData';
import { format } from 'date-fns';
import { useToast } from '@/hooks/use-toast';

// Extended Contract interface for our enhanced features
interface ExtendedContract extends Contract {
  clientCPF?: string;
  clientPhone?: string;
  notes?: string;
  installments?: number;
}

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
  'active',
  'pending', 
  'expired',
  'cancelled'
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
    case 'active':
      return 'bg-green-100 text-green-700 border-green-200';
    case 'pending':
      return 'bg-yellow-100 text-yellow-700 border-yellow-200';
    case 'expired':
      return 'bg-red-100 text-red-700 border-red-200';
    case 'cancelled':
      return 'bg-red-100 text-red-600 border-red-200';
    default:
      return 'bg-gray-100 text-gray-700 border-gray-200';
  }
};

// Function to format status display text
const formatStatusDisplay = (status: string) => {
  const statusMap: { [key: string]: string } = {
    'active': 'Ativo',
    'pending': 'Pendente',
    'expired': 'Vencido',
    'cancelled': 'Cancelado'
  };
  
  return statusMap[status.toLowerCase()] || status;
};

const fetchContracts = async () => {
  try {
    const response = await fetch('http://localhost:8001/api/contracts');
    if (!response.ok) {
      throw new Error('Erro ao buscar contratos');
    }
    const data = await response.json();
    return data.contracts || [];
  } catch (error) {
    console.error('Erro ao buscar contratos:', error);
    // Return mock data as fallback
    return mockContracts;
  }
};

const updateContractStatus = async (contractId: string, status: string) => {
  try {
    const response = await fetch(`http://localhost:8001/api/contracts/${contractId}/status`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ status }),
    });

    if (!response.ok) {
      throw new Error('Erro ao atualizar status do contrato');
    }

    const result = await response.json();
    return result;
  } catch (error) {
    console.error('Erro ao atualizar status:', error);
    throw error;
  }
};

const createContract = async (contractData: any) => {
  try {
    const response = await fetch('http://localhost:8001/api/contracts', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(contractData),
    });

    if (!response.ok) {
      throw new Error('Erro ao criar contrato');
    }

    const result = await response.json();
    return result;
  } catch (error) {
    console.error('Erro ao criar contrato:', error);
    throw error;
  }
};

const updateContract = async (contractId: string, contractData: any) => {
  try {
    const response = await fetch(`http://localhost:8001/api/contracts/${contractId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(contractData),
    });

    if (!response.ok) {
      throw new Error('Erro ao atualizar contrato');
    }

    const result = await response.json();
    return result;
  } catch (error) {
    console.error('Erro ao atualizar contrato:', error);
    throw error;
  }
};

const deleteContract = async (contractId: string) => {
  try {
    const response = await fetch(`http://localhost:8001/api/contracts/${contractId}`, {
      method: 'DELETE',
    });

    if (!response.ok) {
      throw new Error('Erro ao deletar contrato');
    }

    const result = await response.json();
    return result;
  } catch (error) {
    console.error('Erro ao deletar contrato:', error);
    throw error;
  }
};

export default function Contracts() {
  const [contracts, setContracts] = useState<ExtendedContract[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isCreatingContract, setIsCreatingContract] = useState(false);
  const [isUpdatingContract, setIsUpdatingContract] = useState(false);
  const [deletingContractIds, setDeletingContractIds] = useState<Set<string>>(new Set());
  
  // Modal states
  const [isNewContractModalOpen, setIsNewContractModalOpen] = useState(false);
  const [isViewContractModalOpen, setIsViewContractModalOpen] = useState(false);
  const [isEditContractModalOpen, setIsEditContractModalOpen] = useState(false);
  const [selectedContract, setSelectedContract] = useState<ExtendedContract | null>(null);
  
  // Form states
  const [newContractForm, setNewContractForm] = useState({
    clientName: '',
    clientCPF: '',
    clientPhone: '',
    planName: '',
    modality: '',
    value: '',
    status: 'pending' as 'active' | 'pending' | 'expired' | 'cancelled',
    startDate: '',
    endDate: '',
    notes: ''
  });
  
  const [editContractForm, setEditContractForm] = useState({
    clientName: '',
    clientCPF: '',
    clientPhone: '',
    planName: '',
    modality: '',
    value: '',
    status: 'pending' as 'active' | 'pending' | 'expired' | 'cancelled',
    startDate: '',
    endDate: '',
    notes: ''
  });

  const { toast } = useToast();

  useEffect(() => {
    loadContracts();
  }, []);

  const loadContracts = async () => {
    try {
      setIsLoading(true);
      setIsRefreshing(true);
      const contractsData = await fetchContracts();
      
      // Mapear dados da API para formato do frontend se necessário
      const formattedContracts = contractsData.map((contract: any) => ({
        ...contract,
        clientCPF: contract.client_cpf || contract.clientCPF || '',
        clientPhone: contract.client_phone || contract.clientPhone || '',
        modality: contract.modality || ''
      }));
      
      setContracts(formattedContracts);
    } catch (error) {
      console.error('Erro ao carregar contratos:', error);
      toast({
        title: "Erro ao carregar contratos",
        description: "Não foi possível carregar os contratos. Usando dados locais...",
        variant: "destructive",
      });
      
      // Fallback to mock data
      setContracts(mockContracts);
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  };

  const handleStatusChange = async (contractId: string, newStatus: string) => {
    try {
      await updateContractStatus(contractId, newStatus);
      
      // Update local state
      setContracts(prevContracts => 
        prevContracts.map(contract => 
          contract.id === contractId 
            ? { ...contract, status: newStatus as Contract['status'] }
            : contract
        )
      );

      toast({
        title: "Status atualizado",
        description: `Status do contrato alterado para "${formatStatusDisplay(newStatus)}".`,
      });

    } catch (error) {
      console.error('Erro ao atualizar status:', error);
      toast({
        title: "Erro ao atualizar status",
        description: "Não foi possível atualizar o status. Tente novamente.",
        variant: "destructive",
      });
    }
  };

  const handleCreateContract = async () => {
    if (!newContractForm.clientName || !newContractForm.modality) {
      toast({
        title: "Campos obrigatórios",
        description: "Preencha todos os campos obrigatórios.",
        variant: "destructive",
      });
      return;
    }

    try {
      setIsCreatingContract(true);
      
      const contractData = {
        clientName: newContractForm.clientName,
        clientCPF: unformatCPF(newContractForm.clientCPF),
        clientPhone: unformatPhone(newContractForm.clientPhone),
        planName: newContractForm.planName,
        modality: newContractForm.modality,
        value: parseFloat(unformatCurrency(newContractForm.value)) || 0,
        status: newContractForm.status,
        startDate: newContractForm.startDate,
        endDate: newContractForm.endDate,
        notes: newContractForm.notes
      };

      const newContract = await createContract(contractData);
      
      // Add to local state
      setContracts(prevContracts => [newContract, ...prevContracts]);
      
      // Reset form and close modal
      setNewContractForm({
        clientName: '',
        clientCPF: '',
        clientPhone: '',
        planName: '',
        modality: '',
        value: '',
        status: 'pending',
        startDate: '',
        endDate: '',
        notes: ''
      });
      setIsNewContractModalOpen(false);
      
      toast({
        title: "Contrato criado",
        description: `Contrato para ${newContractForm.clientName} criado com sucesso.`,
      });

    } catch (error) {
      console.error('Erro ao criar contrato:', error);
      toast({
        title: "Erro ao criar contrato",
        description: error instanceof Error ? error.message : "Não foi possível criar o contrato. Tente novamente.",
        variant: "destructive",
      });
    } finally {
      setIsCreatingContract(false);
    }
  };

  const handleNewContractCPFChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formattedCPF = formatCPF(e.target.value);
    setNewContractForm(prev => ({ ...prev, clientCPF: formattedCPF }));
  };

  const handleNewContractPhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formattedPhone = formatPhone(e.target.value);
    setNewContractForm(prev => ({ ...prev, clientPhone: formattedPhone }));
  };

  const handleNewContractValueChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formattedValue = formatCurrency(e.target.value);
    setNewContractForm(prev => ({ ...prev, value: formattedValue }));
  };

  const handleViewContract = (contract: ExtendedContract) => {
    setSelectedContract(contract);
    setIsViewContractModalOpen(true);
  };

  const handleEditContract = (contract: ExtendedContract) => {
    setSelectedContract(contract);
    
    const formatExistingCurrency = (value: string | number) => {
      if (!value) return '';
      const numValue = typeof value === 'number' ? value : parseFloat(value.toString());
      if (isNaN(numValue)) return '';
      return numValue.toLocaleString('pt-BR', {
        style: 'currency',
        currency: 'BRL',
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
      });
    };

    setEditContractForm({
      clientName: contract.clientName || '',
      clientCPF: contract.clientCPF ? formatCPF(contract.clientCPF) : '',
      clientPhone: contract.clientPhone ? formatPhone(contract.clientPhone) : '',
      planName: contract.planName || '',
      modality: contract.modality || '',
      value: contract.value ? formatExistingCurrency(contract.value.toString()) : '',
      status: contract.status || 'pending',
      startDate: contract.startDate ? new Date(contract.startDate).toISOString().split('T')[0] : '',
      endDate: contract.endDate ? new Date(contract.endDate).toISOString().split('T')[0] : '',
      notes: contract.notes || ''
    });
    setIsEditContractModalOpen(true);
  };

  const handleUpdateContract = async () => {
    if (!selectedContract) return;

    if (!editContractForm.clientName || !editContractForm.modality) {
      toast({
        title: "Campos obrigatórios",
        description: "Preencha todos os campos obrigatórios.",
        variant: "destructive",
      });
      return;
    }

    try {
      setIsUpdatingContract(true);
      
      const contractData = {
        clientName: editContractForm.clientName,
        clientCPF: unformatCPF(editContractForm.clientCPF),
        clientPhone: unformatPhone(editContractForm.clientPhone),
        planName: editContractForm.planName,
        modality: editContractForm.modality,
        value: parseFloat(unformatCurrency(editContractForm.value)) || 0,
        status: editContractForm.status,
        startDate: editContractForm.startDate,
        endDate: editContractForm.endDate,
        notes: editContractForm.notes
      };

      const updatedContract = await updateContract(selectedContract.id, contractData);
      
      // Update local state
      setContracts(prevContracts => 
        prevContracts.map(contract => 
          contract.id === selectedContract.id ? updatedContract : contract
        )
      );
      
      setIsEditContractModalOpen(false);
      setSelectedContract(null);
      
      toast({
        title: "Contrato atualizado",
        description: `Contrato de ${editContractForm.clientName} atualizado com sucesso.`,
      });

    } catch (error) {
      console.error('Erro ao atualizar contrato:', error);
      toast({
        title: "Erro ao atualizar contrato",
        description: error instanceof Error ? error.message : "Não foi possível atualizar o contrato. Tente novamente.",
        variant: "destructive",
      });
    } finally {
      setIsUpdatingContract(false);
    }
  };

  const handleEditContractCPFChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formattedCPF = formatCPF(e.target.value);
    setEditContractForm(prev => ({ ...prev, clientCPF: formattedCPF }));
  };

  const handleEditContractPhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formattedPhone = formatPhone(e.target.value);
    setEditContractForm(prev => ({ ...prev, clientPhone: formattedPhone }));
  };

  const handleEditContractValueChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formattedValue = formatCurrency(e.target.value);
    setEditContractForm(prev => ({ ...prev, value: formattedValue }));
  };

  const handleDeleteContract = async (contract: ExtendedContract) => {
    if (!window.confirm(`Tem certeza que deseja excluir o contrato de "${contract.clientName}"?`)) {
      return;
    }

    setDeletingContractIds(prev => new Set(prev).add(contract.id));

    try {
      await deleteContract(contract.id);
      
      // Remove from local state
      setContracts(prevContracts => prevContracts.filter(c => c.id !== contract.id));
      
      toast({
        title: "Contrato excluído",
        description: `Contrato de "${contract.clientName}" excluído com sucesso.`,
      });

    } catch (error) {
      console.error('Erro ao excluir contrato:', error);
      
      // Tentar remover da lista local como fallback
      if (error instanceof Error && error.message.includes('Failed to fetch')) {
        console.log('Problema de conectividade detectado, removendo da lista local...');
        setContracts(prevContracts => prevContracts.filter(c => c.id !== contract.id));
        toast({
          title: "Contrato removido",
          description: `Contrato de "${contract.clientName}" removido da lista (verificar conectividade).`,
          variant: "destructive",
        });
      } else {
        toast({
          title: "Erro ao excluir contrato",
          description: error instanceof Error ? error.message : "Não foi possível excluir o contrato. Tente novamente.",
          variant: "destructive",
        });
      }
    } finally {
      setDeletingContractIds(prev => {
        const newSet = new Set(prev);
        newSet.delete(contract.id);
        return newSet;
      });
    }
  };

  const columns = [
    {
      accessorKey: 'clientName',
      header: 'Cliente',
    },
    {
      accessorKey: 'clientCPF',
      header: 'CPF',
      cell: ({ row }: { row: any }) => {
        const contract = row.original as ExtendedContract;
        const cpf = contract.clientCPF;
        return cpf ? (
          <span>{formatCPF(cpf)}</span>
        ) : (
          <span className="text-gray-400">-</span>
        );
      },
    },
    {
      accessorKey: 'clientPhone',
      header: 'Telefone',
      cell: ({ row }: { row: any }) => {
        const contract = row.original as ExtendedContract;
        const phone = contract.clientPhone;
        return phone ? (
          <span>{formatPhone(phone)}</span>
        ) : (
          <span className="text-gray-400">-</span>
        );
      },
    },
    {
      accessorKey: 'modality',
      header: 'Modalidade',
      cell: ({ row }: { row: any }) => {
        const contract = row.original as ExtendedContract;
        const modality = contract.modality;
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
      accessorKey: 'value',
      header: 'Valor',
      cell: ({ row }: { row: any }) => {
        const value = row.getValue('value');
        if (!value) return <span className="text-gray-400">-</span>;
        
        const numValue = typeof value === 'number' ? value : parseFloat(String(value));
        if (isNaN(numValue)) return <span className="text-gray-400">-</span>;
        
        return new Intl.NumberFormat('pt-BR', {
          style: 'currency',
          currency: 'BRL',
        }).format(numValue);
      },
    },
    {
      accessorKey: 'installments',
      header: 'Parcelas',
      cell: ({ row }: { row: any }) => {
        const contract = row.original as ExtendedContract;
        const value = contract.value;
        const installments = contract.installments || 12; // Default para 12 parcelas se não especificado
        
        if (!value || typeof value !== 'number') return <span className="text-gray-400">-</span>;
        
        const installmentValue = value / installments;
        
        return (
          <span className="text-sm">
            {new Intl.NumberFormat('pt-BR', {
              style: 'currency',
              currency: 'BRL',
            }).format(installmentValue)}
          </span>
        );
      },
    },
    {
      accessorKey: 'status',
      header: 'Status',
      cell: ({ row }: { row: any }) => {
        const status = row.getValue('status') as string;
        const contract = row.original as ExtendedContract;
        
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
                    onClick={() => handleStatusChange(contract.id, statusOption)}
                    className={status.toLowerCase() === statusOption.toLowerCase() ? 'bg-gray-100' : ''}
                  >
                    <div className="flex items-center gap-2 w-full">
                      <Badge className={`font-medium border ${getStatusColor(statusOption)} text-xs`}>
                        {formatStatusDisplay(statusOption)}
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
      accessorKey: 'startDate',
      header: 'Início',
      cell: ({ row }: { row: any }) => {
        const dateValue = row.getValue('startDate');
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
      accessorKey: 'endDate',
      header: 'Término',
      cell: ({ row }: { row: any }) => {
        const dateValue = row.getValue('endDate');
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
      accessorKey: 'createdBy',
      header: 'Criado por',
    },
    {
      id: 'actions',
      cell: ({ row }: { row: any }) => {
        const contract = row.original as ExtendedContract;
        const isContractDeleting = deletingContractIds.has(contract.id);
        return (
          <TableActionMenu
            onView={() => handleViewContract(contract)}
            onEdit={() => handleEditContract(contract)}
            onDelete={() => handleDeleteContract(contract)}
            isDeleting={isContractDeleting}
          />
        );
      },
    },
  ];

  return (
    <div className="space-y-6 animate-fade-in">
      <PageHeader
        title="Contratos"
        description="Gerencie contratos e acompanhe status com atualizações em tempo real"
      >
        <div className="flex gap-2">
          <Button
            variant="outline"
            onClick={loadContracts}
            disabled={isRefreshing}
            className="flex items-center gap-2"
          >
            <RefreshCw className={`h-4 w-4 ${isRefreshing ? 'animate-spin' : ''}`} />
            Atualizar
          </Button>
          <Button 
            onClick={() => setIsNewContractModalOpen(true)}
            disabled={isLoading}
          >
            <Plus className="h-4 w-4 mr-2" />
            Novo Contrato
          </Button>
        </div>
      </PageHeader>

      {isLoading ? (
        <div className="flex items-center justify-center h-64">
          <div className="flex items-center gap-2">
            <RefreshCw className="h-4 w-4 animate-spin" />
            <span>Carregando contratos...</span>
          </div>
        </div>
      ) : (
        <DataTable
          columns={columns}
          data={contracts}
          searchColumn="clientName"
          searchPlaceholder="Buscar por cliente..."
        />
      )}

      {/* Modal de Criação de Contrato */}
      <Dialog open={isNewContractModalOpen} onOpenChange={setIsNewContractModalOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Criar Novo Contrato</DialogTitle>
            <DialogDescription>
              Preencha as informações para criar um novo contrato no sistema.
            </DialogDescription>
          </DialogHeader>
          
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="clientName">Nome do Cliente *</Label>
                <Input
                  id="clientName"
                  value={newContractForm.clientName}
                  onChange={(e) => setNewContractForm(prev => ({ ...prev, clientName: e.target.value }))}
                  placeholder="Nome completo"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="clientCPF">CPF</Label>
                <Input
                  id="clientCPF"
                  value={newContractForm.clientCPF}
                  onChange={handleNewContractCPFChange}
                  placeholder="000.000.000-00"
                />
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="clientPhone">Telefone</Label>
                <Input
                  id="clientPhone"
                  value={newContractForm.clientPhone}
                  onChange={handleNewContractPhoneChange}
                  placeholder="(11) 99999-9999"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="planName">Plano</Label>
                <Input
                  id="planName"
                  value={newContractForm.planName}
                  onChange={(e) => setNewContractForm(prev => ({ ...prev, planName: e.target.value }))}
                  placeholder="Nome do plano"
                />
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="modality">Modalidade *</Label>
                <Select
                  value={newContractForm.modality}
                  onValueChange={(value: string) => setNewContractForm(prev => ({ ...prev, modality: value }))}
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
                <Label htmlFor="value">Valor</Label>
                <Input
                  id="value"
                  value={newContractForm.value}
                  onChange={handleNewContractValueChange}
                  placeholder="R$ 1.500,00"
                />
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="status">Status</Label>
                <Select
                  value={newContractForm.status}
                  onValueChange={(value: 'active' | 'pending' | 'expired' | 'cancelled') => setNewContractForm(prev => ({ ...prev, status: value }))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione o status" />
                  </SelectTrigger>
                  <SelectContent>
                    {statusOptions.map((status) => (
                      <SelectItem key={status} value={status}>
                        {formatStatusDisplay(status)}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="startDate">Data de Início</Label>
                <Input
                  id="startDate"
                  type="date"
                  value={newContractForm.startDate}
                  onChange={(e) => setNewContractForm(prev => ({ ...prev, startDate: e.target.value }))}
                />
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="endDate">Data de Término</Label>
                <Input
                  id="endDate"
                  type="date"
                  value={newContractForm.endDate}
                  onChange={(e) => setNewContractForm(prev => ({ ...prev, endDate: e.target.value }))}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="notes">Observações</Label>
                <Textarea
                  id="notes"
                  value={newContractForm.notes}
                  onChange={(e) => setNewContractForm(prev => ({ ...prev, notes: e.target.value }))}
                  placeholder="Informações adicionais sobre o contrato..."
                  rows={3}
                />
              </div>
            </div>
          </div>
          
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setIsNewContractModalOpen(false);
                setNewContractForm({
                  clientName: '',
                  clientCPF: '',
                  clientPhone: '',
                  planName: '',
                  modality: '',
                  value: '',
                  status: 'pending',
                  startDate: '',
                  endDate: '',
                  notes: ''
                });
              }}
            >
              Cancelar
            </Button>
            <Button 
              onClick={handleCreateContract}
              disabled={isCreatingContract}
            >
              {isCreatingContract ? (
                <>
                  <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                  Criando...
                </>
              ) : (
                <>
                  <Plus className="h-4 w-4 mr-2" />
                  Criar Contrato
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Modal de Visualização de Contrato */}
      <Dialog open={isViewContractModalOpen} onOpenChange={setIsViewContractModalOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Detalhes do Contrato</DialogTitle>
            <DialogDescription>
              Informações completas do contrato selecionado.
            </DialogDescription>
          </DialogHeader>
          
          {selectedContract && (
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="text-sm font-medium text-gray-600">Cliente</Label>
                  <p className="text-sm bg-gray-50 p-2 rounded border">{selectedContract.clientName}</p>
                </div>
                <div className="space-y-2">
                  <Label className="text-sm font-medium text-gray-600">CPF</Label>
                  <p className="text-sm bg-gray-50 p-2 rounded border">{selectedContract.clientCPF ? formatCPF(selectedContract.clientCPF) : '-'}</p>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="text-sm font-medium text-gray-600">Telefone</Label>
                  <p className="text-sm bg-gray-50 p-2 rounded border">{selectedContract.clientPhone ? formatPhone(selectedContract.clientPhone) : '-'}</p>
                </div>
                <div className="space-y-2">
                  <Label className="text-sm font-medium text-gray-600">Plano</Label>
                  <p className="text-sm bg-gray-50 p-2 rounded border">{selectedContract.planName || '-'}</p>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="text-sm font-medium text-gray-600">Modalidade</Label>
                  <p className="text-sm bg-gray-50 p-2 rounded border">{selectedContract.modality || '-'}</p>
                </div>
                <div className="space-y-2">
                  <Label className="text-sm font-medium text-gray-600">Valor</Label>
                  <p className="text-sm bg-gray-50 p-2 rounded border">
                    {selectedContract.value ? new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(Number(selectedContract.value)) : '-'}
                  </p>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="text-sm font-medium text-gray-600">Status</Label>
                  <Badge className={`font-medium border ${getStatusColor(selectedContract.status)} w-fit`}>
                    {formatStatusDisplay(selectedContract.status)}
                  </Badge>
                </div>
                <div className="space-y-2">
                  <Label className="text-sm font-medium text-gray-600">Data de Início</Label>
                  <p className="text-sm bg-gray-50 p-2 rounded border">
                    {(() => {
                      try {
                        const date = new Date(selectedContract.startDate);
                        if (isNaN(date.getTime())) {
                          return 'Data inválida';
                        }
                        return format(date, 'dd/MM/yyyy');
                      } catch (error) {
                        return '-';
                      }
                    })()}
                  </p>
                </div>
                <div className="space-y-2">
                  <Label className="text-sm font-medium text-gray-600">Data de Término</Label>
                  <p className="text-sm bg-gray-50 p-2 rounded border">
                    {(() => {
                      try {
                        const date = new Date(selectedContract.endDate);
                        if (isNaN(date.getTime())) {
                          return 'Data inválida';
                        }
                        return format(date, 'dd/MM/yyyy');
                      } catch (error) {
                        return '-';
                      }
                    })()}
                  </p>
                </div>
              </div>
              
              <div className="space-y-2">
                <Label className="text-sm font-medium text-gray-600">Criado por</Label>
                <p className="text-sm bg-gray-50 p-2 rounded border">{selectedContract.createdBy}</p>
              </div>
              
              {selectedContract.notes && (
                <div className="space-y-2">
                  <Label className="text-sm font-medium text-gray-600">Observações</Label>
                  <p className="text-sm bg-gray-50 p-2 rounded border">{selectedContract.notes}</p>
                </div>
              )}
            </div>
          )}
          
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsViewContractModalOpen(false)}
            >
              Fechar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Modal de Edição de Contrato */}
      <Dialog open={isEditContractModalOpen} onOpenChange={setIsEditContractModalOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Editar Contrato</DialogTitle>
            <DialogDescription>
              Atualize as informações do contrato.
            </DialogDescription>
          </DialogHeader>
          
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="edit-clientName">Nome do Cliente *</Label>
                <Input
                  id="edit-clientName"
                  value={editContractForm.clientName}
                  onChange={(e) => setEditContractForm(prev => ({ ...prev, clientName: e.target.value }))}
                  placeholder="Nome completo"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-clientCPF">CPF</Label>
                <Input
                  id="edit-clientCPF"
                  value={editContractForm.clientCPF}
                  onChange={handleEditContractCPFChange}
                  placeholder="000.000.000-00"
                />
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="edit-clientPhone">Telefone</Label>
                <Input
                  id="edit-clientPhone"
                  value={editContractForm.clientPhone}
                  onChange={handleEditContractPhoneChange}
                  placeholder="(11) 99999-9999"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-planName">Plano</Label>
                <Input
                  id="edit-planName"
                  value={editContractForm.planName}
                  onChange={(e) => setEditContractForm(prev => ({ ...prev, planName: e.target.value }))}
                  placeholder="Nome do plano"
                />
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="edit-modality">Modalidade *</Label>
                <Select
                  value={editContractForm.modality}
                  onValueChange={(value: string) => setEditContractForm(prev => ({ ...prev, modality: value }))}
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
                <Label htmlFor="edit-value">Valor</Label>
                <Input
                  id="edit-value"
                  value={editContractForm.value}
                  onChange={handleEditContractValueChange}
                  placeholder="R$ 1.500,00"
                />
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="edit-status">Status</Label>
                <Select
                  value={editContractForm.status}
                  onValueChange={(value: 'active' | 'pending' | 'expired' | 'cancelled') => setEditContractForm(prev => ({ ...prev, status: value }))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione o status" />
                  </SelectTrigger>
                  <SelectContent>
                    {statusOptions.map((status) => (
                      <SelectItem key={status} value={status}>
                        {formatStatusDisplay(status)}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-startDate">Data de Início</Label>
                <Input
                  id="edit-startDate"
                  type="date"
                  value={editContractForm.startDate}
                  onChange={(e) => setEditContractForm(prev => ({ ...prev, startDate: e.target.value }))}
                />
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="edit-endDate">Data de Término</Label>
                <Input
                  id="edit-endDate"
                  type="date"
                  value={editContractForm.endDate}
                  onChange={(e) => setEditContractForm(prev => ({ ...prev, endDate: e.target.value }))}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-notes">Observações</Label>
                <Textarea
                  id="edit-notes"
                  value={editContractForm.notes}
                  onChange={(e) => setEditContractForm(prev => ({ ...prev, notes: e.target.value }))}
                  placeholder="Informações adicionais sobre o contrato..."
                  rows={3}
                />
              </div>
            </div>
          </div>
          
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsEditContractModalOpen(false)}
            >
              Cancelar
            </Button>
            <Button 
              onClick={handleUpdateContract}
              disabled={isUpdatingContract}
            >
              {isUpdatingContract ? (
                <>
                  <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                  Atualizando...
                </>
              ) : (
                'Atualizar'
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}