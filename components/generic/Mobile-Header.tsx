import Image from 'next/image'
import Link from 'next/link'

export const MobileHeader = () => {
  return (
    <nav className="fixed top-0 z-50 flex h-[50px] w-full items-center justify-center border-b bg-white p-4 px-6 lg:hidden">
      <Link href="/">
        <Image src="/bubatz.svg" alt="Bubatz Logo" width={120} height={32} />
      </Link>
    </nav>
  )
}
