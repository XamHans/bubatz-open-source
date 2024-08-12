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
import { useToast } from '@/components/ui/use-toast';
import { siteConfig } from '@/config/site';
import logger from '@/lib/logger';
import {
  CreateStrainInput,
  createStrainInputSchema,
} from '@/modules/plants/data-access/schema';
import { createStrainUseCase } from '@/modules/plants/use-cases';
import { zodResolver } from '@hookform/resolvers/zod';
import { useAction } from 'next-safe-action/hooks';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';

export default function NewStrainForm() {
  const router = useRouter();
  const { toast } = useToast();

  const { execute, status } = useAction(createStrainUseCase, {
    onSuccess: (data) => {
      toast({
        title: 'Success',
        duration: 1000,
        description: 'Strain created successfully',
      });
      setTimeout(() => {
        router.push(`${siteConfig.links.plants.index}`);
      });
    },
    onError: (error) => {
      logger.debug('Error creating batch', error);
      toast({
        title: 'Error',
        variant: 'destructive',
        duration: 1000,
        description: `Strain creation failed, ${error}`,
      });
    },
  });

  const form = useForm<CreateStrainInput>({
    resolver: zodResolver(createStrainInputSchema),
    defaultValues: {
      name: '',
      description: '',
      thc: 0,
      cbd: 0,
      currentPricePerGram: 0,
    },
  });

  const onSubmit = (data: CreateStrainInput) => {
    execute(data);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Strain Name</FormLabel>
              <FormControl>
                <Input placeholder="Enter strain name" {...field} />
              </FormControl>
              <FormDescription>
                The name of the cannabis strain.
              </FormDescription>
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
                <Textarea placeholder="Enter strain description" {...field} />
              </FormControl>
              <FormDescription>
                A brief description of the strain (optional).
              </FormDescription>
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
                <Input
                  type="number"
                  step="0.1"
                  {...field}
                  onChange={(e) => field.onChange(parseFloat(e.target.value))}
                />
              </FormControl>
              <FormDescription>
                The THC content of the strain as a percentage.
              </FormDescription>
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
                <Input
                  type="number"
                  step="0.1"
                  {...field}
                  onChange={(e) => field.onChange(parseFloat(e.target.value))}
                />
              </FormControl>
              <FormDescription>
                The CBD content of the strain as a percentage.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="currentPricePerGram"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Current Price per Gram</FormLabel>
              <FormControl>
                <Input
                  type="number"
                  step="0.01"
                  {...field}
                  onChange={(e) => field.onChange(parseFloat(e.target.value))}
                />
              </FormControl>
              <FormDescription>
                The current price per gram for this strain.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit" disabled={status === 'executing'}>
          {status === 'executing' ? 'Creating Strain...' : 'Create Strain'}
        </Button>
      </form>
    </Form>
  );
}
