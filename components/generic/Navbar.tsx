import { Icons } from '@/app/(landing)/components/Icons'
import Link from 'next/link'
import { buttonVariants } from '../ui/button'
import { ThemeToggle } from './Themetoggle'

export async function Navbar() {
  // const user = await getUser();

  return (
    <nav className="flex h-[5vh] items-center border-b bg-background">
      <div className="container flex items-center justify-between">
        <Link href="/">
          <h1 className="text-md font-bold">
            Bubatz Club <span className="text-primary">Manager</span>
          </h1>
        </Link>

        <div className="flex items-center gap-x-5">
          <ThemeToggle />

          <Link
            href="#"
            className={buttonVariants({
              className: 'flex items-center',
            })}
          >
            <Icons.gitHub className="mr-2 h-4 w-4" />
            View on GitHub
          </Link>

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
  )
}
