'use client'

import { signOut } from 'next-auth/react'

import { Button } from '@/components/ui/button'
import { siteConfig } from '@/config/site'
import { Icons } from '../generic/Icons'

export function SignOutButton(): JSX.Element {
  return (
    <Button
      aria-label="Sign Out"
      variant="ghost"
      className="w-full justify-start text-sm"
      onClick={() =>
        void signOut({
          callbackUrl: siteConfig.links.signIn,
          redirect: true,
        })
      }
    >
      <Icons.logout className="mr-2 size-4" aria-hidden="true" />
    </Button>
  )
}
