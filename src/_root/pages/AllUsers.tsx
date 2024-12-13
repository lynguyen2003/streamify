import { useEffect } from "react";
import { useInView } from "react-intersection-observer";

import { Loader, UserCard } from "@/components/shared";
import { useGetUsers } from "@/lib/react-query/queries";
import { Models } from "appwrite";

const AllUsers = () => {
  const { ref, inView } = useInView();
  const {
    data: creators,
    isLoading: isUsersLoading,
    fetchNextPage,
    hasNextPage,
  } = useGetUsers();

  useEffect(() => {
    if (inView) {
      fetchNextPage();
    }
  }, [inView]);

  return (
    <div className="common-container">
      <div className="user-container">
        <h2 className="h3-bold md:h2-bold text-left w-full">All Users</h2>
        {isUsersLoading && !creators ? (
            <Loader />
          ) : (
            <ul className="user-grid">
                {creators?.pages.map((users) => (
                  <>
                  {users.documents.map(
                      (user: Models.Document, index: any) => (
                        <li
                          key={`page-${index}`}
                          className="flex-1 min-w-[200px] w-full"
                        >
                          <UserCard user={user} />
                        </li>
                      )
                    )}
                  </>
                ))}   
            </ul>
          )}
          {hasNextPage && (
            <div ref={ref} className="flex-center w-full">
              <Loader />
            </div>
          )}
      </div>
    </div>
  );
};

export default AllUsers;
