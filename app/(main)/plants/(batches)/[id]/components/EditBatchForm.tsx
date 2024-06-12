'use client';

import { CustomDatePicker } from '@/components/generic/DatePicker';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
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
import {
  UpdateBatchInput,
  updateBatchInputSchema,
} from '@/modules/plants/data-access/schema';
import { GrowPhase } from '@/modules/plants/types';
import {
  fetchBatchDetailsUseCase,
  updateBatchUseCase,
} from '@/modules/plants/use-cases';

import { zodResolver } from '@hookform/resolvers/zod';
import { useAction } from 'next-safe-action/hooks';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';

import { GrowthPhasesForm } from './GrowthPhasesForm';
import { LogTracker } from './LogTracker';
import { PlantsForm } from './PlantsForm';

interface EditBatchFormProps {
  batchId: string;
}
const initialData = {
  germination: {
    date_germinated: '2023-01-20',
    conditions: {
      temperature: '20-25°C',
      humidity: '70-80%',
      light_hours: 18,
    },
  },
  vegetative: {
    start_date: '2023-01-25',
    end_date: '2023-02-25',
    conditions: {
      temperature: '22-28°C',
      humidity: '50-70%',
      light_hours: 18,
    },
    nutrients: {
      type: 'Nutrient Solution A',
      schedule: 'daily',
      ph_level: 6.0,
    },
  },
  flowering: {
    start_date: '2023-02-26',
    estimated_end_date: '2023-04-26',
    conditions: {
      temperature: '20-26°C',
      humidity: '40-50%',
      light_hours: 12,
    },
    nutrients: {
      type: 'Nutrient Solution B',
      schedule: 'every 3 days',
      ph_level: 6.2,
    },
  },
  harvest: {
    estimated_date: '2023-04-27',
    actual_date: null,
    yield_estimate_grams: 500,
    yield_actual_grams: null,
    drying_conditions: {
      temperature: '18-24°C',
      humidity: '45-55%',
    },
  },
  processing: {
    drying_start_date: null,
    drying_end_date: null,
    curing_start_date: null,
    curing_end_date: null,
    trim_date: null,
    packaging_date: null,
    final_weight_grams: null,
  },
  destroyed: {
    weight_grams_destroyed: false,
    destroyed_date: null,
    reason: null,
  },
};

const EditBatchForm: React.FC<EditBatchFormProps> = ({ batchId }) => {
  const { execute, status } = useAction(updateBatchUseCase, {
    onSuccess: (data) => {
      console.log('Batch updated successfully', data);
    },
    onError: (error) => {
      console.log('Error updating batch', error);
    },
  });
  const [defaultValues, setDefaultValues] = useState<UpdateBatchInput | null>(
    null,
  );

  const { execute: fetchDetails } = useAction(fetchBatchDetailsUseCase, {
    onSuccess: (data) => {
      console.log('on success ', data);
    },
    onError: (error) => {
      console.log('Error fetching batch details', error);
    },
  });

  const form = useForm<UpdateBatchInput>({
    resolver: zodResolver(updateBatchInputSchema),
  });

  const onSubmit = (data: UpdateBatchInput) => {
    execute(data);
  };

  useEffect(() => {
    console.log('lets have some fun with batch id', batchId);
    fetchDetails({ batchId });
  }, [batchId, fetchDetails]);

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="grid gap-4 md:grid-cols-[1fr_250px] lg:grid-cols-3 lg:gap-8"
      >
        {/* Card on Left side */}
        <div className="grid auto-rows-max items-start gap-4 lg:col-span-2 lg:gap-8">
          {/* <Card x-chunk="dashboard-07-chunk-0">
            <CardHeader>
              <CardTitle>Batch Details</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-6">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Name</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter batch name" {...field} />
                      </FormControl>
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
                        <Textarea
                          placeholder="Enter batch description"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </CardContent>
          </Card> */}

          {/* Plants & Add Plant Card */}
          <PlantsForm batchId={batchId} />

          {/* Logbook Section */}
          <Card x-chunk="dashboard-08-chunk-2">
            <CardHeader>
              <CardTitle>Logbook</CardTitle>
            </CardHeader>
            <CardContent className="ml-6 px-6">
              <LogTracker />
            </CardContent>
          </Card>
        </div>

        {/* Cards on Right Side */}
        <div className="grid auto-rows-max items-start gap-2 lg:gap-8">
          <Card>
            <CardHeader>
              <CardTitle>Grow Phases</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Current Grow Phase */}
              <div>
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
              </div>
              <div>
                <GrowthPhasesForm
                  data={initialData}
                  onSave={(data) => {
                    console.log('save');
                  }}
                />
              </div>
            </CardContent>
          </Card>

          <Card x-chunk="dashboard-07-chunk-5">
            <CardHeader>
              <CardTitle>Grow Start & End</CardTitle>
            </CardHeader>
            <CardContent className="grid gap-8">
              <CardContent className="grid gap-6">
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
                      <FormLabel>End Date</FormLabel>
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
              </CardContent>
            </CardContent>
          </Card>
        </div>
      </form>
    </Form>
  );
};

export default EditBatchForm;
