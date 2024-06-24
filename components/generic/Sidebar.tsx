import Link from 'next/link';

import { cn } from '@/lib/utils';
import { Leaf, Package2, Settings, Users2 } from 'lucide-react';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '../ui/tooltip';

type Props = {
  className?: string;
};

const Sidebar = ({ className }: Props) => {
  return (
    <div className={cn(className)}>
      <aside className="fixed inset-y-0 left-0 z-10 hidden w-14 flex-col border-r bg-background sm:flex">
        <TooltipProvider>
          <nav className="flex flex-col items-center gap-4 px-2 sm:py-5">
            <Tooltip>
              <TooltipTrigger asChild>
                <Link
                  href="/sales"
                  className="group flex h-9 w-9 shrink-0 items-center justify-center gap-2 rounded-full text-lg font-semibold text-muted-foreground hover:text-foreground md:h-8 md:w-8 md:text-base"
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
                  className="flex h-9 w-9 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:text-foreground md:h-8 md:w-8"
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
                  className="flex h-9 w-9 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:text-foreground md:h-8 md:w-8"
                >
                  <Users2 className="h-5 w-5" />
                  <span className="sr-only">Members</span>
                </Link>
              </TooltipTrigger>
              <TooltipContent side="right">Manage your members</TooltipContent>
            </Tooltip>
          </nav>
          <nav className="mt-auto flex flex-col items-center gap-4 px-2 sm:py-5">
            <Tooltip>
              <TooltipTrigger asChild>
                <Link
                  href="#"
                  className="flex h-9 w-9 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:text-foreground md:h-8 md:w-8"
                >
                  <Settings className="h-5 w-5" />
                  <span className="sr-only">Settings</span>
                </Link>
              </TooltipTrigger>
              <TooltipContent side="right">Settings</TooltipContent>
            </Tooltip>
          </nav>
        </TooltipProvider>
      </aside>
    </div>
  );
};

export default Sidebar;
