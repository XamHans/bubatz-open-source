import { Container } from '@/components/generic/Container'
import { IconType } from 'react-icons'
import { FaSeedling, FaShoppingCart, FaUsers } from 'react-icons/fa'

export type Feature = {
  title: string
  description: string
  icon: IconType
}

export const features: Feature[] = [
  {
    title: 'Mitgliederverwaltung',
    description:
      'Bubatz Club Manager bietet ein umfassendes Mitgliederverwaltungssystem. Füge Clubmitglieder einfach hinzu, aktualisiere ihre Daten und verfolge ihre Rollen, Zahlungshistorie und Cannabis-Verkäufe.',
    icon: FaUsers,
  },
  {
    title: 'Anbau-Tracking',
    description:
      'Mit unserem Anbau-Tracking kannst du mehrere Chargen und Pflanzen gleichzeitig überwachen. Verfolge wichtige Kennzahlen, Wachstumsphasen und Erträge für jede Charge, um optimales Anbaumanagement und Compliance sicherzustellen.',
    icon: FaSeedling,
  },
  {
    title: 'Verkaufs- und Bestandsmanagement',
    description:
      'Die rechtlichen Regularien zur Cannabis Abgabe sind in der Software integriert. Das heißt du kannst sicher sein, dass du immer im Rahmen des Gesetzes handelst. Bevor ein Verkauf getätigt wird, überprüft die Software aufgrund vorheriger Käufe und Alter des Mitglieds ob ein Kauf erlaubt ist oder nicht. So kannst du sicher sein das Heranwachsender (18-21) kein hohes THC Produkt kaufen und die monatlichen Beschränkungen eingehalten.',
    icon: FaShoppingCart,
  },
]

export default function Features() {
  return (
    <section className="flex flex-col items-center justify-center gap-20 py-20">
      <div className="grid gap-3">
        <h2 className="text-center text-2xl font-bold text-foreground sm:text-3xl">
          Bubatz Club Manager Vorteile
        </h2>
        <Container className="max-w-2xl text-center text-base text-muted-foreground sm:text-xl">
          Unsere Features sind darauf ausgelegt, dir bei der effizienten
          Verwaltung deines Cannabis-Clubs zu helfen und dabei die deutschen
          Vorschriften einzuhalten.
        </Container>
      </div>
      <div className="grid max-w-6xl grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
        {features.map((feature, idx) => (
          <FeatureCard key={feature.title + idx} index={idx + 1} {...feature} />
        ))}
      </div>
    </section>
  )
}

type FeatureCardProps = Feature & {
  index: number
}

function FeatureCard({
  title,
  description,
  icon: Icon,
  index,
}: FeatureCardProps) {
  return (
    <div className="flex flex-col gap-6 rounded-[25px] border border-border bg-muted/50 p-6 transition-colors duration-300 hover:bg-muted/20">
      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary text-primary-foreground">
        <Icon className="h-6 w-6" />
      </div>
      <div className="flex flex-col gap-2">
        <h3 className="text-xl font-bold text-foreground">{title}</h3>
        <p className="text-sm text-muted-foreground">{description}</p>
      </div>
    </div>
  )
}
