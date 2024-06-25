'use client';

import { GenericModal } from '@/components/generic/GenericModal';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { PlantDetailsData } from '@/modules/plants/data-access';
import {
  CreatePlantInput,
  createPlantInputSchema,
} from '@/modules/plants/data-access/schema';

import { useToast } from '@/components/ui/use-toast';
import {
  createPlantUseCase,
  fetchPlantsFromBatchUseCase,
} from '@/modules/plants/use-cases';
import { zodResolver } from '@hookform/resolvers/zod';
import { useAction } from 'next-safe-action/hooks';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useBatch } from '../BatchContext';
import { PlantsTable } from './PlantsTable';

const PlantsContainer: React.FC = () => {
  const { id: batchId, currentGrowthStage } = useBatch();

  const [open, setOpen] = useState(false);
  const [plants, setPlants] = useState<PlantDetailsData[]>([]);
  const { toast } = useToast();

  const { execute, status } = useAction(fetchPlantsFromBatchUseCase, {
    onSuccess: (data) => {
      const { plants } = data?.success as any;
      setPlants(plants);
    },
    onError: (error) => {
      toast({
        title: 'Error',
        description: `Plants could not be fetched: ${error}`,
        duration: 5000,
      });
    },
  });

  const { execute: createPlantExecute } = useAction(createPlantUseCase, {
    onSuccess: (data) => {
      execute({ batchId }); //re-fetch plants
    },
    onError: (error) => {
      toast({
        title: 'Error',
        duration: 5000,
        description: `Plant could not be created: ${error}`,
      });
    },
  });

  const form = useForm<CreatePlantInput>({
    resolver: zodResolver(createPlantInputSchema),
  });

  const onSubmit = (data: CreatePlantInput) => {
    console.log('Create Plant ', data);
    createPlantExecute({ ...data, batchId, health: 'healthy' });
    setOpen(false);
  };

  useEffect(() => {
    execute({ batchId });
  }, []);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Plants</CardTitle>
        <CardDescription>Manage plants in this batch</CardDescription>
      </CardHeader>
      <CardContent>
        <PlantsTable />
      </CardContent>
      <CardFooter className="justify-center border-t p-4">
        <GenericModal
          headerTitle="Add New Plant"
          description="Fill out the details below to add a new plant to the batch."
          open={open}
          setOpen={setOpen}
        >
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
                    {/* <FormLabel>{t('MEMBER.FIRST_NAME')}</FormLabel> */}
                    <FormLabel>Name</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Give the plant a name if you like"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="position"
                render={({ field }) => (
                  <FormItem>
                    {/* <FormLabel>{t('MEMBER.LAST_NAME')}</FormLabel> */}
                    <FormLabel>Position</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Enter the position of the plant inside of the batch"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit">Save</Button>
            </form>
          </Form>
        </GenericModal>
      </CardFooter>
    </Card>
  );
};

export { PlantsContainer };
