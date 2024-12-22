'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { useTranslations } from 'next-intl'
import { useRouter } from 'next/navigation'
import * as React from 'react'
import { useForm } from 'react-hook-form'

import {
  signInWithPasswordSchema,
  type SignInWithPasswordFormInput,
} from '@/modules/auth/data-access/auth'

import { Icons } from '@/components/generic/Icons'
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
import { useToast } from '@/components/ui/use-toast'
import { siteConfig } from '@/config/site'
import { signInWithPassword } from '@/modules/auth/use-cases/auth'
import { PasswordInput } from '../../signup/components/password-input'

export function SignInWithPasswordForm(): JSX.Element {
  const router = useRouter()
  const { toast } = useToast()
  const [isPending, startTransition] = React.useTransition()
  const [isClient, setIsClient] = React.useState(false)
  const t = useTranslations('Auth.signIn')

  React.useEffect(() => {
    setIsClient(true)
  }, [])

  const form = useForm<SignInWithPasswordFormInput>({
    resolver: zodResolver(signInWithPasswordSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  })

  function onSubmit(formData: SignInWithPasswordFormInput) {
    startTransition(async () => {
      try {
        const loginResult = await signInWithPassword({
          email: formData.email,
          password: formData.password,
        })
        switch (loginResult) {
          case 'invalid-credentials':
            toast({
              title: t('messages.invalidCredentials.title'),
              description: t('messages.invalidCredentials.description'),
              variant: 'destructive',
            })
            break
          case 'success':
            toast({
              title: t('messages.success.title'),
              description: t('messages.success.description'),
            })
            setTimeout(() => {
              router.push(siteConfig.links.members.index)
            }, 700)
            break
          default:
            toast({
              title: t('messages.error.title'),
              description: t('messages.error.description'),
              variant: 'destructive',
            })
        }
      } catch (error) {
        console.error(error)
        toast({
          title: t('messages.generic.title'),
          description: t('messages.generic.description'),
          variant: 'destructive',
        })
      }
    })
  }

  return (
    <Form {...form}>
      <form
        className="grid w-full gap-4"
        onSubmit={(...args) => void form.handleSubmit(onSubmit)(...args)}
      >
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t('form.email.label')}</FormLabel>
              <FormControl>
                <Input
                  type="text"
                  placeholder={t('form.email.placeholder')}
                  {...field}
                />
              </FormControl>
              {isClient && (
                <FormDescription>
                  <p>{t('form.email.demo')}</p>
                </FormDescription>
              )}
              <FormMessage className="pt-2 sm:text-sm" />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t('form.password.label')}</FormLabel>
              <FormControl>
                <PasswordInput
                  placeholder={t('form.password.placeholder')}
                  {...field}
                />
              </FormControl>
              {isClient && (
                <FormDescription>
                  <p>{t('form.password.demo')}</p>
                </FormDescription>
              )}
              <FormMessage className="pt-2 sm:text-sm" />
            </FormItem>
          )}
        />
        <Button disabled={isPending}>
          {isPending ? (
            <>
              <Icons.spinner
                className="mr-2 size-4 animate-spin"
                aria-hidden="true"
              />
              <span>{t('form.button.signingIn')}</span>
            </>
          ) : (
            <span>{t('form.button.signIn')}</span>
          )}
          <span className="sr-only">{t('form.button.srOnly')}</span>
        </Button>
      </form>
    </Form>
  )
}
