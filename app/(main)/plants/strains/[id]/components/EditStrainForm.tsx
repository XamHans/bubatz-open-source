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
import { Textarea } from '@/components/ui/textarea'
import { useToast } from '@/components/ui/use-toast'
import {
  StrainProps,
  UpdateStrainInput,
  updateStrainInputSchema,
} from '@/modules/plants/data-access/schema'
import { updateStrainUseCase } from '@/modules/plants/use-cases'
import { zodResolver } from '@hookform/resolvers/zod'
import debounce from 'lodash/debounce'
import { useAction } from 'next-safe-action/hooks'
import { useCallback, useEffect } from 'react'
import { useForm } from 'react-hook-form'

interface EditStrainFormProps {
  strain: StrainProps
}

export function EditStrainForm({ strain }: EditStrainFormProps) {
  const { toast } = useToast()

  const form = useForm<UpdateStrainInput>({
    resolver: zodResolver(updateStrainInputSchema),
    //@ts-ignore
    defaultValues: {
      ...strain,
    },
  })

  const { execute, status } = useAction(updateStrainUseCase, {
    onSuccess: ({}) => {
      toast({
        title: 'Success',
        duration: 1000,
        description: 'Strain updated successfully',
      })
    },
    onError: (error) => {
      toast({
        title: 'Error',
        variant: 'destructive',
        description: `Strain could not be updated ${error}`,
      })
    },
  })

  // Create a debounced version of the execute function
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const debouncedExecute = useCallback(
    debounce((data: UpdateStrainInput) => {
      execute(data)
    }, 500),
    [execute],
  )

  useEffect(() => {
    const subscription = form.watch(() => {
      const formData = form.getValues()
      //@ts-ignore
      debouncedExecute({ ...strain, ...formData })
    })

    return () => subscription.unsubscribe()
  }, [form, debouncedExecute, strain])

  return (
    <Form {...form}>
      <form className="space-y-8">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Name</FormLabel>
              <FormControl>
                <Input placeholder="Strain name" {...field} />
              </FormControl>
              <FormDescription>The name of the strain.</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="thc"
          render={({ field }) => (
            <FormItem>
              <FormLabel>THC Content (%)</FormLabel>
              <FormControl>
                <Input placeholder="THC content" {...field} />
              </FormControl>
              <FormDescription>
                The THC content of the strain (0-100%).
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="cbd"
          render={({ field }) => (
            <FormItem>
              <FormLabel>CBD Content (%)</FormLabel>
              <FormControl>
                <Input placeholder="CBD content" {...field} />
              </FormControl>
              <FormDescription>
                The CBD content of the strain (0-100%).
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="amountAvailable"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Current Amount (in g)</FormLabel>
              <FormControl>
                <Input {...field} value={field.value ?? ''} />
              </FormControl>
              <FormDescription>
                The current amount of the strain available in grams.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Strain description"
                  {...field}
                  value={field.value ?? ''}
                />
              </FormControl>
              <FormDescription>
                A brief description of the strain.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
      </form>
    </Form>
  )
}
