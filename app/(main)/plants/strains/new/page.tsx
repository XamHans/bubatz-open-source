import Breadcrumbs from '@/components/generic/BreadCrumbs'
import { Container } from '@/components/generic/Container'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { siteConfig } from '@/config/site'
import { ChevronLeft } from 'lucide-react'
import { Metadata } from 'next'
import { useTranslations } from 'next-intl'
import Link from 'next/link'
import NewStrainForm from './components/NewStrainForm'

export const metadata: Metadata = {
  title: 'Neue Sorte hinzufügen',
  description: 'Fügen Sie eine neue Cannabis-Sorte zu Ihrer Sammlung hinzu',
}

export default async function NewStrainPage() {
  const t = useTranslations('Plants')
  const tb = useTranslations('General.breadcrumbs')

  const breadcrumbs = [
    { label: tb('dashboard'), href: '/dashboard' },
    { label: tb('plants'), href: '/plants' },
    {
      label: t('actions.newStrain'),
      href: siteConfig.links.plants.strains.new,
    },
  ]

  return (
    <>
      <div className="mb-8 flex items-center justify-center gap-4">
        <Link href="/plants">
          <Button variant="outline" size="icon" className="h-9 w-9">
            <ChevronLeft className="h-5 w-5" />
            <span className="sr-only">{t('newStrain.form.back')}</span>
          </Button>
        </Link>
        <Breadcrumbs items={breadcrumbs} />
      </div>
      <Container className="space-y-4">
        <Card>
          <CardHeader className="px-7">
            <CardTitle>{t('actions.newStrain')}</CardTitle>
            <CardDescription>
              {t('newStrain.form.description.description')}
            </CardDescription>
          </CardHeader>
          <CardContent className="bg-transparent">
            <NewStrainForm />
          </CardContent>
        </Card>
      </Container>
    </>
  )
}
