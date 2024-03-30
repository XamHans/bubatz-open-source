import { Navbar } from "../components/Navbar";

type Props = {
  children: React.ReactNode;
};

const AuthLayout = ({ children }: Props) => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1 flex flex-col items-center justify-center">
        {children}
      </main>
      {/* <Footer /> */}
    </div>
  );
};

export default AuthLayout;
