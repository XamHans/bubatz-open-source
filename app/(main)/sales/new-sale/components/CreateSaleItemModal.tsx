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
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';

import { ClubMemberStatus } from '@/modules/club/types';
import { useAction } from 'next-safe-action/hooks';
import { GenericModal } from '@/components/generic/GenericModal';
import { useState } from 'react';
import { createSaleInputSchema } from '@/modules/sales/data-access/schema';
import { DropdownMenu, DropdownMenuItem } from '@/components/ui/dropdown-menu';
import SaleItem from './types';
import { Checkbox } from '@/components/ui/checkbox';

interface CreateSaleItemModalProps {
  plants: { name: string; price: number }[];
  addItem: (item: SaleItem) => void;
}

export default function CreateSaleItemModal(props: CreateSaleItemModalProps) {
  const form = useForm<SaleItem>({
    mode: 'onSubmit',
    //resolver: zodResolver(createSaleInputSchema),
  });

  const handleSave = (data: SaleItem) => {
    data = { ...data, totalPrice: data.price * data.weightGrams };
    console.log('data', data);
    props.addItem(data);
  };

  const handleAbort = () => {
    console.log('Abort action');
  };

  /**
   * ! WHEN CHANGING THE VALUE FROM SELECT, ITS GIVES AN ERROR ON RELATED TO UNCONTROLLED INPUTS. I DONT KNOW WHAT IT IS,
   * ! OR HOW TO FIX IT. BUT ITS WORKING FINE. :D
   */
  return (
    <GenericModal
      headerTitle="Add an item"
      description="Fill in the details to add a new item to this sale."
      onSave={() => handleSave(form.getValues())}
      onAbort={handleAbort}
    >
      <Form {...form}>
        <form className="grid gap-2 sm:grid-cols-2 md:gap-4">
          <FormField
            control={form.control}
            name="plantName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Plant</FormLabel>
                <Select
                  onValueChange={(value) => {
                    field.onChange(value);
                    form.setValue(
                      'price',
                      props.plants.find((plant) => plant.name === value)
                        ?.price as number,
                    );
                  }}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {props.plants.map((plant) => (
                      <SelectItem key={plant.name} value={plant.name}>
                        {plant.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="price"
            render={({ field }) => (
              <FormItem>
                {/* <FormLabel>{t('MEMBER.LAST_NAME')}</FormLabel> */}
                <FormLabel>Price</FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    onChange={(e) => {
                      field.onChange(e.target.value);
                      field.value = e.target.value as unknown as number;
                    }}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          {/* <FormField
            control={form.control}
            name="enableCustomPrice"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Enable custom price?</FormLabel>
                <FormControl>
                  <Checkbox {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          /> */}

          <FormField
            control={form.control}
            name="weightGrams"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Weight</FormLabel>
                <FormControl>
                  <Input placeholder="Weight" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </form>
      </Form>
    </GenericModal>
  );
}
