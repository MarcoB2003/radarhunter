import React from 'react';
import { Card } from '@/components/ui/card';
import { Opportunity } from '@/types';
import { STAGES } from '@/lib/pipeline-utils';
import { Calendar, DollarSign, User, Trash2, Pencil } from 'lucide-react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { formatCurrency } from '@/lib/utils';
import { Button } from '@/components/ui/button';

interface OpportunityCardProps {
  opportunity: Opportunity;
  onCardClick: (id: string) => void;
  onDeleteClick: (opportunity: Opportunity) => void;
  onEditClick: (opportunity: Opportunity) => void;
}

const OpportunityCard: React.FC<OpportunityCardProps> = ({
  opportunity,
  onCardClick,
  onDeleteClick,
  onEditClick
}) => {
  const {
    id,
    title,
    value,
    closing_probability,
    expected_close_date,
    assigned_to,
    stage_id
  } = opportunity;

  const getBgColor = (probability: number) => {
    const stage = STAGES.find(s => s.id === opportunity.stage_id);
    if (!stage) return 'bg-card border-border';
    
    if (probability >= 75) return `${stage.color} border-${stage.color.replace('bg-', '')}`;
    if (probability >= 50) return `${stage.color} border-${stage.color.replace('bg-', '')}`;
    return `${stage.color} border-${stage.color.replace('bg-', '')}`;
  };

  return (
    <Card
      className={`relative mb-2 p-3 hover:shadow-md transition-shadow ${getBgColor(closing_probability)}`}
    >
      {/* Clique no card inteiro */}
      <div
        className="absolute inset-0"
        onClick={(e) => {
          // Verifica se o clique foi em um botão
          const target = e.target as HTMLElement;
          if (!target.closest('button')) {
            onCardClick(opportunity.id);
          }
        }}
      />

      {/* Informações */}
      <div className="space-y-2">
        <h3 className="font-medium text-sm line-clamp-2">{title}</h3>

        <div className="flex items-center justify-between text-xs text-muted-foreground">
          <div className="flex items-center gap-1 max-w-[70%] overflow-hidden text-ellipsis">
            <DollarSign className="h-3 w-3 flex-shrink-0" />
            <span className="truncate">{formatCurrency(value)}</span>
          </div>
          <div className="bg-background px-1.5 py-0.5 rounded text-xs font-medium flex-shrink-0">
            {closing_probability ? `${closing_probability}%` : '0%'}
          </div>
        </div>

        {(expected_close_date || assigned_to) && (
          <div className="flex flex-col space-y-1 text-xs text-muted-foreground pt-2 border-t border-border">
            {expected_close_date && (
              <div className="flex items-center">
                <Calendar className="h-3 w-3 mr-1 flex-shrink-0" />
                <span className="truncate">
                  {expected_close_date ? format(new Date(expected_close_date), 'dd/MM/yyyy', { locale: ptBR }) : 'Data não definida'}
                </span>
              </div>
            )}
            {assigned_to && (
              <div className="flex items-center">
                <User className="h-3 w-3 mr-1 flex-shrink-0" />
                <span className="truncate">{assigned_to}</span>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Clique no card inteiro */}
      <div
        className="absolute inset-0"
        onClick={(e) => {
          // Verifica se o clique foi em um botão
          const target = e.target as HTMLElement;
          if (!target.closest('button')) {
            onCardClick(opportunity.id);
          }
        }}
      />

      {/* Botões de ação */}
      <div className="mt-2 flex justify-end gap-2">
        <Button
          variant="ghost"
          size="icon"
          className="text-destructive hover:text-red-600 z-10"
          onClick={(e) => {
            e.stopPropagation(); // Impede que clique acione o onCardClick
            e.preventDefault(); // Previne qualquer comportamento padrão
            onDeleteClick(opportunity);
          }}
        >
          <Trash2 className="w-4 h-4" />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          className="text-muted-foreground hover:text-primary z-10"
          onClick={(e) => {
            e.stopPropagation(); // Impede que clique acione o onCardClick
            e.preventDefault(); // Previne qualquer comportamento padrão
            onEditClick(opportunity);
          }}
        >
          <Pencil className="w-4 h-4" />
        </Button>
      </div>
    </Card>
  );
};

export default OpportunityCard;
