
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { TrendingUp, DollarSign, Clock, Users } from 'lucide-react';

const PipelineDashboard: React.FC = () => {
  const pipelineData = {
    totalValue: 245000,
    weightedValue: 87500,
    avgCycleTime: 45,
    conversionRate: 24
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <TrendingUp className="h-5 w-5" />
          Pipeline Inteligente
        </CardTitle>
        <CardDescription>Visão geral do funil de vendas</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-4 mb-4">
          <div className="text-center p-3 bg-muted rounded-lg">
            <DollarSign className="h-5 w-5 mx-auto mb-1 text-green-600" />
            <div className="text-lg font-bold">R$ {(pipelineData.totalValue / 1000).toFixed(0)}k</div>
            <div className="text-xs text-muted-foreground">Valor Total</div>
          </div>
          <div className="text-center p-3 bg-muted rounded-lg">
            <Clock className="h-5 w-5 mx-auto mb-1 text-blue-600" />
            <div className="text-lg font-bold">{pipelineData.avgCycleTime}d</div>
            <div className="text-xs text-muted-foreground">Ciclo Médio</div>
          </div>
        </div>
        <Button className="w-full" variant="outline">
          Ver Pipeline Completo
        </Button>
      </CardContent>
    </Card>
  );
};

export default PipelineDashboard;
