/* eslint-disable prettier/prettier */
'use client'

import { Minus, Plus } from 'lucide-react'
import { useState } from 'react'

const faqs = [
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
    <section className="w-full py-12 md:py-24 lg:py-32">
      <div className="container px-4 md:px-6">
        <div className="mb-8 flex flex-col items-start space-y-4">
          <div className="inline-block rounded-lg bg-[#c5f467] px-3 py-1 text-sm font-semibold">
            Häufig gestellte Fragen
          </div>
          <p className="text-zinc-500 dark:text-zinc-400">
            Unsere FAQs beantworten die meisten deiner Fragen. Für weitere
            Informationen erreichst du uns jederzeit unter info@bubatz.club.
          </p>
        </div>
        <div className="space-y-4">
          {faqs.map((faq) => (
            <div
              key={faq.id}
              className={`overflow-hidden rounded-3xl  transition-all duration-200 ${
                openItem === faq.id ? 'bg-[#c5f467]' : 'bg-[#f0f0f0]'
              }`}
            >
              <button
                className="flex w-full items-center justify-between p-6 text-left"
                onClick={() => setOpenItem(openItem === faq.id ? '' : faq.id)}
              >
                <div className="flex items-center">
                  <span className="mr-4 font-ingrafts text-4xl font-bold">
                    {faq.id}
                  </span>
                  <h3 className="text-xl font-semibold">{faq.question}</h3>
                </div>
                {openItem === faq.id ? (
                  <Minus className="ml-4 flex-shrink-0" />
                ) : (
                  <Plus className="ml-4 flex-shrink-0" />
                )}
              </button>
              {openItem === faq.id && (
                <div className="px-6 pb-6">
                  <p>{faq.answer}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
