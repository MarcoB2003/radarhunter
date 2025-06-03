import React, { useState } from 'react';
import MainLayout from '../../components/layout/MainLayout';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Users, Search, Filter } from 'lucide-react';
import LeadFilters from '../../components/leads/LeadFilters';
import { useNavigate } from 'react-router-dom';

const LeadsPage: React.FC = () => {
  const [isFiltersOpen, setIsFiltersOpen] = useState(false);
  const [hasActiveFilters, setHasActiveFilters] = useState(false);
  const navigate = useNavigate();

  const handleFiltersChange = (hasFilters: boolean) => {
    setHasActiveFilters(hasFilters);
  };

  return (
    <MainLayout title="Leads">
      <div className="space-y-6">
        {/* Search and Actions Bar */}
        <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
          <div className="relative w-full sm:w-auto flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input 
              placeholder="Buscar leads..."
              className="pl-9"
            />
          </div>
          
          <div className="flex flex-wrap gap-2 w-full sm:w-auto justify-end">
            <Button 
              variant={hasActiveFilters ? "default" : "outline"}
              size="sm"
              onClick={() => setIsFiltersOpen(true)}
            >
              <Filter className="h-4 w-4 mr-2" />
              Filtros
              {hasActiveFilters && (
                <span className="ml-1 bg-background text-foreground rounded-full w-2 h-2"></span>
              )}
            </Button>
          </div>
        </div>
        
        {/* Empty State */}
        <Card className="border-dashed">
          <CardContent className="p-6 flex flex-col items-center justify-center text-center">
            <div className="p-3 bg-muted rounded-full mb-3">
              <Users className="h-8 w-8 text-muted-foreground" />
            </div>
            <h3 className="font-medium text-lg mb-1">Nenhum lead encontrado</h3>
            <p className="text-muted-foreground mb-4">
              Importe novos leads ou adicione manualmente para começar.
            </p>
            <div className="flex gap-2">
              <Button onClick={() => navigate('/leads/importar')}>Importar Leads</Button>
            </div>
          </CardContent>
        </Card>

        {/* Lead Filters */}
        <LeadFilters 
          isOpen={isFiltersOpen}
          onClose={() => setIsFiltersOpen(false)}
          onFiltersChange={handleFiltersChange}
        />
      </div>
    </MainLayout>
  );
};

export default LeadsPage;
