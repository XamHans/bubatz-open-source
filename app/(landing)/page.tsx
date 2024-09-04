import { Container } from '@/components/generic/Container'
import { Button, buttonVariants } from '@/components/ui/button'
import { siteConfig } from '@/config/site'
import { Check, Database, ExternalLinkIcon } from 'lucide-react'
import Link from 'next/link'
import Features from './components/features'

export default async function HomePage() {
  return (
    <>
      <section className="container flex flex-col items-center justify-center gap-4 py-20">
        <Link
          href="#pricing"
          className="flex items-center space-x-2 rounded-md bg-secondary px-3 py-2 text-sm hover:bg-secondary/80"
        >
          <span>🌿</span>
          <span className="font-medium">
            Open Source & 100% der Daten gehören dir
          </span>
          <ExternalLinkIcon className="h-4 w-4 flex-shrink-0" />
        </Link>
        <Container className="font-heading text-center text-3xl font-bold sm:text-4xl sm:leading-tight md:text-5xl md:leading-tight">
          Club Management für Cannabis-Clubs
        </Container>
        <Container className="text-center text-muted-foreground sm:text-xl">
          Bubatz Club Manager unterstützt Cannabis-Clubs in Deutschland mit
          fortschrittlichen Tools für Mitgliederverwaltung, Anbauüberwachung und
          Verkaufskontrolle. Optimiere deine Abläufe und stelle die gesetzliche
          Compliance mit unserer umfassenden Club-Management-Lösung sicher.
        </Container>
        <div className="flex items-center gap-4">
          <Link
            href={siteConfig.links.signIn}
            className={buttonVariants({
              className: 'flex items-center gap-2 md:px-12',
            })}
          >
            Jetzt kostenlos testen
          </Link>
        </div>
      </section>

      <section className="container py-20">
        <div className="mx-auto max-w-4xl text-center">
          <Database className="mx-auto mb-6 h-16 w-16 text-primary" />
          <h2 className="mb-4 text-3xl font-bold">Dein Club, deine Daten</h2>
          <p className="text-xl">
            Jeder Club bekommt seine eigene Datenbank, was vollständige
            Datenkontrolle und Privatsphäre garantiert. Egal ob du selbst
            hostest oder unsere gehostete Lösung nutzt, deine Daten bleiben
            deine.
          </p>
        </div>
      </section>

      <section id="features">
        <Features />
      </section>

      <section id="pricing" className="container bg-secondary/10 py-20">
        <div className="mx-auto max-w-5xl">
          <h2 className="mb-12 text-center text-3xl font-bold">
            Wähle deinen Plan
          </h2>
          <div className="grid gap-8 md:grid-cols-2">
            <div className="flex flex-col rounded-lg bg-background p-8 shadow-md">
              <div className="flex-grow">
                <h3 className="mb-2 text-2xl font-semibold">Selbst gehostet</h3>
                <p className="mb-4 text-3xl font-bold">Kostenlos</p>
                <p className="mb-6 text-muted-foreground">
                  Perfekt für technikbegeisterte Clubs, die volle Kontrolle
                  wollen.
                </p>
                <ul className="mb-6 space-y-2">
                  <li className="flex items-center">
                    <Check className="mr-2 h-5 w-5 text-green-500" />
                    Voller Zugriff auf alle Features
                  </li>
                  <li className="flex items-center">
                    <Check className="mr-2 h-5 w-5 text-green-500" />
                    Hoste auf deiner eigenen Infrastruktur
                  </li>
                  <li className="flex items-center">
                    <Check className="mr-2 h-5 w-5 text-green-500" />
                    Komplette Datenkontrolle
                  </li>
                </ul>
              </div>
              <Button variant="outline" className="w-full">
                <Link href={siteConfig.links.gitHub}>Starte auf GitHub</Link>
              </Button>
            </div>
            <div className="relative flex flex-col overflow-hidden rounded-lg bg-background p-8 shadow-md">
              <div className="absolute right-5 top-5 rounded-full bg-primary px-3 py-1 text-sm font-semibold text-primary-foreground">
                Empfohlen
              </div>
              <div className="flex-grow">
                <h3 className="mb-2 text-2xl font-semibold">Verwaltet</h3>
                <p className="mb-4 text-3xl font-bold">
                  €24,50<span className="text-base font-normal">/Monat</span>
                </p>
                <p className="mb-6 text-muted-foreground">
                  Unkomplizierte Lösung für Clubs aller Größen. Zahle nur
                  24,50€, egal ob 50 oder 500 Mitglieder.
                </p>
                <ul className="mb-6 space-y-2">
                  <li className="flex items-center">
                    <Check className="mr-2 h-5 w-5 text-green-500" />
                    Eigene Datenbank für deinen Club
                  </li>
                  <li className="flex items-center">
                    <Check className="mr-2 h-5 w-5 text-green-500" />
                    Wartung und Updates inklusive
                  </li>
                  <li className="flex items-center">
                    <Check className="mr-2 h-5 w-5 text-green-500" />
                    Vorrangiger Support
                  </li>
                  <li className="flex items-center">
                    <Check className="mr-2 h-5 w-5 text-green-500" />
                    Automatische Backups
                  </li>
                  <li className="flex items-center">
                    <Check className="mr-2 h-5 w-5 text-green-500" />
                    Website-Bereitstellung | deinclub.bubatz.club
                  </li>
                  <li className="flex items-center">
                    <Check className="mr-2 h-5 w-5 text-green-500" />
                    SSL-Zertifikat inklusive
                  </li>
                  <li className="flex items-center">
                    <Check className="mr-2 h-5 w-5 text-green-500" />
                    Hilfe bei der Datenschutzerklärung
                  </li>
                </ul>
              </div>
              <Link href="https://calendly.com/muellerjohannes/bubatz-club-manager">
                {' '}
                <Button className="w-full">Jetzt loslegen</Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* <section id="testimonials" className="md:px-60">
        <Testimonials />
      </section> */}
    </>
  )
}

async function getRepoStars() {
  const response = await fetch(
    'https://api.github.com/repos/your-repo/bubatz-club-manager',
    {
      next: {
        // run every 15 minutes
        revalidate: 900,
      },
    },
  )

  const data: unknown = await response.json()
  const stars: number = (data as { stargazers_count?: string })
    ?.stargazers_count
    ? Number((data as { stargazers_count?: string }).stargazers_count)
    : 0

  return stars
}
