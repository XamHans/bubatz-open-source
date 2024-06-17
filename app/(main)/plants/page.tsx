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
      <Container className="space-y-4">
        <div className="flex justify-between">
          <Breadcrumbs items={breadcrumbs} />

          <Link href={configuration.paths.plants.new}>
            <Button size="sm" className="h-8 gap-1">
              <PlusCircle className="h-3.5 w-3.5" />
              <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
                Add Plants
              </span>
            </Button>
          </Link>
        </div>
        <Card>
          <CardHeader className="px-7">
            <CardTitle>Plants</CardTitle>
            <CardDescription>Manage your plants</CardDescription>
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
