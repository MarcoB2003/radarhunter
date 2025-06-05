import { Opportunity, OpportunityStage } from '@/types';

export const initialOpportunities: Opportunity[] = [
  {
    id: '1',
    leadId: 'lead-1',
    title: 'Oportunidade 1',
    value: 10000,
    closingProbability: 70,
    expectedCloseDate: '2025-06-30',
    assignedTo: 'John Doe',
    stageId: 'lead',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    notes: 'Cliente interessado em nosso produto premium',
    buyingSignals: [
      {
        id: '1',
        name: 'Interesse inicial',
        description: 'Cliente demonstrou interesse inicial'
      }
    ],
    proposalGenerated: false,
    objectionHandling: [],
    urgencyFactors: ['Necessidade urgente', 'Concorrência']
  },
  {
    id: '2',
    leadId: 'lead-2',
    title: 'Oportunidade 2',
    value: 15000,
    closingProbability: 85,
    expectedCloseDate: '2025-07-15',
    assignedTo: 'Jane Smith',
    stageId: 'proposal',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    notes: 'Cliente em análise de proposta',
    buyingSignals: [
      {
        id: '2',
        name: 'Interesse em preço',
        description: 'Cliente questionou sobre preços'
      }
    ],
    proposalGenerated: true,
    objectionHandling: [],
    urgencyFactors: ['Budget aprovado']
  }
];
