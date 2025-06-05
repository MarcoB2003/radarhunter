import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { formatCurrency } from '@/lib/utils';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

interface PipelineSummaryProps {
  metrics: {
    totalOpportunities: number;
    totalValue: number;
    weightedValue: number;
  };
}

const PipelineSummary: React.FC<PipelineSummaryProps> = ({ metrics }) => {
  const today = new Date();
  const nextMonth = new Date(today.setMonth(today.getMonth() + 1));

  return (
    <div className="border rounded-md shadow-sm ring-1 bg-muted/20 p-4 mb-6">
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="space-y-2">
          <h4 className="text-sm font-medium text-muted-foreground">Total de Oportunidades</h4>
          <p className="text-2xl font-bold">{metrics.totalOpportunities}</p>
        </div>
        <div className="space-y-2">
          <h4 className="text-sm font-medium text-muted-foreground">Valor Total</h4>
          <p className="text-2xl font-bold">{formatCurrency(metrics.totalValue)}</p>
        </div>
        <div className="space-y-2">
          <h4 className="text-sm font-medium text-muted-foreground group relative">
            Valor Ponderado
            <span className="absolute -top-4 -left-4 opacity-0 group-hover:opacity-100 transition-opacity duration-200 bg-primary/90 text-primary-foreground rounded px-2 py-1 text-xs whitespace-nowrap">
              Valor ajustado pela probabilidade de fechamento
            </span>
          </h4>
          <p className="text-2xl font-bold">{formatCurrency(metrics.weightedValue)}</p>
        </div>
      </div>
      <p className="mt-4 text-sm text-muted-foreground">
        Atualizado em {format(new Date(), 'dd MMMM yyyy', { locale: ptBR })}
      </p>
    </div>
  );
};

export default PipelineSummary;
