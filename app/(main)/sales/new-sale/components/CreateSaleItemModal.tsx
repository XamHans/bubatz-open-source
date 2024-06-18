'use client';

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
  SelectValue,
} from '@/components/ui/select';
import { useForm } from 'react-hook-form';
import { NewItemModal } from './NewItemModal';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  CreateSaleItemInput,
  createSaleItemInputSchema,
} from '@/modules/sales/data-access/schema';
import { useState } from 'react';
import { UUID } from 'crypto';
import { Button } from '@/components/ui/button';
import { DialogClose } from '@/components/ui/dialog';
import { GenericModal } from '@/components/generic/GenericModal';

interface CreateSaleItemModalProps {
  plants: { id: UUID; name: string; price: number }[];
  addItem: (item: CreateSaleItemInput) => void;
}

export default function CreateSaleItemModal(props: CreateSaleItemModalProps) {
  const { plants } = props;

  const [open, setOpen] = useState(false);
  const [errors, setErrors] = useState<{ field: string; message: string }[]>(
    [],
  );

  const form = useForm<CreateSaleItemInput>({
    mode: 'onChange',
    resolver: zodResolver(createSaleItemInputSchema),
  });

  const handleSave = (data: CreateSaleItemInput) => {
    console.log(data);
    props.addItem(data);
    setOpen(false);
    form.reset();
    return true;
  };

  const handleAbort = () => {
    form.reset();
    setErrors([]);
  };

  const getPlantNameFromId = (id: string): string => {
    const plant = plants.find((plant) => plant.id === id);
    return plant?.name as UUID;
  };

  const getPlantPriceFromId = (id: string): string => {
    const plant = plants.find((p) => p.id === id);
    return plant?.price.toString() || '';
  };

  /**
   * ! WHEN CHANGING THE VALUE FROM SELECT, ITS GIVES AN ERROR ON RELATED TO UNCONTROLLED INPUTS. I DONT KNOW WHAT IT IS,
   * ! OR HOW TO FIX IT. BUT ITS WORKING FINE. :D
   */
  return (
    <GenericModal
      headerTitle="Add an item"
      description="Fill in the details to add a new item to this sale."
      open={open}
      setOpen={setOpen}
    >
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(handleSave)}
          className="grid gap-2 sm:grid-cols-2 md:gap-4"
        >
          <FormField
            control={form.control}
            name="plantId"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Select Plant</FormLabel>
                <FormControl>
                  <Select
                    onValueChange={(v) => {
                      field.onChange(v);
                      form.setValue('price', getPlantPriceFromId(v as string));
                    }}
                    defaultValue={field.value}
                  >
                    <SelectTrigger className="w-full">
                      <span>
                        {getPlantNameFromId(field.value) || 'Select Plant'}
                      </span>
                    </SelectTrigger>
                    <SelectContent>
                      {plants.map((plant, index) => (
                        <SelectItem key={index} value={plant.id}>
                          {plant.name}
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
            disabled={form.getValues('plantId') === undefined}
            control={form.control}
            name="price"
            render={({ field }) => {
              return (
                <FormItem>
                  <FormLabel>Price</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="123,45" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              );
            }}
          />
          <FormField
            control={form.control}
            name="weightGrams"
            render={({ field }) => {
              return (
                <FormItem>
                  <FormLabel>Grams</FormLabel>
                  <FormControl>
                    <Input type="number" placeholder="0,67" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              );
            }}
          />
          <Button type="submit">Save</Button>
        </form>
      </Form>
    </GenericModal>
  );
}
