import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import React from 'react';
import { Controller, useForm } from 'react-hook-form';

interface GrowthPhaseFormProps {
  data: any;
  onSave: (updatedData: any) => void;
}

const GrowthPhasesForm: React.FC<GrowthPhaseFormProps> = ({ data, onSave }) => {
  const { control, handleSubmit, reset } = useForm({
    defaultValues: data,
  });

  const onSubmit = (formData: any) => {
    onSave(formData);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <Accordion type="single" collapsible className="w-full">
        {Object.keys(data).map((key) => (
          <AccordionItem key={key} value={key}>
            <AccordionTrigger>{key}</AccordionTrigger>
            <AccordionContent>
              {typeof data[key] === 'object' && data[key] !== null ? (
                Object.keys(data[key]).map((subKey) => (
                  <Controller
                    key={subKey}
                    name={`${key}.${subKey}`}
                    control={control}
                    render={({ field }) => (
                      <div className="mb-2">
                        <label className="mb-1 block font-medium capitalize">
                          {subKey.replace('_', ' ')}
                        </label>
                        <Input {...field} />
                      </div>
                    )}
                  />
                ))
              ) : (
                <Controller
                  name={key}
                  control={control}
                  render={({ field }) => (
                    <div className="mb-2">
                      <label className="mb-1 block font-medium capitalize">
                        {key.replace('_', ' ')}
                      </label>
                      <Input {...field} />
                    </div>
                  )}
                />
              )}
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>

      <Button type="submit">Save</Button>
    </form>
  );
};

export { GrowthPhasesForm };
