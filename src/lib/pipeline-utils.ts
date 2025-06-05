import { OpportunityStage as OpportunityStageType } from '@/types/opportunity';

export interface PipelineStage {
  id: OpportunityStageType;
  name: string;
  color: string;
  order: number;
}

export const calculatePipelineMetrics = (opportunities: any[]) => {
  const totalValue = opportunities.reduce((sum, opp) => sum + (Number(opp.value) || 0), 0);
  const weightedValue = opportunities.reduce((sum, opp) => {
    const value = Number(opp.value) || 0;
    const probability = Number(opp.closing_probability) || 0; // Corrigido o nome do campo
    return sum + (value * (probability / 100));
  }, 0);
  const totalOpportunities = opportunities.length;

  return {
    totalOpportunities,
    totalValue,
    weightedValue
  };
};

export function getStageColor(stageId: OpportunityStageType): string {
  const stage = STAGES.find(s => s.id === stageId);
  return stage?.color || 'bg-gray-100';
}

export const STAGES: PipelineStage[] = [
  { id: 'lead', name: 'Lead', order: 1, color: 'bg-amber-100' },
  { id: 'qualification', name: 'Qualificação', order: 2, color: 'bg-emerald-100' },
  { id: 'proposal', name: 'Proposta', order: 3, color: 'bg-amber-50' },
  { id: 'negotiation', name: 'Negociação', order: 4, color: 'bg-blue-50' },
  { id: 'closing', name: 'Fechamento', order: 5, color: 'bg-red-100' },
  { id: 'lost', name: 'Perdido', order: 6, color: 'bg-gray-100' }
];
