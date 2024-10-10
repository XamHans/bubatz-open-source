import { ArrowRight } from 'lucide-react'
import Image from 'next/image'

export default function Features() {
  return (
    <section id="features" className="w-full py-12 md:py-24 lg:py-32">
      <div className="container px-4 md:px-6">
        <div className="flex flex-col items-start space-y-4">
          <div className="inline-block rounded-lg bg-[#c5f467] px-3 py-1 text-sm font-semibold">
            Funktionen
          </div>
          <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl">
            Funktionen
          </h2>
          <p className="max-w-[900px] text-zinc-500 dark:text-zinc-400 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
            Nutze unsere neuesten Funktionen und erlebe, wie wir dir deinen
            Club-Alltag erleichtern. Du sparst Zeit & Kosten und kannst dich auf
            das Wesentliche konzentrieren.
          </p>
        </div>
        <div className="mt-8 grid gap-6 md:grid-cols-2">
          <FeatureCard
            title="Mitglieder-verwaltung"
            bgColor="bg-[#f0f0f0]"
            icon="/placeholder.svg?height=100&width=100"
            iconAlt="Member management icon"
          />
          <FeatureCard
            title="Anbau-planung"
            bgColor="bg-[#c5f467]"
            icon="/placeholder.svg?height=100&width=100"
            iconAlt="Cultivation planning icon"
          />
          <FeatureCard
            title="Verkaufs-management"
            bgColor="bg-[#1c1c1c]"
            textColor="text-white"
            icon="/placeholder.svg?height=100&width=100"
            iconAlt="Sales management icon"
          />
          <FeatureCard
            title="Daten-management"
            bgColor="bg-[#f0f0f0]"
            icon="/placeholder.svg?height=100&width=100"
            iconAlt="Data management icon"
          />
        </div>
      </div>
    </section>
  )
}

function FeatureCard({
  title,
  bgColor,
  textColor = 'text-zinc-900',
  icon,
  iconAlt,
}) {
  return (
    <div className={`overflow-hidden rounded-3xl ${bgColor} shadow-md`}>
      <div className="flex h-full flex-col p-6">
        <h3 className={`mb-2 text-xl font-bold ${textColor}`}>{title}</h3>
        <div className="flex flex-grow items-center justify-center">
          <Image
            src={icon}
            alt={iconAlt}
            width={100}
            height={100}
            className="my-4"
          />
        </div>
        <button className={`flex items-center ${textColor} font-semibold`}>
          Erfahre mehr
          <ArrowRight className="ml-2 h-4 w-4" />
        </button>
      </div>
    </div>
  )
}
