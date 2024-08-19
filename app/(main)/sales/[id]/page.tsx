import Breadcrumbs from '@/components/generic/BreadCrumbs';
import { Button } from '@/components/ui/button';
import { fetchSaleDetailsUseCase } from '@/modules/sales/use-cases';
import { ChevronLeft } from 'lucide-react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import SaleGeneralInfo from './components/SaleGeneralInfo';
import SaleItemsCards from './components/SaleItemCard';

interface SaleDetailPageProps {
  params: { id: string };
}

export default async function SaleDetailPage({
  params: { id },
}: SaleDetailPageProps) {
  const breadcrumbs = [
    { label: 'Dashboard', href: '/dashboard' },
    { label: 'Sales', href: '/sales' },
    { label: 'Sale Details' },
  ];
  const { data } = await fetchSaleDetailsUseCase({ saleId: +id });
  if (data.failure) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="mb-8 flex items-center justify-center gap-4">
        <Link href="/sales">
          <Button variant="outline" size="icon" className="h-9 w-9">
            <ChevronLeft className="h-5 w-5" />
            <span className="sr-only">Back</span>
          </Button>
        </Link>
        <Breadcrumbs items={breadcrumbs} />
      </div>

      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {/* <div className="mb-8 flex items-center gap-4">
          <Button size="sm" className="ml-auto hidden md:inline-flex md:px-10">
            Edit
          </Button>
        </div> */}

        <div className="grid gap-8 lg:grid-cols-3">
          <div className="space-y-8 lg:col-span-2">
            <div className="space-y-8 lg:col-span-2">
              <SaleItemsCards items={data.success.items} />
            </div>
          </div>

          <div>
            <SaleGeneralInfo sale={data?.success} />
          </div>
        </div>
      </div>
    </div>
  );
}
