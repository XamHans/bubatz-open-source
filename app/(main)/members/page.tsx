import { auth } from '@/auth';
import { SessionProvider } from 'next-auth/react';
import MemberTable from './components/MemberTable';
import { Container } from '@/components/generic/Container';
import { Hero } from '@/components/generic/Hero';

async function MemberListPage() {
  // const queryClient = new QueryClient()
  const session = await auth();
  console.log('session inside members', session);

  // * Replaced for next action in MemberTable component
  // await queryClient.prefetchQuery({
  //     queryKey: ['members'],
  //     queryFn: getMembers,
  // })

  return (
    <SessionProvider session={session}>
      <Container className="space-y-12">
        {/* <HydrationBoundary state={dehydrate(queryClient)}> */}
        <Hero
          title="MEMBER.TITLE"
          description="CLUB.INVITE_MEMBER.DESCRIPTION"
        />
        <MemberTable />
        {/* </HydrationBoundary> */}
      </Container>
    </SessionProvider>
  );
}

export default MemberListPage;
