'use client';

import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { StrainProps, UpdateStrainInput } from '@/modules/plants/data-access/schema';
import { updateStrainUseCase } from '@/modules/plants/use-cases';
import { zodResolver } from '@hookform/resolvers/zod';
import { useAction } from 'next-safe-action/hooks';
import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { z } from 'zod';

const formSchema = z.object({
  name: z.string().min(2, {
    message: 'Name must be at least 2 characters.',
  }),
  type: z.string().min(2, {
    message: 'Type must be at least 2 characters.',
  }),
  thc: z.number().min(0).max(100),
  cbd: z.number().min(0).max(100),
  description: z.string().optional(),
});

interface EditStrainFormProps {
  strain: StrainProps;
  onSuccess?: (updatedStrain: StrainProps) => void;
}

export function EditStrainForm({ strain, onSuccess }: EditStrainFormProps) {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: strain.name,
      type: strain.type,
      thc: strain.thc,
      cbd: strain.cbd,
      description: strain.description || '',
    },
  });

  const { execute, status } = useAction(updateStrainUseCase, {
    onSuccess: ({ data }) => {
      if (data?.success) {
        toast.success('Strain updated successfully');
        onSuccess?.(data.success);
      }
    },
    onError: (error) => {
      toast.error(`Error updating strain: ${error.serverError || 'Unknown error'}`);
    },
  });

  useEffect(() => {
    const subscription = form.watch((value, { name, type }) => {
      console.log(value, name, type);
    });
    return () => subscription.unsubscribe();
  }, [form]);

  function onSubmit(values: z.infer<typeof formSchema>) {
    const updateInput: UpdateStrainInput = {
      id: strain.id,
      ...values,
    };
    execute(updateInput);
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Name</FormLabel>
              <FormControl>
                <Input placeholder="Strain name" {...field} />
              </FormControl>
              <FormDescription>The name of the strain.</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="type"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Type</FormLabel>
              <FormControl>
                <Input placeholder="Strain type" {...field} />
              </FormControl>
              <FormDescription>The type of the strain (e.g., Indica, Sativa, Hybrid).</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="thc"
          render={({ field }) => (
            <FormItem>
              <FormLabel>THC Content (%)</FormLabel>
              <FormControl>
                <Input type="number" placeholder="THC content" {...field} onChange={e => field.onChange(parseFloat(e.target.value))} />
              </FormControl>
              <FormDescription>The THC content of the strain (0-100%).</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="cbd"
          render={({ field }) => (
            <FormItem>
              <FormLabel>CBD Content (%)</FormLabel>
              <FormControl>
                <Input type="number" placeholder="CBD content" {...field} onChange={e => field.onChange(parseFloat(e.target.value))} />
              </FormControl>
              <FormDescription>The CBD content of the strain (0-100%).</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description</FormLabel>
              <FormControl>
                <Textarea placeholder="Strain description" {...field} />
              </FormControl>
              <FormDescription>A brief description of the strain.</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" disabled={status === 'executing'}>
          {status === 'executing' ? 'Updating...' : 'Update Strain'}
        </Button>
      </form>
    </Form>
  );
}
