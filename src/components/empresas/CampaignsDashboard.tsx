import React from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  MessageSquare,
  Send,
  Eye,
  Users,
  Calendar,
  DollarSign,
  XCircle,
  RefreshCcw,
  MousePointerClick,
  Lightbulb,
  AlertCircle,
  Clock
} from 'lucide-react';

const CampaignsDashboard: React.FC = () => {
  // Função para determinar a cor baseada no valor
  const getColor = (value: number, max: number, min: number) => {
    const ratio = (value - min) / (max - min);
    if (ratio >= 0.7) return 'text-green-600';
    if (ratio >= 0.3) return 'text-yellow-600';
    return 'text-red-600';
  };

  const campaignStats = {
    reached: 150,
    openRate: 24,
    clickRate: 8,
    responseRate: 12,
    meetings: 18,
    sales: 5,
    optOuts: 3,
    reengaged: 8
  };

  const funnel = [
    { label: 'Leads Importados', value: 150 },
    { label: 'E-mails Abertos', value: 36 },
    { label: 'Links Clicados', value: 12 },
    { label: 'Respostas Recebidas', value: 18 },
    { label: 'Reuniões Agendadas', value: 18 }
  ];

  const suggestions = [
    {
      text: 'Taxa de abertura baixa (12%). Sugira assunto mais direto.',
      action: 'Aplicar sugestão',
      type: 'improvement',
      icon: <Lightbulb className="h-4 w-4 text-yellow-500" />
    },
    {
      text: 'Alto número de opt-out após toque 2. Reduza WhatsApp.',
      action: 'Editar campanha',
      type: 'adjustment',
      icon: <AlertCircle className="h-4 w-4 text-red-500" />
    },
    {
      text: 'Lead clicou no vídeo, mas não respondeu. Envie CTA direto.',
      action: 'Reengajar',
      type: 'followup',
      icon: <Clock className="h-4 w-4 text-blue-500" />
    }
  ];

  return (
    <div className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8">
      {/* Seção de Métricas Principais */}
      <Card className="bg-white/50">
        <CardHeader>
          <CardTitle className="text-xl font-semibold">Visão Geral das Campanhas</CardTitle>
          <CardDescription className="text-xs">Análise e resultados da campanha</CardDescription>
        </CardHeader>
        <CardContent className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {Object.entries(campaignStats).map(([key, value]) => (
            <div key={key} className="p-3 bg-white/10 rounded-lg">
              <div className="flex items-center justify-center mb-1.5">
                <div className="w-6 h-6 rounded-full p-0.5 bg-white/20">
                  {key === 'reached' && <Users className="h-4 w-4 text-blue-500" />}
                  {key === 'openRate' && <Eye className="h-4 w-4 text-green-500" />}
                  {key === 'clickRate' && <MousePointerClick className="h-4 w-4 text-purple-500" />}
                  {key === 'responseRate' && <MessageSquare className="h-4 w-4 text-orange-500" />}
                  {key === 'meetings' && <Calendar className="h-4 w-4 text-teal-500" />}
                  {key === 'sales' && <DollarSign className="h-4 w-4 text-emerald-500" />}
                  {key === 'optOuts' && <XCircle className="h-4 w-4 text-red-500" />}
                  {key === 'reengaged' && <RefreshCcw className="h-4 w-4 text-cyan-500" />}
                </div>
              </div>
              <div className="text-lg font-semibold text-center">{value}</div>
              <div className="text-xs text-muted-foreground text-center">
                {key === 'reached' && 'Leads Atingidos'}
                {key === 'openRate' && 'Taxa de Abertura'}
                {key === 'clickRate' && 'Cliques'}
                {key === 'responseRate' && 'Respostas'}
                {key === 'meetings' && 'Reuniões'}
                {key === 'sales' && 'Vendas'}
                {key === 'optOuts' && 'Opt-outs'}
                {key === 'reengaged' && 'Reengajados'}
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Seção de Recomendações */}
      <Card className="bg-white/50 mt-6">
        <CardHeader>
          <CardTitle className="text-xl font-semibold">Recomendações da IA</CardTitle>
          <CardDescription className="text-xs">A IA monitora sua campanha e sugere melhorias baseadas nos dados</CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          {suggestions.map((s, i) => (
            <div key={i} className="flex items-center justify-between bg-white/10 p-3 rounded-lg">
              <div className="flex items-center gap-2.5">
                <div className="w-5 h-5 rounded-full p-0.5 bg-white/20">
                  {s.icon}
                </div>
                <div>
                  <span className="text-sm font-medium">{s.text}</span>
                  <div className="mt-0.5 text-xs text-muted-foreground">
                    {s.type === 'improvement' && (
                      <span className="text-yellow-500">Sugestão de melhoria</span>
                    )}
                    {s.type === 'adjustment' && (
                      <span className="text-red-500">Ajuste necessário</span>
                    )}
                    {s.type === 'followup' && (
                      <span className="text-blue-500">Oportunidade de follow-up</span>
                    )}
                  </div>
                </div>
              </div>
              <div className="flex gap-1.5">
                <Button
                  size="sm"
                  variant="outline"
                  className="bg-white/20 hover:bg-white/30 px-2.5 py-1.5 text-xs"
                >
                  {s.action}
                </Button>
                <Button
                  size="sm"
                  variant="ghost"
                  className="bg-white/20 hover:bg-white/30 px-2.5 py-1.5 text-xs"
                >
                  Ignorar
                </Button>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Seção do Funil */}
      <Card className="bg-white/50 mt-6">
        <CardHeader>
          <CardTitle className="text-xl font-semibold">Funil de Conversão</CardTitle>
          <CardDescription className="text-xs">Acompanhe a jornada dos seus leads</CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          {funnel.map((step, i) => (
            <div key={i} className="bg-white/10 p-3 rounded-lg">
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium">{step.label}</span>
                <div className="flex items-center gap-1.5">
                  <span className="text-sm font-medium">{step.value} leads</span>
                  <span className="text-xs text-muted-foreground">
                    ({((step.value / funnel[0].value) * 100).toFixed(1)}%)
                  </span>
                </div>
              </div>
              <div className="w-full h-2 bg-gray-200 rounded-full mt-1.5">
                <div
                  className="h-2 rounded-full bg-blue-600"
                  style={{ 
                    width: `${(step.value / funnel[0].value) * 100}%`
                  }}
                ></div>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
};

export default CampaignsDashboard;
