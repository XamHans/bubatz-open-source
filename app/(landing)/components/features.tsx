import { ArrowRight } from 'lucide-react'
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
    <section className="w-full py-20">
      <div className="mx-auto max-w-7xl px-4">
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
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

  return (
    <div
      className={`
        relative 
        flex h-[316px] 
        w-[600px] 
        flex-col 
        justify-between 
        rounded-tl-[45px] border-t pt-[50px] 
        ${bgColor}
        transition-all duration-300 
        hover:scale-[0.98]
      `}
    >
      <div className="flex h-full flex-col justify-between px-8">
        <div className="relative z-10">
          <span className="inline-block rounded-lg bg-[#DCFBB0] px-4 py-2 text-lg font-medium">
            {titleParts.map((part, index) => (
              <React.Fragment key={part}>
                {part}
                {index < titleParts.length - 1 && <br />}
              </React.Fragment>
            ))}
          </span>
        </div>

        <div className="relative z-10 mb-8 flex items-center gap-2">
          <span className="text-lg font-medium">Erfahre mehr</span>
          <ArrowRight className="h-5 w-5" />
        </div>

        <div className="absolute right-8 top-1/2 -translate-y-1/2">
          <img
            src={icon}
            alt={title}
            className="h-[200px] w-[200px] object-contain"
          />
        </div>
      </div>
    </div>
  )
}
