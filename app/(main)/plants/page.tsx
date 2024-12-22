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
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { siteConfig } from '@/config/site'
import { PlusCircle } from 'lucide-react'
import { SessionProvider } from 'next-auth/react'
import { getTranslations } from 'next-intl/server'
import Link from 'next/link'
import BatchesTable from './components/BatchesTable'
import StrainsTable from './components/StrainsTable'

async function PlantListPage() {
  const session = await auth()
  const t = await getTranslations('Plants')
  const g = await getTranslations('General')

  const breadcrumbs = [
    { label: g('breadcrumbs.dashboard'), href: '/dashboard' },
    { label: g('breadcrumbs.plants'), href: '/plants' },
  ]
  return (
    <SessionProvider session={session}>
      <div className="mb-8 flex items-center justify-center gap-4">
        <Breadcrumbs items={breadcrumbs} />
      </div>

      <Container className="space-y-4">
        <Card>
          <CardHeader className="px-7">
            <div className="grid grid-cols-2">
              <div>
                <CardTitle>{t('pageTitle')}</CardTitle>
                <CardDescription>{t('pageDescription')}</CardDescription>
              </div>
              <div className="flex justify-end gap-2">
                <Link href={siteConfig.links.plants.batches.new}>
                  <Button size="sm" className="h-8 w-32 gap-1">
                    <PlusCircle className="h-3.5 w-3.5" />
                    <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
                      {t('actions.newBatch')}
                    </span>
                  </Button>
                </Link>
                <Link href={siteConfig.links.plants.strains.new}>
                  <Button size="sm" className="h-8 w-32 gap-1">
                    <PlusCircle className="h-3.5 w-3.5" />
                    <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
                      {t('actions.newStrain')}
                    </span>
                  </Button>
                </Link>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="batches">
              <div className="flex items-center">
                <TabsList>
                  <TabsTrigger value="batches">{t('tabs.batches')}</TabsTrigger>
                  <TabsTrigger value="strains">{t('tabs.strains')}</TabsTrigger>
                  <TabsTrigger value="archived" className="hidden sm:flex">
                    {t('tabs.archived')}
                  </TabsTrigger>
                </TabsList>
              </div>
              <TabsContent value="batches">
                <BatchesTable />
              </TabsContent>
              <TabsContent value="strains">
                <StrainsTable />
              </TabsContent>
              <TabsContent value="archived">
                <BatchesTable isArchived={true} />
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </Container>
    </SessionProvider>
  )
}

export default PlantListPage
