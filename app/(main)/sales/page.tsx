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
import { PlusCircle } from 'lucide-react'
import { getTranslations } from 'next-intl/server'
import Link from 'next/link'
import SalesTable from './components/SalesTable'

export default async function SalesPage() {
  const t = await getTranslations('Sales')
  const g = await getTranslations('General')

  const breadcrumbs = [
    { label: g('breadcrumbs.dashboard'), href: '/dashboard' },
    { label: g('breadcrumbs.sales') },
  ]

  return (
    <>
      <div className="mb-8 flex items-center justify-center gap-4">
        <Breadcrumbs items={breadcrumbs} />
      </div>{' '}
      <Container className="space-y-4">
        <Card>
          <CardHeader className="px-7">
            <div className="grid grid-cols-2">
              <div>
                <CardTitle>{t('pageTitle')}</CardTitle>
                <CardDescription>{t('pageDescription')}</CardDescription>
              </div>
              <div className="flex justify-end">
                <Link href={siteConfig.links.sales.new}>
                  <Button size="sm" className="h-8 w-32 gap-1">
                    <PlusCircle className="h-3.5 w-3.5" />
                    <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
                      {t('actions.new')}
                    </span>
                  </Button>
                </Link>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <SalesTable />
          </CardContent>
        </Card>
      </Container>
    </>
  )
}
