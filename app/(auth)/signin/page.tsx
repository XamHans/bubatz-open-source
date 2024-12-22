import type { Metadata } from 'next'
import { useTranslations } from 'next-intl'
import { getTranslations } from 'next-intl/server'
import Link from 'next/link'

import { Icons } from '@/components/generic/Icons'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { env } from '@/env.mjs'
import { SignInWithPasswordForm } from './components/signin-with-password-form'

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations('Auth.signIn.metadata')
  return {
    metadataBase: new URL(env.NEXT_PUBLIC_APP_URL),
    title: t('title'),
    description: t('description'),
  }
}

export default function SignInPage(): JSX.Element {
  const t = useTranslations('Auth.signIn.page')

  return (
    <div className="flex h-auto min-h-screen w-full items-center justify-center">
      <Card className="max-sm:flex  max-sm:w-full max-sm:flex-col max-sm:items-center max-sm:justify-center max-sm:rounded-none max-sm:border-none sm:min-w-[370px] sm:max-w-[368px]">
        <CardHeader className="space-y-1">
          <div className="flex items-center justify-between">
            <CardTitle className="text-2xl">{t('title')}</CardTitle>
            <Link href="/">
              <Icons.close className="size-4" aria-label={t('srOnly.close')} />
            </Link>
          </div>
          <CardDescription>{t('description')}</CardDescription>
        </CardHeader>
        <CardContent className="max-sm:w-full max-sm:max-w-[340px] max-sm:px-10">
          <SignInWithPasswordForm />
        </CardContent>

        <CardFooter className="grid w-full text-sm text-muted-foreground max-sm:max-w-[340px] max-sm:px-10">
          <div>
            <span>{t('noAccount')} </span>
            <Link
              aria-label={t('srOnly.signUp')}
              href="/signup"
              className="font-bold tracking-wide text-black underline-offset-4 transition-colors hover:underline"
            >
              {t('signUpLink')}
              <span className="sr-only">{t('srOnly.signUp')}</span>
            </Link>
            .
          </div>
          <div>
            <span>{t('forgotPassword')} </span>
            <Link
              aria-label={t('srOnly.resetPassword')}
              href="/signin/password-reset"
              className="text-sm font-normal text-black underline-offset-4 transition-colors hover:underline"
            >
              {t('resetLink')}
              <span className="sr-only">{t('srOnly.resetPassword')}</span>
            </Link>
            .
          </div>
        </CardFooter>
      </Card>
    </div>
  )
}
