import { BatchProps } from '@/modules/plants/data-access/schema'
import { ReactNode, createContext, useContext, useState } from 'react'

interface BatchContextType {
  batch: BatchProps
  updateBatch: (updatedBatch: Partial<BatchProps>) => void
}

interface BatchProviderProps {
  children: ReactNode
  details: BatchProps
}

const BatchContext = createContext<BatchContextType | undefined>(undefined)

export const BatchProvider = ({ children, details }: BatchProviderProps) => {
  const [batch, setBatch] = useState<BatchProps>(details)

  const updateBatch = (updatedBatch: Partial<BatchProps>) => {
    setBatch((prevBatch) => ({ ...prevBatch, ...updatedBatch }))
  }

  return (
    <BatchContext.Provider value={{ batch, updateBatch }}>
      {children}
    </BatchContext.Provider>
  )
}

export const useBatch = () => {
  const context = useContext(BatchContext)
  if (context === undefined) {
    throw new Error('useBatch must be used within a BatchProvider')
  }
  return context
}
