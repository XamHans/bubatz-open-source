'use client';

import { CheckIcon, ChevronRightIcon } from '@heroicons/react/24/outline';
import { useEffect, useRef } from 'react';
import useMutation from 'swr/mutation';

import Alert from '~/core/ui/Alert';
import Button from '~/core/ui/Button';
import Heading from '~/core/ui/Heading';
import Spinner from '~/core/ui/Spinner';
import Trans from '~/core/ui/Trans';

import { useRouter } from 'next/navigation';
import configuration from '~/configuration';
import useApiRequest from '~/core/hooks/use-api';
import getLogger from '~/core/logger';
import { OnboardingState } from '../../types';

const CompleteOnboardingStep: React.FC<{
  data: OnboardingState['data'];
}> = ({ data }) => {
  const mutation = useOnboardingMutation();
  const submitted = useRef(false);
  const { trigger, data: response, error } = mutation;
  const logger = getLogger();
  // we make a request to the server to complete the onboarding process
  // as soon as the component is mounted.
  useEffect(() => {
    if (!submitted.current) {
      void trigger(data);
      submitted.current = true;
    }
  }, [data, trigger]);

  if (error) {
    return <ErrorState />;
  }

  if (response && response.success) {
    if (data.adminProfile?.userType === 'developer') {
      return <SuccessMsgDeveloper />;
    }
    return <SuccessMsgOrga organizationUid={response.organizationUid} />;
  }

  return (
    <div
      className={
        'flex flex-1 flex-col items-center space-y-8 ease-out animate-in fade-in zoom-in-90' +
        ' duration-1000 slide-in-from-bottom-8'
      }
    >
      <span>
        <Spinner className={'h-12 w-12'} />
      </span>

      <span>
        <Trans i18nKey={'onboarding:settingAccount'} />
      </span>
    </div>
  );
};

export default CompleteOnboardingStep;

function ErrorState() {
  return (
    <Alert type={'error'}>
      <Alert.Heading>
        <Trans i18nKey={'onboarding:errorAlertHeading'} />
      </Alert.Heading>

      <Trans i18nKey={'common:genericError'} />
    </Alert>
  );
}

function SuccessMsgDeveloper() {
  const href = configuration.paths.developer.dashboard;
  const router = useRouter();

  return (
    <section
      className={
        'mx-auto rounded-xl fade-in lg:p-16' +
        ' bg-background animate-in slide-in-from-bottom-16' +
        ' duration-1000 ease-out zoom-in-95'
      }
    >
      <div
        className={
          'flex flex-col items-center justify-center space-y-8 text-center'
        }
      >
        <CheckIcon
          className={
            'w-16 rounded-full bg-green-500 p-1 text-white ring-8' +
            ' ring-green-500/30 dark:ring-green-500/50'
          }
        />

        <Heading type={3}>
          <span className={'mr-4 font-semibold'}>
            <Trans i18nKey={'onboarding:successStepHeadingDev'} />
          </span>
          🎉
        </Heading>

        <Button
          data-cy={'complete-onboarding-link'}
          href={href}
          onClick={() => {
            router.push(href);
          }}
          variant={'outline'}
        >
          <span className={'flex items-center space-x-2.5'}>
            <span>
              <Trans i18nKey={'onboarding:continue'} />
            </span>

            <ChevronRightIcon className={'h-4'} />
          </span>
        </Button>
      </div>
    </section>
  );
}

function SuccessMsgOrga({ organizationUid }: { organizationUid: string }) {
  const href = configuration.paths.organization.dashboard;
  const router = useRouter();
  return (
    <section
      className={
        'mx-auto rounded-xl fade-in lg:p-16' +
        ' bg-background animate-in slide-in-from-bottom-16' +
        ' duration-1000 ease-out zoom-in-95'
      }
    >
      <div
        className={
          'flex flex-col items-center justify-center space-y-8 text-center'
        }
      >
        <CheckIcon
          className={
            'w-16 rounded-full bg-green-500 p-1 text-white ring-8' +
            ' ring-green-500/30 dark:ring-green-500/50'
          }
        />

        <Heading type={3}>
          <span className={'mr-4 font-semibold'}>
            <Trans i18nKey={'onboarding:successStepHeadingOrga'} />
          </span>
          🎉
        </Heading>

        <Button
          data-cy={'complete-onboarding-link'}
          href={href}
          onClick={() => {
            router.push(href);
          }}
          variant={'outline'}
        >
          <span className={'flex items-center space-x-2.5'}>
            <span>
              <Trans i18nKey={'onboarding:continue'} />
            </span>

            <ChevronRightIcon className={'h-4'} />
          </span>
        </Button>
      </div>
    </section>
  );
}

export function useOnboardingMutation() {
  const fetcher = useApiRequest<
    {
      success: boolean;
      organizationUid: string;
    },
    OnboardingState['data']
  >();

  const mutationFn = async (
    _: string[],
    { arg }: { arg: OnboardingState['data'] },
  ) => {
    return fetcher({
      method: 'POST',
      path: '/onboarding/complete',
      body: arg,
    });
  };

  return useMutation(['complete-onboarding'], mutationFn);
}
