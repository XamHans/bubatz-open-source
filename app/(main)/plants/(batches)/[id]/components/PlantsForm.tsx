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
import { Label } from '@/components/ui/label';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';
import {
  CreatePlantInput,
  createPlantInputSchema,
} from '@/modules/plants/data-access/schema';

import {
  createPlantUseCase,
  fetchPlantsFromBatchUseCase,
} from '@/modules/plants/use-cases';
import { zodResolver } from '@hookform/resolvers/zod';
import { useAction } from 'next-safe-action/hooks';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';

export interface PlantFormProps {
  batchId: string;
}

const PlantsForm: React.FC<PlantFormProps> = ({ batchId }) => {
  const [open, setOpen] = useState(false);

  const { execute } = useAction(fetchPlantsFromBatchUseCase, {
    onSuccess: (data) => console.log('Plants ', data),
    onError: (error) => console.log('Error fetching plants by batch', error),
  });

  const { execute: createPlantExecute } = useAction(createPlantUseCase, {
    onSuccess: (data) => console.log('Plants ', data),
    onError: (error) => console.log('Error fetching plants by batch', error),
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
  }, [batchId, execute]);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Plants</CardTitle>
        <CardDescription>Manage plants in this batch</CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[100px]">ID</TableHead>
              <TableHead>Position</TableHead>
              <TableHead>Yield</TableHead>
              <TableHead className="w-[100px]">Health</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            <TableRow>
              <TableCell className="font-semibold">GGPC-001</TableCell>
              <TableCell>
                <Label htmlFor="stock-1" className="sr-only">
                  Stock
                </Label>
                <Input id="stock-1" type="number" defaultValue="100" />
              </TableCell>
              <TableCell>
                <Label htmlFor="price-1" className="sr-only">
                  Price
                </Label>
                <Input id="price-1" type="number" defaultValue="99.99" />
              </TableCell>
              <TableCell>
                <ToggleGroup type="single" defaultValue="s" variant="outline">
                  <ToggleGroupItem value="s">S</ToggleGroupItem>
                  <ToggleGroupItem value="m">M</ToggleGroupItem>
                  <ToggleGroupItem value="l">L</ToggleGroupItem>
                </ToggleGroup>
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
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
              <pre>{JSON.stringify(form.formState.errors, null, 2)}</pre>
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

export { PlantsForm };
