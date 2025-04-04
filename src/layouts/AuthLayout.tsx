import { Navigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { RootState } from "@/store";
import { Toaster } from "sonner";

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  const { token } = useSelector((state: RootState) => state.auth);

  return (
    <>
      {token ? (
        <Navigate to="/" />
      ) : (
        <div className="flex flex-1 h-full">
          <img  
              src="/assets/images/side-img.svg"
              alt="logo"
              className="hidden xl:block h-screen w-1/2 object-cover bg-no-repeat"
            />
            
          <section className="flex flex-1 justify-center items-center flex-col py-10">
            {children}
          </section>
          <Toaster richColors />            
        </div>
      )}
    </>
  );
}
