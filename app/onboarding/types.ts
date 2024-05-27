import { AddClubInput } from '@/modules/club/data-access/schema';

enum ClubOnboardingStep {
  GENERAL_INFO,
  ORGANIZATION_INFO,
  INVITES,
  DEVELOPER_INFO,
  COMPLETE,
}

interface OnboardingFormProps {
  setData: <K extends keyof ClubOnboardingData>(
    key: K,
    value: ClubOnboardingData[K],
  ) => void;
}

type ClubOnboardingData = {
  adminProfile?: AdminProfile;
  clubInformation?: AddClubInput;
};

type OnboardingState = {
  data: ClubOnboardingData;
  setData: <K extends keyof ClubOnboardingData>(
    key: K,
    value: ClubOnboardingData[K],
  ) => void;
  currentStep: number;
  setCurrentStep: (step: number) => void;
};

export { ClubOnboardingStep as OnboardingStep };

export type { OnboardingFormProps, OnboardingState };
