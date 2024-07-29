import { useState } from "react";

import { Models } from "appwrite";

import { Loader, PostCard, UserCard } from "@/components/shared";
import { useGetRecentPosts, useGetUsers } from "@/lib/react-query/queries";
import UserStory from "@/components/shared/UserStory";

const Home = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const { data: creators, isLoading: isUserLoading } = useGetUsers();
  const {
    data: posts,
    isLoading: isPostLoading,
    isError: isErrorPosts,
  } = useGetRecentPosts();

  const handleNext = () => {
    setCurrentIndex((prevIndex) =>
      Math.min(prevIndex + 6, creators?.pages[0]?.documents.length ?? 0 - 6)
    );
  };

  const handlePrevious = () => {
    setCurrentIndex((prevIndex) => Math.max(prevIndex - 6, 0));
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
        <ul className="flex gap-4">
          <img
            src="/assets/icons/arrow-left.svg"
            alt="Arrow Right"
            width={32}
            height={32}
            className="cursor-pointer"
            onClick={() => handlePrevious()}
          />
          {creators.pages.map((users) => (
            <>
              {users.documents
                .slice(currentIndex, currentIndex + 6)
                .map((user: Models.Document) => (
                  <li key={user.$id}>
                    <UserStory user={user} />
                  </li>
                ))}
            </>
          ))}
          <img
            src="/assets/icons/arrow-right.svg"
            alt="Arrow Right"
            width={32}
            height={32}
            className="cursor-pointer"
            onClick={() => handleNext()}
          />
          {isUserLoading && (
            <div className="flex-center w-full">
              <Loader />
            </div>
          )}
        </ul>

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
