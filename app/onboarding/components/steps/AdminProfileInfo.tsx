'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '~/core/ui/Form';
import Heading from '~/core/ui/Heading';
import { RadioGroup, RadioGroupItem } from '~/core/ui/RadioGroup';
import SubHeading from '~/core/ui/SubHeading';
import Trans from '~/core/ui/Trans';
import { Input } from '~/core/ui/input';
import {
  CreateGeneralProfile,
  createGeneralProfileSchema,
} from '~/lib/user/types/profile';
import { useOnboardingStore } from '../../store';
import { USER_TYPE } from '../../types';
import OnboardingNavigation from '../navigaton-btn';

const GeneralInfoStep: React.FCC = () => {
  const { setData, setCurrentStep, currentStep, data } = useOnboardingStore();

  const form = useForm<CreateGeneralProfile>({
    mode: 'onBlur',
    resolver: zodResolver(createGeneralProfileSchema),
    defaultValues: {
      firstName: data.profile?.firstName || '',
      lastName: data.profile?.lastName || '',
      userType: USER_TYPE.ORGANIZATION,
    },
  });

  const onFormSubmit = async (data: CreateGeneralProfile) => {
    setData('profile', data as CreateGeneralProfile);
    setCurrentStep(currentStep + 1);
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onFormSubmit)}
        className="flex w-full flex-1 flex-col space-y-12"
      >
        <div className={'flex flex-col space-y-2'}>
          <Heading type={1}>
            <Trans i18nKey={'onboarding:setupGeneralInfo'} />
          </Heading>

          <SubHeading>
            <span className={'text-base'}>
              <Trans i18nKey={'onboarding:setupGeneralInfoDescription'} />
            </span>
          </SubHeading>
        </div>

        <div className={'flex flex-1 flex-col space-y-2'}>
          <FormField
            control={form.control}
            name="firstName"
            render={({ field }) => (
              <FormItem className="col-span-2">
                <FormLabel className="block">
                  {' '}
                  <Trans i18nKey={'common:firstNameLabel'} />
                </FormLabel>

                <FormControl>
                  <Input {...field} />
                </FormControl>

                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <div className={'flex flex-1 flex-col space-y-2'}>
          <FormField
            control={form.control}
            name="lastName"
            render={({ field }) => (
              <FormItem className="col-span-2">
                <FormLabel className="block">
                  {' '}
                  <Trans i18nKey={'common:lastNameLabel'} />
                </FormLabel>

                <FormControl>
                  <Input {...field} />
                </FormControl>

                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className={'flex flex-1 flex-col space-y-2'}>
          <SubHeading>
            <span className={'text-base'}>
              <Trans i18nKey={'onboarding:chooseAccountTypeDescription'} />
            </span>
          </SubHeading>

          <FormField
            control={form.control}
            name="userType"
            render={({ field }) => (
              <FormItem className="space-y-3">
                <FormControl>
                  <RadioGroup
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                    className="flex flex-col space-y-1"
                  >
                    <FormItem className="flex items-center space-x-3 space-y-0">
                      <FormControl>
                        <RadioGroupItem value={USER_TYPE.ORGANIZATION} />
                      </FormControl>
                      <FormLabel className="font-normal">
                        <Trans
                          i18nKey={'common:organizationSettingsTabLabel'}
                        />
                      </FormLabel>
                    </FormItem>

                    <FormItem className="flex items-center space-x-3 space-y-0">
                      <FormControl>
                        <RadioGroupItem value={USER_TYPE.DEVELOPER} />
                      </FormControl>
                      <FormLabel className="font-normal">
                        <Trans i18nKey={'common:developerSettingsTabLabel'} />
                      </FormLabel>
                    </FormItem>
                  </RadioGroup>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <OnboardingNavigation />
      </form>
    </Form>
  );
};

export default GeneralInfoStep;
