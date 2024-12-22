import { Gift, Github } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'

export default function Pricing() {
  return (
    <section id="pricing" className="w-full bg-white ">
      <div className="flex flex-col items-start space-y-4">
        <div className="inline-block rounded-lg bg-[#c5f467] px-3 py-1 text-sm font-semibold">
          Pricing
        </div>
        <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl">
          Pakete
        </h2>
        <p className="max-w-[900px] text-zinc-500 dark:text-zinc-400 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
          Nutze unsere neuesten Funktionen und erlebe, wie wir dir deinen
          Club-Alltag erleichtern. Du sparst Zeit & Kosten und kannst dich auf
          das Wesentliche konzentrieren.
        </p>
      </div>
      <div className="mt-8 grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-1">
          <div className="flex h-[647px] flex-col rounded-3xl bg-[#c5f467] p-6">
            <div>
              <h3 className="mb-2 text-2xl font-bold">
                Alles was du brauchst mit{' '}
                <Image
                  src="/bubatz.svg"
                  alt="Bubatz Logo"
                  width={200}
                  height={46}
                  className="mb-2"
                />
              </h3>
              <p className="mb-4 mt-4">
                Egal, ob du einen neuen Cannabis Social Club gründen oder
                digitalisieren möchtest, wir haben für alles die passende
                Lösung.
              </p>
            </div>
            <div
              className="relative mx-auto w-full overflow-hidden rounded-xl"
              style={{
                width: '320px',
                height: '450px',
                bottom: '-23px',
              }}
            >
              <Image
                src="/landing/smiling-woman.png"
                alt="Smiling woman with sunglasses"
                layout="fill"
                objectFit="cover"
                quality={100}
              />
            </div>
          </div>
        </div>
        <div className="lg:col-span-1">
          <div className="flex h-[647px] flex-col rounded-3xl border-2 border-black p-6 ">
            <div className="mb-4 flex items-center">
              <Link href="https://github.com/XamHans/bubatz-open-source/">
                <Github className="mr-2 h-8 w-8" />
                <h3 className="text-2xl font-bold">Selbsthosting</h3>
              </Link>
            </div>
            <p className="mb-4 text-gray-500">
              Perfekt für technikbegeisterte, die volle Kontrolle wollen.
            </p>
            <ul className="mb-8 flex-grow space-y-2">
              <li className="flex items-center">
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
                Voller Zugriff auf alle Features
              </li>
              <li className="flex items-center">
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
                Hoste auf eigener Infrastruktur
              </li>
              <li className="flex items-center">
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
                Komplette Datenkontrolle
              </li>
            </ul>
            <div className="mt-auto">
              <div className="mb-6 border-t border-gray-200 pt-4">
                <h4 className="text-3xl font-bold">Kostenlos</h4>
              </div>
              <Link
                href="https://github.com/XamHans/bubatz-open-source/"
                className="block"
              >
                <button className="w-full rounded-xl bg-[#1c1c1c] py-3 font-semibold text-white">
                  Starte auf GitHub
                </button>
              </Link>
            </div>
          </div>
        </div>
        <div className="lg:col-span-1">
          <div className="flex h-[647px] flex-col rounded-3xl border-2 border-black p-6">
            <div className="mb-4 flex items-center">
              <Gift className="mr-2 h-8 w-8" />
              <h3 className="text-2xl font-bold">Sorglos-Paket</h3>
            </div>
            <p className="mb-4 text-gray-500">
              Ob 50 oder 500 Mitglieder. Perfekt für jede Größe.
            </p>
            <ul className="mb-8 flex-grow space-y-2">
              <li className="flex items-center">
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
                Eigene Datenbank für deinen Club
              </li>
              <li className="flex items-center">
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
                Wartung und Updates inklusive
              </li>
              <li className="flex items-center">
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
                Vorrangiger Support
              </li>
              <li className="flex items-center">
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
                Automatische Backups
              </li>
              <li className="flex items-center">
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
                SSL-Zertifikat inklusive
              </li>
            </ul>
            <div className="mt-auto">
              <div className="mb-6 border-t border-gray-200 pt-4">
                <h4 className="text-3xl font-bold">
                  €24.5<span className="text-lg font-normal">/Monat</span>
                </h4>
              </div>
              <Link
                href="https://calendly.com/muellerjohannes/bubatz-club-manager"
                className="block"
              >
                <button className="w-full rounded-xl bg-[#c5f467] py-3 font-semibold text-black">
                  Jetzt starten
                </button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
