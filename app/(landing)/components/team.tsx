import { Linkedin } from 'lucide-react'
import Image from 'next/image'

export default function TeamSection() {
  return (
    <section id="team" className="w-full px-4 py-8 sm:px-6 md:px-8 lg:px-12">
      <div className="mx-auto max-w-7xl">
        <div className="flex flex-col space-y-4">
          <div className="inline-block w-fit rounded-lg bg-[#c5f467] px-3 py-1.5">
            <span className="font-semibold">Team</span>
          </div>

          <h2 className="text-2xl font-bold tracking-tight sm:text-3xl md:text-4xl lg:text-5xl">
            Unser Team
          </h2>

          <p className="max-w-[900px] text-xl text-zinc-500 md:text-lg lg:text-xl">
            Lernen Sie das erfahrene Team hinter unserem erfolgreichen
            Open-Source-Projekt kennen
          </p>
        </div>

        <div className="mt-8 grid gap-8 md:mt-12 md:grid-cols-2">
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

interface TeamMemberCardProps {
  name: string
  position: string
  description: string
  imageSrc: string
}

function TeamMemberCard({
  name,
  position,
  description,
  imageSrc,
}: TeamMemberCardProps) {
  return (
    <div className="relative flex flex-col justify-between rounded-[2rem] border-2 border-black bg-white p-6 shadow-lg transition-transform duration-300 hover:scale-[1.02]">
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
      <p className="">{description}</p>
    </div>
  )
}
