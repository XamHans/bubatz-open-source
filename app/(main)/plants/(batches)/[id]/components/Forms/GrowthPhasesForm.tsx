'use client';

import AutoForm from '@/components/generic/auto-form';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';
import { formatToGermanDate } from '@/lib/utils';
import {
  GrowPhases,
  destroyedSchema,
  harvestSchema,
  phaseSchema,
  processingSchema,
} from '@/modules/plants/data-access/grow-phases-schema';
import { updateBatchUseCase } from '@/modules/plants/use-cases';
import { zodResolver } from '@hookform/resolvers/zod';
import { FilePenIcon } from 'lucide-react';
import { useAction } from 'next-safe-action/hooks';
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { useBatch } from '../BatchContext';
interface GrowthPhaseFormProps {
  data: GrowPhases;
}

const formSchema = z.object({
  yieldTotal: z.number().min(0, 'Yield total must be a non-negative number.'),
  pricePerGram: z
    .number()
    .min(0, 'Price per gram must be a non-negative number.'),
  destroyedTotal: z
    .number()
    .min(0, 'Destroyed total must be a non-negative number.'),
});
type FormData = z.infer<typeof formSchema>;

const GrowthPhasesForm: React.FC<GrowthPhaseFormProps> = ({ data }) => {
  const methods = useForm({
    defaultValues: data,
  });

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
  });

  const onSubmit = (data: FormData) => {
    console.log(data);
  };

  return (
    <>
      <Accordion type="single" collapsible className="w-full">
        {Object.keys(data).map((phase) => (
          <AccordionItem key={phase} value={phase}>
            <AccordionTrigger>
              {phase.charAt(0).toUpperCase() + phase.slice(1)}
            </AccordionTrigger>
            <AccordionContent>
              <PhaseDetailCard phase={phase} data={data} />
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
      <Separator className="my-4" />
      <h2 className="my-2 text-lg font-bold">Yields</h2>
      <Form {...form}>
        <form
          className="grid gap-2 sm:grid-cols-2 md:gap-4"
          onSubmit={form.handleSubmit(onSubmit)}
        >
          <FormField
            control={form.control}
            name="yieldTotal"
            render={({ field }) => (
              <FormItem className="col-span-2">
                <FormLabel>Yield Total (grams)</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    placeholder="Enter yield total in grams"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="destroyedTotal"
            render={({ field }) => (
              <FormItem className="col-span-2">
                <FormLabel>Destroyed Total (grams)</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    placeholder="Enter destroyed total in grams"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="pricePerGram"
            render={({ field }) => (
              <FormItem className="col-span-2">
                <FormLabel>Price per Gram (€)</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    placeholder="Enter price per gram"
                    {...field}
                  />
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

export { GrowthPhasesForm };

const PhaseDetailCard: React.FC<{ phase: string; data: any }> = ({
  phase,
  data,
}) => {
  const phaseData = data[phase];
  console.log('phase data ', phaseData);
  return (
    <Card className="overflow-hidden border-0 bg-white">
      <CardHeader className="flex flex-row items-start bg-muted/50">
        <div className="grid gap-0.5">
          <CardTitle className="group flex items-center gap-2 text-lg">
            {phase.charAt(0).toUpperCase() + phase.slice(1)} Information
            <PhaseEditCard phase={phase} data={data} />
          </CardTitle>
        </div>
      </CardHeader>
      <CardContent className="p-6 text-sm">
        {phaseData.date_germinated && (
          <>
            <div className="grid gap-3">
              <div className="font-semibold">Date Information</div>
              <dl className="grid gap-3">
                <div className="flex items-center justify-between gap-4">
                  <dt className="text-muted-foreground">Date Germinated</dt>
                  <dd className="font-medium">
                    {formatToGermanDate(phaseData.date_germinated)}
                  </dd>
                </div>
              </dl>
            </div>
            <Separator className="my-4" />
          </>
        )}
        {phaseData.start_date && (
          <>
            <div className="grid gap-3">
              <div className="font-semibold">Date Information</div>
              <dl className="grid gap-3">
                <div className="flex items-center justify-between gap-4">
                  <dt className="text-muted-foreground">Start Date</dt>
                  <dd className="font-medium">
                    {formatToGermanDate(phaseData.start_date)}
                  </dd>
                </div>
                <div className="flex items-center justify-between gap-4">
                  <dt className="text-muted-foreground">End Date</dt>
                  <dd className="font-medium">
                    {formatToGermanDate(phaseData.end_date)}
                  </dd>
                </div>
                {phaseData.estimated_end_date && (
                  <div className="flex items-center justify-between gap-4">
                    <dt className="text-muted-foreground">
                      Estimated End Date
                    </dt>
                    <dd className="font-medium">
                      {formatToGermanDate(phaseData.estimated_end_date)}
                    </dd>
                  </div>
                )}
                {phaseData.actual_date && (
                  <div className="flex items-center justify-between gap-4">
                    <dt className="text-muted-foreground">Actual Date</dt>
                    <dd className="font-medium">
                      {formatToGermanDate(phaseData.actual_date)}
                    </dd>
                  </div>
                )}
              </dl>
            </div>
            <Separator className="my-4" />
          </>
        )}
        {phaseData.yield_estimate_grams !== undefined && (
          <>
            <div className="grid gap-3">
              <div className="font-semibold">Yield Information</div>
              <dl className="grid gap-3">
                <div className="flex items-center justify-between">
                  <dt className="text-muted-foreground">
                    Yield Estimate (grams)
                  </dt>
                  <dd className="font-medium">
                    {phaseData.yield_estimate_grams}
                  </dd>
                </div>
                {phaseData.yield_actual_grams !== null && (
                  <div className="flex items-center justify-between">
                    <dt className="text-muted-foreground">
                      Yield Actual (grams)
                    </dt>
                    <dd className="font-medium">
                      {phaseData.yield_actual_grams}
                    </dd>
                  </div>
                )}
              </dl>
            </div>
            <Separator className="my-4" />
          </>
        )}
        {phaseData.conditions && (
          <>
            <div className="grid gap-3">
              <div className="font-semibold">Conditions</div>
              <dl className="grid gap-3">
                <div className="flex items-center justify-between">
                  <dt className="text-muted-foreground">Temperature</dt>
                  <dd className="font-medium">
                    {phaseData.conditions.temperature}
                  </dd>
                </div>
                <div className="flex items-center justify-between">
                  <dt className="text-muted-foreground">Humidity</dt>
                  <dd className="font-medium">
                    {phaseData.conditions.humidity}
                  </dd>
                </div>
                <div className="flex items-center justify-between">
                  <dt className="text-muted-foreground">Light Hours</dt>
                  <dd className="font-medium">
                    {phaseData.conditions.light_hours}
                  </dd>
                </div>
              </dl>
            </div>
            <Separator className="my-4" />
          </>
        )}
        {phaseData.nutrients && (
          <>
            <div className="grid gap-3">
              <div className="font-semibold">Nutrients</div>
              <dl className="grid gap-3">
                <div className="flex items-center justify-between">
                  <dt className="text-muted-foreground">Type</dt>
                  <dd className="font-medium">{phaseData.nutrients.type}</dd>
                </div>
                <div className="flex items-center justify-between">
                  <dt className="text-muted-foreground">Schedule</dt>
                  <dd className="font-medium">
                    {phaseData.nutrients.schedule}
                  </dd>
                </div>
                <div className="flex items-center justify-between">
                  <dt className="text-muted-foreground">pH Level</dt>
                  <dd className="font-medium">
                    {phaseData.nutrients.ph_level}
                  </dd>
                </div>
              </dl>
            </div>
            <Separator className="my-4" />
          </>
        )}
        {phaseData.drying_conditions && (
          <>
            <div className="grid gap-3">
              <div className="font-semibold">Drying Conditions</div>
              <dl className="grid gap-3">
                <div className="flex items-center justify-between">
                  <dt className="text-muted-foreground">Temperature</dt>
                  <dd className="font-medium">
                    {phaseData.drying_conditions.temperature}
                  </dd>
                </div>
                <div className="flex items-center justify-between">
                  <dt className="text-muted-foreground">Humidity</dt>
                  <dd className="font-medium">
                    {phaseData.drying_conditions.humidity}
                  </dd>
                </div>
              </dl>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
};

const PhaseEditCard: React.FC<{ phase: string; data: any }> = ({
  phase,
  data,
}) => {
  const phaseComponentsConfig = {
    germination: {
      schema: phaseSchema,
    },
    vegetative: {
      schema: phaseSchema,
    },
    flowering: {
      schema: phaseSchema,
    },
    harvest: {
      schema: harvestSchema,
    },
    processing: {
      schema: processingSchema,
    },
    destroyed: {
      schema: destroyedSchema,
    },
  };
  const { id: batchId } = useBatch();
  // Get the appropriate component and schema based on the phase
  const { schema } = phaseComponentsConfig[phase] || {};
  const [values, setValues] = useState<Partial<z.infer<typeof schema>>>(data);
  const { execute, status } = useAction(updateBatchUseCase, {
    onSuccess: (data) => {
      console.log('Batch updated successfully', data);
    },
    onError: (error) => {
      console.log('Error updating batch', error);
    },
  });

  console.log('values ', values);
  const onSubmit = (data: any) => {
    const newPhaseValues = { [phase]: data };
    const newValues = { ...values, ...newPhaseValues };
    execute({ id: batchId, otherDetails: newValues });
  };

  if (!schema) {
    return <p>Invalid schema, cant proceed</p>;
  }
  return (
    <Dialog>
      <DialogTrigger>
        {' '}
        <Button variant="ghost" size="sm" className="p-1">
          <FilePenIcon className="h-4 w-4" />
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{phase}</DialogTitle>
        </DialogHeader>

        <AutoForm
          values={values[phase]}
          onParsedValuesChange={onSubmit}
          formSchema={schema}
        />
      </DialogContent>
    </Dialog>
  );
};
