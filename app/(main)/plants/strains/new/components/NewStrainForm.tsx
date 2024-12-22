'use client'

import { Button } from '@/components/ui/button'
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
import { siteConfig } from '@/config/site'
import {
  CreateStrainInput,
  createStrainInputSchema,
} from '@/modules/plants/data-access/schema'
import { createStrainUseCase } from '@/modules/plants/use-cases'
import { zodResolver } from '@hookform/resolvers/zod'
import { useAction } from 'next-safe-action/hooks'
import { useTranslations } from 'next-intl'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'

export default function NewStrainForm() {
  const router = useRouter()
  const { toast } = useToast()
  const t = useTranslations('Plants.newStrain')

  const { execute, status } = useAction(createStrainUseCase, {
    onSuccess: (data) => {
      toast({
        title: t('messages.success.title'),
        duration: 1000,
        description: t('messages.success.description'),
      })
      setTimeout(() => {
        router.push(`${siteConfig.links.plants.index}`)
      })
    },
    onError: (error) => {
      toast({
        title: t('messages.error.title'),
        variant: 'destructive',
        duration: 1000,
        description: t.raw('messages.error.description')({ error }),
      })
    },
  })

  const form = useForm<CreateStrainInput>({
    resolver: zodResolver(createStrainInputSchema),
    defaultValues: {
      name: '',
      description: '',
      thc: 0,
      cbd: 0,
      currentPricePerGram: 0,
      amountAvailable: 0,
    },
  })

  const onSubmit = (data: CreateStrainInput) => {
    execute(data)
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t('form.name.label')}</FormLabel>
              <FormControl>
                <Input placeholder={t('form.name.placeholder')} {...field} />
              </FormControl>
              <FormDescription>{t('form.name.description')}</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t('form.description.label')}</FormLabel>
              <FormControl>
                <Textarea
                  placeholder={t('form.description.placeholder')}
                  value={field.value ?? ''}
                  onChange={field.onChange}
                />
              </FormControl>
              <FormDescription>
                {t('form.description.description')}
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="thc"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t('form.thc.label')}</FormLabel>
              <FormControl>
                <Input
                  type="number"
                  step="0.1"
                  {...field}
                  onChange={(e) => field.onChange(parseFloat(e.target.value))}
                />
              </FormControl>
              <FormDescription>{t('form.thc.description')}</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="cbd"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t('form.cbd.label')}</FormLabel>
              <FormControl>
                <Input
                  type="number"
                  step="0.1"
                  {...field}
                  onChange={(e) => field.onChange(parseFloat(e.target.value))}
                />
              </FormControl>
              <FormDescription>{t('form.cbd.description')}</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="currentPricePerGram"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t('form.price.label')}</FormLabel>
              <FormControl>
                <Input
                  type="number"
                  step="0.01"
                  {...field}
                  onChange={(e) => field.onChange(parseFloat(e.target.value))}
                />
              </FormControl>
              <FormDescription>{t('form.price.description')}</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="amountAvailable"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t('form.amount.label')}</FormLabel>
              <FormControl>
                <Input
                  type="number"
                  step="1"
                  {...field}
                  onChange={(e) => field.onChange(parseFloat(e.target.value))}
                />
              </FormControl>
              <FormDescription>{t('form.amount.description')}</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit" disabled={status === 'executing'}>
          {status === 'executing'
            ? t('form.submit.creating')
            : t('form.submit.create')}
        </Button>
      </form>
    </Form>
  )
}
