import { IComment, IPost, IUser } from "@/types";
import { formatTimestamp } from "@/lib/utils";
import { useEffect, useState } from "react";
import Loader from "./Loader";
import { 
    useGetComments, 
    useGetReplies, 
    useReplyCommentMutation, 
    useLikeCommentMutation, 
    useDeleteCommentMutation 
} from "@/lib/api/react-queries";
import { toast } from "sonner";

type CommentCardProps = {
    post: IPost;
    currentUser?: IUser;
}

const CommentCard = ({ post, currentUser }: CommentCardProps) => {
    const [replyText, setReplyText] = useState("");
    const [replyingTo, setReplyingTo] = useState<string | null>(null);
    const [expandedReplies, setExpandedReplies] = useState<Record<string, boolean>>({});
    const [likes, setLikes] = useState<Record<string, string[]>>({});
    const { replyComment, loading: replyCommentLoading } = useReplyCommentMutation();
    const { likeComment } = useLikeCommentMutation();
    const { deleteComment } = useDeleteCommentMutation();

    const { data: commentsData, isLoading: isLoadingComments } = useGetComments(post._id);
    const [activeCommentId, setActiveCommentId] = useState<string | null>(null);
    
    const { data: repliesData } = useGetReplies(
        post._id,
        activeCommentId || ""
    );

    useEffect(() => {
        if (commentsData?.length) {
            const initialLikes: Record<string, string[]> = {};
            commentsData.forEach((comment: IComment) => {
                initialLikes[comment._id] = comment.likes.map(like => like._id);
            });
            setLikes(initialLikes);
        }
    }, [commentsData]);

    const handleReplyComment = (e: React.FormEvent, commentId: string) => {
        e.preventDefault();
        
        replyComment({
            postId: post._id,
            content: replyText,
            parentCommentId: commentId,
            mentions: [],
        });
        setReplyText("");
    };

    const handleLikeComment = (commentId: string) => {
        if (!currentUser) return;
        
        setLikes(prevLikes => {
            const commentLikes = prevLikes[commentId] || [];
            let updatedLikes;
            
            if (commentLikes.includes(currentUser._id)) {
                updatedLikes = commentLikes.filter(id => id !== currentUser._id);
            } else {
                updatedLikes = [...commentLikes, currentUser._id];
            }
            
            return {
                ...prevLikes,
                [commentId]: updatedLikes
            };
        });
        
        likeComment(commentId);
    };

    const isCommentLiked = (commentId: string): boolean => {
        return likes[commentId]?.includes(currentUser?._id || "") || false;
    };

    const toggleReplies = (commentId: string) => {
        setExpandedReplies(prev => {
            const newState = {
                ...prev,
                [commentId]: !prev[commentId]
            };
            
            if (newState[commentId]) {
                setActiveCommentId(commentId);
            } else {
                setActiveCommentId(null);
            }
            
            return newState;
        });
    };

    const handleStartReply = (commentId: string) => {
        setReplyingTo(commentId);
        setReplyText("");
    };

    const handleDeleteComment = (commentId: string) => {
        try {
            deleteComment(commentId);
        } catch (error) {
            toast.error("Failed to delete comment");
        }
    };

    return (
        <div className="w-full">
            <ul className="flex flex-col w-full gap-5 overflow-y-auto custom-scrollbar-hidden px-2">
                {isLoadingComments ? (
                    <Loader size="small" />
                ) : !commentsData?.length ? (
                    <p className="subtle-regular text-light-3">No comments yet</p>
                ) : (
                    commentsData?.map((comment: IComment) => (
                        <li key={comment._id} className="flex flex-col gap-2">
                            <div className="flex flex-row items-start justify-between w-full gap-2 min-w-0">
                                <img
                                    src={comment.author.imageUrl}
                                    alt={comment.author.username}
                                    width={36}
                                    height={36}
                                    className="rounded-full flex-shrink-0 cursor-pointer mt-1"
                                />

                                <div className="w-full flex flex-col gap-1 group">
                                    <div className="flex flex-row items-start gap-2">
                                        <p className="small-medium text-light-3 whitespace-nowrap overflow-hidden text-ellipsis hover:text-light-4 cursor-pointer">{comment.author.username}</p>
                                        <p className="small-medium text-light-2 break-words">{comment.content}</p>
                                    </div>
                                    <div className="flex flex-row gap-3 items-center">
                                        <p className="tiny-medium text-light-3 whitespace-nowrap overflow-hidden">
                                            {comment.createdAt ? formatTimestamp(parseInt(comment.createdAt), 'auto') : ''}
                                        </p>
                                        <button 
                                            onClick={() => handleStartReply(comment._id)}
                                            className="flex flex-row gap-1 items-center"
                                        >
                                            <svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                <path fillRule="evenodd" clipRule="evenodd" d="M5.85103 3.77414C6.02188 3.94499 6.02188 4.222 5.85103 4.39286L3.68122 6.56266L8.45833 6.56266C9.01445 6.56266 9.8389 6.7259 10.5369 7.22845C11.2572 7.74706 11.8125 8.60757 11.8125 9.91683C11.8125 10.1585 11.6166 10.3543 11.375 10.3543C11.1334 10.3543 10.9375 10.1585 10.9375 9.91683C10.9375 8.89275 10.5206 8.29493 10.0256 7.93854C9.50832 7.56609 8.87443 7.43766 8.45833 7.43766L3.68122 7.43766L5.85103 9.60747C6.02188 9.77833 6.02188 10.0553 5.85103 10.2262C5.68017 10.397 5.40316 10.397 5.23231 10.2262L2.31564 7.30952C2.14479 7.13867 2.14479 6.86166 2.31564 6.6908L5.23231 3.77414C5.40316 3.60328 5.68017 3.60328 5.85103 3.77414Z" fill="#FFB620"/>
                                            </svg>
                                            <p className="tiny-medium text-light-2 hover:underline cursor-pointer">Reply</p>
                                        </button>
                                        <p className="hidden group-hover:block tiny-medium text-light-2 hover:underline cursor-pointer" onClick={() => handleDeleteComment(comment._id)}>...</p>
                                    </div>
                                </div>

                                <div className="flex flex-row justify-end gap-1 flex-shrink-0 items-center group">
                                    <button 
                                        onClick={() => handleLikeComment(comment._id)}
                                        className="flex flex-row justify-end gap-1 flex-shrink-0 items-center group"
                                    >
                                        <img 
                                            src={isCommentLiked(comment._id)
                                                ? "/assets/icons/liked.svg" 
                                                : "/assets/icons/like.svg"} 
                                            alt="like" 
                                            width={16} 
                                            height={16} 
                                            className="cursor-pointer group-hover:scale-110 transition-all duration-100"
                                        />
                                        <p className={`tiny-medium ${isCommentLiked(comment._id)
                                            ? "text-primary-500" 
                                            : "text-light-3"}`}>
                                            {likes[comment._id]?.length || 0}
                                        </p>
                                    </button>
                                </div>
                            </div>

                            {replyingTo === comment._id && (
                                <form 
                                    onSubmit={(e) => handleReplyComment(e, comment._id)} 
                                    className="flex gap-2 mt-2 ml-10 items-center"
                                >
                                    {currentUser && (
                                        <img 
                                            src={currentUser.imageUrl} 
                                            alt={currentUser.username} 
                                            className="w-6 h-6 rounded-full flex-shrink-0" 
                                        />
                                    )}
                                    <div className="flex-1 flex items-center rounded-full bg-neutral-800 px-3 overflow-hidden">
                                        <input 
                                            type="text" 
                                            placeholder={`Reply to ${comment.author.username}...`} 
                                            value={replyText}
                                            onChange={(e) => setReplyText(e.target.value)}
                                            className="w-full bg-transparent border-none outline-none py-1.5 text-xs text-light-1"
                                            autoFocus
                                        />
                                    </div>
                                    <button 
                                        type="submit" 
                                        disabled={!replyText.trim() || replyCommentLoading}
                                        className="text-primary-500 text-xs font-medium disabled:opacity-50"
                                    >
                                        {replyCommentLoading ? "Replying..." : "Reply"}
                                    </button>
                                    <button 
                                        type="button"
                                        onClick={() => setReplyingTo(null)}
                                        className="text-light-3 text-xs"
                                    >
                                        Cancel
                                    </button>
                                </form>
                            )}

                            {comment.replies && comment.replies.length > 0 && (
                                <div className="flex flex-row items-center ml-10">
                                    <div className="w-5 h-[1px] bg-light-3 mr-2"></div>
                                    <button 
                                        onClick={() => toggleReplies(comment._id)}
                                        className="flex items-center gap-1 text-xs text-light-3 hover:text-light-2"
                                    >
                                        <span>
                                            {expandedReplies[comment._id] 
                                                ? `Hide replies (${comment.replies.length})` 
                                                : `View replies (${comment.replies.length})`
                                            }
                                        </span>
                                    </button>
                                </div>
                            )}

                            {expandedReplies[comment._id] && comment.replies && (
                                <div className="ml-10 space-y-3">
                                    {repliesData?.map((reply: IComment) => (
                                    <div key={reply._id} className="flex items-start gap-2">
                                        <img 
                                            src={reply.author.imageUrl} 
                                            alt={reply.author.username} 
                                            className="w-6 h-6 rounded-full flex-shrink-0 mt-1" 
                                        />
                                        <div className="flex-1 my-2">
                                            <div className="flex gap-2">
                                                <p className="text-xs font-medium text-light-3">{reply.author.username}</p>
                                                <p className="text-xs text-light-2 break-words">{reply.content}</p>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                                </div>
                            )}
                        </li>
                    ))
                )}
            </ul>
        </div>
    );
};

export default CommentCard;
