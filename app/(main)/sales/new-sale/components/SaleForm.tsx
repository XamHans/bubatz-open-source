'use client';

import { useEffect, useState } from 'react';
import SaleItemsTable from './SaleItemsTable';
import CreateSaleItemModal from './CreateSaleItemModal';
import {
  CreateSaleFormInput,
  CreateSaleInput,
  PaymentMethodsType,
  createSaleFormInputSchema,
  SaleItem,
  createSaleInputSchema,
  SaleWithItems,
} from '@/modules/sales/data-access/schema';
import { PaymentMethodsEnum } from '@/modules/sales/data-access/schema';
import { useSession } from 'next-auth/react';
import { UUID } from 'crypto';
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
import { createSaleUseCase } from '@/modules/sales/use-cases';
import { useAction } from 'next-safe-action/hooks';
import { redirect } from 'next/navigation';
import configuration from '@/app/configuration';
import { backToSalesPage } from '@/actions/sales';
import { Ban, PackageCheck, Trash2 } from 'lucide-react';

export default function SaleForm() {
  const [paymentMethods, setPaymentMethods] = useState<PaymentMethodsType[]>([
    PaymentMethodsEnum.enum.CASH,
    PaymentMethodsEnum.enum.CARD,
    PaymentMethodsEnum.enum.WALLET,
  ]);

  const [members, setMembers] = useState<{ id: UUID; name: string }[]>([
    { id: '0d40439d-224d-42d3-96fb-b07e66c6ac78' as UUID, name: 'goncalo' },
    { id: '196eeab1-3369-4563-b8df-2a88cc720e03' as UUID, name: 'andre' },
    { id: '20eaf542-cb38-4ce3-9907-1e9fffee4ec5' as UUID, name: 'johannes' },
  ]); // TODO: Fetch members

  const [saleItems, setSaleItems] = useState<SaleItem[]>([]);
  const [plants, setPlants] = useState<
    { id: number; name: string; price: number }[]
  >([
    { id: 8, name: 'Ganza', price: 14 },
    { id: 9, name: 'Placa', price: 22 },
  ]);
  const session = useSession();

  const createSaleAction = useAction(createSaleUseCase, {
    onSuccess: (result) => {
      if (result.failure) return console.error('error', result.failure);
    },
    onError: (error) => {
      console.error('error aqui?', error);
    },
    onExecute: (input) => {
      console.log('Executing with data: ', input);
    },
  });

  const addItemToSale = (sale: SaleItem) => {
    setSaleItems((prev) => [...prev, sale]);
  };

  const deleteItemFromSale = (item: SaleItem) => {
    setSaleItems((prev) => prev.filter((i) => i !== item));
  };

  const createNewSale = (saleForm: CreateSaleFormInput) => {
    console.log('Creating new sale with form: ', saleForm);
    const parsedForm: CreateSaleInput = {
      ...saleForm,
      totalPrice: parseFloat(saleForm.totalPrice),
      salesById: 'a5ebbad9-43e5-4cc8-ac94-fcd563c5aa51', // ! CHANGE TO FETCH THE CURREND USER LOGGED IN!!!!!!!!
    };

    const parse = createSaleInputSchema.safeParse(parsedForm);
    if (!parse.success) console.log('Error parsing form: ', parse.error.errors);

    // const parsedItems = saleItems.map((item) => ({...item, weightGrams: parseFloat(item.weightGrams)}));
    const saleWithItems = { sale: parsedForm, items: saleItems };
    const saleParse = SaleWithItems.safeParse(saleWithItems);
    if (!saleParse.success)
      console.log('Error parsing sale: ', saleParse.error.errors);
    createSaleAction.execute({ sale: parsedForm, items: saleItems });

    backToSalesPage();
  };

  const handleAbort = () => {
    backToSalesPage();
  };

  /*
   * Calculate the total price of the sale, whenever the sale items change
   * Whenever the total price of the sale changes, update the form value
   */
  useEffect(() => {
    const totalPrice = saleItems.reduce(
      (totalPrice, item) => totalPrice + item.price * item.weightGrams,
      0,
    );

    form.setValue('totalPrice', totalPrice.toString());
    console.log('Sale Items: ', saleItems);
  }, [saleItems]);

  const form = useForm<CreateSaleFormInput>({
    mode: 'onChange',
    resolver: zodResolver(createSaleFormInputSchema),
  });

  return (
    <>
      <SaleItemsTable
        saleItems={saleItems}
        deleteItem={deleteItemFromSale}
        plants={plants}
      />
      <div className="mb-2 flex justify-center">
        <CreateSaleItemModal plants={plants} addItem={addItemToSale} />
      </div>
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
          <div></div>
          <Button type="button" onClick={() => createNewSale(form.getValues())}>
            <PackageCheck /> &nbsp; Create sale
          </Button>
          <Button type="button" onClick={handleAbort}>
            <Ban /> &nbsp; Abort
          </Button>
        </form>
      </Form>
    </>
  );
}
