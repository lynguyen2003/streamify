import { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { useLazyQuery, useMutation } from "@apollo/client";
import { toast } from "sonner";

import { GET_POST_BY_ID } from "@/graphql/queries";
import { DELETE_POST } from "@/graphql/mutations";
import { IPost } from "@/types";
import { formatTimestamp } from "@/lib/utils";
import { PostStats, PostComments, Loader } from "@/components/shared";
import { Button } from "@/components/ui";
import { useAppSelector } from "@/hooks/useAppSelector";
import { RootState } from "@/store";

type PostDetailsProps = {
  postProps: IPost;
};

const PostDetails = ({ postProps }: PostDetailsProps) => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const authUser = useAppSelector((state: RootState) => state.auth);
  const [post, setPost] = useState<IPost | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);

  const [getPost, { loading }] = useLazyQuery(GET_POST_BY_ID, {
    variables: { postId: postProps._id },
    fetchPolicy: "network-only",
    onCompleted: (data) => {
      if (data && data.post) {
        setPost(data.post);
      }
    },
    onError: (error) => {
      toast.error("Error loading post: " + error.message);
    }
  });

  const [deletePost] = useMutation(DELETE_POST, {
    onCompleted: () => {
      toast.success("Post deleted successfully");
      navigate("/");
    },
    onError: (error) => {
      toast.error("Error deleting post: " + error.message);
      setIsDeleting(false);
    }
  });

  useEffect(() => {
    if (id) {
      getPost();
    }
  }, [id, getPost]);

  const handleDeletePost = async () => {
    if (!window.confirm("Are you sure you want to delete this post?")) return;
    
    setIsDeleting(true);
    try {
      await deletePost({
        variables: {
          id
        }
      });
    } catch (error) {
      console.error("Error during post deletion:", error);
      setIsDeleting(false);
    }
  };

  const handleNextSlide = () => {
    if (post?.mediaUrls) {
      setActiveIndex((prev) => (prev === post.mediaUrls.length - 1 ? 0 : prev + 1));
    }
  };

  const handlePrevSlide = () => {
    if (post?.mediaUrls) {
      setActiveIndex((prev) => (prev === 0 ? post.mediaUrls.length - 1 : prev - 1));
    }
  };

  if (loading) {
    return (
      <div className="flex-center w-full h-full">
        <Loader />
      </div>
    );
  }

  if (!post) {
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

  const isAuthor = authUser?.user?._id === post.author?._id;
  const hasMultipleMedia = post.mediaUrls && post.mediaUrls.length > 1;

  return (
    <div className="post_details-container">
        <div className="post_details-card">
            <div className="post_details-media">
                {post.mediaUrls && post.mediaUrls.length > 0 && (
                    post.type === 'video' ? (
                    <video 
                        controls 
                        className="post_details-video"
                        src={post.mediaUrls[activeIndex]}
                    />
                    ) : (
                    <img
                        src={post.mediaUrls[activeIndex]}
                        alt="post"
                        className="post_details-image"
                    />
                    )
                )}
                
                {hasMultipleMedia && (
                    <>
                        <button 
                            onClick={handlePrevSlide} 
                            className="carousel-button prev-button"
                            aria-label="Previous image">
                                <img 
                                src="/assets/icons/arrow-left.svg" 
                                alt="Previous" 
                                width={24} 
                                height={24} 
                                />
                        </button>
                        <button 
                            onClick={handleNextSlide} 
                            className="carousel-button next-button"
                            aria-label="Next image">
                                <img 
                                src="/assets/icons/arrow-right.svg" 
                                alt="Next" 
                                width={24} 
                                height={24} 
                                />
                        </button>
                    </>
                )}
                
                {hasMultipleMedia && (
                    <div className="carousel-dots">
                        {post.mediaUrls.map((_, index) => (
                        <span 
                            key={index} 
                            className={`carousel-dot ${index === activeIndex ? "active" : ""}`}
                            onClick={() => setActiveIndex(index)}
                        ></span>
                        ))}
                    </div>
                )}
            </div>

            <div className="post_details-info">
                <div className="flex flex-between w-full">
                    <div className="flex items-center gap-2">
                        <Link to={`/profile/${post.author?._id}`}>
                            <img
                                src={post.author?.imageUrl || "/assets/icons/profile-placeholder.svg"}
                                alt="author"
                                className="w-12 h-12 rounded-full"
                            />
                        </Link>

                        <div className="flex flex-col">
                            <Link to={`/profile/${post.author?._id}`}>
                                <p className="base-medium lg:body-bold text-light-1">{post.author?.username}</p>
                            </Link>
                            <div className="flex-start gap-2 text-light-3">
                                <p className="subtle-semibold lg:small-regular">
                                {formatTimestamp(parseInt(post.createdAt), 'relative')}
                                </p>
                                {post.location && (
                                    <>
                                        •
                                        <p className="subtle-semibold lg:small-regular">
                                        {post.location}
                                        </p>
                                    </>
                                )}
                            </div>
                        </div>
                    </div>

                    {isAuthor && (
                        <div className="flex gap-3">
                            <Link to={`/update-post/${post._id}`} className="w-5 h-5">
                                <img
                                src="/assets/icons/edit.svg"
                                alt="edit"
                                className="cursor-pointer "
                                />
                            </Link>
                            <button 
                                onClick={handleDeletePost} 
                                disabled={isDeleting}
                                className="cursor-pointer">
                                <img
                                src="/assets/icons/delete.svg"
                                alt="delete"
                                />
                            </button>
                        </div>
                    )}
                </div>

                <div className="flex flex-col flex-1 w-full small-medium lg:base-regular">
                    <p>{post.caption}</p>
                    <ul className="flex gap-1 mt-2">
                        {post?.tags.map((tag) => (
                        <li
                            key={`${tag}`}
                            className="text-light-3 small-regular">
                            #{tag}
                        </li>
                        ))}
                    </ul>
                </div>

                <hr className="border w-full border-dark-4/80" />

                <div className="w-full">
                    <PostStats post={post} />
                </div>

                <PostComments 
                    post={post} 
                    onCommentSubmit={() => {
                    // Refresh post to get updated comments
                    return new Promise<void>((resolve) => {
                        getPost();
                        resolve();
                    });
                    }} 
                />
            </div>
        </div>
    </div>
  );
};

export default PostDetails; 