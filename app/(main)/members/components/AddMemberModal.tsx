'use client';

import { GenericModal } from '@/app/components/GenericModal';
import { Button } from '@/components/ui/button';
import { DialogClose, DialogFooter } from '@/components/ui/dialog';
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
import {
  AddMemberInput,
  addMemberInputSchema,
} from '@/modules/members/data-access/schema';
import { zodResolver } from '@hookform/resolvers/zod';
import { t } from 'i18next';
import { useForm } from 'react-hook-form';

import { ClubMemberStatus } from '@/modules/club/types';
import { addMemberUseCase } from '@/modules/members/use-cases';
import { useAction } from 'next-safe-action/hooks';

const AddMemberModal = () => {
  const { execute, status } = useAction(addMemberUseCase, {
    onSuccess: () => {
      console.log('Member added successfully');
    },
    onError: (error) => {
      console.log('Error adding member', error);
    },
  });

  const form = useForm<AddMemberInput>({
    mode: 'onChange',
    resolver: zodResolver(addMemberInputSchema),
  });

  const onSubmit = async (data: AddMemberInput) => {
    console.log('ADD MEMBER FORM ', data);
    execute(data);
  };

  const handleSave = () => {
    console.log('Save action');
  };

  const handleAbort = () => {
    console.log('Abort action');
  };

  return (
    <GenericModal
      headerTitle="Add Member"
      description="Fill in the details to add a new member."
      onSave={handleSave}
      onAbort={handleAbort}
    >
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="grid gap-2 sm:grid-cols-2 md:gap-4"
        >
          <FormField
            control={form.control}
            name="firstName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t('MEMBER.FIRST_NAME')}</FormLabel>
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
                <FormLabel>{t('MEMBER.LAST_NAME')}</FormLabel>
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
                <FormLabel>{t('GENERAL.PHONE')}</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* <FormField
              control={form.control}
              name="birthday"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t("MEMBER.BIRTHDAY")}</FormLabel>
                  <FormControl>
                    <DatePicker
                      initialVale={field.value}
                      onSelect={handleChange}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            /> */}

          <FormField
            control={form.control}
            name="zip"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t('MEMBER.ZIP')}</FormLabel>
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
                <FormLabel>{t('MEMBER.CITY')}</FormLabel>
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
                <FormLabel>{t('MEMBER.STREET')}</FormLabel>
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
                <FormLabel>{t('MEMBER.STATUS')}</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value={ClubMemberStatus.REQUEST}>
                      {t('MEMBER.STATUS_OPTIONS.REQUEST')}
                    </SelectItem>
                    <SelectItem value={ClubMemberStatus.PENDING}>
                      {t('MEMBER.STATUS_OPTIONS.PENDING')}
                    </SelectItem>
                    <SelectItem value={ClubMemberStatus.ACTIVE}>
                      {t('MEMBER.STATUS_OPTIONS.ACTIVE')}
                    </SelectItem>
                  </SelectContent>
                </Select>
              </FormItem>
            )}
          />

          <DialogFooter className="col-span-2">
            <DialogClose asChild>
              <Button type="submit" disabled={!form?.formState?.isValid}>
                {' '}
                {t('GENERAL.ACTIONS.SAVE')}
              </Button>
            </DialogClose>
          </DialogFooter>
        </form>
      </Form>
    </GenericModal>
  );
};

export { AddMemberModal };
