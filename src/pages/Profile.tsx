import {
  Link,
  useParams,
  useLocation,
  Route,
  Routes,
  useNavigate
} from "react-router-dom";
import { RootState } from "@/store";
import { useEffect, useState } from "react";

import { Button } from "@/components/ui";
import { GridPostList, Loader } from "@/components/shared";
import { useAppSelector } from "@/hooks/useAppSelector";
import LikedPosts from "@/components/shared/LikedPosts";
import { 
  useGetUserById, 
  useGetFriendshipStatus, 
  useAddFriendMutation, 
  useRejectFriendRequestMutation,
  useAcceptFriendRequestMutation,
  useUnfriendMutation,
  useCancelFriendRequestMutation,
  useFollowUserMutation,
  useUnfollowUserMutation,
  useIsFollowing
} from "@/lib/api/react-queries";
import StatBlock from "@/components/shared/StatBlock";
import { Badge } from "@/components/ui/badge";
import { 
  DropdownMenu, 
  DropdownMenuItem, 
  DropdownMenuGroup, 
  DropdownMenuContent, 
  DropdownMenuTrigger } from "@/components/ui/dropdown-menu";

const Profile = () => {
  const { id } = useParams();
  const { pathname } = useLocation();
  const navigate = useNavigate();
  
  const [ friendshipState, setFriendshipState ] = useState({
    isAuthUser: false,
    isRequester: false,
    isRecipient: false,
    status: null as null | 'pending' | 'accepted' | 'rejected'
  });
  
  const { user: authUser } = useAppSelector((state: RootState) => state.auth);
  const { data: user, isLoading: isUserLoading } = useGetUserById(id || "");
  const { 
    data: friendshipStatus, 
    refetch: refetchFriendshipStatus,
  } = useGetFriendshipStatus(id || "");
  const { 
    data: isFollowing, 
    refetch: refetchFollowStatus,
  } = useIsFollowing(id || "");

  const { addFriend } = useAddFriendMutation();
  const { cancelFriendRequest } = useCancelFriendRequestMutation();
  const { rejectFriendRequest } = useRejectFriendRequestMutation();
  const { acceptFriendRequest } = useAcceptFriendRequestMutation();
  const { unfriend } = useUnfriendMutation();
  const { followUser, loading: followLoading } = useFollowUserMutation();
  const { unfollowUser, loading: unfollowLoading } = useUnfollowUserMutation();

  useEffect(() => {
    if (!authUser || !id) return;
    
    setFriendshipState({
      isAuthUser: authUser._id === id,
      isRequester: friendshipStatus?.recipient?._id === authUser._id,
      isRecipient: friendshipStatus?.requester?._id === authUser._id,
      status: friendshipStatus?.status as 'pending' | 'accepted' | 'rejected' | null
    });
  }, [authUser, id, friendshipStatus]);

  const handleFriendAction = async () => {
    if (friendshipState.isAuthUser) return;
    
    try {
      if (!friendshipStatus || friendshipState.status === 'rejected') {
        await addFriend(id || "");
        if (!friendshipStatus) navigate(0);
      } else if (friendshipState.status === 'pending' && friendshipState.isRequester) {
        await cancelFriendRequest(friendshipStatus.requester._id);
      } else if (friendshipState.status === 'pending' && friendshipState.isRecipient) {
        await acceptFriendRequest(friendshipStatus._id);
      } else if (friendshipState.status === 'accepted') {
        await unfriend(id || "");
        navigate(0);
      }
      
      await refetchFriendshipStatus();
    } catch (error) {
      console.error("Friend action failed:", error);
      // Consider adding a toast notification here
    }
  };

  const handleRejectRequest = async () => {
    if (!friendshipStatus || !friendshipState.isRecipient || friendshipState.status !== 'pending') return;
    
    try {
      await rejectFriendRequest(friendshipStatus.requester._id);
      await refetchFriendshipStatus();
    } catch (error) {
      console.error("Reject request failed:", error);
      // Consider adding a toast notification here
    }
  };

  const handleFollowAction = async () => {
    if (friendshipState.isAuthUser) return;
    
    try {
      if (isFollowing) {
        await unfollowUser(id || "");
      } else {
        await followUser(id || "");
      }
      await refetchFollowStatus();
    } catch (error) {
      console.error("Follow action failed:", error);
      // Consider adding a toast notification here
    }
  };

  const getFollowButtonText = () => {
    if (followLoading || unfollowLoading) {
      return <Loader />;
    }
    return isFollowing ? "Unfollow" : "Follow";
  };

  if (isUserLoading) {
    return (
      <div className="flex-center w-full h-full">
        <Loader />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="flex-center w-full h-full">
        <p className="text-light-3">User not found</p>
      </div>
    );
  }

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

          <div className="flex flex-col flex-1 gap-4 min-w-72 justify-between lg:gap-6">
            <div className="flex-1 flex flex-col gap-4 xl:flex-row xl:gap-12">
              <div className="flex flex-col lg:flex-col">
                <div className="flex justify-center w-full gap-2 xl:justify-start">
                  <h1 className="flex max-w-44 justify-center truncate text-ellipsis text-center h3-bold md:h1-semibold xl:text-left lg:max-w-full">
                    {user.username}
                  </h1>
                  <div className="flex flex-row gap-1 my-auto">
                    {user.isActive && (
                      <div className="relative group">
                        <img src="/assets/icons/check.svg" alt="check" className="w-4 h-4" />
                        <span className="absolute -top-8 left-1/2 -translate-x-1/2 bg-dark-4 text-light-1 text-xs px-2 py-1 rounded opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">
                          Verified
                        </span>
                      </div>
                    )}
                    {friendshipState.status === 'accepted' && (
                      <Badge variant="outline" className="">Friend</Badge>
                    )}
                  </div>
                </div>
                <p className="small-regular md:body-medium text-light-3 text-center xl:text-left">
                  @{user.email}
                </p>
              </div>   
              
              <div className="flex gap-2 justify-center">
                {!friendshipState.isAuthUser && (
                  <div className="flex gap-2">
                    <Button 
                      size="sm" 
                      className="shad-button_primary"
                      onClick={handleFollowAction}
                      disabled={followLoading || unfollowLoading}
                    >
                      {getFollowButtonText()}
                    </Button>
                    
                    {friendshipState.status === 'accepted' ? (
                      <Button size="sm" className="bg-light-1 text-black" onClick={handleFriendAction}>
                        Unfriend
                      </Button>
                    ) : friendshipState.status === 'pending' && friendshipState.isRequester ? (
                      <Button size="sm" className="bg-light-1 text-black" onClick={handleFriendAction}>
                        Cancel Request
                      </Button>
                    ) : friendshipState.status === 'pending' && friendshipState.isRecipient ? (
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button size="sm" className="bg-light-1 text-black">
                            Friend Request
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent>
                          <DropdownMenuGroup>
                            <DropdownMenuItem>
                              <Button 
                                size="sm" 
                                className="bg-white text-black w-full" 
                                onClick={handleFriendAction}
                              >
                                Accept
                              </Button>
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                              <Button 
                                size="sm" 
                                className="bg-white text-black w-full" 
                                onClick={handleRejectRequest}
                              >
                                Reject
                              </Button>
                            </DropdownMenuItem>
                          </DropdownMenuGroup>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    ) : (
                      <Button size="sm" className="bg-white text-black" onClick={handleFriendAction}>
                        Add Friend
                      </Button>
                    )}
                    
                    <Button size="sm" className="bg-white text-black">
                      Message
                    </Button>
                  </div>
                )}
                
                {friendshipState.isAuthUser && (
                  <Link
                    to={`/update-profile/${user._id}`}
                    className={`h-12 bg-dark-4 px-5 text-light-1 flex-center gap-2 rounded-lg`}>
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
              </div>
            </div>

            <div className="flex gap-2 items-center justify-center xl:justify-start flex-wrap z-20">
              <StatBlock value={user.posts?.length || 0} label="Posts" />
              <StatBlock value={user.followersCount || 0} label="Followers" />
              <StatBlock value={user.followingCount || 0} label="Following" />
            </div>

            <p className="small-medium md:base-medium text-center xl:text-left max-w-screen-sm">
              {user.bio}
            </p>
          </div>
        </div>
      </div>

      {authUser?._id && user._id && (
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
              user.posts ? (
                <ul className="user-grid">
                  <GridPostList posts={user.posts} showUser={false} showStats={true} />
                </ul>
              ) : (
                <div className="flex-center flex-col gap-4 h-full w-full py-10">
                  {authUser?._id === user._id ? (
                    <>
                      <p className="text-light-3 text-xl font-medium">Upload your first post</p>
                      <p className="text-light-4">Your posts will appear here</p>
                    </>
                  ) : (
                    <>
                      <p className="text-light-3 text-xl font-medium">This user has no posts yet</p>
                      <p className="text-light-4">When they post, their posts will appear here</p>
                    </>
                  )}
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