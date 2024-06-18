'use client';

import { useEffect, useState } from 'react';
import SaleItem from './types';
import SaleItemsTable from './SaleItemsTable';
import CreateSaleItemModal from './CreateSaleItemModal';
import {
  CreateSaleFormInput,
  CreateSaleInput,
  CreateSaleItemInput,
  PaymentMethodsType,
  createSaleFormInputSchema,
  createSaleInputSchema,
} from '@/modules/sales/data-access/schema';
import { PaymentMethodsEnum } from '@/modules/sales/data-access/schema';
import { useSession } from 'next-auth/react';
import { UUID } from 'crypto';
import GenericSelect from '@/components/generic/GenericSelect';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { createSale } from '@/modules/sales/data-access';
import { createSaleUseCase } from '@/modules/sales/use-cases';
import { useAction } from 'next-safe-action/hooks';
import { logger } from '@/logger';

export default function SaleForm() {
  const session = useSession();

  const { execute } = useAction(createSaleUseCase, {
    onSuccess: (result) => {
      console.log('result', result);
    },
    onError: (error) => {
      console.log('error', error);
    },
  });

  const [paymentMethods, setPaymentMethods] = useState<PaymentMethodsType[]>([
    PaymentMethodsEnum.enum.CASH,
    PaymentMethodsEnum.enum.CARD,
    PaymentMethodsEnum.enum.WALLET,
  ]);
  const [members, setMembers] = useState<{ id: UUID; name: string }[]>([
    { id: crypto.randomUUID() as UUID, name: 'goncalo' },
    { id: crypto.randomUUID() as UUID, name: 'andre' },
    { id: crypto.randomUUID() as UUID, name: 'johannes' },
  ]); // TODO: Fetch members
  const [saleItems, setSaleItems] = useState<CreateSaleItemInput[]>([]);
  const [plants, setPlants] = useState<
    { id: UUID; name: string; price: number }[]
  >([]);

  const addItemToSale = (sale: CreateSaleItemInput) => {
    setSaleItems((prev) => [...prev, sale]);
  };

  const deleteItemFromSale = (item: CreateSaleItemInput) => {
    setSaleItems((prev) => prev.filter((i) => i !== item));
  };

  const createNewSale = (saleForm: CreateSaleFormInput) => {
    console.log('Creating new sale', saleForm);
    setS;
    // execute(sale);
  };

  useEffect(() => {
    setSale((prev) => ({
      ...prev,
      totalPrice: saleItems.reduce(
        (totalPrice, item) =>
          totalPrice + parseFloat(item.price) * parseFloat(item.weightGrams),
        0,
      ),
    }));
  }, [saleItems]);

  /*
   * Calculate the total price of the sale, whenever the sale items change
   * Whenever the total price of the sale changes, update the form value
   */
  useEffect(() => {
    const totalPrice = saleItems.reduce(
      (totalPrice, item) =>
        totalPrice + parseFloat(item.price) * parseFloat(item.weightGrams),
      0,
    );

    form.setValue('totalPrice', sale.totalPrice.toString());
  }, [saleItems]);

  useEffect(() => {
    setPlants([
      { id: crypto.randomUUID() as UUID, name: 'Ganza', price: 14 },
      { id: crypto.randomUUID() as UUID, name: 'Placa', price: 22 },
    ]);
  }, []);

  const form = useForm<CreateSaleFormInput>({
    mode: 'onChange',
    resolver: zodResolver(createSaleFormInputSchema),
  });

  return (
    <>
      <CreateSaleItemModal plants={plants} addItem={addItemToSale} />
      <SaleItemsTable
        saleItems={saleItems}
        deleteItem={deleteItemFromSale}
        plants={plants}
      />
      <Form {...form}>
        <form className="grid gap-2 sm:grid-cols-2 md:gap-4">
          <FormField
            control={form.control}
            name="userId"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Member</FormLabel>
                <Select onValueChange={field.onChange}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select member" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {members.map((member, index) => (
                      <SelectItem key={index} value={member.id}>
                        {member.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="paidVia"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Paid Via</FormLabel>
                <Select onValueChange={field.onChange}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select payment method" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {paymentMethods.map((method, index) => (
                      <SelectItem key={index} value={method}>
                        {method}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="totalPrice"
            render={({ field }) => {
              return (
                <FormItem>
                  <FormLabel>Price</FormLabel>
                  <FormControl>
                    <Input disabled {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              );
            }}
          />
          <Button type="button" onClick={() => createNewSale(form.getValues())}>
            Create sale
          </Button>
          <Button type="button">Abort</Button>
        </form>
      </Form>
    </>
  );
}
