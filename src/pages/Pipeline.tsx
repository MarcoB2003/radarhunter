import React, { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import MainLayout from '../components/layout/MainLayout';
import { Button } from '../components/ui/button';
import { Plus } from 'lucide-react';
import { fetchOpportunities, createOpportunity, updateOpportunity, deleteOpportunity } from '../services/opportunityService';
import { Opportunity, OpportunityStage } from '../types';
import PipelineSummary from '../components/opportunities/PipelineSummary';
import PipelineFilter from '../components/opportunities/PipelineFilter';
import { calculatePipelineMetrics, STAGES } from '../lib/pipeline-utils';
import OpportunityModal from '../components/opportunities/OpportunityModal';
import PipelineStage from '../components/opportunities/PipelineStage';
import { toast } from '../hooks/use-toast';
import { v4 as uuidv4 } from 'uuid';
import { initialOpportunities } from '../data/pipelineData';
import { supabase } from '@/lib/supabaseClient';

const Pipeline: React.FC = () => {
  const queryClient = useQueryClient();
  const [selectedOpportunity, setSelectedOpportunity] = useState<Opportunity | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [initialStageId, setInitialStageId] = useState<string | undefined>(undefined);
  const [currentFilter, setCurrentFilter] = useState('all');
  const [localOpportunities, setLocalOpportunities] = useState<Opportunity[]>([]);
  const [isFetching, setIsFetching] = useState(false);
  const [fetchError, setFetchError] = useState<string | null>(null);

  useEffect(() => {
    loadFromSupabase();
  }, []);

  const loadFromSupabase = async () => {
    try {
      setIsFetching(true);
      setFetchError(null);
      const data = await fetchOpportunities();
      setLocalOpportunities(data);
    } catch (error) {
      console.error('Erro ao carregar do Supabase:', error);
      setFetchError('Erro ao carregar dados do Supabase');
      toast({
        title: 'Erro',
        description: 'Erro ao carregar dados do Supabase. Usando dados locais.',
        variant: 'destructive'
      });
    } finally {
      setIsFetching(false);
    }
  };

  const { data: opportunities, error: queryError, isLoading: isQueryLoading } = useQuery({
    queryKey: ['opportunities'],
    queryFn: fetchOpportunities,
  });

  useEffect(() => {
    if (opportunities) {
      setLocalOpportunities(opportunities);
    }
  }, [opportunities]);

  const createMutation = useMutation({
    mutationFn: createOpportunity,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['opportunities'] });
    },
    onError: (error) => {
      console.error('Erro ao criar oportunidade:', error);
    }
  });

  const updateMutation = useMutation({
    mutationFn: (data: { id: string; updates: Partial<Opportunity> }) => updateOpportunity(data.id, data.updates),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['opportunities'] });
    },
    onError: (error) => {
      console.error('Erro ao atualizar oportunidade:', error);
    }
  });

  const deleteMutation = useMutation({
    mutationFn: deleteOpportunity,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['opportunities'] });
    },
    onError: (error) => {
      console.error('Erro ao deletar oportunidade:', error);
    }
  });

  const handleDeleteOpportunity = async (id: string) => {
    try {
      await deleteMutation.mutateAsync(id);
      toast({
        title: 'Sucesso',
        description: 'Oportunidade deletada com sucesso!',
        variant: 'default'
      });
    } catch (error) {
      console.error('Erro ao deletar oportunidade:', error);
      toast({
        title: 'Erro',
        description: 'Erro ao deletar oportunidade. Tente novamente.',
        variant: 'destructive'
      });
    }
  };

  const handleSaveOpportunity = async (data: Partial<Opportunity>) => {
    const timestamp = new Date().toISOString();
    console.log('Dados recebidos no handleSaveOpportunity:', data);

    if (selectedOpportunity) {
      const updatedData: Opportunity = {
        ...selectedOpportunity,
        ...data,
        stage_id: selectedOpportunity.stage_id, // Mantém o stage_id original
        lead_id: data.lead_id || selectedOpportunity.lead_id,
        assigned_to: data.assigned_to || selectedOpportunity.assigned_to,
        contact_id: data.contact_id || selectedOpportunity.contact_id,
        updated_at: timestamp
      };

      setLocalOpportunities(prev =>
        prev.map(opportunity =>
          opportunity.id === selectedOpportunity.id ? updatedData : opportunity
        )
      );
      
      try {
        await updateMutation.mutateAsync({ id: selectedOpportunity.id, updates: updatedData });
        toast({
          title: 'Sucesso',
          description: 'Oportunidade atualizada com sucesso!',
          variant: 'default'
        });
      } catch (error) {
        console.error('Erro ao atualizar oportunidade:', error);
        toast({
          title: 'Erro',
          description: 'Erro ao atualizar oportunidade. Tente novamente.',
          variant: 'destructive'
        });
        setLocalOpportunities(prev =>
          prev.map(opportunity =>
            opportunity.id === selectedOpportunity.id ? selectedOpportunity : opportunity
          )
        );
      }
    } else {
      const newOpportunity: Omit<Opportunity, 'id'> = {
        title: data.title || '',
        value: data.value || 0,
        stage_id: initialStageId as OpportunityStage || STAGES[0].id,
        closing_probability: data.closing_probability || 50,
        expected_close_date: data.expected_close_date || null,
        notes: data.notes || null,
        created_at: timestamp,
        updated_at: timestamp,
        owner: uuidv4(),
        lead_id: data.lead_id || null,
        assigned_to: data.assigned_to || null,
        contact_id: data.contact_id || null,
        buying_signals: data.buying_signals || [],
        proposal_generated: data.proposal_generated || false,
        objection_handling: data.objection_handling || [],
        urgency_factors: data.urgency_factors || []
      };

      console.log('Nova oportunidade a ser criada:', newOpportunity);
      
      // Primeiro cria o objeto local com ID temporário
      const tempOpportunity: Opportunity = {
        ...newOpportunity,
        id: uuidv4()
      };
      
      setLocalOpportunities(prev => [...prev, tempOpportunity]);
      
      try {
        // Remove o ID temporário antes de enviar para o Supabase
        const result = await createMutation.mutateAsync({
          title: newOpportunity.title,
          value: newOpportunity.value,
          stage_id: newOpportunity.stage_id,
          closing_probability: newOpportunity.closing_probability,
          expected_close_date: newOpportunity.expected_close_date,
          notes: newOpportunity.notes,
          buying_signals: newOpportunity.buying_signals,
          proposal_generated: newOpportunity.proposal_generated,
          objection_handling: newOpportunity.objection_handling,
          urgency_factors: newOpportunity.urgency_factors,
          lead_id: newOpportunity.lead_id,
          assigned_to: newOpportunity.assigned_to,
          contact_id: newOpportunity.contact_id,
          created_at: newOpportunity.created_at,
          updated_at: newOpportunity.updated_at,
          owner: newOpportunity.owner
        } as Omit<Opportunity, 'id'>);

        // Atualiza o estado local com o ID temporário
        setLocalOpportunities(prev => 
          prev.map(opportunity => 
            opportunity.id === tempOpportunity.id ? tempOpportunity : opportunity
          )
        );
        
        toast({
          title: 'Sucesso',
          description: 'Oportunidade criada com sucesso!',
          variant: 'default'
        });
      } catch (error) {
        console.error('Erro ao criar oportunidade:', error);
        // Remove a oportunidade local se houver erro
        setLocalOpportunities(prev => prev.filter(opportunity => opportunity.id !== tempOpportunity.id));
        toast({
          title: 'Erro',
          description: 'Erro ao criar oportunidade. Tente novamente.',
          variant: 'destructive'
        });
        return;
      }
    }
  };

  const opportunitiesByStage = STAGES.reduce((acc, stage) => {
    acc[stage.id] = localOpportunities.filter(opportunity => opportunity.stage_id === stage.id);
    return acc;
  }, {} as Record<string, Opportunity[]>);

  const metrics = calculatePipelineMetrics(localOpportunities);

  return (
    <MainLayout title="Pipeline de Vendas">
      <div className="flex flex-col min-h-screen bg-background">
        <div className="flex items-center justify-between p-4 border-b">
          <h1 className="text-2xl font-bold">Pipeline de Vendas</h1>
          <div className="flex gap-2">
            <PipelineFilter currentFilter={currentFilter} onFilterChange={setCurrentFilter} />
            <Button onClick={() => setIsModalOpen(true)}>
              <Plus className="h-4 w-4 mr-2" />Nova Oportunidade
            </Button>
          </div>
        </div>

        <div className="flex-1 p-4 space-y-6">
          {isFetching ? (
            <div className="flex items-center justify-center h-32">
              <span className="text-muted-foreground">Carregando dados...</span>
            </div>
          ) : fetchError ? (
            <div className="flex flex-col items-center justify-center h-32">
              <span className="text-destructive">Erro ao carregar dados: {fetchError}</span>
              <Button
                variant="outline"
                size="sm"
                onClick={loadFromSupabase}
                className="mt-2"
              >
                Tentar novamente
              </Button>
            </div>
          ) : (
            <>
              <PipelineSummary metrics={metrics} />

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
                {STAGES.map(stage => (
                  <PipelineStage
                    key={stage.id}
                    stage={stage}
                    opportunities={opportunitiesByStage[stage.id] || []}
                    onCardClick={(id) => {
                      const opportunity = localOpportunities.find(o => o.id === id);
                      setSelectedOpportunity(opportunity || null);
                    }}
                    onAddClick={() => {
                      setInitialStageId(stage.id);
                      setIsModalOpen(true);
                    }}
                    onDeleteClick={(opportunity: Opportunity) => handleDeleteOpportunity(opportunity.id)}
                    onEditClick={(opportunity: Opportunity) => {
                      setSelectedOpportunity({ ...opportunity });
                      setIsModalOpen(true);
                    }}
                  />
                ))}
              </div>
            </>
          )}
        </div>

        <OpportunityModal
          isOpen={isModalOpen}
          onClose={() => {
            setIsModalOpen(false);
            setSelectedOpportunity(null);
            setInitialStageId(undefined);
          }}
          onSave={handleSaveOpportunity}
          opportunity={selectedOpportunity || undefined}
          stages={STAGES}
          initialStageId={initialStageId}
        />
      </div>
    </MainLayout>
  );
};

export default Pipeline;