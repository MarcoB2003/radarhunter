
import React from 'react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { Calendar as CalendarIcon } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';

type DateRangePickerProps = {
  dateRange: { from?: Date; to?: Date };
  onDateRangeChange: (range: { from?: Date; to?: Date }) => void;
};

const DateRangePicker: React.FC<DateRangePickerProps> = ({ dateRange, onDateRangeChange }) => {
  return (
    <div className="grid gap-2">
      <Popover>
        <PopoverTrigger asChild>
          <Button
            id="date"
            variant="outline"
            className={cn(
              'w-full justify-start text-left font-normal',
              !dateRange.from && 'text-muted-foreground'
            )}
          >
            <CalendarIcon className="mr-2 h-4 w-4" />
            {dateRange.from ? (
              dateRange.to ? (
                <>
                  {format(dateRange.from, 'dd/MM/yyyy', { locale: ptBR })} -{' '}
                  {format(dateRange.to, 'dd/MM/yyyy', { locale: ptBR })}
                </>
              ) : (
                format(dateRange.from, 'dd/MM/yyyy', { locale: ptBR })
              )
            ) : (
              <span>Selecione o período</span>
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start">
          <Calendar
            initialFocus
            mode="range"
            defaultMonth={dateRange.from}
            selected={{ from: dateRange.from, to: dateRange.to }}
            onSelect={(range) => {
              onDateRangeChange({
                from: range?.from,
                to: range?.to,
              });
            }}
            numberOfMonths={2}
            className="pointer-events-auto"
          />
        </PopoverContent>
      </Popover>
    </div>
  );
};

export default DateRangePicker;
