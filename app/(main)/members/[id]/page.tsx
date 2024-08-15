import Breadcrumbs from '@/components/generic/BreadCrumbs';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { getMemberDetail } from '@/modules/members/data-access';
import { ChevronLeft } from 'lucide-react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import MemberGeneralInfo from './components/MemberGeneralInfo';

interface MemberDetailPageProps {
  params: { id: string };
}

export default async function MemberDetailPage({
  params: { id },
}: MemberDetailPageProps) {
  const breadcrumbs = [
    { label: 'Dashboard', href: '/dashboard' },
    { label: 'Members', href: '/members' },
    { label: 'Edit Member' },
  ];
  const member = await getMemberDetail(id);

  if (!member) {
    notFound();
  }
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
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            {member?.fullName}
          </h1>

          <Button size="sm" className="ml-auto hidden md:inline-flex md:px-10">
            Edit
          </Button>
        </div>

        <div className="grid gap-8 lg:grid-cols-3">
          <div className="space-y-8 lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle>Crew Details</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="prose dark:prose-invert max-w-none">
                  {/* Add Markdown component or content here */}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Install</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="prose dark:prose-invert max-w-none">
                  {/* Add Markdown component or content here */}
                </div>
              </CardContent>
            </Card>
          </div>

          <div>
            <MemberGeneralInfo member={member} />
          </div>
        </div>
      </div>
    </div>
  );
}
