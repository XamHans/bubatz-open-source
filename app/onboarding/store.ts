import { create } from 'zustand';
import { OnboardingState } from './types';


export const useOnboardingStore = create<OnboardingState>((set, get) => ({
  data: {},
  setData: (key, value) => set((state) => ({ data: { ...state.data, [key]: value } })),
  currentStep: 0,
  setCurrentStep: (step) => set({ currentStep: step }),
 
}));
