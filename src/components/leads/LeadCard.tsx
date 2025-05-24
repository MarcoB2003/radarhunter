
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Lead } from '../../types';
import { Building2, MoreHorizontal, Phone, User } from 'lucide-react';
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu';
import { useNavigate } from 'react-router-dom';

interface LeadCardProps {
  lead: Lead;
}

const LeadCard: React.FC<LeadCardProps> = ({ lead }) => {
  const navigate = useNavigate();
  
  const getTemperatureClass = (temp: 'hot' | 'warm' | 'cold'): string => {
    switch (temp) {
      case 'hot': return 'bg-radar-red-500/10 text-radar-red-600';
      case 'warm': return 'bg-radar-yellow-400/10 text-radar-yellow-500';
      case 'cold': return 'bg-radar-400/10 text-radar-700';
      default: return '';
    }
  };
  
  const getTemperatureLabel = (temp: 'hot' | 'warm' | 'cold'): string => {
    switch (temp) {
      case 'hot': return 'Hot';
      case 'warm': return 'Warm';
      case 'cold': return 'Cold';
      default: return '';
    }
  };
  
  return (
    <Card className="overflow-hidden hover:shadow transition-shadow">
      <CardContent className="p-0">
        <div className="p-4">
          <div className="flex items-start justify-between">
            <div>
              <h3 className="font-medium text-lg truncate max-w-[200px]">{lead.companyName}</h3>
              <div className="flex items-center text-sm text-muted-foreground">
                <Building2 className="h-3 w-3 mr-1" />
                {lead.segment}
              </div>
            </div>
            
            <div className="flex items-center space-x-2">
              <div className={`px-2 py-1 rounded-full text-xs ${getTemperatureClass(lead.temperature)}`}>
                {getTemperatureLabel(lead.temperature)}
              </div>
              
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon">
                    <MoreHorizontal className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuLabel>Ações</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => navigate(`/leads/${lead.id}`)}>
                    Ver detalhes
                  </DropdownMenuItem>
                  <DropdownMenuItem>Qualificar lead</DropdownMenuItem>
                  <DropdownMenuItem>Enviar para pipeline</DropdownMenuItem>
                  <DropdownMenuItem>Atribuir a agente</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
          
          <div className="mt-4 space-y-2">
            {lead.contacts && lead.contacts.length > 0 ? (
              <div className="flex items-center text-sm">
                <User className="h-3.5 w-3.5 mr-1.5 text-muted-foreground" />
                <span className="font-medium">
                  {lead.contacts[0].name}
                  {lead.contacts[0].isDecisionMaker && (
                    <span className="ml-1 text-xs text-radar-green-500">(Decisor)</span>
                  )}
                </span>
              </div>
            ) : null}
            
            {lead.contacts && lead.contacts.length > 0 && lead.contacts[0].phone && (
              <div className="flex items-center text-sm">
                <Phone className="h-3.5 w-3.5 mr-1.5 text-muted-foreground" />
                {lead.contacts[0].phone}
              </div>
            )}
            
            {lead.aiRecommendation && (
              <div className="mt-3 pt-3 border-t border-border">
                <div className="text-xs font-semibold text-muted-foreground mb-1">IA Recomenda:</div>
                <div className="text-sm">{lead.aiRecommendation}</div>
              </div>
            )}
          </div>
        </div>
        
        <div className="mt-2 flex border-t border-border">
          <Button className="flex-1 rounded-none bg-background hover:bg-secondary text-foreground" variant="ghost">
            Ativar IA SDR
          </Button>
          <div className="border-r border-border h-10"></div>
          <Button 
            className="flex-1 rounded-none bg-background hover:bg-secondary text-foreground" 
            variant="ghost" 
            onClick={() => navigate(`/leads/${lead.id}`)}
          >
            Ver agora
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default LeadCard;
