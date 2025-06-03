import React from 'react';
import { Activity, BarChart3, TrendingUp } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

const Monitoring = () => {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Monitoramento</h1>
          <p className="text-muted-foreground">
            Acompanhe performance e métricas dos seus agentes
          </p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Activity className="w-5 h-5" />
            <span>Dashboard de Métricas</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-12">
            <BarChart3 className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
            <h3 className="text-lg font-medium mb-2">Em Desenvolvimento</h3>
            <p className="text-muted-foreground mb-4">
              Métricas detalhadas e relatórios estarão disponíveis em breve
            </p>
            <Button variant="outline">
              <TrendingUp className="w-4 h-4 mr-2" />
              Ver Relatórios
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Monitoring; 