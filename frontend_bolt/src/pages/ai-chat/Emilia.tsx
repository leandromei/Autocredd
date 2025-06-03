import { PageHeader } from '@/components/common/PageHeader';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { TrendingUp, Send, MessageCircle, Bot, User, Loader2, Brain, Trash2 } from 'lucide-react';
import { useState, useRef, useEffect } from 'react';

interface Message {
  id: number;
  type: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  isLoading?: boolean;
  avatar?: string;
}

export default function Emilia() {
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 1,
      type: 'assistant',
      content: 'Olá! Sou Emilia, agente IA especializada em vendas e finanças. Posso auxiliar com estratégias comerciais, controle financeiro, gestão de receitas e otimização de processos de vendas. Como posso ajudá-lo hoje?',
      timestamp: new Date(),
      avatar: '👩‍💻'
    }
  ]);
  const [isLoading, setIsLoading] = useState(false);
  const [contextMessages, setContextMessages] = useState(0);
  const [isClearingContext, setIsClearingContext] = useState(false);
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const chatCardRef = useRef<HTMLDivElement>(null);

  // Sistema de contexto infinito para a Emilia (sem expiração)
  const getSessionId = () => {
    const sessionData = localStorage.getItem('emilia_session');
    
    if (sessionData) {
      const { sessionId } = JSON.parse(sessionData);
      return sessionId;
    }
    
    // Criar nova sessão apenas se não existe
    const newSessionId = `emilia_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    localStorage.setItem('emilia_session', JSON.stringify({
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

  // Auto-scroll para o final da conversa quando novas mensagens são adicionadas
  useEffect(() => {
    if (scrollAreaRef.current) {
      const scrollContainer = scrollAreaRef.current.querySelector('[data-radix-scroll-area-viewport]');
      if (scrollContainer) {
        const timer = setTimeout(() => {
          scrollContainer.scrollTop = scrollContainer.scrollHeight;
        }, 100);
        return () => clearTimeout(timer);
      }
    }
  }, [messages]);

  const sendMessageToAPI = async (userMessage: string): Promise<string> => {
    try {
      // Conectar com SuperAgentes via nosso backend proxy
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 30000); // 30 segundos timeout
      
      const sessionId = getSessionId();

      const response = await fetch('/api/superagentes/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify({
          message: userMessage,
          agent_id: 'cm7i53tib01gt7te1va2ex2l5',
          session_id: sessionId
        }),
        signal: controller.signal
      });

      clearTimeout(timeoutId);

      if (response.ok) {
        const data = await response.json();
        console.log('✅ Resposta recebida do SuperAgentes:', data);
        
        // Atualizar contador de mensagens no contexto
        if (data.context_messages !== undefined) {
          setContextMessages(data.context_messages);
        }
        
        if (data.success && data.response) {
          return data.response;
        } else {
          throw new Error('Resposta inválida do SuperAgentes');
        }
      } else {
        const errorText = await response.text();
        console.error('❌ Erro na API SuperAgentes:', response.status, errorText);
        throw new Error(`Erro ${response.status}: ${errorText}`);
      }
    } catch (error) {
      if (error instanceof Error && error.name === 'AbortError') {
        console.log('⏰ Timeout na comunicação com SuperAgentes');
        throw new Error('A Emilia está demorando para responder. Tente novamente.');
      } else {
        console.error('💥 Erro na comunicação com SuperAgentes:', error);
        throw new Error('Não foi possível conectar com a Emilia. Verifique sua conexão.');
      }
    }
  };

  const clearContext = async () => {
    if (isClearingContext) return;

    try {
      setIsClearingContext(true);
      const sessionId = getSessionId();

      const response = await fetch('/api/superagentes/clear-context', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify({
          session_id: sessionId
        })
      });

      if (response.ok) {
        const data = await response.json();
        console.log('✅ Contexto limpo com sucesso:', data);
        
        // Atualizar contador de mensagens no contexto
        setContextMessages(0);
        
        // Adicionar mensagem informativa
        const clearMessage: Message = {
          id: Date.now(),
          type: 'assistant',
          content: `Contexto da conversa foi limpo! Removidas ${data.messages_removed || 0} mensagens. Agora podemos começar uma nova conversa do zero.`,
          timestamp: new Date(),
          avatar: '🧹'
        };

        setMessages(prev => [...prev, clearMessage]);
      } else {
        throw new Error('Erro ao limpar contexto');
      }
    } catch (error) {
      console.error('Erro ao limpar contexto:', error);
      
      const errorMessage: Message = {
        id: Date.now(),
        type: 'assistant',
        content: 'Não foi possível limpar o contexto. Tente novamente.',
        timestamp: new Date(),
        avatar: '⚠️'
      };

      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsClearingContext(false);
    }
  };

  const handleSendMessage = async () => {
    if (!message.trim() || isLoading) return;

    const userMessage = message.trim();
    setMessage('');
    
    // Adicionar mensagem do usuário
    const newUserMessage: Message = {
      id: Date.now(),
      type: 'user',
      content: userMessage,
      timestamp: new Date(),
      avatar: '👤'
    };

    setMessages(prev => [...prev, newUserMessage]);
    setIsLoading(true);

    try {
      // Buscar resposta da Emilia (SuperAgentes)
      const response = await sendMessageToAPI(userMessage);
      
      const aiMessage: Message = {
        id: Date.now() + 1,
        type: 'assistant',
        content: response,
        timestamp: new Date(),
        avatar: '🤖'
      };

      setMessages(prev => [...prev, aiMessage]);
    } catch (error) {
      console.error('Erro ao enviar mensagem:', error);
      
      const errorMessage: Message = {
        id: Date.now() + 1,
        type: 'assistant',
        content: error instanceof Error ? error.message : 'Ocorreu um erro inesperado. Tente novamente.',
        timestamp: new Date(),
        avatar: '⚠️'
      };

      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <PageHeader
        title="Emilia - Agente IA Vendas & Finanças"
        description="Assistente especializada em estratégias comerciais e soluções financeiras"
      >
        <div className="flex items-center gap-2 text-green-600">
          <Brain className="h-5 w-5" />
          <span className="text-sm font-medium">IA Especializada</span>
        </div>
      </PageHeader>

      <div className="grid gap-6">
        <Card className="border-purple-200 dark:border-purple-800 shadow-lg" ref={chatCardRef}>
          <CardHeader className="bg-gradient-to-r from-slate-50 via-purple-50 to-indigo-50 dark:from-slate-900 dark:via-purple-950 dark:to-indigo-950 border-b border-gray-200 dark:border-gray-700">
            <CardTitle className="flex items-center justify-between text-slate-800 dark:text-slate-200">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-purple-500 to-indigo-600 flex items-center justify-center shadow-sm">
                  <MessageCircle className="h-4 w-4 text-white" />
                </div>
                <div>
                  <h3 className="font-semibold text-lg">Agente IA Vendas & Finanças</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400 font-normal">
                    Emilia - Especialista Comercial e Financeira
                    {contextMessages > 0 && (
                      <span className="ml-2 text-xs bg-purple-100 dark:bg-purple-900 text-purple-700 dark:text-purple-300 px-2 py-1 rounded-full">
                        {contextMessages} mensagem{contextMessages > 1 ? 's' : ''} no contexto
                      </span>
                    )}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                {contextMessages > 0 && (
                  <Button
                    onClick={clearContext}
                    disabled={isClearingContext}
                    variant="ghost"
                    size="sm"
                    className="h-8 px-3 text-xs text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800 transition-all duration-200 rounded-full border border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600"
                  >
                    {isClearingContext ? (
                      <Loader2 className="h-3 w-3 animate-spin mr-1" />
                    ) : (
                      <Trash2 className="h-3 w-3 mr-1" />
                    )}
                    Limpar Contexto
                  </Button>
                )}
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                  <span className="text-xs font-medium text-green-700 dark:text-green-400 bg-green-50 dark:bg-green-900/30 px-3 py-1 rounded-full border border-green-200 dark:border-green-700">
                    Disponível
                  </span>
                </div>
              </div>
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <ScrollArea className="h-[500px] p-4" ref={scrollAreaRef}>
              <div className="space-y-4">
                {messages.map((msg) => (
                  <div
                    key={msg.id}
                    className={`flex gap-3 ${msg.type === 'user' ? 'justify-end' : 'justify-start'}`}
                  >
                    {msg.type === 'assistant' && (
                      <div className="flex-shrink-0">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-slate-100 to-slate-200 dark:from-slate-700 dark:to-slate-800 flex items-center justify-center border-2 border-purple-200 dark:border-purple-600 shadow-sm">
                          <span className="text-2xl">👩‍💻</span>
                        </div>
                      </div>
                    )}
                    
                    <div
                      className={`max-w-lg lg:max-w-xl px-5 py-4 rounded-2xl shadow-sm ${
                        msg.type === 'user'
                          ? 'bg-gradient-to-br from-purple-600 to-purple-700 text-white ml-auto'
                          : 'bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-900 text-gray-900 dark:text-gray-100 border border-gray-200 dark:border-gray-700'
                      }`}
                    >
                      {msg.isLoading ? (
                        <div className="flex items-center gap-3">
                          <div className="flex space-x-1">
                            <div className="w-2 h-2 bg-purple-500 rounded-full animate-bounce"></div>
                            <div className="w-2 h-2 bg-purple-500 rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
                            <div className="w-2 h-2 bg-purple-500 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
                          </div>
                          <span className="text-sm font-medium text-gray-600 dark:text-gray-400">Consultando especialista...</span>
                        </div>
                      ) : (
                        <>
                          <div className="text-sm leading-relaxed whitespace-pre-line font-medium">{msg.content}</div>
                          <div className="text-xs opacity-60 mt-3 font-medium">
                            {msg.timestamp.toLocaleTimeString('pt-BR', { 
                              hour: '2-digit', 
                              minute: '2-digit' 
                            })}
                          </div>
                        </>
                      )}
                    </div>

                    {msg.type === 'user' && (
                      <div className="flex-shrink-0">
                        <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center border-2 border-blue-200 dark:border-blue-400 shadow-sm">
                          <User className="h-5 w-5 text-white" />
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </ScrollArea>
            
            <div className="border-t border-gray-200 dark:border-gray-700 p-6 bg-gradient-to-r from-gray-50 to-slate-50 dark:from-gray-900 dark:to-slate-900">
              <div className="flex gap-3">
                <Input
                  placeholder="Descreva sua necessidade comercial ou financeira..."
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  onKeyPress={handleKeyPress}
                  className="flex-1 h-12 px-4 bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600 rounded-xl focus:border-purple-500 focus:ring-purple-500 text-sm font-medium shadow-sm"
                  disabled={isLoading}
                />
                <Button 
                  onClick={handleSendMessage}
                  disabled={isLoading || !message.trim()}
                  className="h-12 px-6 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 disabled:opacity-50 rounded-xl font-medium shadow-sm transition-all duration-200 hover:shadow-md"
                >
                  {isLoading ? (
                    <Loader2 className="h-5 w-5 animate-spin" />
                  ) : (
                    <Send className="h-5 w-5" />
                  )}
                </Button>
              </div>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-3 text-center">
                💼 Especialista em vendas & finanças • 🔒 Informações confidenciais • ⚡ Respostas em tempo real
              </p>
            </div>
          </CardContent>
        </Card>

        <div className="grid md:grid-cols-2 gap-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-sm">Especialidades da Emilia</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="text-sm space-y-2 text-muted-foreground">
                <li>• Estratégias de vendas e conversão</li>
                <li>• Controle financeiro e orçamentos</li>
                <li>• Gestão de propostas comerciais</li>
                <li>• Planejamento financeiro e metas</li>
                <li>• Otimização de processos comerciais</li>
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-sm">Como Conversar com a Emilia</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="text-sm space-y-2 text-muted-foreground">
                <li>• "Como aumentar minhas vendas e receita?"</li>
                <li>• "Estratégias para melhorar conversão?"</li>
                <li>• "Controle de gastos e orçamento"</li>
                <li>• "Gestão de fluxo de caixa"</li>
                <li>• "Otimização de processos comerciais"</li>
              </ul>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
} 