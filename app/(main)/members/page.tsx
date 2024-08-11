import { auth } from '@/auth';
import Breadcrumbs from '@/components/generic/BreadCrumbs';
import { Container } from '@/components/generic/Container';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { siteConfig } from '@/config/site';
import { SessionProvider } from 'next-auth/react';
import { redirect } from 'next/navigation';
import MemberTable from './components/MemberTable';

async function MemberListPage() {
  const breadcrumbs = [
    { label: 'Dashboard', href: '/dashboard' },
    { label: 'Members' },
  ];

  const session = await auth();
  if (!session) redirect(siteConfig.links.signIn);
  // const queryClient = new QueryClient()
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
