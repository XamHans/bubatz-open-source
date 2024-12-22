import Image from 'next/image'
import Link from 'next/link'
import { Button } from '../ui/button'

const Navbar = () => {
  return (
    <nav className="container sticky top-0 z-50 flex items-center justify-between  bg-white px-8 py-8 ">
      <div className="flex items-center">
        <Link href="/">
          <Image src="/bubatz.svg" alt="Bubatz Logo" width={200} height={54} />
        </Link>
      </div>

      <div className="flex items-center space-x-12">
        <Link
          href="/#features"
          className="font-nunito text-lg text-black hover:text-gray-700"
        >
          Funktionen
        </Link>
        <Link
          href="/#pricing"
          className="font-nunito text-lg text-black hover:text-gray-700"
        >
          Pakete
        </Link>

        <Link
          href="/blog"
          className="font-nunito text-lg text-black hover:text-gray-700"
        >
          News
        </Link>

        <Link
          href="/#team"
          className="font-nunito text-lg text-black hover:text-gray-700"
        >
          Über bubatz
        </Link>
        <Link href="/signin">
          <Button className="w-full bg-[#b6f36e] p-4 text-lg font-bold text-black hover:bg-[#a5e45d] min-[400px]:w-auto md:p-6 md:text-xl">
            Kostenlos testen
          </Button>
        </Link>
      </div>
    </nav>
  )
}

export { Navbar }
