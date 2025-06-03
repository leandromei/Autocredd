// User mock data
export interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  status: 'active' | 'inactive';
  lastLogin: string;
  createdAt: string;
}

export const users: User[] = [
  {
    id: '1',
    name: 'Admin User',
    email: 'admin@autocredgold.com',
    role: 'admin',
    status: 'active',
    lastLogin: '2025-05-10T14:30:00Z',
    createdAt: '2025-01-15T09:00:00Z',
  },
  {
    id: '2',
    name: 'Carlos Silva',
    email: 'carlos@example.com',
    role: 'manager',
    status: 'active',
    lastLogin: '2025-05-09T11:20:00Z',
    createdAt: '2025-02-10T10:30:00Z',
  },
  {
    id: '3',
    name: 'Ana Rodrigues',
    email: 'ana@example.com',
    role: 'agent',
    status: 'active',
    lastLogin: '2025-05-08T16:45:00Z',
    createdAt: '2025-03-05T14:20:00Z',
  },
  {
    id: '4',
    name: 'Pedro Santos',
    email: 'pedro@example.com',
    role: 'agent',
    status: 'inactive',
    lastLogin: '2025-04-20T09:15:00Z',
    createdAt: '2025-03-10T11:00:00Z',
  },
  {
    id: '5',
    name: 'Julia Costa',
    email: 'julia@example.com',
    role: 'agent',
    status: 'active',
    lastLogin: '2025-05-10T10:30:00Z',
    createdAt: '2025-03-15T09:45:00Z',
  },
];

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
  {
    id: '6',
    name: 'Fernanda Lima',
    cpf: '111.222.333-06',
    phone: '(11) 94433-2211',
    source: 'Outros',
    modality: 'Contrato Novo',
    status: 'Benefício bloqueado',
    assignedTo: 'Carlos Silva',
    createdAt: '2025-05-04T12:10:00Z',
  },
  {
    id: '7',
    name: 'Rafael Costa',
    cpf: '555.666.777-07',
    phone: '(21) 93322-1100',
    source: 'Ura',
    modality: 'Portabilidade',
    status: 'Aguardando saldo cip',
    assignedTo: 'Pedro Santos',
    createdAt: '2025-05-03T08:45:00Z',
  },
  {
    id: '8',
    name: 'Juliana Rocha',
    cpf: '888.999.000-08',
    phone: '(31) 92211-0099',
    source: 'Sms',
    modality: 'Port + Refin',
    status: 'Contrato cancelado',
    assignedTo: 'Julia Costa',
    createdAt: '2025-05-02T17:30:00Z',
  },
];

// Plan mock data
export interface Plan {
  id: string;
  name: string;
  description: string;
  price: number;
  billingCycle: 'monthly' | 'yearly';
  features: string[];
  isActive: boolean;
  createdAt: string;
}

export const plans: Plan[] = [
  {
    id: '1',
    name: 'Plano Básico',
    description: 'Ideal para iniciantes',
    price: 99.90,
    billingCycle: 'monthly',
    features: ['Até 50 leads', 'Suporte por email', 'Relatórios básicos'],
    isActive: true,
    createdAt: '2025-01-10T10:00:00Z',
  },
  {
    id: '2',
    name: 'Plano Profissional',
    description: 'Para equipes em crescimento',
    price: 199.90,
    billingCycle: 'monthly',
    features: ['Até 200 leads', 'Suporte prioritário', 'Relatórios avançados', 'Integrações'],
    isActive: true,
    createdAt: '2025-01-10T10:30:00Z',
  },
  {
    id: '3',
    name: 'Plano Empresarial',
    description: 'Solução completa para empresas',
    price: 399.90,
    billingCycle: 'monthly',
    features: ['Leads ilimitados', 'Suporte 24/7', 'Relatórios personalizados', 'API acesso', 'Equipes múltiplas'],
    isActive: true,
    createdAt: '2025-01-10T11:00:00Z',
  },
  {
    id: '4',
    name: 'Plano Anual Básico',
    description: 'Economia de 20% no pagamento anual',
    price: 958.80,
    billingCycle: 'yearly',
    features: ['Até 50 leads', 'Suporte por email', 'Relatórios básicos'],
    isActive: true,
    createdAt: '2025-01-15T10:00:00Z',
  },
  {
    id: '5',
    name: 'Plano Legado',
    description: 'Plano antigo não disponível para novos clientes',
    price: 79.90,
    billingCycle: 'monthly',
    features: ['Até 30 leads', 'Suporte por email'],
    isActive: false,
    createdAt: '2024-06-10T10:00:00Z',
  },
];

// Commission mock data
export interface Commission {
  id: string;
  agentName: string;
  agentId: string;
  contractId: string;
  clientName: string;
  amount: number;
  status: 'pending' | 'approved' | 'paid' | 'rejected';
  createdAt: string;
  paidAt: string | null;
}

export const commissions: Commission[] = [
  {
    id: '1',
    agentName: 'Ana Rodrigues',
    agentId: '3',
    contractId: '1001',
    clientName: 'Roberto Almeida',
    amount: 450.00,
    status: 'paid',
    createdAt: '2025-04-15T14:30:00Z',
    paidAt: '2025-04-20T10:00:00Z',
  },
  {
    id: '2',
    agentName: 'Pedro Santos',
    agentId: '4',
    contractId: '1002',
    clientName: 'Mariana Oliveira',
    amount: 320.00,
    status: 'approved',
    createdAt: '2025-04-28T16:45:00Z',
    paidAt: null,
  },
  {
    id: '3',
    agentName: 'Julia Costa',
    agentId: '5',
    contractId: '1003',
    clientName: 'Lucas Ferreira',
    amount: 580.00,
    status: 'pending',
    createdAt: '2025-05-05T09:30:00Z',
    paidAt: null,
  },
  {
    id: '4',
    agentName: 'Ana Rodrigues',
    agentId: '3',
    contractId: '1004',
    clientName: 'Camila Santos',
    amount: 290.00,
    status: 'paid',
    createdAt: '2025-04-10T11:20:00Z',
    paidAt: '2025-04-15T14:00:00Z',
  },
  {
    id: '5',
    agentName: 'Pedro Santos',
    agentId: '4',
    contractId: '1005',
    clientName: 'Thiago Mendes',
    amount: 410.00,
    status: 'rejected',
    createdAt: '2025-04-22T15:10:00Z',
    paidAt: null,
  },
];

// Contract mock data
export interface Contract {
  id: string;
  clientName: string;
  clientId: string;
  clientCPF?: string;
  clientPhone?: string;
  planId: string;
  planName: string;
  modality?: string;
  startDate: string;
  endDate: string;
  value: number;
  status: 'active' | 'pending' | 'expired' | 'cancelled';
  createdBy: string;
  createdAt: string;
  installments?: number;
}

export const contracts: Contract[] = [
  {
    id: '1001',
    clientName: 'Roberto Almeida',
    clientId: 'C1001',
    clientCPF: '123.456.789-01',
    clientPhone: '(11) 98765-4321',
    planId: '1',
    planName: 'Plano Básico',
    modality: 'Portabilidade',
    startDate: '2025-04-01T00:00:00Z',
    endDate: '2026-03-31T23:59:59Z',
    value: 1198.80,
    status: 'active',
    createdBy: 'Ana Rodrigues',
    createdAt: '2025-03-25T14:30:00Z',
    installments: 12,
  },
  {
    id: '1002',
    clientName: 'Mariana Oliveira',
    clientId: 'C1002',
    clientCPF: '987.654.321-02',
    clientPhone: '(11) 91234-5678',
    planId: '2',
    planName: 'Plano Profissional',
    modality: 'Port + Refin',
    startDate: '2025-04-15T00:00:00Z',
    endDate: '2025-10-14T23:59:59Z',
    value: 1199.40,
    status: 'active',
    createdBy: 'Pedro Santos',
    createdAt: '2025-04-10T10:15:00Z',
    installments: 6,
  },
  {
    id: '1003',
    clientName: 'Lucas Ferreira',
    clientId: 'C1003',
    clientCPF: '456.789.123-03',
    clientPhone: '(11) 95678-9012',
    planId: '3',
    planName: 'Plano Empresarial',
    modality: 'Contrato Novo',
    startDate: '2025-05-01T00:00:00Z',
    endDate: '2026-04-30T23:59:59Z',
    value: 4798.80,
    status: 'pending',
    createdBy: 'Julia Costa',
    createdAt: '2025-04-25T16:45:00Z',
    installments: 12,
  },
  {
    id: '1004',
    clientName: 'Camila Santos',
    clientId: 'C1004',
    clientCPF: '111.222.333-06',
    clientPhone: '(11) 94433-2211',
    planId: '1',
    planName: 'Plano Básico',
    modality: 'Portabilidade',
    startDate: '2025-03-01T00:00:00Z',
    endDate: '2025-08-31T23:59:59Z',
    value: 599.40,
    status: 'expired',
    createdBy: 'Ana Rodrigues',
    createdAt: '2025-02-20T09:30:00Z',
    installments: 6,
  },
  {
    id: '1005',
    clientName: 'Thiago Mendes',
    clientId: 'C1005',
    clientCPF: '888.999.000-08',
    clientPhone: '(31) 92211-0099',
    planId: '2',
    planName: 'Plano Profissional',
    modality: 'Port + Refin',
    startDate: '2025-04-01T00:00:00Z',
    endDate: '2026-03-31T23:59:59Z',
    value: 2398.80,
    status: 'cancelled',
    createdBy: 'Pedro Santos',
    createdAt: '2025-03-25T14:20:00Z',
    installments: 12,
  },
];

// Contact mock data
export interface Contact {
  id: string;
  name: string;
  email?: string;
  phone: string;
  company?: string;
  type?: 'client' | 'lead' | 'partner' | 'other';
  lastContact: string | null;
  notes: string;
  createdAt: string;
  cpf?: string;
  installment?: string;
  outstandingBalance?: string;
  modality?: string;
  campaign?: string;
}

export const contacts: Contact[] = [
  {
    id: '1',
    name: 'Maria Silva Santos',
    phone: '(11) 99999-1111',
    cpf: '123.456.789-01',
    modality: 'Portabilidade',
    installment: 'R$ 450,00',
    outstandingBalance: 'R$ 12.500,00',
    campaign: 'Portabilidade 2025',
    type: 'client',
    lastContact: '2025-05-08T14:30:00Z',
    notes: 'Cliente muito satisfeito com os serviços',
    createdAt: '2025-03-15T10:00:00Z',
  },
  {
    id: '2',
    name: 'João Carlos Ferreira',
    phone: '(11) 98888-2222',
    cpf: '987.654.321-00',
    modality: 'Port + Refin',
    installment: 'R$ 380,00',
    outstandingBalance: 'R$ 8.900,00',
    campaign: 'Refinanciamento Q1',
    type: 'lead',
    lastContact: '2025-05-07T09:15:00Z',
    notes: 'Interessado em refinanciamento',
    createdAt: '2025-04-20T14:30:00Z',
  },
  {
    id: '3',
    name: 'Ana Paula Oliveira',
    phone: '(21) 97777-3333',
    cpf: '456.789.123-00',
    modality: 'Contrato Novo',
    installment: 'R$ 520,00',
    outstandingBalance: 'R$ 15.200,00',
    campaign: 'Novos Contratos',
    type: 'partner',
    lastContact: null,
    notes: 'Parceiro estratégico da região sul',
    createdAt: '2025-02-10T11:20:00Z',
  },
  {
    id: '4',
    name: 'Pedro Henrique Costa',
    phone: '(31) 96666-4444',
    cpf: '789.123.456-00',
    modality: 'Portabilidade',
    installment: 'R$ 290,00',
    outstandingBalance: 'R$ 5.800,00',
    campaign: 'Retenção de Clientes',
    type: 'other',
    lastContact: '2025-05-05T16:45:00Z',
    notes: 'Contato para futuras oportunidades',
    createdAt: '2025-04-01T09:30:00Z',
  },
  {
    id: '5',
    name: 'Joao Silva',
    phone: '(11) 99999-9999',
    cpf: '123.456.789-01',
    modality: 'Portabilidade',
    installment: '450.00',
    outstandingBalance: '15000.00',
    campaign: 'Prospecção Digital',
    type: 'client',
    lastContact: '2025-05-09T13:20:00Z',
    notes: 'Cliente importado via CSV',
    createdAt: '2025-01-25T15:45:00Z',
  },
];

// Client mock data
export interface Client {
  id: string;
  name: string;
  cpf: string;
  email: string;
  phone: string;
  status: 'ativo' | 'inativo' | 'potencial' | 'vip';
  contractsCount: number;
  totalValue: number;
  lastActivity: string | null;
  notes: string;
  createdAt: string;
}

export const clients: Client[] = [
  {
    id: '1',
    name: 'Roberto Carlos Silva',
    cpf: '123.456.789-01',
    email: 'roberto.silva@email.com',
    phone: '(11) 99999-1234',
    status: 'ativo',
    contractsCount: 3,
    totalValue: 15500.00,
    lastActivity: '2025-05-10T14:30:00Z',
    notes: 'Cliente VIP com excelente histórico de pagamento',
    createdAt: '2025-01-15T10:00:00Z',
  },
  {
    id: '2',
    name: 'Maria Fernanda Santos',
    cpf: '987.654.321-02',
    email: 'maria.santos@email.com',
    phone: '(21) 98888-5678',
    status: 'ativo',
    contractsCount: 1,
    totalValue: 2500.00,
    lastActivity: '2025-05-09T16:45:00Z',
    notes: 'Nova cliente, muito interessada em expandir os serviços',
    createdAt: '2025-04-20T14:30:00Z',
  },
  {
    id: '3',
    name: 'José Antonio Oliveira',
    cpf: '456.789.123-03',
    email: 'jose.oliveira@email.com',
    phone: '(31) 97777-9012',
    status: 'vip',
    contractsCount: 5,
    totalValue: 32000.00,
    lastActivity: '2025-05-08T11:20:00Z',
    notes: 'Cliente há mais de 2 anos, sempre pontual nos pagamentos',
    createdAt: '2025-02-10T09:15:00Z',
  },
  {
    id: '4',
    name: 'Ana Paula Costa',
    cpf: '789.123.456-04',
    email: 'ana.costa@email.com',
    phone: '(11) 96666-3456',
    status: 'inativo',
    contractsCount: 0,
    totalValue: 0.00,
    lastActivity: '2025-03-15T09:30:00Z',
    notes: 'Pausou os serviços temporariamente por questões financeiras',
    createdAt: '2025-03-01T11:45:00Z',
  },
  {
    id: '5',
    name: 'Carlos Eduardo Lima',
    cpf: '321.654.987-05',
    email: 'carlos.lima@email.com',
    phone: '(85) 95555-7890',
    status: 'ativo',
    contractsCount: 2,
    totalValue: 8900.00,
    lastActivity: '2025-05-07T15:20:00Z',
    notes: 'Cliente da região nordeste, boa carteira de indicações',
    createdAt: '2025-03-20T13:00:00Z',
  },
  {
    id: '6',
    name: 'Luciana Pereira Dias',
    cpf: '654.321.098-06',
    email: 'luciana.dias@email.com',
    phone: '(41) 94444-2345',
    status: 'potencial',
    contractsCount: 0,
    totalValue: 0.00,
    lastActivity: '2025-05-06T10:15:00Z',
    notes: 'Lead qualificado, em negociação para primeiro contrato',
    createdAt: '2025-05-01T16:30:00Z',
  },
  {
    id: '7',
    name: 'Pedro Henrique Alves',
    cpf: '098.765.432-07',
    email: 'pedro.alves@email.com',
    phone: '(62) 93333-6789',
    status: 'vip',
    contractsCount: 4,
    totalValue: 28500.00,
    lastActivity: '2025-05-10T12:45:00Z',
    notes: 'Empresário do agronegócio, sempre renova contratos',
    createdAt: '2025-01-30T08:20:00Z',
  },
  {
    id: '8',
    name: 'Fernanda Rocha Melo',
    cpf: '543.210.987-08',
    email: 'fernanda.melo@email.com',
    phone: '(47) 92222-4567',
    status: 'ativo',
    contractsCount: 1,
    totalValue: 4200.00,
    lastActivity: '2025-05-05T14:10:00Z',
    notes: 'Proprietária de franquia, interesse em planos corporativos',
    createdAt: '2025-04-10T10:50:00Z',
  },
];

// Dashboard summary data
export const dashboardSummary = {
  totalUsers: 15,
  activeUsers: 12,
  totalLeads: 45,
  newLeadsToday: 3,
  totalContracts: 28,
  activeContracts: 22,
  totalRevenue: 52480.60,
  pendingCommissions: 6840.00,
  revenueByMonth: [
    { month: 'Jan', revenue: 2300 },
    { month: 'Fev', revenue: 2800 },
    { month: 'Mar', revenue: 3200 },
    { month: 'Abr', revenue: 4100 },
    { month: 'Mai', revenue: 4500 },
    { month: 'Jun', revenue: 4800 },
    { month: 'Jul', revenue: 5200 },
    { month: 'Ago', revenue: 5500 },
    { month: 'Set', revenue: 5800 },
    { month: 'Out', revenue: 6200 },
    { month: 'Nov', revenue: 6500 },
    { month: 'Dez', revenue: 7000 },
  ],
  leadsBySource: [
    { source: 'Website', count: 20 },
    { source: 'Facebook', count: 12 },
    { source: 'Google', count: 15 },
    { source: 'Referral', count: 8 },
    { source: 'Other', count: 5 },
  ],
  contractsByPlan: [
    { plan: 'Básico', count: 12 },
    { plan: 'Profissional', count: 10 },
    { plan: 'Empresarial', count: 6 },
  ],
};