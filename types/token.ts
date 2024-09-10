// The `JWT` interface can be found in the `next-auth/jwt` submodule
import { UUID } from 'crypto'
import { JWT } from 'next-auth/jwt'

declare module 'next-auth/jwt' {
  /** Returned by the `jwt` callback and `auth`, when using JWT sessions */
  interface JWT {
    role: string
    id: UUID
  }
}
