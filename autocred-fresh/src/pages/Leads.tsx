import React from 'react';
import { FileText } from 'lucide-react';

export default function Leads() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
            <FileText className="w-8 h-8 text-blue-600" />
            Leads
          </h1>
          <p className="text-gray-600 mt-2">Gestão completa de leads (versão simplificada)</p>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-sm border p-8 text-center">
        <FileText className="w-16 h-16 text-gray-400 mx-auto mb-4" />
        <h3 className="text-xl font-semibold text-gray-900 mb-2">Leads - Versão Simplificada</h3>
        <p className="text-gray-600 mb-4">Use a versão completa em "Leads Completo" no menu</p>
        <a href="/leads-complete" className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
          Ir para Leads Completo
        </a>
      </div>
    </div>
  );
} 