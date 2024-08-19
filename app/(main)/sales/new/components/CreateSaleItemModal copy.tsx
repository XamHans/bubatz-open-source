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
  SelectTrigger
} from '@/components/ui/select';
import {
  CreateSaleItemInput,
  createSaleItemInputSchema,
} from '@/modules/sales/data-access/schema';
import { zodResolver } from '@hookform/resolvers/zod';
import { UUID } from 'crypto';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { NewItemModal } from './NewItemModal';

interface CreateSaleItemModalProps {
  plants: { id: UUID; name: string; price: number }[];
  addItem: (item: CreateSaleItemInput) => void;
}

export default function CreateSaleItemModal(props: CreateSaleItemModalProps) {
  const { plants } = props;

  const [isPlantSelected, setIsPlantSelected] = useState(false);
  const [errors, setErrors] = useState<{ field: string; message: string }[]>(
    [],
  );

  const form = useForm<CreateSaleItemInput>({
    mode: 'onChange',
    resolver: zodResolver(createSaleItemInputSchema),
  });

  const handleSave = (data: CreateSaleItemInput) => {
    console.log('data', data);

    setErrors([]);
    let hasErrors = false;

    if (!data.price) {
      setErrors((prev) => [
        ...prev,
        { field: 'price', message: 'Price is required' },
      ]);
      hasErrors = true;
    }

    if (!data.plantId) {
      setErrors((prev) => [
        ...prev,
        { field: 'plantId', message: 'Plant name is required' },
      ]);
      hasErrors = true;
    }

    if (!data.amount) {
      setErrors((prev) => [
        ...prev,
        {
          field: 'amount',
          message: 'Weight in grams is required',
        },
      ]);
      hasErrors = true;
    }

    if (hasErrors) return false;

    data = { ...data };
    props.addItem(data);
    form.reset();
    setErrors([]);
    return true;
  };

  const handleAbort = () => {
    form.reset();
    setErrors([]);
  };

  /**
   * ! WHEN CHANGING THE VALUE FROM SELECT, ITS GIVES AN ERROR ON RELATED TO UNCONTROLLED INPUTS. I DONT KNOW WHAT IT IS,
   * ! OR HOW TO FIX IT. BUT ITS WORKING FINE. :D
   */
  return (
    <NewItemModal
      headerTitle="Add an item"
      description="Fill in the details to add a new item to this sale."
      onSave={() => {
        return handleSave(form.getValues());
      }}
      onAbort={handleAbort}
      hasError={errors.length > 0}
    >
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(handleSave)}
          className="grid gap-2 sm:grid-cols-2 md:gap-4"
        >
          <FormField
            control={form.control}
            name="plantId"
            render={({ field }) => {
              const fieldErrors = errors.find(
                (error) => error.field === 'plantId',
              );
              return (
                <>
                  <FormField
                  control={form.control}
                  name="plantId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Select Plant</FormLabel>
                      <FormControl>
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                        >
                          <SelectTrigger className="w-full">
                            <span>{field.value || 'Select Plant'}</span>
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
                  // {fieldErrors && (
                  //   <FormMessage>{fieldErrors.message}</FormMessage>
                  )}
                </>
                )}
                </FormField>
          <FormField
            disabled={!isPlantSelected}
            control={form.control}
            name="price"
            render={({ field }) => {
              const fieldErrors = errors.findLast(
                (error) => error.field === 'price',
              );
              return (
                <>
                  <FormItem>
                    <FormLabel>Price</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        required
                        placeholder="123,45"
                        onChange={(e) => {
                          field.onChange(e.target.value);
                          form.setValue('price', parseFloat(e.target.value));
                        }}
                      />
                    </FormControl>
                    {fieldErrors && (
                      <FormMessage>{fieldErrors.message}</FormMessage>
                    )}
                  </FormItem>
                </>
              );
            }}
          />

          <FormField
            control={form.control}
            name="amount"
            render={({ field }) => {
              const fieldErrors = errors.findLast(
                (error) => error.field === 'amount',
              );
              return (
                <>
                  <FormItem>
                    <FormLabel>Grams</FormLabel>
                    <FormControl>
                      <Input
                        required
                        type="number"
                        placeholder="0,67"
                        min="0"
                        {...field}
                        onChange={(e) => {
                          field.onChange(e.target.value);
                          form.setValue(
                            'amount',
                            parseFloat(e.target.value),
                          );
                        }}
                      />
                    </FormControl>
                    {fieldErrors && (
                      <FormMessage>{fieldErrors.message}</FormMessage>
                    )}
                  </FormItem>
                </>
              );
            }}
          />
        </form>
      </Form>
    </NewItemModal>
  );
}
