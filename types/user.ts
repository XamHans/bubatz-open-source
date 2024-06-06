import { type User } from 'next-auth';

export type IUserTypes = 'ADMIN' | 'USER';

declare module 'next-auth' {
  // Augmented the User interface with the properties from the database
  interface User {
    is_admin?: boolean;
    // is_owner?: boolean
  }
}
