import { Link, Outlet, useLocation } from "react-router-dom";
import { savedPostLinks } from "@/constants";

const Saved = () => {
  const { pathname } = useLocation();

  return (
    <div className="saved-container">
      <div className="flex gap-2 w-full max-w-5xl">
        <img
          src="/assets/icons/save.svg"
          width={36}
          height={36}
          alt="edit"
          className="invert-white"
        />
        <h2 className="h3-bold md:h2-bold text-left w-full">Saved Posts</h2>
      </div>

      <div className="flex w-full justify-between">
        <div className="flex-center bg-dark-3 p-[1px] rounded-xl">
          {savedPostLinks.map((link) => {
            const isActive = pathname === link.route;
            return (
              <div key={`saved-${link.label}`}>
                <Link
                  to={link.route}
                  className={`${
                    isActive ? "bg-dark-3" : "bg-dark-2"
                  } flex-center gap-3 px-5 py-3 cursor-pointer ${
                    link.label === "Posts" ? "rounded-l-xl" : ""
                  } ${link.label === "Collections" ? "rounded-r-xl" : ""}`}
                >
                  <img
                    src={link.imgURL}
                    alt={link.label}
                    width={20}
                    height={20}
                  />

                  <p className="small-medium md:base-medium text-light-2">
                    {link.label}
                  </p>
                </Link>
              </div>
            );
          })}
        </div>

        <div className="flex-center gap-3 bg-dark-3 rounded-xl px-4 py-2 cursor-pointer">
          <p className="small-medium md:base-medium text-light-2">All</p>
          <img
            src="/assets/icons/filter.svg"
            width={20}
            height={20}
            alt="filter"
          />
        </div>
      </div>

      <section className="flex flex-1 h-full">
        <Outlet />
      </section>
    </div>
  );
};

export default Saved;
