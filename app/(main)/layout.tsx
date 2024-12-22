import { HoverInfoButton } from '@/components/generic/hover-button-cta'
import { MobileHeader } from '@/components/generic/Mobile-Header'
import Sidebar from '@/components/generic/Sidebar'
import { Toaster } from '@/components/ui/toaster'

type Props = {
  children: React.ReactNode
}

const AppLayout = ({ children }: Props) => {
  return (
    <>
      <main className="flex min-h-screen w-full flex-col ">
        <MobileHeader />

        <Sidebar />
        <Toaster />

        <div className="flex flex-col  sm:gap-4 sm:p-1 md:p-10">
          {' '}
          {children}
        </div>

        <HoverInfoButton
          buttonText="Bereit für deinen Club?"
          infoText="Lass uns sprechen"
          ctaText="Vereinbare jetzt ein kostenloses Beratungsgespräch. Wir zeigen dir, wie du den Club Manager optimal für deinen Cannabis Social Club einsetzen kannst."
          link="https://calendly.com/muellerjohannes/bubatz-club-manager"
        />
      </main>
    </>
  )
}

export default AppLayout
