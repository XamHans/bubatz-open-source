// The `JWT` interface can be found in the `next-auth/jwt` submodule
import { JWT } from 'next-auth/jwt';
import { IUserTypes } from './user';
import { UUID } from 'crypto';

declare module 'next-auth/jwt' {
  /** Returned by the `jwt` callback and `auth`, when using JWT sessions */
  interface JWT {
    role: IUserTypes;
    id: UUID;
  }
}
