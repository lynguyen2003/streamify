import { Link } from "react-router-dom";

import { Button } from "../ui/button";
import { IUser } from "@/types";
import { useFollowUserMutation, useUnfollowUserMutation, useIsFollowing } from "@/lib/api/react-queries";
import { useAppSelector } from "@/hooks/useAppSelector";
import { RootState } from "@/store";
import { Loader } from "@/components/shared";

type UserCardProps = {
  user: IUser;
};

const UserCard = ({ user }: UserCardProps) => {
  const { user: authUser } = useAppSelector((state: RootState) => state.auth);
  const { data: isFollowing, refetch: refetchFollowStatus } = useIsFollowing(user._id);
  const { followUser, loading: followLoading } = useFollowUserMutation();
  const { unfollowUser, loading: unfollowLoading } = useUnfollowUserMutation();
  
  const handleFollowAction = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (authUser?._id === user?._id) return;
    
    try {
      if (isFollowing) {
        await unfollowUser(user._id);
      } else {
        await followUser(user._id);
      }
      await refetchFollowStatus();
    } catch (error) {
      console.error("Error with follow action:", error);
    }
  };
  
  const isLoading = followLoading || unfollowLoading;
  
  return (
    <Link to={`/profile/${user._id}`} className="user-card">
      <img
        src={user.imageUrl || "/assets/icons/profile-placeholder.svg"}
        alt="creator"
        className="rounded-full w-14 h-14"
      />

      <div className="flex-center flex-col gap-1">
        <p className="base-medium text-light-1 text-center line-clamp-1">
          {user.username || "Name"}
        </p>
        <p className="small-regular text-light-3 text-center line-clamp-1">
          {user.email || "None"}
        </p>
      </div>

      <Button 
        type="button" 
        size="sm" 
        className={`${isFollowing ? 'bg-gray-600' : 'shad-button_primary'} px-5`}
        onClick={handleFollowAction}
        disabled={isLoading || authUser?._id === user._id}
      >
        {isLoading ? <Loader /> : isFollowing ? "Unfollow" : "Follow"}
      </Button>
    </Link>
  );
};

export default UserCard;
