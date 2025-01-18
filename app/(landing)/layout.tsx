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
      <main className="flex flex-1 flex-col items-center justify-center  lg:mt-0">
        {children}
      </main>
      <Footer />
    </div>
  )
}

export default LandingLayout
