import React from 'react';
import { PageHeader } from '../../components/common/PageHeader';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Link } from 'react-router-dom';
import { Bot, TrendingUp, Cog, MessageCircle } from 'lucide-react';

export default function AIChat() {
  return (
    <div className="space-y-6">
      <PageHeader 
        title="Chat IA" 
        description="Converse com nossos assistentes especializados"
      />

      <div className="grid gap-6 md:grid-cols-2">
        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-gradient-to-r from-purple-600 to-blue-600 rounded-lg flex items-center justify-center">
                <TrendingUp className="h-6 w-6 text-white" />
              </div>
              <div>
                <CardTitle>Emilia - Vendas e Financeiro</CardTitle>
                <p className="text-sm text-muted-foreground">
                  Especialista em vendas e questões financeiras
                </p>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground mb-4">
              Tire dúvidas sobre vendas, estratégias financeiras, análise de crédito e muito mais.
            </p>
            <Link to="/ai-chat/emilia">
              <Button className="w-full">
                <MessageCircle className="h-4 w-4 mr-2" />
                Conversar com Emilia
              </Button>
            </Link>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-gradient-to-r from-green-600 to-emerald-600 rounded-lg flex items-center justify-center">
                <Cog className="h-6 w-6 text-white" />
              </div>
              <div>
                <CardTitle>Elias - Operacional e Gestão</CardTitle>
                <p className="text-sm text-muted-foreground">
                  Especialista em operações e gestão
                </p>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground mb-4">
              Obtenha ajuda com processos operacionais, gestão de equipe e otimização de workflows.
            </p>
            <Link to="/ai-chat/elias">
              <Button className="w-full">
                <MessageCircle className="h-4 w-4 mr-2" />
                Conversar com Elias
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Bot className="h-5 w-5" />
            Como usar o Chat IA
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-start gap-3">
              <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                <span className="text-xs font-medium text-blue-600">1</span>
              </div>
              <div>
                <h4 className="font-medium">Escolha seu assistente</h4>
                <p className="text-sm text-muted-foreground">
                  Selecione o assistente especializado na área que você precisa de ajuda.
                </p>
              </div>
            </div>
            
            <div className="flex items-start gap-3">
              <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                <span className="text-xs font-medium text-blue-600">2</span>
              </div>
              <div>
                <h4 className="font-medium">Faça sua pergunta</h4>
                <p className="text-sm text-muted-foreground">
                  Digite sua pergunta ou descrição detalhada do que você precisa.
                </p>
              </div>
            </div>
            
            <div className="flex items-start gap-3">
              <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                <span className="text-xs font-medium text-blue-600">3</span>
              </div>
              <div>
                <h4 className="font-medium">Obtenha respostas especializadas</h4>
                <p className="text-sm text-muted-foreground">
                  Receba respostas personalizadas e orientações práticas para sua situação.
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
} 