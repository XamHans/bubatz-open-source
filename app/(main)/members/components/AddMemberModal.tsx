'use client';

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
  UserSchema,
  addMemberInputSchema,
} from '@/modules/members/data-access/schema';
import { zodResolver } from '@hookform/resolvers/zod';
import { t } from 'i18next';
import { useForm } from 'react-hook-form';

import { ClubMemberStatus } from '@/modules/club/types';
import { addMemberUseCase } from '@/modules/members/use-cases';
import { useAction } from 'next-safe-action/hooks';
import { GenericModal } from '@/components/generic/GenericModal';
import DatePicker from 'react-datepicker';
import { useState } from 'react';
import 'react-datepicker/dist/react-datepicker.css';
import { FaCalendarAlt } from 'react-icons/fa';
import React from 'react';

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
    // execute(data);
  };

  const handleSave = async (data: AddMemberInput) => {
    console.log('Data:', data);
    try {
      const result = await execute(data);
      console.log('Member added successfully', result);
    } catch (error) {
      console.log('Error added member', error);
    }
  };

  const handleAbort = () => {
    console.log('Abort action');
  };

  const [startDate, setStartDate] = useState(new Date());
  const [buttonDisabled, setButtonDisabled] = useState(true);

  const customInput = ({ value, onClick }) => {
    return (
      <div className="flex items-center">
        <Input
          value={value}
          onClick={onClick}
          placeholder="Enter date of birth"
          readOnly
        />
        <FaCalendarAlt />
      </div>
    );
  };

  return (
    <GenericModal
      headerTitle="Add Member"
      description="Fill in the details to add a new member."
      onSave={() => handleSave(form.getValues())}
      onAbort={handleAbort}
      disabled={buttonDisabled}
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
                {/* <FormLabel>{t('MEMBER.FIRST_NAME')}</FormLabel> */}
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
                {/* <FormLabel>{t('MEMBER.LAST_NAME')}</FormLabel> */}
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
                {/* <FormLabel>{t('GENERAL.PHONE')}</FormLabel> */}
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
                {/* <FormLabel>{t('MEMBER.BIRTHDAY')}</FormLabel> */}
                <FormLabel>Date of Birth</FormLabel>
                <FormControl>
                  <Input placeholder="dd/mm/yyyy" {...field} />
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
                {/* <FormLabel>{t('MEMBER.ZIP')}</FormLabel> */}
                <FormLabel>Zip Code</FormLabel>
                <FormControl>
                  <Input placeholder="Enter zip code" {...field} />
                </FormControl>
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="city"
            render={({ field }) => (
              <FormItem>
                {/* <FormLabel>{t('MEMBER.CITY')}</FormLabel> */}
                <FormLabel>City</FormLabel>
                <FormControl>
                  <Input placeholder="Enter city's name" {...field} />
                </FormControl>
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="street"
            render={({ field }) => (
              <FormItem>
                {/* <FormLabel>{t('MEMBER.STREET')}</FormLabel> */}
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
                {/* <FormLabel>{t('MEMBER.STATUS')}</FormLabel> */}
                <FormLabel>Status</FormLabel>
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
                      {/* {t('MEMBER.STATUS_OPTIONS.REQUEST')} */}
                      Request
                    </SelectItem>
                    <SelectItem value={ClubMemberStatus.PENDING}>
                      {/* {t('MEMBER.STATUS_OPTIONS.PENDING')} */}
                      Pending
                    </SelectItem>
                    <SelectItem value={ClubMemberStatus.ACTIVE}>
                      {/* {t('MEMBER.STATUS_OPTIONS.ACTIVE')} */}
                      Active
                    </SelectItem>
                  </SelectContent>
                </Select>
              </FormItem>
            )}
          />

          {/* <DialogFooter className="col-span-2">
            <DialogClose asChild>
              <Button type="submit" disabled={!form?.formState?.isValid}>
                {' '}
                {t('GENERAL.ACTIONS.SAVE')}
                Create Member
              </Button>
            </DialogClose>
          </DialogFooter> */}
        </form>
      </Form>
    </GenericModal>
  );
};

export { AddMemberModal };
