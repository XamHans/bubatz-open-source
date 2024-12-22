import { Button } from '@/components/ui/button'
import Image from 'next/image'
import Link from 'next/link'

export default function Hero() {
  return (
    <section className="w-full bg-white px-4  md:px-0">
      <div className="grid gap-6 lg:grid-cols-2 lg:gap-12 xl:grid-cols-2">
        <div className="flex flex-col justify-center space-y-4 md:space-y-6">
          <h1 className="font-ingrafts text-[2.5rem] font-normal leading-tight md:text-[3.5rem] lg:text-[60px] lg:leading-[80px]">
            <span className="text-black">Die </span>
            <span
              className="text-[#B9FF66]"
              style={{
                WebkitTextStroke: '1px black',
                //@ts-ignore
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
                //@ts-ignore
                textStroke: '1px black',
              }}
            >
              Software{' '}
            </span>
            <span className="text-black">für deinen</span>
            <br />
            <span className="text-black">Cannabis Social Club.</span>
          </h1>
          <p className="text-base text-zinc-800 md:max-w-[600px] md:text-xl">
            Mit bubatz erhältst du alle wichtigen Tools zur effizienten
            Organisation deiner Anbauvereinigung. Verwalte Mitglieder und
            behalte den Überblick über Anbau und Weitergabe - einfach, digital
            und rechtssicher (und vollkommen kostenlos).
          </p>
          <div className="flex flex-col gap-2 min-[400px]:flex-row">
            <Link href="/signin">
              <Button className="w-full bg-[#b6f36e] p-4 text-lg font-bold text-black hover:bg-[#a5e45d] min-[400px]:w-auto md:p-6 md:text-xl">
                Kostenlos testen
              </Button>
            </Link>
          </div>
        </div>
        <div className="flex items-center justify-center pt-8 md:pt-0">
          <div className="relative h-[250px] w-full md:h-[350px] lg:h-[450px]">
            <Image
              src="/landing/hero-image.svg"
              alt="Cannabis plants with overlaid software feature icons"
              layout="fill"
              objectFit="contain"
              className="rounded-3xl"
              priority
            />
          </div>
        </div>
      </div>
    </section>
  )
}
