import { auth } from '@/auth';
import Breadcrumbs from '@/components/generic/BreadCrumbs';
import { Container } from '@/components/generic/Container';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { SessionProvider } from 'next-auth/react';
import MemberTable from './components/MemberTable';

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
      <Container className="space-y-12">
        <Breadcrumbs items={breadcrumbs} />
        <Card>
          <CardHeader className="px-7">
            <div className="grid grid-cols-2">
              <div>
                <CardTitle>
                  Members
                </CardTitle>
                <CardDescription>
                  Manage your members
                </CardDescription>
              </div>
              <div className="flex justify-end">
                <Link href={configuration.paths.members.addMember}>
                  <Button size="sm" className="h-8 w-32 gap-1">
                    <PlusCircle className="h-3.5 w-3.5" />
                    <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
                      Add Member
                    </span>
                  </Button>
                </Link>
              </div>
            </div>
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
