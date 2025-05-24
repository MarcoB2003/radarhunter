
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { SearchX, RotateCcw } from 'lucide-react';

type NoLeadsFoundProps = {
  hasFilters: boolean;
  onClearFilters: () => void;
};

const NoLeadsFound: React.FC<NoLeadsFoundProps> = ({ hasFilters, onClearFilters }) => {
  if (hasFilters) {
    return (
      <Card className="border-dashed">
        <CardContent className="p-6 flex flex-col items-center justify-center text-center">
          <div className="p-3 bg-muted rounded-full mb-3">
            <SearchX className="h-8 w-8 text-muted-foreground" />
          </div>
          <h3 className="font-medium text-lg mb-1">Nenhum lead corresponde aos filtros aplicados</h3>
          <p className="text-muted-foreground mb-4">
            Tente ajustar os critérios de filtro ou limpe os filtros para ver todos os leads.
          </p>
          <Button variant="outline" onClick={onClearFilters}>
            <RotateCcw className="h-4 w-4 mr-2" />
            Limpar Filtros
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border-dashed">
      <CardContent className="p-6 flex flex-col items-center justify-center text-center">
        <div className="p-3 bg-muted rounded-full mb-3">
          <SearchX className="h-8 w-8 text-muted-foreground" />
        </div>
        <h3 className="font-medium text-lg mb-1">Nenhum lead encontrado</h3>
        <p className="text-muted-foreground mb-4">
          Importe novos leads ou adicione manualmente para começar.
        </p>
        <div className="flex gap-2">
          <Button>Importar Leads</Button>
          <Button variant="outline">Adicionar Lead</Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default NoLeadsFound;
