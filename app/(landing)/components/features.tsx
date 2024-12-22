'use client'
import { motion } from 'framer-motion'
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
    <section className="w-full px-4 md:px-0">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="mb-12 flex flex-col items-start space-y-2 sm:flex-row sm:items-start sm:space-x-4 sm:space-y-0"
      >
        <div className="rounded-lg bg-[#c5f467] px-3 py-1">
          <h2 className="text-2xl font-bold">Funktionen</h2>
        </div>
        <p className="max-w-6xl text-xl">
          Nutze unsere neuesten Funktionen und erlebe, wie wir dir deinen
          Club-Alltag erleichtern. Du sparst Zeit & Kosten und kannst dich auf
          das Wesentliche konzentrieren.
        </p>
      </motion.div>

      <div className="max-w-7xl">
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 md:gap-6">
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
        h-[250px] 
        w-full
        flex-col 
        justify-between 
        rounded-tl-[30px]
        border-2 
        border-black 
        pt-[30px]
        shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]
        sm:rounded-tl-[45px]
        sm:pt-[50px] 
        ${bgColor}
        transition-all 
        duration-300 
        hover:scale-[0.98]
        hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]
        sm:h-[316px]
      `}
    >
      <div className="flex h-full flex-col justify-between px-4 sm:px-8">
        <div className="relative z-10">
          <span className="inline-block rounded-lg bg-[#c5f467] px-3 py-1.5 text-base font-medium sm:px-4 sm:py-2 sm:text-lg">
            {titleParts.map((part, index) => (
              <React.Fragment key={part}>
                {part}
                {index < titleParts.length - 1 && <br />}
              </React.Fragment>
            ))}
          </span>
        </div>

        <div className="relative z-10 mb-4 flex items-center gap-2 sm:mb-8">
          {/* <span
            className={`text-base font-medium sm:text-lg ${
              isDarkBg ? 'text-white' : ''
            }`}
          >
            Erfahre mehr
          </span>
          <ArrowRight
            className={`h-4 w-4 sm:h-5 sm:w-5 ${isDarkBg ? 'text-white' : ''}`}
          /> */}
        </div>

        <div className="absolute right-4 top-1/2 -translate-y-1/2 sm:right-8">
          <img
            src={icon}
            alt={title}
            className="h-[150px] w-[150px] object-contain sm:h-[200px] sm:w-[200px]"
          />
        </div>
      </div>
    </div>
  )
}
