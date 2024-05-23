import { getMembers } from '@/modules/members/data-access';
import {
  HydrationBoundary,
  QueryClient,
  dehydrate,
} from '@tanstack/react-query';
import { Container } from '../../components/Container';
import { Hero } from '../../components/Hero';
import MemberTable from './components/MemberTable';

async function MemberListPage() {
  const queryClient = new QueryClient();

  await queryClient.prefetchQuery({
    queryKey: ['members'],
    queryFn: getMembers,
  });

  return (
    <Container className="space-y-12">
      <HydrationBoundary state={dehydrate(queryClient)}>
        <Hero
          title="MEMBER.TITLE"
          description="CLUB.INVITE_MEMBER.DESCRIPTION"
        />
        <MemberTable />
      </HydrationBoundary>
    </Container>
  );
}

export default MemberListPage;
