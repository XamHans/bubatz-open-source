'use client';

import { useContext, useEffect, useState } from 'react';
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
import { backToSalesPage } from '@/actions/sales';
import { Ban, Loader2Icon, PackageCheck } from 'lucide-react';
import { NewSaleContext } from '../page';
import { useSession } from 'next-auth/react';

export default function SaleForm() {
  const { data: session } = useSession(); // get the client session
  const { members, strains, isFetching } = useContext(NewSaleContext);

  // ------------------- States -------------------
  const [paymentMethods] = useState<PaymentMethodsType[]>([
    PaymentMethodsEnum.enum.CASH,
    PaymentMethodsEnum.enum.CARD,
    PaymentMethodsEnum.enum.WALLET,
  ]);

  const [saleItems, setSaleItems] = useState<SaleItem[]>([]);

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

  // ------------------- Functions -------------------

  const addItemToSale = (sale: SaleItem) => {
    setSaleItems((prev) => [...prev, sale]);
  };

  const deleteItemFromSale = (item: SaleItem) => {
    setSaleItems((prev) => prev.filter((i) => i !== item));
  };

  const createNewSale = (saleForm: CreateSaleFormInput) => {
    console.log('Creating new sale with form: ', saleForm);

    if (!session) return console.error('No session found');

    const parsedForm: CreateSaleInput = {
      ...saleForm,
      totalPrice: parseFloat(saleForm.totalPrice),
      salesById: session.user.id || '',
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

  // useEffect(() => {
  //   fetchMembers.execute({});
  //   fetchStrains.execute({});
  // }, []);

  // ------------------- Render -------------------

  const form = useForm<CreateSaleFormInput>({
    mode: 'onChange',
    resolver: zodResolver(createSaleFormInputSchema),
  });

  return (
    <>
      {isFetching ? (
        <Loader2Icon />
      ) : (
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
              <Button
                type="button"
                onClick={() => createNewSale(form.getValues())}
              >
                <PackageCheck /> &nbsp; Create sale
              </Button>
              <Button type="button" onClick={handleAbort}>
                <Ban /> &nbsp; Abort
              </Button>
            </form>
          </Form>
        </>
      )}
    </>
  );
}
