import { auth } from '@/auth';
import Breadcrumbs from '@/components/generic/BreadCrumbs';
import { Container } from '@/components/generic/Container';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Metadata } from 'next';
import { SessionProvider } from 'next-auth/react';
import NewStrainForm from './components/NewStrainForm';

export const metadata: Metadata = {
  title: 'Add New Strain',
  description: 'Add a new cannabis strain to your collection',
};

async function NewStrainPage() {
  const session = await auth();
  const breadcrumbs = [
    { label: 'Dashboard', href: '/dashboard' },
    { label: 'Plants', href: '/plants' },
    { label: 'New Strain', href: '/plants/new-strain' },
  ];

  return (
    <SessionProvider session={session}>
      <Breadcrumbs items={breadcrumbs} />

      <Container className="space-y-4">
        <Card>
          <CardHeader className="px-7">
            <CardTitle>{metadata.title?.toString()}</CardTitle>
            <CardDescription>
              {metadata.description?.toString()}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <NewStrainForm />
          </CardContent>
        </Card>
      </Container>
    </SessionProvider>
  );
}

export default NewStrainPage;
