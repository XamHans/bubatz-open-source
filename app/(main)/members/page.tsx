import { auth } from '@/auth';
import { Container } from '@/components/generic/Container';
import { Hero } from '@/components/generic/Hero';
import { psGetAllClients } from '@/lib/db/prepared/statements';
import { ClientProps } from '@/modules/members/types';
import { SessionProvider } from 'next-auth/react';
import MemberTable from './components/MemberTable';

async function MemberListPage() {
  const session = await auth();
  console.log('session inside members', session);

  const clients: ClientProps[] = await psGetAllClients.execute();

  return (
    <SessionProvider session={session}>
      <Container className="space-y-12">
        <Hero
          title="MEMBER.TITLE"
          description="CLUB.INVITE_MEMBER.DESCRIPTION"
        />
        <MemberTable clients={clients} />
      </Container>
    </SessionProvider>
  );
}

export default MemberListPage;
