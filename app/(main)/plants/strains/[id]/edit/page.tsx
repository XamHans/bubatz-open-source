import SkeletonLoader from '@/app/components/SkeletonLoader'
import Breadcrumbs from '@/components/generic/BreadCrumbs'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card' // Import Card components
import { ChevronLeft } from 'lucide-react'
import Link from 'next/link'
import { Suspense } from 'react'
import { getStrainById } from '../../../../../../modules/plants/data-access'
import { EditStrainForm } from '../components/EditStrainForm'

const breadcrumbs = [
  { label: 'Dashboard', href: '/dashboard' },
  { label: 'Plants', href: '/plants' },
  { label: 'Strains', href: '/plants' },
]

interface StrainDetailPageProps {
  params: { id: number }
}

export default async function StrainEditPage({
  params: { id },
}: StrainDetailPageProps) {
  const strain = await getStrainById(id)

  if (!strain) {
    return <div>Strain not found</div>
  }

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
        <Suspense fallback={<SkeletonLoader type="page" />}>
          <div className="max-w-10xl container">
            <Card>
              <CardHeader>
                <CardTitle>Edit Strain</CardTitle>
              </CardHeader>
              <CardContent>
                <EditStrainForm strain={strain} />
              </CardContent>
            </Card>{' '}
          </div>
        </Suspense>
      </div>
    </div>
  )
}
