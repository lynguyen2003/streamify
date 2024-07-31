import { useEffect, useRef } from "react";

import { Models } from "appwrite";

import { Loader, PostCard, UserCard } from "@/components/shared";
import { useGetRecentPosts, useGetUsers } from "@/lib/react-query/queries";
import UserStory from "@/components/shared/UserStory";

const Home = () => {
  const scrollContainerRef = useRef(null);

  const { data: creators, isLoading: isUserLoading } = useGetUsers();
  const {
    data: posts,
    isLoading: isPostLoading,
    isError: isErrorPosts,
  } = useGetRecentPosts();

  useEffect(() => {
    updateArrowsVisibility();
    if (scrollContainerRef.current) {
      (scrollContainerRef.current as HTMLElement).addEventListener(
        "scroll",
        updateArrowsVisibility
      );
    }
    return () => {
      if (scrollContainerRef.current) {
        (scrollContainerRef.current as HTMLElement).removeEventListener(
          "scroll",
          updateArrowsVisibility
        );
      }
    };
  }, []);

  const updateArrowsVisibility = () => {
    if (scrollContainerRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } =
        scrollContainerRef.current;
      const leftArrow = document.getElementById("left-arrow");
      const rightArrow = document.getElementById("right-arrow");

      if (leftArrow) {
        if (scrollLeft > 0) {
          leftArrow.classList.remove("hidden");
        } else {
          leftArrow.classList.add("hidden");
        }
      }

      if (rightArrow) {
        if (scrollLeft + clientWidth < scrollWidth) {
          rightArrow.classList.remove("hidden");
        } else {
          rightArrow.classList.add("hidden");
        }
      }
    }
  };

  const scrollLeft = () => {
    if (scrollContainerRef.current) {
      (scrollContainerRef.current as HTMLElement).scrollBy({
        left: -100,
        behavior: "smooth",
      });
    }
  };

  const scrollRight = () => {
    if (scrollContainerRef.current) {
      (scrollContainerRef.current as HTMLElement).scrollBy({
        left: 100,
        behavior: "smooth",
      });
    }
  };

  if (!creators)
    return (
      <div className="flex-center w-full h-full">
        <Loader />
      </div>
    );

  if (isErrorPosts) {
    return (
      <div className="flex flex-1">
        <div className="home-container">
          <p className="body-medium text-light-1">Something bad happened</p>
        </div>
        <div className="home-creators">
          <p className="body-medium text-light-1">Something bad happened</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-1">
      <div className="home-container">
        <div className="flex flex-row items-center">
          <img
            id="left-arrow"
            src="/assets/icons/arrow-left.svg"
            alt="Arrow Right"
            width={32}
            height={32}
            className="cursor-pointer"
            onClick={scrollLeft}
          />

          <ul
            ref={scrollContainerRef}
            className="max-w-80 lg:max-w-screen-sm sm:max-w-screen-sm flex flex-row gap-2 overflow-x-scroll sm:overflow-x-hidden custom-scrollbar-hidden"
          >
            {creators.pages.map((users) => (
              <>
                {users.documents.map((user: Models.Document) => (
                  <li key={user.$id}>
                    <UserStory user={user} />
                  </li>
                ))}
              </>
            ))}
            {isUserLoading && (
              <div className="flex-center w-full">
                <Loader />
              </div>
            )}
          </ul>
          <img
            id="right-arrow"
            src="/assets/icons/arrow-right.svg"
            alt="Arrow Right"
            width={32}
            height={32}
            className="cursor-pointer"
            onClick={scrollRight}
          />
        </div>

        <div className="home-posts">
          <h2 className="h3-bold md:h2-bold text-left w-full">Home Feed</h2>
          {isPostLoading && !posts ? (
            <Loader />
          ) : (
            <ul className="flex flex-col flex-1 gap-9 w-full ">
              {posts?.documents.map((post: Models.Document) => (
                <li key={post.$id} className="flex justify-center w-full">
                  <PostCard post={post} />
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>

      <div className="home-creators">
        <h3 className="h3-bold text-light-1">Top Creators</h3>
        {isUserLoading && !creators ? (
          <Loader />
        ) : (
          <>
            {creators?.pages.map((user) => (
              <ul className="grid 2xl:grid-cols-2 gap-6">
                {user.documents.map((item: Models.Document) => (
                  <li key={item.$id}>
                    <UserCard user={item} />
                  </li>
                ))}
              </ul>
            ))}
          </>
        )}
      </div>
    </div>
  );
};

export default Home;
