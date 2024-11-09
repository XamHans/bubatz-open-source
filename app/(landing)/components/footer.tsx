import { Instagram, Linkedin, Twitter } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'

export default function Footer() {
  return (
    <footer className="bg-[#191A23] px-6 py-12 text-white">
      <div className="mx-auto max-w-7xl">
        {/* Top Section: Logo, Navigation, Social Links */}
        <div className="mb-16 grid grid-cols-1 gap-8 md:grid-cols-3">
          <div className="flex items-center">
            <div className="rounded-lg bg-[#B9FF66] p-2">
              <Image
                src="/bubatz.svg"
                alt="Bubatz Logo"
                width={120}
                height={47}
                className="h-12 w-auto"
              />
            </div>
          </div>

          <nav className="hidden items-center justify-center space-x-8 md:flex">
            <Link href="#" className="transition-colors hover:underline">
              Funktionen
            </Link>
            <Link href="#" className="transition-colors hover:underline">
              Pakete
            </Link>
            <Link href="#" className="transition-colors hover:underline">
              News
            </Link>
            <Link href="#" className="transition-colors hover:underline">
              Über bubatz
            </Link>
          </nav>

          <div className="flex items-center justify-end space-x-4">
            {['LinkedIn', 'Instagram'].map((platform) => (
              <Link
                key={platform}
                href="#"
                aria-label={platform}
                className="rounded-full bg-white p-2 transition-colors hover:bg-gray-200"
              >
                {platform === 'LinkedIn' && (
                  <Linkedin className="h-5 w-5 text-[#1e1b4b]" />
                )}
                {platform === 'Twitter' && (
                  <Twitter className="h-5 w-5 text-[#1e1b4b]" />
                )}
                {platform === 'Instagram' && (
                  <Instagram className="h-5 w-5 text-[#1e1b4b]" />
                )}
              </Link>
            ))}
          </div>
        </div>

        {/* Middle Section: Contact Info and Compliance */}
        <div className="mb-16 grid grid-cols-1 gap-8 md:grid-cols-2">
          <div className="space-y-2 text-sm">
            <p>E-Mail: info@bubatz.club</p>
            <p>Tel: +49 17657682144</p>
            <p>Adresse: Schwabelweiß 69</p>
            <p>93053 Regensburg</p>
          </div>

          <div className="flex items-center md:justify-end">
            <Image
              src="/dsgvo.svg"
              alt="DSGVO compliance"
              width={60}
              height={60}
              className="h-16 w-16"
            />
          </div>
        </div>

        <hr className="mb-8 border-gray-700" />

        {/* Bottom Section: Copyright and Legal Links */}
        <div className="flex flex-col items-center justify-between space-y-4 md:flex-row md:space-y-0">
          <p className="text-sm">&copy; 2024 bubatz</p>

          <nav className="flex flex-wrap justify-center gap-4 text-sm">
            <Link href="#" className="transition-colors hover:underline">
              Impressum
            </Link>
            <Link href="#" className="transition-colors hover:underline">
              AGB
            </Link>
            <Link href="#" className="transition-colors hover:underline">
              Datenschutzerklärung
            </Link>
            <Link href="#" className="transition-colors hover:underline">
              Cookie-Einstellungen
            </Link>
          </nav>
        </div>
      </div>
    </footer>
  )
}
