import { Toaster } from '@/components/ui/sonner'
import type { Metadata } from 'next'
import { NextIntlClientProvider } from 'next-intl'
import { getMessages } from 'next-intl/server'
import './globals.css'

export const metadata: Metadata = {
  title: 'Bubatz Club Manager',
  description: 'Your CSC Manager',
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  const messages = await getMessages()
  return (
    <html suppressHydrationWarning lang="en">
      <body className="font-nunito">
        <NextIntlClientProvider messages={messages}>
          <div className="bg-white">
            <main>{children}</main>
            <Toaster />
          </div>
        </NextIntlClientProvider>
      </body>
    </html>
  )
}
