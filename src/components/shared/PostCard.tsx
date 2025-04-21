import { Link } from "react-router-dom";
import { useState } from "react";
import { formatTimestamp } from "@/lib/utils";
import { IPost } from "@/types";
import { PostStats, CommentInput } from ".";
import { useAppSelector } from "@/hooks/useAppSelector";
import { RootState } from "@/store";
import PostDetailDialog from "@/components/dialog/PostDetailDialog";

type PostCardProps = {
  post: IPost;
};

const PostCard = ({ post }: PostCardProps) => {
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);
  const authUser = useAppSelector((state: RootState) => state.auth);
  
  if (!post.author) return null;

  const hasMultipleMedia = post.mediaUrls.length > 1;

  const handleNextSlide = () => {
    if (post.mediaUrls) {
      setActiveIndex((prev) => (prev === post.mediaUrls.length - 1 ? 0 : prev + 1));
    }
  };

  const handlePrevSlide = () => {
    if (post.mediaUrls) {
      setActiveIndex((prev) => (prev === 0 ? post.mediaUrls.length - 1 : prev - 1));
    }
  };

  const isVideoUrl = (url: string) => {
    const videoExtensions = ['.mp4', '.webm', '.mov', '.avi', '.mkv', '.gif'];
    return videoExtensions.some(ext => url.toLowerCase().includes(ext));
  };

  const currentMediaUrl = post.mediaUrls[activeIndex] || "/assets/images/side-img.svg";
  const isVideo = isVideoUrl(currentMediaUrl);

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
                  {formatTimestamp(parseInt(post.createdAt), 'auto')}
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

            <div className="relative">
              <div className="w-full relative">
                {isVideo ? (
                  <video 
                    src={currentMediaUrl} 
                    className="post-card_img" 
                    controls
                    autoPlay={true}
                    muted={true}
                    loop={true}
                    playsInline={true}
                  />
                ) : (
                  <img
                    src={currentMediaUrl}
                    alt="post media"
                    className="post-card_img"
                  />
                )}
                
                {hasMultipleMedia && (
                  <>
                    <button 
                      onClick={(e) => { e.stopPropagation(); handlePrevSlide(); }}
                      className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-dark-4/60 p-2 rounded-full z-10"
                    >
                      <img src="/assets/icons/arrow-left.svg" alt="Previous" width={20} height={20} />
                    </button>
                    
                    <button 
                      onClick={(e) => { e.stopPropagation(); handleNextSlide(); }}
                      className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-dark-4/60 p-2 rounded-full z-10"
                    >
                      <img src="/assets/icons/arrow-right.svg" alt="Next" width={20} height={20} />
                    </button>
                    
                    <div className={`absolute ${isVideo ? 'bottom-14' : 'bottom-2'} left-0 right-0 flex justify-center gap-1 z-10`}>
                      {post.mediaUrls.map((_, idx) => (
                        <div 
                          key={idx} 
                          className={`w-2 h-2 rounded-full ${activeIndex === idx ? 'bg-primary-500' : 'bg-dark-4/60'}`}
                          onClick={(e) => { e.stopPropagation(); setActiveIndex(idx); }}
                        />
                      ))}
                    </div>
                  </>
                )}
              </div>
            </div>
          </div> 

          <div className="flex flex-col gap-8">
            <PostStats post={post} />
            <CommentInput post={post} onCommentSubmit={() => Promise.resolve()} /> 
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
