// Lead mock data
export interface Lead {
  id: string;
  name: string;
  cpf: string;
  phone: string;
  source: string;
  modality?: string;
  status: 'Novo' | 'Aguardando retorno' | 'Sem interesse' | 'Aguardando assinatura' | 'Aguardando saldo cip' | 'Benefício bloqueado' | 'Contrato pago' | 'Contrato cancelado';
  assignedTo: string;
  createdAt: string;
  installment?: string;
  outstandingBalance?: string;
}

export const leads: Lead[] = [
  {
    id: '1',
    name: 'Roberto Almeida',
    cpf: '123.456.789-01',
    phone: '(11) 98765-4321',
    source: 'Ura',
    modality: 'Portabilidade',
    status: 'Novo',
    assignedTo: 'Ana Rodrigues',
    createdAt: '2025-05-09T14:30:00Z',
    installment: 'R$ 450,00',
    outstandingBalance: 'R$ 12.500,00',
  },
  {
    id: '2',
    name: 'Mariana Oliveira',
    cpf: '987.654.321-02',
    phone: '(11) 91234-5678',
    source: 'Sms',
    modality: 'Port + Refin',
    status: 'Aguardando retorno',
    assignedTo: 'Carlos Silva',
    createdAt: '2025-05-08T09:15:00Z',
    installment: 'R$ 320,00',
    outstandingBalance: 'R$ 8.900,00',
  },
  {
    id: '3',
    name: 'José Santos',
    cpf: '456.789.123-03',
    phone: '(11) 95678-9012',
    source: 'Outros',
    modality: 'Contrato Novo',
    status: 'Sem interesse',
    assignedTo: 'Fernanda Costa',
    createdAt: '2025-05-07T16:45:00Z',
    installment: 'R$ 280,00',
    outstandingBalance: 'R$ 6.200,00',
  },
  {
    id: '4',
    name: 'Ana Paula Lima',
    cpf: '789.123.456-04',
    phone: '(11) 92345-6789',
    source: 'Ura',
    modality: 'Portabilidade',
    status: 'Aguardando assinatura',
    assignedTo: 'Roberto Ferreira',
    createdAt: '2025-05-06T11:20:00Z',
    installment: 'R$ 520,00',
    outstandingBalance: 'R$ 15.800,00',
  },
  {
    id: '5',
    name: 'Pedro Henrique',
    cpf: '321.654.987-05',
    phone: '(11) 99876-5432',
    source: 'Sms',
    modality: 'Port + Refin',
    status: 'Aguardando saldo cip',
    assignedTo: 'Marina Santos',
    createdAt: '2025-05-05T13:10:00Z',
    installment: 'R$ 380,00',
    outstandingBalance: 'R$ 11.400,00',
  },
]; 