
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  Zap, 
  FileText, 
  AlertTriangle,
  Clock,
  TrendingUp,
  CheckCircle,
  XCircle
} from 'lucide-react';

const AICloserDashboard: React.FC = () => {
  const closerMetrics = {
    sinaisDetectados: 15,
    propostasGeradas: 8,
    objecoesToratadas: 12,
    urgenciasCriadas: 5,
    taxaFechamento: 32.5
  };

  const buyingSignals = [
    {
      id: '1',
      company: 'TechFlow Solutions',
      signal: 'Solicitou demonstração técnica',
      type: 'explicit',
      confidence: 95,
      detectedAt: '1 hora',
      opportunity: 'Implementação CRM - R$ 45.000'
    },
    {
      id: '2',
      company: 'DataCorp Analytics',
      signal: 'Visitou página de preços 5x nas últimas 24h',
      type: 'implicit',
      confidence: 78,
      detectedAt: '3 horas',
      opportunity: 'Licença Premium - R$ 18.000'
    },
    {
      id: '3',
      company: 'CloudTech Innovations',
      signal: 'Questionou sobre implementação e prazos',
      type: 'explicit',
      confidence: 88,
      detectedAt: '6 horas',
      opportunity: 'Consultoria - R$ 25.000'
    }
  ];

  const proposals = [
    {
      id: '1',
      company: 'TechFlow Solutions',
      type: 'Técnica',
      value: 45000,
      generated: '2 horas',
      status: 'sent',
      customization: 'Alta'
    },
    {
      id: '2',
      company: 'DataCorp Analytics',
      type: 'Comercial',
      value: 18000,
      generated: '1 dia',
      status: 'opened',
      customization: 'Média'
    }
  ];

  const objections = [
    {
      id: '1',
      objection: 'Preço muito alto para o orçamento atual',
      response: 'Proposta de pagamento parcelado + ROI em 6 meses',
      effectiveness: 85,
      usedCount: 3
    },
    {
      id: '2',
      objection: 'Necessita aprovação do comitê',
      response: 'Material executivo + apresentação para tomadores de decisão',
      effectiveness: 92,
      usedCount: 7
    }
  ];

  const getSignalBadge = (type: string) => {
    return type === 'explicit' 
      ? <Badge className="bg-green-100 text-green-800">Explícito</Badge>
      : <Badge className="bg-blue-100 text-blue-800">Implícito</Badge>;
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'sent': return <FileText className="h-4 w-4 text-blue-600" />;
      case 'opened': return <CheckCircle className="h-4 w-4 text-green-600" />;
      case 'rejected': return <XCircle className="h-4 w-4 text-red-600" />;
      default: return <Clock className="h-4 w-4 text-gray-600" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Métricas da IA Closer */}
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              <Zap className="h-4 w-4" />
              Sinais Detectados
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{closerMetrics.sinaisDetectados}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              <FileText className="h-4 w-4" />
              Propostas Geradas
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{closerMetrics.propostasGeradas}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              <AlertTriangle className="h-4 w-4" />
              Objeções Tratadas
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{closerMetrics.objecoesToratadas}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              <Clock className="h-4 w-4" />
              Urgências Criadas
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{closerMetrics.urgenciasCriadas}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              <TrendingUp className="h-4 w-4" />
              Taxa Fechamento
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{closerMetrics.taxaFechamento}%</div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Sinais de Compra Detectados */}
        <Card>
          <CardHeader>
            <CardTitle>Sinais de Compra Detectados</CardTitle>
            <CardDescription>Sinais recentes identificados pela IA</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {buyingSignals.map((signal) => (
                <div key={signal.id} className="p-3 border rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <div className="font-medium">{signal.company}</div>
                    {getSignalBadge(signal.type)}
                  </div>
                  
                  <div className="text-sm mb-2">{signal.signal}</div>
                  
                  <div className="flex items-center justify-between text-xs mb-2">
                    <span>Confiança: {signal.confidence}%</span>
                    <span>Detectado há: {signal.detectedAt}</span>
                  </div>
                  
                  <Progress value={signal.confidence} className="mb-2" />
                  
                  <div className="text-xs text-muted-foreground">
                    <strong>Oportunidade:</strong> {signal.opportunity}
                  </div>
                </div>
              ))}
            </div>
            
            <Button variant="outline" className="w-full mt-4">
              Ver Todos os Sinais
            </Button>
          </CardContent>
        </Card>

        {/* Propostas Geradas */}
        <Card>
          <CardHeader>
            <CardTitle>Propostas Geradas</CardTitle>
            <CardDescription>Propostas criadas automaticamente pela IA</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {proposals.map((proposal) => (
                <div key={proposal.id} className="p-3 border rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <div>
                      <div className="font-medium">{proposal.company}</div>
                      <div className="text-sm text-muted-foreground">Proposta {proposal.type}</div>
                    </div>
                    {getStatusIcon(proposal.status)}
                  </div>
                  
                  <div className="flex items-center justify-between text-sm mb-2">
                    <span className="font-medium">R$ {proposal.value.toLocaleString()}</span>
                    <span>Gerada há: {proposal.generated}</span>
                  </div>
                  
                  <div className="text-xs text-muted-foreground">
                    Personalização: {proposal.customization}
                  </div>
                </div>
              ))}
            </div>
            
            <Button variant="outline" className="w-full mt-4">
              Ver Todas as Propostas
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Sistema de Tratamento de Objeções */}
      <Card>
        <CardHeader>
          <CardTitle>Sistema de Tratamento de Objeções</CardTitle>
          <CardDescription>Respostas estruturadas mais eficazes</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {objections.map((objection) => (
              <div key={objection.id} className="p-3 border rounded-lg">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                  <div>
                    <div className="text-sm font-medium text-red-600 mb-1">Objeção:</div>
                    <div className="text-sm">{objection.objection}</div>
                  </div>
                  
                  <div>
                    <div className="text-sm font-medium text-green-600 mb-1">Resposta:</div>
                    <div className="text-sm">{objection.response}</div>
                  </div>
                  
                  <div>
                    <div className="text-sm font-medium mb-1">Performance:</div>
                    <div className="flex items-center gap-2 text-sm">
                      <span>Eficácia: {objection.effectiveness}%</span>
                      <span>Usado: {objection.usedCount}x</span>
                    </div>
                    <Progress value={objection.effectiveness} className="mt-1" />
                  </div>
                </div>
              </div>
            ))}
          </div>
          
          <Button variant="outline" className="mt-4">
            Gerenciar Biblioteca de Objeções
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default AICloserDashboard;
