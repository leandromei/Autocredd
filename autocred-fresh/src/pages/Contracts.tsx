import React from 'react';
import { FileSignature } from 'lucide-react';

export default function Contracts() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
            <FileSignature className="w-8 h-8 text-blue-600" />
            Contratos
          </h1>
          <p className="text-gray-600 mt-2">Gestão completa de contratos</p>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-sm border p-8 text-center">
        <FileSignature className="w-16 h-16 text-gray-400 mx-auto mb-4" />
        <h3 className="text-xl font-semibold text-gray-900 mb-2">Contratos</h3>
        <p className="text-gray-600 mb-4">Pronto para receber suas 1260 linhas de código!</p>
        <div className="text-sm text-gray-500">
          Aguardando migração do sistema original
        </div>
      </div>
    </div>
  );
} 