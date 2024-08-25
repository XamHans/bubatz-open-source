'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';

import { CustomDatePicker } from '@/components/generic/DatePicker';
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
  SelectValue,
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/components/ui/use-toast';
import { siteConfig } from '@/config/site';
import { logger } from '@/lib/logger';
import {
  AddMembershipPaymentInput,
  createMemberPaymentInputSchema,
  paymentStatusEnum,
} from '@/modules/members/data-access/schema';
import { addPaymentUseCase } from '@/modules/members/use-cases';
import { paymentMethods } from '@/modules/sales/data-access/schema';
import { useAction } from 'next-safe-action/hooks';
import { useRouter } from 'next/navigation';
import 'react-datepicker/dist/react-datepicker.css';

export interface CreateMemberPaymentFormProps {
  memberId: string;
}

const CreateMemberPaymentForm = ({
  memberId,
}: CreateMemberPaymentFormProps) => {
  const router = useRouter();
  const { toast } = useToast();

  const { execute, status } = useAction(addPaymentUseCase, {
    onSuccess: () => {
      toast({
        title: 'Success',
        duration: 2000,
        description: 'Payment created successfully',
      });
      setTimeout(() => {
        router.push(
          `${siteConfig.links.members.detail.replace(':id', memberId)}`,
        );
      }, 2000);
    },
    onError: (error) => {
      console.error('Error creating payment', error);
      logger.debug('Error creating payment', error);
      toast({
        title: 'Error',
        variant: 'destructive',
        duration: 3000,
        description: `Payment creation failed: ${error}`,
      });
    },
  });

  const form = useForm<AddMembershipPaymentInput>({
    resolver: zodResolver(createMemberPaymentInputSchema),
    defaultValues: {
      memberId: memberId,
      year: new Date().getFullYear().toString(),
      paymentStatus: 'PENDING',
      paymentMethod: 'CASH',
    },
  });

  const onSubmit = (data: AddMembershipPaymentInput) => {
    logger.info('Creating payment', data);
    execute(data);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <FormField
            control={form.control}
            name="year"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Year</FormLabel>
                <FormControl>
                  <Input type="number" placeholder="Enter year" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="amount"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Amount</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    step="0.01"
                    placeholder="Enter amount"
                    {...field}
                    onChange={(e) => field.onChange(parseFloat(e.target.value))}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="paymentDate"
            render={({ field }) => (
              <FormItem className="w-full">
                <div>
                  <FormLabel>Payment Date</FormLabel>
                </div>
                <FormControl>
                  <CustomDatePicker
                    value={field.value}
                    onChange={field.onChange}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="paymentStatus"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Payment Status</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select status" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {paymentStatusEnum.enumValues.map((status) => (
                      <SelectItem key={status} value={status}>
                        {status}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="paymentMethod"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Payment Method</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select payment method" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {paymentMethods.enumValues.map((method) => (
                      <SelectItem key={method} value={method}>
                        {method}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <FormField
          control={form.control}
          name="notes"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Notes</FormLabel>
              <FormControl>
                <Textarea placeholder="Enter any additional notes" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button
          type="submit"
          disabled={status === 'loading'}
          className="w-full"
        >
          {status === 'loading' ? 'Creating Payment...' : 'Create Payment'}
        </Button>
      </form>
    </Form>
  );
};

export default CreateMemberPaymentForm;
