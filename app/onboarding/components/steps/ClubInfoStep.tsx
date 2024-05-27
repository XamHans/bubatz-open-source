'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { SingleSelect } from '~/components/SingleSelect';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '~/core/ui/Form';
import Heading from '~/core/ui/Heading';
import SubHeading from '~/core/ui/SubHeading';
import Textarea from '~/core/ui/Textarea';
import Trans from '~/core/ui/Trans';
import { Input } from '~/core/ui/input';
import { COUNTRY_OPTIONS } from '~/lib/developers/types/countries';
import {
  ORGANIZATION_SIZE_OPTIONS,
  createOrganizationSchema,
} from '~/lib/organizations/types/organization';
import { useOnboardingStore } from '../../store';
import OnboardingNavigation from '../navigaton-btn';

const OrganizationInfoStep: React.FCC = () => {
  const { setData, setCurrentStep, currentStep, data } = useOnboardingStore();

  const form = useForm({
    mode: 'onBlur',
    resolver: zodResolver(createOrganizationSchema),
    defaultValues: {
      name: data.organization?.name || '',
      description: data.organization?.description || '',
      country: data.organization?.country || '',
      size: data.organization?.size || '',
      website: data.organization?.website || '',
      linkedin: data.organization?.linkedin || '',
    },
  });

  const onFormSubmit = async (data: any) => {
    setData('organization', data as any);
    setCurrentStep(currentStep + 1);
  };

  return (
    <div className={'flex w-full flex-1 flex-col space-y-12'}>
      <div className={'flex flex-col space-y-2'}>
        <Heading type={1}>
          <Trans i18nKey={'onboarding:createOrganization'} />
        </Heading>

        <SubHeading>
          <span className={'text-base'}>
            <Trans i18nKey={'onboarding:createOrganizationDescription'} />
          </span>
        </SubHeading>
      </div>

      <div className={'flex flex-1 flex-col space-y-2'}>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onFormSubmit)}
            className="space-y-2 sm:grid sm:grid-cols-2 sm:gap-4 sm:space-y-0"
          >
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem className="col-span-2">
                  <FormLabel>Organization Name</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem className="flex col-span-2 min-h-50 flex-row flex-wrap items-center justify-between  shadow-sm">
                  <div className="space-y-0.5">
                    <FormLabel>Organization Description</FormLabel>
                  </div>
                  <FormControl>
                    <Textarea {...field} />
                  </FormControl>
                  <FormDescription>
                    Provide a comprehensive description of your Organization.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <SingleSelect
              form={form}
              name="country"
              className="col-span-2"
              label="Select Organization location"
              placeholder=""
              options={COUNTRY_OPTIONS}
            />

            {/* <SingleSelect
              form={form}
              name="timezone"
              className="col-span-2"
              label="Select Organization timezone"
              placeholder=""
              options={TIMEZONES_OPTIONS}
            /> */}

            <SingleSelect
              form={form}
              className="col-span-2"
              name="size"
              label="Select the size of your Organization"
              placeholder=""
              options={ORGANIZATION_SIZE_OPTIONS}
            />

            <FormField
              control={form.control}
              name="website"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Website</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="linkedin"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>LinkedIn</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                </FormItem>
              )}
            />
            <OnboardingNavigation />
          </form>
        </Form>
      </div>
    </div>
  );
};

export default OrganizationInfoStep;
