import Link from 'next/link';

import { cn } from '@/lib/utils';
import { SidebarItem } from './Sidbar-Item';

type Props = {
  className?: string;
};

export const Sidebar = ({ className }: Props) => {
  return (
    <div
      className={cn(
        'left-0 top-0 flex h-full flex-col border-r-2 px-4 lg:fixed lg:w-[256px]',
        className,
      )}
    >
      <Link href="/">
        <div className="flex items-center gap-x-3 pb-7 pl-4 pt-8">
          {/* <Image src="/mascot.svg" height={40} width={40} alt="Mascot" /> */}
          <h1 className="text-2xl font-extrabold tracking-wide text-black">
            Bubatz Club Manager
          </h1>
        </div>
      </Link>
      <div className="flex flex-1 flex-col gap-y-2">
        <SidebarItem label="members" href="/members" iconSrc="/users.svg" />
        <SidebarItem label="output" href="/output" iconSrc="/shop.svg" />
        <SidebarItem label="plants" href="/plants" iconSrc="/plant.svg" />
      </div>
      {/* <div className="p-4">
        <ClerkLoading>
          <Loader className="h-5 w-5 text-muted-foreground animate-spin" />
        </ClerkLoading>
        <ClerkLoaded>
          <UserButton afterSignOutUrl="/" />
        </ClerkLoaded>
      </div> */}
    </div>
  );
};
