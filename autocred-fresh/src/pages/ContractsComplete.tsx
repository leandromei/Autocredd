import React, { useState, useEffect } from 'react';
import { FileSignature, Plus, Eye, Edit, Trash2, MoreHorizontal, RefreshCw } from 'lucide-react';
import { Button } from '../components/ui/button';

interface Contract {
  id: string;
  clientName: string;
  clientCPF: string;
  clientPhone: string;
  value: number;
  modality: string;
  status: 'active' | 'pending' | 'expired' | 'cancelled';
  startDate: string;
  endDate: string;
  installments: number;
  notes?: string;
}

const mockContracts: Contract[] = [
  {
    id: '1',
    clientName: 'João Silva',
    clientCPF: '123.456.789-00',
    clientPhone: '(11) 99999-9999',
    value: 50000,
    modality: 'Portabilidade',
    status: 'active',
    startDate: '2024-01-15',
    endDate: '2026-01-15',
    installments: 24,
    notes: 'Cliente preferencial'
  },
  {
    id: '2',
    clientName: 'Maria Santos',
    clientCPF: '987.654.321-00',
    clientPhone: '(11) 88888-8888',
    value: 75000,
    modality: 'Port + Refin',
    status: 'pending',
    startDate: '2024-02-01',
    endDate: '2027-02-01',
    installments: 36,
    notes: 'Aguardando documentação'
  },
  {
    id: '3',
    clientName: 'Pedro Oliveira',
    clientCPF: '456.789.123-00',
    clientPhone: '(11) 77777-7777',
    value: 25000,
    modality: 'Contrato Novo',
    status: 'expired',
    startDate: '2023-06-01',
    endDate: '2024-06-01',
    installments: 12,
    notes: 'Contrato vencido'
  }
];

const statusColors = {
  active: 'bg-green-100 text-green-700 border-green-200',
  pending: 'bg-yellow-100 text-yellow-700 border-yellow-200',
  expired: 'bg-red-100 text-red-700 border-red-200',
  cancelled: 'bg-gray-100 text-gray-700 border-gray-200'
};

const statusLabels = {
  active: 'Ativo',
  pending: 'Pendente',
  expired: 'Vencido',
  cancelled: 'Cancelado'
};

const modalityOptions = ['Portabilidade', 'Port + Refin', 'Contrato Novo'];

export default function ContractsComplete() {
  const [contracts, setContracts] = useState<Contract[]>(mockContracts);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedContract, setSelectedContract] = useState<Contract | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [newContract, setNewContract] = useState<Partial<Contract>>({
    clientName: '',
    clientCPF: '',
    clientPhone: '',
    value: 0,
    modality: 'Portabilidade',
    status: 'pending',
    installments: 12,
    notes: ''
  });

  const filteredContracts = contracts.filter(contract =>
    contract.clientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    contract.clientCPF.includes(searchTerm) ||
    contract.modality.toLowerCase().includes(searchTerm.toLowerCase()) ||
    statusLabels[contract.status].toLowerCase().includes(searchTerm.toLowerCase())
  );

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-BR');
  };

  const handleCreateContract = () => {
    const contract: Contract = {
      id: Date.now().toString(),
      clientName: newContract.clientName || '',
      clientCPF: newContract.clientCPF || '',
      clientPhone: newContract.clientPhone || '',
      value: newContract.value || 0,
      modality: newContract.modality || 'Portabilidade',
      status: newContract.status || 'pending',
      startDate: new Date().toISOString().split('T')[0],
      endDate: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000 * 2).toISOString().split('T')[0],
      installments: newContract.installments || 12,
      notes: newContract.notes || ''
    };

    setContracts(prev => [contract, ...prev]);
    setIsCreateModalOpen(false);
    setNewContract({
      clientName: '',
      clientCPF: '',
      clientPhone: '',
      value: 0,
      modality: 'Portabilidade',
      status: 'pending',
      installments: 12,
      notes: ''
    });
  };

  const handleEditContract = (contract: Contract) => {
    setSelectedContract(contract);
    setIsEditModalOpen(true);
  };

  const handleUpdateContract = () => {
    if (selectedContract) {
      setContracts(prev => prev.map(contract => 
        contract.id === selectedContract.id ? selectedContract : contract
      ));
      setIsEditModalOpen(false);
      setSelectedContract(null);
    }
  };

  const handleDeleteContract = (contractId: string) => {
    if (window.confirm('Tem certeza que deseja excluir este contrato?')) {
      setContracts(prev => prev.filter(contract => contract.id !== contractId));
    }
  };

  const handleStatusChange = (contractId: string, newStatus: Contract['status']) => {
    setContracts(prev => prev.map(contract => 
      contract.id === contractId ? { ...contract, status: newStatus } : contract
    ));
  };

  const getContractStats = () => {
    return {
      total: contracts.length,
      active: contracts.filter(c => c.status === 'active').length,
      pending: contracts.filter(c => c.status === 'pending').length,
      expired: contracts.filter(c => c.status === 'expired').length,
      totalValue: contracts.reduce((sum, c) => sum + c.value, 0)
    };
  };

  const stats = getContractStats();

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
            <FileSignature className="w-8 h-8 text-blue-600" />
            Contratos Completo
          </h1>
          <p className="text-gray-600 mt-2">Sistema completo de gestão de contratos</p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" onClick={() => setContracts([...mockContracts])}>
            <RefreshCw className="w-4 h-4 mr-2" />
            Atualizar
          </Button>
          <Button onClick={() => setIsCreateModalOpen(true)}>
            <Plus className="w-4 h-4 mr-2" />
            Novo Contrato
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        <div className="bg-white rounded-lg shadow-sm border p-4">
          <div className="text-sm font-medium text-gray-600">Total</div>
          <div className="text-2xl font-bold text-gray-900">{stats.total}</div>
        </div>
        <div className="bg-white rounded-lg shadow-sm border p-4">
          <div className="text-sm font-medium text-gray-600">Ativos</div>
          <div className="text-2xl font-bold text-green-600">{stats.active}</div>
        </div>
        <div className="bg-white rounded-lg shadow-sm border p-4">
          <div className="text-sm font-medium text-gray-600">Pendentes</div>
          <div className="text-2xl font-bold text-yellow-600">{stats.pending}</div>
        </div>
        <div className="bg-white rounded-lg shadow-sm border p-4">
          <div className="text-sm font-medium text-gray-600">Vencidos</div>
          <div className="text-2xl font-bold text-red-600">{stats.expired}</div>
        </div>
        <div className="bg-white rounded-lg shadow-sm border p-4">
          <div className="text-sm font-medium text-gray-600">Valor Total</div>
          <div className="text-2xl font-bold text-blue-600">{formatCurrency(stats.totalValue)}</div>
        </div>
      </div>

      {/* Search */}
      <div className="bg-white rounded-lg shadow-sm border p-4">
        <input
          type="text"
          placeholder="Buscar contratos por nome, CPF, modalidade ou status..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      {/* Contracts Table */}
      <div className="bg-white rounded-lg shadow-sm border overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="text-left py-3 px-4 font-medium text-gray-900">Cliente</th>
                <th className="text-left py-3 px-4 font-medium text-gray-900">CPF</th>
                <th className="text-left py-3 px-4 font-medium text-gray-900">Telefone</th>
                <th className="text-left py-3 px-4 font-medium text-gray-900">Valor</th>
                <th className="text-left py-3 px-4 font-medium text-gray-900">Modalidade</th>
                <th className="text-left py-3 px-4 font-medium text-gray-900">Status</th>
                <th className="text-left py-3 px-4 font-medium text-gray-900">Data Início</th>
                <th className="text-left py-3 px-4 font-medium text-gray-900">Parcelas</th>
                <th className="text-left py-3 px-4 font-medium text-gray-900">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredContracts.map((contract) => (
                <tr key={contract.id} className="hover:bg-gray-50">
                  <td className="py-3 px-4 font-medium">{contract.clientName}</td>
                  <td className="py-3 px-4 text-gray-600">{contract.clientCPF}</td>
                  <td className="py-3 px-4 text-gray-600">{contract.clientPhone}</td>
                  <td className="py-3 px-4 text-gray-900 font-medium">{formatCurrency(contract.value)}</td>
                  <td className="py-3 px-4">{contract.modality}</td>
                  <td className="py-3 px-4">
                    <select
                      value={contract.status}
                      onChange={(e) => handleStatusChange(contract.id, e.target.value as Contract['status'])}
                      className={`px-3 py-1 rounded-full text-xs font-medium border ${statusColors[contract.status]}`}
                    >
                      <option value="active">Ativo</option>
                      <option value="pending">Pendente</option>
                      <option value="expired">Vencido</option>
                      <option value="cancelled">Cancelado</option>
                    </select>
                  </td>
                  <td className="py-3 px-4 text-gray-600">{formatDate(contract.startDate)}</td>
                  <td className="py-3 px-4 text-gray-600">{contract.installments}x</td>
                  <td className="py-3 px-4">
                    <div className="flex space-x-2">
                      <button
                        onClick={() => {
                          setSelectedContract(contract);
                          setIsViewModalOpen(true);
                        }}
                        className="p-1 text-blue-600 hover:bg-blue-100 rounded"
                        title="Visualizar"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleEditContract(contract)}
                        className="p-1 text-yellow-600 hover:bg-yellow-100 rounded"
                        title="Editar"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDeleteContract(contract.id)}
                        className="p-1 text-red-600 hover:bg-red-100 rounded"
                        title="Excluir"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Create Contract Modal */}
      {isCreateModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <h2 className="text-xl font-bold mb-4">Novo Contrato</h2>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">Nome do Cliente</label>
                <input
                  type="text"
                  value={newContract.clientName}
                  onChange={(e) => setNewContract({...newContract, clientName: e.target.value})}
                  className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">CPF</label>
                <input
                  type="text"
                  value={newContract.clientCPF}
                  onChange={(e) => setNewContract({...newContract, clientCPF: e.target.value})}
                  className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Telefone</label>
                <input
                  type="text"
                  value={newContract.clientPhone}
                  onChange={(e) => setNewContract({...newContract, clientPhone: e.target.value})}
                  className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Valor</label>
                <input
                  type="number"
                  value={newContract.value}
                  onChange={(e) => setNewContract({...newContract, value: Number(e.target.value)})}
                  className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Modalidade</label>
                <select
                  value={newContract.modality}
                  onChange={(e) => setNewContract({...newContract, modality: e.target.value})}
                  className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  {modalityOptions.map(option => (
                    <option key={option} value={option}>{option}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Parcelas</label>
                <input
                  type="number"
                  value={newContract.installments}
                  onChange={(e) => setNewContract({...newContract, installments: Number(e.target.value)})}
                  className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div className="col-span-2">
                <label className="block text-sm font-medium mb-1">Observações</label>
                <textarea
                  value={newContract.notes}
                  onChange={(e) => setNewContract({...newContract, notes: e.target.value})}
                  className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  rows={3}
                />
              </div>
            </div>
            <div className="flex justify-end space-x-3 mt-6">
              <Button variant="outline" onClick={() => setIsCreateModalOpen(false)}>
                Cancelar
              </Button>
              <Button onClick={handleCreateContract}>
                Criar Contrato
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* View Contract Modal */}
      {isViewModalOpen && selectedContract && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-2xl">
            <h2 className="text-xl font-bold mb-4">Detalhes do Contrato</h2>
            <div className="grid grid-cols-2 gap-4">
              <div><strong>Cliente:</strong> {selectedContract.clientName}</div>
              <div><strong>CPF:</strong> {selectedContract.clientCPF}</div>
              <div><strong>Telefone:</strong> {selectedContract.clientPhone}</div>
              <div><strong>Valor:</strong> {formatCurrency(selectedContract.value)}</div>
              <div><strong>Modalidade:</strong> {selectedContract.modality}</div>
              <div><strong>Status:</strong> {statusLabels[selectedContract.status]}</div>
              <div><strong>Data Início:</strong> {formatDate(selectedContract.startDate)}</div>
              <div><strong>Data Fim:</strong> {formatDate(selectedContract.endDate)}</div>
              <div><strong>Parcelas:</strong> {selectedContract.installments}x</div>
              {selectedContract.notes && (
                <div className="col-span-2"><strong>Observações:</strong> {selectedContract.notes}</div>
              )}
            </div>
            <div className="flex justify-end mt-6">
              <Button onClick={() => setIsViewModalOpen(false)}>
                Fechar
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Contract Modal */}
      {isEditModalOpen && selectedContract && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <h2 className="text-xl font-bold mb-4">Editar Contrato</h2>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">Nome do Cliente</label>
                <input
                  type="text"
                  value={selectedContract.clientName}
                  onChange={(e) => setSelectedContract({...selectedContract, clientName: e.target.value})}
                  className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">CPF</label>
                <input
                  type="text"
                  value={selectedContract.clientCPF}
                  onChange={(e) => setSelectedContract({...selectedContract, clientCPF: e.target.value})}
                  className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Telefone</label>
                <input
                  type="text"
                  value={selectedContract.clientPhone}
                  onChange={(e) => setSelectedContract({...selectedContract, clientPhone: e.target.value})}
                  className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Valor</label>
                <input
                  type="number"
                  value={selectedContract.value}
                  onChange={(e) => setSelectedContract({...selectedContract, value: Number(e.target.value)})}
                  className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Modalidade</label>
                <select
                  value={selectedContract.modality}
                  onChange={(e) => setSelectedContract({...selectedContract, modality: e.target.value})}
                  className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  {modalityOptions.map(option => (
                    <option key={option} value={option}>{option}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Parcelas</label>
                <input
                  type="number"
                  value={selectedContract.installments}
                  onChange={(e) => setSelectedContract({...selectedContract, installments: Number(e.target.value)})}
                  className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div className="col-span-2">
                <label className="block text-sm font-medium mb-1">Observações</label>
                <textarea
                  value={selectedContract.notes || ''}
                  onChange={(e) => setSelectedContract({...selectedContract, notes: e.target.value})}
                  className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  rows={3}
                />
              </div>
            </div>
            <div className="flex justify-end space-x-3 mt-6">
              <Button variant="outline" onClick={() => setIsEditModalOpen(false)}>
                Cancelar
              </Button>
              <Button onClick={handleUpdateContract}>
                Salvar Alterações
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
} 