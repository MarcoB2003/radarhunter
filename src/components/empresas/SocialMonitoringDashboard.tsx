
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Eye, Linkedin, MessageCircle, UserPlus } from 'lucide-react';

const SocialMonitoringDashboard: React.FC = () => {
  const socialSignals = [
    { contact: 'Maria Silva', signal: 'Mudança de cargo para CTO', platform: 'linkedin', time: '2h' },
    { contact: 'João Santos', signal: 'Publicou sobre crescimento da empresa', platform: 'linkedin', time: '5h' },
    { contact: 'Ana Costa', signal: 'Interagiu com post sobre tecnologia', platform: 'linkedin', time: '1d' }
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Eye className="h-5 w-5" />
          Monitoramento Social
        </CardTitle>
        <CardDescription>Sinais detectados nas redes sociais</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {socialSignals.map((signal, index) => (
            <div key={index} className="p-2 border rounded-lg">
              <div className="flex items-center justify-between mb-1">
                <span className="font-medium text-sm">{signal.contact}</span>
                <Badge className="bg-blue-100 text-blue-800">
                  <Linkedin className="h-3 w-3 mr-1" />
                  LinkedIn
                </Badge>
              </div>
              <div className="text-xs text-muted-foreground">{signal.signal}</div>
              <div className="text-xs text-right mt-1">há {signal.time}</div>
            </div>
          ))}
        </div>
        <Button className="w-full mt-4" variant="outline">
          Ver Todos os Sinais
        </Button>
      </CardContent>
    </Card>
  );
};

export default SocialMonitoringDashboard;
