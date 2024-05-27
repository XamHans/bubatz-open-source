'use client';

import { useSearchParams } from 'next/navigation';

import { useOnboardingStore } from '../store';
import DeveloperInfoStep from './steps/DeveloperInfoStep';
import GeneralInfoStep from './steps/GeneralInfoStep';


const OnboardingContainer = () => {
  const { data: onboardingSessionData, currentStep } = useOnboardingStore();

  const params = useSearchParams();
  const renderCurrentStepInOnboardingFlow = () => {
    if (currentStep === 0) {
      return <GeneralInfoStep />;
    }
    if (
      currentStep === 1 &&
    ) {
      return <DeveloperInfoStep />;
    }

   
  };

  return (
      {renderCurrentStepInOnboardingFlow()}
  );
};

export { OnboardingContainer };
