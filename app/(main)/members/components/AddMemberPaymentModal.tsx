'use client';

import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { addMemberPaymentUseCase } from '@/modules/members/use-cases';
import { zodResolver } from '@hookform/resolvers/zod';
import { useAction } from 'next-safe-action/hooks';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

const formSchema = z.object({
  amount: z.number().min(0, 'Amount must be a positive number'),
  year: z.number().int().min(2000, 'Year must be 2000 or later'),
});

interface AddMemberPaymentModalProps {
  memberId: string;
  onSuccess?: () => void;
}

export function AddMemberPaymentModal({
  memberId,
  onSuccess,
}: AddMemberPaymentModalProps) {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      amount: 0,
      year: new Date().getFullYear(),
    },
  });

  const { execute, status } = useAction(addMemberPaymentUseCase, {
    onSuccess: () => {
      form.reset();
      onSuccess?.();
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    execute({ ...values, memberId });
  }

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline">Add Payment</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Add Member Payment</DialogTitle>
          <DialogDescription>
            Enter the payment details for the member.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
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
              name="year"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Year</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      {...field}
                      onChange={(e) => field.onChange(parseInt(e.target.value))}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <DialogFooter>
              <Button type="submit" disabled={status === 'executing'}>
                {status === 'executing' ? 'Adding...' : 'Add Payment'}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
