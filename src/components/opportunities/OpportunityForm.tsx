import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Calendar } from '@/components/ui/calendar';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { CalendarIcon } from 'lucide-react';
import { cn } from '@/lib/utils';
import { OpportunityStage } from '@/types/opportunity';
import { STAGES } from '@/lib/pipeline-utils';
import { toast } from '@/components/ui/use-toast';

const formSchema = z.object({
  title: z.string().min(1, 'Título é obrigatório'),
  value: z.number().min(0, 'Valor deve ser maior que zero'),
  closingProbability: z.number().min(0).max(100),
  expectedCloseDate: z.string().optional(),
  assignedTo: z.string().optional(),
  stageId: z.enum(STAGES.map(stage => stage.id) as [string, ...string[]]),
});

type FormValues = z.infer<typeof formSchema>;

interface OpportunityFormProps {
  onSubmit: (data: FormValues) => void;
  defaultValues?: Partial<FormValues>;
  isLoading?: boolean;
  onCancel?: () => void;
}

export const OpportunityForm: React.FC<OpportunityFormProps> = ({
  onSubmit,
  defaultValues,
  isLoading = false,
  onCancel,
}) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      ...defaultValues,
      value: defaultValues?.value || 0,
      closingProbability: defaultValues?.closingProbability || 50,
      stageId: defaultValues?.stageId || 'lead'
    },
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div className="space-y-2">
        <label className="text-sm font-medium">Título</label>
        <Input
          {...register('title')}
          placeholder="Nome da oportunidade"
          className={cn(
            'w-full',
            errors.title && 'border-destructive focus-visible:ring-destructive'
          )}
        />
        {errors.title && (
          <p className="text-sm text-destructive">{errors.title.message}</p>
        )}
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <label className="text-sm font-medium">Valor</label>
          <Input
            type="number"
            step="0.01"
            {...register('value')}
            placeholder="0,00"
            className={cn(
              'w-full',
              errors.value && 'border-destructive focus-visible:ring-destructive'
            )}
          />
          {errors.value && (
            <p className="text-sm text-destructive">{errors.value.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">Probabilidade de Fechamento</label>
          <Input
            type="number"
            {...register('closingProbability')}
            placeholder="0%"
            className={cn(
              'w-full',
              errors.closingProbability &&
                'border-destructive focus-visible:ring-destructive'
            )}
          />
          {errors.closingProbability && (
            <p className="text-sm text-destructive">
              {errors.closingProbability.message}
            </p>
          )}
        </div>
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium">Data Prevista de Fechamento</label>
        <div className="relative">
          <CalendarIcon className="absolute left-2 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            type="date"
            {...register('expectedCloseDate')}
            className="pl-8"
          />
        </div>
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium">Responsável</label>
        <Input
          {...register('assignedTo')}
          placeholder="Nome do responsável"
          className={cn(
            'w-full',
            errors.assignedTo && 'border-destructive focus-visible:ring-destructive'
          )}
        />
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium">Estágio</label>
        <Select
          onValueChange={(value) => setValue('stageId', value as string)}
          defaultValue={defaultValues?.stageId || 'lead'}
        >
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Selecione o estágio" />
          </SelectTrigger>
          <SelectContent>
            {STAGES.map((stage) => (
              <SelectItem key={stage.id} value={stage.id}>
                {stage.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="flex justify-end gap-2">
        {onCancel && (
          <Button variant="outline" onClick={onCancel} disabled={isLoading}>
            Cancelar
          </Button>
        )}
        <Button type="submit" disabled={isLoading}>
          {isLoading ? 'Salvando...' : 'Salvar'}
        </Button>
      </div>
    </form>
  );
};
