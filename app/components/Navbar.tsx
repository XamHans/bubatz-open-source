import Link from "next/link";
import { ThemeToggle } from "./Themetoggle";


export async function Navbar() {
  // const user = await getUser();

  return (
    <nav className="border-b bg-background h-[10vh] flex items-center">
      <div className="container flex items-center justify-between">
        <Link href="/">
          <h1 className="font-bold text-3xl">
            Bubatz Club <span className="text-primary">Manager</span>
          </h1>
        </Link>

        <div className="flex items-center gap-x-5">
          <ThemeToggle />

          {/* {(await isAuthenticated()) ? (
            <UserNav
              email={user?.email as string}
              image={user?.picture as string}
              name={user?.given_name as string}
            />
          ) : (
            <div className="flex items-center gap-x-5">
              <LoginLink>
                <Button>Sign In</Button>
              </LoginLink>

              <RegisterLink>
                <Button variant="secondary">Sign Up</Button>
              </RegisterLink>
            </div>
          )} */}
        </div>
      </div>
    </nav>
  );
}
