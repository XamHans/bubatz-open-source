'use client';

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
import { Separator } from '@/components/ui/separator';
import { GrowPhases } from '@/modules/plants/data-access/grow-phases-schema';
import { FilePenIcon } from 'lucide-react';
import React from 'react';
import { useForm } from 'react-hook-form';

interface GrowthPhaseFormProps {
  data: GrowPhases;
}

const GrowthPhasesForm: React.FC<GrowthPhaseFormProps> = ({ data }) => {
  const methods = useForm({
    defaultValues: data,
  });

  return (
    <Accordion type="single" collapsible className="w-full">
      {Object.keys(data).map((phase) => (
        <AccordionItem key={phase} value={phase}>
          <AccordionTrigger>
            {phase.charAt(0).toUpperCase() + phase.slice(1)}
          </AccordionTrigger>
          <AccordionContent>
            <PhaseDetailCard phase={phase} data={data[phase]} />
          </AccordionContent>
        </AccordionItem>
      ))}
    </Accordion>
  );
};

export { GrowthPhasesForm };

const PhaseDetailCard: React.FC<{ phase: string; data: any }> = ({
  phase,
  data,
}) => {
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
        {data.date_germinated && (
          <>
            <div className="grid gap-3">
              <div className="font-semibold">Date Information</div>
              <dl className="grid gap-3">
                <div className="flex items-center justify-between gap-4">
                  <dt className="text-muted-foreground">Date Germinated</dt>
                  <dd className="font-medium">{data.date_germinated}</dd>
                </div>
              </dl>
            </div>
            <Separator className="my-4" />
          </>
        )}
        {data.start_date && (
          <>
            <div className="grid gap-3">
              <div className="font-semibold">Date Information</div>
              <dl className="grid gap-3">
                <div className="flex items-center justify-between gap-4">
                  <dt className="text-muted-foreground">Start Date</dt>
                  <dd className="font-medium">{data.start_date}</dd>
                </div>
                <div className="flex items-center justify-between gap-4">
                  <dt className="text-muted-foreground">End Date</dt>
                  <dd className="font-medium">{data.end_date}</dd>
                </div>
                {data.estimated_end_date && (
                  <div className="flex items-center justify-between gap-4">
                    <dt className="text-muted-foreground">
                      Estimated End Date
                    </dt>
                    <dd className="font-medium">{data.estimated_end_date}</dd>
                  </div>
                )}
                {data.actual_date && (
                  <div className="flex items-center justify-between gap-4">
                    <dt className="text-muted-foreground">Actual Date</dt>
                    <dd className="font-medium">{data.actual_date}</dd>
                  </div>
                )}
              </dl>
            </div>
            <Separator className="my-4" />
          </>
        )}
        {data.yield_estimate_grams !== undefined && (
          <>
            <div className="grid gap-3">
              <div className="font-semibold">Yield Information</div>
              <dl className="grid gap-3">
                <div className="flex items-center justify-between">
                  <dt className="text-muted-foreground">
                    Yield Estimate (grams)
                  </dt>
                  <dd className="font-medium">{data.yield_estimate_grams}</dd>
                </div>
                {data.yield_actual_grams !== null && (
                  <div className="flex items-center justify-between">
                    <dt className="text-muted-foreground">
                      Yield Actual (grams)
                    </dt>
                    <dd className="font-medium">{data.yield_actual_grams}</dd>
                  </div>
                )}
              </dl>
            </div>
            <Separator className="my-4" />
          </>
        )}
        {data.conditions && (
          <>
            <div className="grid gap-3">
              <div className="font-semibold">Conditions</div>
              <dl className="grid gap-3">
                <div className="flex items-center justify-between">
                  <dt className="text-muted-foreground">Temperature</dt>
                  <dd className="font-medium">{data.conditions.temperature}</dd>
                </div>
                <div className="flex items-center justify-between">
                  <dt className="text-muted-foreground">Humidity</dt>
                  <dd className="font-medium">{data.conditions.humidity}</dd>
                </div>
                <div className="flex items-center justify-between">
                  <dt className="text-muted-foreground">Light Hours</dt>
                  <dd className="font-medium">{data.conditions.light_hours}</dd>
                </div>
              </dl>
            </div>
            <Separator className="my-4" />
          </>
        )}
        {data.nutrients && (
          <>
            <div className="grid gap-3">
              <div className="font-semibold">Nutrients</div>
              <dl className="grid gap-3">
                <div className="flex items-center justify-between">
                  <dt className="text-muted-foreground">Type</dt>
                  <dd className="font-medium">{data.nutrients.type}</dd>
                </div>
                <div className="flex items-center justify-between">
                  <dt className="text-muted-foreground">Schedule</dt>
                  <dd className="font-medium">{data.nutrients.schedule}</dd>
                </div>
                <div className="flex items-center justify-between">
                  <dt className="text-muted-foreground">pH Level</dt>
                  <dd className="font-medium">{data.nutrients.ph_level}</dd>
                </div>
              </dl>
            </div>
            <Separator className="my-4" />
          </>
        )}
        {data.drying_conditions && (
          <>
            <div className="grid gap-3">
              <div className="font-semibold">Drying Conditions</div>
              <dl className="grid gap-3">
                <div className="flex items-center justify-between">
                  <dt className="text-muted-foreground">Temperature</dt>
                  <dd className="font-medium">
                    {data.drying_conditions.temperature}
                  </dd>
                </div>
                <div className="flex items-center justify-between">
                  <dt className="text-muted-foreground">Humidity</dt>
                  <dd className="font-medium">
                    {data.drying_conditions.humidity}
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
        <h2>TEST</h2>
        <pre>{JSON.stringify(data, null, 2)}</pre>
      </DialogContent>
    </Dialog>
  );
};
