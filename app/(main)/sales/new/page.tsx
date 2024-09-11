import { auth } from '@/auth'
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
import { ChevronLeft } from 'lucide-react'
import { Metadata } from 'next'
import { getTranslations } from 'next-intl/server'
import Link from 'next/link'
import SaleForm from './components/SaleForm'

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations('Sales')
  return {
    title: t('newSale.title'),
    description: t('newSale.description'),
  }
}

export default async function NewSalePage() {
  const t = await getTranslations('General')
  const tSales = await getTranslations('Sales')
  const session = await auth()
  const breadcrumbs = [
    { label: t('breadcrumbs.dashboard'), href: '/dashboard' },
    { label: t('breadcrumbs.sales'), href: '/sales' },
    { label: tSales('newSale.title') },
  ]

  const metadata = await generateMetadata()

  return (
    <>
      <div className="mb-8 flex items-center justify-center gap-4">
        <Link href="/sales">
          <Button variant="outline" size="icon" className="h-9 w-9">
            <ChevronLeft className="h-5 w-5" />
            <span className="sr-only">{t('form.actions.cancel')}</span>
          </Button>
        </Link>
        <Breadcrumbs items={breadcrumbs} />
      </div>
      <Container className="space-y-4">
        <Card>
          <CardHeader className="px-7">
            <CardTitle>{metadata.title?.toString()}</CardTitle>
            <CardDescription>
              {metadata.description?.toString()}
            </CardDescription>
          </CardHeader>
          <CardContent className="bg-transparent">
            <SaleForm session={session} />
          </CardContent>
        </Card>
      </Container>
    </>
  )
}
