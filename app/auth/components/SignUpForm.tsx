'use client';

import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { toast } from '@/components/ui/use-toast';
import { cn } from '@/lib/utils';
import { zodResolver } from '@hookform/resolvers/zod';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { FaGithub, FaSpinner } from 'react-icons/fa';
import { z } from 'zod';

const signUpSchema = z
  .object({
    email: z
      .string()
      .email('Invalid email address')
      .min(5, 'Email must be at least 5 characters long')
      .max(255, 'Email must be at most 255 characters long'),
    password: z.string().min(8, 'Password must be at least 8 characters long'),
    repeatPassword: z
      .string()
      .min(8, 'Password must be at least 8 characters long'),
  })
  .refine((data) => data.password === data.repeatPassword, {
    message: "Passwords don't match",
    path: ['repeatPassword'], // path of error
  });

type signUpInput = z.infer<typeof signUpSchema>;

export function SignUpForm() {
  const supabase = createClientComponentClient();
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const form = useForm<signUpInput>({
    resolver: zodResolver(signUpSchema),
    defaultValues: {
      email: '',
      password: '',
      repeatPassword: '',
    },
  });

  async function onSubmit(values: signUpInput) {
    setIsLoading(true);
    console.log(values);
    const signUpResult = await supabase.auth.signUp({
      email: values.email,
      password: values.password,
    });
    console.log({ signUpResult });
    if (signUpResult.error) {
      return toast({
        title: 'Error',
        description: signUpResult.error.message,
        variant: 'destructive',
      });
    }
    setIsLoading(false);
    toast({
      title: 'Success',
      description: 'Sign up successful',
    });
  }

  return (
    <div className={cn('grid gap-2')}>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-4'>
          <FormField
            control={form.control}
            name='email'
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input placeholder='joe@johnson.com' {...field} />
                </FormControl>

                {/* this shows the error message */}
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name='password'
            render={({ field }) => (
              <FormItem>
                <FormLabel>Password</FormLabel>
                <FormControl>
                  <Input type='password' {...field} />
                </FormControl>
                <FormDescription>
                  Please enter your Password, it must be at least 8 characters
                  long
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name='repeatPassword'
            render={({ field }) => (
              <FormItem>
                <FormLabel>Repeat Password</FormLabel>
                <FormControl>
                  <Input type='password' {...field} />
                </FormControl>
                <FormDescription>Please re-enter your password</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button className='w-full md:mb-2 md:mt-2' type='submit'>
            Submit
          </Button>
        </form>
      </Form>

      <div className='relative'>
        <div className='absolute inset-0 flex items-center'>
          <span className='w-full border-t' />
        </div>
        <div className='relative flex justify-center text-xs uppercase'>
          <span className='bg-background px-2 text-muted-foreground'>
            Or continue with
          </span>
        </div>
      </div>
      <Button variant='outline' type='button' disabled={isLoading}>
        {isLoading ? (
          <FaSpinner className='mr-2 h-4 w-4 animate-spin' />
        ) : (
          <FaGithub className='mr-2 h-4 w-4' />
        )}{' '}
        GitHub
      </Button>
    </div>
  );
}
