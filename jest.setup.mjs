// jest.setup.js
// Import custom matchers from jest-dom
import '@testing-library/jest-dom'

// Mock next-auth session
jest.mock('next-auth/react', () => ({
  useSession: jest.fn(() => ({
    data: {
      user: {
        name: 'Test User',
        email: 'test@example.com',
      },
    },
    status: 'authenticated',
  })),
}))

jest.mock('next-auth/react', () => ({
  useSession: jest.fn(() => ({
    data: {
      user: {
        name: 'Test User',
        email: 'test@example.com',
      },
    },
    status: 'authenticated',
  })),
}))

jest.mock('next-intl', () => ({
  useTranslations: jest.fn(() => (key) => key),
}))

// Update the path to use-toast
jest.mock('./components/ui/use-toast', () => ({
  useToast: jest.fn(() => ({
    toast: jest.fn(),
  })),
}))
