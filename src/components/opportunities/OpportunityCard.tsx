
import React from 'react';
import { Card } from '@/components/ui/card';
import { Opportunity } from '@/types';
import { Calendar, DollarSign, User } from 'lucide-react';
import { formatCurrency } from '@/lib/utils';

interface OpportunityCardProps {
  opportunity: Opportunity;
  onCardClick: (id: string) => void;
}

const OpportunityCard: React.FC<OpportunityCardProps> = ({ 
  opportunity, 
  onCardClick 
}) => {
  const { id, title, value, closingProbability, expectedCloseDate, assignedTo } = opportunity;
  
  // Determine background color based on closing probability
  const getBgColor = (probability: number) => {
    if (probability >= 75) return 'bg-emerald-100 border-emerald-300';
    if (probability >= 50) return 'bg-amber-50 border-amber-200';
    return 'bg-card border-border';
  };

  return (
    <Card 
      className={`mb-2 p-3 cursor-pointer hover:shadow-md transition-shadow ${getBgColor(closingProbability)}`}
      onClick={() => onCardClick(id)}
    >
      <div className="space-y-2">
        <h3 className="font-medium text-sm line-clamp-2">{title}</h3>
        
        <div className="flex items-center justify-between text-xs text-muted-foreground">
          <div className="flex items-center">
            <DollarSign className="h-3 w-3 mr-1" />
            <span>{formatCurrency(value)}</span>
          </div>
          <div className="bg-background px-1.5 py-0.5 rounded text-xs font-medium">
            {closingProbability}%
          </div>
        </div>
        
        {(expectedCloseDate || assignedTo) && (
          <div className="flex items-center justify-between text-xs text-muted-foreground pt-2 border-t border-border">
            {expectedCloseDate && (
              <div className="flex items-center">
                <Calendar className="h-3 w-3 mr-1" />
                <span>
                  {new Date(expectedCloseDate).toLocaleDateString('pt-BR')}
                </span>
              </div>
            )}
            
            {assignedTo && (
              <div className="flex items-center">
                <User className="h-3 w-3 mr-1" />
                <span>{assignedTo}</span>
              </div>
            )}
          </div>
        )}
      </div>
    </Card>
  );
};

export default OpportunityCard;
