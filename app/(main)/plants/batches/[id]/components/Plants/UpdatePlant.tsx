import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
} from '@/components/ui/select';
import { useToast } from '@/components/ui/use-toast';
import {
  PlantProps,
  UpdatePlantInput,
  updatePlantInputSchema,
} from '@/modules/plants/data-access/schema';
import { HealthStatus } from '@/modules/plants/types';
import { updatePlantUseCase } from '@/modules/plants/use-cases';
import { zodResolver } from '@hookform/resolvers/zod';
import { DialogTitle } from '@radix-ui/react-dialog';
import { Edit2Icon } from 'lucide-react';
import { useAction } from 'next-safe-action/hooks';
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';

interface UpdatePlantFormProps {
  plant: PlantProps;
  onClose: () => void; // Add this prop to detect dialog close --> trigger refresh on parent
}

const UpdatePlantForm: React.FC<UpdatePlantFormProps> = ({
  plant,
  onClose,
}) => {
  const { toast } = useToast();
  const [open, setOpen] = useState(false);
  const { execute, status } = useAction(updatePlantUseCase, {
    onSuccess: (data) => {
      console.log('plant updated successfully', data);
      setOpen(false);
      toast({
        title: 'Success',
        duration: 1000,
        description: 'Grow State updated successfully',
      });
      onClose();
    },
    onError: (error) => {
      console.log('Error updating plant', error);
      toast({
        title: 'Error',
        variant: 'destructive',
        description: `Grow State could not be updated ${error}`,
      });
    },
  });

  const form = useForm<UpdatePlantInput>({
    resolver: zodResolver(updatePlantInputSchema),
    defaultValues: {
      ...plant,
      yield: plant.yield || 0,
    },
  });

  const onSubmit = (data: UpdatePlantInput) => {
    console.log('save data dynamically ', data);
    execute(data);
  };

  return (
    <>
      <Dialog>
        <DialogTrigger>
          <Edit2Icon className="h-4 w-4 cursor-pointer" />
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Update Plants Information</DialogTitle>
          </DialogHeader>
          <Form {...form}>
            <form
              className="grid gap-2 sm:grid-cols-2 md:gap-4"
              onSubmit={form.handleSubmit(onSubmit)}
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

              <FormField
                control={form.control}
                name="health"
                render={({ field }) => (
                  <FormItem className="col-span-2">
                    <FormLabel>Select Plants Health Status</FormLabel>
                    <FormControl>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <SelectTrigger className="w-full">
                          <span>{field.value || 'Select Health Status'}</span>
                        </SelectTrigger>
                        <SelectContent>
                          {Object.values(HealthStatus).map((status) => (
                            <SelectItem key={status} value={status}>
                              {status}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="yield"
                render={({ field }) => (
                  <FormItem className="col-span-2">
                    {/* <FormLabel>{t('MEMBER.LAST_NAME')}</FormLabel> */}
                    <FormLabel>Yield (rounded in g)</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        value={field.value || 0}
                        placeholder="Enter the yield of the plant in grams"
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
        </DialogContent>
      </Dialog>
    </>
  );
};

export { UpdatePlantForm };
