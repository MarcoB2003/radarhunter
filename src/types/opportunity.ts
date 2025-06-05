export type OpportunityStage = 'lead' | 'qualification' | 'proposal' | 'negotiation' | 'closing' | 'lost';

export interface Opportunity {
  id: string;
  title: string;
  value: number;
  stage_id: OpportunityStage;
  closing_probability: number;
  expected_close_date: string | null;
  notes: string | null;
  created_at: string;
  updated_at: string;
  owner: string;
  lead_id: string | null;
  assigned_to: string | null;
  contact_id: string | null;
  buying_signals: {
    id: string;
    name: string;
    description: string;
  }[];
  proposal_generated: boolean;
  objection_handling: {
    id: string;
    objection: string;
    response: string;
  }[];
  urgency_factors: string[];
}

export interface PipelineStage {
  id: string;
  name: string;
  color: string;
  order: number;
}

export type PipelineOpportunity = Omit<Opportunity, 'createdAt' | 'updatedAt'>;

export const calculatePipelineMetrics = (opportunities: Opportunity[]) => {
  const totalValue = opportunities.reduce((sum, opp) => sum + opp.value, 0);
  const weightedValue = opportunities.reduce(
    (sum, opp) => sum + (opp.value * (opp.closingProbability / 100)),
    0
  );

  return {
    totalOpportunities: opportunities.length,
    totalValue: totalValue,
    weightedValue: weightedValue
  };
};
