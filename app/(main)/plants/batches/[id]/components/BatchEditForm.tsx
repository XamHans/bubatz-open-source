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
import { toDateString } from '@/lib/utils'
import {
  BatchProps,
  UpdateBatchInput,
  updateBatchInputSchema,
} from '@/modules/plants/data-access/schema'
import { GrowPhase } from '@/modules/plants/types'
import { updateBatchUseCase } from '@/modules/plants/use-cases'
import { zodResolver } from '@hookform/resolvers/zod'
import debounce from 'lodash/debounce'
import { useTranslations } from 'next-intl'
import { useAction } from 'next-safe-action/hooks'
import { useCallback, useEffect } from 'react'
import { useForm } from 'react-hook-form'

export interface GrowthPhasesFormProps {
  batch: BatchProps
}

const BatchEditForm = ({ batch }: GrowthPhasesFormProps) => {
  const t = useTranslations()
  const { toast } = useToast()

  const { execute } = useAction(updateBatchUseCase, {
    onSuccess: (data) => {
      console.log('Batch updated successfully', data)
      toast({
        title: t('BatchEdit.messages.success.title'),
        duration: 1000,
        description: t('BatchEdit.messages.success.description'),
      })
    },
    onError: (error) => {
      console.log('Batch could not be updated', error)
      toast({
        title: t('BatchEdit.messages.error.title'),
        variant: 'destructive',
        description: `${t('BatchEdit.messages.error.description')} ${error}`,
      })
    },
  })

  const form = useForm<UpdateBatchInput>({
    resolver: zodResolver(updateBatchInputSchema),
    defaultValues: {
      currentGrowthStage: batch.currentGrowthStage,
      expectedYield: batch.expectedYield?.toString(),
      totalDestroyed: batch.totalDestroyed?.toString(),
      totalYield: batch.totalYield?.toString(),
      endDate: toDateString(batch.endDate),
      startDate: toDateString(batch.startDate),
    },
  })

  const debouncedExecute = useCallback(
    debounce((data: UpdateBatchInput) => {
      const formattedData = {
        ...data,
        startDate: toDateString(data.startDate),
        endDate: toDateString(data.endDate),
      }
      execute(formattedData)
    }, 500),
    [execute],
  )

  useEffect(() => {
    const subscription = form.watch((value, { name, type }) => {
      if (type === 'change') {
        const formData = form.getValues()
        debouncedExecute({ ...batch, ...formData })
      }
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
                <FormLabel>{t('BatchEdit.formLabels.growPhase')}</FormLabel>
                <FormControl>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <SelectTrigger className="w-full">
                      <span>
                        {field.value
                          ? t(`BatchEdit.growPhases.${field.value}`)
                          : t('BatchEdit.placeholders.selectGrowPhase')}
                      </span>
                    </SelectTrigger>
                    <SelectContent>
                      {Object.values(GrowPhase).map((phase) => (
                        <SelectItem key={phase} value={phase}>
                          {t(`BatchEdit.growPhases.${phase}`)}
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
                <FormLabel className="pr-5">
                  {t('BatchEdit.formLabels.endDate')}
                </FormLabel>
                <FormControl>
                  <CustomDatePicker
                    value={field.value}
                    onChange={(date: Date | null) => field.onChange(date)}
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
                <FormLabel>{t('BatchEdit.formLabels.expectedYield')}</FormLabel>
                <FormControl>
                  <Input
                    type="text"
                    placeholder={t('BatchEdit.placeholders.expectedYield')}
                    {...field}
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
                <FormLabel>{t('BatchEdit.formLabels.totalYield')}</FormLabel>
                <FormControl>
                  <Input
                    type="text"
                    placeholder={t('BatchEdit.placeholders.totalYield')}
                    {...field}
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
                <FormLabel>
                  {t('BatchEdit.formLabels.totalDestroyed')}
                </FormLabel>
                <FormControl>
                  <Input
                    type="text"
                    placeholder={t('BatchEdit.placeholders.totalDestroyed')}
                    {...field}
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
