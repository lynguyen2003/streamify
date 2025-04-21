import { useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";;
import { toast } from "sonner";

import { formatTimestamp } from "@/lib/utils";
import { PostStats, CommentInput, Loader } from "@/components/shared";
import { Button } from "@/components/ui";
import { useAppSelector } from "@/hooks/useAppSelector";
import { RootState } from "@/store";
import { useDeletePostMutation, useGetPostById } from "@/lib/api/react-queries";

const PostDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const authUser = useAppSelector((state: RootState) => state.auth);
  const [activeIndex, setActiveIndex] = useState(0);

  const { data, isPending } = useGetPostById(id || "");
  const { deletePost, error: deleteError } = useDeletePostMutation();

  const handleDeletePost = async () => {
      try {
          if (!data) {
              return;
          }
          await deletePost(data._id);
          if (deleteError) {
              toast.error('Failed to delete post');
          }
          navigate(0);
      } catch (error) {
          console.error('Error deleting post:', error);
      }
  }

  const handleNextSlide = () => {
    if (data?.mediaUrls) {
      setActiveIndex((prev) => (prev === data.mediaUrls.length - 1 ? 0 : prev + 1));
    }
  };

  const handlePrevSlide = () => {
    if (data?.mediaUrls) {
      setActiveIndex((prev) => (prev === 0 ? data.mediaUrls.length - 1 : prev - 1));
    }
  };

  const isVideoUrl = (url: string) => {
    const videoExtensions = ['.mp4', '.webm', '.mov', '.avi', '.mkv', '.gif'];
    return videoExtensions.some(ext => url.toLowerCase().includes(ext));
  };

  if (isPending) {
    return (
      <div className="flex-center w-full h-full">
        <Loader />
      </div>
    );
  }

  if (!data) {
    return (
      <div className="flex-center w-full h-full">
        <div className="flex flex-col gap-2 items-center">
          <h2 className="h3-bold text-light-1">Post not found</h2>
          <Link to="/">
            <Button variant="outline">Back to Home</Button>
          </Link>
        </div>
      </div>
    );
  }

  const isAuthor = authUser?.user?._id === data.author?._id;
  const hasMultipleMedia = data.mediaUrls && data.mediaUrls.length > 1;
  const currentMediaUrl = data.mediaUrls[activeIndex] || "/assets/images/side-img.svg";
  const isVideo = isVideoUrl(currentMediaUrl);

  return (
    <div className="post_details-container lg:py-10">
      <div className="hidden md:flex max-w-5xl w-full">
        <Button
          onClick={() => navigate(-1)}
          variant="ghost"
          className="shad-button_ghost"
        >
          <img
            src={"/assets/icons/back.svg"}
            alt="back"
            width={24}
            height={24}
          />
          <p className="small-medium lg:base-medium">Back</p>
        </Button>
      </div>

      {isPending || !data ? (
        <Loader />
      ) : (
        <div className="post_details-card">
          <div className="relative lg:w-[48%]">
            {isVideo ? (
              <video 
                src={currentMediaUrl} 
                className="post_details-img" 
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
                className="post_details-img"
              />
            )}
            
            {hasMultipleMedia && (
              <>
                <button 
                  onClick={handlePrevSlide}
                  className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-dark-4/60 p-2 rounded-full z-10"
                >
                  <img src="/assets/icons/arrow-left.svg" alt="Previous" width={24} height={24} />
                </button>
                
                <button 
                  onClick={handleNextSlide}
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-dark-4/60 p-2 rounded-full z-10"
                >
                  <img src="/assets/icons/arrow-right.svg" alt="Next" width={24} height={24} />
                </button>
                
                <div className={`absolute ${isVideo ? 'bottom-16' : 'bottom-4'} left-0 right-0 flex justify-center gap-1 z-10`}>
                  {data.mediaUrls.map((_: string, idx: number) => (
                    <div 
                      key={idx} 
                      className={`w-3 h-3 rounded-full ${activeIndex === idx ? 'bg-primary-500' : 'bg-dark-4/60'}`}
                      onClick={() => setActiveIndex(idx)}
                    />
                  ))}
                </div>
              </>
            )}
          </div>

          <div className="post_details-info">
            <div className="flex-between w-full">
              <Link
                to={`/profile/${data.author._id}`}
                className="flex items-center gap-3"
              >
                <img
                  src={
                    data.author.imageUrl ||
                    "/assets/icons/profile-placeholder.svg"
                  }
                  alt="creator"
                  className="w-8 h-8 lg:w-12 lg:h-12 rounded-full"
                />
                <div className="flex gap-1 flex-col">
                  <p className="base-medium lg:body-bold text-light-1">
                    {data.author.username}
                  </p>
                  <div className="flex-center gap-2 text-light-3">
                    <p className="subtle-semibold lg:small-regular ">
                      {formatTimestamp(parseInt(data.createdAt), 'dateTime')}
                    </p>
                    •
                    <p className="subtle-semibold lg:small-regular">
                      {data.location}
                    </p>
                  </div>
                </div>
              </Link>

              <div className="flex-center gap-4">
                <Link
                  to={`/update-post/${data._id}`}
                  className={`${authUser?.user?._id !== data.author._id && "hidden"}`}
                >
                  <img
                    src={"/assets/icons/edit.svg"}
                    alt="edit"
                    width={24}
                    height={24}
                  />
                </Link>

                <Button
                  onClick={handleDeletePost}
                  variant="ghost"
                  className={`post_details-delete_btn ${
                    authUser?.user?._id !== data.author._id && "hidden"
                  }`}
                >
                  <img
                    src={"/assets/icons/delete.svg"}
                    alt="delete"
                    width={24}
                    height={24}
                  />
                </Button>
              </div>
            </div>

            <hr className="border w-full border-dark-4/80" />

            <div className="flex flex-col flex-1 w-full small-medium lg:base-regular">
              <p>{data.caption}</p>
              <ul className="flex gap-1 mt-2">
                {data?.tags.map((tag: string, index: number) => (
                  <li
                    key={`${tag}${index}`}
                    className="text-light-3 small-regular"
                  >
                    #{tag}
                  </li>
                ))}
              </ul>
              <hr className="border w-full border-dark-4/80" />
            </div>

            <div className="w-full">
              <PostStats post={data}/>
            </div>
          </div>
        </div>
      )}

      <div className="w-full max-w-5xl">
        <hr className="border w-full border-dark-4/80" />

        <h3 className="body-bold md:h3-bold w-full my-10">
          More Related Posts
        </h3>
        <ul className="grid-container">
          <p>No related posts found</p>
        </ul>
      </div>
    </div>
  );
};

export default PostDetails; 