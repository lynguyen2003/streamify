import { Fragment, useEffect } from "react";
import { useInView } from "react-intersection-observer";
import { Loader, PostCard, UserCard } from "@/components/shared";
import useDebounce from "@/hooks/useDebounce";
import { useInfinitePosts, useInfiniteUsers } from "@/lib/api/react-queries";

const Home = () => {
  const { ref: postRef, inView: postInView } = useInView();
  const { ref: userRef, inView: userInView } = useInView();

  const debouncedPostInView = useDebounce(postInView, 300);
  const debouncedUserInView = useDebounce(userInView, 300);

  const {
    data: postsData,
    isLoading: isLoadingPost,
    fetchNextPage: fetchNextPagePost,
    hasNextPage: hasNextPagePost,
  } = useInfinitePosts();

  const {
    data: usersData,
    isPending: isGetUserLoading,
    fetchNextPage: fetchNextPageUsers,
    hasNextPage: hasNextPageUsers,
  } = useInfiniteUsers();
  
  useEffect(() => {
    if (debouncedPostInView && hasNextPagePost) {
      fetchNextPagePost();
    }
    if (debouncedUserInView && hasNextPageUsers) {
      fetchNextPageUsers();
    }
  }, [
    debouncedPostInView, 
    hasNextPagePost, 
    fetchNextPagePost, 
    debouncedUserInView, 
    hasNextPageUsers, 
    fetchNextPageUsers
  ]);


  return (
    <div className="flex flex-1">
      <div className="home-container">
        {/* <div className="flex flex-row items-center">
          <img
            id="left-arrow"
            src="/assets/icons/arrow-left.svg"
            alt="Arrow Left"
            width={32}
            height={32}
            className="cursor-pointer"
            onClick={scrollLeft}
          />

          <ul
            ref={scrollContainerRef}
            className="max-w-80 lg:max-w-screen-sm sm:max-w-screen-sm flex flex-row gap-2 overflow-x-scroll sm:overflow-x-hidden custom-scrollbar-hidden"
          >
            {creatorsData?.pages.map((page: any, pageIndex: number) => (
              <Fragment key={`page-${pageIndex}`}>
                {page?.edges?.map((edge: any) => (
                  <li key={edge.node._id}>
                    <UserStory user={edge.node} />
                  </li>
                ))}
              </Fragment>
            ))}
            {isGetUserLoading && (
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
        </div> */}

        <div className="home-posts">
          <div>
            <h2 className="h3-bold md:h2-bold text-left w-full">Home Feed</h2>
          </div>
          {isLoadingPost && !postsData ? (
            <Loader />
          ) : (
            <ul className="flex flex-col flex-1 gap-9 w-full">
              {postsData?.pages.map((page: any, pageIndex: number) => (
                <Fragment key={`page-${pageIndex}`}>
                  {page?.edges?.map((edge: any) => (
                    <li key={edge.node._id} className="flex justify-center w-full">
                      <PostCard post={edge.node} />
                    </li>
                  ))}
                </Fragment>
              ))}
            </ul>
          )}
          {hasNextPagePost && (
            <div ref={postRef} className="flex-center w-full py-4">
              <Loader />
            </div>
          )}
        </div>
      </div>

      <div className="home-creators">
        <h3 className="h3-bold text-light-1">Top Creators</h3>
          {isGetUserLoading && !usersData ? (
            <Loader />
          ) : (
            <ul className="grid 2xl:grid-cols-2 gap-6">
              {usersData?.pages.map((page: any, pageIndex: number) => (
                <Fragment key={`page-${pageIndex}`}>
                {page?.edges?.map((edge: any) => (
                  <li key={edge.node._id}>
                    <UserCard user={edge.node} />
                  </li>
                ))}
                </Fragment>
              ))}
            </ul>
          )}
          {hasNextPageUsers && (
            <div ref={userRef} className="flex-center w-full">
              <Loader />
            </div>
          )}
      </div>
    </div>
  );
};

export default Home;
