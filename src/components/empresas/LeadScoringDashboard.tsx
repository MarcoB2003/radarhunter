
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { 
  Brain, 
  TrendingUp, 
  Users, 
  Target,
  ArrowUp,
  ArrowDown,
  Minus
} from 'lucide-react';

const LeadScoringDashboard: React.FC = () => {
  // Mock data para demonstração
  const scoringMetrics = {
    totalLeads: 245,
    hotLeads: 18,
    warmLeads: 67,
    coldLeads: 160,
    avgScore: 65,
    scoreDistribution: [
      { range: '90-100', count: 8, color: 'bg-red-500' },
      { range: '70-89', count: 32, color: 'bg-orange-500' },
      { range: '50-69', count: 89, color: 'bg-yellow-500' },
      { range: '30-49', count: 78, color: 'bg-blue-500' },
      { range: '0-29', count: 38, color: 'bg-gray-500' }
    ]
  };

  const topLeads = [
    { 
      id: '1', 
      company: 'TechCorp Solutions', 
      score: { behavioral: 85, profile: 92, temporal: 78, total: 85 },
      trend: 'up',
      temperature: 'hot'
    },
    { 
      id: '2', 
      company: 'Digital Innovations', 
      score: { behavioral: 78, profile: 88, temporal: 71, total: 79 },
      trend: 'up',
      temperature: 'warm'
    },
    { 
      id: '3', 
      company: 'Future Systems', 
      score: { behavioral: 71, profile: 75, temporal: 82, total: 76 },
      trend: 'stable',
      temperature: 'warm'
    }
  ];

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'up': return <ArrowUp className="h-3 w-3 text-green-600" />;
      case 'down': return <ArrowDown className="h-3 w-3 text-red-600" />;
      default: return <Minus className="h-3 w-3 text-gray-600" />;
    }
  };

  const getTemperatureBadge = (temperature: string) => {
    const colors = {
      hot: 'bg-red-100 text-red-800',
      warm: 'bg-orange-100 text-orange-800',
      cold: 'bg-blue-100 text-blue-800'
    };
    return <Badge className={colors[temperature as keyof typeof colors]}>{temperature.toUpperCase()}</Badge>;
  };

  return (
    <div className="space-y-6">
      {/* Métricas principais de scoring */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              <Brain className="h-4 w-4" />
              Score Médio
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{scoringMetrics.avgScore}</div>
            <Progress value={scoringMetrics.avgScore} className="mt-2" />
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              <Target className="h-4 w-4 text-red-600" />
              Leads Quentes
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{scoringMetrics.hotLeads}</div>
            <p className="text-xs text-muted-foreground">Score 80-100</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              <TrendingUp className="h-4 w-4 text-orange-600" />
              Leads Mornos
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">{scoringMetrics.warmLeads}</div>
            <p className="text-xs text-muted-foreground">Score 50-79</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              <Users className="h-4 w-4 text-blue-600" />
              Leads Frios
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">{scoringMetrics.coldLeads}</div>
            <p className="text-xs text-muted-foreground">Score 0-49</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Distribuição de Scores */}
        <Card>
          <CardHeader>
            <CardTitle>Distribuição de Scores</CardTitle>
            <CardDescription>Leads por faixa de pontuação</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {scoringMetrics.scoreDistribution.map((item, index) => (
                <div key={index} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className={`h-3 w-3 rounded ${item.color}`} />
                    <span className="text-sm font-medium">{item.range}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-muted-foreground">{item.count} leads</span>
                    <div className="w-16 bg-muted rounded-full h-2">
                      <div 
                        className={`h-2 rounded-full ${item.color}`}
                        style={{ width: `${(item.count / scoringMetrics.totalLeads) * 100}%` }}
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Top Leads por Score */}
        <Card>
          <CardHeader>
            <CardTitle>Top Leads por Score</CardTitle>
            <CardDescription>Leads com maior pontuação</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {topLeads.map((lead) => (
                <div key={lead.id} className="p-3 border rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <span className="font-medium">{lead.company}</span>
                      {getTrendIcon(lead.trend)}
                    </div>
                    {getTemperatureBadge(lead.temperature)}
                  </div>
                  
                  <div className="grid grid-cols-3 gap-2 text-xs">
                    <div>
                      <span className="text-muted-foreground">Comportamental:</span>
                      <div className="font-medium">{lead.score.behavioral}</div>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Perfil:</span>
                      <div className="font-medium">{lead.score.profile}</div>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Temporal:</span>
                      <div className="font-medium">{lead.score.temporal}</div>
                    </div>
                  </div>
                  
                  <div className="mt-2">
                    <div className="flex items-center justify-between text-sm">
                      <span>Score Total:</span>
                      <span className="font-bold">{lead.score.total}</span>
                    </div>
                    <Progress value={lead.score.total} className="mt-1" />
                  </div>
                </div>
              ))}
            </div>
            
            <Button variant="outline" className="w-full mt-4">
              Ver Todos os Leads
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Configurações de Scoring */}
      <Card>
        <CardHeader>
          <CardTitle>Configurações de Scoring</CardTitle>
          <CardDescription>Pesos e gatilhos para classificação automática</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Peso Comportamental</label>
              <div className="flex items-center gap-2">
                <Progress value={35} className="flex-1" />
                <span className="text-sm">35%</span>
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Peso Perfil</label>
              <div className="flex items-center gap-2">
                <Progress value={40} className="flex-1" />
                <span className="text-sm">40%</span>
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Peso Temporal</label>
              <div className="flex items-center gap-2">
                <Progress value={25} className="flex-1" />
                <span className="text-sm">25%</span>
              </div>
            </div>
          </div>
          
          <div className="mt-4 pt-4 border-t">
            <Button variant="outline">
              Configurar Gatilhos de Elevação
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default LeadScoringDashboard;
