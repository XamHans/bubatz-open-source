import SkeletonLoader from '@/app/components/SkeletonLoader';
import Breadcrumbs from '@/components/generic/BreadCrumbs';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'; // Import Card components
import { getMemberDetail } from '@/modules/members/data-access';
import { ChevronLeft } from 'lucide-react';
import Link from 'next/link';
import { Suspense } from 'react';
import { EditMemberForm } from '../components/EditMemberForm';

interface MemberDetailPageProps {
  params: { id: string };
}

export default async function MemberEditPage({
  params: { id },
}: MemberDetailPageProps) {
  const member = await getMemberDetail(id);
  const breadcrumbs = [
    { label: 'Dashboard', href: '/dashboard' },
    { label: 'Members', href: '/members' },
    { label: id, href: '/' },
  ];

  if (!member) {
    return <div>Member not found</div>;
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
        <Suspense fallback={<SkeletonLoader type="page" />}>
          <div className="max-w-10xl container">
            <Card>
              <CardHeader>
                <CardTitle>Edit Member</CardTitle>
              </CardHeader>
              <CardContent>
                <EditMemberForm member={member} />
              </CardContent>
            </Card>{' '}
          </div>
        </Suspense>
      </div>
    </div>
  );
}
