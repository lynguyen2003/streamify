import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";

import { checkIsLiked } from "@/lib/utils";
import { IPost, IUser } from "@/types";

type PostStatsProps = {
  post: IPost;
  userId: string;
};

const PostStats = ({ post, userId }: PostStatsProps) => {
  const location = useLocation();
  const likesList = post.likes.map((user: IUser) => user._id);

  const [likes, setLikes] = useState<string[]>(likesList);
  const [isSaved, setIsSaved] = useState(false);

  const handleLikePost = (
    e: React.MouseEvent<HTMLImageElement, MouseEvent>
  ) => {
    e.stopPropagation();

    let likesArray = [...likes];

    if (likesArray.includes(userId)) {
      likesArray = likesArray.filter((Id) => Id !== userId);
    } else {
      likesArray.push(userId);
    }

    setLikes(likesArray);
  };

  const handleSavePost = (
    e: React.MouseEvent<HTMLImageElement, MouseEvent>
  ) => {
    e.stopPropagation();

    if (isSaved) {
      setIsSaved(false);
    } else {
      setIsSaved(true);
    }
  };

  const containerStyles = location.pathname.startsWith("/profile")
    ? "w-full"
    : "";

  return (
    <div className={`flex justify-around items-center z-20 ${containerStyles}`}>
      <div className="flex gap-2 mr-5">
        <img
          src={`${
            checkIsLiked(likes, userId)
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
        <p className="small-medium lg:base-medium my-auto">78</p>
      </div>

      <div className="flex gap-2 mr-5">
        <img
          src="/assets/icons/share.svg"
          alt="chat"
          width={24}
          height={24}
          className="cursor-pointer"
        />
        <p className="small-medium lg:base-medium my-auto">55</p>
      </div>

      <div className="flex gap-2">
        <img
          src={isSaved ? "/assets/icons/saved.svg" : "/assets/icons/save.svg"}
          alt="share"
          width={24}
          height={24}
          className="cursor-pointer"
          onClick={(e) => handleSavePost(e)}
        />
      </div>
    </div>
  );
};

export default PostStats;
