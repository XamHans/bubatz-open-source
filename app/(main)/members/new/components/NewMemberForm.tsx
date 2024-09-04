'use client'

import { Button } from '@/components/ui/button'
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
import { siteConfig } from '@/config/site'
import {
  AddMemberInput,
  addMemberInputSchema,
} from '@/modules/members/data-access/schema'
import { ClubMemberRoles, ClubMemberStatus } from '@/modules/members/types'
import { addMemberUseCase } from '@/modules/members/use-cases'
import { zodResolver } from '@hookform/resolvers/zod'
import { useTranslations } from 'next-intl'
import { useAction } from 'next-safe-action/hooks'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'

export default function NewMemberForm() {
  const t = useTranslations('Members')
  const g = useTranslations('General')

  const router = useRouter()
  const { toast } = useToast()

  const { execute, status } = useAction(addMemberUseCase, {
    onSuccess: ({ data }) => {
      toast({
        title: t('messages.create.success.title'),
        duration: 1000,
        description: t('messages.create.success.description'),
      })
      setTimeout(() => {
        if (!data?.success?.id) return
        router.push(
          `${siteConfig.links.members.detail.replace(':id', data?.success?.id)}`,
        )
      }, 1000)
    },
    onError: (error) => {
      console.warn('error', error)
      toast({
        title: t('messages.create.error.title'),
        variant: 'destructive',
        duration: 50000,
        description: t('messages.create.error.description', {
          error: error.error.serverError,
        }),
      })
    },
  })

  const form = useForm<AddMemberInput>({
    mode: 'onTouched',
    resolver: zodResolver(addMemberInputSchema),
    defaultValues: {
      status: ClubMemberStatus.REQUEST,
      role: ClubMemberRoles.MEMBER,
      firstName: '',
      lastName: '',
      city: '',
      street: '',
      zip: '',
    },
  })

  const handleSave = (data: AddMemberInput) => {
    console.log('data after submit', data)

    // Validate birthday
    if (!data.birthday) {
      form.setError('birthday', {
        type: 'manual',
        message: t('form.errors.birthdayRequired'),
      })
      return
    }

    execute(data)
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(handleSave)}
        className="grid gap-2 sm:grid-cols-2 md:gap-4"
      >
        <FormField
          control={form.control}
          name="firstName"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t('form.labels.firstName')}</FormLabel>
              <FormControl>
                <Input {...field} />
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
              <FormLabel>{t('form.labels.lastName')}</FormLabel>
              <FormControl>
                <Input {...field} />
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
              <FormLabel>{t('form.labels.email')}</FormLabel>
              <FormControl>
                <Input {...field} />
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
              <FormLabel>{t('form.labels.phone')}</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="birthday"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t('form.labels.birthday')}</FormLabel>
              <FormControl>
                <Input {...field} />
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
              <FormLabel>{t('form.labels.zip')}</FormLabel>
              <FormControl>
                <Input {...field} />
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
              <FormLabel>{t('form.labels.city')}</FormLabel>
              <FormControl>
                <Input {...field} />
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
              <FormLabel>{t('form.labels.street')}</FormLabel>
              <FormControl>
                <Input {...field} />
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
              <FormLabel>{t('form.labels.status')}</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value={ClubMemberStatus.REQUEST}>
                    {t('form.options.status.REQUEST')}
                  </SelectItem>
                  <SelectItem value={ClubMemberStatus.ACTIVE}>
                    {t('form.options.status.ACTIVE')}
                  </SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="role"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t('form.labels.role')}</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="MEMBER">
                    {t('form.options.role.member')}
                  </SelectItem>
                  <SelectItem value="ADMIN">
                    {t('form.options.role.admin')}
                  </SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button className="md:mt-8" type="submit">
          {g('form.buttons.save')}
        </Button>
      </form>
    </Form>
  )
}
