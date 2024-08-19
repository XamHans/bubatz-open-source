import SkeletonLoader from '@/app/components/SkeletonLoader';
import Breadcrumbs from '@/components/generic/BreadCrumbs';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { getMemberDetail } from '@/modules/members/data-access';
import { ChevronLeft } from 'lucide-react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { Suspense } from 'react';
import MemberSalesTable from '../components/MemberSalesTable';
import PaymentTable from '../components/PaymentsTable';
import MemberGeneralInfo from './components/MemberGeneralInfo';

interface MemberDetailPageProps {
  params: { id: string };
}

async function MemberContent({ id }: { id: string }) {
  const member = await getMemberDetail(id);

  if (!member) {
    notFound();
  }

  return (
    <div className="grid gap-8 lg:grid-cols-3">
      <div className="space-y-8 lg:col-span-2">
        <Card>
          <CardHeader>
            <CardTitle>Sales</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="prose dark:prose-invert max-w-none">
              <MemberSalesTable memberId={id} />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Membership Payments</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="prose dark:prose-invert max-w-none">
              <PaymentTable memberId={id} />
            </div>
          </CardContent>
        </Card>
      </div>

      <div>
        <MemberGeneralInfo member={member} />
      </div>
    </div>
  );
}

export default function MemberDetailPage({
  params: { id },
}: MemberDetailPageProps) {
  const breadcrumbs = [
    { label: 'Dashboard', href: '/dashboard' },
    { label: 'Members', href: '/members' },
    { label: 'Member Details' },
  ];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="mb-8 flex items-center justify-center gap-4">
        <Link href="/members">
          <Button variant="outline" size="icon" className="h-9 w-9">
            <ChevronLeft className="h-5 w-5" />
            <span className="sr-only">Back</span>
          </Button>
        </Link>
        <Breadcrumbs items={breadcrumbs} />
      </div>

      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="mb-8 flex items-center gap-4">
          <Button size="sm" className="ml-auto hidden md:inline-flex md:px-10">
            Edit
          </Button>
        </div>

        <Suspense fallback={<SkeletonLoader type="page" />}>
          <MemberContent id={id} />
        </Suspense>
      </div>
    </div>
  );
}
