/* eslint-disable */
// @ts-nocheck
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
  MemberProps,
  UpdateMemberInput,
  updateMemberInputSchema,
} from '@/modules/members/data-access/schema'
import { ClubMemberStatus } from '@/modules/members/types'
import { updateMemberUseCase } from '@/modules/members/use-cases'

import { zodResolver } from '@hookform/resolvers/zod'
import debounce from 'lodash/debounce'
import { Session } from 'next-auth'
import { useAction } from 'next-safe-action/hooks'
import { useCallback, useEffect } from 'react'
import { useForm } from 'react-hook-form'

interface EditMemberFormProps {
  member: MemberProps
  session: Session
}

export function EditMemberForm({ member, session }: EditMemberFormProps) {
  const { toast } = useToast()

  const form = useForm<UpdateMemberInput>({
    resolver: zodResolver(updateMemberInputSchema),
    defaultValues: {
      ...member,
    },
  })

  const { execute, status } = useAction(updateMemberUseCase, {
    onSuccess: ({ data }) => {
      toast({
        title: 'Success',
        duration: 1000,
        description: 'Member updated successfully',
      })
    },
    onError: ({ error }) => {
      console.log(error)
      toast({
        title: 'Error',
        variant: 'destructive',
        description: `Member could not be updated ${JSON.stringify(error)}`,
      })
    },
  })

  // Create a debounced version of the execute function
  const debouncedExecute = useCallback(
    debounce((data: UpdateMemberInput) => {
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
              <FormLabel>First Name</FormLabel>
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
              <FormLabel>Last Name</FormLabel>
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
              <FormLabel>Email</FormLabel>
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
              <FormLabel>Phone Number</FormLabel>
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
              <FormLabel>Zip Code</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="city"
          render={({ field }) => (
            <FormItem>
              <FormLabel>City Name</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="street"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Street</FormLabel>
              <FormControl>
                <Input placeholder="Enter street" {...field} />
              </FormControl>
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="status"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Status</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {Object.values(ClubMemberStatus).map((status) => (
                    <SelectItem key={status} value={status}>
                      {status}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="birthday"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="block py-1">Birthday</FormLabel>
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
              <FormLabel>Role</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="MEMBER">Member</SelectItem>
                  <SelectItem value="ADMIN">Admin</SelectItem>
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
