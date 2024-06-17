import Breadcrumbs from '@/components/generic/BreadCrumbs';
import { Container } from '@/components/generic/Container';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { fetchBatchDetailsUseCase } from '@/modules/plants/use-cases';
import { ChevronLeft } from 'lucide-react';
import { Metadata } from 'next';
import Link from 'next/link';
import EditBatchContainer from './components/EditBatchContainer';

export const metadata: Metadata = {
  title: 'Manage Batch Details',
  description: 'Manage your plants & batches',
};

interface BatchDetailPageProps {
  params: { id: string };
}

const BatchDetailPage = async ({ params: { id } }: BatchDetailPageProps) => {
  console.log(' batch id', id);
  const breadcrumbs = [
    { label: 'Dashboard', href: '/dashboard' },
    { label: 'Plants', href: '/plants' },
    { label: `${id}` },
  ];
  const { data } = await fetchBatchDetailsUseCase({ batchId: id });

  if (!data ?? !data.success?.batch) {
    return (
      <Container className="space-y-4">
        <Breadcrumbs items={breadcrumbs} />

        <div className=" grid max-w-[62rem] flex-1 auto-rows-max gap-4">
          {/* Crew name + category */}
          <div className="flex w-full items-center gap-4">
            <Link href={`/`}>
              {' '}
              <Button variant="outline" size="icon" className="h-7 w-7">
                <ChevronLeft className="h-4 w-4" />
                <span className="sr-only">Back</span>
              </Button>
            </Link>

            <h1 className="flex-1 shrink-0 whitespace-nowrap text-xl font-semibold tracking-tight sm:grow-0">
              No batch found
            </h1>
          </div>
        </div>
      </Container>
    );
  }

  return (
    <Container className="space-y-4">
      <Breadcrumbs items={breadcrumbs} />

      <div className=" grid max-w-[62rem] flex-1 auto-rows-max gap-4">
        {/* Crew name + category */}
        <div className="flex w-full items-center gap-4">
          <Link href={`/`}>
            {' '}
            <Button variant="outline" size="icon" className="h-7 w-7">
              <ChevronLeft className="h-4 w-4" />
              <span className="sr-only">Back</span>
            </Button>
          </Link>

          <h1 className="flex-1 shrink-0 whitespace-nowrap text-xl font-semibold tracking-tight sm:grow-0">
            {data.success.batch.name}
          </h1>
          <Badge variant="outline" className="ml-auto sm:ml-0">
            {data.success.batch.strain}
          </Badge>
        </div>

        {/* Main area with two sides, each contain cards */}
        <EditBatchContainer details={data.success?.batch} />
      </div>
    </Container>
  );
};

export default BatchDetailPage;
