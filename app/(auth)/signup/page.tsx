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
import { type Metadata } from 'next'
import { useTranslations } from 'next-intl'
import { getTranslations } from 'next-intl/server'
import Link from 'next/link'
import { SignUpWithPasswordForm } from './components/signup-with-password-form'

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations('Auth.signUp')
  return {
    metadataBase: new URL(env.NEXT_PUBLIC_APP_URL),
    title: t('metadata.title'),
    description: t('metadata.description'),
  }
}

export default function SignUpPage(): JSX.Element {
  const t = useTranslations('Auth.signUp')

  return (
    <div className="flex h-auto min-h-screen w-full items-center justify-center md:flex">
      <Card className="max-sm:flex max-sm:w-full max-sm:flex-col max-sm:items-center max-sm:justify-center max-sm:rounded-none max-sm:border-none sm:min-w-[370px] sm:max-w-[368px]">
        <CardHeader className="space-y-1">
          <div className="flex items-center justify-between">
            <CardTitle className="text-2xl">{t('page.title')}</CardTitle>
            <Link href="/">
              <Icons.close
                className="size-4"
                aria-label={t('page.srOnly.close')}
              />
            </Link>
          </div>
          <CardDescription>{t('page.description')}</CardDescription>
        </CardHeader>
        <CardContent className="max-sm:w-full max-sm:max-w-[340px] max-sm:px-10">
          {/* <OAuthButtons />
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t" />
            </div>
            <div className="relative mb-3 mt-6 flex justify-center text-xs uppercase">
              <span className="bg-background px-2">
                Or continue with magic link
              </span>
            </div>
          </div>
          <SignInWithEmailForm />
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t" />
            </div>
            <div className="relative mb-3 mt-6 flex justify-center text-xs uppercase">
              <span className="bg-background px-2">
                Or continue with password
              </span>
            </div>
          </div> */}
          <SignUpWithPasswordForm />
        </CardContent>
        <CardFooter className="grid w-full gap-4 text-sm text-muted-foreground max-sm:max-w-[340px] max-sm:px-10">
          <div>
            <div>
              <span>{t('page.haveAccount')} </span>
              <Link
                aria-label={t('page.srOnly.signIn')}
                href="/signin"
                className="font-bold tracking-wide text-black underline-offset-4 transition-all hover:underline"
              >
                {t('page.signInLink')}
                <span className="sr-only">{t('page.srOnly.signIn')}</span>
              </Link>
              .
            </div>
            {/* <div>
              <span>Lost email verification link? </span>
              <Link
                aria-label="Resend email verification link"
                href="/signup/reverify-email"
                className="text-sm font-normal text-black underline-offset-4 transition-colors hover:underline"
              >
                Resend
                <span className="sr-only">Resend email verification link</span>
              </Link>
              .
            </div> */}
          </div>

          <div className="text-sm text-muted-foreground md:text-xs">
            {t('legal.agreement')}{' '}
            <Link
              aria-label={t('legal.tos')}
              href="/tos"
              className="font-semibold underline-offset-4 transition-all hover:underline"
            >
              {t('legal.tos')}
            </Link>{' '}
            <br className="xs:hidden sm:block md:hidden" />
            {t('legal.and')}
            <Link
              aria-label={t('legal.privacy')}
              href="/privacy"
              className="font-semibold underline-offset-4 transition-all hover:underline"
            >
              {' '}
              {t('legal.privacy')}
            </Link>
            .
          </div>
        </CardFooter>
      </Card>
    </div>
  )
}
