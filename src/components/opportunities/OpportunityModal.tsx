
import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Opportunity, PipelineStage } from '@/types';
import { CalendarIcon } from 'lucide-react';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { cn } from '@/lib/utils';
import { useForm } from 'react-hook-form';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Slider } from '@/components/ui/slider';

interface OpportunityModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (opportunity: Partial<Opportunity>) => void;
  opportunity?: Opportunity;
  stages: PipelineStage[];
  initialStageId?: string;
}

const OpportunityModal: React.FC<OpportunityModalProps> = ({
  isOpen,
  onClose,
  onSave,
  opportunity,
  stages,
  initialStageId
}) => {
  const isEditing = !!opportunity;
  const { register, handleSubmit, formState: { errors, isDirty }, setValue, watch } = useForm({
    defaultValues: {
      title: opportunity?.title || '',
      value: opportunity?.value || 0,
      stageId: opportunity?.stageId || initialStageId || stages[0]?.id || '',
      closingProbability: opportunity?.closingProbability || 50,
      expectedCloseDate: opportunity?.expectedCloseDate ? new Date(opportunity.expectedCloseDate) : undefined,
      notes: opportunity?.notes || '',
      assignedTo: opportunity?.assignedTo || '',
    }
  });

  const closeDate = watch('expectedCloseDate');
  const probability = watch('closingProbability');

  const onSubmit = (data: any) => {
    const opportunityData = {
      ...data,
      id: opportunity?.id,
      expectedCloseDate: data.expectedCloseDate ? data.expectedCloseDate.toISOString() : undefined,
    };

    onSave(opportunityData);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[525px]">
        <DialogHeader>
          <DialogTitle>{isEditing ? 'Editar Oportunidade' : 'Nova Oportunidade'}</DialogTitle>
          <DialogDescription>
            {isEditing 
              ? 'Atualize os detalhes desta oportunidade de venda.' 
              : 'Preencha os detalhes para criar uma nova oportunidade de venda.'}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="title">Título</Label>
              <Input
                id="title"
                placeholder="Descreva a oportunidade"
                {...register('title', { required: 'Título é obrigatório' })}
              />
              {errors.title && (
                <p className="text-xs text-destructive">{errors.title.message as string}</p>
              )}
            </div>

            <div className="grid gap-2">
              <Label htmlFor="value">Valor (R$)</Label>
              <Input
                id="value"
                type="number"
                placeholder="0.00"
                {...register('value', { 
                  required: 'Valor é obrigatório',
                  min: { value: 0, message: 'Valor não pode ser negativo' } 
                })}
              />
              {errors.value && (
                <p className="text-xs text-destructive">{errors.value.message as string}</p>
              )}
            </div>

            <div className="grid gap-2">
              <Label htmlFor="stage">Estágio</Label>
              <Select
                defaultValue={opportunity?.stageId || initialStageId || stages[0]?.id}
                onValueChange={(value) => setValue('stageId', value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecione um estágio" />
                </SelectTrigger>
                <SelectContent>
                  {stages.map((stage) => (
                    <SelectItem key={stage.id} value={stage.id}>
                      {stage.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="grid gap-2">
              <div className="flex justify-between">
                <Label htmlFor="closingProbability">Probabilidade de Fechamento: {probability}%</Label>
              </div>
              <Slider
                defaultValue={[opportunity?.closingProbability || 50]}
                max={100}
                step={5}
                onValueChange={(values) => setValue('closingProbability', values[0])}
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="expectedCloseDate">Data Prevista de Fechamento</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    id="date"
                    variant={"outline"}
                    className={cn(
                      "w-full justify-start text-left font-normal",
                      !closeDate && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {closeDate ? (
                      format(closeDate, "PPP", { locale: ptBR })
                    ) : (
                      <span>Selecionar data</span>
                    )}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={closeDate}
                    onSelect={(date) => setValue('expectedCloseDate', date)}
                    initialFocus
                    locale={ptBR}
                  />
                </PopoverContent>
              </Popover>
            </div>

            <div className="grid gap-2">
              <Label htmlFor="assignedTo">Responsável</Label>
              <Input
                id="assignedTo"
                placeholder="Nome do responsável"
                {...register('assignedTo')}
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="notes">Observações</Label>
              <Input
                id="notes"
                placeholder="Detalhes adicionais"
                {...register('notes')}
              />
            </div>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose}>
              Cancelar
            </Button>
            <Button type="submit" disabled={!isDirty}>
              {isEditing ? 'Atualizar' : 'Criar'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default OpportunityModal;
