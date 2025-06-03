
import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import MainLayout from '../components/layout/MainLayout';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Plus, Calendar, ChevronDown, Filter, BarChart } from 'lucide-react';
import { fetchOpportunities, createOpportunity, updateOpportunity } from '@/services/opportunityService';
import { useSelector } from 'react-redux';
import { RootState } from '@/store';
import { Opportunity } from '@/types';
import PipelineStage from '@/components/opportunities/PipelineStage';
import OpportunityModal from '@/components/opportunities/OpportunityModal';
import { toast } from '@/components/ui/use-toast';

const Pipeline: React.FC = () => {
  const queryClient = useQueryClient();
  const { pipelineStages } = useSelector((state: RootState) => state.opportunities);
  const [selectedOpportunity, setSelectedOpportunity] = useState<Opportunity | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [initialStageId, setInitialStageId] = useState<string | undefined>(undefined);

  // Fetch opportunities from Supabase
  const { data: opportunities = [], isLoading, error } = useQuery({
    queryKey: ['opportunities'],
    queryFn: fetchOpportunities
  });

  // Mutations for creating and updating opportunities
  const createMutation = useMutation({
    mutationFn: createOpportunity,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['opportunities'] });
      setIsModalOpen(false);
      toast({
        title: "Oportunidade criada",
        description: "A oportunidade foi criada com sucesso."
      });
    },
    onError: (error) => {
      console.error('Error creating opportunity:', error);
      toast({
        title: "Erro ao criar oportunidade",
        description: "Não foi possível criar a oportunidade.",
        variant: "destructive"
      });
    }
  });
  
  const updateMutation = useMutation({
    mutationFn: (data: Partial<Opportunity>) => 
      updateOpportunity(data.id as string, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['opportunities'] });
      setIsModalOpen(false);
      setSelectedOpportunity(null);
      toast({
        title: "Oportunidade atualizada",
        description: "A oportunidade foi atualizada com sucesso."
      });
    },
    onError: (error) => {
      console.error('Error updating opportunity:', error);
      toast({
        title: "Erro ao atualizar oportunidade",
        description: "Não foi possível atualizar a oportunidade.",
        variant: "destructive"
      });
    }
  });

  // Group opportunities by stage
  const opportunitiesByStage = pipelineStages.reduce((acc, stage) => {
    acc[stage.id] = opportunities.filter(opp => opp.stageId === stage.id);
    return acc;
  }, {} as Record<string, Opportunity[]>);

  // Handlers
  const handleOpenModal = (stageId?: string) => {
    setSelectedOpportunity(null);
    setInitialStageId(stageId);
    setIsModalOpen(true);
  };
  
  const handleCardClick = (id: string) => {
    const opportunity = opportunities.find(opp => opp.id === id);
    if (opportunity) {
      setSelectedOpportunity(opportunity);
      setIsModalOpen(true);
    }
  };

  const handleSaveOpportunity = (data: Partial<Opportunity>) => {
    if (selectedOpportunity) {
      // Update existing opportunity
      updateMutation.mutate({
        ...selectedOpportunity,
        ...data
      });
    } else {
      // Create new opportunity with default values for required fields
      const newOpportunity = {
        ...data,
        leadId: data.leadId || 'placeholder', // Temporary until leads are integrated
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      
      createMutation.mutate(newOpportunity as any);
    }
  };

  // Calculate totals for summary card
  const totalOpportunities = opportunities.length;
  const totalValue = opportunities.reduce((sum, opp) => sum + opp.value, 0);
  const weightedValue = opportunities.reduce(
    (sum, opp) => sum + (opp.value * (opp.closingProbability / 100)), 
    0
  );

  if (error) {
    return (
      <MainLayout title="Pipeline de Vendas">
        <div className="bg-destructive/10 p-4 rounded-md">
          <h3 className="text-destructive font-medium">Erro ao carregar pipeline</h3>
          <p className="text-sm">Não foi possível carregar as oportunidades. Tente novamente mais tarde.</p>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout title="Pipeline de Vendas">
      <div className="space-y-6">
        {/* Header and Actions */}
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-xl font-semibold">Pipeline de Vendas</h2>
            <p className="text-muted-foreground text-sm">
              Gerencie suas oportunidades em cada estágio do funil
            </p>
          </div>
          
          <div className="flex gap-2">
            <Button variant="outline">
              <Filter className="h-4 w-4 mr-2" />
              Filtros
              <ChevronDown className="h-4 w-4 ml-2" />
            </Button>
            <Button variant="outline">
              <Calendar className="h-4 w-4 mr-2" />
              Este Mês
              <ChevronDown className="h-4 w-4 ml-2" />
            </Button>
            <Button onClick={() => handleOpenModal()}>
              <Plus className="h-4 w-4 mr-2" />
              Nova Oportunidade
            </Button>
          </div>
        </div>
        
        {/* Pipeline View */}
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
            {pipelineStages.map(stage => (
              <div key={stage.id} className="flex flex-col">
                <div className="flex justify-between items-center mb-2">
                  <h3 className="font-medium">{stage.name}</h3>
                </div>
                <div className="flex-1 bg-muted/30 rounded-lg p-2 min-h-[200px] animate-pulse" />
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
            {pipelineStages.map(stage => (
              <PipelineStage 
                key={stage.id}
                stage={stage}
                opportunities={opportunitiesByStage[stage.id] || []}
                onCardClick={handleCardClick}
                onAddClick={handleOpenModal}
              />
            ))}
          </div>
        )}
        
        {/* Pipeline Summary */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Resumo do Pipeline</CardTitle>
          </CardHeader>
          <CardContent>
            {totalOpportunities > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="p-4 bg-muted/30 rounded-md text-center">
                  <p className="text-sm text-muted-foreground">Total de Oportunidades</p>
                  <p className="text-2xl font-bold mt-1">{totalOpportunities}</p>
                </div>
                <div className="p-4 bg-muted/30 rounded-md text-center">
                  <p className="text-sm text-muted-foreground">Valor Total</p>
                  <p className="text-2xl font-bold mt-1">
                    {new Intl.NumberFormat('pt-BR', {
                      style: 'currency',
                      currency: 'BRL'
                    }).format(totalValue)}
                  </p>
                </div>
                <div className="p-4 bg-muted/30 rounded-md text-center">
                  <p className="text-sm text-muted-foreground">Valor Ponderado</p>
                  <p className="text-2xl font-bold mt-1">
                    {new Intl.NumberFormat('pt-BR', {
                      style: 'currency',
                      currency: 'BRL'
                    }).format(weightedValue)}
                  </p>
                </div>
              </div>
            ) : (
              <div className="flex items-center justify-center gap-2 py-4">
                <BarChart className="h-5 w-5 text-muted-foreground" />
                <p className="text-muted-foreground">
                  Adicione oportunidades para visualizar o resumo do pipeline
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Opportunity Modal */}
      <OpportunityModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setSelectedOpportunity(null);
          setInitialStageId(undefined);
        }}
        onSave={handleSaveOpportunity}
        opportunity={selectedOpportunity || undefined}
        stages={pipelineStages}
        initialStageId={initialStageId}
      />
    </MainLayout>
  );
};

export default Pipeline;
