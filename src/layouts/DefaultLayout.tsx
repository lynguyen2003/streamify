import Topbar from "@/components/shared/Topbar";
import Bottombar from "@/components/shared/Bottombar";
import LeftSidebar from "@/components/shared/LeftSidebar";
import { Toaster } from "sonner";

const DefaultLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="h-screen w-full md:flex">
      <Topbar />
      <div className="sticky top-0 left-0 z-10">
        <LeftSidebar />
      </div>

      <section className="flex flex-1 h-full">
        {children}
      </section>
      <Toaster />

      <Bottombar />
    </div>
  );
};

export default DefaultLayout;
