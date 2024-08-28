import Breadcrumbs from '@/components/generic/BreadCrumbs'
import CreateMemberPaymentForm from '../../components/CreateMemberPaymentForm'

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
import Link from 'next/link'

const metadata: Metadata = {
  title: 'Create New Member Payment',
  description: 'Fill in the details to create a new member payment. ',
}

export default async function NewPaymentPage({
  params,
}: {
  params: { id: string }
}) {
  const breadcrumbs = [
    { label: 'Dashboard', href: '/dashboard' },
    { label: 'Members', href: '/members' },
    { label: 'Create New Member Payment' },
  ]

  return (
    <>
      <div className="mb-8 flex items-center justify-center gap-4">
        <Link href="/members">
          <Button variant="outline" size="icon" className="h-9 w-9">
            <ChevronLeft className="h-5 w-5" />
            <span className="sr-only">Back</span>
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
          <CardContent>
            <CreateMemberPaymentForm memberId={params.id} />
          </CardContent>
        </Card>
      </Container>
    </>
  )
}
