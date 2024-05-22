import Link from "next/link";

import { cn } from "@/lib/utils";
import { SidebarItem } from "./Sidbar-Item";

type Props = {
  className?: string;
};

export const Sidebar = ({ className }: Props) => {
  return (
    <div
      className={cn(
        "flex h-full lg:w-[256px] lg:fixed left-0 top-0 px-4 border-r-2 flex-col",
        className
      )}
    >
      <Link href="/">
        <div className="pt-8 pl-4 pb-7 flex items-center gap-x-3">
          {/* <Image src="/mascot.svg" height={40} width={40} alt="Mascot" /> */}
          <h1 className="text-2xl font-extrabold text-black tracking-wide">
            Bubatz Club Manager
          </h1>
        </div>
      </Link>
      <div className="flex flex-col gap-y-2 flex-1">
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