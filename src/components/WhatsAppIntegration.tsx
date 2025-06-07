import React, { useState } from 'react';
import { MessageCircle, Send, Check, X, Phone } from 'lucide-react';

interface Lead {
  id: string;
  name: string;
  phone: string;
  email: string;
  status: string;
}

interface Contact {
  id: string;
  name: string;
  phone: string;
  whatsapp_active?: boolean;
}

interface WhatsAppIntegrationProps {
  lead?: Lead;
  contact?: Contact;
  onClose?: () => void;
}

const WhatsAppIntegration: React.FC<WhatsAppIntegrationProps> = ({ 
  lead, 
  contact, 
  onClose 
}) => {
  const [message, setMessage] = useState('');
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);
  
  const person = lead || contact;
  const phone = person?.phone || '';
  const name = person?.name || '';

  // Templates de mensagem
  const messageTemplates = [
    {
      title: '🎯 Apresentação AutoCred',
      content: `Olá ${name}! 👋\n\nSou da AutoCred e tenho uma oportunidade incrível para você!\n\n✅ Crédito rápido e fácil\n✅ Juros competitivos\n✅ Aprovação em minutos\n\nGostaria de saber mais detalhes?`
    },
    {
      title: '💰 Oferta de Crédito',
      content: `Oi ${name}! 😊\n\nTenho uma proposta de crédito especial para você:\n\n🔹 Até R$ 50.000\n🔹 Parcelas que cabem no seu bolso\n🔹 Taxa diferenciada\n\nQuer simular sem compromisso?`
    },
    {
      title: '📞 Follow-up Proposta',
      content: `${name}, como está? 😊\n\nVi que você demonstrou interesse na nossa proposta de crédito.\n\nTem alguma dúvida que posso esclarecer?\n\nEstou aqui para ajudar! 🤝`
    },
    {
      title: '🆘 Suporte Técnico',
      content: `Oi ${name}! 👋\n\nNotei que você pode estar com dificuldades em nosso sistema.\n\nPosso te ajudar com:\n• Login na plataforma\n• Documentação\n• Simulação de crédito\n\nComo posso te auxiliar?`
    }
  ];

  const sendWhatsAppMessage = async () => {
    if (!message.trim() || !phone) return;
    
    setSending(true);
    
    try {
      const response = await fetch('/api/whatsapp/send', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          phone: phone.replace(/\D/g, ''), // Remove caracteres não numéricos
          message: message,
          instance: 'autocred-main'
        })
      });
      
      const result = await response.json();
      
      if (result.success) {
        setSent(true);
        
        // Se for um lead, marcar como contatado
        if (lead) {
          await fetch(`/api/leads/${lead.id}`, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              status: 'Contatado via WhatsApp',
              last_contact: new Date().toISOString(),
              whatsapp_contact: true
            })
          });
        }
        
        // Se for contato, marcar WhatsApp como ativo
        if (contact) {
          await fetch(`/api/contacts/${contact.id}`, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              whatsapp_active: true,
              last_whatsapp_contact: new Date().toISOString()
            })
          });
        }
        
        setTimeout(() => {
          onClose?.();
        }, 2000);
      } else {
        throw new Error(result.error || 'Erro desconhecido');
      }
    } catch (error) {
      console.error('Erro ao enviar mensagem:', error);
      alert('Erro ao enviar mensagem WhatsApp');
    } finally {
      setSending(false);
    }
  };

  const useTemplate = (template: string) => {
    setMessage(template);
  };

  const formatPhone = (phone: string) => {
    const cleaned = phone.replace(/\D/g, '');
    if (cleaned.length === 11) {
      return `(${cleaned.substr(0, 2)}) ${cleaned.substr(2, 5)}-${cleaned.substr(7)}`;
    }
    return phone;
  };

  if (sent) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
          <div className="text-center">
            <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-green-100 mb-4">
              <Check className="h-6 w-6 text-green-600" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              Mensagem Enviada!
            </h3>
            <p className="text-sm text-gray-600">
              WhatsApp enviado para {name} com sucesso!
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-green-100 rounded-full">
              <MessageCircle className="h-6 w-6 text-green-600" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-gray-900">
                Enviar WhatsApp
              </h2>
              <p className="text-sm text-gray-600">
                Para: {name}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full"
          >
            <X className="h-5 w-5 text-gray-500" />
          </button>
        </div>

        <div className="p-6">
          {/* Info do Contato */}
          <div className="bg-gray-50 rounded-lg p-4 mb-6">
            <div className="flex items-center space-x-4">
              <div className="p-3 bg-blue-100 rounded-full">
                <Phone className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <h3 className="font-medium text-gray-900">{name}</h3>
                <p className="text-sm text-gray-600">{formatPhone(phone)}</p>
                {lead && (
                  <span className="inline-block px-2 py-1 text-xs bg-blue-100 text-blue-800 rounded-full mt-1">
                    Lead
                  </span>
                )}
                {contact && (
                  <span className="inline-block px-2 py-1 text-xs bg-green-100 text-green-800 rounded-full mt-1">
                    Contato
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Templates de Mensagem */}
          <div className="mb-6">
            <h4 className="text-sm font-medium text-gray-700 mb-3">
              📝 Templates Rápidos
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {messageTemplates.map((template, index) => (
                <button
                  key={index}
                  onClick={() => useTemplate(template.content)}
                  className="text-left p-3 border border-gray-200 rounded-lg hover:border-blue-300 hover:bg-blue-50 transition-colors"
                >
                  <div className="font-medium text-sm text-gray-900 mb-1">
                    {template.title}
                  </div>
                  <div className="text-xs text-gray-600 line-clamp-2">
                    {template.content.substring(0, 80)}...
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Área de Mensagem */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              💬 Mensagem
            </label>
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder={`Digite sua mensagem para ${name}...`}
              rows={6}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
            />
            <div className="flex justify-between items-center mt-2">
              <span className="text-xs text-gray-500">
                {message.length} caracteres
              </span>
              <span className="text-xs text-gray-500">
                WhatsApp permite até 4096 caracteres
              </span>
            </div>
          </div>

          {/* Botões de Ação */}
          <div className="flex space-x-3">
            <button
              onClick={onClose}
              className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
            >
              Cancelar
            </button>
            <button
              onClick={sendWhatsAppMessage}
              disabled={!message.trim() || sending}
              className="flex-1 flex items-center justify-center space-x-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {sending ? (
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
              ) : (
                <Send className="h-4 w-4" />
              )}
              <span>{sending ? 'Enviando...' : 'Enviar WhatsApp'}</span>
            </button>
          </div>

          {/* Dica */}
          <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
            <p className="text-xs text-yellow-800">
              💡 <strong>Dica:</strong> Mensagens personalizadas têm maior taxa de resposta. 
              Use o nome da pessoa e seja específico sobre sua proposta.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WhatsAppIntegration; 