'use client'

import { cn } from '@/lib/utils'
import { Leaf, Package2, Users2 } from 'lucide-react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { SignOutButton } from '../auth/signout-button'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '../ui/tooltip'

type Props = {
  className?: string
}

const Sidebar = ({ className }: Props) => {
  const pathname = usePathname()
  const isActive = (path: string) => pathname.split('/')[1] === path // /sales -> sales, /sales/new-sales -> sales

  return (
    <div className={cn(className)}>
      <aside className="fixed inset-y-0 left-0 z-10 hidden w-14 flex-col border-r bg-background sm:flex">
        <TooltipProvider>
          <nav className="flex flex-col items-center gap-4 px-2 sm:py-5">
            <Tooltip>
              <TooltipTrigger asChild>
                <Link
                  href="/sales"
                  className={cn(
                    'group flex h-9 w-9 shrink-0 items-center justify-center gap-2 rounded-full text-lg font-semibold text-muted-foreground hover:text-foreground md:h-8 md:w-8 md:text-base',
                    isActive('sales') &&
                      'bg-black text-primary-foreground hover:text-primary-foreground',
                  )}
                >
                  <Package2 className="h-4 w-4 transition-all" />
                  <span className="sr-only">Sales</span>
                </Link>
              </TooltipTrigger>
              <TooltipContent side="right">Manage your sales</TooltipContent>
            </Tooltip>
            <Tooltip>
              <TooltipTrigger asChild>
                <Link
                  href="/plants"
                  className={cn(
                    'flex h-9 w-9 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:text-foreground md:h-8 md:w-8',
                    isActive('plants') &&
                      'bg-black text-primary-foreground hover:text-primary-foreground',
                  )}
                >
                  <Leaf className="h-5 w-5 transition-all" />
                  <span className="sr-only">Plants</span>
                </Link>
              </TooltipTrigger>
              <TooltipContent side="right">Manage your growing</TooltipContent>
            </Tooltip>
            <Tooltip>
              <TooltipTrigger asChild>
                <Link
                  href="/members"
                  className={cn(
                    'flex h-9 w-9 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:text-foreground md:h-8 md:w-8',
                    isActive('members') &&
                      'bg-black text-primary-foreground hover:text-primary-foreground',
                  )}
                >
                  <Users2 className="h-5 w-5" />
                  <span className="sr-only">Members</span>
                </Link>
              </TooltipTrigger>
              <TooltipContent side="right">Manage your members</TooltipContent>
            </Tooltip>
          </nav>
          <nav className="mt-12">
            <SignOutButton />
          </nav>
          {/* <nav className="mt-auto flex flex-col items-center gap-4 px-2 sm:py-5">
            <Tooltip>
              <TooltipTrigger asChild>
                <Link
                  href="#"
                  className={cn(
                    'flex h-9 w-9 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:text-foreground md:h-8 md:w-8',
                    isActive('#') && 'bg-black',
                  )}
                >
                  <Settings className="h-5 w-5" />
                  <span className="sr-only">Settings</span>
                </Link>
              </TooltipTrigger>
              <TooltipContent side="right">Settings</TooltipContent>
            </Tooltip>
          </nav> */}
        </TooltipProvider>
      </aside>
    </div>
  )
}

export default Sidebar
