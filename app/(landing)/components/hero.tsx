import { Button } from '@/components/ui/button'
import Image from 'next/image'
import Link from 'next/link'

export default function Hero() {
  return (
    <section
      id="hero"
      className="w-full bg-white px-4 py-8 sm:px-6 md:px-8 lg:px-12"
    >
      <div className="mx-auto max-w-7xl">
        <div className="grid items-center gap-8 lg:grid-cols-2 lg:gap-12">
          <div className="flex flex-col justify-center space-y-6">
            <h1 className="font-ingrafts text-3xl font-normal leading-tight sm:text-4xl md:text-5xl lg:text-6xl">
              <span className="text-black">Die </span>
              <span
                className="text-[#B9FF66]"
                style={{
                  WebkitTextStroke: '1px black',
                  textStroke: '1px black',
                }}
              >
                Open-Source
              </span>
              <br />
              <span
                className="text-[#B9FF66]"
                style={{
                  WebkitTextStroke: '1px black',
                  textStroke: '1px black',
                }}
              >
                Software{' '}
              </span>
              <span className="text-black">für deinen</span>
              <br />
              <span className="text-black">Cannabis Social Club.</span>
            </h1>

            <p className="max-w-[900px] text-xl text-zinc-500 md:text-lg lg:text-xl">
              Mit bubatz erhältst du alle wichtigen Tools zur effizienten
              Organisation deiner Anbauvereinigung. Verwalte Mitglieder und
              behalte den Überblick über Anbau und Weitergabe - einfach, digital
              und rechtssicher (und vollkommen kostenlos).
            </p>

            <div className="flex flex-col gap-4 sm:flex-row">
              <Link href="/signin" className="w-full sm:w-auto">
                <Button className="w-full bg-[#b6f36e] px-6 py-3 text-base font-bold text-black transition-colors hover:bg-[#a5e45d] sm:text-lg md:px-8 md:py-4 md:text-xl">
                  Kostenlos testen
                </Button>
              </Link>
            </div>
          </div>

          <div className="flex items-center justify-center lg:pt-0">
            <div className="relative aspect-video w-full max-w-2xl">
              <Image
                src="/landing/hero-image.svg"
                alt="Cannabis plants with overlaid software feature icons"
                fill
                className="rounded-3xl object-contain"
                priority
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
