import { MobileHeader } from '@/components/generic/Mobile-Header'
import { Navbar } from '@/components/generic/Navbar'
import Footer from './components/footer'

type Props = {
  children: React.ReactNode
}

const LandingLayout = ({ children }: Props) => {
  return (
    <div className="flex min-h-screen flex-col">
      <MobileHeader />
      <div className="hidden lg:block">
        <Navbar />
      </div>
      <main className="w-full flex-1">{children}</main>
      <Footer />
    </div>
  )
}

export default LandingLayout
