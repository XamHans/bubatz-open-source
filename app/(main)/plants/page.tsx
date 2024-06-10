import { auth } from '@/auth';
import { Container } from '@/components/generic/Container';
import { Hero } from '@/components/generic/Hero';
import { Metadata } from 'next';
import { SessionProvider } from 'next-auth/react';
import PlantsTable from './components/PlantsTable';

export const metadata: Metadata = {
  title: 'Manage Plants',
  description: 'Manage your plants & batches',
};

async function PlantListPage() {
  const session = await auth();
  console.log('session inside members', session);

  return (
    <SessionProvider session={session}>
      <Container className="space-y-12">
        <Hero title="PLANTS.TITLE" description="PLANTS.DESCRIPTION" />
        <PlantsTable />
      </Container>
    </SessionProvider>
  );
}

export default PlantListPage;
