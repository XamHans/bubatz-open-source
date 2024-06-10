'use client';

import { useEffect, useState } from 'react';
import SaleItem from './types';
import SaleItemsTable from './SaleItemsTable';
import CreateSaleItemModal from './CreateSaleItemModal';
import {
  CreateSaleInput,
  CreateSaleItemInput,
  PaymentMethodsType,
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
  const [sale, setSale] = useState<CreateSaleInput>({
    totalPrice: 0,
    paidVia: 'CASH',
    userId: '',
    salesById: session.data?.user.id ?? '',
  });

  const addItemToSale = (sale: CreateSaleItemInput) => {
    setSaleItems((prev) => [...prev, sale]);
  };

  const deleteItemFromSale = (item: CreateSaleItemInput) => {
    setSaleItems((prev) => prev.filter((i) => i !== item));
  };

  const createNewSale = (sale: CreateSaleInput) => {
    execute(sale);
  };

  // Calculate the total price of the sale, whenever the sale items change
  useEffect(() => {
    setSale((prev) => ({
      ...prev,
      totalPrice: saleItems.reduce(
        (totalPrice, item) => totalPrice + item.price * item.weightGrams,
        0,
      ),
    }));
  }, [saleItems]);

  useEffect(() => {
    setPlants([
      { id: crypto.randomUUID() as UUID, name: 'Ganza', price: 14 },
      { id: crypto.randomUUID() as UUID, name: 'Placa', price: 22 },
    ]);
  }, []);

  const form = useForm<CreateSaleInput>({
    mode: 'onChange',
    resolver: zodResolver(createSaleInputSchema),
  });

  return (
    <>
      <CreateSaleItemModal plants={plants} addItem={addItemToSale} />
      {saleItems.length > 0 ? (
        <>
          <SaleItemsTable
            saleItems={saleItems}
            deleteItem={deleteItemFromSale}
            plants={plants}
          />
        </>
      ) : (
        <div>There are no items in the sale. Start by adding an item.</div>
      )}
      <Form {...form}>
        <form className="grid gap-2 sm:grid-cols-2 md:gap-4">
          <FormField
            control={form.control}
            name="userId"
            render={() => (
              <FormItem>
                <FormLabel>Member</FormLabel>
                <Select
                  onValueChange={(value) => {
                    form.setValue('userId', value);
                  }}
                >
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
            render={() => (
              <FormItem>
                <FormLabel>Paid Via</FormLabel>
                <Select
                  onValueChange={(value: PaymentMethodsType) => {
                    form.setValue('paidVia', value);
                  }}
                >
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
            disabled={true}
            control={form.control}
            name="totalPrice"
            render={({ field }) => {
              return (
                <>
                  <FormItem>
                    <FormLabel>Price</FormLabel>
                    <FormControl>
                      <Input {...field} value={sale.totalPrice} />
                    </FormControl>
                  </FormItem>
                </>
              );
            }}
          />
          <Button
            type="button"
            onClick={() => {
              setSale((prev) => ({
                ...prev,
                userId: form.getValues().userId,
                paidVia: form.getValues().paidVia,
              }));
              console.log('sale', sale);
              createNewSale(sale);
            }}
          >
            Create sale
          </Button>
          <Button type="button">Abort</Button>
        </form>
      </Form>
    </>
  );
}
