import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { CalendarIcon } from "lucide-react";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { cn } from "@/lib/utils";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Opportunity, OpportunityStage, PipelineStage } from "@/types";
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
    defaultValues: opportunity || {
      title: '',
      value: 0,
      stage_id: stages[0]?.id as OpportunityStage || 'lead',
      closing_probability: 50,
      expected_close_date: '',
      notes: null,
      lead_id: null,
      contact_id: null,
      buying_signals: [],
      proposal_generated: false,
      objection_handling: [],
      urgency_factors: []
    }
  });

  const closeDateStr = watch('expected_close_date');
  const closeDate = closeDateStr ? new Date(closeDateStr) : null;
  const probability = watch('closing_probability');

  const onSubmit = (data: any) => {
    const opportunityData: Partial<Opportunity> = {
      ...data,
      id: opportunity?.id,
      expected_close_date: data.expected_close_date
        ? data.expected_close_date.toISOString()
        : undefined,
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
              <Label htmlFor="stage_id">Estágio</Label>
              <Select
                defaultValue={opportunity?.stage_id || initialStageId || stages[0]?.id}
                {...register('stage_id')}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecione um estágio" />
                </SelectTrigger>
                <SelectContent>
                  {stages.map(stage => (
                    <SelectItem key={stage.id} value={stage.id}>
                      {stage.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="grid gap-2">
              <div className="flex justify-between">
                <Label htmlFor="closing_probability">Probabilidade de Fechamento (%)</Label>
              </div>
              <Slider
                defaultValue={[watch('closing_probability') || 50]}
                min={0}
                max={100}
                step={1}
                onValueChange={value => setValue('closing_probability', value[0])}
              />
              <p className="text-sm text-muted-foreground">
                {watch('closing_probability') || 50}%
              </p>
            </div>

            <div className="grid gap-2">
              <Label htmlFor="expected_close_date">Data Prevista de Fechamento</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    id="expected_close_date"
                    variant="outline"
                    className={cn(
                      "w-full justify-start text-left font-normal",
                      !closeDate && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {closeDate ? (
                      format(closeDate, 'PPP', { locale: ptBR })
                    ) : (
                      <span>Selecionar data</span>
                    )}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={closeDate || null}
                    onSelect={(date) => setValue('expected_close_date', date ? date.toISOString() : '')}
                    initialFocus
                    locale={ptBR}
                  />
                </PopoverContent>
              </Popover>
            </div>

            <div className="grid gap-2">
              <Label htmlFor="assigned_to">Responsável</Label>
              <Input
                id="assigned_to"
                placeholder="Nome do responsável"
                {...register('assigned_to')}
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
