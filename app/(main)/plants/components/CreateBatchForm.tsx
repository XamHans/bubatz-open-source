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
  CreateBatchInput,
  createBatchInputSchema,
} from '@/modules/plants/data-access/schema';
import { addBatchUseCase } from '@/modules/plants/use-cases';
import { useAction } from 'next-safe-action/hooks';
import 'react-datepicker/dist/react-datepicker.css';

const CreateBatchForm = () => {
  const { execute, status } = useAction(addBatchUseCase, {
    onSuccess: (data) => {
      console.log('Batch created successfully', data);
    },
    onError: (error) => {
      console.log('Error creating batch', error);
    },
  });

  const form = useForm<CreateBatchInput>({
    resolver: zodResolver(createBatchInputSchema),
  });

  const onSubmit = (data: CreateBatchInput) => {
    execute(data);
    form.reset();
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="grid gap-2 sm:grid-cols-2 md:gap-4"
      >
        <FormField
          control={form.control}
          name="strain"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Strain</FormLabel>
              <FormControl>
                <Input placeholder="Enter strain" {...field} />
              </FormControl>
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
              <FormLabel>Current Growth Stage</FormLabel>
              <FormControl>
                <Input placeholder="Enter current growth stage" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="estimatedYield"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Estimated Yield (grams)</FormLabel>
              <FormControl>
                <Input
                  type="number"
                  placeholder="Enter estimated yield"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="otherDetails"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Other Details</FormLabel>
              <FormControl>
                <Input placeholder="Enter other details" {...field} />
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
