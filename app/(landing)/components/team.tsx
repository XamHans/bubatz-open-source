import { Linkedin } from 'lucide-react'
import Image from 'next/image'

export default function TeamSection() {
  return (
    <section id="team" className="w-full bg-white py-12 md:py-24 lg:py-32">
      <div className="container px-4 md:px-6">
        <div className="mb-8 flex flex-col items-start space-y-2 sm:flex-row sm:items-center sm:space-x-2 sm:space-y-0">
          <div className="rounded-lg bg-[#c5f467] px-3 py-1">
            <h2 className="text-2xl font-bold">Team</h2>
          </div>
          <p className="text-xl">
            Meet the skilled and experienced team behind our successful open
            source
          </p>
        </div>
        <div className="grid gap-6 md:grid-cols-3">
          <TeamMemberCard
            name="Hanz Bierhalz"
            position="CTO & Co-Founder"
            description="Nicht alles was glänzt ist aus Gold, aber alles was er anfasst wird zu scheiße."
            imageSrc="/landing/team/hans.png"
          />
          <TeamMemberCard
            name="Tom Weedmayer"
            position="CMO & Co-Founder"
            description="Kann richtig gut mit Menschen wenn er high ist. Unverschämte Cheatcodes am Start. aniB kciF"
            imageSrc="/landing/team/tom.png"
          />
          <TeamMemberCard
            name="Dr. Vock"
            position="Software Sales Intern"
            description="Will nichts mehr mit Menschen machen. Das Problem ist halt, er ist leider gut drin. ¿Que?"
            imageSrc="/landing/team/vock.png"
          />
        </div>
      </div>
    </section>
  )
}

function TeamMemberCard({ name, position, description, imageSrc }) {
  return (
    <div className="relative flex h-[280px] flex-col justify-between rounded-[2rem] border-2 border-black bg-white p-6 shadow-lg">
      <div className="absolute right-4 top-4">
        <Linkedin className="h-6 w-6 rounded-full bg-[#c5f467] p-1 text-black" />
      </div>
      <div className="mb-4 flex items-center">
        <div className="relative mr-4 h-20 w-20">
          <div className="absolute inset-0 -rotate-12 transform rounded-full bg-[#c5f467]"></div>
          <Image
            src={imageSrc}
            alt={name}
            width={80}
            height={80}
            className="relative z-10 rounded-full object-cover"
          />
        </div>
        <div>
          <h3 className="text-xl font-semibold">{name}</h3>
          <p className="text-sm text-gray-600">{position}</p>
        </div>
      </div>
      <p className="text-sm">{description}</p>
    </div>
  )
}
