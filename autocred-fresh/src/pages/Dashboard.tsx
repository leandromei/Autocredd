import React from 'react';
import { LayoutDashboard, TrendingUp, Users, FileText, DollarSign } from 'lucide-react';

export default function Dashboard() {
  const stats = [
    { name: 'Total de Leads', value: '1,234', icon: FileText, change: '+12%', changeType: 'increase' },
    { name: 'Clientes Ativos', value: '567', icon: Users, change: '+8%', changeType: 'increase' },
    { name: 'Vendas do Mês', value: 'R$ 89,430', icon: DollarSign, change: '+15%', changeType: 'increase' },
    { name: 'Taxa de Conversão', value: '3.24%', icon: TrendingUp, change: '+2.1%', changeType: 'increase' },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
            <LayoutDashboard className="w-8 h-8 text-blue-600" />
            Dashboard
          </h1>
          <p className="text-gray-600 mt-2">Visão geral do seu sistema AutoCred</p>
        </div>
        <div className="text-sm text-gray-500">
          Última atualização: {new Date().toLocaleString()}
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <div key={stat.name} className="bg-white rounded-lg shadow-sm border p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">{stat.name}</p>
                  <p className="text-3xl font-bold text-gray-900 mt-2">{stat.value}</p>
                </div>
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                  <Icon className="w-6 h-6 text-blue-600" />
                </div>
              </div>
              <div className="mt-4 flex items-center">
                <span className="text-sm font-medium text-green-600">{stat.change}</span>
                <span className="text-sm text-gray-500 ml-2">vs mês anterior</span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Recent Activity */}
      <div className="bg-white rounded-lg shadow-sm border">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">Atividade Recente</h2>
        </div>
        <div className="p-6">
          <div className="space-y-4">
            <div className="flex items-center space-x-4">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-900">Novo lead cadastrado</p>
                <p className="text-sm text-gray-500">João Silva - há 5 minutos</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-900">Cliente convertido</p>
                <p className="text-sm text-gray-500">Maria Santos - há 15 minutos</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-900">Contrato assinado</p>
                <p className="text-sm text-gray-500">Pedro Oliveira - há 1 hora</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 