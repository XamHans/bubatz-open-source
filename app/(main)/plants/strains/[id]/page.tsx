import Breadcrumbs from '@/components/generic/BreadCrumbs';
import { Container } from '@/components/generic/Container';
import { Button } from '@/components/ui/button';
import { fetchStrainDetailsUseCase } from '@/modules/plants/use-cases';
import { ChevronLeft } from 'lucide-react';
import { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Manage Strain Details',
  description: 'Manage your plants & batches',
};

interface StrainDetailPageProps {
  params: { id: string };
}

const StrainDetailPage = async ({ params }: StrainDetailPageProps) => {
  const id = parseInt(params.id, 10);

  const breadcrumbs = [
    { label: 'Dashboard', href: '/dashboard' },
    { label: 'Plants', href: '/plants' },
    { label: 'Strains', href: '/strains' },
    { label: `${id}` },
  ];

  const data = await fetchStrainDetailsUseCase({ id });
  const strain = data?.data?.success;

  if (!strain) {
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
              No strain found
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

          <h1 className="shrink-0 whitespace-nowrap text-xl font-semibold tracking-tight sm:grow-0">
            {strain?.name}
          </h1>
        </div>
        {/* Main area with two sides, each contain cards */}
      </div>
    </Container>
  );
};

export default StrainDetailPage;
