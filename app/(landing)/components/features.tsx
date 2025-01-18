import React from 'react'

export type Feature = {
  title: string
  icon: string
  bgColor?: string
}

const features: Feature[] = [
  {
    title: 'Mitglieder-verwaltung',
    icon: '/landing/feature-1.svg',
    bgColor: 'bg-background',
  },
  {
    title: 'Anbau-planung',
    icon: '/landing/feature-2.svg',
    bgColor: 'bg-[#DCFBB0]',
  },
  {
    title: 'Verkaufs-management',
    icon: '/landing/feature-3.svg',
    bgColor: 'bg-[#18181B]',
  },
  {
    title: 'Daten-management',
    icon: '/landing/feature-4.svg',
    bgColor: 'bg-background',
  },
]

export default function Features() {
  return (
    <section className="w-full px-4 py-8 sm:px-6 md:px-8 lg:px-12">
      <div className="mx-auto max-w-7xl">
        <div className="flex flex-col space-y-4">
          <div className="inline-block w-fit rounded-lg bg-[#c5f467] px-3 py-1.5">
            <span className="font-semibold">Funktionen</span>
          </div>

          <h2 className="text-2xl font-bold tracking-tight sm:text-3xl md:text-4xl lg:text-5xl">
            Features
          </h2>

          <p className="max-w-[900px] text-xl text-zinc-500 md:text-lg lg:text-xl">
            Nutze unsere neuesten Funktionen und erlebe, wie wir dir deinen
            Club-Alltag erleichtern. Du sparst Zeit & Kosten und kannst dich auf
            das Wesentliche konzentrieren.
          </p>
        </div>

        <div className="mt-8 grid grid-cols-1 gap-6 sm:gap-8 md:mt-12 md:grid-cols-2">
          {features.map((feature, idx) => (
            <FeatureCard key={feature.title + idx} {...feature} />
          ))}
        </div>
      </div>
    </section>
  )
}

function FeatureCard({ title, icon, bgColor = 'bg-background' }: Feature) {
  const titleParts = title.split('-')
  const isDarkBg = bgColor === 'bg-[#18181B]'

  return (
    <div
      className={`
        relative 
        flex
        h-48
        flex-col 
        justify-between 
        rounded-tl-2xl
        border-2 
        border-black 
        pt-6
        shadow-md
        transition-all 
        duration-300 
        hover:scale-[0.98]
        hover:shadow-sm
        sm:h-64
        md:h-72
        lg:h-80
        ${bgColor}
      `}
    >
      <div className="flex h-full flex-col justify-between p-4 sm:p-6 md:p-8">
        <div className="relative z-10">
          <span className="inline-block rounded-lg bg-[#c5f467] px-3 py-1.5 font-medium sm:px-4 sm:py-2 md:text-lg">
            {titleParts.map((part, index) => (
              <React.Fragment key={part}>
                {part}
                {index < titleParts.length - 1 && <br />}
              </React.Fragment>
            ))}
          </span>
        </div>

        <div className="absolute bottom-0 right-0 top-1/2 -translate-y-1/2 p-4 sm:p-6 md:p-8">
          <img
            src={icon}
            alt={title}
            className="h-24 w-24 object-contain sm:h-32 sm:w-32 md:h-40 md:w-40 lg:h-48 lg:w-48"
          />
        </div>
      </div>
    </div>
  )
}
