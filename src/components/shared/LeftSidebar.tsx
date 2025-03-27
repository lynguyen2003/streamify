import { Link, NavLink, useLocation, useNavigate } from "react-router-dom";
import { useState, useRef, useEffect } from "react";

import { INavLink } from "@/types";
import { sidebarLinks, createMenuLinks } from "@/constants";
import { Button } from "@/components/ui/button";
import { logoutUser } from "@/features/auth/authSlice";
import { toast } from "sonner"
import { useAppDispatch } from "@/hooks/useAppDispatch";
import { useSelector } from "react-redux";
import { RootState } from "@/store";
import CreatePostDialog from "@/components/dialog/CreatePostDialog";

const LeftSidebar = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { pathname } = useLocation();
  const { user } = useSelector((state: RootState) => state.auth);
  const [isCreateMenuOpen, setIsCreateMenuOpen] = useState(false);
  const [isPostDialogOpen, setIsPostDialogOpen] = useState(false);
  const createMenuRef = useRef<HTMLDivElement>(null);
  const createButtonRef = useRef<HTMLDivElement>(null);
  
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

  const handleCreateClick = () => {
    setIsCreateMenuOpen(prev => !prev);
  };

  const handleOptionClick = (option: string) => {
    setIsCreateMenuOpen(false);
    
    if (option === "Post") {
      setIsPostDialogOpen(true);
    } else if (option === "Streaming") {
      // Handle streaming option
      navigate("/create-streaming");
    } else if (option === "Reel") {
      // Handle reel option
      navigate("/create-reel");
    } else if (option === "AI") {
      // Handle AI option
      navigate("/create-ai");
    }
  };

  // Handle keyboard navigation
  const handleKeyDown = (e: React.KeyboardEvent, option?: string) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      if (option) {
        handleOptionClick(option);
      } else {
        handleCreateClick();
      }
    } else if (e.key === 'Escape') {
      setIsCreateMenuOpen(false);
    }
  };

  // Handle clicks outside of the create menu
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        createMenuRef.current && 
        !createMenuRef.current.contains(event.target as Node) &&
        createButtonRef.current &&
        !createButtonRef.current.contains(event.target as Node)
      ) {
        setIsCreateMenuOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

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
            const isCreate = link.label === "Create";
            return (
              <div
                key={link.label}
                className={`flex leftsidebar-link group transition-all duration-200 hover:bg-primary-500/20
                  ${ isActive && "bg-primary-500"}  ${isCreate && "relative"}`}
              >
                {isCreate ? (
                  <>
                    <div 
                      ref={createButtonRef}
                      className={`flex gap-4 items-center p-4 cursor-pointer w-full ${isCreateMenuOpen && "bg-primary-500 rounded-md"}`}
                      onClick={handleCreateClick}
                      onKeyDown={handleKeyDown}
                      tabIndex={0}
                      role="button"
                      aria-haspopup="true"
                      aria-expanded={isCreateMenuOpen}
                    >
                      <img
                        src={link.imgURL}
                        alt={link.label}
                        className={`group-hover:invert-white group-hover:scale-110 transition-transform duration-200 ${isCreateMenuOpen && "invert-white"}`}
                      />
                      {link.label}
                    </div>

                    {isCreateMenuOpen && (
                      <div 
                        ref={createMenuRef}
                        className="absolute w-full top-full mt-2 bg-dark-4 rounded-lg shadow-lg min-w-[180px] 
                          animate-in fade-in slide-in-from-top-5 duration-200 z-10"
                        role="menu"
                      >
                        {createMenuLinks.map((menuLink: any) => (
                          <div 
                            key={menuLink.label}
                            className="flex justify-between gap-4 items-center p-4 cursor-pointer
                              transition-all duration-200 hover:scale-110 rounded-md group"
                            onClick={() => handleOptionClick(menuLink.label)}
                            onKeyDown={(e) => handleKeyDown(e, menuLink.label)}
                            tabIndex={0}
                            role="menuitem"
                          >
                            <span className="transition-colors">
                              {menuLink.label}
                            </span>
                            <img
                              src={menuLink.imgURL}
                              alt={menuLink.label}
                              className="transition-all duration-200"
                            />
                          </div>
                        ))}
                      </div>
                    )}
                  </>
                ) : (
                  <NavLink
                    to={link.route}
                    className="flex gap-4 items-center p-4 w-full transition-all duration-200"
                  >
                    <img
                      src={link.imgURL}
                      alt={link.label}
                      width={24}
                      height={24}
                      className={`group-hover:invert-white transition-transform duration-200 
                        group-hover:scale-110 ${isActive && "invert-white"}`}
                    />
                    {link.label}
                  </NavLink>
                )}
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
          <img src="/assets/icons/setting.png" alt="setting" />
          <p className="base-medium lg:base-medium">Setting</p>
        </Button>
      </div>
      
      {/* Create Post Dialog */}
      <CreatePostDialog 
        isOpen={isPostDialogOpen}
        onOpenChange={setIsPostDialogOpen}
      />
    </nav>
  );
};

export default LeftSidebar;
