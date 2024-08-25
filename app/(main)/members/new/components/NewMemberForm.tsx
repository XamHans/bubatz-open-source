'use client';

import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useToast } from '@/components/ui/use-toast';
import { siteConfig } from '@/config/site';
import {
  AddMemberInput,
  addMemberInputSchema,
} from '@/modules/members/data-access/schema';
import { ClubMemberRoles, ClubMemberStatus } from '@/modules/members/types';
import { addMemberUseCase } from '@/modules/members/use-cases';
import { zodResolver } from '@hookform/resolvers/zod';
import { useAction } from 'next-safe-action/hooks';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';

export default function NewMemberForm() {
  const router = useRouter();
  const { toast } = useToast();

  const { execute, status } = useAction(addMemberUseCase, {
    onSuccess: ({ data }) => {
      toast({
        title: 'Success',
        duration: 1000,
        description: 'Member created successfully',
      });
      console.log('data success', data);
      setTimeout(() => {
        if (!data?.success?.id) return;
        router.push(
          `${siteConfig.links.members.detail.replace(':id', data?.success?.id)}`,
        );
      }, 1000);
    },
    onError: (error) => {
      console.warn('error', error);
      toast({
        title: 'Error',
        variant: 'destructive',
        duration: 50000,
        description: `Member creation failed, ${error.error.serverError}`,
      });
    },
  });

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
  });

  const handleSave = (data: AddMemberInput) => {
    console.log('data after submit', data);

    // Validate birthday
    if (!data.birthday) {
      form.setError('birthday', {
        type: 'manual',
        message: 'Birthday is required',
      });
      return;
    }

    execute(data);
  };

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
              <FormLabel>First Name</FormLabel>
              <FormControl>
                <Input placeholder="Enter first name" {...field} />
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
                <Input placeholder="Enter last name" {...field} />
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
                <Input placeholder="Enter email" {...field} />
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
                <Input placeholder="Enter phone number" {...field} />
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
              <FormLabel>Date of Birth</FormLabel>
              <FormControl>
                <Input placeholder="DD.MM.YYYY" {...field} />
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
                <Input placeholder="Enter zip code" {...field} />
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
              <FormLabel>City</FormLabel>
              <FormControl>
                <Input placeholder="Enter city's name" {...field} />
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
              <FormLabel>Street</FormLabel>
              <FormControl>
                <Input placeholder="Enter street" {...field} />
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
              <FormLabel>Status</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value={ClubMemberStatus.REQUEST}>
                    Request
                  </SelectItem>

                  <SelectItem value={ClubMemberStatus.ACTIVE}>
                    Active
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

        <Button className="md:mt-8" type="submit">
          Save
        </Button>
      </form>
    </Form>
  );
}
