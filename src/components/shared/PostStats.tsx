import { useLocation } from "react-router-dom";
import { useState } from "react";
import { RootState } from "@/store";

import { IPost } from "@/types";
import { checkIsLiked, checkIsSaved } from "@/lib/utils";
import { useAppSelector } from "@/hooks/useAppSelector";
import { useToggleLikePostMutation, useToggleSavePostMutation } from "@/lib/api/react-queries";

type PostStatsProps = {
  post: IPost;
};

const PostStats = ({ post }: PostStatsProps) => {
  const location = useLocation();
  const authUser = useAppSelector((state: RootState) => state.auth);
  const likesList = post.likes?.map((like: any) => like._id);
  const savedList = post.saves?.map((save: any) => save._id);
  const [likes, setLikes] = useState<string[]>(likesList || []);
  const [saves, setSaves] = useState<string[]>(savedList || []);

  console.log(post);

  
  const { toggleLikePost } = useToggleLikePostMutation();
  const { toggleSavePost } = useToggleSavePostMutation();
  
  const handleLikePost = (
    e: React.MouseEvent<HTMLImageElement, MouseEvent>
  ) => {
    e.stopPropagation();

    let likesArray = [...likes];

    if (likesArray.includes(authUser?.user?._id || "")) {
      likesArray = likesArray.filter((id) => id !== authUser?.user?._id || "");
    } else {
      likesArray.push(authUser?.user?._id || "");
    }

    setLikes(likesArray);
    toggleLikePost(post._id);
  };

  const handleSavePost = (
    e: React.MouseEvent<HTMLImageElement, MouseEvent>
  ) => {
    e.stopPropagation();

    let savesArray = [...saves || []];

    if (savesArray.includes(authUser?.user?._id || "")) {
      savesArray = savesArray.filter((id) => id !== authUser?.user?._id || "");
    } else {
      savesArray.push(authUser?.user?._id || "");
    }

    setSaves(savesArray);
    toggleSavePost(post._id);
  };

  const containerStyles = location.pathname.startsWith("/profile")
    ? "w-full"
    : "";

  return (
    <div className={`flex justify-between items-center z-20 mx-2 ${containerStyles}`}>
      <div className="flex gap-2">
        <div className="flex gap-2 mr-5">
          <img
            src={`${
              checkIsLiked(likes, authUser?.user?._id || "")
                ? "/assets/icons/liked.svg"
                : "/assets/icons/like.svg"
            }`}
            alt="like"
            width={24}
            height={24}
            onClick={(e) => handleLikePost(e)}
            className="cursor-pointer"
          />
          <p className="small-medium lg:base-medium my-auto">{likes.length}</p>
        </div>

        <div className="flex gap-2 mr-5">
          <img
            src="/assets/icons/chat.svg"
            alt="chat"
            width={24}
            height={24}
            className="cursor-pointer"
          />
          <p className="small-medium lg:base-medium my-auto">{post.commentCount}</p>
        </div>

        <div className="flex gap-2 mr-5">
          <img
            src="/assets/icons/share.svg"
            alt="share"
            width={24}
            height={24}
            className="cursor-pointer"
          />
          <p className="small-medium lg:base-medium my-auto">{post.viewCount || 0}</p>
        </div>
      </div>

        <div className="flex gap-2">
          <img
            src={checkIsSaved(saves, authUser?.user?._id || "")
              ? "/assets/icons/saved.svg"
              : "/assets/icons/save.svg"
            }
            alt="save"
            width={24}
            height={24}
            className="cursor-pointer"
            onClick={(e) => handleSavePost(e)}
          />
          <p className="small-medium lg:base-medium my-auto">{saves.length || 0}</p>
        </div>
    </div>
  );
};

export default PostStats;
