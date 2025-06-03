import { useState, useEffect, useRef } from 'react';
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
import { Plus, Settings, RefreshCw, Upload, Download, Tag } from 'lucide-react';
import { contacts as mockContacts } from '@/data/mockData';
import type { Contact } from '@/data/mockData';
import { format } from 'date-fns';
import { useToast } from '@/hooks/use-toast';

// Funções de formatação (copiadas de Leads)
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

// Opções específicas para contatos
const typeOptions = [
  'client',
  'lead', 
  'partner',
  'other'
];

const modalityOptions = [
  'Portabilidade',
  'Port + Refin',
  'Contrato Novo'
];

// Opções de campanhas
const campaignOptions = [
  'Portabilidade 2025',
  'Refinanciamento Q1',
  'Novos Contratos',
  'Retenção de Clientes',
  'Prospecção Digital',
  'Follow-up Pendências'
];

const getTypeColor = (type: string) => {
  switch (type.toLowerCase()) {
    case 'client':
      return 'bg-blue-100 text-blue-700 border-blue-200';
    case 'lead':
      return 'bg-yellow-100 text-yellow-700 border-yellow-200';
    case 'partner':
      return 'bg-green-100 text-green-700 border-green-200';
    case 'other':
      return 'bg-gray-100 text-gray-700 border-gray-200';
    default:
      return 'bg-gray-100 text-gray-700 border-gray-200';
  }
};

const formatTypeDisplay = (type: string) => {
  const typeMap: { [key: string]: string } = {
    'client': 'Cliente',
    'lead': 'Lead',
    'partner': 'Parceiro',
    'other': 'Outro'
  };
  return typeMap[type.toLowerCase()] || type;
};

// Interface para contatos com campos específicos necessários
interface ExtendedContact {
  id: string;
  name: string;
  phone: string;
  lastContact: string | null;
  notes: string;
  createdAt: string;
  cpf?: string;
  installment?: string;
  outstandingBalance?: string;
  modality?: string;
  campaign?: string;
}

// Função para formatar datas
const formatDate = (dateString: string) => {
  if (!dateString) return '-';
  try {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return '-';
    return format(date, 'dd/MM/yyyy HH:mm');
  } catch (error) {
    return '-';
  }
};

// API functions
const fetchContacts = async () => {
  try {
    const response = await fetch('http://localhost:8001/api/contacts');
    if (!response.ok) {
      throw new Error('Erro ao buscar contatos');
    }
    const data = await response.json();
    return data.contacts || [];
  } catch (error) {
    console.error('Erro ao buscar contatos:', error);
    return mockContacts.map(contact => ({
      id: contact.id,
      name: contact.name,
      phone: contact.phone,
      lastContact: contact.lastContact,
      notes: contact.notes,
      createdAt: contact.createdAt,
      cpf: contact.cpf,
      installment: contact.installment,
      outstandingBalance: contact.outstandingBalance,
      modality: contact.modality,
      campaign: contact.campaign
    }));
  }
};

const createContact = async (contactData: any) => {
  try {
    const response = await fetch('http://localhost:8001/api/contacts', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        name: contactData.name,
        phone: unformatPhone(contactData.phone),
        cpf: unformatCPF(contactData.cpf),
        modality: contactData.modality,
        installment: unformatCurrency(contactData.installment),
        outstandingBalance: unformatCurrency(contactData.outstandingBalance),
        notes: contactData.notes,
        campaign: contactData.campaign
      })
    });

    if (!response.ok) {
      throw new Error('Erro ao criar contato');
    }

    return await response.json();
  } catch (error) {
    console.error('Erro ao criar contato:', error);
    throw error;
  }
};

const updateContact = async (contactId: string, contactData: any) => {
  try {
    const response = await fetch(`http://localhost:8001/api/contacts/${contactId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        name: contactData.name,
        phone: unformatPhone(contactData.phone),
        cpf: unformatCPF(contactData.cpf),
        modality: contactData.modality,
        installment: unformatCurrency(contactData.installment),
        outstandingBalance: unformatCurrency(contactData.outstandingBalance),
        notes: contactData.notes,
        campaign: contactData.campaign
      })
    });

    if (!response.ok) {
      throw new Error('Erro ao atualizar contato');
    }

    return await response.json();
  } catch (error) {
    console.error('Erro ao atualizar contato:', error);
    throw error;
  }
};

const deleteContact = async (contactId: string) => {
  try {
    const response = await fetch(`http://localhost:8001/api/contacts/${contactId}`, {
      method: 'DELETE',
    });

    if (!response.ok) {
      throw new Error('Erro ao deletar contato');
    }

    return true;
  } catch (error) {
    console.error('Erro ao deletar contato:', error);
    throw error;
  }
};

// Função para download do template CSV
const downloadTemplate = () => {
  const headers = ['nome', 'telefone', 'cpf', 'modalidade', 'parcela', 'saldo_devedor', 'campanha', 'observacoes'];
  const sampleData = [
    'João Silva',
    '11999999999',
    '12345678901',
    'Portabilidade',
    'R$ 450,00',
    'R$ 15.000,00',
    'Portabilidade 2025',
    'Cliente interessado em portabilidade'
  ];
  
  const csvContent = [
    headers.join(';'),
    sampleData.join(';')
  ].join('\n');

  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  const url = URL.createObjectURL(blob);
  link.setAttribute('href', url);
  link.setAttribute('download', 'template_contatos.csv');
  link.style.visibility = 'hidden';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

// Função para processar CSV
const processCSV = (csvText: string, selectedCampaign?: string) => {
  const lines = csvText.split('\n').filter(line => line.trim());
  if (lines.length < 2) {
    throw new Error('Arquivo CSV deve conter pelo menos um cabeçalho e uma linha de dados');
  }

  const headers = lines[0].split(';').map(h => h.trim().toLowerCase());
  const contacts = [];

  for (let i = 1; i < lines.length; i++) {
    const values = lines[i].split(';').map(v => v.trim());
    if (values.length !== headers.length) continue;

    const contact: any = {};
    headers.forEach((header, index) => {
      const value = values[index];
      switch (header) {
        case 'nome':
          contact.name = value;
          break;
        case 'telefone':
          contact.phone = value;
          break;
        case 'cpf':
          contact.cpf = value;
          break;
        case 'modalidade':
          contact.modality = value;
          break;
        case 'parcela':
          contact.installment = value;
          break;
        case 'saldo_devedor':
          contact.outstandingBalance = value;
          break;
        case 'campanha':
          contact.campaign = selectedCampaign || value;
          break;
        case 'observacoes':
          contact.notes = value;
          break;
      }
    });

    // Usar campanha selecionada se fornecida
    if (selectedCampaign) {
      contact.campaign = selectedCampaign;
    }

    contacts.push(contact);
  }

  return contacts;
};

// Função para importar contatos em massa
const importContacts = async (contacts: any[]) => {
  const results = [];
  for (const contact of contacts) {
    try {
      const result = await createContact(contact);
      results.push({ success: true, contact: result });
    } catch (error) {
      results.push({ success: false, error: (error as Error).message, contact });
    }
  }
  return results;
};

export default function Contacts() {
  const [contacts, setContacts] = useState<ExtendedContact[]>([]);
  const [filteredContacts, setFilteredContacts] = useState<ExtendedContact[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState<'name' | 'date' | 'phone'>('name');
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isNewContactModalOpen, setIsNewContactModalOpen] = useState(false);
  const [isViewContactModalOpen, setIsViewContactModalOpen] = useState(false);
  const [isEditContactModalOpen, setIsEditContactModalOpen] = useState(false);
  const [selectedContact, setSelectedContact] = useState<ExtendedContact | null>(null);
  const [deletingContactIds, setDeletingContactIds] = useState<Set<string>>(new Set());
  
  // Estados para importação CSV
  const [isImportModalOpen, setIsImportModalOpen] = useState(false);
  const [isImporting, setIsImporting] = useState(false);
  const [csvData, setCsvData] = useState<any[]>([]);
  const [importCampaign, setImportCampaign] = useState<string>('none');
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  // Estados para campanhas
  const [isCampaignModalOpen, setIsCampaignModalOpen] = useState(false);
  const [selectedCampaignContacts, setSelectedCampaignContacts] = useState<string[]>([]);
  const [campaignToAssign, setCampaignToAssign] = useState<string>('');
  const [campaignOptions, setCampaignOptions] = useState<string[]>([
    'Portabilidade 2025',
    'Refinanciamento Q1',
    'Novos Contratos',
    'Retenção de Clientes',
    'Prospecção Digital',
    'Follow-up Pendências'
  ]);
  const [newCampaignName, setNewCampaignName] = useState('');
  const [campaignToDelete, setCampaignToDelete] = useState<string>('');
  
  const { toast } = useToast();

  // Form states
  const [newContactForm, setNewContactForm] = useState({
    name: '',
    cpf: '',
    phone: '',
    modality: '',
    campaign: '',
    notes: '',
    installment: '',
    outstandingBalance: ''
  });

  const [editContactForm, setEditContactForm] = useState({
    name: '',
    cpf: '',
    phone: '',
    modality: '',
    campaign: '',
    notes: '',
    installment: '',
    outstandingBalance: ''
  });

  useEffect(() => {
    loadContacts();
  }, []);

  const loadContacts = async () => {
    setIsRefreshing(true);
    try {
      const contactsData = await fetchContacts();
      setContacts(contactsData);
    } catch (error) {
      console.error('Erro ao carregar contatos:', error);
      toast({
        title: "Erro ao carregar contatos",
        description: "Não foi possível carregar os contatos. Usando dados locais.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  };

  const handleCreateContact = async () => {
    try {
      const contactData = {
        ...newContactForm,
        cpf: unformatCPF(newContactForm.cpf),
        phone: unformatPhone(newContactForm.phone),
        lastContact: null,
        createdAt: new Date().toISOString()
      };

      await createContact(contactData);
      
      setNewContactForm({
        name: '',
        cpf: '',
        phone: '',
        modality: '',
        campaign: '',
        notes: '',
        installment: '',
        outstandingBalance: ''
      });
      
      setIsNewContactModalOpen(false);
      await loadContacts();
      
      toast({
        title: "Contato criado",
        description: `Contato "${contactData.name}" criado com sucesso.`,
      });

    } catch (error) {
      console.error('Erro ao criar contato:', error);
      toast({
        title: "Erro ao criar contato",
        description: error instanceof Error ? error.message : "Não foi possível criar o contato. Tente novamente.",
        variant: "destructive",
      });
    }
  };

  const handleViewContact = (contact: ExtendedContact) => {
    setSelectedContact(contact);
    setIsViewContactModalOpen(true);
  };

  const handleEditContact = (contact: ExtendedContact) => {
    const formatExistingCurrency = (value: string) => {
      if (!value || value === '') return '';
      const cleanValue = value.replace(/[^\d,]/g, '');
      const numericValue = parseFloat(cleanValue.replace(',', '.'));
      if (isNaN(numericValue)) return '';
      return `R$ ${numericValue.toFixed(2).replace('.', ',')}`;
    };

    setEditContactForm({
      name: contact.name,
      cpf: formatCPF(contact.cpf || ''),
      phone: formatPhone(contact.phone),
      modality: contact.modality || '',
      campaign: contact.campaign || '',
      notes: contact.notes,
      installment: formatExistingCurrency(contact.installment || ''),
      outstandingBalance: formatExistingCurrency(contact.outstandingBalance || '')
    });
    setSelectedContact(contact);
    setIsEditContactModalOpen(true);
  };

  const handleUpdateContact = async () => {
    if (!selectedContact) return;

    try {
      const contactData = {
        ...editContactForm,
        cpf: unformatCPF(editContactForm.cpf),
        phone: unformatPhone(editContactForm.phone),
      };

      await updateContact(selectedContact.id, contactData);
      
      setIsEditContactModalOpen(false);
      setSelectedContact(null);
      await loadContacts();
      
      toast({
        title: "Contato atualizado",
        description: `Contato "${contactData.name}" atualizado com sucesso.`,
      });

    } catch (error) {
      console.error('Erro ao atualizar contato:', error);
      toast({
        title: "Erro ao atualizar contato",
        description: error instanceof Error ? error.message : "Não foi possível atualizar o contato. Tente novamente.",
        variant: "destructive",
      });
    }
  };

  const handleDeleteContact = async (contact: ExtendedContact) => {
    setDeletingContactIds(prev => new Set(prev).add(contact.id));

    try {
      await deleteContact(contact.id);
      await loadContacts();
      
      toast({
        title: "Contato excluído",
        description: `Contato "${contact.name}" excluído com sucesso.`,
      });

    } catch (error) {
      console.error('Erro ao excluir contato:', error);
      
      if (error instanceof Error && error.message.includes('Failed to fetch')) {
        setContacts(prevContacts => prevContacts.filter(c => c.id !== contact.id));
        toast({
          title: "Contato removido",
          description: `Contato "${contact.name}" removido da lista (verificar conectividade).`,
          variant: "destructive",
        });
      } else {
        toast({
          title: "Erro ao excluir contato",
          description: error instanceof Error ? error.message : "Não foi possível excluir o contato. Tente novamente.",
          variant: "destructive",
        });
      }
    } finally {
      setDeletingContactIds(prev => {
        const newSet = new Set(prev);
        newSet.delete(contact.id);
        return newSet;
      });
    }
  };

  // Funções para importação CSV
  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!file.name.endsWith('.csv')) {
      toast({
        title: "Arquivo inválido",
        description: "Por favor, selecione um arquivo CSV válido.",
        variant: "destructive",
      });
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const csvText = e.target?.result as string;
        const contacts = processCSV(csvText, importCampaign);
        setCsvData(contacts);
        
        toast({
          title: "Arquivo processado",
          description: `${contacts.length} contatos encontrados no arquivo.`,
        });
      } catch (error) {
        toast({
          title: "Erro ao processar arquivo",
          description: error instanceof Error ? error.message : "Erro desconhecido ao processar CSV.",
          variant: "destructive",
        });
      }
    };
    reader.readAsText(file);
  };

  const handleImportContacts = async () => {
    if (csvData.length === 0) {
      toast({
        title: "Nenhum dado para importar",
        description: "Selecione um arquivo CSV válido.",
        variant: "destructive",
      });
      return;
    }

    setIsImporting(true);

    try {
      // Adicionar campanha aos dados se selecionada
      const dataToImport = csvData.map(contact => ({
        ...contact,
        campaign: importCampaign !== 'none' ? importCampaign : undefined
      }));

      await importContacts(dataToImport);
      
      setIsImportModalOpen(false);
      setCsvData([]);
      setImportCampaign('none');
      
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }

      await loadContacts();

      toast({
        title: "Importação concluída",
        description: `${csvData.length} contatos importados com sucesso.`,
      });

    } catch (error: any) {
      console.error('Erro na importação:', error);
      toast({
        title: "Erro na importação",
        description: error.message || "Erro ao importar contatos. Tente novamente.",
        variant: "destructive",
      });
    } finally {
      setIsImporting(false);
    }
  };

  // Funções para campanhas
  const handleAssignCampaign = async () => {
    if (selectedCampaignContacts.length === 0 || !campaignToAssign) {
      return;
    }

    try {
      const updates = selectedCampaignContacts.map(async (contactId) => {
        const contactToUpdate = contacts.find(c => c.id === contactId);
        if (!contactToUpdate) return null;

        const updatedContact = {
          ...contactToUpdate,
          campaign: campaignToAssign === 'none' ? undefined : campaignToAssign
        };

        const response = await fetch(`http://localhost:8001/api/contacts/${contactId}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(updatedContact),
        });

        if (!response.ok) {
          throw new Error(`Erro ao atualizar contato ${contactToUpdate.name}`);
        }

        return response.json();
      });

      await Promise.all(updates);
      
      // Atualizar estado local
      setContacts(prev => prev.map(contact => 
        selectedCampaignContacts.includes(contact.id)
          ? { ...contact, campaign: campaignToAssign === 'none' ? undefined : campaignToAssign }
          : contact
      ));

      setIsCampaignModalOpen(false);
      setSelectedCampaignContacts([]);
      setCampaignToAssign('');

      toast({
        title: campaignToAssign === 'none' ? "Campanhas removidas" : "Campanha atribuída",
        description: campaignToAssign === 'none' 
          ? `Campanha removida de ${selectedCampaignContacts.length} contato(s).`
          : `Campanha "${campaignToAssign}" atribuída a ${selectedCampaignContacts.length} contato(s).`,
      });

    } catch (error: any) {
      console.error('Erro ao atribuir campanha:', error);
      toast({
        title: "Erro",
        description: "Erro ao atribuir campanha. Tente novamente.",
        variant: "destructive",
      });
    }
  };

  const toggleContactSelection = (contactId: string) => {
    setSelectedCampaignContacts(prev =>
      prev.includes(contactId)
        ? prev.filter(id => id !== contactId)
        : [...prev, contactId]
    );
  };

  // Função para adicionar nova campanha
  const handleAddCampaign = () => {
    if (newCampaignName.trim() && !campaignOptions.includes(newCampaignName.trim())) {
      setCampaignOptions(prev => [...prev, newCampaignName.trim()]);
      setNewCampaignName('');
      toast({
        title: "Campanha adicionada",
        description: `Campanha "${newCampaignName.trim()}" foi criada com sucesso.`,
      });
    } else if (campaignOptions.includes(newCampaignName.trim())) {
      toast({
        title: "Erro",
        description: "Esta campanha já existe.",
        variant: "destructive",
      });
    }
  };

  // Função para excluir campanha
  const handleDeleteCampaign = () => {
    if (campaignToDelete && campaignToDelete !== 'none') {
      setCampaignOptions(prev => prev.filter(option => option !== campaignToDelete));
      setCampaignToDelete('');
      toast({
        title: "Campanha removida",
        description: `Campanha "${campaignToDelete}" foi removida com sucesso.`,
      });
    }
  };

  // Handlers para formatação de campos
  const handleNewContactCPFChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNewContactForm(prev => ({ ...prev, cpf: formatCPF(e.target.value) }));
  };

  const handleNewContactPhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNewContactForm(prev => ({ ...prev, phone: formatPhone(e.target.value) }));
  };

  const handleNewContactInstallmentChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNewContactForm(prev => ({ ...prev, installment: formatCurrency(e.target.value) }));
  };

  const handleNewContactOutstandingBalanceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNewContactForm(prev => ({ ...prev, outstandingBalance: formatCurrency(e.target.value) }));
  };

  const handleEditContactCPFChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEditContactForm(prev => ({ ...prev, cpf: formatCPF(e.target.value) }));
  };

  const handleEditContactPhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEditContactForm(prev => ({ ...prev, phone: formatPhone(e.target.value) }));
  };

  const handleEditContactInstallmentChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEditContactForm(prev => ({ ...prev, installment: formatCurrency(e.target.value) }));
  };

  const handleEditContactOutstandingBalanceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEditContactForm(prev => ({ ...prev, outstandingBalance: formatCurrency(e.target.value) }));
  };

  const columns = [
    {
      accessorKey: 'name',
      header: 'Nome',
      cell: ({ row }: any) => (
        <div className="font-medium text-gray-900 dark:text-gray-100">
          {row.getValue('name')}
        </div>
      )
    },
    {
      accessorKey: 'phone',
      header: 'Telefone',
      cell: ({ row }: any) => (
        <div className="text-gray-600 dark:text-gray-300">
          {row.getValue('phone')}
        </div>
      )
    },
    {
      accessorKey: 'cpf',
      header: 'CPF',
      cell: ({ row }: any) => (
        <div className="text-gray-600 dark:text-gray-300">
          {row.getValue('cpf')}
        </div>
      )
    },
    {
      accessorKey: 'modality',
      header: 'Modalidade',
      cell: ({ row }: any) => {
        const modality = row.getValue('modality');
        if (!modality) return null;
        
        const getModalityColor = (mod: string) => {
          switch (mod) {
            case 'Portabilidade':
              return 'bg-blue-100 text-blue-800 border-blue-200 dark:bg-blue-900 dark:text-blue-300 dark:border-blue-700';
            case 'Port + Refin':
              return 'bg-purple-100 text-purple-800 border-purple-200 dark:bg-purple-900 dark:text-purple-300 dark:border-purple-700';
            case 'Contrato Novo':
              return 'bg-green-100 text-green-800 border-green-200 dark:bg-green-900 dark:text-green-300 dark:border-green-700';
            default:
              return 'bg-gray-100 text-gray-800 border-gray-200 dark:bg-gray-800 dark:text-gray-300 dark:border-gray-600';
          }
        };

        return (
          <Badge className={`w-28 text-center text-xs ${getModalityColor(modality)}`}>
            {modality}
          </Badge>
        );
      }
    },
    {
      accessorKey: 'installment',
      header: 'Parcela',
      cell: ({ row }: any) => {
        const installment = row.getValue('installment');
        return installment ? (
          <div className="text-gray-600 dark:text-gray-300 font-medium">
            {installment}
          </div>
        ) : (
          <div className="text-gray-400 dark:text-gray-500">-</div>
        );
      }
    },
    {
      accessorKey: 'outstandingBalance',
      header: 'Saldo Devedor',
      cell: ({ row }: any) => {
        const outstandingBalance = row.getValue('outstandingBalance');
        return outstandingBalance ? (
          <div className="text-gray-600 dark:text-gray-300 font-medium">
            {outstandingBalance}
          </div>
        ) : (
          <div className="text-gray-400 dark:text-gray-500">-</div>
        );
      }
    },
    {
      accessorKey: 'campaign',
      header: 'Campanha',
      cell: ({ row }: any) => {
        const campaign = row.getValue('campaign');
        return campaign ? (
          <Badge className="bg-orange-100 text-orange-800 border-orange-200 dark:bg-orange-900 dark:text-orange-300 dark:border-orange-700 w-32 text-center text-xs">
            {campaign}
          </Badge>
        ) : (
          <div className="text-gray-400 dark:text-gray-500">-</div>
        );
      }
    },
    {
      accessorKey: 'lastContact',
      header: 'Último Contato',
      cell: ({ row }: any) => {
        const lastContact = row.getValue('lastContact');
        return lastContact ? (
          <div className="text-gray-600 dark:text-gray-300">
            {formatDate(lastContact)}
          </div>
        ) : (
          <div className="text-gray-400 dark:text-gray-500">-</div>
        );
      }
    },
    {
      id: 'actions',
      header: 'Ações',
      cell: ({ row }: any) => (
        <TableActionMenu
          onView={() => handleViewContact(row.original)}
          onEdit={() => handleEditContact(row.original)}
          onDelete={() => handleDeleteContact(row.original)}
        />
      )
    }
  ];

  return (
    <div className="space-y-6 animate-fade-in">
      <PageHeader
        title="Contatos"
        description="Gerencie seus contatos com informações completas de leads"
      >
        <div className="flex flex-wrap gap-2">
          <Button
            variant="outline"
            onClick={loadContacts}
            disabled={isRefreshing}
            className="flex items-center gap-2"
          >
            <RefreshCw className={`h-4 w-4 ${isRefreshing ? 'animate-spin' : ''}`} />
            Atualizar
          </Button>
          
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="flex items-center gap-2">
                <Download className="h-4 w-4" />
                Baixar Template
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem onClick={downloadTemplate}>
                <Download className="h-4 w-4 mr-2" />
                Template CSV
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          <Button
            variant="outline" 
            onClick={() => setIsImportModalOpen(true)}
            className="flex items-center gap-2"
          >
            <Upload className="h-4 w-4" />
            Importar CSV
          </Button>

          <Button
            variant="outline" 
            onClick={() => setIsCampaignModalOpen(true)}
            className="flex items-center gap-2"
          >
            <Tag className="h-4 w-4" />
            Gerenciar Campanhas
          </Button>
          
          <Button 
            onClick={() => setIsNewContactModalOpen(true)}
            disabled={isLoading}
          >
            <Plus className="h-4 w-4 mr-2" />
            Novo Contato
          </Button>
        </div>
      </PageHeader>

      <DataTable
        columns={columns}
        data={contacts}
        searchColumn="name"
        searchPlaceholder="Buscar por nome..."
      />

      {/* Modal para criar novo contato */}
      <Dialog open={isNewContactModalOpen} onOpenChange={setIsNewContactModalOpen}>
        <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Criar Novo Contato</DialogTitle>
            <DialogDescription>
              Preencha as informações do contato. Todos os campos são opcionais.
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            <div className="space-y-4">
              <div>
                <Label htmlFor="name">Nome Completo *</Label>
                <Input
                  id="name"
                  value={newContactForm.name}
                  onChange={(e) => setNewContactForm({ ...newContactForm, name: e.target.value })}
                  placeholder="Digite o nome completo"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="cpf">CPF</Label>
                  <Input
                    id="cpf"
                    value={newContactForm.cpf}
                    onChange={handleNewContactCPFChange}
                    placeholder="000.000.000-00"
                    maxLength={14}
                  />
                </div>
                <div>
                  <Label htmlFor="phone">Telefone</Label>
                  <Input
                    id="phone"
                    value={newContactForm.phone}
                    onChange={handleNewContactPhoneChange}
                    placeholder="(00) 00000-0000"
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="modality">Modalidade</Label>
                <Select 
                  value={newContactForm.modality} 
                  onValueChange={(value: string) => setNewContactForm({ ...newContactForm, modality: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione a modalidade" />
                  </SelectTrigger>
                  <SelectContent>
                    {modalityOptions.map((option) => (
                      <SelectItem key={option} value={option}>
                        {option}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="campaign">Campanha</Label>
                <Select 
                  value={newContactForm.campaign} 
                  onValueChange={(value: string) => setNewContactForm({ ...newContactForm, campaign: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione a campanha" />
                  </SelectTrigger>
                  <SelectContent>
                    {campaignOptions.map((option) => (
                      <SelectItem key={option} value={option}>
                        {option}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="installment">Parcela</Label>
                  <Input
                    id="installment"
                    value={newContactForm.installment}
                    onChange={handleNewContactInstallmentChange}
                    placeholder="R$ 0,00"
                  />
                </div>
                <div>
                  <Label htmlFor="outstandingBalance">Saldo Devedor</Label>
                  <Input
                    id="outstandingBalance"
                    value={newContactForm.outstandingBalance}
                    onChange={handleNewContactOutstandingBalanceChange}
                    placeholder="R$ 0,00"
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="notes">Observações</Label>
                <Textarea
                  id="notes"
                  value={newContactForm.notes}
                  onChange={(e) => setNewContactForm({ ...newContactForm, notes: e.target.value })}
                  placeholder="Observações adicionais..."
                  rows={3}
                />
              </div>
            </div>
          </div>
          
          <DialogFooter>
            <Button 
              variant="outline" 
              onClick={() => setIsNewContactModalOpen(false)}
            >
              Cancelar
            </Button>
            <Button onClick={handleCreateContact}>
              Criar Contato
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Modal para visualizar contato */}
      <Dialog open={isViewContactModalOpen} onOpenChange={setIsViewContactModalOpen}>
        <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Detalhes do Contato</DialogTitle>
            <DialogDescription>
              Informações detalhadas do contato
            </DialogDescription>
          </DialogHeader>
          
          {selectedContact && (
            <div className="space-y-4 py-4">
              <div className="space-y-4">
                <div className="grid grid-cols-1 gap-2">
                  <Label className="text-sm font-medium text-gray-600">Nome</Label>
                  <p className="text-sm text-gray-900 dark:text-gray-100 bg-gray-50 dark:bg-gray-800 px-3 py-2 rounded-md">
                    {selectedContact.name}
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label className="text-sm font-medium text-gray-600">CPF</Label>
                    <p className="text-sm text-gray-900 dark:text-gray-100 bg-gray-50 dark:bg-gray-800 px-3 py-2 rounded-md">
                      {selectedContact.cpf || '-'}
                    </p>
                  </div>
                  <div className="space-y-2">
                    <Label className="text-sm font-medium text-gray-600">Telefone</Label>
                    <p className="text-sm text-gray-900 dark:text-gray-100 bg-gray-50 dark:bg-gray-800 px-3 py-2 rounded-md">
                      {selectedContact.phone}
                    </p>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label className="text-sm font-medium text-gray-600">Modalidade</Label>
                  <div>
                    {selectedContact.modality ? (
                      <Badge className={`w-28 text-center text-xs ${(() => {
                        switch (selectedContact.modality) {
                          case 'Portabilidade':
                            return 'bg-blue-100 text-blue-800 border-blue-200 dark:bg-blue-900 dark:text-blue-300 dark:border-blue-700';
                          case 'Port + Refin':
                            return 'bg-purple-100 text-purple-800 border-purple-200 dark:bg-purple-900 dark:text-purple-300 dark:border-purple-700';
                          case 'Contrato Novo':
                            return 'bg-green-100 text-green-800 border-green-200 dark:bg-green-900 dark:text-green-300 dark:border-green-700';
                          default:
                            return 'bg-gray-100 text-gray-800 border-gray-200 dark:bg-gray-800 dark:text-gray-300 dark:border-gray-600';
                        }
                      })()}`}>
                        {selectedContact.modality}
                      </Badge>
                    ) : (
                      <span className="text-sm text-gray-500">-</span>
                    )}
                  </div>
                </div>

                <div className="space-y-2">
                  <Label className="text-sm font-medium text-gray-600">Campanha</Label>
                  <div>
                    {selectedContact.campaign ? (
                      <Badge className="bg-orange-100 text-orange-800 border-orange-200 dark:bg-orange-900 dark:text-orange-300 dark:border-orange-700 w-32 text-center text-xs">
                        {selectedContact.campaign}
                      </Badge>
                    ) : (
                      <span className="text-sm text-gray-500">-</span>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label className="text-sm font-medium text-gray-600">Parcela</Label>
                    <p className="text-sm text-gray-900 dark:text-gray-100 bg-gray-50 dark:bg-gray-800 px-3 py-2 rounded-md">
                      {selectedContact.installment || '-'}
                    </p>
                  </div>
                  <div className="space-y-2">
                    <Label className="text-sm font-medium text-gray-600">Saldo Devedor</Label>
                    <p className="text-sm text-gray-900 dark:text-gray-100 bg-gray-50 dark:bg-gray-800 px-3 py-2 rounded-md">
                      {selectedContact.outstandingBalance || '-'}
                    </p>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label className="text-sm font-medium text-gray-600">Observações</Label>
                  <p className="text-sm text-gray-900 dark:text-gray-100 bg-gray-50 dark:bg-gray-800 px-3 py-2 rounded-md min-h-[80px]">
                    {selectedContact.notes || '-'}
                  </p>
                </div>

                <div className="space-y-2">
                  <Label className="text-sm font-medium text-gray-600">Data de Criação</Label>
                  <p className="text-sm text-gray-900 dark:text-gray-100 bg-gray-50 dark:bg-gray-800 px-3 py-2 rounded-md">
                    {formatDate(selectedContact.createdAt)}
                  </p>
                </div>
              </div>
            </div>
          )}
          
          <DialogFooter>
            <Button 
              variant="outline" 
              onClick={() => setIsViewContactModalOpen(false)}
            >
              Fechar
            </Button>
            <Button onClick={() => {
              setIsViewContactModalOpen(false);
              if (selectedContact) {
                handleEditContact(selectedContact);
              }
            }}>
              Editar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Modal para editar contato */}
      <Dialog open={isEditContactModalOpen} onOpenChange={setIsEditContactModalOpen}>
        <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Editar Contato</DialogTitle>
            <DialogDescription>
              Atualize as informações do contato
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            <div className="space-y-4">
              <div>
                <Label htmlFor="edit-name">Nome Completo *</Label>
                <Input
                  id="edit-name"
                  value={editContactForm.name}
                  onChange={(e) => setEditContactForm({ ...editContactForm, name: e.target.value })}
                  placeholder="Digite o nome completo"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="edit-cpf">CPF</Label>
                  <Input
                    id="edit-cpf"
                    value={editContactForm.cpf}
                    onChange={handleEditContactCPFChange}
                    placeholder="000.000.000-00"
                    maxLength={14}
                  />
                </div>
                <div>
                  <Label htmlFor="edit-phone">Telefone</Label>
                  <Input
                    id="edit-phone"
                    value={editContactForm.phone}
                    onChange={handleEditContactPhoneChange}
                    placeholder="(00) 00000-0000"
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="edit-modality">Modalidade</Label>
                <Select 
                  value={editContactForm.modality} 
                  onValueChange={(value: string) => setEditContactForm({ ...editContactForm, modality: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione a modalidade" />
                  </SelectTrigger>
                  <SelectContent>
                    {modalityOptions.map((option) => (
                      <SelectItem key={option} value={option}>
                        {option}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="edit-campaign">Campanha</Label>
                <Select 
                  value={editContactForm.campaign} 
                  onValueChange={(value: string) => setEditContactForm({ ...editContactForm, campaign: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione a campanha" />
                  </SelectTrigger>
                  <SelectContent>
                    {campaignOptions.map((option) => (
                      <SelectItem key={option} value={option}>
                        {option}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="edit-installment">Parcela</Label>
                  <Input
                    id="edit-installment"
                    value={editContactForm.installment}
                    onChange={handleEditContactInstallmentChange}
                    placeholder="R$ 0,00"
                  />
                </div>
                <div>
                  <Label htmlFor="edit-outstandingBalance">Saldo Devedor</Label>
                  <Input
                    id="edit-outstandingBalance"
                    value={editContactForm.outstandingBalance}
                    onChange={handleEditContactOutstandingBalanceChange}
                    placeholder="R$ 0,00"
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="edit-notes">Observações</Label>
                <Textarea
                  id="edit-notes"
                  value={editContactForm.notes}
                  onChange={(e) => setEditContactForm({ ...editContactForm, notes: e.target.value })}
                  placeholder="Observações adicionais..."
                  rows={3}
                />
              </div>
            </div>
          </div>
          
          <DialogFooter>
            <Button 
              variant="outline" 
              onClick={() => setIsEditContactModalOpen(false)}
            >
              Cancelar
            </Button>
            <Button onClick={handleUpdateContact}>
              Salvar Alterações
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Modal para importar CSV */}
      <Dialog open={isImportModalOpen} onOpenChange={setIsImportModalOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Importar Contatos via CSV</DialogTitle>
            <DialogDescription>
              Selecione um arquivo CSV para importar contatos em lote
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            <div className="space-y-4">
              <div>
                <Label htmlFor="csv-file">Arquivo CSV</Label>
                <Input
                  id="csv-file"
                  type="file"
                  accept=".csv"
                  onChange={handleFileUpload}
                  ref={fileInputRef}
                />
                <p className="text-xs text-muted-foreground mt-1">
                  Formato aceito: CSV com separador ";" (ponto e vírgula)
                </p>
              </div>

              <div>
                <Label htmlFor="import-campaign">Campanha para todos os contatos (opcional)</Label>
                <Select value={importCampaign} onValueChange={setImportCampaign}>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione uma campanha" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">Nenhuma campanha</SelectItem>
                    {campaignOptions.map((option) => (
                      <SelectItem key={option} value={option}>
                        {option}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {csvData.length > 0 && (
                <div className="border rounded-lg p-3">
                  <Label className="text-sm font-medium">Preview dos dados</Label>
                  <p className="text-sm text-muted-foreground">
                    {csvData.length} contato(s) encontrado(s) no arquivo
                  </p>
                  <div className="mt-2 max-h-32 overflow-y-auto">
                    {csvData.slice(0, 3).map((contact, index) => (
                      <div key={index} className="text-xs bg-gray-50 dark:bg-gray-800 p-2 rounded mb-1">
                        <strong>{contact.name}</strong> - {contact.phone || 'Sem telefone'} - {contact.cpf || 'Sem CPF'}
                      </div>
                    ))}
                    {csvData.length > 3 && (
                      <p className="text-xs text-muted-foreground">
                        ... e mais {csvData.length - 3} contato(s)
                      </p>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
          
          <DialogFooter>
            <Button 
              variant="outline" 
              onClick={() => {
                setIsImportModalOpen(false);
                setCsvData([]);
                setImportCampaign('none');
              }}
            >
              Cancelar
            </Button>
            <Button 
              onClick={handleImportContacts}
              disabled={csvData.length === 0 || isImporting}
            >
              {isImporting ? 'Importando...' : 'Importar Contatos'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Modal para gerenciar campanhas */}
      <Dialog open={isCampaignModalOpen} onOpenChange={setIsCampaignModalOpen}>
        <DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Gerenciar Campanhas</DialogTitle>
            <DialogDescription>
              Adicione, remova campanhas ou atribua campanhas aos contatos
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-6 py-4">
            {/* Seção para adicionar nova campanha */}
            <div className="border rounded-lg p-4">
              <h3 className="font-medium text-sm mb-3">Adicionar Nova Campanha</h3>
              <div className="flex gap-2">
                <Input
                  placeholder="Nome da nova campanha..."
                  value={newCampaignName}
                  onChange={(e) => setNewCampaignName(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleAddCampaign()}
                  className="flex-1"
                />
                <Button onClick={handleAddCampaign} disabled={!newCampaignName.trim()}>
                  Adicionar
                </Button>
              </div>
            </div>

            {/* Seção para excluir campanha */}
            <div className="border rounded-lg p-4">
              <h3 className="font-medium text-sm mb-3">Excluir Campanha</h3>
              <div className="flex gap-2">
                <Select value={campaignToDelete} onValueChange={setCampaignToDelete}>
                  <SelectTrigger className="flex-1">
                    <SelectValue placeholder="Selecione campanha para excluir" />
                  </SelectTrigger>
                  <SelectContent>
                    {campaignOptions.map((option) => (
                      <SelectItem key={option} value={option}>
                        {option}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Button 
                  variant="destructive" 
                  onClick={handleDeleteCampaign} 
                  disabled={!campaignToDelete || campaignToDelete === 'none'}
                >
                  Excluir
                </Button>
              </div>
            </div>

            {/* Lista de campanhas existentes */}
            <div className="border rounded-lg p-4">
              <h3 className="font-medium text-sm mb-3">Campanhas Existentes ({campaignOptions.length})</h3>
              <div className="grid grid-cols-2 gap-2 max-h-32 overflow-y-auto">
                {campaignOptions.map((campaign) => (
                  <div key={campaign} className="bg-orange-50 dark:bg-orange-950 p-2 rounded text-xs">
                    <span className="text-orange-800 dark:text-orange-200">{campaign}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Seção para atribuir campanhas */}
            <div className="border rounded-lg p-4">
              <h3 className="font-medium text-sm mb-3">Atribuir Campanha aos Contatos</h3>
              
              <div className="space-y-4">
                <div>
                  <Label>Selecionar Contatos</Label>
                  <p className="text-sm text-muted-foreground mb-3">
                    Marque os contatos que deseja atribuir à campanha
                  </p>
                  <div className="border rounded-lg max-h-64 overflow-y-auto">
                    {contacts.map((contact) => (
                      <div key={contact.id} className="flex items-center space-x-3 p-3 border-b last:border-b-0">
                        <input
                          type="checkbox"
                          id={`contact-${contact.id}`}
                          checked={selectedCampaignContacts.includes(contact.id)}
                          onChange={() => toggleContactSelection(contact.id)}
                          className="rounded border-gray-300"
                        />
                        <label htmlFor={`contact-${contact.id}`} className="flex-1 cursor-pointer">
                          <div className="font-medium text-sm">{contact.name}</div>
                          <div className="text-xs text-muted-foreground">
                            {contact.phone} - {contact.cpf || 'Sem CPF'}
                            {contact.campaign && (
                              <span className="ml-2 inline-flex items-center px-2 py-0.5 rounded-full text-xs bg-orange-100 text-orange-800">
                                {contact.campaign}
                              </span>
                            )}
                          </div>
                        </label>
                      </div>
                    ))}
                  </div>
                  <p className="text-xs text-muted-foreground mt-2">
                    {selectedCampaignContacts.length} contato(s) selecionado(s)
                  </p>
                </div>

                <div>
                  <Label htmlFor="campaign-select">Campanha</Label>
                  <Select value={campaignToAssign} onValueChange={setCampaignToAssign}>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione uma campanha" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="none">Remover campanha</SelectItem>
                      {campaignOptions.map((option) => (
                        <SelectItem key={option} value={option}>
                          {option}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <Button 
                  onClick={handleAssignCampaign}
                  disabled={selectedCampaignContacts.length === 0 || !campaignToAssign}
                  className="w-full"
                >
                  {campaignToAssign === 'none' ? 'Remover Campanha dos Contatos' : 'Atribuir Campanha'}
                </Button>
              </div>
            </div>
          </div>
          
          <DialogFooter>
            <Button 
              variant="outline" 
              onClick={() => {
                setIsCampaignModalOpen(false);
                setSelectedCampaignContacts([]);
                setCampaignToAssign('');
                setNewCampaignName('');
                setCampaignToDelete('');
              }}
            >
              Fechar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}