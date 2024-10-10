import { Button } from '@/components/ui/button'
import Image from 'next/image'

export default function Hero() {
  return (
    <section className="w-full bg-white py-12 md:py-24 lg:py-32">
      <div className="container px-4 md:px-6">
        <div className="grid gap-6 lg:grid-cols-2 lg:gap-12 xl:grid-cols-2">
          <div className="flex flex-col justify-center space-y-6">
            <h1 className="font-ingrafts text-[60px] font-normal leading-[80px]">
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
            <p className="max-w-[600px] text-zinc-800 md:text-xl">
              Mit bubatz erhältst du alle wichtigen Tools zur effizienten
              Organisation deiner Anbauvereinigung. Verwalte Mitglieder und
              behalte den Überblick über Anbau und Weitergabe - einfach, digital
              und rechtssicher (und vollkommen kostenlos.)
            </p>
            <div className="flex flex-col gap-2 min-[400px]:flex-row">
              <Button className="bg-[#b6f36e] p-6 text-xl font-bold text-black hover:bg-[#a5e45d]">
                Jetzt kostenlos testen
              </Button>
            </div>
          </div>
          <div className="flex items-center justify-center">
            <div className="relative h-[400px] w-full">
              <Image
                src="/landing/hero-image.svg"
                alt="Cannabis plants with overlaid software feature icons"
                layout="fill"
                objectFit="cover"
                className="rounded-md"
              />
              {/* You would need to add the icons and lines as an overlay here */}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
