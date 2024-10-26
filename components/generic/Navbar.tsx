import Image from 'next/image'
import Link from 'next/link'

const Navbar = () => {
  return (
    <nav className="container flex items-center justify-between bg-white px-8 py-12">
      <div className="flex items-center">
        <Image src="/bubatz.svg" alt="Bubatz Logo" width={284} height={84} />
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
        <button className="font-nunito rounded-full bg-[#b6f36e] px-6 py-3 text-lg font-bold text-black transition-colors hover:bg-[#a5e45d]">
          Kostenlos registrieren
        </button>
      </div>
    </nav>
  )
}

export { Navbar }
