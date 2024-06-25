'use client';

import { GenericModal } from '@/components/generic/GenericModal';
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
  GetMemberDetailQueryData,
  updateMember,
} from '@/modules/members/data-access/index';
import { ClubMemberStatus, UpdateMemberInput } from '@/modules/members/types';
import { zodResolver } from '@hookform/resolvers/zod';
import { t } from 'i18next';
import { SubmitHandler, useForm } from 'react-hook-form';

export interface EditMemberModalProps {
  member: GetMemberDetailQueryData;
}

import { z } from 'zod';

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
    const result = await updateMember(member.id, data);
    result
      .onSuccess((updatedMemberResult) =>
        console.log('Member updated successfully:', updatedMemberResult),
      )
      .onError((error) =>
        console.error('Failed to update member:', error.message),
      );
  };

  const handleSave = () => {
    console.log('Save action');
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
      open={open}
      setOpen={setOpen}
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
                      {t('MEMBER.STATUS_OPTIONS.REQUEST')}
                    </SelectItem>
                    <SelectItem value={ClubMemberStatus.PENDING}>
                      {t('MEMBER.STATUS_OPTIONS.PENDING')}
                    </SelectItem>
                    <SelectItem value={ClubMemberStatus.ACTIVE}>
                      {t('MEMBER.STATUS_OPTIONS.ACTIVE')}
                    </SelectItem>
                    <SelectItem value={ClubMemberStatus.PAUSED}>
                      {t('MEMBER.STATUS_OPTIONS.PAUSED')}
                    </SelectItem>
                    <SelectItem value={ClubMemberStatus.EXITED}>
                      {t('MEMBER.STATUS_OPTIONS.EXITED')}
                    </SelectItem>
                  </SelectContent>
                </Select>
              </FormItem>
            )}
          />

          <DialogFooter className="col-span-2">
            <DialogClose asChild>
              <Button variant="ghost"> {t('GENERAL.ACTIONS.ABORT')}</Button>
            </DialogClose>
            <DialogClose asChild>
              <Button type="submit" disabled={!form?.formState?.isValid}>
                {' '}
                SUBMIT FORM
                {/* {t("GENERAL.ACTIONS.SAVE")} */}
              </Button>
            </DialogClose>
          </DialogFooter>
        </form>
      </Form>
    </GenericModal>
  );
};

export { EditMemberModal };
