import { SessionProvider } from 'next-auth/react';
import SaleItemsTable from './components/SaleItemsTable';
import { Container } from '@/components/generic/Container';
import { Hero } from '@/components/generic/Hero';
import { auth } from '@/auth';
import SaleForm from './components/SaleForm';

export default async function NewSalePage() {
  const session = await auth();

  return (
    <SessionProvider session={session}>
      <Container className="space-y-12">
        {/* <HydrationBoundary state={dehydrate(queryClient)}> */}
        <Hero
          title="Create a new sale"
          description="Fill in the details to create a new sale."
        />
        <SaleForm />
        {/* </HydrationBoundary> */}
      </Container>
    </SessionProvider>
  );
}
