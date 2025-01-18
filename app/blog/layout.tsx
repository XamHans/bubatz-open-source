import Footer from '@/components/generic/footer'
import { MobileHeader } from '@/components/generic/Mobile-Header'
import { Navbar } from '@/components/generic/Navbar'

type Props = {
  children: React.ReactNode
}

const BlogLayout = ({ children }: Props) => {
  return (
    <div className="flex min-h-screen flex-col">
      {/* Mobile header - visible on mobile, hidden on desktop */}
      <div className="lg:hidden">
        <MobileHeader />
      </div>

      {/* Desktop navbar - hidden on mobile, visible on desktop */}
      <div className="hidden lg:block">
        <Navbar />
      </div>

      {/* Main content area with proper padding */}
      <main className="flex flex-1 flex-col px-4 py-4 sm:px-6 sm:py-6 lg:mt-0 lg:px-8 lg:py-8">
        <div className="mx-auto w-full max-w-7xl">{children}</div>
      </main>

      {/* Footer */}
      <Footer />
    </div>
  )
}

export default BlogLayout
