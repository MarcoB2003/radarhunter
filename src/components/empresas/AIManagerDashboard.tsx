
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  Settings, 
  AlertCircle, 
  TrendingUp,
  Clock,
  Zap,
  Shield
} from 'lucide-react';

const AIManagerDashboard: React.FC = () => {
  const alerts = [
    { id: '1', level: 'critical', title: 'Taxa de resposta baixa', message: 'Campanha LinkedIn com 5% de resposta', action: true },
    { id: '2', level: 'warning', title: 'Lead sem atividade', message: 'TechCorp sem contato há 7 dias', action: true },
    { id: '3', level: 'info', title: 'Otimização sugerida', message: 'Melhor horário: 14h-16h', action: false }
  ];

  const optimizations = [
    { type: 'timing', description: 'Horários de envio ajustados para 14h-16h', impact: 23, implemented: true },
    { type: 'messaging', description: 'Template de follow-up otimizado', impact: 15, implemented: true },
    { type: 'segmentation', description: 'Nova segmentação por tamanho da empresa', impact: 31, implemented: false }
  ];

  const getAlertBadge = (level: string) => {
    const colors = {
      critical: 'bg-red-100 text-red-800',
      warning: 'bg-orange-100 text-orange-800',
      info: 'bg-blue-100 text-blue-800'
    };
    return <Badge className={colors[level as keyof typeof colors]}>{level.toUpperCase()}</Badge>;
  };

  return (
    <div className="space-y-6">
      {/* Controles de Autonomia */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Settings className="h-5 w-5" />
            Modo de Autonomia da IA
          </CardTitle>
          <CardDescription>Configure o nível de automação do sistema</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center p-4 border rounded-lg">
              <Shield className="h-8 w-8 mx-auto mb-2 text-blue-600" />
              <h3 className="font-medium mb-1">Conservador</h3>
              <p className="text-xs text-muted-foreground">Aprovação manual para ações importantes</p>
            </div>
            <div className="text-center p-4 border-2 border-blue-500 rounded-lg bg-blue-50">
              <Settings className="h-8 w-8 mx-auto mb-2 text-blue-600" />
              <h3 className="font-medium mb-1">Balanceado</h3>
              <p className="text-xs text-muted-foreground">Automação com alertas de supervisão</p>
            </div>
            <div className="text-center p-4 border rounded-lg">
              <Zap className="h-8 w-8 mx-auto mb-2 text-orange-600" />
              <h3 className="font-medium mb-1">Agressivo</h3>
              <p className="text-xs text-muted-foreground">Máxima automação e otimização</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Alertas Inteligentes */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertCircle className="h-5 w-5" />
              Alertas Inteligentes
            </CardTitle>
            <CardDescription>Notificações baseadas em IA</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {alerts.map((alert) => (
                <div key={alert.id} className="p-3 border rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-medium text-sm">{alert.title}</span>
                    {getAlertBadge(alert.level)}
                  </div>
                  <p className="text-xs text-muted-foreground mb-2">{alert.message}</p>
                  {alert.action && (
                    <Button size="sm" variant="outline">Tomar Ação</Button>
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Otimizações Automáticas */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5" />
              Otimizações Automáticas
            </CardTitle>
            <CardDescription>Melhorias aplicadas pela IA</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {optimizations.map((opt, index) => (
                <div key={index} className="p-3 border rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-medium text-sm">{opt.type}</span>
                    <Badge className={opt.implemented ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}>
                      {opt.implemented ? 'Aplicada' : 'Sugerida'}
                    </Badge>
                  </div>
                  <p className="text-xs text-muted-foreground mb-2">{opt.description}</p>
                  <div className="text-xs">
                    <span className="text-green-600 font-medium">+{opt.impact}% de melhoria</span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Métricas em Tempo Real */}
      <Card>
        <CardHeader>
          <CardTitle>Métricas em Tempo Real</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="text-center p-4 bg-muted rounded-lg">
              <div className="text-2xl font-bold">98.5%</div>
              <div className="text-xs text-muted-foreground">Uptime IA</div>
            </div>
            <div className="text-center p-4 bg-muted rounded-lg">
              <div className="text-2xl font-bold">127</div>
              <div className="text-xs text-muted-foreground">Ações/hora</div>
            </div>
            <div className="text-center p-4 bg-muted rounded-lg">
              <div className="text-2xl font-bold">R$ 45k</div>
              <div className="text-xs text-muted-foreground">Pipeline gerado</div>
            </div>
            <div className="text-center p-4 bg-muted rounded-lg">
              <div className="text-2xl font-bold">23%</div>
              <div className="text-xs text-muted-foreground">Eficiência ganho</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AIManagerDashboard;
