import configuration from '@/app/configuration';
import { auth } from '@/auth';
import Breadcrumbs from '@/components/generic/BreadCrumbs';
import { Container } from '@/components/generic/Container';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { PlusCircle } from 'lucide-react';
import { Metadata } from 'next';
import { SessionProvider } from 'next-auth/react';
import Link from 'next/link';
import BatchesTable from './components/BatchesTable';

export const metadata: Metadata = {
  title: 'Manage Plants',
  description: 'Manage your plants & batches',
};

async function PlantListPage() {
  const session = await auth();
  console.log('session inside members', session);
  const breadcrumbs = [
    { label: 'Dashboard', href: '/dashboard' },
    { label: 'Plants', href: '/plants' },
    { label: 'All', href: '/' },
  ];
  return (
    <SessionProvider session={session}>
      <Breadcrumbs items={breadcrumbs} />

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
                <Link href={configuration.paths.plants.new}>
                  <Button size="sm" className="h-8 w-32 gap-1">
                    <PlusCircle className="h-3.5 w-3.5" />
                    <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
                      Add Batch
                    </span>
                  </Button>
                </Link>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <BatchesTable />
          </CardContent>
        </Card>
      </Container>
    </SessionProvider>
  );
}

export default PlantListPage;
