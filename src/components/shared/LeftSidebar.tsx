import { Link, NavLink, useLocation, useNavigate } from "react-router-dom";

import { INavLink } from "@/types";
import { sidebarLinks } from "@/constants";
import { Button } from "@/components/ui/button";
import { logoutUser } from "@/features/auth/authSlice";
import { toast } from "sonner"
import { useAppDispatch } from "@/hooks/useAppDispatch";
import { useSelector } from "react-redux";
import { RootState } from "@/store";

const LeftSidebar = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { pathname } = useLocation();
  const { user } = useSelector((state: RootState) => state.auth);
  
  const handleSignOut = async (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) => {
    e.preventDefault();
    try {
      await dispatch(logoutUser());
      navigate("/sign-in");
      toast("See you next time!");
    } catch (error) {
      toast.error("Logout failed");
    }
  };

  return (
    <nav className="leftsidebar">
      <div className="flex flex-col gap-11">
        <Link to="/" className="flex gap-3 items-center">
          <img
            src="/assets/images/logo.svg"
            alt="logo"
            width={170}
            height={36}
          />
        </Link>

        <Link to={`/profile/${user?._id}`} className="flex gap-3 items-center">
            <img
              src={user?.imageUrl || "/assets/icons/profile-placeholder.svg"}
              alt="profile"
              className="h-14 w-14 rounded-full"
            />
            <div className="flex flex-col">
              <p className="body-bold">{user?.username}</p>
              <p className="base-regular text-light-3">{user?.email}</p>
            </div>
          </Link>

        <div className="flex flex-col gap-1">
          {sidebarLinks.map((link: INavLink) => {
            const isActive = pathname === link.route;

            return (
              <div
                key={link.label}
                className={` flex leftsidebar-link group ${
                  isActive && "bg-primary-500"
                }`}
              >
                <NavLink
                  to={link.route}
                  className="flex gap-4 items-center p-4"
                >
                  <img
                    src={link.imgURL}
                    alt={link.label}
                    className={`group-hover:invert-white ${
                      isActive && "invert-white"
                    }`}
                  />
                  {link.label}
                </NavLink>
              </div>
            );
          })}
        </div>
      </div>

      <div className="flex flex-col gap-3">
        <Button
          variant="ghost"
          className="shad-button_ghost"
          onClick={(e) => handleSignOut(e)}
        >
          <img src="/assets/icons/logout.svg" alt="logout" />
          <p className="base-medium lg:base-medium">Logout</p>
        </Button>
        <Button variant="ghost" className="shad-button_ghost">
          <img src="/assets/images/setting.png" alt="setting" />
          <p className="base-medium lg:base-medium">Setting</p>
        </Button>
      </div>
    </nav>
  );
};

export default LeftSidebar;
