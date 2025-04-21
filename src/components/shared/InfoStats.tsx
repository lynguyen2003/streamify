import { IComment, IUser } from "@/types";
import { formatTimestamp } from "@/lib/utils";

type InfoStatsProps = {
    comment: IComment;
    currentUser?: IUser;
    likes: Record<string, string[]>;
    isCommentLiked: (commentId: string) => boolean;
    handleStartReply: (commentId: string) => void;
    handleLikeComment: (commentId: string) => void;
    handleDeleteComment: (commentId: string) => void;
    isReply?: boolean;
}

const InfoStats = ({ 
    comment, 
    currentUser, 
    likes, 
    isCommentLiked, 
    handleStartReply,
    handleLikeComment,
    handleDeleteComment,
    isReply = false
}: InfoStatsProps) => {
    // Extract the text content and any @mentions
    const renderCommentContent = () => {
        if (!comment.content) return null;
        
        // Find mentions and highlight them
        const mentionRegex = /@(\w+)/g;
        const parts = [];
        let lastIndex = 0;
        let match;
        
        while ((match = mentionRegex.exec(comment.content)) !== null) {
            if (match.index > lastIndex) {
                parts.push(
                    <span key={`text-${lastIndex}`} className="text-light-2">
                        {comment.content.substring(lastIndex, match.index)}
                    </span>
                );
            }
            
            parts.push(
                <span key={`mention-${match.index}`} className="text-primary-500 font-medium">
                    {match[0]}
                </span>
            );
            
            lastIndex = match.index + match[0].length;
        }
        
        if (lastIndex < comment.content.length) {
            parts.push(
                <span key={`text-${lastIndex}`} className="text-light-2">
                    {comment.content.substring(lastIndex)}
                </span>
            );
        }
        
        return parts.length > 0 ? parts : <span className="text-light-2">{comment.content}</span>;
    };

    return (
        <div className={`flex flex-row items-start justify-between w-full gap-2 min-w-0 ${isReply ? 'pl-1' : ''}`}>
            <img
                src={comment.author.imageUrl}
                alt={comment.author.username}
                width={isReply ? 30 : 36}
                height={isReply ? 30 : 36}
                className="rounded-full flex-shrink-0 cursor-pointer mt-1"
            />

            <div className="w-full flex flex-col gap-1 group">
                <div className="flex flex-row items-start gap-2">
                    <p className="small-medium text-light-3 whitespace-nowrap overflow-hidden text-ellipsis hover:text-light-4 cursor-pointer">{comment.author.username}</p>
                    <div className="small-medium break-words">
                        {renderCommentContent()}
                    </div>
                </div>
                
                <div className="flex items-center gap-3">
                    <p className="tiny-medium text-light-3 whitespace-nowrap overflow-hidden">
                        {comment.createdAt ? formatTimestamp(parseInt(comment.createdAt), 'auto') : ''}
                    </p>
                    <button 
                        onClick={() => handleStartReply(comment._id)}
                        className="flex flex-row gap-1 items-center"
                    >
                        <p className="tiny-medium text-light-3 hover:text-light-1 cursor-pointer">Reply</p>
                    </button>
                    {currentUser && comment.author._id === currentUser._id && (
                        <button 
                            onClick={() => handleDeleteComment(comment._id)}
                            className="tiny-medium text-light-3 hover:text-light-1 cursor-pointer"
                        >
                            Delete
                        </button>
                    )}
                </div>
            </div>

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
    );
};

export default InfoStats;
