import SkeletonLoader from '@/app/components/SkeletonLoader'
import Breadcrumbs from '@/components/generic/BreadCrumbs'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { getMemberPaymentDetails } from '@/modules/members/data-access'
import { ChevronLeft } from 'lucide-react'
import Link from 'next/link'
import { Suspense } from 'react'
import DeleteMemberPayment from '../../../components/DeleteMemberPayment'
import { EditMemberPaymentForm } from '../../../components/EditMemberPaymentForm'

const breadcrumbs = [
  { label: 'Dashboard', href: '/dashboard' },
  { label: 'Members', href: '/members' },
  { label: 'Payments', href: '/members/payments' },
]

interface MemberPaymentEditPageProps {
  params: { paymentId: string }
}

export default async function MemberPaymentEditPage({
  params: { paymentId },
}: MemberPaymentEditPageProps) {
  const payment = await getMemberPaymentDetails(paymentId)
  console.log(payment)

  return (
    <div className="min-h-screen ">
      <div className="mb-8 flex items-center justify-center gap-4">
        <Link href="/members">
          <Button variant="outline" size="icon" className="h-9 w-9">
            <ChevronLeft className="h-5 w-5" />
            <span className="sr-only">Back</span>
          </Button>
        </Link>
        <Breadcrumbs items={breadcrumbs} />
      </div>

      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="mb-8 flex items-center gap-4">
          <div className="ml-auto">
            {' '}
            <DeleteMemberPayment id={payment.id} />
          </div>
        </div>

        <Suspense fallback={<SkeletonLoader type="page" />}>
          <Card>
            <CardHeader>
              <CardTitle>Edit Member Payment</CardTitle>
            </CardHeader>
            <CardContent>
              <EditMemberPaymentForm payment={payment} />
            </CardContent>
          </Card>
        </Suspense>
      </div>
    </div>
  )
}
