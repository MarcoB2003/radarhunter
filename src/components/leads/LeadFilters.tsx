
import React, { useState } from 'react';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { X, RotateCcw } from 'lucide-react';
import DateRangePicker from './DateRangePicker';

type LeadFiltersProps = {
  isOpen: boolean;
  onClose: () => void;
  onFiltersChange: (hasFilters: boolean) => void;
};

type FilterState = {
  leadName: string;
  company: string;
  email: string;
  phone: string;
  source: string;
  dateRange: { from?: Date; to?: Date };
  status: string;
  scoreRange: number[];
};

const initialFilters: FilterState = {
  leadName: '',
  company: '',
  email: '',
  phone: '',
  source: '',
  dateRange: {},
  status: '',
  scoreRange: [0, 100],
};

const LeadFilters: React.FC<LeadFiltersProps> = ({ isOpen, onClose, onFiltersChange }) => {
  const [filters, setFilters] = useState<FilterState>(initialFilters);

  const hasActiveFilters = () => {
    return (
      filters.leadName !== '' ||
      filters.company !== '' ||
      filters.email !== '' ||
      filters.phone !== '' ||
      filters.source !== '' ||
      filters.dateRange.from !== undefined ||
      filters.dateRange.to !== undefined ||
      filters.status !== '' ||
      filters.scoreRange[0] !== 0 ||
      filters.scoreRange[1] !== 100
    );
  };

  const handleFilterChange = (field: keyof FilterState, value: any) => {
    const newFilters = { ...filters, [field]: value };
    setFilters(newFilters);
  };

  const handleApplyFilters = () => {
    console.log('Aplicando filtros:', filters);
    onFiltersChange(hasActiveFilters());
    onClose();
  };

  const handleClearFilters = () => {
    setFilters(initialFilters);
    onFiltersChange(false);
  };

  return (
    <Sheet open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <SheetContent side="right" className="w-[400px] sm:w-[540px]">
        <SheetHeader className="space-y-4">
          <div className="flex items-center justify-between">
            <SheetTitle>Filtros Avançados</SheetTitle>
            <Button variant="ghost" size="icon" onClick={onClose}>
              <X className="h-4 w-4" />
            </Button>
          </div>
        </SheetHeader>

        <div className="space-y-6 py-6">
          {/* Nome do Lead */}
          <div className="space-y-2">
            <Label htmlFor="leadName">Nome do Lead</Label>
            <Input
              id="leadName"
              placeholder="Digite o nome do lead"
              value={filters.leadName}
              onChange={(e) => handleFilterChange('leadName', e.target.value)}
            />
          </div>

          {/* Empresa */}
          <div className="space-y-2">
            <Label htmlFor="company">Empresa</Label>
            <Input
              id="company"
              placeholder="Digite o nome da empresa"
              value={filters.company}
              onChange={(e) => handleFilterChange('company', e.target.value)}
            />
          </div>

          {/* E-mail */}
          <div className="space-y-2">
            <Label htmlFor="email">E-mail</Label>
            <Input
              id="email"
              placeholder="Digite o e-mail"
              value={filters.email}
              onChange={(e) => handleFilterChange('email', e.target.value)}
            />
          </div>

          {/* Telefone */}
          <div className="space-y-2">
            <Label htmlFor="phone">Telefone</Label>
            <Input
              id="phone"
              placeholder="Digite o telefone"
              value={filters.phone}
              onChange={(e) => handleFilterChange('phone', e.target.value)}
            />
          </div>

          {/* Origem do Lead */}
          <div className="space-y-2">
            <Label>Origem do Lead</Label>
            <Select value={filters.source} onValueChange={(value) => handleFilterChange('source', value)}>
              <SelectTrigger>
                <SelectValue placeholder="Selecione a origem" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="formulario">Formulário</SelectItem>
                <SelectItem value="importacao">Importação</SelectItem>
                <SelectItem value="sdr">SDR</SelectItem>
                <SelectItem value="ia">IA</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Data de Criação */}
          <div className="space-y-2">
            <Label>Data de Criação</Label>
            <DateRangePicker
              dateRange={filters.dateRange}
              onDateRangeChange={(range) => handleFilterChange('dateRange', range)}
            />
          </div>

          {/* Status */}
          <div className="space-y-2">
            <Label>Status</Label>
            <Select value={filters.status} onValueChange={(value) => handleFilterChange('status', value)}>
              <SelectTrigger>
                <SelectValue placeholder="Selecione o status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="novo">Novo</SelectItem>
                <SelectItem value="em_negociacao">Em Negociação</SelectItem>
                <SelectItem value="convertido">Convertido</SelectItem>
                <SelectItem value="perdido">Perdido</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Score IA */}
          <div className="space-y-4">
            <Label>Score IA</Label>
            <div className="px-2">
              <Slider
                value={filters.scoreRange}
                onValueChange={(value) => handleFilterChange('scoreRange', value)}
                max={100}
                min={0}
                step={1}
                className="w-full"
              />
              <div className="flex justify-between text-sm text-muted-foreground mt-2">
                <span>{filters.scoreRange[0]}</span>
                <span>{filters.scoreRange[1]}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-3 pt-6 border-t">
          <Button
            variant="outline"
            className="flex-1"
            onClick={handleClearFilters}
          >
            <RotateCcw className="h-4 w-4 mr-2" />
            Limpar Filtros
          </Button>
          <Button
            className="flex-1"
            onClick={handleApplyFilters}
          >
            Aplicar Filtros
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default LeadFilters;
