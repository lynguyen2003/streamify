import { IComment, IPost, IUser } from "@/types";
import { useEffect, useState, useRef } from "react";
import Loader from "./Loader";
import InfoStats from "./InfoStats";
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
    onReplyFocus?: (username: string, commentId: string) => void;
}

const CommentCard = ({ post, currentUser, onReplyFocus }: CommentCardProps) => {
    const [replyText, setReplyText] = useState("");
    const [replyingTo, setReplyingTo] = useState<string | null>(null);
    const [replyingToUser, setReplyingToUser] = useState<string>("");
    const [expandedReplies, setExpandedReplies] = useState<Record<string, boolean>>({});
    const [likes, setLikes] = useState<Record<string, string[]>>({});
    const { replyComment, loading: replyCommentLoading } = useReplyCommentMutation();
    const { likeComment } = useLikeCommentMutation();
    const { deleteComment } = useDeleteCommentMutation();
    const replyInputRef = useRef<HTMLInputElement>(null);

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

    useEffect(() => {
        if (replyingTo && replyInputRef.current) {
            replyInputRef.current.focus();
        }
    }, [replyingTo]);

    const handleReplyComment = (e: React.FormEvent, commentId: string) => {
        e.preventDefault();
        
        if (!replyText.trim()) return;
        
        replyComment({
            postId: post._id,
            content: replyText,
            parentCommentId: commentId,
            mentions: []
        });
        
        setReplyText("");
        setReplyingTo(null);

        setExpandedReplies(prev => ({
            ...prev,
            [commentId]: true
        }));
        setActiveCommentId(commentId);
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
        const comment = commentsData?.find((c: IComment) => c._id === commentId) || 
                      repliesData?.find((r: IComment) => r._id === commentId);
        
        if (comment) {
            const username = comment.author.username;
            setReplyingToUser(username);
            
            if (onReplyFocus) {
                onReplyFocus(username, commentId);
                setReplyingTo(null);
            } else {
                setReplyText(`@${username} `);
                setReplyingTo(commentId);
            }
        }
    };

    const handleDeleteComment = (commentId: string) => {
        try {
            deleteComment(commentId);
        } catch (error) {
            toast.error("Failed to delete comment");
        }
    };

    const handleCancelReply = () => {
        setReplyingTo(null);
        setReplyText("");
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
                            <InfoStats 
                                comment={comment}
                                currentUser={currentUser}
                                likes={likes}
                                isCommentLiked={isCommentLiked}
                                handleStartReply={handleStartReply}
                                handleLikeComment={handleLikeComment}
                                handleDeleteComment={handleDeleteComment}
                            />

                            {replyingTo === comment._id && (
                                <form 
                                    onSubmit={(e) => handleReplyComment(e, comment._id)} 
                                    className="flex gap-2 mt-2 ml-10 items-center relative"
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
                                            placeholder={`Reply to @${replyingToUser}...`} 
                                            value={replyText}
                                            onChange={(e) => setReplyText(e.target.value)}
                                            className="w-full bg-transparent border-none outline-none py-1.5 text-xs text-light-1"
                                            ref={replyInputRef}
                                        />
                                    </div>
                                    <div className="flex gap-2">
                                        <button 
                                            type="submit" 
                                            disabled={!replyText.trim() || replyCommentLoading}
                                            className="text-primary-500 text-xs font-medium disabled:opacity-50"
                                        >
                                            {replyCommentLoading ? "Replying..." : "Reply"}
                                        </button>
                                        <button 
                                            type="button"
                                            onClick={handleCancelReply}
                                            className="text-light-3 text-xs"
                                        >
                                            Cancel
                                        </button>
                                    </div>
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
                                <div className="ml-10 pl-2 space-y-3 border-l-2 border-dark-4">
                                    {repliesData?.map((reply: IComment) => (
                                        <div key={reply._id} className="flex flex-col">
                                            <InfoStats 
                                                comment={reply}
                                                currentUser={currentUser}
                                                likes={likes}
                                                isCommentLiked={isCommentLiked}
                                                handleStartReply={handleStartReply}
                                                handleLikeComment={handleLikeComment}
                                                handleDeleteComment={handleDeleteComment}
                                                isReply={true}
                                            />
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
