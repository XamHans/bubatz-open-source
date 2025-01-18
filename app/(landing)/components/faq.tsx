'use client'

import { Minus, Plus } from 'lucide-react'
import { useState } from 'react'

interface FAQ {
  id: string
  question: string
  answer: string
}

const faqs: FAQ[] = [
  {
    id: '01',
    question: 'Kann ich bei bubatz auch Cannabis kaufen?',
    answer:
      'Nein, bubatz ist eine Verwaltungssoftware speziell für Cannabis Social Clubs. Wir verkaufen kein Cannabis und sind kein Marktplatz. Unser Fokus liegt darauf, die Verwaltung deines Clubs effizient und unkompliziert zu gestalten.',
  },
  {
    id: '02',
    question: 'Wie sicher sind meine Daten bei bubatz?',
    answer:
      'Die Sicherheit deiner Daten hat für uns höchste Priorität. Alle Informationen werden verschlüsselt übertragen und auf sicheren Servern in Deutschland gespeichert. Wir erfüllen die strengen Anforderungen der DSGVO und aktualisieren regelmäßig unsere Sicherheitsprotokolle, um deine Daten optimal zu schützen und Datenintegrität zu gewährleisten.',
  },
  {
    id: '03',
    question:
      'Welche Vorteile bietet bubatz gegenüber anderen Cannabis Social Club Softwares?',
    answer:
      'Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum.',
  },
  {
    id: '04',
    question: 'Was brauche ich, um bubatz zu nutzen?',
    answer:
      'Du kannst bubatz auf jedem internetfähigen Gerät nutzen – egal ob Smartphone, Tablet oder Computer. Alles, was du brauchst, ist ein aktueller Browser. Wir empfehlen Google Chrome oder Mozilla Firefox für die beste Leistung.',
  },
  {
    id: '05',
    question: 'Wo wird die Software gehostet?',
    answer:
      'Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum.',
  },
  {
    id: '06',
    question: 'Wie kann ich mich bei bubatz registrieren?',
    answer:
      'Melde dich ganz einfach über unsere Webseite an. Klicke hier, um zum Anmeldeformular zu gelangen und von allen Vorteilen von bubatz zu profitieren.',
  },
]

export default function FAQ() {
  const [openItem, setOpenItem] = useState('01')

  return (
    <section id="faq" className="w-full px-4 py-8 sm:px-6 md:px-8 lg:px-12">
      <div className="mx-auto max-w-7xl">
        <div className="flex flex-col space-y-4">
          <div className="inline-block w-fit rounded-lg bg-[#c5f467] px-3 py-1.5">
            <span className="font-semibold">FAQ</span>
          </div>

          <h2 className="text-2xl font-bold tracking-tight sm:text-3xl md:text-4xl lg:text-5xl">
            Häufig gestellte Fragen
          </h2>

          <p className="max-w-[900px] text-xl text-zinc-500 md:text-lg lg:text-xl">
            Unsere FAQs beantworten die meisten deiner Fragen. Für weitere
            Informationen erreichst du uns jederzeit unter info@bubatz.club.
          </p>
        </div>

        <div className="mt-8 space-y-3 md:mt-12 md:space-y-4">
          {faqs.map((faq) => (
            <div
              key={faq.id}
              className={`overflow-hidden rounded-2xl transition-all duration-200 md:rounded-3xl ${
                openItem === faq.id ? 'bg-[#c5f467]' : 'bg-[#f0f0f0]'
              }`}
            >
              <button
                className="flex w-full items-start justify-between p-4 text-left md:items-center md:p-6"
                onClick={() => setOpenItem(openItem === faq.id ? '' : faq.id)}
              >
                <div className="flex flex-col space-y-2 sm:flex-row sm:items-center sm:space-y-0">
                  <span className="font-ingrafts text-2xl font-bold sm:mr-4 sm:text-3xl md:text-4xl">
                    {faq.id}
                  </span>
                  <h3 className="text-base font-semibold sm:text-lg md:text-xl">
                    {faq.question}
                  </h3>
                </div>
                {openItem === faq.id ? (
                  <Minus className="ml-4 h-5 w-5 flex-shrink-0 md:h-6 md:w-6" />
                ) : (
                  <Plus className="ml-4 h-5 w-5 flex-shrink-0 md:h-6 md:w-6" />
                )}
              </button>
              {openItem === faq.id && (
                <div className="px-4 pb-4 md:px-6 md:pb-6">
                  <p className="">{faq.answer}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
