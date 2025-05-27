
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { MessageSquare, Send, Eye, Users } from 'lucide-react';

const CampaignsDashboard: React.FC = () => {
  const campaigns = [
    { name: 'Outreach Q1', type: 'multicanal', status: 'active', sent: 245, opened: 89, responded: 23 },
    { name: 'LinkedIn Connect', type: 'linkedin', status: 'active', sent: 156, opened: 78, responded: 15 },
    { name: 'Email Follow-up', type: 'email', status: 'paused', sent: 89, opened: 34, responded: 8 }
  ];

  const getStatusBadge = (status: string) => {
    const colors = {
      active: 'bg-green-100 text-green-800',
      paused: 'bg-orange-100 text-orange-800',
      completed: 'bg-blue-100 text-blue-800'
    };
    return <Badge className={colors[status as keyof typeof colors]}>{status.toUpperCase()}</Badge>;
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <MessageSquare className="h-5 w-5" />
          Campanhas Multicanal
        </CardTitle>
        <CardDescription>Performance das campanhas ativas</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {campaigns.map((campaign, index) => (
            <div key={index} className="p-3 border rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <span className="font-medium text-sm">{campaign.name}</span>
                {getStatusBadge(campaign.status)}
              </div>
              <div className="grid grid-cols-3 gap-2 text-xs">
                <div className="text-center">
                  <Send className="h-3 w-3 mx-auto mb-1" />
                  <div>{campaign.sent}</div>
                  <div className="text-muted-foreground">Enviados</div>
                </div>
                <div className="text-center">
                  <Eye className="h-3 w-3 mx-auto mb-1" />
                  <div>{campaign.opened}</div>
                  <div className="text-muted-foreground">Abertos</div>
                </div>
                <div className="text-center">
                  <MessageSquare className="h-3 w-3 mx-auto mb-1" />
                  <div>{campaign.responded}</div>
                  <div className="text-muted-foreground">Respostas</div>
                </div>
              </div>
            </div>
          ))}
        </div>
        <Button className="w-full mt-4" variant="outline">
          Gerenciar Campanhas
        </Button>
      </CardContent>
    </Card>
  );
};

export default CampaignsDashboard;
