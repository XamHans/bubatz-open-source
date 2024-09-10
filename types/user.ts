import { type User } from 'next-auth'

export type IUserTypes = 'ADMIN' | 'MEMBER'

declare module 'next-auth' {
  // Augmented the User interface with the properties from the database
  interface User {
    role?: string
    // is_owner?: boolean
  }
}
