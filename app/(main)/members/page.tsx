import { auth } from '@/auth';
import { Container } from '@/components/generic/Container';
import { Hero } from '@/components/generic/Hero';
import { SessionProvider } from 'next-auth/react';
import MemberTable from './components/MemberTable';
import Breadcrumbs from '@/components/generic/BreadCrumbs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { AddMemberModal } from './components/AddMemberModal';

async function MemberListPage() {
  const breadcrumbs = [
    { label: 'Dashboard', href: '/dashboard' },
    { label: 'Members' },
  ];

  // const queryClient = new QueryClient()
  const session = await auth();
  console.log('session inside members', session);

  return (
    <SessionProvider session={session}>
      <Breadcrumbs items={breadcrumbs} />
      <Container className="space-y-12">
        <Card>
          <CardHeader className="px-7">
            <CardTitle>Members</CardTitle>
            <CardDescription>Manage your members</CardDescription>
          </CardHeader>
          <CardContent>
            <MemberTable />
          </CardContent>
        </Card>
      </Container>
    </SessionProvider>
  );
}

export default MemberListPage;
