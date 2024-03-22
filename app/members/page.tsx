
import { getMembers } from "@/business-logic/members/actions";
import { Container } from "../components/Container";
import { Hero } from "../components/Hero";
import MemberTable from "./components/MemberTable";


async function MemberListPage() {
  
  const members = await getMembers();


  return (
    <Container >
      <Hero title="MEMBER.TITLE" description="CLUB.INVITE_MEMBER.DESCRIPTION" />
      <MemberTable data={members} />
    </Container>
  )
}

export default MemberListPage;