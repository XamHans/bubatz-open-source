import { ThemeProvider } from '@/components/generic/theme-provider';
import { Toaster } from '@/components/ui/toaster';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Bubatz Club Manager',
  description: 'Your CSC Manager',
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${inter.className} bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] [background-size:16px_16px]`}
        // className={` ${inter.className} ${data?.colorScheme ?? "theme-orange"}`}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          enableSystem
          disableTransitionOnChange
        >
          <body>
            <main> {children}</main>
            <Toaster />
          </body>
        </ThemeProvider>
      </body>
    </html>
  );
}
