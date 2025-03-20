import {
  Link,
  useParams,
  useLocation,
  Route,
  Routes,
  useNavigate
} from "react-router-dom";
import { RootState } from "@/store";

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
  useCancelFriendRequestMutation
} from "@/lib/api/react-queries";
import StatBlock from "@/components/shared/StatBlock";
import { Badge } from "@/components/ui/badge";

const Profile = () => {
  const { id } = useParams();
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const { user: authUser } = useAppSelector((state: RootState) => state.auth);
  const { data: user } = useGetUserById(id || "");
  const { data: friendshipStatus, refetch: refetchFriendshipStatus } = useGetFriendshipStatus(id || "");
  const { addFriend, loading: addFriendLoading } = useAddFriendMutation();
  const { cancelFriendRequest, loading: cancelRequestLoading } = useCancelFriendRequestMutation();
  const { rejectFriendRequest, loading: rejectRequestLoading } = useRejectFriendRequestMutation();
  const { acceptFriendRequest, loading: acceptRequestLoading } = useAcceptFriendRequestMutation();
  const { unfriend, loading: unfriendLoading } = useUnfriendMutation();

  const handleFriendAction = async () => {
    if (authUser?._id === user?._id) return;

    if (!friendshipStatus || friendshipStatus.status === 'rejected') {
      await addFriend(id || "");
      if (!friendshipStatus) {
        navigate(0);
      }
    } else if (friendshipStatus.status === 'pending' && friendshipStatus.requester._id === authUser?._id) {
      await cancelFriendRequest(friendshipStatus._id);
    } else if (friendshipStatus.status === 'pending' && friendshipStatus.recipient._id === authUser?._id) {
      await acceptFriendRequest(friendshipStatus._id);
    } else if (friendshipStatus.status === 'accepted') {
      await unfriend(id || "");
      navigate(0);
    }
    
    await refetchFriendshipStatus();
  };

  const handleRejectRequest = async () => {
    if (friendshipStatus && friendshipStatus.recipient._id === authUser?._id && 
      friendshipStatus.status === 'pending') {
    await rejectFriendRequest(friendshipStatus._id);
    await refetchFriendshipStatus();
  }
  };

  const getFriendButtonText = () => {
    if (addFriendLoading || cancelRequestLoading || rejectRequestLoading || 
        acceptRequestLoading || unfriendLoading) {
      return <Loader />;
    }
    
    if (!friendshipStatus || friendshipStatus.status === 'rejected') {
      return "Add Friend";
    }
    
    if (friendshipStatus.status === 'pending' && friendshipStatus.requester._id === authUser?._id) {
      return "Cancel Request";
    }
    
    if (friendshipStatus.status === 'accepted') {
      return "Unfriend";
    }
    
    if (friendshipStatus.status === 'pending' && friendshipStatus.recipient._id === authUser?._id) {
      return "Accept Request";
    }
   
    return "Add Friend";
  };

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
                <div className="flex flex-row relative">
                  <h1 className="text-center xl:text-left h3-bold md:h1-semibold w-full">
                    {user.username}
                  </h1>
                  {friendshipStatus?.status === 'accepted' && (
                    <Badge variant="outline" className="absolute left-48 bottom-0 mb-2 ml-2">Friend</Badge>
                  )}
                </div>
                <p className="small-regular md:body-medium text-light-3 text-center xl:text-left">
                  @{user.email}
                </p>
              </div>

              <div className="flex gap-4">
                {authUser?._id === user._id ? (
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
                ) : (
                  <>
                    <Button size="sm" className="shad-button_primary px-8">
                      Follow
                    </Button>
                    
                    <Button 
                      size="sm" 
                      className="bg-white text-black" 
                      onClick={handleFriendAction}
                    >
                      {getFriendButtonText()}
                    </Button>

                    {authUser?._id !== user?._id && friendshipStatus?.recipient._id === authUser?._id && friendshipStatus?.status === 'pending' && (
                      <Button 
                        size="sm" 
                        className="bg-white text-black" 
                        onClick={handleRejectRequest}
                      >
                        Reject Request
                      </Button>
                    )}
                    
                    <Button size="sm" className="bg-white text-black">
                      Message
                    </Button>
                  </>
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
              user.posts && user.posts.length > 0 ? (
                <ul className="user-grid">
                  <GridPostList posts={user.posts} showUser={false} />
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