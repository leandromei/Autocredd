import { PageHeader } from '@/components/common/PageHeader';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Cog, Send, MessageCircle } from 'lucide-react';
import { useState, useRef, useEffect } from 'react';

export default function Elias() {
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([
    {
      id: 1,
      type: 'assistant',
      content: 'Olá! Eu sou o Elias, seu assistente especializado em operações e gestão. Estou aqui para ajudá-lo com processos, organização e otimização do seu negócio.',
      timestamp: new Date()
    }
  ]);
  const chatCardRef = useRef<HTMLDivElement>(null);

  // Sistema de contexto infinito para o Elias (sem expiração)
  const getSessionId = () => {
    const sessionData = localStorage.getItem('elias_session');
    
    if (sessionData) {
      const { sessionId } = JSON.parse(sessionData);
      return sessionId;
    }
    
    // Criar nova sessão apenas se não existe
    const newSessionId = `elias_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    localStorage.setItem('elias_session', JSON.stringify({
      sessionId: newSessionId,
      timestamp: new Date().getTime()
    }));
    
    return newSessionId;
  };

  // Scroll para o chat ao carregar a página
  useEffect(() => {
    const timer = setTimeout(() => {
      if (chatCardRef.current) {
        chatCardRef.current.scrollIntoView({ 
          behavior: 'smooth', 
          block: 'center',
          inline: 'nearest'
        });
      }
    }, 100); // Aguarda 100ms para garantir que está renderizado

    return () => clearTimeout(timer);
  }, []);

  const handleSendMessage = () => {
    if (!message.trim()) return;

    const newMessage = {
      id: messages.length + 1,
      type: 'user',
      content: message,
      timestamp: new Date()
    };

    setMessages([...messages, newMessage]);
    setMessage('');

    // Simular resposta da IA
    setTimeout(() => {
      const aiResponse = {
        id: messages.length + 2,
        type: 'assistant',
        content: 'Recebi sua mensagem! Esta é uma funcionalidade em desenvolvimento. Em breve poderei ajudá-lo com questões operacionais e de gestão.',
        timestamp: new Date()
      };
      setMessages(prev => [...prev, aiResponse]);
    }, 1000);
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <PageHeader
        title="Elias - Operacional e Gestão"
        description="Assistente IA especializado em operações e gestão empresarial"
      >
        <div className="flex items-center gap-2 text-blue-600">
          <Cog className="h-5 w-5" />
          <span className="text-sm font-medium">IA Especializada</span>
        </div>
      </PageHeader>

      <div className="grid gap-6">
        <Card className="border-blue-200 dark:border-blue-800" ref={chatCardRef}>
          <CardHeader className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-950 dark:to-indigo-950">
            <CardTitle className="flex items-center gap-2 text-blue-700 dark:text-blue-300">
              <MessageCircle className="h-5 w-5" />
              Chat com Elias
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <ScrollArea className="h-96 p-4">
              <div className="space-y-4">
                {messages.map((msg) => (
                  <div
                    key={msg.id}
                    className={`flex ${msg.type === 'user' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div
                      className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                        msg.type === 'user'
                          ? 'bg-blue-600 text-white ml-auto'
                          : 'bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-gray-100'
                      }`}
                    >
                      <p className="text-sm">{msg.content}</p>
                      <span className="text-xs opacity-70 mt-1 block">
                        {msg.timestamp.toLocaleTimeString()}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </ScrollArea>
            <div className="border-t p-4">
              <div className="flex gap-2">
                <Input
                  placeholder="Digite sua pergunta sobre operações ou gestão..."
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                  className="flex-1"
                />
                <Button 
                  onClick={handleSendMessage}
                  className="bg-blue-600 hover:bg-blue-700"
                >
                  <Send className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="grid md:grid-cols-2 gap-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-sm">Especialidades do Elias</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="text-sm space-y-2 text-muted-foreground">
                <li>• Otimização de processos operacionais</li>
                <li>• Gestão de equipes e recursos</li>
                <li>• Análise de produtividade</li>
                <li>• Fluxos de trabalho e automação</li>
                <li>• Planejamento estratégico</li>
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-sm">Comandos Úteis</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="text-sm space-y-2 text-muted-foreground">
                <li>• "Otimizar processo de trabalho"</li>
                <li>• "Analisar produtividade da equipe"</li>
                <li>• "Sugerir melhorias operacionais"</li>
                <li>• "Planejar estratégia de crescimento"</li>
                <li>• "Automatizar tarefas repetitivas"</li>
              </ul>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
} 