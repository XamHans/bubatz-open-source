import SkeletonLoader from '@/app/components/SkeletonLoader'
import Breadcrumbs from '@/components/generic/BreadCrumbs'
import { Button } from '@/components/ui/button'
import { siteConfig } from '@/config/site'
import {
  fetchBatchesByStrainIdUseCase,
  fetchStrainDetailsUseCase,
} from '@/modules/plants/use-cases'
import { ChevronLeft } from 'lucide-react'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { Suspense } from 'react'
import ArchiveStrainModal from './components/ArchiveStrainModal'
import StrainGeneralInfo from './components/StrainGeneralInfo'
import UpcomingYield from './components/UpcomingYield'

interface StrainDetailPageProps {
  params: { id: string }
}

export default async function StrainDetailPage({
  params: { id },
}: StrainDetailPageProps) {
  const breadcrumbs = [
    { label: 'Dashboard', href: '/dashboard' },
    { label: 'Plants', href: '/plants' },
    { label: 'Strains', href: '/plants' },
    { label: id.toString(), href: '/' },
  ]
  const { data: strainData } = await fetchStrainDetailsUseCase({ id: +id })
  if (strainData.failure) {
    notFound()
  }

  const { data: batchesData } = await fetchBatchesByStrainIdUseCase({
    strainId: +id,
  })

  return (
    <div className="min-h-screen ">
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
        <div className="mb-8 flex  gap-4">
          <Link
            className="ml-auto hidden md:inline-flex "
            href={siteConfig.links.plants.strains.edit.replace(':id', id)}
          >
            <Button size="sm" className=" md:px-10">
              Edit
            </Button>
          </Link>
        </div>

        <Suspense fallback={<SkeletonLoader type="page" />}>
          <div className="grid gap-8 lg:grid-cols-3">
            <div className="space-y-8 lg:col-span-2">
              <UpcomingYield batches={batchesData.success} />
            </div>

            <div className="grid auto-rows-max items-start gap-2 lg:gap-8">
              <StrainGeneralInfo strain={strainData.success} />
              <ArchiveStrainModal id={strainData.success.id} />
            </div>
          </div>
        </Suspense>
      </div>
    </div>
  )
}
