import SkeletonLoader from '@/app/components/SkeletonLoader'
import Breadcrumbs from '@/components/generic/BreadCrumbs'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { siteConfig } from '@/config/site'
import { getMemberDetail } from '@/modules/members/data-access'
import { ChevronLeft, Plus } from 'lucide-react'
import { getTranslations } from 'next-intl/server'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { Suspense } from 'react'
import MemberSalesTable from '../components/MemberSalesTable'
import PaymentTable from '../components/PaymentsTable'
import MemberGeneralInfo from './components/MemberGeneralInfo'

interface MemberDetailPageProps {
  params: { id: string }
}

async function MemberContent({ id }: { id: string }) {
  const member = await getMemberDetail(id)
  const t = await getTranslations('MemberDetail')

  if (!member) {
    notFound()
  }

  return (
    <div className="grid gap-8 lg:grid-cols-3">
      <div className="space-y-8 lg:col-span-2">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>{t('sales.title')}</CardTitle>
            <Link href={siteConfig.links.sales.new}>
              <Button size="sm" className="flex items-center gap-2">
                <Plus className="h-4 w-4" />
                {t('sales.newSale')}
              </Button>
            </Link>
          </CardHeader>
          <CardContent>
            <div className="prose dark:prose-invert max-w-none">
              <MemberSalesTable memberId={id} />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>{t('membershipPayments.title')}</CardTitle>
            <Link
              href={`${siteConfig.links.members.detail.replace(':id', id)}/payments/new`}
            >
              <Button size="sm" className="flex items-center gap-2">
                <Plus className="h-4 w-4" />
                {t('membershipPayments.newPayment')}
              </Button>
            </Link>
          </CardHeader>
          <CardContent>
            <div className="prose dark:prose-invert max-w-none">
              <PaymentTable memberId={id} />
            </div>
          </CardContent>
        </Card>
      </div>

      <div>
        <MemberGeneralInfo member={member} />
      </div>
    </div>
  )
}

export default async function MemberDetailPage({
  params: { id },
}: MemberDetailPageProps) {
  const t = await getTranslations('MemberDetail')

  const breadcrumbs = [
    { label: t('breadcrumbs.dashboard'), href: '/dashboard' },
    { label: t('breadcrumbs.members'), href: '/members' },
    { label: t('breadcrumbs.memberDetails') },
  ]

  return (
    <div className="min-h-screen ">
      <div className="mb-8 flex items-center justify-center gap-4">
        <Link href="/members">
          <Button variant="outline" size="icon" className="h-9 w-9">
            <ChevronLeft className="h-5 w-5" />
            <span className="sr-only">{t('backButton')}</span>
          </Button>
        </Link>
        <Breadcrumbs items={breadcrumbs} />
      </div>

      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="mb-8 flex items-center gap-4">
          <Link
            className="ml-auto hidden md:inline-flex "
            href={siteConfig.links.members.edit.replace(':id', id)}
          >
            <Button size="sm" className=" md:px-10">
              {t('editButton')}
            </Button>
          </Link>
        </div>

        <Suspense fallback={<SkeletonLoader type="page" />}>
          <MemberContent id={id} />
        </Suspense>
      </div>
    </div>
  )
}
