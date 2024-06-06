'use client';

import { GenericModal } from '@/components/generic/GenericModal';
import {
  GetMemberDetailQueryData,
  updateMember,
} from '@/modules/members/data-access/index';
import { ClubMemberStatus, UpdateMemberInput } from '@/modules/members/types';
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
import { zodResolver } from '@hookform/resolvers/zod';
import { t } from 'i18next';
import { SubmitHandler, useForm } from 'react-hook-form';

export interface EditMemberModalProps {
  member: GetMemberDetailQueryData;
}

import { z } from 'zod';
import { useState } from 'react';
import { useAction } from 'next-safe-action/hooks';
import { updateMemberUseCase } from '@/modules/members/use-cases';

export const memberProfileSchema = z.object({
  firstName: z.string().min(3, { message: 'First name is required' }),
  lastName: z.string().min(3, { message: 'Last name is required' }),
});

const EditMemberModal = ({ member }: EditMemberModalProps) => {
  // member could be passed from context or parent component, if not available, do not render
  // const { showSuccessToast } = useToast()

  const form = useForm<UpdateMemberInput>({
    defaultValues: {
      firstName: member.firstName ?? '',
      lastName: member.lastName ?? '',
      // birthday: new Date(member.birthday),
      status: member.status ?? '',
      city: member.city ?? '',
      email: member.email ?? '',
      phone: member.phone ?? '',
      street: member.street ?? '',
      zip: member.zip ?? '',
    },
    mode: 'onBlur',
    resolver: zodResolver(memberProfileSchema),
  });

  const onSubmit: SubmitHandler<UpdateMemberInput> = async (data) => {
    console.log('ON SUBMIT HANDLER REACHED');
    try {
      const result = await updateMember(member.id, data);
      console.log('Member updated successfully:', result);
    } catch (error) {
      console.error('Failed to update member:', (error as Error).message);
    }
  };

  const { execute, status } = useAction(updateMemberUseCase, {
    onSuccess: (data) => {
      console.log('Member added successfully');
    },
    onError: (error) => {
      console.log('Error adding member', error);
    },
  });

  const [buttonDisabled, setButtonDisabled] = useState(false);

  const handleSave = async (data: UpdateMemberInput) => {
    console.log('Save action');
    if (!form.formState.isValid) {
      setButtonDisabled(true);
      return;
    }
    setButtonDisabled(false);
    return execute(data);
  };

  const handleAbort = () => {
    console.log('Abort action');
  };

  const handleChange = (selectedDate: string) => {
    if (!selectedDate) return;
    form.setValue('birthday', new Date(selectedDate), {
      shouldValidate: true,
      shouldDirty: true,
    });
  };

  return (
    <GenericModal
      headerTitle="Edit Member"
      description="Here you can change the information of a member."
      onSave={() => handleSave(form.getValues())}
      onAbort={handleAbort}
    >
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
                <FormLabel>
                  {t('MEMBER.FIRST_NAME')}
                  First Name
                </FormLabel>
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
                <FormLabel>
                  {t('MEMBER.LAST_NAME')}
                  Last Name
                </FormLabel>
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
                <FormLabel>
                  {t('GENERAL.PHONE')}
                  Phone Number
                </FormLabel>
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
                <FormLabel>
                  {t('MEMBER.ZIP')}
                  Zip Code
                </FormLabel>
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
                <FormLabel>
                  {t('MEMBER.CITY')}
                  City Name
                </FormLabel>
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
                <FormLabel>
                  {t('MEMBER.STREET')}
                  Street
                </FormLabel>
                <FormControl>
                  <Input placeholder="Enter street" {...field} />
                </FormControl>
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="member_status"
            render={({ field }) => (
              <FormItem>
                <FormLabel>
                  {t('MEMBER.STATUS')}
                  Status
                </FormLabel>
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
                      <FormLabel>
                        Request
                        {t('MEMBER.STATUS_OPTIONS.REQUEST')}
                      </FormLabel>
                    </SelectItem>
                    <SelectItem value={ClubMemberStatus.PENDING}>
                      <FormLabel>
                        Pending
                        {t('MEMBER.STATUS_OPTIONS.PENDING')}
                      </FormLabel>
                    </SelectItem>
                    <SelectItem value={ClubMemberStatus.ACTIVE}>
                      <FormLabel>
                        Active
                        {t('MEMBER.STATUS_OPTIONS.ACTIVE')}
                      </FormLabel>
                    </SelectItem>
                    <SelectItem value={ClubMemberStatus.PAUSED}>
                      <FormLabel>
                        Paused
                        {t('MEMBER.STATUS_OPTIONS.PAUSED')}
                      </FormLabel>
                    </SelectItem>
                    <SelectItem value={ClubMemberStatus.EXITED}>
                      <FormLabel>
                        Exited
                        {t('MEMBER.STATUS_OPTIONS.EXITED')}
                      </FormLabel>
                    </SelectItem>
                  </SelectContent>
                </Select>
              </FormItem>
            )}
          />

          {/* <DialogFooter className="col-span-2">
            <DialogClose asChild>
              <Button variant="ghost"> {t('GENERAL.ACTIONS.ABORT')}</Button>
            </DialogClose>
            <DialogClose asChild>
              <Button type="submit" disabled={!form?.formState?.isValid}>
                {' '}
                SUBMIT FORM
                {t('GENERAL.ACTIONS.SAVE')}
              </Button>
            </DialogClose>
          </DialogFooter> */}
        </form>
      </Form>
    </GenericModal>
  );
};

export { EditMemberModal };
