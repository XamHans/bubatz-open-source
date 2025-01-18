import { Gift, Github } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'

export default function Pricing() {
  return (
    <section
      id="pricing"
      className="w-full bg-white px-4 py-8 sm:px-6 md:px-8 lg:px-12"
    >
      <div className="mx-auto max-w-7xl">
        <div className="flex flex-col space-y-4">
          <div className="inline-block w-fit rounded-lg bg-[#c5f467] px-3 py-1.5">
            <span className=" font-semibold">Pricing</span>
          </div>

          <h2 className="text-2xl font-bold tracking-tight sm:text-3xl md:text-4xl lg:text-5xl">
            Pakete
          </h2>

          <p className=" max-w-[900px]  text-xl text-zinc-500 md:text-lg lg:text-xl">
            Nutze unsere neuesten Funktionen und erlebe, wie wir dir deinen
            Club-Alltag erleichtern. Du sparst Zeit & Kosten und kannst dich auf
            das Wesentliche konzentrieren.
          </p>
        </div>

        <div className="mt-8 grid gap-6 md:mt-12 lg:grid-cols-3">
          {/* Info Card */}
          <div className="lg:col-span-1">
            <div className="flex h-full flex-col rounded-3xl bg-[#c5f467] p-4 sm:p-6">
              <div className="flex-1">
                <h3 className="mb-2 text-xl font-bold sm:text-2xl">
                  Alles was du brauchst mit{' '}
                  <Image
                    src="/bubatz.svg"
                    alt="Bubatz Logo"
                    width={160}
                    height={37}
                    className="mb-2 mt-2 sm:mb-3"
                  />
                </h3>
                <p className=" mb-4 mt-2 ">
                  Egal, ob du einen neuen Cannabis Social Club gründen oder
                  digitalisieren möchtest, wir haben für alles die passende
                  Lösung.
                </p>
              </div>
              <div className="relative mx-auto mt-4 aspect-[3/4] w-full max-w-sm overflow-hidden rounded-xl">
                <Image
                  src="/landing/smiling-woman.png"
                  alt="Smiling woman with sunglasses"
                  fill
                  className="object-cover"
                  quality={100}
                />
              </div>
            </div>
          </div>

          {/* Self Hosting Card */}
          <div className="lg:col-span-1">
            <div className="flex h-full flex-col rounded-3xl border-2 border-black p-4 sm:p-6">
              <div className="mb-4 flex items-center">
                <Link
                  href="https://github.com/XamHans/bubatz-open-source/"
                  className="flex items-center"
                >
                  <Github className="mr-2 h-6 w-6 sm:h-8 sm:w-8" />
                  <h3 className="text-xl font-bold sm:text-2xl">
                    Selbsthosting
                  </h3>
                </Link>
              </div>

              <p className=" mb-4  text-gray-500">
                Perfekt für technikbegeisterte, die volle Kontrolle wollen.
              </p>

              <ul className="mb-8 flex-grow space-y-3">
                {[
                  'Voller Zugriff auf alle Features',
                  'Hoste auf eigener Infrastruktur',
                  'Komplette Datenkontrolle',
                ].map((feature) => (
                  <li key={feature} className=" flex items-center ">
                    <svg
                      className="mr-2 h-5 w-5"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path
                        fillRule="evenodd"
                        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                        clipRule="evenodd"
                      />
                    </svg>
                    {feature}
                  </li>
                ))}
              </ul>

              <div className="mt-auto">
                <div className="mb-4 border-t border-gray-200 pt-4">
                  <h4 className="text-2xl font-bold sm:text-3xl">Kostenlos</h4>
                </div>
                <Link
                  href="https://github.com/XamHans/bubatz-open-source/"
                  className="block"
                >
                  <button className=" w-full rounded-xl bg-[#1c1c1c] py-3  font-semibold text-white transition-colors hover:bg-black">
                    Starte auf GitHub
                  </button>
                </Link>
              </div>
            </div>
          </div>

          {/* Premium Card */}
          <div className="lg:col-span-1">
            <div className="flex h-full flex-col rounded-3xl border-2 border-black p-4 sm:p-6">
              <div className="mb-4 flex items-center">
                <Gift className="mr-2 h-6 w-6 sm:h-8 sm:w-8" />
                <h3 className="text-xl font-bold sm:text-2xl">Sorglos-Paket</h3>
              </div>

              <p className=" mb-4  text-gray-500">
                Ob 50 oder 500 Mitglieder. Perfekt für jede Größe.
              </p>

              <ul className="mb-8 flex-grow space-y-3">
                {[
                  'Eigene Datenbank für deinen Club',
                  'Wartung und Updates inklusive',
                  'Vorrangiger Support',
                  'Automatische Backups',
                  'SSL-Zertifikat inklusive',
                ].map((feature) => (
                  <li key={feature} className=" flex items-center ">
                    <svg
                      className="mr-2 h-5 w-5 text-[#c5f467]"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path
                        fillRule="evenodd"
                        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                        clipRule="evenodd"
                      />
                    </svg>
                    {feature}
                  </li>
                ))}
              </ul>

              <div className="mt-auto">
                <div className="mb-4 border-t border-gray-200 pt-4">
                  <h4 className="text-2xl font-bold sm:text-3xl">
                    €24.5
                    <span className="text-base font-normal sm:text-lg">
                      /Monat
                    </span>
                  </h4>
                </div>
                <Link
                  href="https://calendly.com/muellerjohannes/bubatz-club-manager"
                  className="block"
                >
                  <button className=" w-full rounded-xl bg-[#c5f467] py-3  font-semibold text-black transition-colors hover:bg-[#b3e55d]">
                    Jetzt starten
                  </button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
