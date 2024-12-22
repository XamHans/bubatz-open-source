import SkeletonLoader from '@/app/components/SkeletonLoader'
import Breadcrumbs from '@/components/generic/BreadCrumbs'
import { Button } from '@/components/ui/button'
import { fetchSaleDetailsUseCase } from '@/modules/sales/use-cases'
import { ChevronLeft } from 'lucide-react'
import { useTranslations } from 'next-intl'
import Link from 'next/link'
import { Suspense } from 'react'
import SaleGeneralInfo from './components/SaleGeneralInfo'
import SaleItemsCards from './components/SaleItemCard'

interface SaleDetailPageProps {
  params: { id: string }
}

// This component will handle data fetching and rendering
async function SaleContent({ id }: { id: string }) {
  const { data } = await fetchSaleDetailsUseCase({ saleId: +id })

  return (
    <div className="grid gap-8 lg:grid-cols-3">
      <div className="space-y-8 lg:col-span-2">
        <SaleItemsCards items={data.success.items} />
      </div>
      <div>
        <SaleGeneralInfo sale={data.success} />
      </div>
    </div>
  )
}

export default function SaleDetailPage({
  params: { id },
}: SaleDetailPageProps) {
  const t = useTranslations('General')
  const tSales = useTranslations('Sales')

  const breadcrumbs = [
    { label: t('breadcrumbs.dashboard'), href: '/dashboard' },
    { label: t('breadcrumbs.sales'), href: '/sales' },
    { label: tSales('saleInfo.title', { id }) },
  ]

  return (
    <div className="min-h-screen ">
      <div className="mb-8 flex items-center justify-center gap-4">
        <Link href="/sales">
          <Button variant="outline" size="icon" className="h-9 w-9">
            <ChevronLeft className="h-5 w-5" />
            <span className="sr-only">{t('form.actions.cancel')}</span>
          </Button>
        </Link>
        <Breadcrumbs items={breadcrumbs} />
      </div>

      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <Suspense fallback={<SkeletonLoader type="page" />}>
          <SaleContent id={id} />
        </Suspense>
      </div>
    </div>
  )
}
