'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';

import { CustomDatePicker } from '@/components/generic/DatePicker';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { logger } from '@/lib/logger';
import {
  CreateBatchInput,
  createBatchInputSchema,
  StrainProps,
} from '@/modules/plants/data-access/schema';
import { GrowPhase } from '@/modules/plants/types';
import {
  addBatchUseCase,
  fetchStrainsUseCase,
} from '@/modules/plants/use-cases';
import { useAction } from 'next-safe-action/hooks';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import 'react-datepicker/dist/react-datepicker.css';

const CreateBatchForm = () => {
  const router = useRouter();
  const [strains, setStrains] = useState<StrainProps[]>([]);

  const { execute, status } = useAction(addBatchUseCase, {
    onSuccess: ({ data }) => {
      console.log('Batch id', data.success[0].insertedId);
      const batchId = data.success[0].insertedId;
      router.push(`/plants/${batchId}`);
    },
    onError: (error) => {
      console.log('Error creating batch', error);
    },
  });

  const fetchStrains = useAction(fetchStrainsUseCase, {
    onSuccess: ({ data }) => {
      setStrains(data?.success);
    },
  });

  useEffect(() => {
    fetchStrains.execute({});
  }, []);

  const form = useForm<CreateBatchInput>({
    resolver: zodResolver(createBatchInputSchema),
  });

  const onSubmit = (data: CreateBatchInput) => {
    logger.info('Creating batch', data);
    execute(data);
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="grid gap-2 sm:grid-cols-2 md:gap-4"
      >
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Name</FormLabel>
              <FormControl>
                <Input placeholder="Enter name" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="strainId"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Strain</FormLabel>
              <Select onValueChange={(value) => field.onChange(Number(value))}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select strain" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {strains.map((strain) => (
                    <SelectItem key={strain.id} value={strain.id.toString()}>
                      {strain.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="startDate"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Start Date</FormLabel>
              <FormControl>
                <CustomDatePicker
                  value={field.value}
                  onChange={field.onChange}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="endDate"
          render={({ field }) => (
            <FormItem>
              <FormLabel>(Estimated) End Date</FormLabel>
              <FormControl>
                <CustomDatePicker
                  value={field.value}
                  onChange={field.onChange}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
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

        <Button
          type="submit"
          disabled={status === 'loading'}
          className="col-span-2"
        >
          {status === 'loading' ? 'Creating...' : 'Create Batch'}
        </Button>
      </form>
    </Form>
  );
};

export default CreateBatchForm;
