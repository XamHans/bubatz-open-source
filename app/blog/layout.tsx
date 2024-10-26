import { Navbar } from '@/components/generic/Navbar'
import { Inter } from 'next/font/google'
import Footer from '../(landing)/components/footer'

const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  title: 'AI in a Shell Blog',
  description: 'Explore the latest in AI and shell scripting',
}

export default function BlogLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className={`flex min-h-screen flex-col ${inter.className}`}>
      <Navbar />
      <main className="container mx-auto h-screen flex-grow px-4 py-8 sm:px-6 lg:px-8">
        {children}
      </main>
      <Footer />
    </div>
  )
}
