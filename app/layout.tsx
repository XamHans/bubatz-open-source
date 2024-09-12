import Footer from '@/components/generic/footer'
import { Toaster } from '@/components/ui/toaster'
import type { Metadata } from 'next'
import { NextIntlClientProvider } from 'next-intl'
import { getMessages } from 'next-intl/server'
import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Bubatz Club Manager',
  description: 'Your CSC Manager',
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  // Providing all messages to the client
  // side is the easiest way to get started
  const messages = await getMessages()
  return (
    <html suppressHydrationWarning>
      <body>
        <NextIntlClientProvider messages={messages}>
          <div
            className={`${inter.className} bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] [background-size:16px_16px]`}
          >
            <main>{children}</main>
            <Toaster />
          </div>
        </NextIntlClientProvider>
      </body>
      <Footer />
    </html>
  )
}
