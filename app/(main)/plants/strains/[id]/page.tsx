import Breadcrumbs from '@/components/generic/BreadCrumbs';
import { Container } from '@/components/generic/Container';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { siteConfig } from '@/config/site';
import { fetchStrainDetailsUseCase } from '@/modules/plants/use-cases';
import { ChevronLeft } from 'lucide-react';
import { Metadata } from 'next';
import Link from 'next/link';
import { EditStrainForm } from './components/EditStrainForm';

export const metadata: Metadata = {
  title: 'Manage Strain Details',
  description: 'Manage your plants & batches',
};

interface StrainDetailPageProps {
  params: { id: string };
}

const StrainDetailPage = async ({ params }: StrainDetailPageProps) => {
  const id = parseInt(params.id, 10);

  const data = await fetchStrainDetailsUseCase({ id });
  const strain = data?.data?.success;

  const breadcrumbs = [
    { label: 'Dashboard', href: '/dashboard' },
    { label: 'Plants', href: '/plants' },
    { label: 'Strains', href: '/plants' },
    { label: `${strain?.name}` },
  ];

  if (!strain) {
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
      <div className="mb-8 flex items-center justify-center gap-4">
        <Link href={siteConfig.links.plants.index}>
          <Button variant="outline" size="icon" className="h-9 w-9">
            <ChevronLeft className="h-5 w-5" />
            <span className="sr-only">Back</span>
          </Button>
        </Link>
        <Breadcrumbs items={breadcrumbs} />
      </div>

      <div className=" grid max-w-[62rem] flex-1 auto-rows-max gap-4">
        <Card>
          <CardHeader>
            <CardTitle> {strain?.name}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <EditStrainForm strain={strain} />
          </CardContent>
        </Card>
      </div>
    </Container>
  );
};

export default StrainDetailPage;
