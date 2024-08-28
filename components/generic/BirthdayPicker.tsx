/* eslint-disable */
// @ts-nocheck
'use client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { cn } from '@/lib/utils';
import { format, parse } from 'date-fns';
import { de } from 'date-fns/locale';
import { CalendarIcon } from 'lucide-react';
import { useEffect, useState } from 'react';
import { Calendar } from './Calendar';

interface Props {
  initialDate?: string;
  onChange?: (date: string | undefined) => void;
}

export function BirthdayPicker({ initialDate, onChange }: Props) {
  const [date, setDate] = useState<Date | undefined>(
    initialDate ? parse(initialDate, 'yyyy-MM-dd', new Date()) : undefined,
  );
  const [stringDate, setStringDate] = useState(
    initialDate
      ? format(parse(initialDate, 'yyyy-MM-dd', new Date()), 'dd.MM.yyyy')
      : '',
  );
  const [errorMessage, setErrorMessage] = useState<string>('');

  useEffect(() => {
    if (initialDate) {
      const parsedDate = parse(initialDate, 'yyyy-MM-dd', new Date());
      setDate(parsedDate);
      setStringDate(format(parsedDate, 'dd.MM.yyyy'));
    }
  }, [initialDate]);

  const updateDate = (newDate: Date | undefined) => {
    setDate(newDate);
    if (newDate) {
      setStringDate(format(newDate, 'dd.MM.yyyy'));
      onChange && onChange(format(newDate, 'yyyy-MM-dd'));
    } else {
      setStringDate('');
      onChange && onChange(undefined);
    }
    setErrorMessage('');
  };

  return (
    <Popover>
      <div className="relative w-[280px]">
        <Input
          type="string"
          value={stringDate}
          onChange={(e) => {
            setStringDate(e.target.value);
            try {
              const parsedDate = parse(e.target.value, 'dd.MM.yyyy', new Date());
              updateDate(parsedDate);
            } catch {
              setErrorMessage('Ungültiges Datum');
              onChange && onChange(undefined);
            }
          }}
        />
        {errorMessage !== '' && (
          <div className="absolute bottom-[-1.75rem] left-0 text-sm text-red-400">
            {errorMessage}
          </div>
        )}
        <PopoverTrigger asChild>
          <Button
            variant={'outline'}
            className={cn(
              'absolute right-0 top-[50%] translate-y-[-50%] rounded-l-none font-normal',
              !date && 'text-muted-foreground',
            )}
          >
            <CalendarIcon className="h-4 w-4" />
          </Button>
        </PopoverTrigger>
      </div>
      <PopoverContent align="end" className="w-auto p-0">
        <Calendar
          mode="single"
          captionLayout="dropdown-buttons"
          selected={date}
          defaultMonth={date}
          onSelect={(selectedDate) => {
            updateDate(selectedDate || undefined);
          }}
          fromYear={1960}
          toYear={2030}
          locale={de}
        />
      </PopoverContent>
    </Popover>
  );
}
