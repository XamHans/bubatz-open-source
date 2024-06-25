import { BatchProps } from '@/modules/plants/data-access/schema';
import { ReactNode, createContext, useContext } from 'react';

interface BatchProviderProps {
  children: ReactNode;
  details: BatchProps;
}

const BatchContext = createContext<BatchProps | undefined>(undefined);

export const BatchProvider = ({ children, details }: BatchProviderProps) => {
  return (
    <BatchContext.Provider value={details}>{children}</BatchContext.Provider>
  );
};

export const useBatch = () => {
  const context = useContext(BatchContext);
  if (context === undefined) {
    throw new Error('useBatch must be used within a BatchProvider');
  }
  return context;
};
