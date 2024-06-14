import { MobileHeader } from '@/components/generic/Mobile-Header';
import Sidebar from '@/components/generic/Sidebar';

type Props = {
  children: React.ReactNode;
};

const AppLayout = ({ children }: Props) => {
  return (
    <>
      <main className="flex min-h-screen w-full flex-col bg-muted/40">
        <MobileHeader />

        <Sidebar />

        <div className="flex flex-col items-center justify-center p-12 sm:gap-4">
          {' '}
          {children}
        </div>
      </main>
    </>
  );
};

export default AppLayout;
