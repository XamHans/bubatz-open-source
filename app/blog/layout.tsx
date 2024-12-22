import { Navbar } from '@/components/generic/Navbar'
import { Inter } from 'next/font/google'
import Footer from '../(landing)/components/footer'

const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  title: 'Bubatz',
  description: 'Bubatz Club Manager',
}

export default function BlogLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className={`flex min-h-screen flex-col ${inter.className}`}>
      <Navbar />
      <main className="container mx-auto flex-grow px-4 py-8 sm:px-6 lg:px-8">
        {children}
      </main>
      <Footer />
    </div>
  )
}
