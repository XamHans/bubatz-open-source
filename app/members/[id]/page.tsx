
import { Container } from "@/app/components/Container"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { MemberGeneralInfo } from "./components/MemberGeneralInfo"



const MemberDetailPage = async () => {


  return (
    <Container >
      <div className="h-full w-full flex-1 flex-col space-y-12 md:flex ">
        <section>
        <MemberGeneralInfo  />
        </section>
        <section>
           <Tabs defaultValue="account" className="w-[400px]">
      <TabsList>
        <TabsTrigger value="account">Account</TabsTrigger>
        <TabsTrigger value="password">Password</TabsTrigger>
      </TabsList>
      <TabsContent value="account"> </TabsContent>
      <TabsContent value="password">Change your password here.</TabsContent>
    </Tabs>
        </section>
      </div>
     
    </Container>
  )
}

export default MemberDetailPage