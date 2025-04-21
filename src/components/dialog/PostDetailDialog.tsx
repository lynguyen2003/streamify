import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogFooter,
} from "@/components/ui/dialog";
import { useState, useEffect } from "react";
import { formatTimestamp } from "@/lib/utils";
import { Link, useNavigate } from "react-router-dom";
import { IPost } from "@/types";
import { PostStats, CommentInput, Loader, CommentCard } from "@/components/shared";
import { useAppSelector } from "@/hooks/useAppSelector";
import { RootState } from "@/store";
import { Button } from "../ui";
import { useDeletePostMutation, useGetPostById } from "@/lib/api/react-queries";
import { DialogTitle, DialogTrigger, DialogDescription } from "@radix-ui/react-dialog";
import { toast } from "sonner";

type PostDetailDialogProps = {
    isOpen: boolean;
    onOpenChange: (open: boolean) => void;
    id: string;
};
  
const PostDetailDialog = ({ isOpen, onOpenChange, id }: PostDetailDialogProps) => {
    const navigate = useNavigate();
    const [post, setPost] = useState<IPost>();
    const [activeIndex, setActiveIndex] = useState(0);
    const [replyToUsername, setReplyToUsername] = useState<string>("");
    const [replyToCommentId, setReplyToCommentId] = useState<string>("");
    const authUser = useAppSelector((state: RootState) => state.auth);
    const { data, isPending } = useGetPostById(id);
    const { deletePost, error: deleteError } = useDeletePostMutation();
    const isAuthor = authUser.user?._id === post?.author._id;

    useEffect(() => {
        if (isOpen && data) {
            setPost(data);
            setActiveIndex(0);
            setReplyToUsername("");
            setReplyToCommentId("");
        }
    }, [isOpen, data]);

    const hasMultipleMedia = post?.mediaUrls && post?.mediaUrls.length > 1;

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

    const isVideoUrl = (url: string) => {
        const videoExtensions = ['.mp4', '.webm', '.mov', '.avi', '.mkv', '.gif'];
        return videoExtensions.some(ext => url.toLowerCase().includes(ext));
    };

    const currentMediaUrl = post?.mediaUrls && post.mediaUrls.length > 0 
        ? post.mediaUrls[activeIndex] 
        : "/assets/images/side-img.svg";
    
    const isVideo = currentMediaUrl ? isVideoUrl(currentMediaUrl) : false;

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

    const handleReplyFocus = (username: string, commentId: string) => {
        setReplyToUsername(username);
        setReplyToCommentId(commentId);
        setTimeout(() => {
            const commentInput = document.querySelector('.post-comments input');
            if (commentInput) {
                commentInput.scrollIntoView({ behavior: 'smooth', block: 'center' });
                (commentInput as HTMLInputElement).focus();
            }
        }, 100);
    };

    const handleCancelReply = () => {
        setReplyToUsername("");
        setReplyToCommentId("");
    };

    return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
        <DialogTitle className="sr-only">Post Details</DialogTitle>
        <DialogContent className="w-full h-full lg:h-auto max-w-md lg:max-w-5xl bg-dark-2 lg:p-3 border-dark-4">
        <div className="post_details-container">
            {isPending || !post ? (
                <Loader />
            ) : (
                <div className="post_details-card relative">
                    <DialogClose className="absolute top-2 right-2 flex px-2 py-2 lg:hidden justify-end bg-light-2 rounded-full focus:outline-none">
                        <svg width="16" height="16" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M41.2861 6.71387L24.0001 23.9999L6.70605 41.2939" stroke="#000000" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/>
                            <path d="M41.298 41.298L6.70801 6.70801" stroke="#000000" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                    </DialogClose>
                    
                    <div className="relative lg:w-[48%]">
                        {isVideo ? (
                            <video 
                                src={currentMediaUrl} 
                                className="post_details-media mx-auto" 
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
                                className="post_details-media"
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
                                    {post.mediaUrls.map((_, idx) => (
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
                            to={`/profile/${post?.author._id}`}
                            className="flex items-center gap-3">
                            <img
                                src={
                                    post?.author.imageUrl ||
                                    "/assets/icons/profile-placeholder.svg"
                                }
                                alt="creator"
                                className="w-8 h-8 lg:w-12 lg:h-12 rounded-full"
                            />
                            <div className="flex gap-1 flex-col">
                                <p className="base-medium lg:body-bold text-light-1">
                                    {post?.author.username}
                                </p>
                            <div className="flex-center gap-2 text-light-3">
                                <p className="subtle-semibold lg:small-regular ">
                                    {post?.createdAt ? formatTimestamp(parseInt(post.createdAt), 'auto') : ''}
                                </p>
                                •
                                <p className="subtle-semibold lg:small-regular">
                                    {post?.location}
                                </p>
                            </div>
                            </div>
                        </Link>

                        {isAuthor && (
                            <div className="flex-center gap-4">
                                <Link
                                    to={`/update-post/${post?._id}`}>
                                    <img
                                        src={"/assets/icons/edit.svg"}
                                        alt="edit"
                                        width={24}
                                        height={24}
                                    />
                                </Link>

                                <Dialog>
                                    <DialogTrigger asChild>
                                        <Button
                                            variant="ghost"
                                            className={`post_details-delete_btn`}>
                                            <img
                                                src={"/assets/icons/delete.svg"}
                                                alt="delete"
                                                width={24}
                                                height={24}
                                            />
                                        </Button>
                                    </DialogTrigger>
                                    <DialogContent className="bg-dark-2 p-4">
                                        <DialogDescription>
                                            Are you sure you want to delete this post?
                                        </DialogDescription>
                                        <DialogFooter>
                                            <DialogClose asChild>
                                                <Button variant="outline" className="bg-light-1 text-dark-1">Cancel</Button>
                                            </DialogClose>
                                            <Button variant="destructive" className="bg-red text-light-1" onClick={handleDeletePost}>Delete</Button>
                                        </DialogFooter>
                                    </DialogContent>
                                </Dialog>
                            </div>
                        )}
                        </div>

                        <div className="flex flex-col w-full small-medium lg:base-regular">
                            <p>{post?.caption}</p>
                            <ul className="flex gap-1 mt-2">
                                {post?.tags.map((tag: string, index: number) => (
                                <li
                                    key={`${tag}${index}`}
                                    className="text-light-3 small-regular">
                                    #{tag}
                                </li>
                                ))}
                            </ul>
                        </div>

                        <hr className="border w-full border-dark-4/80" />

                        <div className="w-full flex-1 bg-dark-2 rounded-lg">
                            <CommentCard 
                                post={post} 
                                currentUser={authUser.user || undefined} 
                                onReplyFocus={handleReplyFocus}
                            />
                        </div>

                        <div className="w-full">
                            <PostStats post={post} />
                        </div>

                        <div className="w-full">
                            <CommentInput 
                                post={post} 
                                replyToUsername={replyToUsername} 
                                replyToCommentId={replyToCommentId}
                                onCancelReply={handleCancelReply}
                            />
                        </div>
                    </div>
                </div>
            )}

            <div className="w-full max-w-5xl">
                <hr className="border w-full border-dark-4/80" />

                <h3 className="body-bold md:h3-bold w-full my-5">
                    More Related Posts
                </h3>
                {isPending || !post ? (
                    <Loader />
                ) : (
                    <p className="text-light-3 small-regular my-5">No related posts</p>
                )}
            </div>
        </div>
        </DialogContent>
    </Dialog>
    );
};

export default PostDetailDialog; 