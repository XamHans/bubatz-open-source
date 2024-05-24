import { markEmailAsVerified } from '@/actions/email'
import { getUserByEmailVerificationToken } from '@/actions/user'
import { Icons } from '@/components/generic/Icons'
import { buttonVariants } from '@/components/ui/button'
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card'
import { siteConfig } from '@/config/site'
import { db } from '@/lib/db/db'
import { users } from '@/lib/db/schema'
import { cn } from '@/lib/utils'
import { eq } from 'drizzle-orm/sql/expressions/conditions'
import { redirect, usePathname } from 'next/dist/client/components/navigation'
import Link from 'next/link'
import { useState } from 'react'

export interface VerifyEmailPageProps {
    searchParams: { [key: string]: string | string[] | undefined }
}

export default async function VerifyEmailPage({
    searchParams,
}: VerifyEmailPageProps): Promise<JSX.Element> {
    const emailVerificationToken = searchParams.token as string

    if (emailVerificationToken) {
        const user = await getUserByEmailVerificationToken({
            token: emailVerificationToken,
        })

        if (!user) {
            return (
                <div className="flex min-h-screen w-full items-center justify-center">
                    <Card className="max-sm:flex max-sm:h-screen max-sm:w-full max-sm:flex-col max-sm:items-center max-sm:justify-center max-sm:rounded-none max-sm:border-none sm:min-w-[370px] sm:max-w-[368px]">
                        <CardHeader>
                            <CardTitle>
                                Invalid Email Verification Token
                            </CardTitle>
                            <CardDescription>
                                Please return to the sign up page and try again
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <Link
                                aria-label="Go back to sign in page"
                                href={`${siteConfig.links.signIn}`}
                                className={cn(
                                    buttonVariants({ variant: 'secondary' }),
                                    'w-full'
                                )}
                            >
                                <Icons.arrowLeft className="mr-2 size-4" />
                                <span className="sr-only">Try again</span>
                                Try again
                            </Link>
                        </CardContent>
                    </Card>
                </div>
            )
        }

        const message = await markEmailAsVerified({
            token: emailVerificationToken,
        })
        if (message !== 'success') redirect('/signup')

        return (
            <div className="flex min-h-screen w-full items-center justify-center">
                <Card className="max-sm:flex max-sm:h-screen max-sm:w-full max-sm:flex-col max-sm:items-center max-sm:justify-center max-sm:rounded-none max-sm:border-none sm:min-w-[370px] sm:max-w-[368px]">
                    <CardHeader>
                        <CardTitle>Email successfully verified</CardTitle>
                        <CardDescription>
                            You can now sign in to your account
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <Link
                            aria-label="Go back to sign in page"
                            href={`${siteConfig.links.signIn}`}
                            className={buttonVariants()}
                        >
                            <span className="sr-only">Go to Sign In page</span>
                            Go to Sign In page
                        </Link>
                    </CardContent>
                </Card>
            </div>
        )
    } else {
        return (
            <div className="flex min-h-screen w-full items-center justify-center">
                <Card className="max-sm:flex max-sm:h-screen max-sm:w-full max-sm:flex-col max-sm:items-center max-sm:justify-center max-sm:rounded-none max-sm:border-none sm:min-w-[370px] sm:max-w-[368px]">
                    <CardHeader>
                        <CardTitle>Missing Email Verification Token</CardTitle>
                        <CardDescription>
                            Please return to the sign up page and try again
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <Link
                            aria-label="Go back to sign up page"
                            href={`${siteConfig.links.signUp}`}
                            className={cn(
                                buttonVariants({ variant: 'secondary' }),
                                'w-full'
                            )}
                        >
                            <Icons.arrowLeft className="mr-2 size-4" />
                            <span className="sr-only">Try again</span>
                            Try again
                        </Link>
                    </CardContent>
                </Card>
            </div>
        )
    }
}
