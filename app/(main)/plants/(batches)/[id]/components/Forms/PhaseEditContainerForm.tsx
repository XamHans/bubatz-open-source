import { Button, DialogClose, DialogFooter } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { phaseSchema } from '@/modules/plants/data-access/grow-phases-schema';
import { zodResolver } from '@hookform/resolvers/zod';
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import GenericModal from './GenericModal';
// Import your schemas

// Example forms for each phase (these should be defined with the appropriate fields)
const GerminationForm = ({ control }) => (
  <>
    <FormField
      control={control}
      name="start_date"
      render={({ field }) => (
        <FormItem>
          <FormLabel>Start Date</FormLabel>
          <FormControl>
            <Input {...field} />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
    {/* Add more fields specific to Germination */}
  </>
);

const VegetativeForm = ({ control }) => (
  <>
    <FormField
      control={control}
      name="end_date"
      render={({ field }) => (
        <FormItem>
          <FormLabel>End Date</FormLabel>
          <FormControl>
            <Input {...field} />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
    {/* Add more fields specific to Vegetative */}
  </>
);

// Define other forms similarly...

const PhaseEditCard: React.FC<{ phase: string; data: any }> = ({
  phase,
  data,
}) => {
  const [open, setOpen] = useState(false);
  const phaseComponentsConfig = {
    germination: {
      component: GerminationForm,
      schema: phaseSchema,
    },
    vegetative: {
      component: VegetativeForm,
      schema: phaseSchema,
    },
    // flowering: {
    //   component: FloweringForm,
    //   schema: phaseSchema,
    // },
    //   harvest: {
    //     component: HarvestForm,
    //     schema: phaseSchema.merge(yieldSchema),
    //   },
    //   processing: {
    //     component: ProcessingForm,
    //     schema: processingSchema.merge(dryingConditionsSchema),
    //   },
    //   destroyed: {
    //     component: DestroyedForm,
    //     schema: destroyedSchema,
    //   },
  };

  // Get the appropriate component and schema based on the phase
  const { component: PhaseFormComponent, schema } =
    phaseComponentsConfig[phase] || {};

  const form = useForm({
    resolver: zodResolver(schema),
    defaultValues: data,
  });

  const onSubmit = form.handleSubmit((values) => {
    // Handle form submission
    console.log(values);
  });

  if (!PhaseFormComponent || !schema) {
    return <p>Invalid phase</p>;
  }

  return (
    <GenericModal
      headerTitle="Edit Phase"
      description="Here you can change the information of the phase."
    >
      <Form {...form}>
        <form
          onSubmit={onSubmit}
          className="grid gap-2 sm:grid-cols-2 md:gap-4"
        >
          <PhaseFormComponent control={form.control} />
          <DialogFooter className="col-span-2">
            <DialogClose asChild>
              <Button variant="ghost">Abort</Button>
            </DialogClose>
            <Button type="submit" disabled={!form.formState.isValid}>
              Submit
            </Button>
          </DialogFooter>
        </form>
      </Form>
    </GenericModal>
  );
};

export default PhaseEditCard;
