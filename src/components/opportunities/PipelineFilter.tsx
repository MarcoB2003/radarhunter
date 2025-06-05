import React from 'react';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Calendar } from 'lucide-react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

interface PipelineFilterProps {
  onFilterChange: (filter: string) => void;
  currentFilter: string;
}

const PipelineFilter: React.FC<PipelineFilterProps> = ({ onFilterChange, currentFilter }) => {
  const filters = [
    { value: 'all', label: 'Todos os Períodos' },
    { value: 'month', label: 'Este Mês' },
    { value: 'quarter', label: 'Este Trimestre' },
    { value: 'year', label: 'Este Ano' }
  ];

  return (
    <div className="flex items-center gap-2">
      <Select
        value={currentFilter}
        onValueChange={onFilterChange}
      >
        <SelectTrigger className="w-[180px]">
          <SelectValue placeholder="Filtrar por período" />
        </SelectTrigger>
        <SelectContent>
          {filters.map((filter) => (
            <SelectItem key={filter.value} value={filter.value}>
              {filter.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      <Button variant="outline" size="sm">
        <Calendar className="h-4 w-4 mr-2" />
        {format(new Date(), 'MMMM yyyy', { locale: ptBR })}
      </Button>
    </div>
  );
};

export default PipelineFilter;
