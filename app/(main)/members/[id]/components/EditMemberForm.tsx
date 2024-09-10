'use client'

import { BirthdayPicker } from '@/components/generic/BirthdayPicker'
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
  SelectValue,
} from '@/components/ui/select'
import { useToast } from '@/components/ui/use-toast'
import {
  UpdateMemberInput,
  updateMemberInputSchema,
} from '@/modules/members/data-access/schema'
import { updateMemberUseCase } from '@/modules/members/use-cases'

import { zodResolver } from '@hookform/resolvers/zod'
import debounce from 'lodash/debounce'
import { Session } from 'next-auth'
import { useTranslations } from 'next-intl'
import { useAction } from 'next-safe-action/hooks'
import { useCallback, useEffect } from 'react'
import { useForm } from 'react-hook-form'

interface EditMemberFormProps {
  member: any
  session: Session | null
}

export function EditMemberForm({ member, session }: EditMemberFormProps) {
  const { toast } = useToast()
  const t = useTranslations('General.form')
  const m = useTranslations('MembersEdit')

  const form = useForm<UpdateMemberInput>({
    resolver: zodResolver(updateMemberInputSchema),
    defaultValues: {
      ...member,
      status: member.status ?? 'REQUEST',
      role: member.role ?? 'MEMBER',
    },
  })

  const { execute, status } = useAction(updateMemberUseCase, {
    onSuccess: ({ data }) => {
      toast({
        title: m('messages.success.title'),
        duration: 1000,
        description: m('messages.success.description'),
      })
    },
    onError: ({ error }) => {
      console.log(error)
      toast({
        title: m('messages.error.title'),
        variant: 'destructive',
        description: m('messages.error.description'),
      })
    },
  })

  const debouncedExecute = useCallback(
    debounce((data: UpdateMemberInput) => {
      console.log('data to execute ', data)
      execute(data)
    }, 500),
    [execute],
  )

  useEffect(() => {
    const subscription = form.watch((value, { name, type }) => {
      const formData = form.getValues()
      debouncedExecute({ ...member, ...formData })
    })

    return () => subscription.unsubscribe()
  }, [form, debouncedExecute, member])

  return (
    <Form {...form}>
      <form className="grid gap-2 sm:grid-cols-2 md:gap-4">
        <FormField
          control={form.control}
          name="firstName"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t('labels.firstName')}</FormLabel>
              <FormControl>
                <Input {...field} value={field.value ?? ''} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="lastName"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t('labels.lastName')}</FormLabel>
              <FormControl>
                <Input {...field} value={field.value ?? ''} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t('labels.email')}</FormLabel>
              <FormControl>
                <Input {...field} value={field.value ?? ''} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="phone"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t('labels.phone')}</FormLabel>
              <FormControl>
                <Input {...field} value={field.value ?? ''} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="zip"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t('labels.zip')}</FormLabel>
              <FormControl>
                <Input {...field} value={field.value ?? ''} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="city"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t('labels.city')}</FormLabel>
              <FormControl>
                <Input {...field} value={field.value ?? ''} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="street"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t('labels.street')}</FormLabel>
              <FormControl>
                <Input {...field} value={field.value ?? ''} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="status"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t('labels.status')}</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="ACTIVE">
                    {t('options.status.ACTIVE')}
                  </SelectItem>
                  <SelectItem value="PAUSED">
                    {t('options.status.PAUSED')}
                  </SelectItem>
                  <SelectItem value="EXITED">
                    {t('options.status.EXITED')}
                  </SelectItem>
                  <SelectItem value="REQUEST">
                    {t('options.status.REQUEST')}
                  </SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="birthday"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="block py-1">
                {t('labels.birthday')}
              </FormLabel>
              <FormControl>
                <BirthdayPicker
                  initialDate={field.value}
                  onChange={(date) => field.onChange(date)}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="role"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t('labels.role')}</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="MEMBER">
                    {t('options.role.member')}
                  </SelectItem>
                  <SelectItem value="ADMIN">
                    {t('options.role.admin')}
                  </SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
      </form>
    </Form>
  )
}
