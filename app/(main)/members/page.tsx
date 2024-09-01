import { auth } from '@/auth'
import Breadcrumbs from '@/components/generic/BreadCrumbs'
import { Container } from '@/components/generic/Container'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { siteConfig } from '@/config/site'
import { SessionProvider } from 'next-auth/react'
import { getTranslations } from 'next-intl/server'
import { redirect } from 'next/navigation'
import MemberTable from './components/MemberTable'

async function MemberListPage() {
  const session = await auth()
  if (!session) redirect(siteConfig.links.signIn)

  const t = await getTranslations('Members')
  const g = await getTranslations('General')

  const breadcrumbs = [
    { label: g('breadcrumbs.dashboard'), href: '/dashboard' },
    { label: g('breadcrumbs.members') },
  ]

  return (
    <SessionProvider session={session}>
      <div className="mb-8 flex items-center justify-center gap-4">
        <Breadcrumbs items={breadcrumbs} />
      </div>
      <Container className="space-y-12">
        <Card>
          <CardHeader className="px-7">
            <CardTitle>{t('pageTitle')}</CardTitle>
            <CardDescription>{t('pageDescription')}</CardDescription>
          </CardHeader>
          <CardContent>
            <MemberTable />
          </CardContent>
        </Card>
      </Container>
    </SessionProvider>
  )
}

export default MemberListPage
