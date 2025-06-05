import React from 'react';
import { Users } from 'lucide-react';

export default function Clients() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
            <Users className="w-8 h-8 text-blue-600" />
            Clientes
          </h1>
          <p className="text-gray-600 mt-2">Gestão de clientes (versão simplificada)</p>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-sm border p-8 text-center">
        <Users className="w-16 h-16 text-gray-400 mx-auto mb-4" />
        <h3 className="text-xl font-semibold text-gray-900 mb-2">Clientes - Versão Simplificada</h3>
        <p className="text-gray-600 mb-4">Use a versão completa em "Clientes Completo" no menu</p>
        <a href="/clients-complete" className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
          Ir para Clientes Completo
        </a>
      </div>
    </div>
  );
} 