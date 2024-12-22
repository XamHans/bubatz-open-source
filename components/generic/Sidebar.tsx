'use client'

import { siteConfig } from '@/config/site'
import { cn } from '@/lib/utils'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
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
  const isActive = (path: string) =>
    pathname.split('/')[1] === path.split('/')[1]

  return (
    <div className={cn(className)}>
      <aside className="fixed inset-y-0 left-0 z-10 hidden w-14 flex-col border-r bg-background sm:flex">
        <TooltipProvider>
          <nav className="flex flex-col items-center gap-4 px-2 sm:py-5">
            {siteConfig.navItems.map((item) => (
              <Tooltip key={item.name}>
                <TooltipTrigger asChild>
                  <Link
                    href={item.href}
                    className={cn(
                      'group flex h-9 w-9 shrink-0 items-center justify-center gap-2 rounded-full text-lg font-semibold text-muted-foreground hover:text-foreground md:h-8 md:w-8 md:text-base',
                      isActive(item.href) &&
                        'bg-slate-400 text-primary-foreground hover:text-primary-foreground',
                    )}
                  >
                    <item.icon className="h-4 w-4 transition-all" />
                    <span className="sr-only">{item.name}</span>
                  </Link>
                </TooltipTrigger>
                <TooltipContent side="right">
                  {item.name.toLowerCase()}
                </TooltipContent>
              </Tooltip>
            ))}
          </nav>
        </TooltipProvider>
      </aside>
    </div>
  )
}

export default Sidebar
