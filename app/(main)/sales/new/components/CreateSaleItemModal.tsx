'use client';

import { GenericModal } from '@/components/generic/GenericModal';
import { Button } from '@/components/ui/button';
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
import { StrainProps } from '@/modules/plants/data-access/schema';
import {
  SaleItem,
  SaleItemFormInputSchema,
} from '@/modules/sales/data-access/schema';
import { zodResolver } from '@hookform/resolvers/zod';
import { useState } from 'react';
import { useForm } from 'react-hook-form';

interface CreateSaleItemModalProps {
  strains: StrainProps[];
  addItem: (item: SaleItem) => void;
}

export default function CreateSaleItemModal(props: CreateSaleItemModalProps) {
  const { strains: plants } = props;

  const [open, setOpen] = useState(false);
  const [errors, setErrors] = useState<{ field: string; message: string }[]>(
    [],
  );

  const form = useForm<SaleItem>({
    mode: 'onSubmit',
    resolver: zodResolver(SaleItemFormInputSchema),
  });

  const handleSave = (data: SaleItem) => {
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

  const getPlantNameFromId = (id: number): string => {
    const plant = plants.find((plant) => plant.id == id);
    return plant?.name || '';
  };

  const getPlantPriceFromId = (id: number): number => {
    const plant = plants.find((plant) => plant.id == id);
    return plant?.currentPricePerGram || -1;
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
            name="strainId"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Select Plant</FormLabel>
                <FormControl>
                  <Select
                    onValueChange={(v) => {
                      field.onChange(parseInt(v));
                      form.setValue('price', getPlantPriceFromId(parseInt(v)));
                    }}
                    // defaultValue={field.value}
                  >
                    <SelectTrigger className="w-full">
                      <span>
                        {getPlantNameFromId(field.value) || 'Select Plant'}
                      </span>
                    </SelectTrigger>
                    <SelectContent>
                      {plants.map((plant, index) => (
                        <SelectItem key={index} value={String(plant.id)}>
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
            control={form.control}
            name="price"
            render={({ field }) => {
              return (
                <FormItem>
                  <FormLabel>Price</FormLabel>
                  <FormControl>
                    <Input
                      disabled={form.getValues('strainId') === undefined}
                      type="number"
                      {...field}
                      value={field.value}
                      placeholder="123.45"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              );
            }}
          />
          <FormField
            control={form.control}
            name="amount"
            render={({ field }) => {
              return (
                <FormItem>
                  <FormLabel>Grams</FormLabel>
                  <FormControl>
                    <Input type="number" placeholder="0.67" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              );
            }}
          />
          <Button type="submit" className="col-span-2">
            Save
          </Button>
        </form>
      </Form>
    </GenericModal>
  );
}
