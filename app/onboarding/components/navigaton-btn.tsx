import React from 'react';
import Button from '~/core/ui/Button';
import Trans from '~/core/ui/Trans';
import { useOnboardingStore } from '../store';

const OnboardingNavigation: React.FC = ({}) => {
  const { setCurrentStep, currentStep } = useOnboardingStore();

  return (
    <div className={'flex flex-col space-y-2 col-span-2'}>
      <Button type="submit">
        <Trans i18nKey={'common:continue'} />
      </Button>

      <Button
        data-cy={'prev-onboarding-step'}
        variant={'ghost'}
        type={'button'}
        onClick={() => {
          setCurrentStep(currentStep - 1);
        }}
      >
        <Trans i18nKey={'common:back'} />
      </Button>
    </div>
  );
};

export default OnboardingNavigation;
