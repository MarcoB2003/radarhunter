
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Target, 
  MessageSquare, 
  Calendar,
  User,
  Send,
  Clock,
  CheckCircle
} from 'lucide-react';

const AISdrDashboard: React.FC = () => {
  const sdrMetrics = {
    leadsPriorizados: 42,
    mensagensEnviadas: 127,
    respostasRecebidas: 23,
    followUpsAgendados: 15,
    taxaResposta: 18.1
  };

  const prioritizedLeads = [
    {
      id: '1',
      company: 'TechFlow Solutions',
      contact: 'Maria Silva',
      role: 'CTO',
      priority: 'critical',
      reason: 'Tecnologia compatível + mudança de cargo recente',
      lastActivity: '2 horas',
      nextAction: 'Enviar mensagem personalizada'
    },
    {
      id: '2',
      company: 'DataCorp Analytics',
      contact: 'João Santos',
      role: 'CEO',
      priority: 'high',
      reason: 'Crescimento da empresa + orçamento aprovado',
      lastActivity: '1 dia',
      nextAction: 'Follow-up da proposta'
    },
    {
      id: '3',
      company: 'CloudTech Innovations',
      contact: 'Ana Costa',
      role: 'Diretora de TI',
      priority: 'medium',
      reason: 'Perfil ideal + timing adequado',
      lastActivity: '3 dias',
      nextAction: 'Primeira abordagem'
    }
  ];

  const generatedMessages = [
    {
      id: '1',
      contact: 'Maria Silva - TechFlow',
      template: 'Personalizada por mudança de cargo',
      subject: 'Parabéns pela nova posição de CTO!',
      performance: { sent: 1, opened: 1, responded: 0 },
      status: 'sent'
    },
    {
      id: '2',
      contact: 'João Santos - DataCorp',
      template: 'Follow-up técnico',
      subject: 'Resultados da análise de ROI que discutimos',
      performance: { sent: 1, opened: 1, responded: 1 },
      status: 'responded'
    }
  ];

  const getPriorityBadge = (priority: string) => {
    const colors = {
      critical: 'bg-red-100 text-red-800',
      high: 'bg-orange-100 text-orange-800',
      medium: 'bg-yellow-100 text-yellow-800',
      low: 'bg-green-100 text-green-800'
    };
    return <Badge className={colors[priority as keyof typeof colors]}>{priority.toUpperCase()}</Badge>;
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'sent': return <Send className="h-4 w-4 text-blue-600" />;
      case 'responded': return <CheckCircle className="h-4 w-4 text-green-600" />;
      default: return <Clock className="h-4 w-4 text-gray-600" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Métricas da IA SDR */}
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              <Target className="h-4 w-4" />
              Leads Priorizados
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{sdrMetrics.leadsPriorizados}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              <MessageSquare className="h-4 w-4" />
              Mensagens Enviadas
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{sdrMetrics.mensagensEnviadas}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              <Send className="h-4 w-4" />
              Respostas
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{sdrMetrics.respostasRecebidas}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              Follow-ups
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{sdrMetrics.followUpsAgendados}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Taxa de Resposta
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">{sdrMetrics.taxaResposta}%</div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Leads Priorizados */}
        <Card>
          <CardHeader>
            <CardTitle>Leads Priorizados pela IA</CardTitle>
            <CardDescription>Leads com maior probabilidade de conversão</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {prioritizedLeads.map((lead) => (
                <div key={lead.id} className="p-3 border rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <div>
                      <div className="font-medium">{lead.company}</div>
                      <div className="text-sm text-muted-foreground flex items-center gap-1">
                        <User className="h-3 w-3" />
                        {lead.contact} - {lead.role}
                      </div>
                    </div>
                    {getPriorityBadge(lead.priority)}
                  </div>
                  
                  <div className="text-xs text-muted-foreground mb-2">
                    <strong>Razão:</strong> {lead.reason}
                  </div>
                  
                  <div className="flex items-center justify-between text-xs">
                    <span>Última atividade: {lead.lastActivity}</span>
                    <span className="font-medium text-blue-600">{lead.nextAction}</span>
                  </div>
                </div>
              ))}
            </div>
            
            <Button variant="outline" className="w-full mt-4">
              Ver Todos os Leads Priorizados
            </Button>
          </CardContent>
        </Card>

        {/* Mensagens Geradas */}
        <Card>
          <CardHeader>
            <CardTitle>Mensagens Geradas pela IA</CardTitle>
            <CardDescription>Últimas mensagens personalizadas</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {generatedMessages.map((message) => (
                <div key={message.id} className="p-3 border rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <div>
                      <div className="font-medium text-sm">{message.contact}</div>
                      <div className="text-xs text-muted-foreground">{message.template}</div>
                    </div>
                    {getStatusIcon(message.status)}
                  </div>
                  
                  <div className="text-sm mb-2">
                    <strong>Assunto:</strong> {message.subject}
                  </div>
                  
                  <div className="flex items-center justify-between text-xs text-muted-foreground">
                    <span>Enviado: {message.performance.sent}</span>
                    <span>Aberto: {message.performance.opened}</span>
                    <span>Respondido: {message.performance.responded}</span>
                  </div>
                </div>
              ))}
            </div>
            
            <Button variant="outline" className="w-full mt-4">
              Ver Histórico Completo
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Configurações da IA SDR */}
      <Card>
        <CardHeader>
          <CardTitle>Configurações da IA SDR</CardTitle>
          <CardDescription>Critérios de priorização e personalização</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Button variant="outline">
              Critérios de Priorização
            </Button>
            <Button variant="outline">
              Templates de Mensagem
            </Button>
            <Button variant="outline">
              Sequências de Follow-up
            </Button>
            <Button variant="outline">
              Horários de Envio
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AISdrDashboard;
