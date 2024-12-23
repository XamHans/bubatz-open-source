import { Navbar } from '@/components/generic/Navbar'
import Footer from './components/footer'

type Props = {
  children: React.ReactNode
}

const LandingLayout = ({ children }: Props) => {
  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <main className="flex flex-1 flex-col items-center justify-center">
        {children}
      </main>
      <Footer />
    </div>
  )
}

export default LandingLayout
