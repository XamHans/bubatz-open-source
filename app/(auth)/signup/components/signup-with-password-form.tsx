'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { useRouter } from 'next/navigation'
import * as React from 'react'
import { useForm } from 'react-hook-form'

import {
  signUpWithPasswordSchema,
  type SignUpWithPasswordFormInput,
} from '@/modules/auth/data-access/auth'

import { Icons } from '@/components/generic/Icons'
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
import { useToast } from '@/components/ui/use-toast'
import { signUpWithPassword } from '@/modules/auth/use-cases/auth'
import { PasswordInput } from './password-input'

export function SignUpWithPasswordForm(): JSX.Element {
  const router = useRouter()
  const { toast } = useToast()
  const [isPending, startTransition] = React.useTransition()

  const form = useForm<SignUpWithPasswordFormInput>({
    resolver: zodResolver(signUpWithPasswordSchema),
    defaultValues: {
      email: '',
      password: '',
      confirmPassword: '',
    },
  })

  function onSubmit(formData: SignUpWithPasswordFormInput): void {
    startTransition(async () => {
      try {
        const message = await signUpWithPassword({
          email: formData.email,
          password: formData.password,
          confirmPassword: formData.confirmPassword,
        })

        switch (message) {
          case 'success':
            toast({
              title: 'Success!',
              description: 'You can now sign in with your email and password',
            })
            router.push('/signin')
            break
          default:
            toast({
              title: 'Something went wrong',
              description: 'Please try again',
              variant: 'destructive',
            })
            console.error(message)
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
        className="grid gap-4"
        onSubmit={(...args) => void form.handleSubmit(onSubmit)(...args)}
      >
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input placeholder="johnsmith@gmail.com" {...field} />
              </FormControl>
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
                <PasswordInput placeholder="**********" {...field} />
              </FormControl>
              <FormMessage className="pt-2 sm:text-sm" />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="confirmPassword"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Confirm Password</FormLabel>
              <FormControl>
                <PasswordInput placeholder="**********" {...field} />
              </FormControl>
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
              <span>Signing up...</span>
            </>
          ) : (
            <span>Continue</span>
          )}
          <span className="sr-only">
            Continue signing up with email and password
          </span>
        </Button>
      </form>
    </Form>
  )
}
