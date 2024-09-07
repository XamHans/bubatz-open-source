import { CustomDatePicker } from '@/components/generic/CustomDatePicker'
import {
  Form,
  FormControl,
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
} from '@/components/ui/select'
import { Separator } from '@/components/ui/separator'
import { useToast } from '@/components/ui/use-toast'
import {
  BatchProps,
  UpdateBatchInput,
  updateBatchInputSchema,
} from '@/modules/plants/data-access/schema'
import { GrowPhase } from '@/modules/plants/types'
import { updateBatchUseCase } from '@/modules/plants/use-cases'
import { zodResolver } from '@hookform/resolvers/zod'
import debounce from 'lodash/debounce'
import { useAction } from 'next-safe-action/hooks'
import { useCallback, useEffect } from 'react'
import { useForm } from 'react-hook-form'

export interface GrowthPhasesFormProps {
  batch: BatchProps
}

const BatchEditForm = ({ batch }: GrowthPhasesFormProps) => {
  const { toast } = useToast()

  const { execute } = useAction(updateBatchUseCase, {
    onSuccess: (data) => {
      console.log('Batch updated successfully', data)
      toast({
        title: 'Success',
        duration: 1000,
        description: 'Batch updated successfully',
      })
    },
    onError: (error) => {
      toast({
        title: 'Error',
        variant: 'destructive',
        description: `Batch could not be updated ${error}`,
      })
    },
  })

  const form = useForm<UpdateBatchInput>({
    resolver: zodResolver(updateBatchInputSchema),
    defaultValues: {
      currentGrowthStage: batch.currentGrowthStage,
      expectedYield: batch.expectedYield,
      totalDestroyed: batch.totalDestroyed,
      totalYield: batch.totalYield,
      endDate: batch.endDate || undefined,
    },
  })

  // Create a debounced version of the execute function
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const debouncedExecute = useCallback(
    debounce((data: UpdateBatchInput) => {
      // @ts-ignore
      execute(data)
    }, 500), // 500ms delay
    [execute],
  )

  useEffect(() => {
    const subscription = form.watch(() => {
      const formData = form.getValues()
      debouncedExecute({ ...batch, ...formData })
    })

    return () => subscription.unsubscribe()
  }, [form, debouncedExecute, batch])

  return (
    <>
      <Form {...form}>
        <form className="grid gap-2 sm:grid-cols-2 md:gap-4">
          <FormField
            control={form.control}
            name="currentGrowthStage"
            render={({ field }) => (
              <FormItem className="col-span-2">
                <FormLabel>Select Grow Phase</FormLabel>
                <FormControl>
                  <Select onValueChange={field.onChange}>
                    <SelectTrigger className="w-full">
                      <span>{field.value || 'Select Grow Phase'}</span>
                    </SelectTrigger>
                    <SelectContent>
                      {Object.values(GrowPhase).map((phase) => (
                        <SelectItem key={phase} value={phase}>
                          {phase}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="endDate"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="pr-5">(Estimated) End Date</FormLabel>
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

          <Separator className="col-span-2 my-4" />

          <FormField
            control={form.control}
            name="expectedYield"
            render={({ field }) => (
              <FormItem className="col-span-2">
                <FormLabel>Expected Yield Total (grams)</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Enter expected yield total in grams"
                    {...field}
                    value={field.value ?? ''}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="totalYield"
            render={({ field }) => (
              <FormItem className="col-span-2">
                <FormLabel>Yield Total (grams)</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Enter yield total in grams"
                    {...field}
                    value={field.value ?? ''}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="totalDestroyed"
            render={({ field }) => (
              <FormItem className="col-span-2">
                <FormLabel>Destroyed Total (grams)</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Enter destroyed total in grams"
                    {...field}
                    value={field.value ?? ''}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </form>
      </Form>
    </>
  )
}

export { BatchEditForm }
