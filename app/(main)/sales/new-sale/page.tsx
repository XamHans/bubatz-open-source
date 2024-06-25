import { SessionProvider } from 'next-auth/react';
import SaleItemsTable from './components/SaleItemsTable';
import { Container } from '@/components/generic/Container';
import { Hero } from '@/components/generic/Hero';
import { auth } from '@/auth';
import SaleForm from './components/SaleForm';
import Breadcrumbs from '@/components/generic/BreadCrumbs';
import { Metadata } from 'next';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';

export default async function NewSalePage() {
  const session = await auth();

  const metadata: Metadata = {
    title: 'Create New Sale',
    description:
      'Fill in the details to create a new sale. Start by adding items to the sale.',
  };

  const breadcrumbs = [
    { label: 'Dashboard', href: '/dashboard' },
    { label: 'Sales', href: '/sales' },
    { label: 'Create New Sale' },
  ];

  return (
    <SessionProvider session={session}>
      <Breadcrumbs items={breadcrumbs} />
      <Container className="space-y-4">
        <Card>
          <CardHeader className="px-7">
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
          </CardHeader>
          <CardContent>
            <SaleForm />
          </CardContent>
        </Card>
      </Container>
      {/* <Container className="space-y-12">
        <Hero
          title="Create a new sale"
          description="Fill in the details to create a new sale."
        />
        <SaleForm />
      </Container> */}
    </SessionProvider>
  );
}
