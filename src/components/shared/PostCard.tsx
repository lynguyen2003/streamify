import { Link } from "react-router-dom";
import { useState } from "react";
import { formatTimestamp } from "@/lib/utils";
import { IPost } from "@/types";
import { PostStats, PostComments, PostDetailDialog } from ".";
import { useAppSelector } from "@/hooks/useAppSelector";
import { RootState } from "@/store";

type PostCardProps = {
  post: IPost;
};

const PostCard = ({ post }: PostCardProps) => {
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const authUser = useAppSelector((state: RootState) => state.auth);
  
  if (!post.author) return null;

  return (
    <>
      <div className="post-card">
        <div className="flex flex-col gap-5">
          <div className="flex items-center gap-3">
            <Link to={`/profile/${post.author._id}`}>
              <img
                src={
                  post.author.imageUrl ||
                  "/assets/icons/profile-placeholder.svg"
                }
                alt="creator"
                className="w-12 lg:h-12 rounded-full"
              />
            </Link>

            <div className="flex flex-col grow">
              <p className="base-medium lg:body-bold text-light-1">
                {post.author.username}
              </p>
              <div className="flex-start gap-2 text-light-3">
                <p className="subtle-semibold lg:small-regular ">
                  {formatTimestamp(parseInt(post.createdAt), 'date')}
                </p>
                •
                <p className="subtle-semibold lg:small-regular">
                  {post.location}
                </p>
              </div>
            </div>

            <Link
            to={`/update-post/${post._id}`}
            className={`${authUser?.user?._id !== post.author._id && "hidden"} `}
            >
              <img
                src={"/assets/icons/edit.svg"}
                alt="edit"
                width={20}
                height={20}
              />
            </Link>
          </div>

          <div 
            className="flex flex-col gap-2 small-medium lg:base-medium cursor-pointer"
            onClick={() => setIsDetailOpen(true)}>
            <p>{post.caption}</p>
            <ul className="flex gap-2">
              {post.tags.map((tag: string, index: number) => (
                <li key={`${tag}${index}`} className="text-light-3 small-regular">
                  #{tag}
                </li>
              ))}
            </ul>

            <img
              src={"/assets/images/side-img.svg"}
              alt="post image"
              className="post-card_img"
            />
          </div> 

          <div className="flex flex-col gap-8">
            <PostStats post={post} />
            <PostComments post={post} onCommentSubmit={() => Promise.resolve()} /> 
          </div>
        </div>
      </div>

      <PostDetailDialog 
        isOpen={isDetailOpen} 
        onOpenChange={setIsDetailOpen} 
        id={post._id} 
      />
    </>
  );
};

export default PostCard;
