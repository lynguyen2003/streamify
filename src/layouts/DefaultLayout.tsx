import Topbar from "@/components/shared/Topbar";
import Bottombar from "@/components/shared/Bottombar";
import LeftSidebar from "@/components/shared/LeftSidebar";
import { Toaster } from "sonner";

const DefaultLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="w-full md:flex">
      <Topbar />
      <LeftSidebar />

      <section className="flex flex-1 h-full">
        {children}
      </section>
      <Toaster />

      <Bottombar />
    </div>
  );
};

export default DefaultLayout;
