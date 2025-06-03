
import React from 'react';
import { PipelineStage as PipelineStageType, Opportunity } from '@/types';
import OpportunityCard from './OpportunityCard';
import { Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface PipelineStageProps {
  stage: PipelineStageType;
  opportunities: Opportunity[];
  onCardClick: (id: string) => void;
  onAddClick: (stageId: string) => void;
}

const PipelineStage: React.FC<PipelineStageProps> = ({ 
  stage, 
  opportunities, 
  onCardClick,
  onAddClick
}) => {
  return (
    <div className="flex flex-col">
      <div className="flex justify-between items-center mb-2">
        <h3 className="font-medium">{stage.name}</h3>
        <span className="text-xs font-medium bg-secondary text-secondary-foreground px-2 py-1 rounded-full">
          {opportunities.length}
        </span>
      </div>
      
      <div 
        className="flex-1 bg-muted/30 rounded-lg p-2 min-h-[200px] overflow-y-auto"
        data-stage-id={stage.id}
      >
        {opportunities.length > 0 ? (
          <div className="space-y-2">
            {opportunities.map((opportunity) => (
              <OpportunityCard 
                key={opportunity.id}
                opportunity={opportunity}
                onCardClick={onCardClick}
              />
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center h-32 text-center">
            <p className="text-sm text-muted-foreground mb-2">
              Nenhuma oportunidade
            </p>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => onAddClick(stage.id)}
            >
              <Plus className="h-3 w-3 mr-1" />
              Adicionar
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default PipelineStage;
