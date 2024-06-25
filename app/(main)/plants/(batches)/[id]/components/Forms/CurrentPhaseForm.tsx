import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
} from '@/components/ui/select';
import { useToast } from '@/components/ui/use-toast';
import {
  UpdateGrowthStageInput,
  updateGrowthStageSchema,
} from '@/modules/plants/data-access/schema';
import { GrowPhase } from '@/modules/plants/types';
import { updateBatchUseCase } from '@/modules/plants/use-cases';
import { zodResolver } from '@hookform/resolvers/zod';
import { useAction } from 'next-safe-action/hooks';
import React, { useEffect } from 'react';
import { useForm, useWatch } from 'react-hook-form';
import { useBatch } from '../BatchContext';

const CurrentPhaseForm: React.FC = () => {
  const { toast } = useToast();
  const { id: batchId, currentGrowthStage } = useBatch();

  const { execute, status } = useAction(updateBatchUseCase, {
    onSuccess: (data) => {
      console.log('Batch updated successfully', data);
      toast({
        title: 'Success',
        duration: 1000,
        description: 'Grow State updated successfully',
      });
    },
    onError: (error) => {
      console.log('Error updating batch', error);
      toast({
        title: 'Error',
        variant: 'destructive',
        description: `Grow State could not be updated ${error}`,
      });
    },
  });

  const form = useForm<UpdateGrowthStageInput>({
    resolver: zodResolver(updateGrowthStageSchema),
    defaultValues: {
      currentGrowthStage: currentGrowthStage,
      id: batchId,
    },
  });

  const currentGrowthStageValue = useWatch({
    control: form.control,
    name: 'currentGrowthStage',
  });

  useEffect(() => {
    if (form.formState.isValid) {
      console.log({ id: batchId, currentGrowthStage: currentGrowthStageValue });
      execute({ id: batchId, currentGrowthStage: currentGrowthStageValue });
    }
  }, [currentGrowthStageValue]);

  // const {  startDate, endDate } = details;
  // const start = parseISO(startDate);
  // const end = endDate ? parseISO(endDate) : addDays(start, 30);
  // const now = new Date();
  // const totalDays = differenceInDays(end, start);
  // const elapsedDays = differenceInDays(now, start);
  // const progress = Math.min((elapsedDays / totalDays) * 100, 100);

  return (
    <>
      {/* <Progress value={progress} className=" mb-2 w-full" /> */}
      <Form {...form}>
        <form className="grid gap-4">
          <FormField
            control={form.control}
            name="currentGrowthStage"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Select Grow Phase</FormLabel>
                <FormControl>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <SelectTrigger className="w-full">
                      <span>{field.value || 'Select Grow Phase'}</span>
                    </SelectTrigger>
                    <SelectContent>
                      {Object.values(GrowPhase).map((phase) => (
                        <SelectItem key={phase} value={phase}>
                          {phase}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </form>
      </Form>
    </>
  );
};

export { CurrentPhaseForm };
