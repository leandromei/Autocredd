import React from 'react';
import { WhatsAppQRCode } from '../components/WhatsAppQRCode';

export default function WhatsAppConnection() {
  const handleConnected = () => {
    console.log('WhatsApp conectado com sucesso!');
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-md mx-auto">
        <h1 className="text-2xl font-bold text-center mb-8">Conexão WhatsApp</h1>
        <WhatsAppQRCode 
          instanceName="autocredwhatsapp"
          onConnected={handleConnected}
        />
      </div>
    </div>
  );
} 