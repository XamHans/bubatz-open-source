import SkeletonLoader from '@/app/components/SkeletonLoader'
import Breadcrumbs from '@/components/generic/BreadCrumbs'
import { Button } from '@/components/ui/button'
import { fetchSaleDetailsUseCase } from '@/modules/sales/use-cases'
import { ChevronLeft } from 'lucide-react'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { Suspense } from 'react'
import SaleGeneralInfo from './components/SaleGeneralInfo'
import SaleItemsCards from './components/SaleItemCard'

interface SaleDetailPageProps {
  params: { id: string }
}

// This component will handle data fetching and rendering
async function SaleContent({ id }: { id: string }) {
  const { data } = await fetchSaleDetailsUseCase({ saleId: +id })
  if (data.failure) {
    notFound()
  }

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
  const breadcrumbs = [
    { label: 'Dashboard', href: '/dashboard' },
    { label: 'Sales', href: '/sales' },
    { label: 'Sale Details' },
  ]

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="mb-8 flex items-center justify-center gap-4">
        <Link href="/sales">
          <Button variant="outline" size="icon" className="h-9 w-9">
            <ChevronLeft className="h-5 w-5" />
            <span className="sr-only">Back</span>
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
