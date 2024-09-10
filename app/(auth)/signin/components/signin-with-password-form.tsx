'use client'

import { zodResolver } from '@hookform/resolvers/zod'
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
          case 'not-registered':
            toast({
              title: 'First things first',
              description:
                'Please make sure you are signed up before signing in',
            })
            break
          case 'incorrect-provider':
            toast({
              title: 'Email already in use with another provider',
              description: 'Perhaps you signed up with a different method?',
            })
            break
          case 'unverified-email':
            toast({
              title: 'First things first',
              description: 'Please verify your email address before signing in',
            })
            break
          case 'invalid-credentials':
            toast({
              title: 'Invalid email or Password',
              description: 'Double-check your credentials and try again',
              variant: 'destructive',
            })
            break
          case 'success':
            toast({
              title: 'Success!',
              description: 'You are now signed in',
            })
            setTimeout(() => {
              router.push(siteConfig.links.members.index)
            }, 700)
            break
          default:
            toast({
              title: 'Error signing in with password',
              description: 'Please try again',
              variant: 'destructive',
            })
        }
      } catch (error) {
        console.error(error)
        toast({
          title: 'Something went wrong',
          description: 'Please try again',
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
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input
                  type="text"
                  placeholder="johnsmith@gmail.com"
                  {...field}
                />
              </FormControl>
              {isClient && (
                <FormDescription>
                  <p>
                    <strong>Email:</strong> demo@bubatz.club
                  </p>
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
              <FormLabel>Password</FormLabel>
              <FormControl>
                <PasswordInput placeholder="********" {...field} />
              </FormControl>
              {isClient && (
                <FormDescription>
                  <p>
                    <strong>Password:</strong> BubatzClubManager123!
                  </p>
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
              <span>Signing in...</span>
            </>
          ) : (
            <span>Sign in</span>
          )}
          <span className="sr-only">Sign in with email and password</span>
        </Button>
      </form>
    </Form>
  )
}
