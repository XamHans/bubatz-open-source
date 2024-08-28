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
import { Metadata } from 'next'
import Link from 'next/link'
import SalesTable from './components/SalesTable'

export default function SalesPage() {
  const metadata: Metadata = {
    title: 'Manage Sales',
    description: 'Add a new sale or see the details of an existing one.',
  }

  const breadcrumbs = [
    { label: 'Dashboard', href: '/dashboard' },
    { label: 'Sales' },
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
                <CardTitle>
                  {metadata.title
                    ? metadata.title.toString()
                    : 'Error getting title'}
                </CardTitle>
                <CardDescription>
                  {metadata.description
                    ? metadata.description.toString()
                    : 'Error getting description'}
                </CardDescription>
              </div>
              <div className="flex justify-end">
                <Link href={siteConfig.links.sales.new}>
                  <Button size="sm" className="h-8 w-32 gap-1">
                    <PlusCircle className="h-3.5 w-3.5" />
                    <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
                      Add Sale
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
