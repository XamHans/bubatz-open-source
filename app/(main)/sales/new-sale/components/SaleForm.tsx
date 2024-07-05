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
import { createSaleUseCase, fetchSaleUseCase } from '@/modules/sales/use-cases';
import { useAction } from 'next-safe-action/hooks';
import { redirect } from 'next/navigation';
import configuration from '@/app/configuration';
import { backToSalesPage } from '@/actions/sales';
import { Ban, PackageCheck, Trash2 } from 'lucide-react';
import { fetchMembersUseCase } from '@/modules/members/use-cases';
import { UserSchema } from '@/modules/members/data-access/schema';
import {
  fetchPlantsUseCase,
  fetchStrainsUseCase,
} from '@/modules/plants/use-cases';
import {
  StrainProps,
  getStrainsSchema,
} from '@/modules/plants/data-access/schema';

export default function SaleForm() {
  const [paymentMethods, setPaymentMethods] = useState<PaymentMethodsType[]>([
    PaymentMethodsEnum.enum.CASH,
    PaymentMethodsEnum.enum.CARD,
    PaymentMethodsEnum.enum.WALLET,
  ]);

  const [members, setMembers] = useState<UserSchema[]>([]);

  const [saleItems, setSaleItems] = useState<SaleItem[]>([]);
  const [strains, setStrains] = useState<StrainProps[]>([]);

  // ------------------- Use Cases -------------------

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

  const fetchMembers = useAction(fetchMembersUseCase, {
    onSuccess: (data) => {
      // Sort members by full name
      data.members.sort((a, b) => {
        const aFullName = a.firstName + ' ' + a.lastName;
        const bFullName = b.firstName + ' ' + b.lastName;
        return aFullName.localeCompare(bFullName);
      });
      setMembers((prev) => data.members);
    },
  });

  const fetchStrains = useAction(fetchStrainsUseCase, {
    onSuccess: (data) => {
      const parsedStrains: StrainProps[] = [];
      data.strains.forEach((strain) => {
        const parse = getStrainsSchema.safeParse(strain);
        if (parse.success) parsedStrains.push(parse.data);
        else console.error('Error parsing strain: ', parse.error.errors);
      });
      console.log('parsedStrains', parsedStrains);
      setStrains(() => parsedStrains);
    },
  });

  // ------------------- Functions -------------------

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

  // ------------------- Effects -------------------

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
  }, [saleItems]);

  useEffect(() => {
    fetchMembers.execute({});
    fetchStrains.execute({});
  }, []);

  // ------------------- Render -------------------

  const form = useForm<CreateSaleFormInput>({
    mode: 'onChange',
    resolver: zodResolver(createSaleFormInputSchema),
  });

  return (
    <>
      <SaleItemsTable
        saleItems={saleItems}
        deleteItem={deleteItemFromSale}
        strains={strains}
      />
      <div className="mb-3 mt-2 flex justify-center">
        <CreateSaleItemModal strains={strains} addItem={addItemToSale} />
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
                        {member.fullName}
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
