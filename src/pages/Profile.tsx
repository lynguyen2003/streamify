import {
  Link,
  useParams,
  useLocation,
  Route,
  Routes,
  Outlet,
} from "react-router-dom";

import { Button } from "@/components/ui";
import { GridPostList, Loader } from "@/components/shared";
import { useAppSelector } from "@/hooks/useAppSelector";

import { RootState } from "@/store";
import LikedPosts from "@/pages/LikedPosts";
import { useEffect } from "react";
import { useAppDispatch } from "@/hooks/useAppDispatch";
import { useGetUserById } from "@/lib/api/react-queries";
type StabBlockProps = {
  value: string | number;
  label: string;
}

const StatBlock = ({ value, label }: StabBlockProps) => (
  <div className="flex-center gap-2">
    <p className="small-semibold lg:body-bold text-primary-500">{value}</p>
    <p className="small-medium lg:base-medium text-light-2">{label}</p>
  </div>
);

const Profile = () => {
  const { id } = useParams();
  const { pathname } = useLocation();
  const dispatch = useAppDispatch();  
  const state = useLocation().state;
  const { user: authUser } = useAppSelector((state: RootState) => state.auth);
  const { data: user} = useGetUserById(id || "");



  useEffect(() => {
    if (state && state.refresh) {
      window.history.replaceState({}, document.title);
    }
  }, [dispatch, id, state]);

  if (!user)
    return (
      <div className="flex-center w-full h-full">
        <Loader />
      </div>
    );

  return (
    <div className="profile-container">
      <div className="profile-inner_container">
        <div className="flex xl:flex-row flex-col max-xl:items-center flex-1 gap-7">
          <img
            src={
              user.imageUrl || "/assets/icons/profile-placeholder.svg"
            }
            alt="profile"
            className="w-28 h-28 lg:h-36 lg:w-36 rounded-full"
          />

          <div className="flex flex-col flex-1 justify-between md:mt-2">
            <div className="flex flex-row w-full">
              <div className="flex-1 flex flex-col">
                <h1 className="text-center xl:text-left h3-bold md:h1-semibold w-full">
                  {user.username}
                </h1>
                <p className="small-regular md:body-medium text-light-3 text-center xl:text-left">
                  @{user.username}
                </p>
              </div>

              <div className="flex gap-4">
                {authUser?._id === user._id && (
                  <Link
                    to={`/update-profile/${user._id}`}
                    className={`h-12 bg-dark-4 px-5 text-light-1 flex-center gap-2 rounded-lg ${
                      user._id !== user._id && "hidden"
                    }`}>
                    <img
                      src={"/assets/icons/edit.svg"}
                      alt="edit"
                      width={20}
                      height={20}
                    />
                    <p className="flex whitespace-nowrap small-medium">
                      Edit Profile
                    </p>
                  </Link>
                )}
                {authUser?._id !== user._id && (
                  <Button size="sm" className="shad-button_primary px-8">
                    Follow
                  </Button>
                )}
                {authUser?._id !== user._id && (
                  <Button size="sm" className="bg-white text-black">
                    Add Friend
                  </Button>
                )}
                {authUser?._id !== user._id && (
                  <Button size="sm" className="bg-white  text-black">
                    Message
                  </Button>
                )}
              </div>
            </div>

            <div className="flex gap-8 mt-10 items-center justify-center xl:justify-start flex-wrap z-20">
              <StatBlock value={user.posts?.length || 0} label="Posts" />
              <StatBlock value={user.followersCount || 0} label="Followers" />
              <StatBlock value={user.followingCount || 0} label="Following" />
            </div>

            <p className="small-medium md:base-medium text-center xl:text-left mt-7 max-w-screen-sm">
              {user.bio}
            </p>
          </div>
        </div>
      </div>

      {authUser?._id === user._id && (
        <div className="flex max-w-5xl w-full">
          <Link
            to={`/profile/${id}`}
            className={`profile-tab rounded-l-lg ${
              pathname === `/profile/${id}` && "!bg-dark-3"
            }`}>
            <img
              src={"/assets/icons/posts.svg"}
              alt="posts"
              width={20}
              height={20}
            />
            Posts
          </Link>
          <Link
            to={`/profile/${id}/liked-posts`}
            className={`profile-tab rounded-r-lg ${
              pathname === `/profile/${id}/liked-posts` && "!bg-dark-3"
            }`}>
            <img
              src={"/assets/icons/like.svg"}
              alt="like"
              width={20}
              height={20}
            />
            Liked Posts
          </Link>
        </div>
      )}

      <div className="flex flex-1 w-full max-w-5xl mt-4">
        <Routes>
          <Route
            index
            element={
              user.posts && user.posts.length > 0 ? (
                <ul className="user-grid">
                  <GridPostList posts={user.posts} showUser={false} />
                </ul>
              ) : (
                <div className="flex-center flex-col gap-4 h-full w-full py-10">
                  <p className="text-light-3 text-xl font-medium">Upload your first post</p>
                  <p className="text-light-4">Your posts will appear here</p>
                </div>
              )
            }
          />
          <Route 
            path="liked-posts" 
            element={<LikedPosts userId={user._id} />} 
          />
        </Routes>
      </div>
    </div>
  );
};

export default Profile;