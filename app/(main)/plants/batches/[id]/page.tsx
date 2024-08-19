import SkeletonLoader from '@/app/components/SkeletonLoader';
import Breadcrumbs from '@/components/generic/BreadCrumbs';
import { Container } from '@/components/generic/Container';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { siteConfig } from '@/config/site';
import { fetchBatchDetailsUseCase } from '@/modules/plants/use-cases';
import { ChevronLeft } from 'lucide-react';
import { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { Suspense } from 'react';
import EditBatchContainer from './components/EditBatchContainer';

export const metadata: Metadata = {
  title: 'Manage Batch Details',
  description: 'Manage your plants & batches',
};

interface BatchDetailPageProps {
  params: { id: string };
}

async function BatchContent({ id }: { id: string }) {
  const { data } = await fetchBatchDetailsUseCase({ id });
  const batch = data?.success?.batch;
  const strain = data?.success?.strain;

  if (!batch) {
    notFound();
  }

  return (
    <div className="grid max-w-[62rem] flex-1 auto-rows-max gap-4">
      <div className="flex w-full items-center gap-4">
        <h1 className="shrink-0 whitespace-nowrap text-xl font-semibold tracking-tight sm:grow-0">
          {batch.name}
        </h1>
        <Badge variant="outline" className="ml-auto sm:ml-0">
          {strain?.name}
        </Badge>
      </div>
      <EditBatchContainer batch={batch} />
    </div>
  );
}

export default function BatchDetailPage({
  params: { id },
}: BatchDetailPageProps) {
  const breadcrumbs = [
    { label: 'Dashboard', href: '/dashboard' },
    { label: 'Plants', href: '/plants' },
    { label: `${id}` },
  ];

  return (
    <Container className="space-y-4">
      <div className="mb-8 flex items-center justify-center gap-4">
        <Link href={siteConfig.links.plants.index}>
          <Button variant="outline" size="icon" className="h-9 w-9">
            <ChevronLeft className="h-5 w-5" />
            <span className="sr-only">Back</span>
          </Button>
        </Link>
        <Breadcrumbs items={breadcrumbs} />
      </div>

      <Suspense fallback={<SkeletonLoader type="page" />}>
        <BatchContent id={id} />
      </Suspense>
    </Container>
  );
}
