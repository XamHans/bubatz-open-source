import { Container } from '@/components/generic/Container'
import { Hero } from '@/components/generic/Hero'
import { ClubForm, ClubImageAndTerms } from './components/client.components'

async function ClubPage() {
  const user = {}
  const clubInfo = {}

  return (
    <Container>
      <Hero title="MEMBER.TITLE" description="CLUB.INVITE_MEMBER.DESCRIPTION" />
      <ClubImageAndTerms club={clubInfo!} user={user!} />
      <ClubForm user={user!} club={clubInfo!} />
    </Container>
  )
}

export default ClubPage
