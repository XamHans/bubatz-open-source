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
import { ChevronLeft } from 'lucide-react'
import { Metadata } from 'next'
import Link from 'next/link'
import NewStrainForm from './components/NewStrainForm'

export const metadata: Metadata = {
  title: 'Add New Strain',
  description: 'Add a new cannabis strain to your collection',
}

async function NewStrainPage() {
  const breadcrumbs = [
    { label: 'Dashboard', href: '/dashboard' },
    { label: 'Plants', href: '/plants' },
    { label: 'New Strain', href: siteConfig.links.plants.strains.new },
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
          <CardContent className="bg-transparent">
            <NewStrainForm />
          </CardContent>
        </Card>
      </Container>
    </>
  )
}

export default NewStrainPage
