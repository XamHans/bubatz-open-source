'use client'

import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { useToast } from '@/components/ui/use-toast'
import {
  MemberPaymentProps,
  MembershipPaymentSchema,
  UpdateMemberPaymentInput,
  updateMemberPaymentInputSchema,
} from '@/modules/members/data-access/schema'
import { updatePaymentUseCase } from '@/modules/members/use-cases'
import { zodResolver } from '@hookform/resolvers/zod'
import debounce from 'lodash/debounce'
import { useAction } from 'next-safe-action/hooks'
import { useCallback, useEffect } from 'react'
import { useForm } from 'react-hook-form'

interface EditMemberPaymentFormProps {
  payment: MemberPaymentProps
}

export function EditMemberPaymentForm({ payment }: EditMemberPaymentFormProps) {
  const { toast } = useToast()
  console.log('in edit member payment form', payment)
  const form = useForm<UpdateMemberPaymentInput>({
    resolver: zodResolver(updateMemberPaymentInputSchema),
    defaultValues: {
      ...payment,
    },
  })

  const { execute, status } = useAction(updatePaymentUseCase, {
    onSuccess: () => {
      toast({
        title: 'Success',
        duration: 1000,
        description: 'Payment updated successfully',
      })
    },
    onError: (error) => {
      toast({
        title: 'Error',
        variant: 'destructive',
        description: `Payment could not be updated: ${error}`,
      })
    },
  })

  const debouncedExecute = useCallback(
    debounce((data: MembershipPaymentSchema) => {
      execute(data)
    }, 500),
    [execute],
  )

  useEffect(() => {
    const subscription = form.watch((value, { name, type }) => {
      const formData = form.getValues()
      debouncedExecute({ ...payment, ...formData })
    })

    return () => subscription.unsubscribe()
  }, [form, debouncedExecute, payment])

  return (
    <Form {...form}>
      <form className="space-y-8">
        <FormField
          control={form.control}
          name="year"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Year</FormLabel>
              <FormControl>
                <Input {...field} placeholder="YYYY" />
              </FormControl>
              <FormDescription>The year for this payment.</FormDescription>
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
                <Input {...field} type="number" step="0.01" />
              </FormControl>
              <FormDescription>The payment amount in euros.</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="paymentDate"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Payment Date</FormLabel>
              <FormControl>
                <Input {...field} type="date" />
              </FormControl>
              <FormDescription>The date the payment was made.</FormDescription>
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
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a status" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="PAID">Paid</SelectItem>
                  <SelectItem value="PENDING">Pending</SelectItem>
                  <SelectItem value="OVERDUE">Overdue</SelectItem>
                </SelectContent>
              </Select>
              <FormDescription>
                The current status of the payment.
              </FormDescription>
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
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a status" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="CASH">Cash</SelectItem>
                  <SelectItem value="CARD">Card</SelectItem>
                </SelectContent>
              </Select>
              <FormDescription>How the payment was made.</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="notes"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Notes</FormLabel>
              <FormControl>
                <Input {...field} placeholder="Any additional notes" />
              </FormControl>
              <FormDescription>
                Any additional information about the payment.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
      </form>
    </Form>
  )
}
