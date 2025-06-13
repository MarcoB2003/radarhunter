
import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import MainLayout from '../components/layout/MainLayout';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Brain,
  Target,
  TrendingUp,
  AlertCircle,
  Users,
  MessageSquare,
  BarChart3,
  Zap,
  Eye,
  Settings
} from 'lucide-react';
import { useAppDispatch, useAppSelector } from '../store';
import { fetchLeadsStart, fetchLeadsSuccess, fetchLeadsFailed } from '../store/slices/leadsSlice';
import { fetchOpportunitiesStart, fetchOpportunitiesSuccess, fetchOpportunitiesFailed } from '../store/slices/opportunitiesSlice';
import { fetchLeads as fetchLeadsService } from '../services/leadService';
import { fetchOpportunities as fetchOpportunitiesService } from '../services/opportunityService';
import { Opportunity } from '@/types/opportunity'; // Correct opportunity type import
import { toast } from '@/components/ui/use-toast';

// Import dos novos componentes que vamos criar
import LeadScoringDashboard from '@/components/empresas/LeadScoringDashboard';
import AISdrDashboard from '@/components/empresas/AISdrDashboard';
import AICloserDashboard from '@/components/empresas/AICloserDashboard';
import AIManagerDashboard from '@/components/empresas/AIManagerDashboard';
import PipelineDashboard from '@/components/empresas/PipelineDashboard';
import AnalyticsDashboard from '@/components/empresas/AnalyticsDashboard';
import SocialMonitoringDashboard from '@/components/empresas/SocialMonitoringDashboard';
import CampaignsDashboard from '@/components/empresas/CampaignsDashboard';

const Dashboard: React.FC = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { items: leads, loading: leadsLoading } = useAppSelector(state => state.leads);
  const { items: opportunities } = useAppSelector(state => state.opportunities);
  const [activeTab, setActiveTab] = useState('overview');
  
  const handleNavigateToCompanySearch = () => {
    navigate('/company-search');
  };
  
  useEffect(() => {
    const loadData = async () => {
      try {
        dispatch(fetchLeadsStart());
        const leadsData = await fetchLeadsService();
        dispatch(fetchLeadsSuccess(leadsData));
        
        dispatch(fetchOpportunitiesStart());
        const opportunitiesData = await fetchOpportunitiesService();
        // Força a conversão do tipo para resolver a incompatibilidade
        dispatch(fetchOpportunitiesSuccess(opportunitiesData as any));
      } catch (error) {
        dispatch(fetchLeadsFailed(error instanceof Error ? error.message : 'Failed to fetch data'));
        dispatch(fetchOpportunitiesFailed(error instanceof Error ? error.message : 'Failed to fetch data'));
        toast({
          title: "Erro ao carregar dados",
          description: "Não foi possível carregar os dados do dashboard.",
          variant: "destructive"
        });
      }
    };
    
    loadData();
  }, [dispatch]);

  // KPIs principais para o overview - removido o card do RadarHunter pro v2.0.0
  const mainKPIs = [
    {
      title: "Leads Ativos",
      value: leads.length,
      icon: Users,
      trend: "+12%",
      color: "text-blue-600"
    },
    {
      title: "Pipeline Ativo",
      value: opportunities.length,
      icon: Target,
      trend: "+8%",
      color: "text-green-600"
    },
    {
      title: "Taxa Conversão",
      value: "24%",
      icon: TrendingUp,
      trend: "+3%",
      color: "text-orange-600"
    }
  ];

  return (
    <MainLayout title="Dashboard">
      <div className="space-y-6">
        {/* Botão de buscar empresas com IA */}
        <div className="flex justify-end">
          <Button 
            className="bg-blue-600 hover:bg-blue-700 text-white" 
            onClick={handleNavigateToCompanySearch}
          >
            Buscar empresas com IA
          </Button>
        </div>
        
        {/* Header com KPIs principais */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {mainKPIs.map((kpi, index) => (
            <Card key={index}>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground flex items-center justify-between">
                  {kpi.title}
                  <kpi.icon className={`h-4 w-4 ${kpi.color}`} />
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{kpi.value}</div>
                <p className="text-xs text-muted-foreground">
                  <span className="text-green-600">{kpi.trend}</span> em relação ao último mês
                </p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Navegação por abas dos módulos */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid grid-cols-4 lg:grid-cols-8 w-full">
            <TabsTrigger value="overview" className="flex items-center gap-1">
              <BarChart3 className="h-3 w-3" />
              Visão Geral
            </TabsTrigger>
            <TabsTrigger value="scoring" className="flex items-center gap-1">
              <Brain className="h-3 w-3" />
              Scoring IA
            </TabsTrigger>
            <TabsTrigger value="sdr" className="flex items-center gap-1">
              <Target className="h-3 w-3" />
              IA SDR
            </TabsTrigger>
            <TabsTrigger value="closer" className="flex items-center gap-1">
              <Zap className="h-3 w-3" />
              IA Closer
            </TabsTrigger>
            <TabsTrigger value="manager" className="flex items-center gap-1">
              <Settings className="h-3 w-3" />
              Gerente IA
            </TabsTrigger>
            <TabsTrigger value="pipeline" className="flex items-center gap-1">
              <TrendingUp className="h-3 w-3" />
              Pipeline
            </TabsTrigger>
            <TabsTrigger value="social" className="flex items-center gap-1">
              <Eye className="h-3 w-3" />
              Social
            </TabsTrigger>
            <TabsTrigger value="campaigns" className="flex items-center gap-1">
              <MessageSquare className="h-3 w-3" />
              Campanhas
            </TabsTrigger>
          </TabsList>

          {/* Conteúdo das abas */}
          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <AnalyticsDashboard />
              <PipelineDashboard />
            </div>
          </TabsContent>

          <TabsContent value="scoring">
            <LeadScoringDashboard />
          </TabsContent>

          <TabsContent value="sdr">
            <AISdrDashboard />
          </TabsContent>

          <TabsContent value="closer">
            <AICloserDashboard />
          </TabsContent>

          <TabsContent value="manager">
            <AIManagerDashboard />
          </TabsContent>

          <TabsContent value="pipeline">
            <PipelineDashboard />
          </TabsContent>

          <TabsContent value="social">
            <SocialMonitoringDashboard />
          </TabsContent>

          <TabsContent value="campaigns">
            <CampaignsDashboard />
          </TabsContent>
        </Tabs>
      </div>
    </MainLayout>
  );
};

export default Dashboard;
