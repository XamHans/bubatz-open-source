'use client'

import { motion } from 'framer-motion'
import { ChevronRight, Linkedin } from 'lucide-react'
import Image from 'next/image'
import { useState } from 'react'

export default function TeamSection() {
  return (
    <section id="team" className="w-full bg-white py-12 md:py-24 lg:py-16">
      <div className="container px-4 md:px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-12 flex flex-col items-start space-y-2 sm:flex-row sm:items-center sm:space-x-4 sm:space-y-0"
        >
          <div className="rounded-lg bg-[#c5f467] px-3 py-1">
            <h2 className="text-2xl font-bold">Unser Team</h2>
          </div>
          <p className="max-w-2xl text-xl">
            Lernen Sie das erfahrene Team hinter unserem erfolgreichen
            Open-Source-Projekt kennen
          </p>
        </motion.div>
        <div className="grid gap-8 md:grid-cols-2">
          <TeamMemberCard
            name="Johannes Hayer"
            position="CTO & Mitgründer"
            description="Bringt die technische Seite unseres Open-Source-Projekts voran. Schreibt Code, verbessert bestehende Funktionen und unterstützt aktiv unsere Community-Mitglieder bei ihren Beiträgen. Ist immer auf der Suche nach Wegen, unser Projekt noch besser zu machen."
            imageSrc="/landing/team/hans.png"
          />
          <TeamMemberCard
            name="Thomas Wiedmayer"
            position="CMO & Mitgründer"
            description="Sorgt dafür, dass unser Open-Source-Projekt die Menschen erreicht, die es brauchen. Steht im engen Austausch mit der Community, sammelt Feedback und hilft neuen Nutzern beim Einstieg. Plant außerdem unsere Events und Community-Treffen."
            imageSrc="/landing/team/tom.png"
          />
        </div>
      </div>
    </section>
  )
}

function TeamMemberCard({ name, position, description, imageSrc }) {
  const [isExpanded, setIsExpanded] = useState(false)

  return (
    <motion.div
      whileHover={{ scale: 1.03 }}
      transition={{ type: 'spring', stiffness: 300 }}
      className="relative flex flex-col justify-between rounded-[2rem] border-2 border-black bg-white p-6 shadow-lg"
    >
      <div className="absolute right-4 top-4">
        <a href="#" aria-label={`${name}'s LinkedIn profile`}>
          <Linkedin className="h-6 w-6 rounded-full bg-[#c5f467] p-1 text-black transition-colors hover:bg-[#b1e049]" />
        </a>
      </div>
      <div className="mb-4 flex flex-col sm:flex-row sm:items-center">
        <div className="relative mb-4 h-24 w-24 flex-shrink-0 sm:mb-0 sm:mr-4">
          <div className="absolute inset-0 -rotate-12 transform rounded-full bg-[#c5f467]"></div>
          <div className="relative z-10 h-24 w-24">
            <Image
              src={imageSrc}
              alt={name}
              fill
              style={{ objectFit: 'cover' }}
              className="rounded-full"
              sizes="(max-width: 768px) 96px, 128px"
            />
          </div>
        </div>
        <div>
          <h3 className="text-2xl font-semibold">{name}</h3>
          <p className="text-md text-gray-600">{position}</p>
        </div>
      </div>
      <p className="mb-4 text-sm">
        {isExpanded ? description : `${description.slice(0, 100)}...`}
      </p>
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="inline-flex items-center rounded text-sm font-semibold text-black hover:underline focus:outline-none focus:ring-2 focus:ring-[#c5f467] focus:ring-offset-2"
        aria-expanded={isExpanded}
      >
        {isExpanded ? 'Weniger anzeigen' : 'Mehr lesen'}
        <ChevronRight
          className={`ml-1 h-4 w-4 transition-transform ${isExpanded ? 'rotate-90' : ''}`}
        />
      </button>
    </motion.div>
  )
}
